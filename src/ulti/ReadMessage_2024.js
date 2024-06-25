let timeC = Date.now();
let imale, ifemale, ios;

function setButtonState(buttonId, isEnabled) {
  const button = document.getElementById(buttonId);

  if (button) {
    button.disabled = !isEnabled;
    button.style.cursor = isEnabled ? "pointer" : "not-allowed";
    button.style.opacity = isEnabled ? "1" : "0.1";
  }
}

function enableButton() {
  setButtonState("RegButton", true);
  setButtonState("BtnFsp", true);
}

function disableButton() {
  setButtonState("RegButton", false);
  setButtonState("BtnFsp", false);
}

function countAndSplitSentences(text) {
  const sentences = text.match(/[^\.!\?]+[\.!\?]+/g);
  return sentences || [text];
}

export default async function ReadMessage(ObjVoices, text, voiceNum) {
  if (Date.now() - timeC < 200 || text === "") {
    return;
  }

  imale = ObjVoices.imale;
  ifemale = ObjVoices.ifemale;

  try {
    if (imale === undefined || ifemale === undefined) {
      speak(text);
      return;
    }

    let voiceIndex = voiceNum === 1 ? ifemale : imale;
    const sentences = countAndSplitSentences(text);

    // If there are more than 2 sentences, split and read them one by one
    if (sentences.length > 1) {
      const speakSentences = (index) => {
        if (index >= sentences.length) {
          enableButton();
          timeC = Date.now();
          return;
        }

        let msg = new SpeechSynthesisUtterance();
        let voices = window.speechSynthesis.getVoices();
        msg.voice = voices[voiceIndex];
        msg.rate = 0.9;
        msg.text = sentences[index];

        msg.onstart = () => {
          if (index === 0) disableButton();
        };

        msg.onend = () => {
          speakSentences(index + 1);
        };

        msg.onerror = (error) => {
          console.error("Error in speech synthesis: ", error);

          enableButton();
        };

        speechSynthesis.speak(msg);
      };

      speakSentences(0);
    } else {
      // If there are 2 or fewer sentences, read them as a whole
      let msg = new SpeechSynthesisUtterance();
      let voices = window.speechSynthesis.getVoices();
      msg.voice = voices[voiceIndex];
      msg.rate = 0.9;
      msg.text = text;

      msg.onstart = () => {
        disableButton();
      };

      msg.onend = () => {
        enableButton();
        timeC = Date.now();
      };

      msg.onerror = (error) => {
        console.error("Error in speech synthesis: ", error);
        enableButton();
      };

      speechSynthesis.speak(msg);
    }
  } catch (error) {
    console.error("Error in ReadMessage: ", error);
    enableButton();
  }
}

function speak(text) {
  if ("speechSynthesis" in window) {
    const utterance = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices();

    utterance.lang = "en-GB";
    utterance.voice = voices[imale];

    utterance.onstart = () => {
      disableButton();
    };

    utterance.onend = () => {
      enableButton();
      timeC = Date.now();
    };

    utterance.onerror = (error) => {
      console.error("Error in speech synthesis: ", error);
      enableButton();
    };

    window.speechSynthesis.speak(utterance);
  }
}
