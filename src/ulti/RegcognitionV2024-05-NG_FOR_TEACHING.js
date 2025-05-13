import React, { useEffect, useState, useCallback, useMemo } from "react";
import { socket } from "../App";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
let fnSet = [];
let fnSetRate = {};
const Dictaphone = ({ CMDlist }) => {
  // State management
  const [numberTry, setNumberTry] = useState(0);
  const [cmdApart, setCmdApart] = useState([]);
  const [cmdApartChat, setCmdApartChat] = useState("");
  const [idDinhDanh] = useState(() => localStorage.getItem("dinhDanh"));
  const [nameDinhDanh] = useState(
    () => localStorage.getItem("nameDinhDanh") || ""
  );
  const [resultSt, setresultSt] = useState("");
  // Memoize commands to prevent unnecessary re-creation
  const commands = useMemo(
    () => [
      {
        command: [CMDlist],
        callback: (command) => {
          try {
            const interimRes = document.getElementById("interimRes");
            if (interimRes) interimRes.innerText = command;
          } catch (error) {
            console.error("Error updating interim result:", error);
          }
        },
        isFuzzyMatch: true,
        fuzzyMatchingThreshold: 0.5,
        bestMatchOnly: true,
      },
      {
        command: CMDlist.split(" "),
        callback: (command, n, i) => {
          try {
            // setCmdApart((prev) => [...prev, { command, origin: n }]);
            setCmdApart(command);
            fnSet.push({
              command: command.toLocaleLowerCase(),
              origin: n.toLocaleLowerCase(),
              i,
            });
            console.log(
              command.toLocaleLowerCase() + "~" + n.toLocaleLowerCase()
            );
          } catch (error) {
            console.error("Error setting command apart:", error);
          }
        },
        isFuzzyMatch: true,
        fuzzyMatchingThreshold: 0.2,
        bestMatchOnly: true,
      },
    ],
    [CMDlist]
  );

  // Speech recognition hook with memoized commands
  const { interimTranscript, transcript, listening, resetTranscript } =
    useSpeechRecognition({ commands });

  // Reset states when number of tries changes
  useEffect(() => {
    setCmdApart(null);
    fnSet = [];
    setresultSt("");
    fnSetRate = {};
  }, [numberTry]);

  // Reset number of tries and function set when command list changes
  useEffect(() => {
    setNumberTry(0);
    setCmdApart(null);
    fnSet = [];
    setresultSt("");
    fnSetRate = {};
  }, [CMDlist]);

  useEffect(() => {
    if (!transcript) return;

    try {
      let updatedResult = transcript.toLocaleLowerCase();
      fnSet.forEach(({ command, origin, i }) => {
        const cmdLower = command.toLowerCase();
        const transcriptLower = transcript.toLowerCase();
        if (!transcriptLower.includes(cmdLower)) {
          updatedResult = updatedResult
            .split(origin)
            .join("(" + origin + "~" + command + ")");
          // setCmdApartChat(Math.floor(i * 100) + "%");
          fnSetRate[command] = origin + " ~ " + Math.floor(i * 100) + "%";
        }
      });
      setCmdApartChat(JSON.stringify(fnSetRate));
      setresultSt(updatedResult);
    } catch (error) {
      console.error("Error processing commands in transcript:", error);
    }
  }, [transcript, cmdApart]);

  // Speech recognition control functions
  const startListening = useCallback(() => {
    SpeechRecognition.startListening({
      continuous: true,
      language: "en-US",
    });
  }, []);

  const stopListening = useCallback(() => {
    SpeechRecognition.stopListening();
  }, []);

  // Send results handler
  const handleSendResults = useCallback(() => {
    stopListening();
    socket.emit("message", {
      text: resultSt + " | " + (cmdApartChat || ""),
      time:
        "KQTH_" + (nameDinhDanh || (idDinhDanh ? idDinhDanh.slice(0, 4) : "")),
    });
    resetTranscript();
  }, [
    transcript,
    cmdApart,
    resultSt,
    nameDinhDanh,
    idDinhDanh,
    stopListening,
    resetTranscript,
  ]);

  // Reset handler
  const handleReset = useCallback(() => {
    resetTranscript();
    setNumberTry((prev) => prev + 1);
  }, [resetTranscript]);

  // UI styles
  const containerStyles = {
    border: "1px solid black",
    padding: "10px",
    borderRadius: "5px",
  };

  const disabledAreaStyles = {
    borderRadius: "10px",
    opacity: 0.5,
    backgroundColor: "gray",
    pointerEvents: "none",
    cursor: "not-allowed",
  };

  return (
    <div className="container row mt-4" style={containerStyles}>
      {/* Left column - Controls and instructions */}
      <div className="col-4">
        <button className="btn btn-info" onClick={handleReset}>
          Xóa nội dung (1)
        </button>{" "}
        <button
          id="stopListenBTN"
          className="btn btn-danger m-1"
          onClick={stopListening}
        >
          Tắt
        </button>{" "}
        <button className="btn btn-primary m-1" onClick={startListening}>
          Bắt đầu
        </button>
        <hr />
        <hr />
        <h4>Rèn luyện câu:</h4>
        <h2>
          <b style={{ color: "blue" }}>{CMDlist}</b>
        </h2>
        <b>Bấm bắt đầu và đọc câu này lên để rèn luyện khả năng ghép âm.</b>
      </div>

      {/* Right column - Results display */}
      <div className="col-8">
        <h5 style={{ color: "blue" }}>
          {listening ? "Đang bật - Hãy nói . . ." : "Đang tắt."}
        </h5>
        {listening ? (
          <div>
            <h2>
              (1)
              {resultSt !== "" ? resultSt : transcript}
            </h2>
            <h5 style={{ color: "blue" }}>
              (2)
              <i>{interimTranscript}</i> <i id="interimRes"></i>
            </h5>
            <button className="btn btn-danger" onClick={handleSendResults}>
              XONG GỬI KẾT QUẢ
            </button>
            <hr />
            <i>Chỉ cần (1) hoặc (2) đúng là đã đủ chuẩn thực hành.</i>
          </div>
        ) : (
          <div style={disabledAreaStyles}>
            <h1>(1) {resultSt !== "" ? resultSt : transcript}</h1>
            <h5 style={{ color: "blue" }}>
              (2)
              <i>{interimTranscript}</i> <i id="interimRes"></i>
            </h5>
            <button className="btn btn-danger" disabled>
              XONG GỬI KẾT QUẢ
            </button>
            <hr />
            <i>Chỉ cần (1) hoặc (2) đúng là đã đủ chuẩn thực hành.</i>
          </div>
        )}
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
