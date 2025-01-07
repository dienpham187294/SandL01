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
          Xóa nội dung
        </button>{" "}
        <button
          id="stopListenBTN"
          className="btn btn-danger m-1"
          onClick={() => {
            stopListening();
          }}
        >
          Tắt
        </button>{" "}
        <button
          className="btn btn-primary m-1"
          onClick={() => {
            startListening();
          }}
        >
          Bắt đầu
        </button>
      </div>
      <div className="col-8">
        {" "}
        <h5 style={{ color: "blue" }}>
          {listening ? "Đang bật - Hãy nói . . ." : "Đang tắt."}
        </h5>
        <h1 style={{}}>{transcript}</h1>{" "}
      </div>
    </div>
  );
};

export default Dictaphone;
