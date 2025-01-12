import React, { useEffect, useState } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import stringSimilarity from "string-similarity";
import ReadMessage from "./ReadMessage_2024";
import { CloseButton } from "react-bootstrap";
// import { socket } from "../App";

let commands = [];

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
  setStartSTT,
  setMessage,
}) => {
  const { interimTranscript, transcript, listening, resetTranscript } =
    useSpeechRecognition({ commands });
  const [otherGetInterim, setotherGetInterim] = useState("In");
  const [RegInput, setRegInput] = useState(null);
  // const idSocket = socket.id.slice(0, 4);
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

  useEffect(() => {
    let cmd_get_f_CMDlist = [];
    CMDlist.forEach((e0, i0) => {
      e0.qs.forEach((e1, i1) => {
        cmd_get_f_CMDlist.push(
          // i0 + "-" + i1 + "-" +
          e1
        );
      });
    });

    commands = [
      {
        command: cmd_get_f_CMDlist,
        callback: (command, n, i) => {
          try {
            // let res = command.split("-");
            const interimRes = document.getElementById("interimRes");
            interimRes.innerText = command;
            // if (CMDlist[res[0]].aw !== undefined) {
            //   ReadMessage(
            //     ObjVoices,
            //     getRandomElementFromArray(CMDlist[res[0]].aw),
            //     GENDER,
            //     CMDlist[res[0]].aw01
            //   );
            // }
            // if (CMDlist[res[0]].action !== undefined) {
            //   if (CMDlist[res[0]].action[0] === "WRONG") {
            //     setScore((S) => S - 1);
            //     setStartSTT(true);
            //   } else {
            //     addElementIfNotExist(CMDlist[res[0]].action[0]);
            //   }
            // }

            // setStyles((prevStyles) => ({
            //   ...prevStyles,
            //   opacity: 0,
            //   height: "100px",
            //   width: "300px",
            // }));
            // setTimeout(() => {
            //   setGetSTTDictaphone(false);
            // }, 500);
          } catch (error) {}
        },
        isFuzzyMatch: true,
        fuzzyMatchingThreshold: regRate,
        bestMatchOnly: true,
      },
      // {
      //   command: ["clear", "reset"],
      //   callback: ({ resetTranscript }) => resetTranscript(),
      // },
      // {
      //   command: "stop",
      //   callback: stopListening,
      // },
      // {
      //   command: [
      //     "Can you say that again?",
      //     "Can you repeat that?",
      //     "Could you say it again, please?",
      //   ],
      //   callback: () => fn_speakAgain(),
      // },
      // {
      //   command: [
      //     "Can you speak slowly?",
      //     "Can you say it slowly?",
      //     "Speak slower, please.",
      //     "Please repeat slowly.",
      //   ],
      //   callback: () => fn_speakSlowly(),
      // },
    ];
  }, [CMDlist]);

  useEffect(() => {
    setStyles((prevStyles) => ({
      ...prevStyles,
      opacity: 1,
      height: "600px",
    }));
  }, []);

  useEffect(() => {
    if (getSTTDictaphone) {
      startListening();
    }
  }, [getSTTDictaphone]);

  useEffect(() => {
    if (RegInput !== null) {
      setMessage(RegInput);

      let objTR_00 = findMostSimilarQuestion(RegInput, CMDlist);
      let objTR_01 = findMostSimilarQuestion(
        document.getElementById("interimRes").innerText,
        CMDlist
      );

      let objTR = null;

      if (objTR_00 !== null) {
        objTR = objTR_00;
      }
      if (objTR_00 === null && objTR_01 !== null) {
        objTR = objTR_01;
      }

      if (objTR === null) {
        ReadMessage(
          ObjVoices,
          "Sorry, what did you say?",
          GENDER,
          GENDER === 1 ? [{ id: "sorryFemale" }] : [{ id: "sorryMale" }]
        );
      } else {
        if (objTR.aw01 !== undefined) {
          ReadMessage(
            ObjVoices,
            getRandomElementFromArray(objTR.aw),
            GENDER,
            objTR.aw01
          );
        } else if (objTR.aw !== undefined) {
          ReadMessage(ObjVoices, getRandomElementFromArray(objTR.aw), GENDER);
        }
        if (objTR.action !== undefined) {
          if (objTR.action[0] === "WRONG") {
            setScore((S) => S - 1.5);
            // setStartSTT(true);
          } else {
            addElementIfNotExist(objTR.action[0]);
          }
        }
      }
      setGetSTTDictaphone(false);
    }
  }, [RegInput]);

  const startListening = () => {
    SpeechRecognition.startListening({
      continuous: true,
      language: Lang || "en-US",
    });
  };

  const stopListening = () => {
    SpeechRecognition.stopListening();
  };
  // useEffect(() => {
  //   if (interimTranscript === "") {
  //     setotherGetInterim((D) => D + " " + interimTranscript);
  //   }
  // }, [interimTranscript]);
  return (
    <div className="container" id="div_of_dictaphone" style={{}}>
      {" "}
      <button
        // style={{ scale: "1.5", marginRight: "10x" }}
        className="btn btn-danger"
        onClick={() => {
          resetTranscript();
        }}
      >
        Xóa nội dung vừa nói
      </button>{" "}
      <button
        // style={{ scale: "1.5" }}
        disabled={interimTranscript !== "" ? true : false}
        className="btn btn-info"
        onClick={() => {
          stopListening();
          setRegInput(transcript);
        }}
      >
        {/* <i className="bi bi-mic-fill mr-1"></i> */}
        <i>Sử dụng nội dung vừa nói (1) và (2)</i>
      </button>
      <h3> (1){transcript || <i>Hãy nói gì đó . . . </i>}</h3>
      <h5 style={{ color: "blue" }}>
        {" "}
        (2)
        <i>{interimTranscript}</i> <i id="interimRes"></i>
      </h5>{" "}
      {/* {otherGetInterim} */}
      <button
        id="stopListenBTN"
        style={{ display: "none" }}
        onClick={() => {
          stopListening();
        }}
      >
        StopListen
      </button>{" "}
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
  );
};

export default Dictaphone;

// Helper function to remove accents and convert to lowercase
function removeAccentsAndLowercase(str) {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Removes accents
    .replace(/[.,?]/g, "") // Removes periods, commas, and question marks
    .toLowerCase();
}

// Function to find the most similar question object
function findMostSimilarQuestion(statement, questions) {
  let maxSimilarity = -1;
  let mostSimilarQuestion = null;

  // Normalize the statement
  const normalizedStatement = removeAccentsAndLowercase(statement);

  // Function to check if the string contains a number
  function containsNumber(str) {
    // return /\d/.test(str);
    return str.includes(":");
  }

  // Set the similarity threshold based on whether the statement contains a number
  const similarityThreshold = containsNumber(statement) ? 0.25 : 0.6;

  questions.forEach((questionObj) => {
    // Loop through each question in the array "qs"
    questionObj.qs.forEach((qs) => {
      const normalizedQuestion = removeAccentsAndLowercase(qs);

      const similarity = stringSimilarity.compareTwoStrings(
        normalizedStatement,
        normalizedQuestion
      );

      // Check similarity and update if greater than maxSimilarity
      if (similarity >= similarityThreshold && similarity > maxSimilarity) {
        maxSimilarity = similarity;
        mostSimilarQuestion = questionObj;
      }
    });
  });

  return mostSimilarQuestion; // Return null if no suitable match is found
}

// Function to get a random element from an array
function getRandomElementFromArray(array) {
  if (array.length === 0) {
    return null;
  }
  const randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
}
