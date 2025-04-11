import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { socket } from "../App";
import "bootstrap/dist/css/bootstrap.min.css";
import PracticeDIV from "./pracPages/B101_FINAL_PROJECTS";
import CountdownTimer from "./pracPages/B101_FINAL_CounterTime";
import LinkAPI from "../ulti/T0_linkApi";
import shuffleArray from "../ulti/shuffleArray";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
const Room = ({ setSttRoom }) => {
  const { roomCode, currentIndex } = useParams();
  const locationSet = useLocation();
  const params = new URLSearchParams(locationSet.search);
  const [users, setUsers] = useState(null);
  const [roomInfo, setRoomInfo] = useState({
    fileName: roomCode,
    objList: [0, 1, 2, 3, 4, 5, 6],
    reverse: 1,
  });

  const [StartToGetData, setStartToGetData] = useState(false);

  const [IndexSets, setIndexSets] = useState(null);

  const [userClient, setUserClient] = useState(null);

  const [allReady, setAllReady] = useState(false);

  // const [AllReadyForPlay, setAllReadyForPlay] = useState(false);

  const [IsPause, setIsPause] = useState(false);

  const [numberBegin, setNumberBegin] = useState(0);
  const [SttCoundown, setSttCoundown] = useState("00");

  const [DataPracticingCharactor, setDataPracticingCharactor] = useState(null);
  const [DataPracticingOverRoll, setDataPracticingOverRoll] = useState(null);
  const [Score, setScore] = useState(
    getNumberWithDailyExpiry(
      "score" + (params.get("b") + params.get("a") || "")
    ) || 0
  );
  const [NumberOneByOneHost, setNumberOneByOneHost] = useState(0);

  const [Message, setMessage] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    try {
      if (Score < 0) {
        saveNumberWithDailyExpiry(
          "score" + (params.get("b") + params.get("a") || ""),
          0
        );
      } else {
        saveNumberWithDailyExpiry(
          "score" + (params.get("b") + params.get("a") || ""),
          Score
        );
      }

      if (Score) {
        const idDinhDanh = localStorage.getItem("dinhDanh");
        const nameDinhDanh = localStorage.getItem("nameDinhDanh") || "";
        socket.emit("messageReg", {
          text: "[" + Score + "] Điểm | ",
          time: nameDinhDanh || (idDinhDanh ? idDinhDanh.slice(0, 4) : ""),
          type: "notify",
          id: idDinhDanh,
        });
      }
    } catch (error) {}
  }, [Score]);
  // useEffect(() => {
  //   try {
  //     const idSocket = socket.id.slice(0, 4);
  //     socket.emit("messageReg", { text: "[" + idSocket + "] " + Message });
  //   } catch (error) {}
  // }, [Message]);
  useEffect(() => {
    if (numberBegin !== 0) {
      setSttCoundown("01");
    }
  }, [numberBegin]);

  useEffect(() => {
    setSttRoom(true);
  }, []);
  useEffect(() => {
    if (SttCoundown === "01") {
      SpeechRecognition.stopListening();
    }
  }, [SttCoundown]);

  const fetchTitle = async () => {
    try {
      let response;
      if (roomInfo.fileName.charAt(1) === "z") {
        response = await fetch(`/jsonData/forseo/${roomInfo.fileName}.json`);
      } else {
        response = await fetch(`/jsonData/${roomInfo.fileName}.json`);
      }

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setDataPracticingOverRoll(data);

      let firstList = [currentIndex || 0];
      try {
        let newList = parseStringToNumbers(params.get("a"));
        if (newList) {
          firstList = newList;
        }
      } catch (error) {}
      setDataPracticingCharactor(
        interleaveCharacters(
          data,
          firstList,
          1,
          setIndexSets,
          params.get("b"),
          params.get("up"),
          params.get("random")
        )
      );
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleUpdateNewElenment = (key, value, mode) => {
    socket.emit("updateOneELEMENT", roomCode, socket.id, key, value, mode);
  };

  if (!StartToGetData) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          backgroundColor: "#f9f9f9",
        }}
      >
        <img
          src="https://i.postimg.cc/Bv9MGGy8/favicon-ico.png"
          width={"160px"}
          style={{
            margin: "10px",
            border: "1px solid blue",
            borderRadius: "15px",
            cursor: "pointer",
          }}
          onClick={() => {
            navigate(
              "/learninghub/" +
                roomCode +
                "?ls=" +
                currentIndex +
                "&&Fid=div_01_content_table_to_practice"
            );
          }}
        />
        <button
          onClick={() => {
            setStartToGetData(true);
            fetchTitle();
          }}
          style={{
            padding: "12px 24px",
            fontSize: "16px",
            backgroundColor: "#0070f3",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            transition: "background-color 0.3s ease",
          }}
          onMouseOver={(e) =>
            (e.currentTarget.style.backgroundColor = "#0059c1")
          }
          onMouseOut={(e) =>
            (e.currentTarget.style.backgroundColor = "#0070f3")
          }
        >
          Bấm để bắt đầu lấy dữ liệu thực hành
        </button>
      </div>
    );
  }

  if (params && IndexSets && params.get("qstable")) {
    return (
      <>
        <div style={{ padding: "5%", fontSize: "larger" }}>
          <h1 style={{ color: "blue" }}>
            Buổi phỏng vấn qua video giữa học viên và người hướng dẫn
          </h1>

          <h5>
            Nhiệm vụ của các học viên trong buổi phỏng vấn này bao gồm:
            <br />
            + Lắng nghe những câu hỏi từ người hướng dẫn;
            <br />
            + Sử dụng bảng thông tin để hỗ trợ quá trình trả lời;
            <br />+ Phân tích tình huống, đặt câu hỏi để làm rõ thông tin và tìm
            kiếm đáp án hợp lý.
          </h5>

          <i>
            Qua quá trình trao đổi, người hướng dẫn sẽ có cơ hội đánh giá quá
            trình thực hành, sự tiến bộ của học viên cũng như xác định những
            điểm yếu cần cải thiện. Đây không chỉ là kết quả cụ thể từ một quá
            trình rèn luyện mà còn là tài liệu để người thầy, cô có thể xây dựng
            những phương án hỗ trợ hiệu quả hơn, giúp học viên đạt được kết quả
            tốt nhất trong hành trình học tập.
          </i>
          <hr />
          {IndexSets.map((e, i) => (
            <div>
              <b>
                {i + 1}.{DataPracticingCharactor[e].fsp}
              </b>
              <hr />
              {DataPracticingCharactor[e].data.map((e1, i1) => (
                <div style={{ padding: "0 5px" }}>
                  {e1.qs} ==== {e1.aw}
                </div>
              ))}
              <hr />
            </div>
          ))}
        </div>
      </>
    );
  }

  if (roomInfo === null) {
    return (
      <div className="container mt-3">
        <h1>Đang tải thông tin bài thực hành</h1>
        <h1>Vui lòng Đợi trong giây lát</h1>
      </div>
    );
  }
  if (DataPracticingCharactor === null) {
    return (
      <div className="container mt-3">
        <h1>Đang tải dữ liệu thực hành. Vui lòng đợi trong giây lát!</h1>
        <h1>
          Tùy thuộc vào tốc độ internet và cấu hình máy tính, việc tải và sắp
          xếp dữ liệu thực hành sẽ mất ít thời gian.{" "}
        </h1>
      </div>
    );
  }

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
        <img
          src="https://i.postimg.cc/Bv9MGGy8/favicon-ico.png"
          width={"60px"}
          style={{
            margin: "10px",
            border: "1px solid blue",
            borderRadius: "15px",
            cursor: "pointer",
          }}
          onClick={() => {
            navigate(
              "/learninghub/" +
                roomCode +
                "?ls=" +
                currentIndex +
                "&&Fid=div_01_content_table_to_practice"
            );
          }}
        />
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
                }, 100);
              } else {
                setSttCoundown("02");
              }
            }}
          >
            +
          </button>
        ) : null}
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
                TimeDefault={params.get("t") || 120}
                regRate={params.get("r") || 0.5}
                regRate_01={params.get("r01") || 0.6}
                handleIncrementReadyClick={() => setNumberBegin((D) => D + 1)}
                IsPause={false}
                NumberOneByOneHost={0}
                tableView={params.get("tb") || "Normal"}
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
                width: "200px",
                height: "200px",
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
                  }, 100);
                } else {
                  setSttCoundown("02");
                }
              }}
            >
              {/* <i> Bấm vào đây</i> */}
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

