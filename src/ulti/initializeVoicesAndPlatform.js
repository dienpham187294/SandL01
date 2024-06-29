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
        // voice.name.includes("David") ||voice.name.includes("Sandy")
        const findVoices = () => {
          const voices = window.speechSynthesis.getVoices();
          let imale = null;
          let ifemale = null;
          if (isRunningOnWindows()) {
            console.log("On window");
            voices.forEach((voice, index) => {
              if (voice.lang.includes("en-US")) {
                if (voice.name.includes("David")) {
                  imale = index;
                }
                if (voice.name.includes("Zira")) {
                  ifemale = index;
                }
              }
              if (imale !== null && ifemale !== null) {
                return { imale, ifemale };
              }
            });
          }
          if (isRunningOnMac() || isIOS()) {
            console.log("On IOS");
            voices.forEach((voice, index) => {
              if (
                voice.lang.includes("en-GB") ||
                voice.lang.includes("en-AU")
              ) {
                if (voice.name.includes("Daniel")) {
                  imale = index;
                }
                if (voice.name.includes("Karen")) {
                  ifemale = index;
                }
              }
              if (imale !== null && ifemale !== null) {
                return { imale, ifemale };
              }
            });
          }
          if (isAndroid()) {
            console.log("On android");
            voices.forEach((voice, index) => {
              if (voice.lang.includes("en-GB")) {
                imale = index;
                ifemale = index;
              }
              if (imale !== null && ifemale !== null) {
                return { imale, ifemale };
              }
            });
          }
          return { imale, ifemale };
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
        setTimeout(() => {
          initializeVoicesAndPlatform(n + 1);
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
