import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { socket } from "../App";
import "bootstrap/dist/css/bootstrap.min.css";
import PracticeDIV from "./pracPages/B101_FINAL_PROJECTS";
import CountdownTimer from "./pracPages/B101_FINAL_CounterTime";

const Room = ({ setSttRoom }) => {
  const { roomCode } = useParams();
  const [users, setUsers] = useState([]);
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
  const [STTBeforeAllNewPlay, setSTTBeforeAllNewPlay] = useState(false);
  const [MessageConsole, setMessageConsole] = useState("");
  const [IsPause, setIsPause] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    setIncrementReady(false);
  }, [numberBegin]);

  useEffect(() => {
    socket.emit("updateOneELEMENT", roomCode, socket.id, "isPause", IsPause);
  }, [IsPause]);

  useEffect(() => {
    setSttRoom(true);
    socket.emit("joinRoom", roomCode);

    socket.on("roomDoesNotExist", () => {
      navigate("/noexist");
    });

    socket.on(
      "updateRoom",
      (
        updatedUsers,
        updatedAllReady,
        roomInfo,
        numberBegin,
        incrementAllReady
      ) => {
        setAllReady(updatedAllReady);
        setUsers(updatedUsers);
        setRoomInfo(roomInfo);
        setNumberBegin(numberBegin);
        setIncrementAllReady(incrementAllReady);
      }
    );

    socket.on("userReadyStateChange", (userId, newIsReady) => {
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId ? { ...user, isReady: newIsReady } : user
        )
      );
    });

    return () => {
      socket.off("updateRoom");
      socket.off("userReadyStateChange");
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

  const handleScoreChange = (newScore) => {
    socket.emit("updateOneELEMENT", roomCode, socket.id, "score", newScore);
  };
  useEffect(() => {
    // setMessageConsole(Score);
    handleScoreChange(Score);
  }, [Score]);

  useEffect(() => {
    if (STTBeforeAllNewPlay && incrementAllReady) {
      socket.emit("incrementNumberBegin", roomCode);
      setSTTBeforeAllNewPlay(false);
    }
  }, [STTBeforeAllNewPlay, incrementAllReady, roomCode]);

  function sortedUsers(users) {
    return [...users].sort((a, b) => b.score - a.score);
  }

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
      {/* {JSON.stringify(users)} <br /> {JSON.stringify(incrementAllReady)} */}
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
            {incrementAllReady ? (
              <div>
                <CountdownTimer
                  setSTT={setSTTBeforeAllNewPlay}
                  STT={true}
                  TIME={3}
                />
              </div>
            ) : null}
            {!incrementAllReady && incrementReady ? (
              <h1>Waiting for others . . . </h1>
            ) : null}

            {incrementReady ? (
              <div className="row">
                <hr />
                {sortedUsers(users).map((user) => (
                  <div className="col-md-2 mb-2" key={user.id}>
                    <div
                      className="card"
                      style={user.id === socket.id ? objCardOwn : {}}
                    >
                      <div className="card-body">
                        {user.name === "Unknown" && user.id === socket.id ? (
                          <div>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Enter your name"
                              value={userName}
                              onChange={(e) => setUserName(e.target.value)}
                            />
                            <button
                              className="btn btn-primary mt-2"
                              onClick={() =>
                                handleUpdateName(user.id, userName)
                              }
                              disabled={userName.length <= 2}
                            >
                              Update Name
                            </button>
                          </div>
                        ) : null}
                        <h5 className="card-title">{user.name}</h5>
                        <p>Score: {user.score}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      ) : (
        <div>
          <p>Users in room:</p>
          <div className="row">
            {users.map((user) => (
              <div className="col-md-2 mb-2" key={user.id}>
                <div className="card">
                  <div
                    className="card-body"
                    style={
                      user.id === socket.id
                        ? objCardOwn
                        : user.isReady
                        ? { backgroundColor: "greenyellow" }
                        : {}
                    }
                  >
                    {user.name === "Unknown" && user.id === socket.id ? (
                      <div>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Enter your name"
                          value={userName}
                          onChange={(e) => setUserName(e.target.value)}
                        />
                        <button
                          className="btn btn-primary mt-2"
                          onClick={() => handleUpdateName(user.id, userName)}
                          disabled={userName.length <= 2}
                        >
                          Update Name
                        </button>
                      </div>
                    ) : (
                      <>
                        <h5 className="card-title">{user.name}</h5>
                        <p>{user.isReady ? "Ready" : "Not Ready"}</p>
                        <p>Score: {user.score}</p>
                        {user.id === socket.id && (
                          <button
                            className="btn btn-secondary"
                            onClick={handleReadyClick}
                            disabled={user.name === "Unknown"}
                          >
                            {isReady ? "Not Ready" : "Ready"}
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      <hr />

      <button
        onClick={() => {
          setIsPause(!IsPause);
        }}
        className="btn btn-outline-secondary"
      >
        {IsPause ? "Tiếp tục" : "Tạm dừng"}
      </button>
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
    res.reverse();
  }

  return res;
}
