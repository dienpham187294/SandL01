let imale, ifemale;

// Function to set the state of a button
function setButtonState(buttonId, isEnabled) {
  const button = document.getElementById(buttonId);

  if (button) {
    button.disabled = !isEnabled;
    button.style.cursor = isEnabled ? "pointer" : "not-allowed";
    button.style.opacity = isEnabled ? "1" : "0.1";
  }
}

// Enable specific buttons
function enableButton() {
  setButtonState("RegButton", true);
  setButtonState("BtnFsp", true);
}

// Disable specific buttons
function disableButton() {
  setButtonState("RegButton", false);
  setButtonState("BtnFsp", false);
}

// Function to count and split sentences in a given text
function countAndSplitSentences(text) {
  const sentences = text.match(/[^?!.;]+[?!.;]*/g);
  return sentences || [text];
}

// Check function execution frequency
function checkFunctionExecution(functionName) {
  const lastExecutionTime = localStorage.getItem(functionName);
  const currentTime = Date.now();

  if (lastExecutionTime && currentTime - lastExecutionTime < 1000) {
    return false;
  }

  localStorage.setItem(functionName, currentTime);
  return true;
}

// Main function to read messages
export default async function ReadMessage(ObjVoices, text, voiceNum) {
  if (!checkFunctionExecution("ReadMessage")) {
    console.warn("ReadMessage called too frequently.");
    return;
  }

  if (!text) {
    return;
  }

  imale = ObjVoices.imale;
  ifemale = ObjVoices.ifemale;

  if (imale === undefined || ifemale === undefined) {
    return;
  }

  const voices = window.speechSynthesis.getVoices();

  // Ensure voices are loaded before proceeding
  if (!voices.length) {
    window.speechSynthesis.onvoiceschanged = () =>
      ReadMessage(ObjVoices, text, voiceNum);
    return;
  }

  let voiceIndex = voiceNum === 1 ? ifemale : imale;
  const sentences = countAndSplitSentences(text);

  const speakSentences = (index, sentenceLength) => {
    let msg = new SpeechSynthesisUtterance();
    msg.voice = voices[voiceIndex];
    msg.rate = 0.85;
    msg.text = sentences[index];

    msg.onstart = () => {
      if (index === 0) disableButton();
    };

    msg.onend = () => {
      if (index >= sentenceLength - 1) {
        enableButton();
      } else {
        speakSentences(index + 1, sentenceLength);
      }
    };

    msg.onerror = (error) => {
      console.error("Error in speech synthesis: ", error);
      enableButton();
    };

    speechSynthesis.speak(msg);
  };

  speakSentences(0, sentences.length);
}
