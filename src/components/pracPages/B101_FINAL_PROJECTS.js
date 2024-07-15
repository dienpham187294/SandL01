import { useEffect, useState, useContext } from "react";
import "./B101_FINAL_PROJECTS.css";
import ReadMessage from "../../ulti/ReadMessage_2024";

import Dictaphone from "../../ulti/RegcognitionV2024-05-NG";
import TableTB from "./B101_FINAL_TABLE-TB";
import TableHD from "./B101_FINAL_TABLE-HD";
import TablePushAW from "./B101_FINAL_TABLE-PUSHAW";
import StartButton from "./B101_FINAL_StartButton";
import CountdownTimer from "./B101_FINAL_CounterTime";
import RegButton from "./B101_FINAL_BUTTON_REG";
import TableDisplay from "./B101_FINAL_TableDisplay";
import { ObjREADContext } from "../../App"; // Import ObjREADContext
import isImageUrl from "../../ulti/isImageUrl";
import useImagePreloader from "../useImagePreloader";
const colors = ["red", "orange", "black", "green", "blue", "indigo", "violet"];
// console.log(ObjREADContext);
function FINAL_PROJECT({
  DataPracticingOverRoll,
  DataPracticingCharactor,
  Score,
  setScore,
  numberBegin,
  TimeDefault,
  handleIncrementReadyClick,
  IsPause,
}) {
  const [StartSTT, setStartSTT] = useState(true);
  const [INDEXtoPlay, setINDEXtoPlay] = useState(-1);
  const [imageUrls, setImageUrls] = useState([]);
  const [IsMobile, setIsMobile] = useState(false);
  const [AlldataToPractice] = useState(DataPracticingCharactor);
  const [playData, setPlayData] = useState(null);
  const [HINT, setHINT] = useState(null);
  const [Submit, setSubmit] = useState(null);
  const [CMD, setCMD] = useState(null);
  const [GENDER, setGENDER] = useState(null);
  const [PushAW, setPushAW] = useState([]);
  const [Lang, setLang] = useState("en-GB");
  const [Clue, setClue] = useState(null);
  const [TimeCountDown, setTimeCountDown] = useState(null);
  // const [OBJAfterReg, setOBJAfterReg] = useState(null);

  const [OnTable, setOnTable] = useState(null);
  const [getSTTDictaphone, setGetSTTDictaphone] = useState(false);
  const ObjREAD = useContext(ObjREADContext);

  // Hàm kiểm tra và thêm phần tử vào mảng nếu chưa tồn tại

  const addElementIfNotExist = (element) => {
    setPushAW((prevArray) => {
      if (!prevArray.includes(element)) {
        return [...prevArray, element];
      }
      return prevArray;
    });
  };
  // Function to check screen size
  const checkScreenSize = () => {
    console.log(window.innerWidth);
    setIsMobile(window.innerWidth <= 768);
  };

  // Check screen size on mount and when window is resized
  useEffect(() => {
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => {
      window.removeEventListener("resize", checkScreenSize);
    };
  }, []);

  useEffect(() => {
    if (IsPause) {
      setStartSTT(true);
    }
  }, [IsPause]);

  useEffect(() => {
    if (!IsPause) {
      if (numberBegin !== 0) {
        setStartSTT(false);
        setINDEXtoPlay(numberBegin);
      }
    } else {
      setStartSTT(true);
      // handleIncrementReadyClick();
    }
  }, [numberBegin]);

  useEffect(() => {
    let urls = [];
    DataPracticingOverRoll.forEach((e) => {
      e.HDTB.TB.forEach((url) => {
        urls = urls.concat(url);
      });
    });
    console.log(urls);
    setImageUrls(urls);
  }, [DataPracticingOverRoll]);

  useImagePreloader(imageUrls);

  useEffect(() => {
    if (StartSTT) {
      setPlayData(null);
      setGetSTTDictaphone(false);
      if (INDEXtoPlay > 0) {
        handleIncrementReadyClick();
      }
    } else {
      if (INDEXtoPlay >= 0) {
        try {
          setPlayData(
            AlldataToPractice[INDEXtoPlay % AlldataToPractice.length]
          );
        } catch (error) {}
      }
    }
  }, [StartSTT, INDEXtoPlay, AlldataToPractice]);

  useEffect(() => {
    if (playData === null) {
      setHINT(null);
      setSubmit(null);
      setCMD(null);
      setGENDER(null);
      setPushAW([]);
      setClue(null);
      setTimeCountDown(null);
      setLang("en-GB");
    } else {
      setTimeCountDown(
        playData.time !== undefined
          ? playData.time
          : TimeDefault !== null
          ? TimeDefault
          : 120
      );
      setHINT(playData.hint);
      setSubmit(playData.submit);
      setClue(playData.clue);
      setCMD(playData.data);
      setGENDER(playData.gender === "female" ? 1 : 0);
      setLang(playData.lang === "VN" ? "vi-VN" : "en-US");
      if (!IsMobile) {
        ReadMessage(
          ObjREAD,
          playData.fsp,
          playData.gender === "female" ? 1 : 0
        );
      }

      console.log("outside", ObjREAD, playData.gender === "female" ? 1 : 0);
    }
  }, [playData, ObjREAD]);

  useEffect(() => {
    if (Submit !== null && PushAW.length > 0) {
      let checkIndex = checkArrays(Submit, PushAW);
      if (checkIndex === 1) {
        setStartSTT(true);
        setScore((D) => D + 1);
      } else if (checkIndex === 2) {
        setStartSTT(true);
        setScore((D) => D - 1);
      }
    }
  }, [Submit, PushAW]);
  useEffect(() => {
    if (getSTTDictaphone) {
      disableButtonFsp();
    } else {
      enableButtonFsp();
    }
  }, [getSTTDictaphone]);

  try {
    return (
      <div
      // className="projects_outmain"
      >
        {StartSTT ? (
          <div>
            <StartButton
              setINDEXtoPlay={setINDEXtoPlay}
              INDEXtoPlay={INDEXtoPlay}
              setStartSTT={setStartSTT}
              Score={Score}
            />
          </div>
        ) : (
          <div className="row">
            <div className="col-6">
              <h5>Score: {Score}</h5>
              <div>
                {" "}
                {Clue && isImageUrl(Clue) ? (
                  <img
                    style={{ border: "4px solid blue", borderRadius: "10px" }}
                    width={IsMobile ? "100px" : "200px"}
                    src={Clue}
                  />
                ) : (
                  <img
                    width={IsMobile ? "100px" : "200px"}
                    src={playData.img}
                  />
                )}
                <button
                  id="BtnFsp"
                  style={{
                    marginTop: "10%",
                    marginLeft: "10%",
                    scale: IsMobile ? "1.0" : "1.5",
                  }}
                  className="btn btn-outline-primary"
                  onClick={() => {
                    try {
                      ReadMessage(ObjREAD, playData.fsp, GENDER);
                    } catch (error) {}
                  }}
                >
                  <i className="bi bi-chat-left-dots"></i>
                </button>
              </div>
            </div>
            <div className="col-6">
              {TimeCountDown !== null ? (
                <CountdownTimer
                  setSTT={setStartSTT}
                  STT={true}
                  TIME={TimeCountDown}
                  setScore={setScore}
                />
              ) : null}

              {Clue && !isImageUrl(Clue) ? (
                <>
                  <hr /> <b>Clue:</b> <h5 style={{ color: "blue" }}>{Clue}</h5>
                </>
              ) : null}

              {playData !== null ? (
                <div>
                  {getSTTDictaphone ? (
                    <Dictaphone
                      getSTTDictaphone={setGetSTTDictaphone}
                      setGetSTTDictaphone={setGetSTTDictaphone}
                      CMDlist={CMD}
                      GENDER={GENDER}
                      setScore={setScore}
                      addElementIfNotExist={addElementIfNotExist}
                      ObjVoices={ObjREAD}
                      Lang={Lang}
                    />
                  ) : (
                    <RegButton setGetSTTDictaphone={setGetSTTDictaphone} />
                  )}{" "}
                </div>
              ) : null}
            </div>

            <div>
              {!IsMobile ? (
                <div>
                  <TableDisplay
                    OnTable={OnTable}
                    DataAllSets={DataPracticingOverRoll}
                    setOnTable={setOnTable}
                  />
                </div>
              ) : null}

              {OnTable !== null ? (
                <div style={{ textAlign: "center" }}>
                  <button
                    style={{
                      width: "30%",
                      padding: "10px",
                      marginTop: "20px",
                      backgroundColor: "#4CAF50",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                      textAlign: "center",
                      transition: "background-color 0.3s, transform 0.3s",
                    }}
                    onMouseEnter={(e) =>
                      (e.target.style.transform = "scale(1.05)")
                    }
                    onMouseLeave={(e) =>
                      (e.target.style.transform = "scale(1)")
                    }
                    onClick={() => {
                      setOnTable(null);
                    }}
                  >
                    Back
                  </button>
                  {DataPracticingOverRoll.map((e, i) => (
                    <button
                      onClick={() => {
                        setOnTable(i);
                      }}
                      key={i}
                      style={{
                        // width: "3%",
                        minWidth: "50px",
                        padding: "10px",
                        marginTop: "20px",
                        marginLeft: "10px",
                        backgroundColor: "blue",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                        textAlign: "center",
                      }}
                    >
                      {i + 1}
                    </button>
                  ))}

                  <div>
                    <TableHD
                      data={DataPracticingOverRoll[OnTable]["HDTB"]["HD"]}
                      HINT={HINT}
                    />
                  </div>
                  <div className="row">
                    <div className="col-9">
                      {DataPracticingOverRoll[OnTable]["HDTB"]["TB"].map(
                        (e, i) => (
                          <TableTB
                            key={i}
                            data={e}
                            addElementIfNotExist={addElementIfNotExist}
                            color={colors[i % 7]}
                          />
                        )
                      )}
                    </div>

                    <div className="col-3">
                      <TablePushAW data={PushAW} />
                    </div>
                  </div>
                  <div style={{ height: "300px" }}></div>
                </div>
              ) : null}
            </div>
          </div>
        )}
      </div>
    );
  } catch (error) {
    return null;
  }
}

export default FINAL_PROJECT;

function shuffleArray(array) {
  const arr = array.slice(); // Tạo một bản sao của mảng để tránh thay đổi mảng gốc
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    // Hoán đổi các phần tử arr[i] và arr[j]
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function checkArrays(array01, array02) {
  const allInArray02 = array01.every((element) => array02.includes(element));
  if (allInArray02) {
    return 1;
  }
  const elementsNotInArray01 = array02.filter(
    (element) => !array01.includes(element)
  );
  if (elementsNotInArray01.length >= 3) {
    return 2;
  }
  return 0;
}

function enableButtonFsp() {
  const button = document.getElementById("BtnFsp");

  if (button) {
    button.disabled = false;
    button.style.cursor = "pointer"; // Optional: Change cursor style when enabled
    button.style.opacity = "1"; // Optional: Change opacity when enabled
  }
}

function disableButtonFsp() {
  const button = document.getElementById("BtnFsp");

  if (button) {
    button.disabled = true;
    button.style.cursor = "not-allowed"; // Optional: Change cursor style when disabled
    button.style.opacity = "0.1"; // Optional: Change opacity when disabled
  }
}
