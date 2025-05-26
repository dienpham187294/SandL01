import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom"; // Import Link component
import linksetbaitap from "./header_data/linkSet_baitap.json";

const LinkToday = () => {
  const [linkTodayData, setLinkTodayData] = useState(linksetbaitap);

  return (
    <div style={styles.container}>
      <div style={styles.contentWrapper}>
        <h1 style={styles.title}>
          🎯 Chinh phục 3000 từ vựng Oxford – Giao tiếp giỏi, thi cử đỉnh!
        </h1>
        <h2 style={styles.subtitle}>
          🎯 Nghe nói với AI, vừa rèn nghe nói vừa bổ sung từ vựng cốt lỗi vừa
          học các mẫu câu thông dụng!
        </h2>
        <p style={styles.description}>
          📚 Tại sao 3000 từ này lại quan trọng đến vậy?
        </p>
        <ul style={styles.list}>
          {[
            "✅ Hiểu tới 90% nội dung tiếng Anh hằng ngày!",
            "✅ Nói chuyện trôi chảy, phản xạ nhanh như người bản xứ!",
            "✅ Tăng vọt điểm IELTS, TOEIC, thi THPT, A2, B1!",
            "✅ Dễ viết, dễ nói, không lo thiếu ý!",
            "✅ Học đúng từ – tiết kiệm thời gian, hiệu quả cao!",
            "✅ Là nền tảng vững chắc để nâng cấp lên trình độ cao hơn!",
          ].map((item, index) => (
            <li
              key={index}
              style={{
                ...styles.listItem,
                ...(index % 2 === 0
                  ? {}
                  : {
                      background:
                        "linear-gradient(135deg, #e8f4fd 0%, #f0f8ff 100%)",
                      borderLeftColor: "#4299e1",
                    }),
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = "translateX(10px)";
                e.target.style.boxShadow = "0 5px 15px rgba(0,0,0,0.1)";
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = "translateX(0)";
                e.target.style.boxShadow = "none";
              }}
            >
              {item}
            </li>
          ))}
        </ul>
        <p style={styles.highlight}>
          🔥 Học đúng từ – Nói đúng cách – Đạt điểm cao!
        </p>
        <div style={styles.quote}>
          Bí quyết đầu tiên là học những từ thông dụng trước. Theo thống kê của
          Oxford thì chỉ cần bạn nắm được khoản 3.000 từ tiếng Anh thông dụng
          nhất, bạn sẽ có thể hiểu được 95% tiếng Anh trong hầu hết mọi hoàn
          cảnh thông thường. So với 100.000 từ thì 3.000 từ là một con số quá
          nhỏ (chỉ bằng 1/33), nhưng chúng lại có thể giúp bạn hiểu được 95% nội
          dung trong hầu hết mọi hoàn cảnh thông thường. Vì vậy bạn hãy bắt đầu
          học ngay bây giờ, mỗi ngày chỉ cần học 5 từ, thì trong vòng 1 năm rưỡi
          bạn đã rất giỏi tiếng Anh rồi.
        </div>
      </div>
      {returnLinksToday(linkTodayData)}
    </div>
  );
};

const styles = {
  container: {
    fontFamily:
      "'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif",
    marginTop: "80px",
    padding: "40px 20px",
    maxWidth: "1200px",
    margin: "80px auto 0",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    borderRadius: "20px",
    boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
    color: "#fff",
  },
  contentWrapper: {
    background: "rgba(255,255,255,0.95)",
    borderRadius: "15px",
    padding: "40px",
    color: "#333",
    marginBottom: "30px",
  },
  title: {
    fontSize: "2.5rem",
    fontWeight: "700",
    marginBottom: "20px",
    background: "linear-gradient(45deg, #667eea, #764ba2)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    textAlign: "center",
    lineHeight: "1.2",
  },
  subtitle: {
    fontSize: "1.4rem",
    fontWeight: "600",
    marginBottom: "25px",
    color: "#4a5568",
    textAlign: "center",
    lineHeight: "1.4",
  },
  description: {
    fontSize: "1.1rem",
    fontWeight: "600",
    marginBottom: "20px",
    color: "#2d3748",
  },
  list: {
    listStyle: "none",
    padding: "0",
    margin: "20px 0",
  },
  listItem: {
    fontSize: "1rem",
    marginBottom: "12px",
    padding: "12px 20px",
    background: "linear-gradient(135deg, #e8f5e8 0%, #f0f8f0 100%)",
    borderRadius: "10px",
    borderLeft: "4px solid #48bb78",
    transition: "all 0.3s ease",
    cursor: "default",
  },
  highlight: {
    fontSize: "1.2rem",
    fontWeight: "700",
    color: "#e53e3e",
    textAlign: "center",
    margin: "25px 0",
  },
  quote: {
    fontSize: "1rem",
    lineHeight: "1.6",
    fontStyle: "italic",
    color: "#4a5568",
    background: "#f7fafc",
    padding: "25px",
    borderRadius: "10px",
    borderLeft: "4px solid #4299e1",
    margin: "20px 0",
  },
  tableContainer: {
    background: "rgba(255,255,255,0.95)",
    borderRadius: "15px",
    padding: "30px",
    overflow: "hidden",
    boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
  },
  table: {
    width: "100%",
    borderCollapse: "separate",
    borderSpacing: "0",
    background: "#fff",
    borderRadius: "10px",
    overflow: "hidden",
    boxShadow: "0 5px 15px rgba(0,0,0,0.08)",
  },
  tableHeader: {
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    color: "#fff",
    fontWeight: "600",
    fontSize: "1rem",
    padding: "15px 20px",
    textAlign: "left",
  },
  linkRow: {
    textDecoration: "none",
    color: "inherit",
    display: "table-row",
    transition: "all 0.3s ease",
  },
  tableCell: {
    padding: "15px 20px",
    borderBottom: "1px solid #e2e8f0",
    fontSize: "0.95rem",
    color: "#4a5568",
    transition: "all 0.3s ease",
  },
  tableRowHover: {
    background: "linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%)",
    transform: "translateY(-2px)",
    boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
  },
};

