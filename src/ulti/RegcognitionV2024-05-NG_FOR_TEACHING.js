import React, { useEffect, useState, useCallback, useMemo } from "react";
import { socket } from "../App";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import LinkAPI from "./T0_linkApi";
import read_by_Tts from "../ulti/readMessage_TtsServer";
const Dictaphone = ({ CMDlist }) => {
  // State management
  const [numberTry, setNumberTry] = useState(0);
  const [SimilarCheckSet, setSimilarCheckSet] = useState("");
  const [cmdApartChat, setCmdApartChat] = useState("");
  const [idDinhDanh] = useState(() => localStorage.getItem("dinhDanh"));
  const [nameDinhDanh] = useState(
    () => localStorage.getItem("nameDinhDanh") || ""
  );
  const [resultSt, setresultSt] = useState("");

  const [sttProcessing, setsttProcessing] = useState(false);
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
    if (interimTranscript === "" && transcript !== "" && CMDlist?.trim()) {
      try {
        let obj1 = {
          transcript: transcript,
          CMDlist: CMDlist,
        };
        let requestOptions = {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(obj1),
        };
        // console.log(LinkAPI + "test", requestOptions);
        setsttProcessing(true);
        fetch(LinkAPI + "reg-Analyze", requestOptions)
          .then((res) => res.json())
          .then((json) => {
            setresultSt(json.data.resultSt);
            setCmdApartChat(json.data.CmdApartChat);
            setSimilarCheckSet(json.data.similaritySetCheckRs.join(" | "));
          })
          .finally(() => {
            setsttProcessing(false);
          });
      } catch (error) {
        console.log(error);
      }
    }
  }, [interimTranscript, transcript, CMDlist]);

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
      text: cmdApartChat + " | " + SimilarCheckSet,
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
        <br />
        {!listening ? (
          <button
            style={{ padding: "10px", borderRadius: "5px" }}
            onClick={() => {
              read_by_Tts(CMDlist);
            }}
          >
            Nghe máy đọc
          </button>
        ) : null}
      </div>

      {/* Right column - Results display */}
      <div className="col-8">
        <h5 style={{ color: "blue" }}>
          {listening ? "Đang bật - Hãy nói . . ." : "Đang tắt."}
        </h5>
        {listening ? (
          <div>
            {ViewRes(resultSt, interimTranscript)}
            <h5 style={{ color: "blue" }}>
              (2)
              <i id="interimRes"></i>
            </h5>
            {sttProcessing ? (
              <h5>Đang xử lý!</h5>
            ) : (
              <button className="btn btn-danger" onClick={handleSendResults}>
                XONG GỬI KẾT QUẢ
              </button>
            )}
            <hr />
            <div style={{ color: "purple" }}> {SimilarCheckSet}</div> <hr />
            <i>Chỉ cần (1) hoặc (2) đúng là đã đủ chuẩn thực hành.</i>
          </div>
        ) : (
          <div style={disabledAreaStyles}>
            (1)
            {ViewRes(resultSt, transcript)}
            <hr />
            <div style={{ color: "purple" }}> {SimilarCheckSet}</div>
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

function ViewRes(resultSt = [], interimTranscript = "") {
  // Use React hooks for animation effect
  const [prevInterim, setPrevInterim] = React.useState("");
  const [isTransitioning, setIsTransitioning] = React.useState(false);
  const [prevResultLength, setPrevResultLength] = React.useState(0);

  // Effect to handle smooth transitions when interim disappears
  React.useEffect(() => {
    // When interim changes from something to empty
    if (prevInterim && !interimTranscript) {
      setIsTransitioning(true);
      setTimeout(() => setIsTransitioning(false), 300); // Match transition duration
    }

    // Track previous interim value
    setPrevInterim(interimTranscript);

    // Track result length changes
    if (resultSt && resultSt.length !== prevResultLength) {
      setPrevResultLength(resultSt?.length || 0);
    }
  }, [interimTranscript, resultSt, prevInterim, prevResultLength]);

  try {
    // Define transition styles for smoother updates
    const containerStyle = {
      fontFamily: "'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
      lineHeight: 1.6,
      fontSize: "30px",
      padding: "12px",
      background: "#fafafa",
      borderRadius: "8px",
      boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
      transition: "all 0.3s ease-in-out",
    };

    // Style for interim text with smooth fade effect
    const interimStyle = {
      fontStyle: "italic",
      color: "#9e9e9e",
      marginLeft: "8px",
      opacity: interimTranscript ? 0.8 : isTransitioning ? 0.4 : 0,
      transition: "opacity 0.3s ease-in-out, transform 0.25s ease-out",
      position: "relative",
      display: "inline-block",
      minWidth: interimTranscript || isTransitioning ? "8px" : "0",
      minHeight: interimTranscript || isTransitioning ? "1em" : "0",
      transform: interimTranscript ? "translateY(0)" : "translateY(5px)",
      maxWidth: "100%",
      whiteSpace: "pre-wrap",
      overflow: "hidden",
    };

    // Common styles for result items with transitions
    const itemBaseStyle = {
      marginRight: "4px",
      padding: "0 2px",
      display: "inline-block",
      transition:
        "color 0.3s ease, transform 0.2s ease, opacity 0.3s ease, background-color 0.3s ease",
      animation: "fadeIn 0.3s ease-in-out",
    };

    // Add keyframe animation for new items
    const keyframes = `
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(8px); }
        to { opacity: 1; transform: translateY(0); }
      }
      
      @keyframes highlightNew {
        0% { background-color: rgba(3, 169, 244, 0.15); }
        100% { background-color: transparent; }
      }
    `;

    return (
      <div style={containerStyle}>
        <style>{keyframes}</style>
        (1)
        {resultSt &&
          resultSt.map((item, index) => {
            const key = `res-${index}`;
            // Determine if this is a new item
            const isNew = index >= prevResultLength && prevResultLength > 0;
            const animationStyle = isNew
              ? {
                  animation: "fadeIn 0.4s ease-out, highlightNew 1.2s ease-out",
                  animationFillMode: "both",
                }
              : {};

            if (item.stt === false) {
              // Unmatched items - gray italic
              return (
                <i
                  key={key}
                  style={{
                    ...itemBaseStyle,
                    ...animationStyle,
                    color: "#9e9e9e",
                    borderBottom: "1px dotted #d0d0d0",
                    opacity: 0.9,
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
                    ...itemBaseStyle,
                    ...animationStyle,
                    color: "#1565c0",
                    fontWeight: "500",
                    opacity: 1,
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
                    ...itemBaseStyle,
                    ...animationStyle,
                    fontStyle: "italic",
                    color: "#00796b",
                    textDecoration: "underline",
                    textDecorationStyle: "line",
                    textDecorationColor: "#80cbc4",
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
                    ...itemBaseStyle,
                    ...animationStyle,
                    color: "#424242",
                  }}
                >
                  {item.textuse}
                </span>
              );
            }
          })}
        {/* Interim transcript with animation effect */}
        <span style={interimStyle}>
          {interimTranscript || (isTransitioning ? prevInterim : "")}
        </span>
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
          transition: "all 0.3s ease",
        }}
      >
        Error rendering results
      </div>
    );
  }
}
