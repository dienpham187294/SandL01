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
    // Limit input to 8 characters
    if (e.target.value.length <= 8) {
      setUserName(e.target.value);
    }
  };

  const saveUserName = () => {
    if (userName.trim()) {
      localStorage.setItem("nameDinhDanh", userName);
      setIsEditingName(false);
    }
  };

  const handleEditName = () => {
    setUserName(""); // Reset name field
    setIsEditingName(true);
  };

  const containerStyle = {
    position: "fixed",
    bottom: "20px",
    right: "20px",
    width: isOpen ? "400px" : "70px",
    height: isOpen ? "60vh" : "70px",
    borderRadius: isOpen ? "16px" : "50%",
    overflow: "hidden",
    backgroundColor: "white",
    display: "flex",
    flexDirection: "column",
    transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
    zIndex: 1050,
    boxShadow: isOpen
      ? "0 10px 40px rgba(0, 0, 0, 0.15)"
      : "0 8px 25px rgba(0, 0, 0, 0.15)",
    border: isOpen ? "1px solid #e9ecef" : "3px solid #ffffff",
  };

  // Chat icon when closed - with favicon background
  const chatIconStyle = {
    width: "70px",
    height: "70px",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    borderRadius: "50%",
    cursor: "pointer",
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.3s ease",
    backgroundImage: `url('https://i.postimg.cc/Bv9MGGy8/favicon-ico.png')`,
    backgroundSize: "45px 45px",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
  };

  const headerStyle = {
    padding: "12px 16px",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    color: "white",
    cursor: "pointer",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    transition: "background 0.3s ease",
  };

  const notifyStyle = {
    padding: isOpen ? "8px 12px" : "0px",
    height: isOpen ? "auto" : "0px",
    maxHeight: isOpen ? "110px" : "0px",
    background: "#f8f9fa",
    borderBottom: "1px solid #e9ecef",
    overflowY: "auto",
    transition: "all 0.3s ease",
  };

  const notifyNameStyle = {
    padding: isOpen ? "10px 16px" : "0px",
    height: isOpen ? "auto" : "0px",
    background: "#e3f2fd",
    borderBottom: "1px solid #e9ecef",
    fontSize: "small",
    transition: "all 0.3s ease",
    overflow: "hidden",
  };

  const historyStyle = {
    flex: 1,
    overflowY: "auto",
    padding: "12px",
    background: "#fafafa",
    listStyleType: "none",
    margin: 0,
  };

  const messageStyle = {
    marginBottom: "12px",
    padding: "12px",
    background: "white",
    borderRadius: "12px",
    fontSize: "14px",
    border: "1px solid #e9ecef",
    boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
  };

  const notificationItemStyle = {
    background: "white",
    border: "1px solid #e9ecef",
    borderRadius: "6px",
    padding: "6px 8px",
    marginBottom: "4px",
    fontSize: "11px",
    color: "#6c757d",
    display: "inline-block",
    marginRight: "4px",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
  };

  return (
    <>
      {/* Bootstrap CSS */}
      <link
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
        rel="stylesheet"
      />
      <link
        href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css"
        rel="stylesheet"
      />

      <style jsx>{`
        .chat-icon-hover:hover {
          transform: scale(1.05);
          box-shadow: 0 12px 35px rgba(0, 0, 0, 0.25) !important;
        }

        .chat-header-hover:hover {
          background: linear-gradient(
            135deg,
            #5a6fd8 0%,
            #6a4190 100%
          ) !important;
        }

        .message-hover:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
        }

        .chat-input-focus:focus {
          border-color: #667eea !important;
          box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.2) !important;
        }

        .btn-chat-save {
          background: #667eea;
          border-color: #667eea;
          transition: all 0.2s ease;
        }

        .btn-chat-save:hover {
          background: #5a6fd8;
          border-color: #5a6fd8;
        }

        .btn-chat-edit {
          color: #667eea;
          border-color: #667eea;
          background: transparent;
          transition: all 0.2s ease;
        }

        .btn-chat-edit:hover {
          background: #667eea;
          border-color: #667eea;
          color: white;
        }

        .unread-badge-animation {
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.1);
          }
          100% {
            transform: scale(1);
          }
        }

        .chat-scrollbar::-webkit-scrollbar {
          width: 6px;
        }

        .chat-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 3px;
        }

        .chat-scrollbar::-webkit-scrollbar-thumb {
          background: #c1c1c1;
          border-radius: 3px;
        }

        .chat-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #a1a1a1;
        }

        @media (max-width: 768px) {
          .chat-container-mobile {
            width: ${isOpen ? "350px" : "60px"} !important;
            height: ${isOpen ? "50vh" : "60px"} !important;
          }

          .chat-icon-mobile {
            width: 60px !important;
            height: 60px !important;
            background-size: 35px 35px !important;
          }
        }

        @media (max-width: 480px) {
          .chat-container-mobile {
            width: ${isOpen ? "300px" : "55px"} !important;
            height: ${isOpen ? "45vh" : "55px"} !important;
          }

          .chat-icon-mobile {
            width: 55px !important;
            height: 55px !important;
            background-size: 30px 30px !important;
          }
        }
      `}</style>

      <div style={containerStyle} className="chat-container-mobile">
        {!isOpen ? (
          <div
            style={chatIconStyle}
            className="chat-icon-hover chat-icon-mobile position-relative"
            onClick={toggleChat}
          >
            {unreadCount > 0 && (
              <span
                className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger unread-badge-animation"
                style={{ fontSize: "10px", minWidth: "20px" }}
              >
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
          </div>
        ) : (
          <>
            {/* Notification Section */}
            <div style={notifyStyle} className="chat-scrollbar">
              {NotifyHistory.slice(0, 9).map((msg, index) => (
                <div key={index} style={notificationItemStyle}>
                  <i className="bi bi-info-circle me-1"></i>
                  {msg.text} <small className="text-muted">({msg.time})</small>
                </div>
              ))}
            </div>

            {/* User Name Section */}
            {isEditingName ? (
              <div style={notifyNameStyle}>
                <div className="d-flex align-items-center">
                  <input
                    type="text"
                    className="form-control form-control-sm me-2 chat-input-focus"
                    value={userName}
                    onChange={handleNameChange}
                    placeholder="Nhập tên (tối đa 8 ký tự)"
                    maxLength={8}
                    style={{ borderRadius: "6px", fontSize: "0.9rem" }}
                  />
                  <button
                    className="btn btn-sm btn-chat-save text-white"
                    onClick={saveUserName}
                    style={{ borderRadius: "6px", fontSize: "0.8rem" }}
                  >
                    <i className="bi bi-check-lg"></i>
                  </button>
                </div>
              </div>
            ) : isOpen ? (
              <div style={notifyNameStyle}>
                <div className="d-flex justify-content-between align-items-center">
                  <span className="fw-medium text-dark">
                    <i className="bi bi-person-circle me-1"></i>
                    {userName || "Guest"}
                  </span>
                  <button
                    className="btn btn-outline-primary btn-sm btn-chat-edit"
                    onClick={handleEditName}
                    style={{ borderRadius: "6px", fontSize: "0.75rem" }}
                  >
                    <i className="bi bi-pencil me-1"></i>
                    Đổi tên
                  </button>
                </div>
              </div>
            ) : null}

            {/* Chat Header */}
            <div
              style={headerStyle}
              className="chat-header-hover"
              onClick={toggleChat}
            >
              <div className="d-flex align-items-center">
                <div
                  className="me-2 rounded-circle d-flex align-items-center justify-content-center"
                  style={{
                    width: "28px",
                    height: "28px",
                    backgroundImage: `url('https://i.postimg.cc/Bv9MGGy8/favicon-ico.png')`,
                    backgroundSize: "18px 18px",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                    backgroundColor: "rgba(255, 255, 255, 0.2)",
                  }}
                ></div>
                <div>
                  <div className="fw-semibold">
                    Chat{" "}
                    {unreadCount > 0 && (
                      <span
                        className="badge bg-danger ms-1"
                        style={{ fontSize: "0.7rem" }}
                      >
                        {unreadCount}
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: "0.8rem", opacity: 0.9 }}>
                    {userName || "Guest"} • Online: {onlineNumber}
                  </div>
                </div>
              </div>
              <i
                className="bi bi-chevron-down"
                style={{ fontSize: "1.2rem" }}
              ></i>
            </div>

            {/* Chat Messages */}
            <ul style={historyStyle} className="chat-scrollbar">
              {chatHistory.length === 0 ? (
                <div className="text-center text-muted py-4">
                  <i
                    className="bi bi-chat-dots display-6 d-block mb-2"
                    style={{ opacity: 0.5 }}
                  ></i>
                  <p className="mb-0">Chưa có tin nhắn nào</p>
                </div>
              ) : (
                chatHistory.map((msg, index) => (
                  <li
                    key={index}
                    style={messageStyle}
                    className="message-hover"
                  >
                    <div>
                      {msg.text.includes("http://") ||
                      msg.text.includes("https://")
                        ? tachStringTheoHttp(msg.text).map((e, i) =>
                            e.includes("http://") || e.includes("https://") ? (
                              <div key={i}>
                                <br />
                                <button
                                  className="btn btn-primary btn-sm"
                                  style={{
                                    borderRadius: "8px",
                                    background:
                                      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                                    border: "none",
                                  }}
                                  onClick={() => {
                                    SpeechRecognition.stopListening();
                                    try {
                                      const parsedUrl = new URL(e);
                                      const pathOnly =
                                        parsedUrl.pathname + parsedUrl.search;
                                      const isPhamVanDien =
                                        e.includes("/phamvandien.id.vn");
                                      const isCurrentPhamVanDien =
                                        window.location.href.includes(
                                          "/phamvandien.id.vn"
                                        );

                                      if (
                                        (isPhamVanDien &&
                                          isCurrentPhamVanDien) ||
                                        !isPhamVanDien
                                      ) {
                                        window.location.href = e;
                                        return;
                                      }

                                      if (e.includes("/roomoffline")) {
                                        navigate("/");
                                        setTimeout(() => {
                                          navigate(pathOnly);
                                        }, 500);
                                      } else {
                                        navigate(pathOnly);
                                      }
                                    } catch (err) {
                                      console.error(
                                        "Lỗi URL không hợp lệ:",
                                        err
                                      );
                                    }
                                  }}
                                >
                                  <i className="bi bi-link-45deg me-1"></i>
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
                    <div
                      className="text-end mt-2"
                      style={{ fontSize: "0.75rem", color: "#6c757d" }}
                    >
                      <i className="bi bi-clock me-1"></i>
                      {msg.time}{" "}
                      {msg.text.includes("roomoffline") && (
                        <span className="text-primary">
                          <i className="bi bi-laptop me-1"></i>
                          LÀM BÀI THỰC HÀNH
                        </span>
                      )}
                    </div>
                  </li>
                ))
              )}
              <div ref={chatEndRef} />
            </ul>

            <ChatInput />
          </>
        )}
      </div>
    </>
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
  const matches = str.match(regex);
  if (!matches) return [str];

  // Tách chuỗi thành một mảng với phần không phải URL và URL
  const result = str.split(regex).reduce((arr, part, index) => {
    arr.push(part.trim()); // Thêm phần không phải URL vào mảng
    if (index < matches.length) {
      arr.push(matches[index]); // Thêm URL vào mảng
    }
    return arr;
  }, []);

  return result;
}
