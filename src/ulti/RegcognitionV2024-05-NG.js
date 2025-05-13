import React, { useEffect, useState } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import stringSimilarity from "string-similarity";
import ReadMessage from "./ReadMessage_2024";

const Dictaphone = ({
  getSTTDictaphone,
  setGetSTTDictaphone,
  CMDlist,
  GENDER,
  setScore,
  addElementIfNotExist,
  ObjVoices,
  Lang,
  regRate,
  regRate_01,
  setStartSTT,
  setMessage,
}) => {
  // Define speech commands
  const commands = [
    {
      command: CMDlist.flatMap((cmdGroup) => cmdGroup.qs),
      callback: (command) => {
        setotherGetInterim(command);
      },
      isFuzzyMatch: true,
      fuzzyMatchingThreshold: regRate,
      bestMatchOnly: true,
    },
    
  ];

  // Speech recognition hook
  const { transcript, resetTranscript } = useSpeechRecognition({
    commands,
    continuous: true,
    interimResults: true,
  });

  const [otherGetInterim, setotherGetInterim] = useState("");
  const [styles, setStyles] = useState({
    opacity: 0,
    height: "100px",
    transition: "opacity 1s ease, height 1s ease, width 1s ease",
    position: "fixed",
    backgroundColor: "white",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    border: "1px solid black",
    borderRadius: "5px",
    cursor: "pointer",
    padding: "1rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 5,
  });

  // Handle component mount animation
  useEffect(() => {
    setStyles((prevStyles) => ({
      ...prevStyles,
      opacity: 1,
      height: "600px",
    }));
  }, []);

  // Start listening when getSTTDictaphone changes
  useEffect(() => {
    if (getSTTDictaphone) {
      startListening();
    }
  }, [getSTTDictaphone]);

  const startListening = () => {
    SpeechRecognition.startListening({
      continuous: true,
      language: Lang || "en-US",
    });
  };

  const stopListening = () => {
    SpeechRecognition.stopListening();
  };

  // Process the speech input
  const processInput = (input) => {
    if (!input) return;

    setMessage(input);
    const processedInput = removeDuplicates(input);

    // Try different matching approaches
    const match =
      findMostSimilarQuestion(input, CMDlist, regRate_01) ||
      findMostSimilarQuestion(processedInput, CMDlist, regRate_01) ||
      findMostSimilarQuestion(otherGetInterim, CMDlist, regRate_01);

    if (!match) {
      // No match found, request clarification
      ReadMessage(
        ObjVoices,
        "Sorry, what did you say?",
        GENDER,
        GENDER === 1 ? [{ id: "sorryFemale" }] : [{ id: "sorryMale" }]
      );
    } else {
      // Handle the match
      if (match.aw) {
        const answer = getRandomElementFromArray(match.aw);
        ReadMessage(
          ObjVoices,
          answer,
          GENDER,
          match.aw01 ? [{ id: match.aw01 }] : undefined
        );
      }

      // Handle actions
      if (match.action) {
        if (match.action[0] === "WRONG") {
          setScore((s) => s - 1.5);
        } else {
          addElementIfNotExist(match.action[0]);
        }
      }
    }

    setGetSTTDictaphone(false);
  };

  const isProcessing = transcript !== "" && otherGetInterim === "";

  return (
    <div className="container" id="div_of_dictaphone">
      <div className="mb-3">
        <button className="btn btn-danger me-2" onClick={resetTranscript}>
          Xóa nội dung vừa nói
        </button>
        <button
          disabled={isProcessing}
          className="btn btn-info me-2"
          onClick={() => {
            stopListening();
            processInput(transcript);
          }}
        >
          <i>
            {isProcessing
              ? "Đang xử lý, chờ 3s."
              : "Sử dụng nội dung vừa nói (1) và (2)"}
          </i>
        </button>
        <button
          className="btn btn-danger "
          onClick={() => setGetSTTDictaphone(false)}
        >
          Thoát
        </button>
      </div>
      <h3>(1) {transcript || <i>Hãy nói gì đó . . . </i>}</h3>
      <h5 style={{ color: "blue" }}>
        (2){" "}
        <i id="interimRes">
          {isProcessing ? "Đang xử lý, chờ 3s." : otherGetInterim}
        </i>
      </h5>
      <button
        id="stopListenBTN"
        style={{ display: "none" }}
        onClick={stopListening}
      >
        StopListen
      </button>
      <hr />
      <i>Chỉ cần (1) hoặc (2) đúng là đã đủ chuẩn thực hành.</i>
      <br />
      ***
      <br />
      <i>
        - Đọc chuẩn (1) sẽ khó hơn, là cái chuẩn chúng ta hướng đến trong dài
        hạn, yêu cầu rèn luyện lâu dài.
      </i>
      <br />
      <b>- Tuy nhiên đọc chuẩn (2) đã đủ để thực hành.</b>
      <br />
      <i>
        - Thực hành xử lý 1 bài tổng thể nhanh chóng trong thời gian ngắn quan
        trọng hơn là chuẩn chỉnh 100% từng câu từng chữ.
      </i>
      <br />
      <i>
        - Rèn luyện là quá trình lâu dài, không cần phải hoàn hảo ngay từ đầu.
        Trong quá trình rèn luyện, chúng ta sẽ nhận phản hồi và chỉnh sửa dần
        dần.
      </i>
      <hr />
      Chúc các anh chị, các bạn được nhiều lợi lạc.
    </div>
  );
};

export default Dictaphone;

// Helper functions
function removeAccentsAndLowercase(str) {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Removes accents
    .replace(/[.,?]/g, "") // Removes periods, commas, and question marks
    .toLowerCase();
}

function findMostSimilarQuestion(statement, questions, threshold) {
  if (!statement) return null;

  let maxSimilarity = -1;
  let mostSimilarQuestion = null;
  const normalizedStatement = removeAccentsAndLowercase(statement);

  questions.forEach((questionObj) => {
    questionObj.qs.forEach((qs) => {
      const normalizedQuestion = removeAccentsAndLowercase(qs);
      const similarity = stringSimilarity.compareTwoStrings(
        normalizedStatement,
        normalizedQuestion
      );

      if (similarity >= threshold && similarity > maxSimilarity) {
        maxSimilarity = similarity;
        mostSimilarQuestion = questionObj;
      }
    });
  });

  return mostSimilarQuestion;
}

function getRandomElementFromArray(array) {
  if (!array || array.length === 0) return null;
  return array[Math.floor(Math.random() * array.length)];
}

function removeDuplicates(sentence) {
  if (!sentence) return "";

  const words = sentence.split(" ");
  const seen = new Set();
  const result = [];

  for (const word of words) {
    if (!seen.has(word)) {
      result.push(word);
      seen.add(word);
    }
  }

  return result.join(" ");
}
