import React, { useState } from "react";
import { socket } from "../App";

const ChatInput = () => {
  const [message, setMessage] = useState("");

  const handleSendMessage = (event) => {
    event.preventDefault();

    if (message.trim()) {
      socket.emit("message", message);
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
