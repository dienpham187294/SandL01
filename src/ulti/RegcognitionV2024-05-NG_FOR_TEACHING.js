import React, { useEffect, useState } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

const Dictaphone = ({}) => {
  const { interimTranscript, transcript, listening, resetTranscript } =
    useSpeechRecognition({});
  const [styles, setStyles] = useState({
    border: "1px solid black",
    padding: "10px",
    borderRadius: "5px",
  });
  const startListening = () => {
    SpeechRecognition.startListening({
      continuous: true,
      language: "en-US",
    });
  };

  const stopListening = () => {
    SpeechRecognition.stopListening();
  };

  return (
    <div className="container row mt-4" style={styles}>
      <div className="col-4">
        <button
          className="btn btn-info"
          onClick={() => {
            resetTranscript();
          }}
        >
          Clear
        </button>{" "}
        <button
          className="btn btn-info"
          onClick={() => {
            stopListening();
          }}
        >
          Stop
        </button>{" "}
        <button
          className="btn btn-info"
          onClick={() => {
            startListening();
          }}
        >
          Start
        </button>
      </div>
      <div className="col-8">
        {" "}
        <i>{listening ? "đang lắng nghe . . ." : null}</i>
        <h1 style={{}}>{transcript}</h1>{" "}
      </div>
    </div>
  );
};

export default Dictaphone;