function interleaveCharacters(
  data_all,
  index_sets_t_get_pracData,
  reverse,
  setIndexSets,
  filerSets,
  upCode,
  random
) {
  const numberGetPerOne = Math.floor(200 / index_sets_t_get_pracData.length);

  // Chọn ngẫu nhiên một trong ba giá trị: Math.floor(numberGetPerOne / 2), numberGetPerOne, hoặc 0
  const randomIndex = Math.floor(Math.random() * 3);
  const numberCut = [Math.floor(numberGetPerOne / 2), numberGetPerOne, 0][
    randomIndex
  ];
  let arrRes_gd_1 = [];

  index_sets_t_get_pracData.forEach((e) => {
    let getUpCode = "charactor";
    if (upCode && data_all[e]["charactor" + upCode]) {
      getUpCode = "charactor" + upCode;
    }
    let resTemp = getArrayElements(
      filer_type_o_charactor(data_all[e][getUpCode], filerSets),
      numberCut,
      numberGetPerOne
    );

    arrRes_gd_1.push(resTemp);
  });

  let arrRes = [];

  for (let i = 0; i < numberGetPerOne; i++) {
    arrRes_gd_1.forEach((e) => {
      if (e[i]) {
        arrRes.push(e[i]);
      }
    });
  }
  console.log(arrRes.length, "Số phần tử bài học");

  if (random === "true") {
    setIndexSets(generateRandomArray(arrRes.length, true));
  } else {
    setIndexSets(generateRandomArray(arrRes.length, false));
  }
  return arrRes;
}

