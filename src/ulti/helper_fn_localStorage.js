// Hàm lưu số vào localStorage
function saveNumberToLocalStorage(id, number) {
  if (typeof id !== "string" || typeof number !== "number") {
    console.error(
      "Invalid parameters: id must be a string and number must be a valid number."
    );
    return;
  }
  localStorage.setItem(id, number.toString()); // Chuyển số thành chuỗi để lưu
}

// Hàm lấy số từ localStorage
function getNumberFromLocalStorage(id) {
  if (typeof id !== "string") {
    console.error("Invalid parameter: id must be a string.");
    return null;
  }
  const data = localStorage.getItem(id);
  return data !== null ? parseFloat(data) : null; // Chuyển chuỗi về số
}


export default {
  saveNumberToLocalStorage,
  getNumberFromLocalStorage,
};
