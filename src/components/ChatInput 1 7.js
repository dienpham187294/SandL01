import React, { useState } from "react";
import { socket } from "../App";

const ChatInput = () => {
  const [message, setMessage] = useState("");
  const dinhDanh = localStorage.getItem("dinhDanh")
    ? " " + localStorage.getItem("dinhDanh").slice(0, 4)
    : "";

  const nameDinhDanh = localStorage.getItem("nameDinhDanh");

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
      });

      setMessage("");
    }
  };

  return (
    <form onSubmit={handleSendMessage} className="mt-3">
      <div className="input-group">
        <input
          type="text"
          className="form-control"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Enter your message..."
        />
        <button type="submit" className="btn btn-primary">
          Send
        </button>
      </div>
    </form>
  );
};

export default ChatInput;
