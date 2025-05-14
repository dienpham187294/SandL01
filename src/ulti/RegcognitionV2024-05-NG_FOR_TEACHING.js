import React, { useEffect, useState, useCallback, useMemo } from "react";
import { socket } from "../App";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import stringSimilarity from "string-similarity";
import levenshtein from "js-levenshtein";

const Dictaphone = ({ CMDlist }) => {
  // State management
  const [numberTry, setNumberTry] = useState(0);

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
    ],
    [CMDlist]
  );

  // Speech recognition hook with memoized commands
  const { interimTranscript, transcript, listening, resetTranscript } =
    useSpeechRecognition({ commands });

  // Reset states when number of tries changes
  useEffect(() => {
    setresultSt("");
  }, [numberTry]);

  // Reset number of tries and function set when command list changes
  useEffect(() => {
    setNumberTry(0);
    setresultSt("");
  }, [CMDlist]);

  useEffect(() => {
    if (!transcript || !CMDlist?.trim()) return;

    try {
      const updatedResultSetsObj = transcript
        .toLowerCase()
        .split(" ")
        .map((text) => ({ stt: false, mark: 0, text }));

      const CMDlistSetObj = CMDlist.toLowerCase()
        .split(" ")
        .map((text) => ({ stt: false, text }));

      // So khớp từ đơn lẻ
      updatedResultSetsObj.forEach((word) => {
        for (const cmd of CMDlistSetObj) {
          if (
            !cmd.stt &&
            stringSimilarity.compareTwoStrings(word.text, cmd.text) > 0.7
          ) {
            word.stt = cmd.stt = true;
            break;
          }
        }
      });

      const str1Set = groupByStt(updatedResultSetsObj);
      const str2set = groupBySttFalseOnly(CMDlistSetObj).map((text) => ({
        stt: false,
        text,
      }));

      // So khớp cụm từ
      str1Set.forEach((item) => {
        str2set.forEach((cmd) => {
          if (cmd.stt) return;

          const sim = stringSimilarity.compareTwoStrings(item.text, cmd.text);
          const diff = levenshtein(item.text, cmd.text);
          const per = (item.text.length - diff) / item.text.length;
          const percent = Math.floor(Math.max(sim, per) * 100) + "%";

          if (sim > 0.3 || per > 0.2) {
            item.stt = "check";
            item.textuse = `${item.text} ~${cmd.text} ~${percent}`;
            cmd.stt = true;
          }
        });
      });

      setresultSt(str1Set);
      setCmdApartChat(str1Set.map((e) => e.textuse || e.text).join(" "));
    } catch (err) {
      console.error("Error processing commands in transcript:", err);
    }
  }, [transcript, CMDlist]);

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
      text: cmdApartChat,
      time:
        "KQTH_" + (nameDinhDanh || (idDinhDanh ? idDinhDanh.slice(0, 4) : "")),
    });
    resetTranscript();
  }, [
    transcript,
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
        <h2
          style={{
            userSelect: "none",
            WebkitUserSelect: "none",
            MozUserSelect: "none",
          }}
          onCopy={(e) => e.preventDefault()}
        >
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
            (1)
            {resultSt !== "" ? ViewRes(resultSt) : transcript}
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
            (1)
            {resultSt !== "" ? ViewRes(resultSt) : transcript}
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

function groupByStt(array) {
  if (!array || array.length === 0) return [];

  const result = [];

  let currentGroup = [];
  let currentStt = array[0].stt;

  for (const item of array) {
    if (item.stt === currentStt) {
      currentGroup.push(item.text);
    } else {
      result.push({
        stt: currentStt,
        text: currentGroup.join(" "),
        textuse: currentGroup.join(" "),
      });
      currentGroup = [item.text];
      currentStt = item.stt;
    }
  }

  // Thêm nhóm cuối cùng
  if (currentGroup.length > 0) {
    result.push({
      stt: currentStt,
      text: currentGroup.join(" "),
      textuse: currentGroup.join(" "),
    });
  }

  return result;
}

function groupBySttFalseOnly(array) {
  if (!array || array.length === 0) return [];

  const result = [];

  let currentGroup = [];
  let currentStt = array[0].stt;

  for (const item of array) {
    if (item.stt === currentStt) {
      currentGroup.push(item.text);
    } else {
      if (currentStt === false && currentGroup.length > 0) {
        result.push(currentGroup.join(" "));
      }
      currentGroup = [item.text];
      currentStt = item.stt;
    }
  }

  // Xử lý nhóm cuối cùng nếu là false
  if (currentStt === false && currentGroup.length > 0) {
    result.push(currentGroup.join(" "));
  }

  return result;
}

function ViewRes(resultSt) {
  try {
    return (
      <div
        style={{
          fontFamily: "'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
          lineHeight: 1.6,
          fontSize: "30px",
          padding: "12px",
          background: "#fafafa",
          borderRadius: "8px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
        }}
      >
        {resultSt.map((item, index) => {
          const key = `res-${index}`;

          if (item.stt === false) {
            // Unmatched items - gray italic
            return (
              <i
                key={key}
                style={{
                  color: "#9e9e9e",
                  marginRight: "4px",
                  padding: "0 2px",
                  borderBottom: "1px dotted #d0d0d0",
                  // fontSize: "0.95rem",
                  display: "inline-block",
                }}
              >
                {item.textuse}
              </i>
            );
          } else if (item.stt === true) {
            // Matched items - bold blue
            return (
              <span
                key={key}
                style={{
                  color: "#1565c0",
                  fontWeight: "500",
                  marginRight: "4px",
                  padding: "0 2px",
                  display: "inline-block",
                }}
              >
                {item.textuse}
              </span>
            );
          } else if (item.stt === "check") {
            // Checked items - underlined teal
            return (
              <span
                key={key}
                style={{
                  // fontSize: "1.15rem",
                  fontStyle: "italic",
                  color: "#00796b",
                  textDecoration: "underline",
                  textDecorationStyle: "dotted",
                  textDecorationColor: "#80cbc4",
                  marginRight: "4px",
                  padding: "0 2px",
                  display: "inline-block",
                }}
              >
                {item.textuse}
              </span>
            );
          } else {
            // Default - normal dark text
            return (
              <span
                key={key}
                style={{
                  color: "#424242",
                  marginRight: "4px",
                  padding: "0 2px",
                  display: "inline-block",
                }}
              >
                {item.textuse}
              </span>
            );
          }
        })}
      </div>
    );
  } catch (error) {
    return (
      <div
        style={{
          color: "#d32f2f",
          padding: "8px",
          borderLeft: "3px solid #d32f2f",
          backgroundColor: "#ffebee",
        }}
      >
        Error rendering results
      </div>
    );
  }
}
