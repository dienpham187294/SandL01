import React, { useEffect, useCallback } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

let commands = [];
let timeoutId;

const Dictaphone = ({ fn_Xuly, CMDList, fn_speakSlowly, fn_speakAgain }) => {
  // Sử dụng useCallback để đảm bảo resetTimeout không thay đổi
  const resetTimeout = useCallback(() => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      stopListening();
    }, 60000); // 60 giây
  }, []);

  // Sử dụng useCallback cho các hàm callback để tránh khởi tạo lại không cần thiết
  const handleXuly = useCallback(
    (command, type) => {
      fn_Xuly(command, type);
      resetTimeout();
    },
    [fn_Xuly, resetTimeout]
  );

  const handleSpeakSlowly = useCallback(() => {
    fn_speakSlowly();
    resetTimeout();
  }, [fn_speakSlowly, resetTimeout]);

  const handleSpeakAgain = useCallback(() => {
    fn_speakAgain();
    resetTimeout();
  }, [fn_speakAgain, resetTimeout]);

  useEffect(() => {
    commands = [
      {
        command: CMDList || ["I am a teacher"],
        callback: (command) => {
          handleXuly(command, "Done");
        },
        isFuzzyMatch: true,
        fuzzyMatchingThreshold: 0.65,
        bestMatchOnly: true,
      },
      {
        command: ["clear", "reset"],
        callback: ({ resetTranscript }) => {
          resetTranscript();
          resetTimeout();
        },
      },
      {
        command: "stop",
        callback: stopListening,
      },
      {
        command: [
          "Can you say that again?",
          "Can you repeat that?",
          "Could you say it again, please?",
        ],
        callback: handleSpeakAgain,
        isFuzzyMatch: true,
        fuzzyMatchingThreshold: 0.65,
        bestMatchOnly: true,
      },
      {
        command: [
          "Can you speak slowly?",
          "Can you say it slowly?",
          "Speak slower, please.",
          "Please repeat slowly.",
        ],
        callback: handleSpeakSlowly,
        isFuzzyMatch: true,
        fuzzyMatchingThreshold: 0.65,
        bestMatchOnly: true,
      },
    ];
  }, [CMDList, handleXuly, handleSpeakAgain, handleSpeakSlowly, resetTimeout]);

  const startListening = () => {
    SpeechRecognition.startListening({
      continuous: true,
      language: "en-US",
    });
    resetTimeout(); // Bắt đầu đếm ngược khi bắt đầu lắng nghe
  };

  const stopListening = () => {
    SpeechRecognition.stopListening();
    clearTimeout(timeoutId); // Xóa timeout khi dừng lắng nghe
  };

  const { interimTranscript, transcript, listening, resetTranscript } =
    useSpeechRecognition({ commands });

  return (
    <div
      className="row"
      style={{
        width: "100vw",
        height: "10vh",
        padding: "15px",
      }}
    >
      <div className="col-4">
        {" "}
        {listening ? (
          <span style={{ color: "blue" }}>
            Phần mềm đang lắng nghe. Bấm để tắt:{" "}
          </span>
        ) : (
          <b style={{ color: "red" }}>
            Phần mềm lắng nghe đang tắt. Bấm để bật:{" "}
          </b>
        )}
        {listening ? (
          <button
            className="btn btn-danger p-2"
            style={buttonStyle}
            onClick={stopListening}
          >
            <i className="bi bi-mic-mute"></i>
          </button>
        ) : (
          <button
            className="btn btn-primary p-2"
            style={buttonStyle}
            onClick={() => {
              startListening();
              resetTranscript();
            }}
          >
            <i className="bi bi-mic"></i>
          </button>
        )}{" "}
      </div>
      <div className="col-3">
        {" "}
        <b>{transcript}</b>
      </div>
      <div className="col-1">
        {" "}
        <button
          className="btn btn-primary p-2 ml-1"
          style={smallButtonStyle}
          onClick={() => {
            handleXuly(transcript, "transcript");
          }}
        >
          <i className="bi bi-check2-square"></i>
        </button>
        <button
          className="btn btn-info p-2 ml-1"
          style={smallButtonStyle}
          onClick={resetTranscript}
        >
          <i className="bi bi-arrow-clockwise"></i>
        </button>{" "}
      </div>
      <div className="col-4">
        {" "}
        <i>{interimTranscript}</i>
      </div>

      <button
        style={{ display: "none" }}
        id="resetCMD"
        onClick={resetTranscript}
      ></button>
    </div>
  );
};

export default Dictaphone;

// Styles
const micButtonStyle = (listening) => ({
  // position: "fixed",
  // top: "60px",
  // right: "20px",
  // minWidth: "50px",
  // width: "fit-content",
  // height: "60px",
  // backgroundColor: "#f0f0f0",
  // boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1), 0px 1px 3px rgba(0, 0, 0, 0.08)",
  // borderRadius: "15px",
  // zIndex: 1,
});

const buttonStyle = {
  // width: "50px",
  // height: "50px",
  // borderRadius: "50%",
};

const transcriptStyle = {
  // position: "fixed",
  // top: "0",
  // left: "20px",
  // width: "90%",
  // height: "60px",
  // // zIndex: 5,
  // lineHeight: "bottom",
  // textAlign: "center",
};

const smallButtonStyle = {
  // width: "50px",
  // height: "50px",
  // borderRadius: "50%",
  // scale: "0.8",
};
