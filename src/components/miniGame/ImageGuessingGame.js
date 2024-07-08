import React, { useEffect, useState } from "react";
import useImageGuessingGame from "./useImageGuessingGame";
import imageData from "../pracDatabase/minigame_guessingImage.json";
import shuffleArray from "../../ulti/shuffleArray";

const dataInput = shuffleArray(imageData);

const ImageGuessingGame = ({ setScoreMinigame, ScoreMinigame }) => {
  const [Index, setIndex] = useState(0);
  const [animateScore, setAnimateScore] = useState(false);
  const [imageUrl, setImageUrl] = useState(dataInput[Index].img);
  const [answer, setAnswer] = useState(dataInput[Index].name);
  const [hint, setHint] = useState(dataInput[Index].clue);
  const pointA = 0;
  const pointB = 2;

  const {
    revealedCells,
    handleCellClick,
    inputValue,
    handleInputChange,
    correctChars,
    answerLength,
    resetGameState,
  } = useImageGuessingGame(imageUrl, answer, pointA, pointB);

  useEffect(() => {
    setImageUrl(dataInput[Index].img);
    setAnswer(dataInput[Index].name);
    setHint(dataInput[Index].clue);
    resetGameState(); // Reset the game state when the question changes
  }, [Index]);

  useEffect(() => {
    if (answerLength === correctChars) {
      setScoreMinigame((prevScore) => prevScore + 1);
      setAnimateScore(true);
      setTimeout(() => {
        setAnimateScore(false);
        nextQuestion();
      }, 1500); // The total duration of the animations
    }
  }, [answerLength, correctChars]);

  const nextQuestion = () => {
    setIndex((prevIndex) => (prevIndex + 1) % dataInput.length);
  };

  return (
    <div className="row">
      <div className="col-4">
        <div>
          <h5>Mini game: Đoán chữ theo gợi ý sau.</h5>
          <b>Clue | Gợi ý:</b>
          <br />
          <i>1. {hint}</i> <br />
          <i>2. Gồm {answer.split(" ").length} chữ;</i>
          <br />
          <i>3. Gồm {answer.length} kí tự; bao gồm cả khoảng trắng (nếu có).</i>
          <br />
          <hr />
        </div>
      </div>
      <div className="col-4">
        <input
          className="form-control"
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          style={{
            width: `${answerLength * 20}px`,
            fontSize: "20px",
            textAlign: "center",
            margin: "10px 0",
          }}
        />
        <p>
          Correct characters | Số kí tự đúng: {correctChars}/{answerLength}
        </p>
        <button className="btn btn-outline-primary" onClick={nextQuestion}>
          Next
        </button>
        <p
          id="scoreID"
          style={{
            display: "inline-block",
            transform: animateScore ? "scale(1.5)" : "scale(1)",
            color: animateScore ? "green" : "black",
            animation: animateScore
              ? "blink 0.5s alternate 3, shake 0.5s 3"
              : "none",
            transition: "transform 0.5s, color 0.5s",
          }}
        >
          Score: {ScoreMinigame}
        </p>
      </div>
      <div className="col-4">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 100px)",
            gap: "2px",
          }}
        >
          {revealedCells.map((revealed, index) => {
            const row = Math.floor(index / 3);
            const col = index % 3;
            const position = `${-col * 100}px ${-row * 100}px`;
            return (
              <div
                key={index}
                onClick={() => handleCellClick(index)}
                style={{
                  width: "100px",
                  height: "100px",
                  border: "1px solid black",
                  borderRadius: "5px",
                  backgroundColor: revealed ? "transparent" : "grey",
                  backgroundImage: revealed ? `url(${imageUrl})` : "none",
                  backgroundSize: "300px 200px",
                  backgroundPosition: revealed ? position : "0 0",
                  cursor: "pointer",
                }}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ImageGuessingGame;

// Add the CSS for animations in the same file or in your CSS file
const style = document.createElement("style");
style.innerHTML = `
  @keyframes blink {
    0% {
      opacity: 1;
    }
    50% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }

  @keyframes shake {
    0% {
      transform: translateX(0);
    }
    25% {
      transform: translateX(-10px);
    }
    50% {
      transform: translateX(10px);
    }
    75% {
      transform: translateX(-10px);
    }
    100% {
      transform: translateX(0);
    }
  }
`;
document.head.appendChild(style);
