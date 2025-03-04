import React, { useState, useEffect, useRef } from "react";
import { socket } from "../App";
import ChatInput from "./ChatInput";
import { useNavigate } from "react-router-dom";
import SpeechRecognition from "react-speech-recognition";

const ChatWidget = () => {
  const [chatHistory, setChatHistory] = useState([]);
  const [onlineNumber, setOnlineNumber] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const chatEndRef = useRef(null);
  const navigate = useNavigate();
  useEffect(() => {
    socket.on("message", (newMessage) => {
      handle_cmd_f_admin(newMessage, navigate, setIsOpen, storeLinkToday);

      setChatHistory((prevHistory) => [...prevHistory, newMessage]);

      if (!isOpen) {
        setUnreadCount((prevCount) => prevCount + 1);
      }
    });
    socket.on("onlineNumber", (newNumber) => {
      setOnlineNumber(newNumber);
    });
    socket.on("messageHistory", (history) => {
      console.log(history);
      history.forEach((e) => {
        try {
          if (e.text.includes("http://")) {
          }
          if (
            e.text.includes("##cmd_linkcode_") ||
            e.text.includes("##cmd_removelinkcode")
          ) {
            handle_cmd_f_admin(e.text, navigate, setIsOpen);
          }

          if (e.text.startsWith("[{") && e.text.endsWith("}]")) {
            storeLinkToday(e.text);
          }
        } catch (error) {}
      });

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
        <span>{isOpen ? "▼" : "▲"}</span>{" "}
      </div>
      {isOpen && (
        <>
          <ul style={historyStyle}>
            {chatHistory.map((msg, index) => (
              <li key={index} style={messageStyle}>
                <div>
                  {msg.text.includes("http://") || msg.text.includes("https://")
                    ? tachStringTheoHttp(msg.text).map((e, i) =>
                        e.includes("http://") || e.includes("https://") ? (
                          <a
                            key={i}
                            href={e}
                            target={
                              e.includes("phamvandien") ? "_self" : "_blank"
                            }
                            rel="noopener noreferrer"
                          >
                            <br />
                            <button className="btn btn-primary">
                              Bấm vào đây
                            </button>
                            <br />
                          </a>
                        ) : (
                          e
                        )
                      )
                    : msg.text}
                </div>
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
  if (msg.text.startsWith("[{") && msg.text.endsWith("}]")) {
    storeLinkToday(msg.text);
  }
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
    // navigate(msg.text);
    window.location.href = msg.text;
  }
  if (msg.text.includes("_stopAPI")) {
    try {
      SpeechRecognition.stopListening();
    } catch (error) {
      console.log(error);
    }
  }
  if (msg.text.includes("_closeweb")) {
    try {
      window.location.href =
        "https://translate.google.com/?hl=vi&sl=en&tl=vi&op=translate";
    } catch (error) {
      console.log(error);
    }
  }

  if (msg.text.includes("##cmd_linkcode_")) {
    try {
      let input = msg.text.split("##cmd_linkcode_");
      storeLink({ linkCode: input[1].toUpperCase(), link: input[0] });
    } catch (error) {
      console.log(error);
    }
  }
  if (msg.text.includes("##cmd_removelinkcode")) {
    try {
      localStorage.removeItem("links");
    } catch (error) {
      console.log(error);
    }
  }
}

function storeLink(data) {
  // Lấy dữ liệu hiện có từ LocalStorage
  let storedData = JSON.parse(localStorage.getItem("links"));

  if (!storedData) {
    storedData = [];
  }

  // Thêm thời gian hết hạn (5 giờ từ lúc cập nhật)
  const expirationTime = new Date().getTime() + 5 * 60 * 60 * 1000; // 5 giờ tính bằng mili giây
  data.expirationTime = expirationTime;

  // Tìm đối tượng có linkCode trùng và thay thế
  const existingIndex = storedData.findIndex(
    (item) => item.linkCode === data.linkCode
  );
  if (existingIndex !== -1) {
    // Thay thế đối tượng có linkCode trùng
    storedData[existingIndex] = data;
  } else {
    // Thêm mới đối tượng
    storedData.push(data);
  }

  // Lưu lại dữ liệu vào LocalStorage
  localStorage.setItem("links", JSON.stringify(storedData));
}
function storeLinkToday(data) {
  try {
    // Ghi đè lên dữ liệu hiện có trong LocalStorage với key "linktoday"
    localStorage.setItem("linktoday", data);
  } catch (error) {
    console.error("Error storing data in localStorage:", error);
  }
}

function tachStringTheoHttp(str) {
  // Sử dụng regex để tìm tất cả các URL và tách chuỗi
  const regex = /https?:\/\/[^\s]+/g;

  // Tách chuỗi thành một mảng với phần không phải URL và URL
  const result = str.split(regex).reduce((arr, part, index) => {
    arr.push(part.trim()); // Thêm phần không phải URL vào mảng
    if (index < str.match(regex).length) {
      arr.push(str.match(regex)[index]); // Thêm URL vào mảng
    }
    return arr;
  }, []);

  return result;
}