function filer_type_o_charactor(charactorSets, filerTypeSetsStringValue) {
  try {
    if (filerTypeSetsStringValue === null) {
      return charactorSets;
    }

    let filerTypeSetsArrayValue = filerTypeSetsStringValue.split("zz");
    console.log(filerTypeSetsArrayValue, "filerTypeSetsArrayValue");
    let res_after_filer = [];
    charactorSets.forEach((e, i) => {
      if (filerTypeSetsArrayValue.includes(e.type)) {
        res_after_filer.push(e);
      }
    });
    if (res_after_filer.length > 0) {
      return res_after_filer;
    } else {
      return charactorSets;
    }
  } catch (error) {
    return charactorSets;
  }
}

function splitAndConcatArray(array, m) {
  const n = array.length;
  const splitIndex = Math.floor((n * m) / 10);

  const arr1 = array.slice(0, splitIndex);
  const arr2 = array.slice(splitIndex);

  const resultArray = arr2.concat(arr1);

  return resultArray;
}

function generateRandomArray(m, stt_random) {
  let randomArray = [];
  for (let i = 0; i < m; i++) {
    randomArray.push(i);
  }
  if (stt_random) {
    return shuffleArray(randomArray);
  }
  return randomArray;
}
function saveNumberWithDailyExpiry(key, value) {
  const now = new Date();

  // Thời gian hết hạn tính bằng mili giây
  const expiry = now.getTime() + 5 * 60 * 1000;

  const item = {
    value: value,
    expiry: expiry,
  };

  localStorage.setItem(key, JSON.stringify(item));
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

function parseStringToNumbers(input) {
  try {
    const parts = input.split(/(a|b)/); // Tách chuỗi dựa trên 'a' và 'b'
    let result = [];
    let temp = [];

    for (let i = 0; i < parts.length; i++) {
      if (!isNaN(parts[i]) && parts[i] !== "") {
        temp.push(parseInt(parts[i])); // Chuyển số dạng chuỗi thành số nguyên
      } else if (parts[i] === "b") {
        if (temp.length > 0) {
          const start = temp.pop(); // Lấy số trước 'b'
          const end = parseInt(parts[i + 1]); // Số sau 'b'
          if (!isNaN(end)) {
            for (let j = start; j <= end; j++) {
              result.push(j); // Thêm các số từ start đến end
            }
            i++; // Bỏ qua số đã xử lý sau 'b'
          }
        }
      } else if (parts[i] === "a") {
        if (temp.length > 0) result.push(temp.pop()); // Giữ số cuối cùng trong bộ đệm
      }
    }

    // Xử lý số cuối cùng còn lại
    if (temp.length > 0) result.push(...temp);

    // Kiểm tra nếu mảng kết quả rỗng thì trả về null
    console.log(result, "AAAAAAAAAAAAaaa");
    return result.length > 0 ? result : null;
  } catch (error) {
    // Trả về null nếu có lỗi
    return null;
  }
}

function getArrayElements(arr, m, n) {
  // Tính toán chỉ mục m sao cho không vượt quá độ dài mảng
  const startIndex = m % arr.length;

  // Xếp lại mảng từ startIndex đến hết và nối với phần đầu mảng
  const rotatedArr = arr.slice(startIndex).concat(arr.slice(0, startIndex));

  // Nếu n >= arr.length, trả về toàn bộ mảng đã xoay
  if (n >= arr.length) {
    return rotatedArr;
  }

  // Nếu n < arr.length, trả về n phần tử đầu tiên của mảng đã xoay
  return rotatedArr.slice(0, n);
}
