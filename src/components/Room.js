import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { socket } from "../App";
import "bootstrap/dist/css/bootstrap.min.css";
import PracticeDIV from "./pracPages/B101_FINAL_PROJECTS";
import CountdownTimer from "./pracPages/B101_FINAL_CounterTime";
import LinkAPI from "../ulti/T0_linkApi";
import Section01 from "./Section01";
const Room = ({ setSttRoom }) => {
  const { roomCode } = useParams();
  const [users, setUsers] = useState(null);
  const [roomInfo, setRoomInfo] = useState(null);
  const [IndexSets, setIndexSets] = useState(null);
  const [userClient, setUserClient] = useState(null);

  const [allReady, setAllReady] = useState(false);

  // const [AllReadyForPlay, setAllReadyForPlay] = useState(false);

  const [numberBegin, setNumberBegin] = useState(0);
  const [SttCoundown, setSttCoundown] = useState("00");

  const [DataPracticingCharactor, setDataPracticingCharactor] = useState(null);
  const [DataPracticingOverRoll, setDataPracticingOverRoll] = useState(null);
  const [Score, setScore] = useState(0);
  const [NumberOneByOneHost, setNumberOneByOneHost] = useState(0);
  const [Message, setMessage] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    handleUpdateNewElenment("score", Score, "normal");
  }, [Score]);
  useEffect(() => {
    try {
      const idSocket = socket.id.slice(0, 4);
      socket.emit("messageReg", { text: "[" + idSocket + "] " + Message });
    } catch (error) {}
  }, [Message]);

  useEffect(() => {
    setSttRoom(true);
    socket.emit("joinRoom", roomCode);

    const handleRoomDoesNotExist = () => navigate("/noexist");

    const handleUpdateRoomInfo = (roomInfo) => {
      setRoomInfo(roomInfo);
    };

    const handleUpdateUsers = (updatedUsers) => {
      setUsers(updatedUsers);
      setUserClient(updatedUsers.find((user) => user.id === socket.id));
    };

    const handleUpdateNumberBegin = (numberBegin) => {
      if (userClient === null) {
        if (numberBegin > 0) {
          setNumberBegin(numberBegin);
          setSttCoundown("01");
        }
      } else {
        if (!userClient.isPause) {
          setNumberBegin(numberBegin);
          setSttCoundown("01");
        }
      }
    };

    // You can then call these functions where needed
    const handleUpdateRoom = (dataObj) => {
      console.log(dataObj);
      if (dataObj.allReady !== undefined) {
        setAllReady(dataObj.allReady);
      }
      if (dataObj.roomInfo) {
        handleUpdateRoomInfo(dataObj.roomInfo);
      }
      if (dataObj.users) {
        handleUpdateUsers(dataObj.users);
      }
      if (dataObj.numberBegin) {
        handleUpdateNumberBegin(dataObj.numberBegin);
      }
      if (dataObj.indexSets) {
        setIndexSets(dataObj.indexSets);
      }
    };

    socket.on("roomDoesNotExist", handleRoomDoesNotExist);
    socket.on("updateRoom", handleUpdateRoom);

    return () => {
      socket.off("roomDoesNotExist", handleRoomDoesNotExist);
      socket.off("updateRoom", handleUpdateRoom);
    };
  }, []);

  useEffect(() => {
    if (roomInfo !== null) {
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
              roomInfo.reverse,
              userClient.host,
              handleUpdateIndexSets
            )
          );
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };

      fetchTitle();
    }
  }, [roomInfo]);

  function getActiveUsers(users) {
    // Lọc tất cả các users có isPause bằng false
    return users.filter((user) => !user.isPause);
  }

  function hasHost(users) {
    return users.some((user) => user.host === true);
  }

  useEffect(() => {
    try {
      const activeUsers = getActiveUsers(users);

      const pracMode = roomInfo?.pracMode;

      if (activeUsers.length < 2 && pracMode !== "Normal") {
        if (allReady) {
          handleUpdateNewElenment("a1", "a1", "reset");
        }
        setNumberOneByOneHost("Less4");
        return;
      }

      if (pracMode === "Normal") {
        setNumberOneByOneHost(0);
        return;
      }

      if (pracMode === "By host") {
        if (hasHost(activeUsers)) {
          setNumberOneByOneHost(userClient.host ? 1 : 2);
        } else {
          setNumberOneByOneHost("Nohost");
        }
        return;
      }

      if (pracMode === "One by one") {
        const currentUserId =
          activeUsers[(numberBegin - 1) % activeUsers.length]?.id;
        setNumberOneByOneHost(socket.id === currentUserId ? 1 : 2);
        return;
      }
    } catch (error) {
      console.error("Error in useEffect:", error);
    }
  }, [users, numberBegin, userClient, roomInfo]);

  const handleUpdateNewElenment = (key, value, mode) => {
    socket.emit("updateOneELEMENT", roomCode, socket.id, key, value, mode);
  };

  const handleUpdateIndexSets = (value) => {
    socket.emit("updateRoomInfoIndexSets", roomCode, value);
  };

  if (users === null || roomInfo === null) {
    return <div>Đợi trong giây lát . . .</div>;
  }

  if (NumberOneByOneHost === "Less4") {
    return (
      <div className="container mt-4">
        <h2>Số lượng thành viên sẵn sàng dưới 2! Vui lòng đợi thêm người!</h2>
      </div>
    );
  }

  if (!allReady) {
    return (
      <div className="container mt-4">
        <h1>Sảnh</h1>
        <Section01
          allReady={allReady}
          users={users}
          userClient={userClient}
          numberBegin={numberBegin}
          handleReadyClick={() => handleUpdateNewElenment("isReady", true)}
          handleUpdateNewElenment={handleUpdateNewElenment}
          sttFirst={true}
        />
      </div>
    );
  }
  if (userClient !== null) {
    if (userClient.isPause) {
      return (
        <div className="container mt-4">
          <h1>Đang tạm dừng</h1>
          <hr />
          <Section01
            allReady={allReady}
            users={users}
            userClient={userClient}
            numberBegin={numberBegin}
            handleReadyClick={() => handleUpdateNewElenment("isReady", true)}
            handleUpdateNewElenment={handleUpdateNewElenment}
            sttFirst={true}
          />
        </div>
      );
    }
  }
  if (SttCoundown === "02" && userClient.incrementReady) {
    return (
      <div className="container mt-4">
        <h1>Đợi mọi người hoàn thành lượt {numberBegin}!</h1>
        <hr />
        <Section01
          allReady={allReady}
          users={users}
          userClient={userClient}
          numberBegin={numberBegin}
          handleReadyClick={() => handleUpdateNewElenment("isReady", true)}
          handleUpdateNewElenment={handleUpdateNewElenment}
          sttFirst={true}
        />
      </div>
    );
  }

  if (NumberOneByOneHost === "Nohost") {
    return (
      <div>
        <h1>Chủ phòng đã rời đi hoặc tạm dừng!</h1>
      </div>
    );
  }

  return (
    <div
      style={{
        border: "1px solid green",
        borderRadius: "5px",
        padding: "20px 20px",
      }}
    >
      <div>
        <Section01
          allReady={allReady}
          users={users}
          userClient={userClient}
          numberBegin={numberBegin}
          handleReadyClick={() => handleUpdateNewElenment("isReady", true)}
          handleUpdateNewElenment={handleUpdateNewElenment}
        />
      </div>

      {SttCoundown === "01" ? (
        <CountdownTimer setSTT={setSttCoundown} STT={"02"} TIME={3} />
      ) : null}

      {SttCoundown === "02" && !userClient.incrementReady ? (
        <div>
          <PracticeDIV
            DataPracticingOverRoll={DataPracticingOverRoll}
            DataPracticingCharactor={DataPracticingCharactor}
            Score={Score}
            setScore={setScore}
            numberBegin={numberBegin}
            indexSets={
              IndexSets
                ? IndexSets[numberBegin % IndexSets.length]
                : numberBegin
            }
            TimeDefault={roomInfo.timeDefault || 120}
            handleIncrementReadyClick={() =>
              handleUpdateNewElenment("incrementReady", true)
            }
            IsPause={userClient.isPause}
            NumberOneByOneHost={NumberOneByOneHost}
            tableView={roomInfo.tableView}
            setMessage={setMessage}
          />
        </div>
      ) : null}

      <div id="section05">
        {" "}
        {LinkAPI.includes(":5000") ? (
          <div>
            {" "}
            <hr />
            {LinkAPI}
            <hr />
            NumberBegin {numberBegin} |{" "}
            {IndexSets
              ? IndexSets[numberBegin % IndexSets.length]
              : numberBegin}
            <hr />
            AllReady {JSON.stringify(allReady)}
            <hr />
            <br />
            <i>Roominfo:</i>
            <br />
            {JSON.stringify(roomInfo)}
            <br />
            ONE BY ONE: {JSON.stringify(NumberOneByOneHost)}
            <br />
            {JSON.stringify(users)} <br /> <br />
            <hr />
            <button
              onClick={() => {
                handleUpdateNewElenment("isReady", true);
              }}
            >
              ALLReady
            </button>
            <button
              onClick={() => {
                handleUpdateNewElenment("isPause", !userClient.isPause);
              }}
            >
              isPause
            </button>
            <button
              onClick={() => {
                handleUpdateNewElenment("incrementReady", true);
              }}
            >
              ready
            </button>
            <br />
          </div>
        ) : null}
        <hr />
      </div>
    </div>
  );
};

export default Room;

function interleaveCharacters(
  array1,
  array2,
  reverse,
  host,
  handleUpdateIndexSets
) {
  const numberGetPerOne = Math.floor(200 / array2.length);
  let arrRes = [];
  array2.forEach((e) => {
    let resTemp = splitAndConcatArray(array1[e].charactor, reverse).slice(
      0,
      numberGetPerOne
    );
    arrRes = arrRes.concat(resTemp);
  });
  if (host) {
    handleUpdateIndexSets(generateRandomArray(arrRes.length));
  }
  return arrRes;
}

function splitAndConcatArray(array, m) {
  const n = array.length;
  const splitIndex = Math.floor((n * m) / 10);

  const arr1 = array.slice(0, splitIndex);
  const arr2 = array.slice(splitIndex);

  const resultArray = arr2.concat(arr1);

  return resultArray;
}

function generateRandomArray(m) {
  let randomArray = [];
  for (let i = 0; i < m; i++) {
    randomArray.push(Math.floor(Math.random() * (m + 1)));
  }
  return randomArray;
}
