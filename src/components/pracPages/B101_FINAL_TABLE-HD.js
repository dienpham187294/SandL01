// import { useEffect, useState } from "react";

function TableHD({ data, data_TB, HINT, fnOnclick }) {
  try {
    const colorMapping = {
      X: "green",
      XX: "dodgerblue",
      [HINT + "#hint"]: "red",
      MM: "purple",
      XXX: "black",
    };

    // Extract headers from the keys of the first object
    const headers = data.length > 0 ? Object.keys(data[0]) : [];
    console.log(JSON.stringify(data_TB));

    let data_TB_newformat = [];
    data_TB.forEach((e) => {
      e.forEach((e1) => {
        data_TB_newformat.push(e1 + "");
      });
    });

    return (
      <table
        className="table table-striped"
        style={{
          textAlign: "left",
          whiteSpace: "pre-line",
          margin: "5%",
          width: "90%",
          cursor: "pointer",
          border: "1px solid black",
          borderRadius: "5px",
        }}
      >
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {headers.map((header, colIndex) => (
                <td
                  style={
                    row[header] && (row[header] + "").includes("(*)")
                      ? {
                          fontSize: "larger",
                          fontWeight: "bold",
                          color: "blue",
                        }
                      : { fontWeight: "bold", fontSize: "large" }
                  }
                  key={colIndex}
                  onClick={() => {
                    if (data_TB_newformat.includes(row[header] + "")) {
                      fnOnclick(row[header] + "", "submit");
                    } else {
                      fnOnclick(row[header], "none");
                    }
                  }}
                >
                  {colorMapping[row[header]] ? (
                    <span
                      style={{
                        padding: "0 25px",
                        backgroundColor: colorMapping[row[header]],
                        borderRadius: "5px",
                      }}
                    ></span>
                  ) : isImageUrl(row[header]) ? (
                    <img
                      src={row[header]}
                      alt={`element-${rowIndex}`}
                      style={imageStyle}
                    />
                  ) : (
                    <div
                      style={
                        data_TB_newformat.includes(row[header] + "")
                          ? {
                              borderBottom: "4px solid blue", // Viền dưới màu xanh dương
                              borderLeft: "1px solid blue", // Viền trái màu xanh dương
                              // height: "80px", // Chiều cao của hình khối
                              padding: "15px", // Khoảng cách nội dung và viền
                              borderRadius: "8px", // Bo góc nhẹ để hình khối trông mềm mại hơn
                              backgroundColor: "#f0f8ff", // Màu nền nhẹ để tạo sự nổi bật
                              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)", // Tạo bóng đổ nhẹ cho hình khối
                            }
                          : {}
                      }
                    >
                      {data_TB_newformat.includes(row[header] + "") ? (
                        <i
                          style={{ color: "green" }}
                          className="bi bi-hand-index-thumb"
                        >
                          {" "}
                        </i>
                      ) : (
                        ""
                      )}{" "}
                      {row[header]}{" "}
                    </div>
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  } catch (error) {
    return null;
  }
}

export default TableHD;

const isImageUrl = (url) => {
  return /\.(jpeg|jpg|gif|png|webp|svg)$/.test(url);
};

const imageStyle = {
  maxWidth: "150px",
  maxHeight: "150px",
  objectFit: "cover",
  borderRadius: "4px",
  border: "2px solid green",
};
