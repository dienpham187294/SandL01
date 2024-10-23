import tableContent from "../dataContent/file-mucluc/tableContent_I.json";
import { Link } from "react-router-dom";
function FrameNoidung() {
  return (
    <div style={styles.parentContainer}>
      <h1>Danh sách các nhân vật cho phương pháp "Nhập vai"</h1>
      <p>
        <i>Hòa mình vào "nhân vật" là bí kíp để nhanh chóng giao tiếp được.</i>
      </p>
      <div>
        {tableContent.map((e, i) => (
          <div key={i} style={styles.container}>
            <div style={styles.imageSection}>
              <img src={e.img} alt="Character" style={styles.image} />
            </div>
            <div style={styles.infoSection}>
              <div style={styles.topRow}>
                <div style={styles.title}>Tên: {e.character_name}</div>
                <div style={styles.description}>Mô tả: {e.description}</div>
                <div style={styles.description}>ID: {e.id}</div>
              </div>
              <div style={styles.bottomRow}>
                <div style={styles.builder}>Nội dung: {e.builder}</div>
                <div style={styles.contentAdvisor}>
                  Cố vấn: {e.content_advisor}
                </div>
              </div>
              <div style={styles.buttonRow}>
                <Link to={"/?page=detail&&id=" + e.id}>
                  <button style={styles.button}>Chi tiết</button>
                </Link>
                <Link to={"/?page=prac&&id=" + e.id}>
                  <button style={styles.button}>Thực hành ngay</button>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  parentContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "20px",
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

export default FrameNoidung;
