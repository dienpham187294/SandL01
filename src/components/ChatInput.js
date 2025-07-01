import React, { useState } from "react";
import { socket } from "../App";
import { getGroupColor } from "../ulti/chatUlti";
import { useEffect } from "react";

const ChatInput = ({ currentGroup = "all" }) => {
  const [message, setMessage] = useState("");
  const dinhDanh = localStorage.getItem("dinhDanh")
    ? " " + localStorage.getItem("dinhDanh").slice(0, 4)
    : "";
  const nameDinhDanh = localStorage.getItem("nameDinhDanh");
  const groupColor = getGroupColor(currentGroup);

  const handleSendMessage = (event) => {
    event.preventDefault();
    if (message.trim()) {
      const timestamp = new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
      const sender = nameDinhDanh || (dinhDanh ? dinhDanh.slice(0, 4) : "");

      socket.emit("message", {
        text: message,
        time: `${timestamp} ${sender}`,
        group: currentGroup, // Thêm thông tin nhóm
      });
      setMessage("");
    }
  };

  const inputStyle = {
    borderColor: groupColor,
    transition: "all 0.2s ease",
  };

  const buttonStyle = {
    background: `linear-gradient(135deg, ${groupColor} 0%, ${groupColor}dd 100%)`,
    borderColor: groupColor,
    transition: "all 0.2s ease",
  };

  const buttonHoverStyle = {
    background: `linear-gradient(135deg, ${groupColor}ee 0%, ${groupColor}bb 100%)`,
    borderColor: `${groupColor}dd`,
  };

  return (
    <>
      <style jsx>{`
        .chat-input-group .form-control:focus {
          border-color: ${groupColor} !important;
          box-shadow: 0 0 0 2px ${groupColor}33 !important;
        }
        .chat-send-btn {
          background: linear-gradient(
            135deg,
            ${groupColor} 0%,
            ${groupColor}dd 100%
          );
          border-color: ${groupColor};
          transition: all 0.2s ease;
        }
        .chat-send-btn:hover {
          background: linear-gradient(
            135deg,
            ${groupColor}ee 0%,
            ${groupColor}bb 100%
          );
          border-color: ${groupColor}dd;
          transform: translateY(-1px);
        }
        .chat-send-btn:active {
          transform: translateY(0);
        }
      `}</style>

      <form onSubmit={handleSendMessage} className="p-3 border-top">
        <div className="input-group chat-input-group">
          <input
            type="text"
            className="form-control"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={`Nhập tin nhắn vào ${
              currentGroup === "all"
                ? "chat toàn thể"
                : `nhóm ${currentGroup.replace("group", "")}`
            }...`}
            style={inputStyle}
          />
          <button
            type="submit"
            className="btn btn-primary chat-send-btn"
            disabled={!message.trim()}
          >
            <i className="bi bi-send-fill"></i>
          </button>
        </div>
      </form>
    </>
  );
};

export default ChatInput;
