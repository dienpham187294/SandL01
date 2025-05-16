import { openDB } from "idb";
import LinkAPI from "./T0_linkApi";

// Khởi tạo DB
const initDB = async () => {
  return await openDB("TTS-Audio-DB", 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains("audios")) {
        db.createObjectStore("audios");
      }
    },
  });
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

export default async function read_by_Tts(text) {
  const db = await initDB();
  const key = text.trim().toLowerCase();

  try {
    // 1. Kiểm tra trong IndexedDB
    const cachedBlob = await db.get("audios", key);
    if (cachedBlob) {
      playFromBlob(cachedBlob);
      return;
    }

    // 2. Fetch từ server nếu chưa có
    const response = await fetch(LinkAPI + "tts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });

    const blob = await response.blob();

    // 3. Lưu vào IndexedDB
    await db.put("audios", blob, key);

    // 4. Phát audio
    playFromBlob(blob);
  } catch (error) {
    console.error("TTS playback error:", error);
  }
}
