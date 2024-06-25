import React, { useState, useEffect, useRef } from "react";
import { socket } from "../App";

const ChatList = () => {
  const [chatHistory, setChatHistory] = useState([]);
  const [onlineNumber, setOnlineNumber] = useState(0);
  const chatEndRef = useRef(null);

  useEffect(() => {
    socket.on("message", (newMessage) => {
      setChatHistory((prevHistory) => [...prevHistory, newMessage]);
    });
    socket.on("onlineNumber", (newNumber) => {
      setOnlineNumber(newNumber);
    });

    // Clean up socket listeners
    return () => {
      socket.off("message");
      socket.off("onlineNumber");
    };
  }, []);

  useEffect(() => {
    // Scroll to bottom when new messages arrive
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);

  const containerStyle = {
    display: "flex",
    flexDirection: "column",
    height: "40vh", // Adjust as needed
    border: "1px solid #ccc",
    borderRadius: "5px",
    overflow: "hidden",
  };

  const historyStyle = {
    flex: 1,
    overflowY: "auto",
    padding: "10px",
    listStyleType: "none",
    margin: 0,
  };

  const messageStyle = {
    marginBottom: "10px",
    padding: "10px",
    backgroundColor: "#f1f1f1",
    borderRadius: "5px",
  };

  const statusStyle = {
    padding: "10px",
    backgroundColor: "#e9e9e9",
    textAlign: "center",
  };

  return (
    <div style={containerStyle}>
      <ul style={historyStyle}>
        {chatHistory.map((msg, index) => (
          <li key={index} style={messageStyle}>
            {msg}
          </li>
        ))}
        <div ref={chatEndRef} />
      </ul>
      <p style={statusStyle}>
        <i>
          <b>{onlineNumber} clients đang online!</b>
        </i>
      </p>
    </div>
  );
};

export default ChatList;
