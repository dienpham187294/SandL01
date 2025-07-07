/**
 * Tìm kiếm và khởi tạo giọng nói tiếng Anh phù hợp cho người Việt Nam
 * Ưu tiên giọng Anh-Anh (British) và giọng rõ ràng, dễ hiểu
 */
function initializeVoicesAndPlatform() {
  console.log("Khởi tạo giọng nói cho người Việt...");

  const voiceConfig = {
    male: null,
    female: null,
    maleIndex: -1,
    femaleIndex: -1,
  };

  if (!("speechSynthesis" in window)) {
    console.warn("Trình duyệt không hỗ trợ Text-to-Speech");
    return voiceConfig;
  }

  const initVoices = () => {
    const voices = window.speechSynthesis.getVoices();

    if (voices.length === 0) {
      // Đợi voices được load
      window.speechSynthesis.onvoiceschanged = () => {
        const loadedVoices = window.speechSynthesis.getVoices();
        if (loadedVoices.length > 0) {
          selectOptimalVoices(loadedVoices);
        }
      };
      return;
    }

    selectOptimalVoices(voices);
  };

  const selectOptimalVoices = (voices) => {
    console.log(`Tìm thấy ${voices.length} giọng nói`);

    // Danh sách ưu tiên giọng nói phù hợp với người Việt
    const voicePriorities = getVoicePriorities();

    // Tìm giọng nam và nữ tốt nhất
    voiceConfig.maleIndex = findBestVoice(voices, voicePriorities.male);
    voiceConfig.femaleIndex = findBestVoice(voices, voicePriorities.female);

    // Lưu reference đến voice object
    if (voiceConfig.maleIndex !== -1) {
      voiceConfig.male = voices[voiceConfig.maleIndex];
      console.log(
        `Giọng nam được chọn: ${voiceConfig.male.name} (${voiceConfig.male.lang})`
      );
    }

    if (voiceConfig.femaleIndex !== -1) {
      voiceConfig.female = voices[voiceConfig.femaleIndex];
      console.log(
        `Giọng nữ được chọn: ${voiceConfig.female.name} (${voiceConfig.female.lang})`
      );
    }

    // Fallback nếu không tìm thấy
    if (voiceConfig.maleIndex === -1 && voiceConfig.femaleIndex === -1) {
      console.warn("Không tìm thấy giọng nói phù hợp, sử dụng fallback");
      setFallbackVoices(voices);
    }
  };

  const getVoicePriorities = () => {
    const platform = detectPlatform();
    console.log(`Nền tảng: ${platform}`);

    // Ưu tiên giọng Anh-Anh cho người Việt vì rõ ràng và chuẩn
    const priorities = {
      male: [
        // Giọng Anh-Anh (British) - ưu tiên cao nhất
        { names: ["Daniel", "Oliver", "Arthur"], langs: ["en-GB"], score: 10 },
        // Giọng Úc - rõ ràng, dễ hiểu
        { names: ["Lee", "Gordon"], langs: ["en-AU"], score: 9 },
        // Giọng Mỹ - quen thuộc
        { names: ["David", "Mark", "Alex"], langs: ["en-US"], score: 8 },
        // Giọng Canada
        { names: ["Daniel"], langs: ["en-CA"], score: 7 },
        // Giọng khác
        { names: ["Thomas"], langs: ["en-GB", "en-US"], score: 6 },
      ],
      female: [
        // Giọng Anh-Anh (British) - ưu tiên cao nhất
        { names: ["Kate", "Serena", "Stephanie"], langs: ["en-GB"], score: 10 },
        // Giọng Úc - rõ ràng
        { names: ["Karen", "Catherine"], langs: ["en-AU"], score: 9 },
        // Giọng Mỹ - quen thuộc
        { names: ["Zira", "Susan", "Samantha"], langs: ["en-US"], score: 8 },
        // Giọng Canada
        { names: ["Tessa"], langs: ["en-CA"], score: 7 },
        // Giọng khác
        { names: ["Hazel"], langs: ["en-GB", "en-US"], score: 6 },
      ],
    };

    // Điều chỉnh ưu tiên theo nền tảng
    if (platform === "windows") {
      // Windows thường có David/Zira tốt
      priorities.male.unshift({
        names: ["David"],
        langs: ["en-US"],
        score: 11,
      });
      priorities.female.unshift({
        names: ["Zira"],
        langs: ["en-US"],
        score: 11,
      });
    } else if (platform === "macos" || platform === "ios") {
      // macOS/iOS có giọng chất lượng cao
      priorities.male.unshift({
        names: ["Daniel"],
        langs: ["en-GB"],
        score: 11,
      });
      priorities.female.unshift({
        names: ["Kate", "Serena"],
        langs: ["en-GB"],
        score: 11,
      });
    }

    return priorities;
  };

  const findBestVoice = (voices, priorities) => {
    let bestIndex = -1;
    let bestScore = -1;

    voices.forEach((voice, index) => {
      for (const priority of priorities) {
        const nameMatch = priority.names.some((name) =>
          voice.name.toLowerCase().includes(name.toLowerCase())
        );
        const langMatch = priority.langs.some((lang) =>
          voice.lang.toLowerCase().includes(lang.toLowerCase())
        );

        if (nameMatch && langMatch) {
          if (priority.score > bestScore) {
            bestScore = priority.score;
            bestIndex = index;
          }
          break; // Tìm thấy match, không cần kiểm tra priority tiếp theo
        }
      }
    });

    return bestIndex;
  };

  const setFallbackVoices = (voices) => {
    // Tìm bất kỳ giọng tiếng Anh nào
    const englishVoices = voices.filter((voice) =>
      voice.lang.toLowerCase().startsWith("en")
    );

    if (englishVoices.length > 0) {
      // Ưu tiên giọng có "default" hoặc "local"
      const defaultVoice = englishVoices.find(
        (voice) => voice.default || voice.localService
      );

      if (defaultVoice) {
        const index = voices.indexOf(defaultVoice);
        voiceConfig.maleIndex = index;
        voiceConfig.male = defaultVoice;
        console.log(`Fallback giọng được chọn: ${defaultVoice.name}`);
      } else {
        // Chọn giọng tiếng Anh đầu tiên
        voiceConfig.maleIndex = voices.indexOf(englishVoices[0]);
        voiceConfig.male = englishVoices[0];
        console.log(`Fallback giọng được chọn: ${englishVoices[0].name}`);
      }
    }
  };

  const detectPlatform = () => {
    const ua = navigator.userAgent.toLowerCase();

    if (/windows/.test(ua)) return "windows";
    if (/iphone|ipad|ipod/.test(ua)) return "ios";
    if (/android/.test(ua)) return "android";
    if (/macintosh|mac os x/.test(ua)) return "macos";
    if (/linux/.test(ua)) return "linux";

    return "unknown";
  };

  // Khởi tạo
  initVoices();

  return voiceConfig;
}

