import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { socket } from "../App";
import "bootstrap/dist/css/bootstrap.min.css";
import PracticeDIV from "./pracPages/B101_FINAL_PROJECTS";
import CountdownTimer from "./pracPages/B101_FINAL_CounterTime";
import LinkAPI from "../ulti/T0_linkApi";

import ImageGuessingGame from "./miniGame/ImageGuessingGame";
const Room = ({ setSttRoom }) => {
  const { roomCode } = useParams();
  const [users, setUsers] = useState([]);
  const [userClient, setUserClient] = useState({});
  const [isReady, setIsReady] = useState(false);
  const [allReady, setAllReady] = useState(false);
  const [roomInfo, setRoomInfo] = useState(null);
  const [numberBegin, setNumberBegin] = useState(0);
  const [incrementReady, setIncrementReady] = useState(false);
  const [incrementAllReady, setIncrementAllReady] = useState(false);
  const [userName, setUserName] = useState("");
  const [DataPracticingCharactor, setDataPracticingCharactor] = useState(null);
  const [DataPracticingOverRoll, setDataPracticingOverRoll] = useState(null);
  const [Score, setScore] = useState(0);
  const [ScoreMinigame, setScoreMinigame] = useState(0);
  const [STTBeforeAllNewPlay, setSTTBeforeAllNewPlay] = useState(false);
  const [MessageConsole, setMessageConsole] = useState("");
  const [IsPause, setIsPause] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    setIncrementReady(false);
  }, [numberBegin]);

  useEffect(() => {
    socket.emit("updateOneELEMENT", roomCode, socket.id, "isPause", IsPause);
    if (!IsPause) {
      handleIncrementReadyClick();
    }
  }, [IsPause]);

  useEffect(() => {
    setSttRoom(true);
    socket.emit("joinRoom", roomCode);
    const handleRoomDoesNotExist = () => navigate("/noexist");
    const handleUpdateRoom = (
      updatedUsers,
      updatedAllReady,
      roomInfo,
      numberBegin,
      incrementAllReady
    ) => {
      setAllReady(updatedAllReady);
      setRoomInfo(roomInfo);

      setUsers(updatedUsers);
      setUserClient(updatedUsers.find((user) => user.id === socket.id));
      if (!IsPause) {
        setNumberBegin(numberBegin);
      }
      setIncrementAllReady(incrementAllReady);
    };
    const handleUserReadyStateChange = (userId, newIsReady) => {
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId ? { ...user, isReady: newIsReady } : user
        )
      );
    };

    socket.on("roomDoesNotExist", handleRoomDoesNotExist);
    socket.on("updateRoom", handleUpdateRoom);
    socket.on("userReadyStateChange", handleUserReadyStateChange);

    return () => {
      socket.off("roomDoesNotExist", handleRoomDoesNotExist);
      socket.off("updateRoom", handleUpdateRoom);
      socket.off("userReadyStateChange", handleUserReadyStateChange);
    };
  }, [roomCode]);

  useEffect(() => {
    if (allReady && roomInfo !== null) {
      const fetchTitle = async () => {
        try {
          const response = await fetch(`/jsonData/${roomInfo.fileName}.json`);
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          const data = await response.json();
          setDataPracticingOverRoll(data);

          setDataPracticingCharactor(
            interleaveCharacters(
              data,
              roomInfo.objList,
              roomInfo.interleaving,
              roomInfo.reverse
            )
          );
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };

      fetchTitle();
    }
  }, [allReady, roomInfo]);

  useEffect(() => {
    if (numberBegin === 0) {
      handleIncrementReadyClick();
    }
  }, []);

  const handleReadyClick = () => {
    setIsReady((prev) => !prev);
    socket.emit("userReadyChange", roomCode, !isReady);
  };

  const handleIncrementReadyClick = () => {
    setIncrementReady(true);
    socket.emit("incrementReadyChange", roomCode, true);
  };

  const handleUpdateName = (userId, newUserName) => {
    socket.emit("updateUserName", roomCode, userId, newUserName);
  };
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && userName.length > 0) {
      handleUpdateName(socket.id, userName);
      setUserName("");
    }
  };
  const handleScoreChange = (newScore) => {
    socket.emit("updateOneELEMENT", roomCode, socket.id, "score", newScore);
  };
  useEffect(() => {
    // setMessageConsole(Score);
    handleScoreChange(Score);
  }, [Score]);

  useEffect(() => {
    if (ScoreMinigame > 0) {
      handleUpdateNewElenment("win", ScoreMinigame);
    }
  }, [ScoreMinigame]);

  useEffect(() => {
    if (STTBeforeAllNewPlay && incrementAllReady) {
      socket.emit("incrementNumberBegin", roomCode);
      setSTTBeforeAllNewPlay(false);
    }
  }, [STTBeforeAllNewPlay, incrementAllReady, roomCode]);

  function sortedUsers(users) {
    return [...users].sort((a, b) => b.score - a.score);
  }

  const handleUpdateNewElenment = (newElement, newValue) => {
    socket.emit("updateOneELEMENT", roomCode, socket.id, newElement, newValue);
  };
  const objCardOwn = {
    backgroundColor: "yellow",
    border: "2px solid black",
    borderRadius: "5px",
  };

  return (
    <div
      className="container mt-4"
      style={{ border: "1px solid green", borderRadius: "5px", padding: "2%" }}
    >
      {/* <div>{MessageConsole}</div> */}
      {allReady && DataPracticingOverRoll !== null ? (
        <div>
          <PracticeDIV
            DataPracticingOverRoll={DataPracticingOverRoll}
            DataPracticingCharactor={DataPracticingCharactor}
            Score={Score}
            setScore={setScore}
            numberBegin={numberBegin}
            TimeDefault={roomInfo.timeDefault || 120}
            handleIncrementReadyClick={handleIncrementReadyClick}
            IsPause={IsPause}
          />
          <div>
            {incrementAllReady && !userClient.isPause ? (
              <div>
                <CountdownTimer
                  setSTT={setSTTBeforeAllNewPlay}
                  STT={true}
                  TIME={3}
                />
              </div>
            ) : null}
            {!incrementAllReady && incrementReady && !userClient.isPause ? (
              <h1>Waiting for others . . . </h1>
            ) : null}
          </div>
        </div>
      ) : null}
      <hr />
      {incrementReady || IsPause ? (
        <div className="row">
          {sortedUsers(users).map((user, userIndex) => (
            <div
              key={userIndex}
              style={{
                border:
                  socket.id === user.id ? "5px solid green" : "1px solid black",
                display: "inline",
                width: "150px",
                padding: "10px",
                margin: "5px",
                borderRadius: "10px",
              }}
            >
              {numberBegin !== 0 ? (
                <div>
                  <i> {user.name}</i>
                  <br />
                  score: {user.score} | G: {user.win}
                  <br />
                  {user.isPause ? (
                    <b>Đang tạm dừng</b>
                  ) : user.incrementReady ? (
                    <b>Đang sẵn sàng</b>
                  ) : (
                    <b>Đang làm bài</b>
                  )}
                </div>
              ) : null}

              {numberBegin === 0
                ? user.isReady
                  ? "Đã sẵn sàng"
                  : "Chưa sẵn sàng"
                : null}
            </div>
          ))}{" "}
        </div>
      ) : null}
      <hr />
      <div className="row">
        {numberBegin === 0 ? (
          <div className="col-3">
            <button className="btn btn-primary" onClick={handleReadyClick}>
              Sẵn sàng bắt đầu
            </button>
          </div>
        ) : (
          <>
            {" "}
            <div className="col-7">
              {" "}
              <div style={{ display: "flex", alignItems: "center" }}>
                <input
                  className="form-control"
                  type="text"
                  placeholder="Chat with others or update name | Enter"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  onKeyUp={handleKeyPress}
                />
              </div>
            </div>
            <div className="col-5">
              {" "}
              <button
                onClick={() => {
                  setIsPause(!IsPause);
                }}
                className="btn btn-primary"
              >
                {IsPause ? "Bạn đang tạm dừng | Bấm => Tiếp tục" : "Tạm dừng"}
              </button>
            </div>
          </>
        )}
      </div>
      {LinkAPI.includes(":5000") ? (
        <div>
          {LinkAPI}
          <br />
          {JSON.stringify(users)} <br /> {JSON.stringify(incrementAllReady)}
          <br />
          {/* {JSON.stringify(userClient)} */}
          <br />
          <button
            onClick={() => {
              if (userClient.win) {
                handleUpdateNewElenment("win", userClient.win + 1);
              } else {
                handleUpdateNewElenment("win", 1);
              }
            }}
          >
            WIN++
          </button>
          <br />
          {/* {ScoreMinigame} */}
          <br />
        </div>
      ) : null}
      <hr />{" "}
      {/* <ImageGuessingGame
        setScoreMinigame={setScoreMinigame}
        ScoreMinigame={ScoreMinigame}
      /> */}
    </div>
  );
};

