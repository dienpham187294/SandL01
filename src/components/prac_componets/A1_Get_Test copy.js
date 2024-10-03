import { useEffect, useState } from "react";
import $ from "jquery";
import ReadMessage from "../ReadMessage_2024";
import Dictaphone from "../RegcognitionV2024-05-NG_Test";
import initializeVoicesAndPlatform from "../initializeVoicesAndPlatform";

import {
  findClosestMatch,
  getRandomElement,
  parceARandomSets,
  shuffleArray,
  collectWeSay,
  removeNoneElements,
  qsSets,
  pickRandomN,
} from "../ulti/help_prac_function";
import InputDataTest from "../data/test/dataTest_01.json";

let PracDataSave = [];
let IndexSave = 0;
let theySaySave = "Hi how are you?";
let CungThucHanhIndex = 0;
const screenWidth = window.screen.width; // Lấy chiều rộng của màn hình
const screenHeight = window.screen.height; // Lấy chiều cao của màn hình

console.log(screenWidth, screenHeight);
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

  const [TableMode, SetTableMode] = useState(0);
  useEffect(() => {
    PracDataSave = PracData;
  }, [PracData]);

  useEffect(() => {
    IndexSave = Index;
  }, [Index]);

  useEffect(() => {
    if (PracData !== null && PracData[Index]) {
      if (Index === 0) {
        try {
          if (PracData[Index]) {
            SetImgAvatar(
              PracData[Index][0].img[0] ||
                "https://i.postimg.cc/KzXn83D8/Andrew-40.jpg"
            );
            SetGender(PracData[Index][0].gender[0] || 1);
          }
        } catch (error) {}
      }

      // Collecting and setting various states
      SetCMDList(collectWeSay(PracData[Index], ["weSay"]));
      SetWeCanSay(
        shuffleArray(
          collectWeSay(PracData[Index], ["weSay", "weCanSayList"]).concat(
            pickRandomN(qsSets, 2)
          )
        )
      );

      SetSubmitSets(collectWeSay(PracData[Index], ["submitList"]));
      SetHDtable(collectWeSay(PracData[Index], ["guideTable"]));
      SetDetailtable(collectWeSay(PracData[Index], ["detailTable"]));
      SetCommonStTable(collectWeSay(PracData[Index], ["commonSt"]));
      SetTablePickingList(collectWeSay(PracData[Index], ["tablePicking"]));
      SetTableMode(null);
    }
    if (PracData === null) {
      SetIndex(0);
      SetPickData([]);
    }
  }, [PracData, Index]);

  useEffect(() => {
    // Handling submitListT and preventing crashes with error handling
    if (!PracDataSave) {
      console.log(!PracDataSave);
      return;
    }
    let submitListT = [];
    try {
      submitListT = PracDataSave[IndexSave].map(
        (e) => e.submitList || []
      ).flat();
    } catch (error) {
      console.log("Error processing submitListT:", error);
    }

    // Checking data and handling index updates
    try {
      let DataCheck = removeNoneElements(PickData);

      let submitSets = removeNoneElements(submitListT);
      let iCheck = submitSets.every((e) => DataCheck.includes(e + "")); // Ensure all elements in submitListT are in DataCheck
      if (iCheck && submitSets.length === DataCheck.length) {
        if (IndexSave < PracDataSave.length - 1) {
          // Move to the next index if not at the end
          SetIndex((prevIndex) => prevIndex + 1);
          SetPickData([]); // Clear PickData for the next set
        } else {
          // If at the last index, reset
          SetPracData(null);
          SetIndex(0);
          SetPickData([]);
          SetScore((D) => D + 1);
        }
      }
    } catch (error) {
      console.log("Error during data check:", error);
    }
  }, [PickData]);

  function fn_speakAgain() {
    ReadMessage(ObjRead, theySaySave, Gender || 1, 0.75);
  }
  function fn_speakSlowly() {
    ReadMessage(ObjRead, theySaySave, Gender || 1, 0.5);
  }
  function fn_Xuly(CMD) {
    try {
      if (CMD !== null) {
        const closestMatch = findClosestMatch(CMD, PracData[Index]);
        theySaySave = getRandomElement(closestMatch.theySay);
        ReadMessage(ObjRead, theySaySave, Gender || 1, 0.75);
        if (closestMatch.action) {
          SetPickData([...PickData, "FN01"]);
        }
      }
    } catch (error) {}
  }

  let searchIndex = 0;
  let searchResults = [];

  function handleSearch(query) {
    // Tìm tất cả các ô trong bảng
    const tableCells = document.querySelectorAll("#tablePickingId td");

    // Reset kết quả tìm kiếm
    searchResults = [];
    searchIndex = 0;

    // Lặp qua tất cả các ô và reset highlight
    tableCells.forEach((cell) => {
      cell.style.backgroundColor = PickData.includes(cell.innerText)
        ? "yellow"
        : "transparent";
    });

    // Nếu có từ khóa tìm kiếm, tìm tất cả các ô chứa từ khóa
    if (query) {
      tableCells.forEach((cell) => {
        if (cell.innerText.toLowerCase().includes(query.toLowerCase())) {
          searchResults.push(cell);
          cell.style.backgroundColor = "lightgreen"; // Tô sáng các ô chứa từ khóa
        }
      });

      // Nếu có kết quả, tô sáng ô đầu tiên
      if (searchResults.length > 0) {
        searchResults[searchIndex].style.backgroundColor = "orange";
        updateSearchDisplay();
      }
    }

    // Cập nhật số lượng kết quả
    updateSearchDisplay();
  }

  // Hàm để cập nhật hiển thị số kết quả tìm kiếm
  function updateSearchDisplay() {
    const searchDisplay = document.getElementById("searchDisplay");
    if (searchResults.length > 0) {
      searchDisplay.innerText = `${searchIndex + 1}/${searchResults.length}`;
    } else {
      searchDisplay.innerText = "0/0";
    }
  }

  // Hàm để di chuyển đến kết quả tiếp theo
  function goToNextResult() {
    if (searchResults.length > 0) {
      searchResults[searchIndex].style.backgroundColor = "lightgreen"; // Reset màu của kết quả hiện tại
      searchIndex = (searchIndex + 1) % searchResults.length; // Di chuyển đến kết quả tiếp theo
      searchResults[searchIndex].scrollIntoView({
        behavior: "smooth",
        block: "center",
      }); // Cuộn đến kết quả
      searchResults[searchIndex].style.backgroundColor = "orange"; // Tô sáng kết quả mới
      updateSearchDisplay();
    }
  }

  // Hàm để di chuyển đến kết quả trước đó
  function goToPreviousResult() {
    if (searchResults.length > 0) {
      searchResults[searchIndex].style.backgroundColor = "lightgreen"; // Reset màu của kết quả hiện tại
      searchIndex =
        (searchIndex - 1 + searchResults.length) % searchResults.length; // Di chuyển đến kết quả trước đó
      searchResults[searchIndex].scrollIntoView({
        behavior: "smooth",
        block: "center",
      }); // Cuộn đến kết quả
      searchResults[searchIndex].style.backgroundColor = "orange"; // Tô sáng kết quả mới
      updateSearchDisplay();
    }
  }

  useEffect(() => {
    if (New !== 0) {
      SetIndex(0);
      SetPickData([]);
      // SetCMD("Hello");
    }
  }, [New]);
  useEffect(() => {
    const initialize = async () => {
      const e = await initializeVoicesAndPlatform();
      SetObjRead(e);
    };

    initialize();
  }, []);

  useEffect(() => {
    let setsN = parceARandomSets(InputDataTest.length);
    SetPracTestList(setsN);
    // SetPracData(InputDataTest[setsN[0]]);
  }, []);
  return (
    <div>
      <Dictaphone
        fn_Xuly={fn_Xuly}
        CMDList={CMDList}
        fn_speakAgain={fn_speakAgain}
        fn_speakSlowly={fn_speakSlowly}
      />

      <div
        style={{
          position: "absolute",
          top: "45%",
          left: "50%",
          transform: "translate(-50%, -50%)", // Căn giữa theo cả chiều ngang và dọc
          width: "800px", // Đặt chiều rộng cho box
          height: "500px", // Đặt chiều cao bằng chiều rộng để tạo hình vuông
          border: "1px solid black", // Viền của box
          borderRadius: "10px",
          padding: "0 20px",
          textAlign: "left", // Canh giữa nội dung bên trong box
          backgroundColor: "#f0f0f0", // Màu nền của box
          transition: "opacity 3s ease-in-out",
          opacity: PracData !== null ? 1 : 0,
        }}
      >
        <div
          style={{
            position: "sticky",
            width: "100%",
            height: "60px",
            textAlign: "right",
          }}
        >
          {Detailtable.length !== 0 ? (
            <button
              className="btn btn-outline-primary"
              onClick={() => SetTableMode(1)}
            >
              <i className="bi bi-clipboard-check"></i>
            </button>
          ) : null}
          {HDtable.length !== 0 ? (
            <button
              className="btn btn-outline-primary"
              onClick={() => SetTableMode(2)}
            >
              <i className="bi bi-info-circle-fill"></i>
            </button>
          ) : null}
        </div>
        <img
          style={{
            borderRadius: "50%",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 1)",
            float: "left", // Đặt float sang trái
            margin: "10px", // Thêm margin để cách các thành phần khác
            transition: "all 2s ease-in-out",
            transform: PracData ? "translateY(0)" : "translateY(-200px)",
          }}
          src={ImgAvatar}
          width={"150px"}
        />

        {conversationView(
          PracData,
          Index,
          SubmitSets,
          PickData,
          SetPickData,
          SetTableMode
        )}
        <div
          style={{
            position: "absolute", // Cố định vị trí so với div mẹ
            bottom: "0", // Luôn dính sát đáy
            width: "80%", // Chiếm toàn bộ chiều rộng của div mẹ
            height: "60px", // Đặt chiều cao cố định
            display: "flex", // Sử dụng flexbox để sắp xếp các phần tử
            alignItems: "center", // Căn giữa các phần tử theo chiều dọc
            justifyContent: "space-between", // Căn đều các phần tử theo chiều ngang
            fontSize: "small",
          }}
        >
          {WeCanSay.map((e, i) => (
            <i key={i} value={e} style={{ marginRight: "5px" }}>
              {e}__
            </i>
          ))}
        </div>

        {TableMode === 3 && TablePickingList.length !== 0 ? (
          <div
            id="tablePickingId"
            style={{
              position: "absolute",
              top: "60%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: screenWidth * 0.9,
              height: screenHeight * 0.6,
              border: "5px solid black",
              borderRadius: "10px",
              padding: "0px 20px",
              textAlign: "center",
              backgroundColor: "#00BFFF",
              transition: "opacity 3s ease-in-out",
              opacity: PracData !== null ? 1 : 0,
              zIndex: 6,
              overflow: "auto",
              fontSize: "medium",
              cursor: "pointer",
            }}
          >
            <div
              id="remoteDiv"
              style={{
                position: "sticky",
                width: "100%",
                top: "0", // Đặt vị trí cố định sát đầu
                zIndex: 10,
                backgroundColor: "#f8f9fa", // Màu nền nhẹ nhàng
                display: "flex", // Sử dụng flexbox để sắp xếp các phần tử
                alignItems: "center", // Căn giữa theo chiều dọc
                justifyContent: "space-between", // Dàn đều các phần tử trong div
                padding: "10px 20px", // Tạo khoảng cách trong container
                borderRadius: "8px", // Bo góc mượt mà
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)", // Hiệu ứng bóng đổ
                border: "1px solid #ddd", // Đường viền nhạt
              }}
            >
              {/* Khối gom input và các nút liên quan */}
              <div
                style={{
                  display: "flex", // Sắp xếp các phần tử bên trong khối này theo chiều ngang
                  alignItems: "center",
                  gap: "10px", // Khoảng cách giữa các phần tử trong khối
                }}
              >
                <input
                  id="searchInput"
                  className="form-control"
                  type="text"
                  placeholder="Search..."
                  style={{
                    display: "inline-block",
                    border: "1px solid #ced4da", // Đường viền nhẹ
                    borderRadius: "4px", // Bo góc nhẹ
                    padding: "5px 10px", // Tạo khoảng cách bên trong
                    width: "200px", // Đặt chiều rộng cố định
                  }}
                  onChange={(e) => handleSearch(e.target.value)}
                />

                <div
                  id="searchDisplay"
                  style={{ fontSize: "14px", fontWeight: "bold" }}
                >
                  0/0
                </div>

                {/* Nút di chuyển giữa các kết quả */}
                <button
                  className="btn btn-secondary"
                  onClick={goToPreviousResult}
                  style={{
                    backgroundColor: "#6c757d",
                    color: "white",
                    border: "none",
                    padding: "6px 12px",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  &uarr;
                </button>

                <button
                  className="btn btn-secondary"
                  onClick={goToNextResult}
                  style={{
                    backgroundColor: "#6c757d",
                    color: "white",
                    border: "none",
                    padding: "6px 12px",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  &darr;
                </button>
              </div>
              <div>
                {PickData.map((e, i) => (
                  <i key={i}>
                    {i + 1}.{e.slice(0, 10)} . . . /{" "}
                  </i>
                ))}
                <button
                  className="btn btn-outline-danger"
                  onClick={() => {
                    SetPickData([]);
                  }}
                >
                  <i className="bi bi-arrow-clockwise"></i>
                </button>
              </div>

              {/* Các nút khác nằm ngoài khối */}
              <div style={{ display: "flex", gap: "10px" }}>
                <select
                  onChange={(e) => {
                    let sizeT = e.currentTarget.value;
                    $("#tablePickingId").css({
                      fontSize: sizeT + "px",
                    });
                  }}
                >
                  <option value={16}>Font Size</option>
                  {[10, 15, 20, 25, 30, 35, 40, 45].map((eS, iS) => (
                    <option key={iS} value={eS}>
                      {eS}px
                    </option>
                  ))}
                </select>

                <button
                  className="btn btn-outline-danger"
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    display: "inline-block",
                    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)", // Bóng đổ nhẹ
                    cursor: "pointer",
                    textAlign: "center",
                  }}
                  onClick={() => {
                    SetTableMode(null);
                  }}
                >
                  <i className="bi bi-x-square"></i>
                </button>
              </div>
            </div>
            <hr />
            {DataTableALLInformationPicking(
              TablePickingList,
              SetPickData,
              PickData
            )}
          </div>
        ) : null}
      </div>

      <div>
        {PracData === null ? (
          <button
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              zIndex: 5,
              width: "50px",
              height: "50px",
              borderRadius: "50%",
              scale: "3",
            }}
            className="btn btn-primary"
            id="btn_chonngaunhien"
            onClick={() => {
              CungThucHanhIndex++;

              SetPracData(InputDataTest[PracTestList[CungThucHanhIndex]]);
              ReadMessage(ObjRead, "Hi", Gender || 1, 0.5);
            }}
          >
            <i className="bi bi-person-plus-fill"></i> {Score}
          </button>
        ) : (
          <button
            style={{
              position: "fixed",
              top: "130px",
              right: "10px",
              zIndex: 5,
              width: "50px",
              height: "50px",
              borderRadius: "50%",
            }}
            onClick={() => SetPracData(null)}
            className="btn btn-danger"
          >
            <i className="bi bi-person-dash-fill"></i>
          </button>
        )}
      </div>
    </div>
  );
}
export default Test;

