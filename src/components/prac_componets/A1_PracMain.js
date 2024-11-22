import { useEffect, useState } from "react";
import $ from "jquery";
import ReadMessage from "./ReadMessage_2024";
import Dictaphone from "./RegcognitionV2024-05-NG_Test";
import initializeVoicesAndPlatform from "./initializeVoicesAndPlatform";
import TableView from "./TableView";
import ConversationView from "./ConversationView";
import PixiJS from "./inside_01_components/PixiJS";
import Tongquan from "./inside_01_components/Div01_Tongquan";
import Noidung from "./inside_01_components/Div02_Noidung";
import {
  findClosestMatch,
  getRandomElement,
  parceARandomSets,
  shuffleArray,
  collectWeSay,
  collectWeSayCMDLIST,
  removeNoneElements,
  qsSets,
  pickRandomN,
} from "./help_prac_function";

// import InputDataTest from "./dataContent/file-thuchanh/tk-hotelstaff-01.json";
let InputDataTest;
const screenWidth = window.screen.width;
const screenHeight = window.screen.height;
let PracDataSave = [];
let IndexSave = 0;
let theySaySave = "Hi how are you?";
let CungThucHanhIndex = 0;

function PracMain({ DataPrac }) {
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
  const [selectedDiv, setSelectedDiv] = useState(1);

  // Hàm để xử lý sự kiện click vào div
  const handleDivClick = (id) => {
    setSelectedDiv(id); // Cập nhật id của div đang được chọn
  };

  // Hàm để tính toán kích thước cho mỗi div dựa trên div nào được chọn
  // Hàm để tính toán kích thước cho mỗi div dựa trên div nào được chọn
  const getDivStyle = (id) => {
    if (selectedDiv === id) {
      return {
        flex: 6,
        backgroundColor: "#F9F9F9", // Màu sáng nhẹ cho div được chọn
        boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)", // Thêm shadow nhẹ để nổi bật
        borderRadius: "12px", // Bo tròn góc nhiều hơn cho sự mềm mại
        transition: "background-color 0.3s ease, flex 0.5s ease-in-out", // Hiệu ứng chuyển động mượt mà
      };
    } else {
      return {
        flex: 1,
        backgroundColor: "#DCDCDC", // Màu xám xanh dịu mắt cho các div khác
        transition: "background-color 0.3s ease, flex 0.5s ease-in-out",
        borderRadius: "8px",
      };
    }
  };

  useEffect(() => {
    InputDataTest = DataPrac;
  }, [DataPrac]);

  useEffect(() => {
    PracDataSave = PracData;
  }, [PracData]);

  useEffect(() => {
    // Save the current Index to IndexSave if needed
    IndexSave = Index;

    if (Index > 0) {
      // Attempt to focus on element with id="id03"
      try {
        const element = document.getElementById("id02");
        if (element) {
          element.click(); // Ensure the element exists before focusing
        }
      } catch (error) {
        console.error("Error focusing on element: ", error); // Log the error if something goes wrong
      }
    }
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
    try {
      const randomSets = parceARandomSets(InputDataTest.length);
      SetPracTestList(randomSets);
    } catch (error) {}
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
    SetCMDList(collectWeSayCMDLIST(data, ["weSay"]));
    SetWeCanSay(collectWeSay(data, ["weSay", "weCanSayList"]));
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

  const handleCMD = (CMD, mode) => {
    try {
      if (mode === "transript") {
        const closestMatch = findClosestMatch(CMD, PracData[Index]);

        theySaySave = getRandomElement(closestMatch.theySay);
        ReadMessage(ObjRead, theySaySave, Gender || 1, 0.75);

        if (closestMatch.action) {
          SetPickData([...PickData, "FN01"]);
        }
      } else if (mode === "interimtransript") {
        let m = CMD.split(" ")[0];
        const closestMatch_01 = PracData[Index][m];
        theySaySave = getRandomElement(closestMatch_01.theySay);
        ReadMessage(ObjRead, theySaySave, Gender || 1, 0.75);

        if (closestMatch_01.action) {
          SetPickData([...PickData, "FN01"]);
        }
      }
    } catch (error) {
      console.log("Error handling command:", error);
    }
  };

  if (screenWidth < 1000) {
    return (
      <div>
        <h1>Mobile Screen</h1>
      </div>
    );
  }

  // return <>{JSON.stringify(DataPrac)}</>;

  if (DataPrac === null) {
    return (
      <>
        <h1>Loading . . . . </h1>
      </>
    );
  }

  return (
    <div
      style={{
        border: "1px solid black",
        borderRadius: "20px",
        width: "50vw",
        height: "65vh",
        overflow: "hidden",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 1), 0 6px 20px rgba(0, 0, 0, 1)", // Thêm box-shadow
        backgroundColor: "white", // Đảm bảo nền là trắng
      }}
    >
      {" "}
      <Dictaphone
        fn_Xuly={handleCMD}
        CMDList={CMDList}
        fn_speakAgain={handleSpeakAgain}
        fn_speakSlowly={handleSpeakSlowly}
      />
      <div>
        <img
          style={avatarStyle(PracData)}
          src={ImgAvatar || "https://i.postimg.cc/GhMGs5xN/Jessica-23.jpg"}
          width="60px"
        />
        <div>
          <div style={{ padding: "25px" }}>
            {" "}
            {renderActionButton(
              PracData,
              Score,
              () => {
                const btn = document.getElementById("startRegId");
                if (btn) {
                  btn.click();
                }
                CungThucHanhIndex++;
                SetPracData(
                  InputDataTest[PracTestList[CungThucHanhIndex]].data
                );
                ReadMessage(ObjRead, "Hi", Gender || 1, 0.5);
              },
              SetPracData
            )}
          </div>

          <ConversationView
            PracData={PracData}
            Index={Index}
            SubmitSets={SubmitSets}
            PickData={PickData}
            SetPickData={SetPickData}
            SetTableMode={SetTableMode}
          />
          <hr />
        </div>
      </div>
    </div>
  );

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
      <div>
        <img style={avatarStyle(PracData)} src={ImgAvatar} width="150px" />

        <div>
          <div style={headerStyle}></div>
          <ConversationView
            PracData={PracData}
            Index={Index}
            SubmitSets={SubmitSets}
            PickData={PickData}
            SetPickData={SetPickData}
            SetTableMode={SetTableMode}
          />
          <hr />
          <table border={"1"} style={{ width: "100%" }}>
            <tbody>
              <tr>
                <td style={{ width: "250px", padding: "5px" }}>
                  Danh sách khách hàng chờ . . .
                </td>
                <td style={{ padding: "5px" }}>
                  {" "}
                  <div>
                    {renderActionButton(
                      PracData,
                      Score,
                      () => {
                        const btn = document.getElementById("startRegId");
                        if (btn) {
                          btn.click();
                        }
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
            </tbody>
          </table>
        </div>
      </div>
      <div style={containerStyle}>
        <div
          id="id01"
          onClick={() => handleDivClick("id01")}
          style={{ ...divStyle, ...getDivStyle("id01") }}
        >
          <div style={contentStyle}>
            <div
              style={{
                width: "73vw",
                height: "65vh",
                overflow: "auto",
              }}
            >
              <Tongquan />
            </div>
            <h1 className="divFlexH1">Tổng quan</h1>
          </div>
        </div>
        <div
          id="id02"
          onClick={() => handleDivClick("id02")}
          style={{ ...divStyle, ...getDivStyle("id02") }}
        >
          <div style={contentStyle}>
            <div
              style={{
                width: "73vw",
                height: "65vh",
                overflow: "auto",
              }}
            >
              <Noidung />
              {/* <img
                style={avatarStyle(PracData)}
                src={ImgAvatar}
                width="150px"
              />

              <div>
                <div style={headerStyle}></div>
                <ConversationView
                  PracData={PracData}
                  Index={Index}
                  SubmitSets={SubmitSets}
                  PickData={PickData}
                  SetPickData={SetPickData}
                  SetTableMode={SetTableMode}
                />
                <hr />
                <table border={"1"} style={{ width: "100%" }}>
                  <tbody>
                    <tr>
                      <td style={{ width: "250px", padding: "5px" }}>
                        Danh sách khách hàng chờ . . .
                      </td>
                      <td style={{ padding: "5px" }}>
                        {" "}
                        <div>
                          {renderActionButton(
                            PracData,
                            Score,
                            () => {
                              const btn = document.getElementById("startRegId");
                              if (btn) {
                                btn.click();
                              }
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
                  </tbody>
                </table>
              </div> */}
            </div>
            <h1 className="divFlexH1">Nội dung</h1>
          </div>
        </div>
        {/* <div
          id="id03"
          onClick={() => handleDivClick("id03")}
          style={{ ...divStyle, ...getDivStyle("id03") }}
        >
          <div style={contentStyle}>
            <div
              style={{
                width: "55vw",
                height: "65vh",
                overflow: "auto",
              }}
            >
              {TablePickingList.length !== 0 ? (
                <TableView
                  TableMode={3}
                  TableData={TablePickingList}
                  screenWidth={screenWidth}
                  screenHeight={screenHeight}
                  SetPickData={SetPickData}
                  PickData={PickData}
                  SetTableMode={SetTableMode}
                />
              ) : null}
              {Detailtable.length !== 0 ? (
                <TableView
                  TableMode={1}
                  TableData={Detailtable}
                  screenWidth={screenWidth}
                  screenHeight={screenHeight}
                  SetPickData={SetPickData}
                  PickData={PickData}
                  SetTableMode={SetTableMode}
                />
              ) : null}
            </div>

            <h1 className="divFlexH1">Thông tin</h1>
          </div>
        </div> */}
        <div
          id="id04"
          onClick={() => handleDivClick("id04")}
          style={{ ...divStyle, ...getDivStyle("id04") }}
        >
          <div style={contentStyle}>
            <div
              style={{
                width: "73vw",
                height: "65vh",
                overflow: "auto",
              }}
            >
              <PixiJS />
            </div>
            <h1 className="divFlexH1">Thị trấn</h1>
          </div>
        </div>
        {/* <div
          id="id05"
          onClick={() => handleDivClick("id05")}
          style={{ ...divStyle, ...getDivStyle("id05") }}
        >
          <div style={contentStyle}>
            <div
              style={{
                width: "55vw",
                height: "65vh",
                overflow: "auto",
              }}
            ></div>
            <h1 className="divFlexH1">Nhiệm vụ</h1>
          </div>
        </div> */}
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
  zIndex: "10",
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
        {i + 1}. {e} |
      </i>
    ))}
  </div>
);

