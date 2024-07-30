import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { socket } from "../App";
import "bootstrap/dist/css/bootstrap.min.css";
import PracticeDIV from "./pracPages/B101_FINAL_PROJECTS";
import CountdownTimer from "./pracPages/B101_FINAL_CounterTime";
import LinkAPI from "../ulti/T0_linkApi";

const Room = ({ setSttRoom }) => {
  const { roomCode } = useParams();

  const [users, setUsers] = useState(null);

  const [roomInfo, setRoomInfo] = useState(null);

  const [IndexSets, setIndexSets] = useState(null);

  const [userClient, setUserClient] = useState(null);

  const [allReady, setAllReady] = useState(false);

  // const [AllReadyForPlay, setAllReadyForPlay] = useState(false);

  const [IsPause, setIsPause] = useState(false);

  const [numberBegin, setNumberBegin] = useState(0);
  const [SttCoundown, setSttCoundown] = useState("00");

  const [DataPracticingCharactor, setDataPracticingCharactor] = useState(null);
  const [DataPracticingOverRoll, setDataPracticingOverRoll] = useState(null);
  const [Score, setScore] = useState(0);
  const [NumberOneByOneHost, setNumberOneByOneHost] = useState(0);

  useEffect(() => {
    try {
      const idSocket = socket.id.slice(0, 4);
      socket.emit("messageReg", {
        text: "[" + idSocket + "] " + Score + " Điểm",
      });
    } catch (error) {}
  }, [Score]);

  useEffect(() => {
    if (numberBegin !== 0) {
      setSttCoundown("01");
    }
  }, [numberBegin]);

  useEffect(() => {
    setSttRoom(true);
    socket.emit("joinRoom", roomCode);
    const handleUpdateRoomInfo = (roomInfo) => {
      setRoomInfo(roomInfo);
    };
    // You can then call these functions where needed
    const handleUpdateRoom = (dataObj) => {
      if (dataObj.roomInfo) {
        handleUpdateRoomInfo(dataObj.roomInfo);
      }

      if (dataObj.indexSets) {
        setIndexSets(dataObj.indexSets);
      }
    };

    socket.on("updateRoom", handleUpdateRoom);

    return () => {
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
              setIndexSets
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

  const handleUpdateNewElenment = (key, value, mode) => {
    socket.emit("updateOneELEMENT", roomCode, socket.id, key, value, mode);
  };

  const handleUpdateIndexSets = (value) => {
    socket.emit("updateRoomInfoIndexSets", roomCode, value);
  };

  if (roomInfo === null) {
    return <div className="container mt-3">Đợi trong giây lát . . .</div>;
  }
  if (DataPracticingCharactor === null) {
    return <div className="container mt-3">Đợi trong giây lát . . . . . .</div>;
  }

  if (IsPause) {
    return (
      <div className="container mt-3">
        Tạm dừng
        <hr />
        <button
          style={{ borderRadius: "5px", width: "100px" }}
          onClick={() => {
            setIsPause(!IsPause);
          }}
        >
          {IsPause ? "Tiếp tục" : "Tạm dừng"}
        </button>
        Điểm: {Score} / Lượt {numberBegin} |
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
      {numberBegin === 0 ? (
        <button
          style={{ borderRadius: "5px", width: "100px" }}
          onClick={() => {
            setNumberBegin((D) => D + 1);
          }}
        >
          Start
        </button>
      ) : (
        <button
          style={{ borderRadius: "5px", width: "100px" }}
          onClick={() => {
            setIsPause(!IsPause);
          }}
        >
          {IsPause ? "Tiếp tục" : "Tạm dừng"}
        </button>
      )}
      Điểm: {Score} / Lượt {numberBegin} |
      {SttCoundown === "01" ? (
        <CountdownTimer setSTT={setSttCoundown} STT={"02"} TIME={3} />
      ) : null}
      {SttCoundown === "02" ? (
        <div>
          <PracticeDIV
            DataPracticingOverRoll={DataPracticingOverRoll}
            DataPracticingCharactor={DataPracticingCharactor}
            Score={Score}
            setScore={setScore}
            numberBegin={numberBegin}
            indexSets={
              IndexSets
                ? IndexSets[(numberBegin - 1) % IndexSets.length]
                : numberBegin - 1
            }
            TimeDefault={roomInfo.timeDefault || 120}
            handleIncrementReadyClick={() => setNumberBegin((D) => D + 1)}
            IsPause={false}
            NumberOneByOneHost={0}
            tableView={roomInfo.tableView}
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
              ? IndexSets[(numberBegin - 1) % IndexSets.length]
              : numberBegin - 1}
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

function interleaveCharacters(array1, array2, reverse, setIndexSets) {
  const numberGetPerOne = Math.floor(200 / array2.length);
  let arrRes = [];
  array2.forEach((e) => {
    let resTemp = splitAndConcatArray(array1[e].charactor, reverse).slice(
      0,
      numberGetPerOne
    );
    arrRes = arrRes.concat(resTemp);
  });

  setIndexSets(generateRandomArray(arrRes.length));

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