/**
 * Utility function để test giọng nói
 */
function testVoice(
  voiceConfig,
  text = "Hello, this is a test message for Vietnamese learners."
) {
  if (!voiceConfig.male && !voiceConfig.female) {
    console.error("Không có giọng nói nào được cấu hình");
    return;
  }

  const utterance = new SpeechSynthesisUtterance(text);

  // Sử dụng giọng nam làm mặc định
  const selectedVoice = voiceConfig.male || voiceConfig.female;
  utterance.voice = selectedVoice;

  // Cài đặt tối ưu cho người Việt
  utterance.rate = 0.9; // Chậm hơn một chút để dễ hiểu
  utterance.pitch = 1.0; // Giọng tự nhiên
  utterance.volume = 1.0; // Âm lượng tối đa

  console.log(`Đang test giọng: ${selectedVoice.name}`);
  window.speechSynthesis.speak(utterance);
}

/**
 * Hàm tiện ích để lấy danh sách tất cả giọng nói có sẵn
 */
function listAllVoices() {
  const voices = window.speechSynthesis.getVoices();
  console.log("Tất cả giọng nói có sẵn:");
  voices.forEach((voice, index) => {
    console.log(
      `${index}: ${voice.name} (${voice.lang}) - Default: ${voice.default}, Local: ${voice.localService}`
    );
  });
  return voices;
}

export default initializeVoicesAndPlatform;
export { testVoice, listAllVoices };
