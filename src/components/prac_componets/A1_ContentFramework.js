import { useEffect, useState } from "react";
import $ from "jquery";
// import ReadMessage from "./ReadMessage_2024";
// import Dictaphone from "./RegcognitionV2024-05-NG_F";
// import initializeVoicesAndPlatform from "./initializeVoicesAndPlatform";
// import TableView from "./TableView";
// import ConversationView from "./ConversationView";
import PixiJS from "./inside_01_components/PixiJS";
import Tongquan from "./inside_01_components/Div01_Tongquan";
import Noidung from "./inside_01_components/Div02_Noidung";

const screenWidth = window.screen.width;
const screenHeight = window.screen.height;
// let PracDataSave = [];
// let IndexSave = 0;
// let theySaySave = "Hi how are you?";
// let CungThucHanhIndex = 0;

function ContentFramework() {
  // State để lưu id của div được chọn
  const [selectedDiv, setSelectedDiv] = useState("id01");

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

  if (screenWidth < 1000) {
    return (
      <div>
        <h1>Mobile Screen</h1>
      </div>
    );
  }

  return (
    <div>
      {" "}
      <div>
        {/* <Dictaphone
          fn_Xuly={handleCMD}
          CMDList={CMDList}
          fn_speakAgain={handleSpeakAgain}
          fn_speakSlowly={handleSpeakSlowly}
        /> */}
      </div>{" "}
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
                height: "75vh",
                overflow: "auto",
              }}
            >
              <Tongquan />
            </div>

            {selectedDiv !== "id01" ? (
              <h1 className="divFlexH1"> Tổng quan</h1>
            ) : null}
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
                height: "75vh",
                overflow: "auto",
              }}
            >
              <Noidung />
            </div>
            {selectedDiv !== "id02" ? (
              <h1 className="divFlexH1">Nội dung</h1>
            ) : null}
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
                width: "73vw",
                height: "75vh",
                overflow: "auto",
              }}
            >
              <PixiJS />
            </div>
            <h1 className="divFlexH1">Thị trấn</h1>
          </div>
        </div>
      </div>
    </div>
  );
}

// Styles cho container
const containerStyle = {
  display: "flex",
  height: "90vh",
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

export default ContentFramework;