function returnLinksToday(linkTodayData) {
  try {
    if (!linkTodayData || linkTodayData.length === 0) {
      return (
        <div
          style={{
            ...styles.quote,
            color: "#718096",
            borderLeftColor: "#718096",
            background: "#f7fafc",
          }}
        >
          Không có dữ liệu để hiển thị
        </div>
      );
    }

    // Định nghĩa thứ tự và tên hiển thị cho các cột
    const columnConfig = {
      baitap: "Bài tập",
      name: "Tên bài học",
      score: "Điểm số",
      link: "Liên kết",
    };

    // Lấy các key có trong data và sắp xếp theo thứ tự mong muốn
    const dataKeys = Object.keys(linkTodayData[0]);
    const orderedKeys = Object.keys(columnConfig).filter((key) =>
      dataKeys.includes(key)
    );

    return (
      <div style={styles.tableContainer}>
        <h3
          style={{
            ...styles.subtitle,
            marginBottom: "20px",
            color: "#2d3748",
            textAlign: "left",
          }}
        >
          📝 Danh sách bài tập
        </h3>
        <table style={styles.table} className="table">
          <thead>
            <tr>
              <th style={{ ...styles.tableHeader, width: "5%" }}>#</th>
              {orderedKeys.map(
                (key, index) =>
                  key !== "link" && (
                    <th key={index} style={styles.tableHeader}>
                      {columnConfig[key] ||
                        key.charAt(0).toUpperCase() + key.slice(1)}
                    </th>
                  )
              )}
              <th style={{ ...styles.tableHeader, width: "15%" }}>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {linkTodayData.map((item, index) => (
              <tr
                key={index}
                style={styles.tableRow}
                onMouseEnter={(event) => {
                  const row = event.currentTarget;
                  row.style.background =
                    "linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%)";
                  row.style.transform = "translateY(-2px)";
                  row.style.boxShadow = "0 5px 15px rgba(0,0,0,0.1)";
                }}
                onMouseLeave={(event) => {
                  const row = event.currentTarget;
                  row.style.background = "transparent";
                  row.style.transform = "translateY(0)";
                  row.style.boxShadow = "none";
                }}
              >
                <td
                  style={{
                    ...styles.tableCell,
                    fontWeight: "600",
                    color: "#667eea",
                  }}
                >
                  {index + 1}
                </td>
                {orderedKeys.map(
                  (key, cellIndex) =>
                    key !== "link" && (
                      <td key={cellIndex} style={styles.tableCell}>
                        {key === "score" ? (
                          <span
                            style={{
                              background:
                                "linear-gradient(135deg, #48bb78, #38a169)",
                              color: "white",
                              padding: "4px 12px",
                              borderRadius: "20px",
                              fontSize: "0.85rem",
                              fontWeight: "600",
                            }}
                          >
                            {item[key]}
                          </span>
                        ) : (
                          item[key]
                        )}
                      </td>
                    )
                )}
                <td style={styles.tableCell}>
                  <Link
                    to={item.link}
                    style={{
                      background:
                        "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      color: "white",
                      padding: "8px 16px",
                      borderRadius: "25px",
                      textDecoration: "none",
                      fontSize: "0.85rem",
                      fontWeight: "600",
                      transition: "all 0.3s ease",
                      display: "inline-block",
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.transform = "translateY(-2px)";
                      e.target.style.boxShadow =
                        "0 5px 15px rgba(102, 126, 234, 0.4)";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = "translateY(0)";
                      e.target.style.boxShadow = "none";
                    }}
                  >
                    🚀 Bắt đầu
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  } catch (error) {
    console.error("Error rendering table:", error);
    return (
      <div
        style={{
          ...styles.quote,
          color: "#e53e3e",
          borderLeftColor: "#e53e3e",
          background: "#fed7d7",
        }}
      >
        ❌ Có lỗi xảy ra khi hiển thị dữ liệu {error.message}
      </div>
    );
  }
}

export default LinkToday;
