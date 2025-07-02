import { openDB } from "idb";
import LinkAPI from "./T0_linkApi";

// Cấu hình
const DB_CONFIG = {
  name: "TTS-Audio-DB",
  version: 1,
  storeName: "audios",
  maxEntries: 100, // Giới hạn số lượng audio
  maxSize: 50 * 1024 * 1024, // 50MB
};

// Khởi tạo DB
const initDB = async () => {
  return await openDB(DB_CONFIG.name, DB_CONFIG.version, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(DB_CONFIG.storeName)) {
        const store = db.createObjectStore(DB_CONFIG.storeName);
        // Tạo index cho timestamp để dễ dàng xóa các entry cũ
        store.createIndex("timestamp", "timestamp");
      }
    },
  });
};

// Tính dung lượng hiện tại của DB
const getCurrentDBSize = async (db) => {
  const tx = db.transaction(DB_CONFIG.storeName, "readonly");
  const store = tx.objectStore(DB_CONFIG.storeName);
  const keys = await store.getAllKeys();

  let totalSize = 0;
  for (const key of keys) {
    const data = await store.get(key);
    if (data && data.blob) {
      totalSize += data.blob.size;
    }
  }

  return { totalSize, entryCount: keys.length };
};

// Xóa các entry cũ nhất
const cleanOldEntries = async (db, removeCount = 10) => {
  const tx = db.transaction(DB_CONFIG.storeName, "readwrite");
  const store = tx.objectStore(DB_CONFIG.storeName);
  const index = store.index("timestamp");

  // Lấy các entry cũ nhất
  const oldEntries = await index.getAll(null, removeCount);

  // Xóa các entry cũ
  for (const entry of oldEntries) {
    const cursor = await index.openCursor();
    if (cursor && cursor.value.timestamp === entry.timestamp) {
      await cursor.delete();
    }
  }

  await tx.complete;
  console.log(`Đã xóa ${oldEntries.length} audio cũ khỏi cache`);
};

// Quản lý dung lượng DB
const manageDBSize = async (db, newBlobSize) => {
  const { totalSize, entryCount } = await getCurrentDBSize(db);

  // Kiểm tra giới hạn số lượng
  if (entryCount >= DB_CONFIG.maxEntries) {
    await cleanOldEntries(db, Math.ceil(DB_CONFIG.maxEntries * 0.2)); // Xóa 20%
  }

  // Kiểm tra giới hạn dung lượng
  if (totalSize + newBlobSize > DB_CONFIG.maxSize) {
    const needToFree = totalSize + newBlobSize - DB_CONFIG.maxSize;
    const estimatedEntriesToRemove =
      Math.ceil(needToFree / (totalSize / entryCount)) + 5;
    await cleanOldEntries(db, estimatedEntriesToRemove);
  }
};

// Phát từ Blob
const playFromBlob = (blob) => {
  const audioUrl = URL.createObjectURL(blob);
  const audioElement = document.createElement("audio");
  audioElement.src = audioUrl;
  audioElement.autoplay = true;
  audioElement.style.display = "none";
  document.body.appendChild(audioElement);

  audioElement.onended = () => {
    URL.revokeObjectURL(audioUrl);
    audioElement.remove();
  };

  audioElement.onerror = () => {
    console.error("Error playing audio");
    URL.revokeObjectURL(audioUrl);
    audioElement.remove();
  };
};

// Lưu audio vào DB với metadata
const saveAudioToDB = async (db, key, blob) => {
  // Quản lý dung lượng trước khi lưu
  await manageDBSize(db, blob.size);

  const audioData = {
    blob: blob,
    timestamp: Date.now(),
    size: blob.size,
    created: new Date().toISOString(),
  };

  await db.put(DB_CONFIG.storeName, audioData, key);
};

// Hàm chính
export default async function read_by_Tts(text, fnReadClient) {
  const db = await initDB();
  const key = text.trim().toLowerCase();

  try {
    // 1. Kiểm tra trong IndexedDB
    const cachedData = await db.get(DB_CONFIG.storeName, key);
    if (cachedData && cachedData.blob) {
      // Cập nhật timestamp để đánh dấu là được sử dụng gần đây
      cachedData.timestamp = Date.now();
      await db.put(DB_CONFIG.storeName, cachedData, key);
      playFromBlob(cachedData.blob);
      console.log("Phát audio từ cache");
      return;
    }

    // 2. Fetch từ server với timeout 3 giây
    console.log("Đang tải audio từ server...");

    // Tạo AbortController để hủy request khi timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 giây

    try {
      const response = await fetch(LinkAPI + "tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
        signal: controller.signal, // Thêm signal để có thể hủy request
      });

      // Clear timeout nếu request thành công
      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const blob = await response.blob();

      // 3. Lưu vào IndexedDB với quản lý dung lượng
      await saveAudioToDB(db, key, blob);

      // 4. Phát audio
      playFromBlob(blob);
      console.log("Đã lưu và phát audio mới từ server");
    } catch (fetchError) {
      clearTimeout(timeoutId);

      // Kiểm tra nếu là lỗi timeout hoặc abort
      if (fetchError.name === "AbortError") {
        console.log("Request timeout sau 3 giây, chuyển sang dùng hàm client");
        fnReadClient();
        return;
      }

      // Ném lại lỗi khác để được xử lý ở catch ngoài
      throw fetchError;
    }
  } catch (error) {
    console.error("TTS playback error:", error);
    console.log("Gặp lỗi từ server, chuyển sang dùng hàm client");
    fnReadClient();
  }
}

// Hàm tiện ích để kiểm tra trạng thái DB (optional)
export const getDBStats = async () => {
  try {
    const db = await initDB();
    const stats = await getCurrentDBSize(db);
    return {
      ...stats,
      maxSize: DB_CONFIG.maxSize,
      maxEntries: DB_CONFIG.maxEntries,
      sizePercentage: ((stats.totalSize / DB_CONFIG.maxSize) * 100).toFixed(2),
      entryPercentage: (
        (stats.entryCount / DB_CONFIG.maxEntries) *
        100
      ).toFixed(2),
    };
  } catch (error) {
    console.error("Error getting DB stats:", error);
    return null;
  }
};
