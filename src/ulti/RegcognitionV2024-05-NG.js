import React, { useEffect, useState } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import stringSimilarity from "string-similarity";
import ReadMessage from "./ReadMessage_2024";
// import { socket } from "../App";

const Dictaphone = ({
  getSTTDictaphone,
  setGetSTTDictaphone,
  CMDlist,
  GENDER,
  setScore,
  addElementIfNotExist,
  ObjVoices,
  Lang,
  setStartSTT,
  setMessage,
}) => {
  const { transcript, listening, resetTranscript } = useSpeechRecognition();
  const [RegInput, setRegInput] = useState(null);
  // const idSocket = socket.id.slice(0, 4);
  useEffect(() => {
    if (getSTTDictaphone) {
      startListening();
    }
  }, [getSTTDictaphone]);

  useEffect(() => {
    if (RegInput !== null) {
      
      setMessage(RegInput);
      const objTR = findMostSimilarQuestion(RegInput, CMDlist);
      if (objTR === null) {
        ReadMessage(ObjVoices, "Sorry, what did you say?", GENDER);
      } else {
        if (objTR.aw !== undefined) {
          ReadMessage(ObjVoices, getRandomElementFromArray(objTR.aw), GENDER);
        }
        if (objTR.action !== undefined) {
          if (objTR.action[0] === "WRONG") {
            setScore((S) => S - 1);
            setStartSTT(true);
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

  return (
    <div
      className="container"
      style={{
        position: "fixed",
        backgroundColor: "white",
        top: "50%",
        left: "50%",
        height: "600px",
        transform: "translate(-50%, -50%)",
        border: "1px solid black",
        borderRadius: "5px",
        cursor: "pointer",
        padding: "1rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 5,
      }}
    >
      <div className="row" style={{ width: "80%" }}>
        <div className="col-6">
          <h3>
            <b>{transcript || ". . . . ."}</b>
          </h3>
          <hr />
          <button
            style={{ scale: "1.5" }}
            className="btn btn-info"
            onClick={() => {
              resetTranscript();
            }}
          >
            Clear
          </button>
        </div>
        <div
          className="col-6"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              border: "1px solid black",
              borderRadius: "5px",
              cursor: "pointer",
              padding: "1rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              scale: "1.5",
            }}
            onClick={() => {
              stopListening();
              setRegInput(transcript);
            }}
          >
            <i className="bi bi-mic-fill"></i>
          </div>
        </div>
      </div>
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
