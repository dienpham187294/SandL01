import React, { useState } from "react";
import { socket } from "../App";

const ChatInput = () => {
  const [message, setMessage] = useState("");

  const handleSendMessage = (event) => {
    event.preventDefault();
    if (message.trim()) {
      const timestamp = new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });

      if (message.includes("##cmd_getlink")) {
        socket.emit("message", { text: window.location.href, time: timestamp });
      } else {
        socket.emit("message", { text: message, time: timestamp });
      }

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
