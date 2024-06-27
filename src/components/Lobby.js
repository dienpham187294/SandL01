import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { socket } from "../App";
import "bootstrap/dist/css/bootstrap.min.css";
import ChatInput from "./ChatInput";
import ChatList from "./ChatList";

const Lobby = ({
  STTconnectFN,
  setSttRoom,
  fileName,
  objList,
  objListDefault,
  custom,
}) => {
  const navigate = useNavigate();
  const [roomName, setRoomName] = useState("");
  const [userName, setUserName] = useState("");
  const [roomList, setRoomList] = useState([]);
  const [timeDefault, setTimeDefault] = useState(120);
  const [selectedIndices, setSelectedIndices] = useState([]);

  useEffect(() => {
    const defaultIndices = objListDefault.map((item) => objList.indexOf(item));
    setSelectedIndices(defaultIndices);
  }, [objListDefault, objList]);

  function randomBoolean() {
    return Math.random() >= 0.5;
  }

  function randomOneOrTwo() {
    return Math.random() >= 0.5 ? 1 : 2;
  }

  const handleCreateRoom = () => {
    const finalObjList =
      custom && selectedIndices.length > 0
        ? shuffleArray(
            objList.filter((_, index) => selectedIndices.includes(index))
          )
        : objListDefault;
    const objInformationOfGame = {
      objList: finalObjList,
      fileName,
      interleaving: randomOneOrTwo(),
      reverse: randomBoolean(),
      timeDefault,
      roomName,
    };
    socket.emit("createRoom", objInformationOfGame, (newRoomCode) => {
      socket.emit("setUserName", userName);
      navigate(`/room/${newRoomCode}`);
    });
  };

  const handleJoinRoom = (roomCode) => {
    if (roomCode.trim()) {
      navigate(`/room/${roomCode}`);
    }
  };

  useEffect(() => {
    setSttRoom(false);
    socket.emit("getRoomList");
    socket.on("roomListUpdate", (updatedRoomList) => {
      setRoomList(updatedRoomList);
    });
    return () => socket.off("roomListUpdate");
  }, []);

  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  const selectAll = () => {
    const allIndices = objList.map((_, index) => index);
    setSelectedIndices(allIndices);
  };

  const deselectAll = () => {
    setSelectedIndices([]);
  };

  return (
    <div
      className="container mt-4"
      style={{
        border: "1px solid green",
        borderRadius: "10px",
        margin: "5%",
        padding: "5%",
      }}
    >
      {STTconnectFN ? (
        <div>
          {" "}
          <div className="row">
            <div className="col-6">
              <h1 className="mb-4">Lobby</h1>
              <div className="mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter room name"
                  value={roomName}
                  onChange={(e) => setRoomName(e.target.value)}
                />
              </div>
              <button
                className="btn btn-primary mb-4"
                onClick={handleCreateRoom}
                disabled={
                  roomName.length <= 2 ||
                  (custom && selectedIndices.length === 0)
                }
              >
                Create Room | Tạo phòng
              </button>
              <div className="mb-3" style={{ width: "200px" }}>
                <label htmlFor="timeSelect">Default Time (s): </label>
                <select
                  id="timeSelect"
                  className="form-control"
                  value={timeDefault}
                  onChange={(e) => setTimeDefault(Number(e.target.value))}
                >
                  {Array.from({ length: 28 }, (_, i) => 10 + i * 10).map(
                    (time) => (
                      <option key={time} value={time}>
                        {time}
                      </option>
                    )
                  )}
                </select>
              </div>
              {custom && (
                <div
                  style={{
                    border: "1px solid green",
                    borderRadius: "5px",
                    padding: "15px",
                  }}
                >
                  <h4>Chọn phần thực hành:</h4>
                  <button
                    className="btn btn-secondary mb-2"
                    onClick={selectAll}
                  >
                    Chọn hết
                  </button>
                  <button
                    className="btn btn-secondary mb-2 ml-2"
                    onClick={deselectAll}
                  >
                    Hủy chọn hết
                  </button>
                  <div>
                    {objList.map((item, index) => (
                      <label
                        key={index}
                        style={{ display: "inline-block", marginRight: "10px" }}
                      >
                        <input
                          type="checkbox"
                          style={{ transform: "scale(1.8)" }}
                          checked={selectedIndices.includes(index)}
                          onChange={() => {
                            setSelectedIndices((prev) =>
                              prev.includes(index)
                                ? prev.filter((i) => i !== index)
                                : [...prev, index]
                            );
                          }}
                        />{" "}
                        Bài {index + 1}
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="col-6">
              <ChatInput />
              <ChatList />
            </div>
          </div>
          <hr />
          <div className="row">
            {roomList
              .filter((room) => !room.allReady)
              .map((room) => (
                <div className="col-md-4 mb-4" key={room.roomCode}>
                  <div className="card">
                    <div className="card-body">
                      <h5 className="card-title">{room.roomInfo.roomName}</h5>
                      <button
                        className="btn btn-secondary"
                        onClick={() => handleJoinRoom(room.roomCode)}
                      >
                        Join | Tham gia
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      ) : (
        <h1>Đang kết nối với server, vui lòng đợi giây lát . . .</h1>
      )}
    </div>
  );
};

export default Lobby;
