function initializeVoicesAndPlatform(n) {
  if (n > 1) {
    return "null";
  }

  if (n <= 1) {
    return new Promise((resolve) => {
      if ("speechSynthesis" in window) {
        const getVoices = () => {
          const voices = window.speechSynthesis.getVoices();
          if (voices.length === 0) {
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

          const setVoiceIndices = (maleName, femaleName, langFilter) => {
            voices.forEach((voice, index) => {
              if (voice.lang.includes(langFilter)) {
                if (voice.name.includes(maleName)) {
                  imale = index;
                }
                if (voice.name.includes(femaleName)) {
                  ifemale = index;
                }
              }
              if (imale !== null && ifemale !== null) {
                return true;
              }
            });
          };

          if (isRunningOnWindows()) {
            console.log("On Windows");
            setVoiceIndices("David", "Zira", "en-US");
          } else if (isRunningOnMac() || isIOS()) {
            console.log("On iOS");
            setVoiceIndices("Daniel", "Karen", "en-GB");
          } else if (isAndroid()) {
            console.log("On Android");
            setVoiceIndices("Daniel", "Karen", "en-GB");
          }

          return { imale, ifemale };
        };

        const testVoices = () => {
          const result1 = findVoices();
          if (result1.imale === null && result1.ifemale === null) {
            setTimeout(() => {
              resolve(testVoices());
            }, 2000);
          } else {
            return result1;
          }
        };

        getVoices();
      } else {
        setTimeout(() => {
          initializeVoicesAndPlatform(n);
        }, 1000);
      }
    });
  }
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
