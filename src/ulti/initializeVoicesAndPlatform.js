// Initialize voice and platform information once
function initializeVoicesAndPlatform() {
  return new Promise((resolve) => {
    if ("speechSynthesis" in window) {
      const getVoices = () => {
        const voices = window.speechSynthesis.getVoices();
        if (voices.length === 0) {
          // Wait for the voices to be loaded
          window.speechSynthesis.onvoiceschanged = () => {
            resolve(testVoices());
          };
        } else {
          resolve(testVoices());
        }
      };

      const findVoices = () => {
        const voices = window.speechSynthesis.getVoices();
        let imale = null;
        let ifemale = null;

        voices.forEach((voice, index) => {
          if (
            voice.lang.includes("en-US") ||
            voice.lang.includes("en-GB") ||
            voice.lang.includes("en-UK")
          ) {
            console.log(voice.name, index);
            if (isRunningOnWindows()) {
              if (voice.name.includes("Male")) {
                imale = index;
              }
              if (voice.name.includes("Female")) {
                ifemale = index;
              }
            }
            if (isIOS() || isRunningOnMac()) {
              if (voice.name.includes("Daniel")) {
                imale = index;
              }
              if (voice.name.includes("Karen")) {
                ifemale = index;
              }
            }
            if (isAndroid() && voice.lang.includes("en-GB")) {
              imale = index;
              ifemale = index;
            }
          }
        });

        return { imale: imale, ifemale: ifemale };
      };

      const testVoices = () => {
        const result1 = findVoices();
        const result2 = findVoices();

        if (JSON.stringify(result1) === JSON.stringify(result2)) {
          return result1;
        } else {
          const result3 = findVoices();
          if (JSON.stringify(result1) === JSON.stringify(result3)) {
            return result1;
          } else if (JSON.stringify(result2) === JSON.stringify(result3)) {
            return result2;
          } else {
            return result3;
          }
        }
      };

      getVoices();
    } else {
      resolve({ imale: null, ifemale: null });
    }
  });
}

// Check if the platform is iOS
function isIOS() {
  const userAgent = navigator.userAgent.toLowerCase();
  return /iphone|ipad|ipod/.test(userAgent);
}

// Check if the platform is Android
function isAndroid() {
  const userAgent = navigator.userAgent.toLowerCase();
  return /android/.test(userAgent);
}

// Check if the platform is Windows
function isRunningOnWindows() {
  const userAgent = navigator.userAgent.toLowerCase();
  return /windows/.test(userAgent);
}

// Check if the platform is Mac
function isRunningOnMac() {
  const userAgent = navigator.userAgent.toLowerCase();
  return /macintosh|mac os x/.test(userAgent);
}

export default initializeVoicesAndPlatform;
