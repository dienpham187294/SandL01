import { Link } from "react-router-dom";
import Test from "../A1_Get_Test copy 2";
function PracNoidung() {
  return (
    <div style={styles.parentContainer}>
      {/* <p>
        <i>
          Luyện tập thay "Nhân vật" xử lý nhanh chóng, thuần thục tất cả các vấn
          đề phát sinh.
        </i>
      </p>
      <Link to={"/"}>
        <button className="btn btn-outline-primary" style={{}}>
          Quay lại
        </button>
      </Link>
      <hr /> */}
      <Test />
    </div>
  );
}

const styles = {
  parentContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    // padding: "3px",
    backgroundColor: "#f7f7f7", // Subtle background for contrast
  },
};

export default PracNoidung;
