import { useEffect, useState } from "react";
import $ from "jquery";
import ReadMessage from "./ReadMessage_2024";
import Dictaphone from "./RegcognitionV2024-05-NG_Test";
import initializeVoicesAndPlatform from "./initializeVoicesAndPlatform";
import TableView from "./TableView";
import ConversationView from "./ConversationView";
import PixiJS from "../PixiJS";
import {
  findClosestMatch,
  getRandomElement,
  parceARandomSets,
  shuffleArray,
  collectWeSay,
  removeNoneElements,
  qsSets,
  pickRandomN,
} from "./help_prac_function";
import InputDataTest from "./dataTest_01.json";

const screenWidth = window.screen.width;
const screenHeight = window.screen.height;
let PracDataSave = [];
let IndexSave = 0;
let theySaySave = "Hi how are you?";
let CungThucHanhIndex = 0;

function Test() {
  const [PracData, SetPracData] = useState(null);
  const [PickData, SetPickData] = useState([]);
  const [Index, SetIndex] = useState(0);
  const [New, SetNew] = useState(0);
  const [ObjRead, SetObjRead] = useState(null);
  const [CMDList, SetCMDList] = useState(null);
  const [WeCanSay, SetWeCanSay] = useState([]);
  const [SubmitSets, SetSubmitSets] = useState([]);
  const [HDtable, SetHDtable] = useState([]);
  const [Detailtable, SetDetailtable] = useState([]);
  const [TablePickingList, SetTablePickingList] = useState([]);
  const [ImgAvatar, SetImgAvatar] = useState(null);
  const [Gender, SetGender] = useState(null);
  const [CommonStTable, SetCommonStTable] = useState([]);
  const [PracTestList, SetPracTestList] = useState(null);
  const [Score, SetScore] = useState(0);
  const [TableMode, SetTableMode] = useState(null);
  // State để lưu id của div được chọn
  const [selectedDiv, setSelectedDiv] = useState(null);

  // Hàm để xử lý sự kiện click vào div
  const handleDivClick = (id) => {
    setSelectedDiv(id); // Cập nhật id của div đang được chọn
  };

  // Hàm để tính toán kích thước cho mỗi div dựa trên div nào được chọn
  const getDivStyle = (id) => {
    if (selectedDiv === id) {
      return { flex: 6 }; // Div được chọn có kích thước 60%
    } else {
      return { flex: 1 }; // Các div khác có kích thước 10%
    }
  };

  useEffect(() => {
    PracDataSave = PracData;
  }, [PracData]);

  useEffect(() => {
    IndexSave = Index;
  }, [Index]);

  // Cập nhật các giá trị dựa trên thay đổi của PracData hoặc Index
  useEffect(() => {
    if (PracData && PracData[Index]) {
      initializeAvatarAndGender(PracData[Index]);
      setAllTableData(PracData[Index]);
    } else if (!PracData) {
      resetIndexAndPickData();
    }
  }, [PracData, Index]);

  // Xử lý kiểm tra SubmitList
  useEffect(() => {
    if (!PracDataSave) return;
    handleSubmitListCheck();
  }, [PickData]);

  useEffect(() => {
    if (New !== 0) {
      resetIndexAndPickData();
    }
  }, [New]);

  useEffect(() => {
    initializeVoices();
    setRandomTestList();
  }, []);

  // Hàm khởi tạo thông tin giọng nói và platform
  const initializeVoices = async () => {
    const voiceObj = await initializeVoicesAndPlatform();
    SetObjRead(voiceObj);
  };

  // Đặt danh sách ngẫu nhiên cho bài tập
  const setRandomTestList = () => {
    const randomSets = parceARandomSets(InputDataTest.length);
    SetPracTestList(randomSets);
  };

  const resetIndexAndPickData = () => {
    SetIndex(0);
    SetPickData([]);
  };

  const initializeAvatarAndGender = (data) => {
    try {
      SetImgAvatar(
        data[0].img[0] || "https://i.postimg.cc/KzXn83D8/Andrew-40.jpg"
      );
      SetGender(data[0].gender[0] || 1);
    } catch (error) {
      console.log("Error initializing avatar and gender:", error);
    }
  };

  const setAllTableData = (data) => {
    SetCMDList(collectWeSay(data, ["weSay"]));
    SetWeCanSay(
      shuffleArray(
        collectWeSay(data, ["weSay", "weCanSayList"]).concat(
          pickRandomN(qsSets, 2)
        )
      )
    );
    SetSubmitSets(collectWeSay(data, ["submitList"]));
    SetHDtable(collectWeSay(data, ["guideTable"]));
    SetDetailtable(collectWeSay(data, ["detailTable"]));
    SetCommonStTable(collectWeSay(data, ["commonSt"]));
    SetTablePickingList(collectWeSay(data, ["tablePicking"]));
    SetTableMode(null);
  };

  const handleSubmitListCheck = () => {
    let submitListT = [];
    try {
      submitListT = PracDataSave[IndexSave].flatMap((e) => e.submitList || []);
    } catch (error) {
      console.log("Error processing submitListT:", error);
    }

    try {
      const DataCheck = removeNoneElements(PickData);
      const submitSets = removeNoneElements(submitListT);
      const iCheck = submitSets.every((e) => DataCheck.includes(e + ""));

      if (iCheck && submitSets.length === DataCheck.length) {
        if (IndexSave < PracDataSave.length - 1) {
          SetIndex((prevIndex) => prevIndex + 1);
          SetPickData([]);
        } else {
          resetForNextTest();
        }
      }
    } catch (error) {
      console.log("Error during data check:", error);
    }
  };

  const resetForNextTest = () => {
    SetPracData(null);
    SetIndex(0);
    SetPickData([]);
    SetScore((prevScore) => prevScore + 1);
  };

  const handleSpeakAgain = () => {
    ReadMessage(ObjRead, theySaySave, Gender || 1, 0.75);
  };

  const handleSpeakSlowly = () => {
    ReadMessage(ObjRead, theySaySave, Gender || 1, 0.5);
  };

  const handleCMD = (CMD) => {
    try {
      const closestMatch = findClosestMatch(CMD, PracData[Index]);
      theySaySave = getRandomElement(closestMatch.theySay);
      ReadMessage(ObjRead, theySaySave, Gender || 1, 0.75);

      if (closestMatch.action) {
        SetPickData([...PickData, "FN01"]);
      }
    } catch (error) {
      console.log("Error handling command:", error);
    }
  };
  return (
    <div>
      {" "}
      <div>
        <Dictaphone
          fn_Xuly={handleCMD}
          CMDList={CMDList}
          fn_speakAgain={handleSpeakAgain}
          fn_speakSlowly={handleSpeakSlowly}
        />
      </div>{" "}
      <div style={containerStyle}>
        <div
          id="id01"
          onClick={() => handleDivClick("id01")}
          style={{ ...divStyle, ...getDivStyle("id01") }}
        >
          <div style={contentStyle}>
            {" "}
            <h1>Tổng quan</h1>
            <div style={{ width: "400px" }}></div>
          </div>
        </div>
        <div
          id="id02"
          onClick={() => handleDivClick("id02")}
          style={{ ...divStyle, ...getDivStyle("id02") }}
        >
          <div style={contentStyle}>
            <h1>Giao tiếp</h1>
            <div style={{ width: screenWidth * 0.55 }}>
              {/* <div style={{ display: "flex", width: "150px", height: "150px" }}> */}
              <img
                style={avatarStyle(PracData)}
                src={ImgAvatar}
                width="150px"
              />
              {/* </div> */}

              <div
              // style={mainContainerStyle(PracData)}
              >
                <div style={headerStyle}></div>
                <ConversationView
                  PracData={PracData}
                  Index={Index}
                  SubmitSets={SubmitSets}
                  PickData={PickData}
                  SetPickData={SetPickData}
                  SetTableMode={SetTableMode}
                />
                <table border={"1"} style={{ width: "100%" }}>
                  <tr>
                    <td style={{ width: "200px", padding: "5px" }}>
                      File thông tin
                    </td>
                    <td style={{ padding: "5px" }}>
                      {Detailtable.length !== 0 ? (
                        <>
                          {" "}
                          {renderControlButton(
                            Detailtable,
                            () => SetTableMode(1),
                            "bi-clipboard-check"
                          )}
                          {renderControlButton(
                            HDtable,
                            () => SetTableMode(2),
                            "bi-info-circle-fill"
                          )}
                        </>
                      ) : null}
                    </td>
                  </tr>
                  <tr>
                    <td style={{ width: "200px", padding: "5px" }}>
                      Khách chờ
                    </td>
                    <td style={{ padding: "5px" }}>
                      {" "}
                      <div>
                        {renderActionButton(
                          PracData,
                          Score,
                          () => {
                            CungThucHanhIndex++;
                            SetPracData(
                              InputDataTest[PracTestList[CungThucHanhIndex]]
                            );
                            ReadMessage(ObjRead, "Hi", Gender || 1, 0.5);
                          },
                          SetPracData
                        )}
                      </div>
                    </td>
                  </tr>
                </table>
                {JSON.stringify(WeCanSay)}
                {/* <WeCanSayView WeCanSay={WeCanSay} /> */}
                <hr />
              </div>
            </div>
          </div>
        </div>
        <div
          id="id03"
          onClick={() => handleDivClick("id03")}
          style={{ ...divStyle, ...getDivStyle("id03") }}
        >
          <div style={contentStyle}>
            <h1>Thông tin</h1>
            <div
              style={{
                width: "55vw",
                height: "70vh",
                overflow: "auto",
              }}
            >
              <TableView
                TableMode={TableMode}
                TableData={TableMode === 3 ? TablePickingList : Detailtable}
                screenWidth={screenWidth}
                screenHeight={screenHeight}
                SetPickData={SetPickData}
                PickData={PickData}
                SetTableMode={SetTableMode}
              />
            </div>
          </div>
        </div>
        <div
          id="id04"
          onClick={() => handleDivClick("id04")}
          style={{ ...divStyle, ...getDivStyle("id04") }}
        >
          <div style={contentStyle}>
            <div
              style={{
                width: "55vw",
                height: "65vh",
                overflow: "auto",
              }}
            >
              <PixiJS />
            </div>
            <h1>Bản đồ</h1>
          </div>
        </div>
        <div
          id="id05"
          onClick={() => handleDivClick("id05")}
          style={{ ...divStyle, ...getDivStyle("id05") }}
        >
          <div style={contentStyle}>
            <h1>Nhiệm vụ</h1>
            <div style={{ width: "600px" }}></div>
          </div>
        </div>
      </div>
    </div>
  );
  return (
    <div>
      <Dictaphone
        fn_Xuly={handleCMD}
        CMDList={CMDList}
        fn_speakAgain={handleSpeakAgain}
        fn_speakSlowly={handleSpeakSlowly}
      />

      <div style={mainContainerStyle(PracData)}>
        <div style={headerStyle}>
          {renderControlButton(
            Detailtable,
            () => SetTableMode(1),
            "bi-clipboard-check"
          )}
          {renderControlButton(
            HDtable,
            () => SetTableMode(2),
            "bi-info-circle-fill"
          )}
        </div>

        <img style={avatarStyle(PracData)} src={ImgAvatar} width="150px" />

        <ConversationView
          PracData={PracData}
          Index={Index}
          SubmitSets={SubmitSets}
          PickData={PickData}
          SetPickData={SetPickData}
          SetTableMode={SetTableMode}
        />

        <WeCanSayView WeCanSay={WeCanSay} />

        <TableView
          TableMode={TableMode}
          TableData={TableMode === 3 ? TablePickingList : Detailtable}
          screenWidth={screenWidth}
          screenHeight={screenHeight}
          SetPickData={SetPickData}
          PickData={PickData}
          SetTableMode={SetTableMode}
        />
      </div>

      <div>
        {renderActionButton(
          PracData,
          Score,
          () => {
            CungThucHanhIndex++;
            SetPracData(InputDataTest[PracTestList[CungThucHanhIndex]]);
            ReadMessage(ObjRead, "Hi", Gender || 1, 0.5);
          },
          SetPracData
        )}
      </div>
    </div>
  );
}

