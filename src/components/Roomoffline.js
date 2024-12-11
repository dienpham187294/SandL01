import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { socket } from "../App";
import "bootstrap/dist/css/bootstrap.min.css";
import PracticeDIV from "./pracPages/B101_FINAL_PROJECTS";
import CountdownTimer from "./pracPages/B101_FINAL_CounterTime";
import LinkAPI from "../ulti/T0_linkApi";

const Room = ({ setSttRoom }) => {
  const { roomCode, currentIndex } = useParams();

  const [users, setUsers] = useState(null);

  const [roomInfo, setRoomInfo] = useState({
    fileName: roomCode,
    objList: [currentIndex],
    reverse: 2,
  });

  const [IndexSets, setIndexSets] = useState(null);

  const [userClient, setUserClient] = useState(null);

  const [allReady, setAllReady] = useState(false);

  // const [AllReadyForPlay, setAllReadyForPlay] = useState(false);

  const [IsPause, setIsPause] = useState(false);

  const [numberBegin, setNumberBegin] = useState(0);
  const [SttCoundown, setSttCoundown] = useState("00");

  const [DataPracticingCharactor, setDataPracticingCharactor] = useState(null);
  const [DataPracticingOverRoll, setDataPracticingOverRoll] = useState(null);
  const [Score, setScore] = useState(getNumberWithDailyExpiry("score") || 0);
  const [NumberOneByOneHost, setNumberOneByOneHost] = useState(0);

  const [Message, setMessage] = useState(null);

  useEffect(() => {
    try {
      if (Score < 0) {
        saveNumberWithDailyExpiry("score", 0);
      } else {
        saveNumberWithDailyExpiry("score", Score);
      }

      const idSocket = socket.id.slice(0, 4);
      socket.emit("messageReg", {
        text: "[" + idSocket + "] " + Score + " Điểm",
      });
    } catch (error) {}
  }, [Score]);
  useEffect(() => {
    try {
      const idSocket = socket.id.slice(0, 4);
      socket.emit("messageReg", { text: "[" + idSocket + "] " + Message });
    } catch (error) {}
  }, [Message]);
  useEffect(() => {
    if (numberBegin !== 0) {
      setSttCoundown("01");
    }
  }, [numberBegin]);

  useEffect(() => {
    setSttRoom(true);
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

  const handleUpdateNewElenment = (key, value, mode) => {
    socket.emit("updateOneELEMENT", roomCode, socket.id, key, value, mode);
  };

  if (roomInfo === null) {
    return <div className="container mt-3">Đợi trong giây lát . . .</div>;
  }
  if (DataPracticingCharactor === null) {
    return <div className="container mt-3">Đợi trong giây lát . . . . . .</div>;
  }

  // if (IsPause) {
  //   return (
  //     <div className="container mt-3">
  //       Tạm dừng
  //       <hr />
  //       <button
  //         style={{ borderRadius: "5px", width: "100px" }}
  //         onClick={() => {
  //           setIsPause(!IsPause);
  //         }}
  //       >
  //         {IsPause ? "Tiếp tục" : "Tạm dừng"}
  //       </button>
  //       Điểm: {Score} / Lượt {numberBegin} |
  //     </div>
  //   );
  // }
  return (
    <div
      style={{
        border: "1px solid green",
        borderRadius: "5px",
        padding: "20px 20px",
        display: "flex",
      }}
    >
      <div style={{ flex: 1 }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#e6ccff",
            transition: "height 2s ease, opacity 1s ease",
            borderRadius: "15px",
            border: "1px solid black",
            padding: "15px",
          }}
        >
          <h3>Điểm: {Score} </h3>
          <h3>Lượt {numberBegin}</h3>
        </div>

        <hr />
        {SttCoundown === "01" || numberBegin === 0 ? (
          <button
            className="btn btn-primary"
            style={{
              borderRadius: "5px",
              width: "50px",
              height: "50px",
              fontSize: "25px",
            }}
            onClick={() => {
              if (numberBegin === 0) {
                setNumberBegin((D) => D + 1);
                setTimeout(() => {
                  setSttCoundown("02");
                }, 1000);
              } else {
                setSttCoundown("02");
              }
            }}
          >
            +
          </button>
        ) : null}
        {/* {numberBegin === 0 ? (
          <button
            style={{ borderRadius: "5px", width: "100px", height: "100px" }}
            onClick={() => {
              setNumberBegin((D) => D + 1);
            }}
          >
            Start
          </button>
        ) : (
          <button
            style={{ borderRadius: "5px", width: "100px", height: "100px" }}
            onClick={() => {
              setIsPause(!IsPause);
            }}
          >
            {IsPause ? "Tiếp tục" : "Tạm dừng"}
          </button>
        )} */}
        {/* {SttCoundown === "01" ? (
          <CountdownTimer setSTT={setSttCoundown} STT={"02"} TIME={3} />
        ) : null} */}
      </div>

      <div style={{ flex: 8 }}>
        {" "}
        <div
          style={{
            height: "90vh",
            width: "100%",
            overflow: "hidden",
            padding: "10px",
            border: "1px solid black",
            borderRadius: "10px",
            backgroundColor: "#fff0e6",
          }}
        >
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
                tableView={"Normal"}
                setMessage={setMessage}
                roomCode={roomCode}
              />
            </div>
          ) : null}
          {SttCoundown === "01" || numberBegin === 0 ? (
            <button
              className="btn btn-primary"
              style={{
                borderRadius: "50%", // Làm phần tử có dạng hình tròn
                width: "500px",
                height: "500px",
                fontSize: "50px",
                color: "black",
                position: "absolute", // Định vị con trong cha
                top: "50%", // Đưa đến 50% chiều cao của cha
                left: "50%", // Đưa đến 50% chiều rộng của cha
                transform: "translate(-50%, -50%)", // Dịch chuyển để căn giữa hoàn toàn
                backgroundImage:
                  "url('https://i.postimg.cc/s2GYz4SL/David-20.jpg')", // Sử dụng hình ảnh làm nền
                backgroundSize: "cover", // Hình ảnh sẽ bao phủ toàn bộ phần tử
                backgroundPosition: "center", // Hình ảnh sẽ căn giữa
              }}
              onClick={() => {
                if (numberBegin === 0) {
                  setNumberBegin((D) => D + 1);
                  setTimeout(() => {
                    setSttCoundown("02");
                  }, 1000);
                } else {
                  setSttCoundown("02");
                }
              }}
            >
              <i> Bấm vào đây</i>
            </button>
          ) : null}
        </div>
        {/* <div style={{ width: "100%", border: "1px solid blue" }}>BẢNG</div> */}
      </div>

      {/* <div id="section05">
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
      </div> */}
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

function saveNumberWithDailyExpiry(key, value) {
  const now = new Date();
  const expiry = new Date();

  // Đặt thời gian hết hạn vào cuối ngày hiện tại (23:59:59)
  expiry.setHours(23, 59, 59, 999);

  const item = {
    value: value,
    expiry: expiry.getTime(), // Thời gian hết hạn
  };

  localStorage.setItem(key, JSON.stringify(item)); // Lưu vào localStorage
}

function getNumberWithDailyExpiry(key) {
  const itemStr = localStorage.getItem(key);

  // Kiểm tra nếu không có dữ liệu
  if (!itemStr) return null;

  const item = JSON.parse(itemStr);
  const now = new Date().getTime();

  // Kiểm tra nếu hết hạn
  if (now > item.expiry) {
    localStorage.removeItem(key); // Xóa dữ liệu hết hạn
    return null;
  }

  return item.value; // Trả về số nếu chưa hết hạn
}
