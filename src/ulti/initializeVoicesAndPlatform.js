function initializeVoicesAndPlatform() {
  console.log("Tìm objRead");
  let res = { imale: null, ifemale: null };

  if ("speechSynthesis" in window) {
    const getVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length === 0) {
        window.speechSynthesis.onvoiceschanged = () => {
          findVoices(window.speechSynthesis.getVoices());
        };
      } else {
        findVoices(voices);
      }
    };

    const findVoices = (voices) => {
      const setVoiceIndices = (
        maleName,
        femaleName,
        langFilter1,
        langFilter2
      ) => {
        voices.forEach((voice, index) => {
          if (
            voice.lang.includes(langFilter1) ||
            voice.lang.includes(langFilter2)
          ) {
            if (voice.name.includes(maleName)) {
              res.imale = index;
            }
            if (voice.name.includes(femaleName)) {
              res.ifemale = index;
            }
          }
        });
      };

      if (isRunningOnWindows()) {
        console.log("On Windows");
        setVoiceIndices("David", "Zira", "en-US", "en-US");
      } else if (isRunningOnMac() || isIOS()) {
        console.log("On iOS");
        setVoiceIndices("Daniel", "Karen", "en-GB", "en-AU");
      } else if (isAndroid()) {
        console.log("On Android");
        setVoiceIndices(" ", " ", "en-GB", "en-AU");
      }
    };

    getVoices();
  }

  return res;
}

// Check if the platform is iOS
function isIOS() {
  return /iphone|ipad|ipod/.test(navigator.userAgent.toLowerCase());
}

// Check if the platform is Android
function isAndroid() {
  return /android/.test(navigator.userAgent.toLowerCase());
}

// Check if the platform is Windows
function isRunningOnWindows() {
  return /windows/.test(navigator.userAgent.toLowerCase());
}

// Check if the platform is Mac
function isRunningOnMac() {
  return /macintosh|mac os x/.test(navigator.userAgent.toLowerCase());
}

export default initializeVoicesAndPlatform;