const weCanSayStyle = {
  width: "100%",
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

export default PracMain;

// Styles cho container
const containerStyle = {
  display: "flex",
  height: "80vh",
  width: "100%",
};

// Styles chung cho các div
const divStyle = {
  color: "black",
  display: "flex",
  justifyContent: "center", // Căn giữa nội dung theo chiều dọc và ngang
  alignItems: "center", // Căn giữa nội dung theo chiều dọc
  cursor: "pointer",
  transition: "flex 0.5s ease-in-out, transform 0.3s ease", // Hiệu ứng chuyển động mượt
  borderLeft: "1px solid #B0BEC5", // Màu đường viền xám dịu
  borderTop: "1px solid #B0BEC5", // Màu đường viền xám dịu
  overflow: "hidden", // Ẩn phần dư thừa khi div bị thu nhỏ
  margin: "5px", // Thêm khoảng cách giữa các div
  boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)", // Shadow nhẹ để tạo độ sâu
  backgroundColor: "#ECEFF1", // Màu nền tinh tế hơn cho các div chung
};

// Styles cho nội dung bên trong các div
const contentStyle = {
  padding: "20px", // Thêm khoảng cách cho nội dung thoáng hơn
  textAlign: "center", // Canh giữa nội dung bên trong div
  overflow: "hidden", // Ẩn phần dư nếu nội dung quá lớn
  fontSize: "1.2rem", // Điều chỉnh font-size cho đẹp mắt
  fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", // Font hiện đại và tinh tế
  color: "#37474F", // Màu chữ xám đậm cho sự thanh lịch
};
