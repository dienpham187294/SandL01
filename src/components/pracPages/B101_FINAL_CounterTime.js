import React, { useState, useEffect } from "react";

const CountdownTimer = ({ setSTT, STT, TIME }) => {
  const [timeLeft, setTimeLeft] = useState(TIME); // 120 seconds countdown

  useEffect(() => {
    if (timeLeft > 0) {
      const timerId = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);

      // Cleanup interval on component unmount
      return () => clearInterval(timerId);
    } else if (timeLeft === 0) {
      setSTT(STT);
    }
  }, [timeLeft]);

  // Format time as mm:ss
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.timer}>{formatTime(timeLeft)}</h1>
      {timeLeft === 0 && <p style={styles.message}>Time's up!</p>}
    </div>
  );
};

// Styles for the timer component
const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "10vh",
    backgroundColor: "#f0f0f0",
  },
  timer: {
    fontSize: "48px",
    fontWeight: "bold",
    margin: "0",
  },
  message: {
    fontSize: "24px",
    color: "red",
  },
};

export default CountdownTimer;
