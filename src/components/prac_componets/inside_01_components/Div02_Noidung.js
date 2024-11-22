import { useEffect, useState } from "react";

import { useLocation } from "react-router-dom";

import FrameNoidung from "./Div02__I0__Frame";
import DetailNoidung from "./Div02__I1__Detail";
import PracNoidung from "./Div02__I2__Prac";
import MoreDetailNoidung from "./Div02__I1__MoreDetail";
function Noidung() {
  const location = useLocation();

  // Tạo state để lưu object của query params
  const [queryObject, setQueryObject] = useState({});

  useEffect(() => {
    // Tạo một instance của URLSearchParams để lấy các query parameters
    const queryParams = new URLSearchParams(location.search);

    // Tạo một object để chứa các query parameters
    const paramsObj = {};

    // Duyệt qua tất cả các query parameters và thêm vào object
    queryParams.forEach((value, key) => {
      paramsObj[key] = value;
    });

    // Lưu object vào state
    setQueryObject(paramsObj);
  }, [location.search]);
  return (
    <div style={styles.parentContainer}>
      {Object.keys(queryObject).length === 0 ? (
        <FrameNoidung queryObject={queryObject} />
      ) : null}

      {queryObject.page === "detail" ? (
        <DetailNoidung queryObject={queryObject} />
      ) : null}

      {queryObject.page === "prac" ? (
        <PracNoidung queryObject={queryObject} />
      ) : null}

      {queryObject.page === "moreDetail" ? (
        <MoreDetailNoidung queryObject={queryObject} />
      ) : null}
    </div>
  );
}

const styles = {
  parentContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    // padding: "20px",
    backgroundColor: "#f7f7f7", // Subtle background for contrast
  },
  container: {
    display: "flex",
    flexDirection: "row",
    minWidth: "800px",
    width: "100%", // 80% width of parent
    border: "1px solid #ddd",
    borderRadius: "10px",
    backgroundColor: "#fff",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", // Slight shadow for depth
    padding: "15px",
    marginBottom: "20px",
    transition: "transform 0.2s", // Smooth transition for hover effect
  },
  imageSection: {
    flex: "1",
  },
  image: {
    width: "100%",
    height: "auto",
    borderRadius: "8px",
  },
  infoSection: {
    flex: "2",
    paddingLeft: "20px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  topRow: {
    marginBottom: "10px",
  },
  title: {
    fontWeight: "bold",
    fontSize: "18px",
    marginBottom: "5px",
  },
  description: {
    fontSize: "16px",
    color: "#555",
  },
  bottomRow: {
    marginBottom: "10px",
    display: "flex",
    justifyContent: "space-between",
  },
  builder: {
    fontStyle: "italic",
    color: "#888",
  },
  contentAdvisor: {
    fontStyle: "italic",
    color: "#888",
  },
  buttonRow: {
    display: "flex",
    justifyContent: "flex-start",
    gap: "10px",
  },
  button: {
    padding: "8px 16px",
    backgroundColor: "#007BFF",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
  },
  buttonHover: {
    backgroundColor: "#0056b3",
  },
};

export default Noidung;
