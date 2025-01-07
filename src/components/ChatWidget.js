import React, { useState, useEffect, useRef } from "react";
import { socket } from "../App";
import ChatInput from "./ChatInput";
import { useNavigate } from "react-router-dom";
const ChatWidget = () => {
  const [chatHistory, setChatHistory] = useState([]);
  const [onlineNumber, setOnlineNumber] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const chatEndRef = useRef(null);
  const navigate = useNavigate();
  useEffect(() => {
    socket.on("message", (newMessage) => {
      handle_cmd_f_admin(newMessage, navigate, setIsOpen);

      setChatHistory((prevHistory) => [...prevHistory, newMessage]);
      if (!isOpen) {
        setUnreadCount((prevCount) => prevCount + 1);
      }
    });
    socket.on("onlineNumber", (newNumber) => {
      setOnlineNumber(newNumber);
    });
    socket.on("messageHistory", (history) => {
      setChatHistory(history);
    });

    return () => {
      socket.off("message");
      socket.off("onlineNumber");
      socket.off("messageHistory");
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: "auto" });
    }
  }, [chatHistory, isOpen]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setUnreadCount(0);
    }
  };

  const containerStyle = {
    position: "fixed",
    bottom: "0",
    right: "0",
    width: isOpen ? "300px" : "100px",
    height: isOpen ? "50vh" : "50px",
    border: "1px solid #ccc",
    borderRadius: "5px",
    overflow: "hidden",
    backgroundColor: "white",
    display: "flex",
    flexDirection: "column",
    transition: "width 0.3s, height 0.3s",
    zIndex: 10,
  };

  const headerStyle = {
    padding: "10px",
    backgroundColor: "#007bff",
    color: "white",
    cursor: "pointer",
    display: "flex",
    justifyContent: "space-between",
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
      <div style={headerStyle} onClick={toggleChat}>
        Chat {unreadCount > 0 && <span>({unreadCount})</span>}
        <span>{isOpen ? "▼" : "▲"}</span>
      </div>
      {isOpen && (
        <>
          <ul style={historyStyle}>
            {chatHistory.map((msg, index) => (
              <li key={index} style={messageStyle}>
                <div>{msg.text}</div>
                <div style={{ fontSize: "0.8em", color: "gray" }}>
                  {msg.time}
                </div>
              </li>
            ))}
            <div ref={chatEndRef} />
          </ul>
          <ChatInput />
        </>
      )}
    </div>
  );
};

export default ChatWidget;

function handle_cmd_f_admin(msg, navigate, setIsOpen) {
  if (!msg.text.includes("##cmd")) {
    return;
  }
  if (msg.text.includes("_openchat")) {
    setIsOpen(true);
  }
  if (msg.text.includes("_closechat")) {
    setIsOpen(false);
  }
  if (msg.text.includes("_newlink")) {
    setIsOpen(false);
  }
  if (msg.text.includes("_forcego")) {
    navigate(msg.text);
  }
}
