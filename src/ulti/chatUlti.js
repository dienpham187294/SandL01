// utils.js - File chứa các hàm tiện ích
import SpeechRecognition from "react-speech-recognition";

export function handle_cmd_f_admin(msg, navigate, setIsOpen) {
  if (msg.text.startsWith("[{") && msg.text.endsWith("}]")) {
    storeLinkToday(msg.text);
  }
  if (!msg.text.includes("##cmd")) {
    return;
  }
  if (msg.text.includes("_openchat")) {
    setIsOpen(true);
  }
  if (msg.text.includes("_closechat")) {
    setIsOpen(false);
  }
  if (msg.text.includes("_newlink")) {
    setIsOpen(false);
  }
  if (msg.text.includes("_forcego")) {
    // navigate(msg.text);
    window.location.href = msg.text;
  }
  if (msg.text.includes("_stopAPI")) {
    try {
      SpeechRecognition.stopListening();
    } catch (error) {
      console.log(error);
    }
  }
  if (msg.text.includes("_closeweb")) {
    try {
      window.location.href =
        "https://translate.google.com/?hl=vi&sl=en&tl=vi&op=translate";
    } catch (error) {
      console.log(error);
    }
  }
  if (msg.text.includes("##cmd_linkcode_")) {
    try {
      let input = msg.text.split("##cmd_linkcode_");
      storeLink({ linkCode: input[1].toUpperCase(), link: input[0] });
    } catch (error) {
      console.log(error);
    }
  }
  if (msg.text.includes("##cmd_removelinkcode")) {
    try {
      localStorage.removeItem("links");
    } catch (error) {
      console.log(error);
    }
  }
}

export function storeLink(data) {
  // Lấy dữ liệu hiện có từ LocalStorage
  let storedData = JSON.parse(localStorage.getItem("links"));
  if (!storedData) {
    storedData = [];
  }
  // Thêm thời gian hết hạn (5 giờ từ lúc cập nhật)
  const expirationTime = new Date().getTime() + 5 * 60 * 60 * 1000; // 5 giờ tính bằng mili giây
  data.expirationTime = expirationTime;
  // Tìm đối tượng có linkCode trùng và thay thế
  const existingIndex = storedData.findIndex(
    (item) => item.linkCode === data.linkCode
  );
  if (existingIndex !== -1) {
    // Thay thế đối tượng có linkCode trùng
    storedData[existingIndex] = data;
  } else {
    // Thêm mới đối tượng
    storedData.push(data);
  }
  // Lưu lại dữ liệu vào LocalStorage
  localStorage.setItem("links", JSON.stringify(storedData));
}

export function storeLinkToday(data) {
  try {
    // Ghi đè lên dữ liệu hiện có trong LocalStorage với key "linktoday"
    localStorage.setItem("linktoday", data);
  } catch (error) {
    console.error("Error storing data in localStorage:", error);
  }
}

export function tachStringTheoHttp(str) {
  // Sử dụng regex để tìm tất cả các URL và tách chuỗi
  const regex = /https?:\/\/[^\s]+/g;
  const matches = str.match(regex);
  if (!matches) return [str];
  // Tách chuỗi thành một mảng với phần không phải URL và URL
  const result = str.split(regex).reduce((arr, part, index) => {
    arr.push(part.trim()); // Thêm phần không phải URL vào mảng
    if (index < matches.length) {
      arr.push(matches[index]); // Thêm URL vào mảng
    }
    return arr;
  }, []);
  return result;
}

// Hàm để lấy màu sắc cho từng nhóm chat
export function getGroupColor(group) {
  const colors = {
    all: "#667eea",
    group1: "#ff6b6b",
    group2: "#4ecdc4",
    group3: "#45b7d1",
    group4: "#96ceb4",
    group5: "#feca57",
    group6: "#ff9ff3",
    group7: "#54a0ff",
    group8: "#5f27cd",
    group9: "#00d2d3",
    group10: "#ff9f43",
  };
  return colors[group] || "#667eea";
}

// Hàm để lấy tên hiển thị của nhóm
export function getGroupDisplayName(group) {
  if (group === "all") return "Chat Toàn Thể";
  const groupNumber = group.replace("group", "");
  return `Nhóm Chat ${groupNumber}`;
}
