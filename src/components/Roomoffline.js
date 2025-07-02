import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate, json } from "react-router-dom";
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

      const aParam = params.get("a");
      if (aParam === "all") {
        firstList = Array.from({ length: data.length }, (_, i) => i);
      } else if (aParam) {
        try {
          const newList = parseStringToNumbers(aParam);
          if (newList && newList.length > 0) {
            firstList = newList;
          }
        } catch (error) {
          console.warn('Failed to parse "a" parameter:', error.message);
        }
      }

      const get_data_interleaveCharacters = interleaveCharacters(
        data,
        firstList,
        params.get("b"),
        params.get("up"),
        params.get("random"),
        params.get("fsp")
      );

      setDataPracticingCharactor(
        get_data_interleaveCharacters.interleaveCharacters_DATA
      );
      setIndexSets(get_data_interleaveCharacters.IndexSets);
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
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          backgroundColor: "#f9f9f9",
        }}
      >
        <h1 style={{ marginBottom: "20px" }}>Dữ liệu thực hành</h1>

        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <img
            src="https://i.postimg.cc/Bv9MGGy8/favicon-ico.png"
            width={"220px"}
            style={{
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
              fontSize: "large",
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
          <i>
            {" "}
            {params.get("time")
              ? decodeURIComponent(params.get("time")).slice(0, 9)
              : null}
          </i>
          <h3>Điểm: {Score} </h3>
          <h3>Lượt {numberBegin}</h3>
        </div>
        {formatTime(new Date())} <br />
        {/* Ngày giao: <b>{decodeURIComponent(params.get("time"))}</b>
        <br /> */}
        Mã bài tập:
        <b>{params.get("note")}</b> <i>{currentIndex}</i>
        <b style={{ fontSize: "small" }}>{params.get("a")}</b>
        <i style={{ fontSize: "small" }}>{splitIntoChunks(params.get("b"))}</i>
        <hr />
        <div id="NOPBAITAP">
          <input
            className="form-control"
            id="nameInput"
            placeholder="Nhập tên (bắt buộc, tối đa 10 ký tự)"
            maxLength={20}
            onChange={(e) => {
              if (e.target.value.length > 20) {
                e.target.value = e.target.value.slice(0, 20);
              }
            }}
          />{" "}
          <button
            onClick={() => {
              // Get input values
              const nameValue = document.getElementById("nameInput").value;
              // const emailValue = document.getElementById("emailInput").value;

              // Check if name is provided and not too long
              if (!nameValue.trim()) {
                alert("Vui lòng nhập tên để nộp bài");
                return;
              }

              if (nameValue.trim().length > 10) {
                alert("Tên không được vượt quá 10 ký tự");
                return;
              }

              // Check email format if provided
              // if (emailValue.trim() && !emailValue.includes("@")) {
              //   alert("Vui lòng nhập email đúng định dạng (phải có @)");
              //   return;
              // }

              // Disable button during submission
              const submitButton = document.activeElement;
              submitButton.disabled = true;
              submitButton.innerHTML = "ĐANG NỘP BÀI...";

              try {
                const requestBody = {
                  subjectText:
                    nameValue +
                    " | Nộp bài tập | " +
                    decodeURIComponent(params.get("time")) +
                    " | Điểm: " +
                    Score +
                    " | " +
                    formatTime(new Date()) +
                    " | Link: " +
                    window.location.href,
                  contentText: window.location.href,
                  toEmail: "pvkadien0209@gmail.com",
                };

                fetch(LinkAPI + "mail-homework", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(requestBody),
                })
                  .then((response) => response.json())
                  .then((json) => {
                    if (json.success) {
                      const container = document.getElementById("NOPBAITAP");
                      if (container) {
                        container.innerHTML =
                          `Đã nộp bài tập thành công!<h1> Điểm số: ` +
                          Score +
                          `</h1>Chụp gửi kết quả này cho thầy cô!`;
                      }
                      setScore(0);
                    } else {
                      alert("Nộp bài không thành công, vui lòng thử lại");
                    }
                    // Re-enable button after response received
                    submitButton.disabled = false;
                    submitButton.innerHTML = "NỘP BÀI TẬP VỀ NHÀ";
                  })
                  .catch((error) => {
                    console.error("Lỗi khi nộp bài:", error);
                    alert("Có lỗi xảy ra, vui lòng thử lại sau");
                    // Re-enable button after error
                    submitButton.disabled = false;
                    submitButton.innerHTML = "NỘP BÀI TẬP VỀ NHÀ";
                  });
              } catch (error) {
                console.error("Lỗi:", error);
                alert("Có lỗi xảy ra, vui lòng thử lại sau");
                // Re-enable button after error
                submitButton.disabled = false;
                submitButton.innerHTML = "NỘP BÀI TẬP VỀ NHÀ";
              }
            }}
            className={`btn ${Score > 0 ? "btn-danger" : "btn-secondary"}`}
            disabled={Score <= 0}
            style={Score <= 0 ? { opacity: 0.6, cursor: "not-allowed" } : {}}
          >
            NỘP BÀI TẬP VỀ NHÀ
          </button>
          <i>Chỉ dùng để nộp bài tập về nhà!</i>
          <b>Nhập tên khi nộp bài!</b>
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
        <br />
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
  filerSets,
  upCode,
  random,
  fsp
) {
  const numberGetPerOne = Math.floor(200 / index_sets_t_get_pracData.length);

  // Chọn ngẫu nhiên một trong ba giá trị: Math.floor(numberGetPerOne / 2), numberGetPerOne, hoặc 0
  const randomIndex = Math.floor(Math.random() * 3);
  const numberCut = [Math.floor(numberGetPerOne / 2), numberGetPerOne, 0][
    randomIndex
  ];
  let arrRes_gd_1 = [];
  console.log(index_sets_t_get_pracData);
  index_sets_t_get_pracData.forEach((e) => {
    let getUpCode = "charactor";
    if (upCode && data_all[e]["charactor" + upCode]) {
      getUpCode = "charactor" + upCode;
    }
    let resTemp = getArrayElements(
      filer_type_o_charactor(data_all[e][getUpCode], filerSets, fsp),
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
  let getdata_indexSet = [];
  if (random === "true") {
    getdata_indexSet = generateRandomArray(arrRes.length, true);
  } else {
    getdata_indexSet = generateRandomArray(arrRes.length, false);
  }
  return { interleaveCharacters_DATA: arrRes, indexSet_DATA: getdata_indexSet };
}
function filer_type_o_charactor(charactorSets, filerTypeSetsStringValue, fsp) {
  try {
    // Check if inputs are valid
    if (!filerTypeSetsStringValue || !Array.isArray(charactorSets)) {
      return charactorSets;
    }

    // Split the filter string into an array using "zz" as separator
    let filerTypeSetsArrayValue = filerTypeSetsStringValue.split("zz");
    console.log(filerTypeSetsArrayValue, "filerTypeSetsArrayValue");

    let res_after_filer = [];
    let filerTypeSetsArrayValueAll = [];
    let filerTypeSetsArrayValueSpecific = [];
    let rangeFilters = [];

    // Process each filter part
    filerTypeSetsArrayValue.forEach((e) => {
      if (e.includes("*")) {
        // Store the prefix (string before the "*") for wildcard matching
        filerTypeSetsArrayValueAll.push(e.replace("*", ""));
      } else if (e.includes("-")) {
        // Handle range filter like A1-5 or A9-10
        rangeFilters.push(e);
      } else {
        filerTypeSetsArrayValueSpecific.push(e);
      }
    });

    charactorSets.forEach((e) => {
      let isTypeMatch = false;

      // Check if the type exactly matches any specific filter
      if (filerTypeSetsArrayValueSpecific.includes(e?.type)) {
        isTypeMatch = true;
      } else {
        // Check if the type starts with any wildcard filter prefix
        for (let prefix of filerTypeSetsArrayValueAll) {
          if (e?.type && e.type.startsWith(prefix)) {
            isTypeMatch = true;
            break;
          }
        }

        // Check if the type falls within any range filter
        if (!isTypeMatch && e?.type) {
          for (let rangeFilter of rangeFilters) {
            // Parse the range filter (e.g., "A1-5" → prefix="A", start=1, end=5)
            const matches = rangeFilter.match(/([A-Za-z]*)(\d+)-(\d+)/);
            if (matches) {
              const prefix = matches[1];
              const start = parseInt(matches[2]);
              const end = parseInt(matches[3]);

              // Check if the type has the same prefix and a number in the range
              const typeMatches = e.type.match(new RegExp(`^${prefix}(\\d+)$`));
              if (typeMatches) {
                const typeNumber = parseInt(typeMatches[1]);
                if (typeNumber >= start && typeNumber <= end) {
                  isTypeMatch = true;
                  break;
                }
              }
            }
          }
        }
      }

      // Check if FSP matches (if FSP filter is provided)
      const eFspStr = (e?.fsp || "").toLowerCase();
      const fspStr = (fsp || "").toLowerCase();
      const isFspMatch = fsp ? eFspStr.includes(fspStr) : true;

      if (isTypeMatch && isFspMatch) {
        res_after_filer.push(e);
      }
    });

    return res_after_filer.length > 0 ? res_after_filer : [];
  } catch (error) {
    console.error("Lỗi trong filer_type_o_charactor:", error);
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

/**
 * Parses a string to extract numbers, handling special separators
 * zz or a: separates individual numbers
 * - or b: defines a range between two numbers
 *
 * Examples:
 * "0zz2-4" => [0, 2, 3, 4]
 * "0a2b4" => [0, 2, 3, 4]
 *
 * @param {string} input - The string to parse
 * @return {Array|null} - Array of numbers or null if invalid
 */
function parseStringToNumbers(input) {
  try {
    // Replace the defined separators with standard markers for processing
    const normalizedInput = input
      .replace(/zz/g, "a") // Replace 'zz' with 'a'
      .replace(/-/g, "b"); // Replace '-' with 'b'

    // Split the string using regex to capture separators and numbers
    const parts = normalizedInput.split(/([ab])/);
    let result = [];
    let currentNumber = null;

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i].trim();

      // Skip empty parts
      if (!part) continue;

      if (part === "a") {
        // 'a' is just a separator, we continue to the next part
        continue;
      } else if (part === "b") {
        // 'b' indicates a range, we need the numbers before and after
        if (currentNumber !== null && i + 1 < parts.length) {
          const nextPart = parts[i + 1].trim();
          if (nextPart && !isNaN(nextPart)) {
            const end = parseInt(nextPart);
            // Generate all numbers in the range (inclusive)
            for (let j = currentNumber + 1; j <= end; j++) {
              result.push(j);
            }
            i++; // Skip the next part as we've already processed it
          }
        }
      } else if (!isNaN(part)) {
        // This is a number
        currentNumber = parseInt(part);
        result.push(currentNumber);
      }
    }

    console.log("Parsed result:", result);
    return result.length > 0 ? result : null;
  } catch (error) {
    console.error("Error parsing string:", error);
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
function splitIntoChunks(paramB) {
  if (!paramB) {
    return null;
  }

  // Remove all 'zz' from the string
  paramB = paramB.replace(/zz/g, "");

  let chunks = "";
  for (let i = 0; i < paramB.length; i += 6) {
    chunks += " " + paramB.substring(i, i + 6);
  }

  return chunks.trim(); // Remove leading space
}

const formatTime = (date) => {
  if (!date) return "";
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const seconds = date.getSeconds().toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();

  return `${hours}:${minutes}:${seconds} - ${day}/${month}/${year}`;
};
