import React, { useState } from "react";
import "../../App.css"; // Để thêm các style cho đẹp hơn
import PixiJS from "../PixiJS";
const App = () => {
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

  return (
    <div style={containerStyle}>
      <div
        id="id01"
        onClick={() => handleDivClick("id01")}
        style={{ ...divStyle, ...getDivStyle("id01") }}
      >
        <div style={contentStyle}>
          <div style={{ width: "400px" }}>
            <h1> Thông tin tổng quan</h1>
          </div>
        </div>
      </div>
      <div
        id="id02"
        onClick={() => handleDivClick("id02")}
        style={{ ...divStyle, ...getDivStyle("id02") }}
      >
        <div style={contentStyle}>Div 2 content...</div>
      </div>
      <div
        id="id03"
        onClick={() => handleDivClick("id03")}
        style={{ ...divStyle, ...getDivStyle("id03") }}
      >
        <div style={contentStyle}>
          <PixiJS />
        </div>
      </div>
      <div
        id="id04"
        onClick={() => handleDivClick("id04")}
        style={{ ...divStyle, ...getDivStyle("id04") }}
      >
        <div style={contentStyle}>Div 4 content...</div>
      </div>
      <div
        id="id05"
        onClick={() => handleDivClick("id05")}
        style={{ ...divStyle, ...getDivStyle("id05") }}
      >
        <div style={contentStyle}>
          Div 5 content with even more text to check how it behaves when the div
          shrinks...
        </div>
      </div>
    </div>
  );
};

// Styles cho container
const containerStyle = {
  display: "flex",
  height: "100vh",
  width: "100%",
};

// Styles chung cho các div
const divStyle = {
  backgroundColor: "#00BFFF",
  color: "white",
  display: "flex",
  flexDirection: "column", // Để căn các phần tử theo chiều dọc
  justifyContent: "center", // Căn giữa nội dung theo chiều dọc
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

export default App;
