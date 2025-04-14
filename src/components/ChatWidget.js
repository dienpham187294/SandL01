import React, { useState, useEffect, useRef } from "react";
import { socket } from "../App";
import ChatInput from "./ChatInput";
import { useNavigate } from "react-router-dom";
import SpeechRecognition from "react-speech-recognition";

const ChatWidget = () => {
  const [chatHistory, setChatHistory] = useState([]);
  const [NotifyHistory, setNotifyHistory] = useState([]);
  const [onlineNumber, setOnlineNumber] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [userName, setUserName] = useState(
    localStorage.getItem("nameDinhDanh") || ""
  );
  const [isEditingName, setIsEditingName] = useState(
    !localStorage.getItem("nameDinhDanh")
  );
  const chatEndRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    socket.on("message", (newMessage) => {
      if (newMessage.type === "notify") {
        setNotifyHistory((prevHistory) => {
          const filteredHistory = prevHistory.filter(
            (item) => item.id !== newMessage.id
          );
          return [newMessage, ...filteredHistory];
        });
      } else {
        setChatHistory((prevHistory) => [...prevHistory, newMessage]);
      }

      if (!isOpen) {
        setUnreadCount((prevCount) => prevCount + 1);
      }
    });

    socket.on("onlineNumber", (newNumber) => {
      setOnlineNumber(newNumber);
    });

    socket.on("messageHistory", (history) => {
      let historyMesage = [];
      let historyNotify = [];
      history.forEach((e) => {
        if (e.type && e.type === "notify") {
          historyNotify.push(e);
        } else {
          historyMesage.push(e);
        }
      });

      setChatHistory(historyMesage);
      setNotifyHistory(historyNotify);
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

  const handleNameChange = (e) => {
    setUserName(e.target.value);
  };

  const saveUserName = () => {
    localStorage.setItem("nameDinhDanh", userName);
    setIsEditingName(false);
  };

  const containerStyle = {
    position: "fixed",
    bottom: "0",
    right: "0",
    width: isOpen ? "400px" : "100px",
    height: isOpen ? "60vh" : "50px",
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

  const notifyStyle = {
    padding: isOpen ? "10px" : "0px",
    height: isOpen ? "110px" : "0px",
    color: "black",
    cursor: "pointer",
    fontSize: "small",
  };

  const notifyNameStyle = {
    padding: isOpen ? "10px" : "0px",
    height: isOpen ? "50px" : "0px",
    color: "black",
    cursor: "pointer",
    fontSize: "small",
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
    fontSize: "14px",
  };

  const statusStyle = {
    padding: "10px",
    backgroundColor: "#e9e9e9",
    textAlign: "center",
  };

  return (
    <div style={containerStyle}>
      <div style={notifyStyle}>
        {NotifyHistory.slice(0, 9).map((msg, index) => (
          <div
            key={index}
            style={{ ...messageStyle, display: "inline-block", margin: "1px" }}
          >
            {msg.text} {msg.time}
          </div>
        ))}
      </div>

      {isEditingName ? (
        <div style={notifyNameStyle}>
          {" "}
          {isEditingName ? (
            <>
              <input
                type="text"
                value={userName}
                onChange={handleNameChange}
                placeholder="Enter your name"
              />
              <button onClick={saveUserName}>✔</button>
            </>
          ) : (
            <>
              <span>{userName || "Guest"}</span>
            </>
          )}
        </div>
      ) : null}
      <div style={headerStyle} onClick={toggleChat}>
        Chat {unreadCount > 0 && <span>({unreadCount})</span>}
        <span>{isOpen ? userName : null}</span>
        <span>{isOpen ? "▼" : "▲"}</span>
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
                          <div key={i}>
                            <br />
                            <button
                              className="btn btn-primary"
                              onClick={() => {
                                SpeechRecognition.stopListening();
                                try {
                                  const parsedUrl = new URL(e);
                                  const pathOnly =
                                    parsedUrl.pathname + parsedUrl.search;
                                  if (e.includes("/roomoffline")) {
                                    navigate("/");
                                    setTimeout(() => {
                                      navigate(pathOnly);
                                    }, 500);
                                  } else {
                                    navigate(pathOnly);
                                  }
                                } catch (err) {
                                  console.error("Lỗi URL không hợp lệ:", err);
                                }
                              }}
                            >
                              Bấm vào đây
                            </button>
                            <br />
                          </div>
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
