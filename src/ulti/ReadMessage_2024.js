let imale, ifemale;

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
  // Split the text based on sentence-ending punctuation marks
  const sentences = text.match(/[^?!.;]+[?!.;]*/g);

  // Return the sentences array or an array with the original text if no matches found
  return sentences || [text];
}
export default async function ReadMessage(ObjVoices, text, voiceNum) {
  // voiceNum: 1 for female, 0 for male
  console.log("read", ObjVoices, voiceNum, 0.85);

  if (text === "") {
    return;
  }

  imale = ObjVoices.imale;
  ifemale = ObjVoices.ifemale;

  try {
    if (imale === undefined || ifemale === undefined) {
      return;
    }

    let voiceIndex = voiceNum === 1 ? ifemale : imale;
    const sentences = countAndSplitSentences(text);

    const speakSentences = (index) => {
      if (index >= sentences.length) {
        enableButton();
        return;
      }

      let msg = new SpeechSynthesisUtterance();
      let voices = window.speechSynthesis.getVoices();
      msg.voice = voices[voiceIndex];
      msg.rate = 0.85;
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
  } catch (error) {
    console.error("Error in ReadMessage function: ", error);
  }
}