const mainContainerStyle = (PracData) => ({
  position: "absolute",
  top: "45%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "800px",
  height: "500px",
  border: "1px solid black",
  borderRadius: "10px",
  padding: "0 20px",
  textAlign: "left",
  backgroundColor: "#f0f0f0",
  transition: "opacity 3s ease-in-out",
  opacity: PracData !== null ? 1 : 0,
});

const headerStyle = {
  position: "sticky",
  width: "100%",
  height: "60px",
  textAlign: "right",
};

const avatarStyle = (PracData) => ({
  borderRadius: "50%",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 1)",
  float: "left",
  margin: "10px",
  transition: "all 2s ease-in-out",
  transform: PracData ? "translateY(0)" : "translateY(-200px)",
});

const renderControlButton = (data, onClick, iconClass) =>
  data.length !== 0 && (
    <button className="btn btn-outline-primary" onClick={onClick}>
      <i className={`bi ${iconClass}`}></i>
    </button>
  );

const WeCanSayView = ({ WeCanSay }) => (
  <div style={weCanSayStyle}>
    {WeCanSay.map((e, i) => (
      <i key={i} value={e} style={{ marginRight: "5px" }}>
        {e}__
      </i>
    ))}
  </div>
);

const weCanSayStyle = {
  position: "absolute",
  bottom: "0",
  width: "80%",
  height: "60px",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  fontSize: "small",
};

