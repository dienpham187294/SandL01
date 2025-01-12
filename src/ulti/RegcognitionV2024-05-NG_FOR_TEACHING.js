import React, { useEffect, useState } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
let commands = [];

const Dictaphone = ({ CMDlist }) => {
  const { interimTranscript, transcript, listening, resetTranscript } =
    useSpeechRecognition({ commands });

  useEffect(() => {
    commands = [
      {
        command: [CMDlist],
        callback: (command, n, i) => {
          try {
            const interimRes = document.getElementById("interimRes");
            interimRes.innerText = command;
          } catch (error) {}
        },
        isFuzzyMatch: true,
        fuzzyMatchingThreshold: 0.5,
        bestMatchOnly: true,
      },
    ];
  }, [CMDlist]);
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
          Xóa nội dung (1)
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
        <hr />
        <h4>Rèn luyện câu:</h4>
        <h2>
          <b style={{ color: "blue" }}>{CMDlist}</b>
        </h2>
        <b>Bấm bắt đầu và đọc câu này lên để rèn luyện khả năng ghép âm.</b>
     
      </div>
      <div className="col-8">
        {" "}
        <h5 style={{ color: "blue" }}>
          {listening ? "Đang bật - Hãy nói . . ." : "Đang tắt."}
        </h5>
        <h1 style={{}}>(1){transcript}</h1>{" "}
        <h5 style={{ color: "blue" }}>
          {" "}
          (2)
          <i>{interimTranscript}</i> <i id="interimRes"></i>
        </h5>
        <hr />
        <i> Chỉ cần (1) hoặc (2) đúng là đã đủ chuẩn thực hành.</i>
        <br />
        ***
        <br />
        <i>
          - Đọc chuẩn (1) sẽ khó hơn, là cái chuẩn chúng ta hướng đến trong dài
          hạn, yêu cầu rèn luyện lâu dài.
        </i>{" "}
        <br />
        <b>- Tuy nhiên đọc chuẩn (2) đã đủ để thực hành.</b> <br />
        <i>
          - Thực hành xử lý 1 bài tổng thể nhanh chóng trong thời gian ngắn quan
          trọng hơn là chuẩn chỉnh 100% từng câu từng chữ.
        </i>
        <br />
        <i>
          - Rèn luyện là quá trình lâu dài, không cần phải hoàn hảo ngay từ đầu.
          Trong quá trình rèn luyện, chúng ta sẽ nhận phản hồi và chỉnh sửa dần
          dần.
        </i>{" "}
        <hr />
        Chúc các anh chị, các bạn được nhiều lợi lạc.
      </div>
    </div>
  );
};

export default Dictaphone;

