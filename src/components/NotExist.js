import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for routing

const Countdown = () => {
  const [seconds, setSeconds] = useState(3); // Initialize countdown with 3 seconds
  const navigate = useNavigate(); // Get the useNavigate function
  let intervalId;

  useEffect(() => {
    intervalId = setInterval(() => {
      setSeconds((prevSeconds) => prevSeconds - 1);
    }, 1000); // Update countdown every second (1000 milliseconds)

    return () => clearInterval(intervalId); // Clean up interval on component unmount
  }, []); // Run the effect only once when the component mounts

  useEffect(() => {
    if (seconds === 0) {
      clearInterval(intervalId);
      navigate("/"); // Navigate to "/" after countdown completes
    }
  }, [seconds]); // Run the effect only when seconds change

  return (
    <div style={styles.container}>
      <h1 style={styles.message}>Phòng không tồn tại!</h1>
      <h1 style={styles.countdown}>Trở về lobby: {seconds}</h1>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    textAlign: "center",
    fontFamily: "Arial, sans-serif",
  },
  message: {
    fontSize: "48px",
    marginBottom: "20px",
  },
  countdown: {
    fontSize: "48px",
  },
};

export default Countdown;
