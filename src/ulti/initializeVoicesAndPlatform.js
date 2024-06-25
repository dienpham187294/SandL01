let imale, ifemale;

// Initialize voice and platform information once
function initializeVoicesAndPlatform() {
  return new Promise((resolve) => {
    if ("speechSynthesis" in window) {
      const getVoices = () => {
        const voices = window.speechSynthesis.getVoices();
        if (voices.length === 0) {
          // Wait for the voices to be loaded
          window.speechSynthesis.onvoiceschanged = () => {
            resolve(findVoices());
          };
        } else {
          resolve(findVoices());
        }
      };

      const findVoices = () => {
        const voices = window.speechSynthesis.getVoices();
        voices.forEach((voice, index) => {
          if (voice.lang.includes("en-")) {
            if (isRunningOnWindows()) {
              if (voice.name.includes("English Male")) {
                imale = index;
              }
              if (voice.name.includes("English Female")) {
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
