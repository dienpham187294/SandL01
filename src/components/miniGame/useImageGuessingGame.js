import { useState } from "react";

export default function useImageGuessingGame(imageUrl, answer, pointA, pointB) {
  const [revealedCells, setRevealedCells] = useState(Array(6).fill(false));
  const [inputValue, setInputValue] = useState("");
  const [correctChars, setCorrectChars] = useState(0);
  const [revealedCount, setRevealedCount] = useState(0);
  const [guessedLetters, setGuessedLetters] = useState([]);

  const handleCellClick = (index) => {
    if (pointB > pointA && !revealedCells[index] && revealedCount < 2) {
      const newRevealedCells = [...revealedCells];
      newRevealedCells[index] = true;
      setRevealedCells(newRevealedCells);
      setRevealedCount(revealedCount + 1);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value.toLowerCase();
    const lowerCaseAnswer = answer.toLowerCase();
    setInputValue(value);
    let correctCount = 0;
    let newGuessedLetters = [...guessedLetters];

    for (let i = 0; i < value.length && i < lowerCaseAnswer.length; i++) {
      if (
        value[i] === lowerCaseAnswer[i] &&
        !newGuessedLetters.includes(value[i])
      ) {
        newGuessedLetters.push(value[i]);
      }
      if (value[i] === lowerCaseAnswer[i]) {
        correctCount++;
      }
    }

    setGuessedLetters(newGuessedLetters);
    setCorrectChars(correctCount);
  };

  const resetGameState = () => {
    setRevealedCells(Array(6).fill(false));
    setInputValue("");
    setCorrectChars(0);
    setRevealedCount(0);
    setGuessedLetters([]);
  };

  return {
    imageUrl,
    revealedCells,
    handleCellClick,
    inputValue,
    handleInputChange,
    correctChars,
    answerLength: answer.length,
    guessedLetters,
    resetGameState,
  };
}