const renderActionButton = (PracData, Score, onClick, SetPracData) =>
  PracData === null ? (
    <button
      // style={actionButtonStyle}
      className="btn btn-primary"
      id="btn_chonngaunhien"
      onClick={onClick}
    >
      <i className="bi bi-person-plus-fill"></i> {Score}
    </button>
  ) : (
    <button
      // style={fixedButtonStyle}
      onClick={() => SetPracData(null)}
      className="btn btn-danger"
    >
      <i className="bi bi-person-dash-fill"></i>
    </button>
  );

const actionButtonStyle = {
  position: "fixed",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  zIndex: 5,
  width: "50px",
  height: "50px",
  borderRadius: "50%",
  scale: "3",
};

const fixedButtonStyle = {
  position: "fixed",
  top: "130px",
  right: "10px",
  zIndex: 5,
  width: "50px",
  height: "50px",
  borderRadius: "50%",
};

export default Test;

// Styles cho container
const containerStyle = {
  display: "flex",
  height: "80vh",
  width: "100%",
};

// Styles chung cho các div
const divStyle = {
  // backgroundColor: "#00BFFF",
  color: "black",
  display: "flex",
  // flexDirection: "column", // Để căn các phần tử theo chiều dọc
  justifyContent: "center", // Căn giữa nội dung theo chiều dọc
  // textAlign: "center",
  cursor: "pointer",
  transition: "flex 0.5s ease-in-out", // Thêm hiệu ứng chuyển động khi thay đổi kích thước
  border: "1px solid black",
  overflow: "hidden", // Ẩn phần dư thừa khi div bị thu nhỏ
};

// Styles cho nội dung bên trong các div
const contentStyle = {
  padding: "10px",
  textAlign: "center", // Canh giữa nội dung bên trong div
  overflow: "hidden", // Ẩn phần dư nếu nội dung quá lớn
};