export default Room;

function extendSubarrays(arr, targetLength) {
  return arr.map((subArr) => {
    if (!Array.isArray(subArr)) return [];
    const extended = [];
    let i = 0;
    while (extended.length < targetLength) {
      extended.push(subArr[i % subArr.length]);
      i++;
    }
    return extended;
  });
}

function interleaveCharacters(array1, array2, interleaving, reverse) {
  // Ensure all subarrays in array1 are extended to have the same length
  const maxSubArrLength = Math.max(
    ...array1.map((subArr) => subArr.charactor?.length || 0)
  );
  const extendedArray1 = array1.map((item) => ({
    ...item,
    charactor: extendSubarrays([item.charactor || []], maxSubArrLength)[0],
  }));

  let res = [];
  let indexes = array2.map((index) => ({ index, subIndex: 0 })); // Track sub-index for each array element

  let active = true;
  while (active) {
    active = false; // This will be set to true if we add any characters in this pass
    for (let i = 0; i < indexes.length; i++) {
      let { index, subIndex } = indexes[i];
      if (subIndex < extendedArray1[index].charactor.length) {
        let count = Math.min(
          interleaving,
          extendedArray1[index].charactor.length - subIndex
        );
        for (let j = 0; j < count; j++) {
          res.push(extendedArray1[index].charactor[subIndex + j]);
        }
        indexes[i].subIndex += interleaving; // Move the sub-index forward
        active = true; // We've added characters, so we continue
      }
    }
  }

  if (reverse) {
    res = splitAndConcatArray(res, reverse);
  }

  return res;
}
function splitAndConcatArray(arr, n) {
  // Lấy phần trăm n của m
  const m = arr.length;
  const index = Math.ceil((n / 10) * m);

  // Tách mảng thành hai phần
  const arr1 = arr.slice(0, index);
  const arr2 = arr.slice(index);

  // Ghép hai mảng lại với nhau
  const newArray = arr2.concat(arr1);

  return newArray;
}
