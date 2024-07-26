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
  const [userClient, setUserClient] = useState(null);

  const [allReady, setAllReady] = useState(false);
  const [numberBegin, setNumberBegin] = useState(0);

  const [SttCoundown, setSttCoundown] = useState("00");

  const [DataPracticingCharactor, setDataPracticingCharactor] = useState(null);
  const [DataPracticingOverRoll, setDataPracticingOverRoll] = useState(null);
  const [Score, setScore] = useState(0);
  const [NumberOneByOneHost, setNumberOneByOneHost] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    handleUpdateNewElenment("score", Score);
  }, [Score]);

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

  const handleUpdateNewElenment = (key, value) => {
    socket.emit("updateOneELEMENT", roomCode, socket.id, key, value);
  };

  if (users === null || roomInfo === null) {
    return <div>Đợi trong giây lát . . .</div>;
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
          users={users}
          userClient={userClient}
          numberBegin={numberBegin}
          handleReadyClick={() => handleUpdateNewElenment("isReady", true)}
          handleUpdateNewElenment={handleUpdateNewElenment}
        />
      </div>

      {SttCoundown === "00" ? (
        <>
          {userClient.incrementReady && !userClient.isPause ? (
            <div>Đợi các bạn khác</div>
          ) : null}
        </>
      ) : null}

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
            TimeDefault={roomInfo.timeDefault || 120}
            handleIncrementReadyClick={() =>
              handleUpdateNewElenment("incrementReady", true)
            }
            IsPause={userClient.isPause}
            NumberOneByOneHost={NumberOneByOneHost}
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
            NumberBegin {numberBegin}
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
            {/* {JSON.stringify(userClient)} */}
            <br />
            {/* <button
                onClick={() => {
                  if (userClient.win) {
                    handleUpdateNewElenment("win", userClient.win + 1);
                  } else {
                    handleUpdateNewElenment("win", 1);
                  }
                }}
              >
                WIN++
              </button> */}
            <br />
            {/* {ScoreMinigame} */}
            <br />
          </div>
        ) : null}
        <hr />
      </div>
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