function showPick(arr, SetPickData, PickData, mode, indexOfPhase) {
  try {
    if (mode) {
      return null;
    }
    if (!Array.isArray(arr)) {
      throw new Error("Input is not an array");
    }

    const handleChange = (e) => {
      const selectedValue = e.target.value;

      if (!mode) {
        // Remove any previous values from other selects that are already in PickData and not the current select
        const updatedPickData = PickData.filter((item) => !arr.includes(item));

        if (selectedValue !== "none") {
          // Add the new selected value to the filtered PickData
          SetPickData([...updatedPickData, selectedValue.trim()]);
        } else {
          // Only update with the filtered data when 'none' is selected (i.e., no value added)
          SetPickData(updatedPickData);
        }
      }
    };

    return (
      <select
        style={{ width: "200px" }}
        className="form-control"
        onChange={handleChange}
        value={PickData.find((item) => arr.includes(item)) || "none"}
      >
        {arr.map((e, i) => (
          <option
            key={indexOfPhase + "" + i}
            value={i === 0 ? "None" : e.trim()}
          >
            {e}
          </option>
        ))}
        <option value={"None"}>None</option>
      </select>
    );
  } catch (error) {
    console.error(error);
    return null;
  }
}

function DataTableALLInformationPicking(arr, SetPickData, PickData) {
  // Helper function to render individual tables
  const renderTable = (data) => {
    try {
      if (!data || data.length === 0) return <div>No data available</div>;
      return (
        <table
          className="table table-sm table-striped"
          style={{
            backgroundColor: "#FFEFD5",
            borderBottom: "1px solid black",
            marginBottom: "10px",
            marginTop: "5%",
            textAlign: "left",
            borderRadius: "5px",
          }}
        >
          <tbody>
            {data.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cell, cellIndex) => (
                  <td
                    key={cellIndex}
                    style={{
                      backgroundColor: PickData.includes(cell)
                        ? "yellow"
                        : "transparent",
                      borderLeft: "1px solid black",
                      padding: "10px",
                    }}
                    onClick={() => {
                      if (cell !== null) {
                        SetPickData((prevData) => {
                          // Kiểm tra nếu phần tử đã tồn tại trong mảng
                          if (prevData.includes(cell)) {
                            // Nếu đã tồn tại, thì loại bỏ phần tử đó khỏi mảng
                            return prevData.filter((i) => i !== cell);
                          } else {
                            // Nếu chưa tồn tại, thì thêm phần tử vào mảng
                            return [...prevData, cell];
                          }
                        });
                      }
                    }}
                  >
                    {cell !== null ? cell : "-"}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      );
    } catch (error) {
      console.error("Error in renderTable:", error);
      return <div>Error rendering table</div>;
    }
  };

  // Main logic to handle array input
  if (arr && Array.isArray(arr)) {
    try {
      return (
        <div>
          {arr.map((tableData, index) => (
            <div key={index}>{renderTable(tableData)}</div>
          ))}
        </div>
      );
    } catch (error) {
      console.error("Error in DataTableALL:", error);
      return <div>Error rendering tables</div>;
    }
  } else {
    return <div>No data available</div>; // Fallback when no data is passed
  }
}
function conversationView(
  PracData,
  Index,
  SubmitSets,
  PickData,
  SetPickData,
  SetTableMode
) {
  try {
    return (
      <div
        style={{
          transition: "all 1s ease-in-out", // Smooth transition for this box
          opacity: PracData ? 1 : 0,
          transform: PracData ? "translateY(0)" : "translateY(-10px)", // Move effect
        }}
      >
        {PracData.map((e, i) => (
          <div key={"a" + i}>
            {Index > i ? (
              <b style={{ width: "30px", height: "30px", borderRadius: "50%" }}>
                {i + 1}
              </b>
            ) : null}
            {e.map((e1, i1) => (
              <div
                key={"AA" + i1}
                style={{
                  display: "inline-block",
                  transition: "opacity 1s ease-in-out", // Smooth transition for inline-block elements
                  opacity: Index >= i ? 1 : 0,
                }}
              >
                {Index === i && e1.purpose ? (
                  <div>
                    {e1.purpose.map((e2, i2) => (
                      <i
                        style={{
                          fontSize: "medium",
                          color: "purple",
                          transition: "color 1s ease-in-out", // Smooth color change
                        }}
                        key={"b" + i1 + i2}
                      >
                        {e2}
                      </i>
                    ))}
                  </div>
                ) : null}
                {Index > i && e1.submitList ? (
                  <div>
                    {e1.submitList.map((e2, i2) => (
                      <i
                        style={{
                          marginRight: "10px",
                          fontSize: "medium",
                          transition: "all 1s ease-in-out", // Smooth transition for list items
                        }}
                        key={"b" + i1 + i2}
                      >
                        __{e2}
                      </i>
                    ))}
                  </div>
                ) : null}
                {Index === i && e1.notify ? (
                  <div
                    style={{
                      borderTop: "1px solid green",
                      padding: "10px",
                      width: "300px",
                      transition: "all 1s ease-in-out", // Smooth transition for notifications
                      opacity: e1.notify ? 1 : 0,
                    }}
                  >
                    <h5
                      style={{
                        color: "blue",
                        transition: "color 1s ease-in-out",
                      }}
                    >
                      {e1.notify}
                    </h5>
                  </div>
                ) : null}

                {Index === 3 && Index === i && i1 === 0 ? (
                  <div style={{ fontSize: "medium" }}>
                    {" "}
                    {JSON.stringify(SubmitSets)}
                    <br />
                    {JSON.stringify(PickData)}
                  </div>
                ) : null}
                {Index === i && i1 === 0 && e1.tablePicking ? (
                  <button
                    className="btn btn-primary"
                    onClick={() => {
                      SetTableMode(3);
                    }}
                  >
                    <i className="bi bi-card-checklist"></i>
                  </button>
                ) : null}
                {Index >= i && e1.pickingList
                  ? e1.pickingList.map((ePickingListPot, iPickingListPot) => (
                      <div key={iPickingListPot}>
                        {showPick(
                          ePickingListPot,
                          SetPickData,
                          PickData,
                          Index === i ? false : true,
                          i
                        )}
                      </div>
                    ))
                  : null}
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  } catch (error) {
    return null;
  }
}
