// import { useEffect, useState } from "react";

function TableHD({ data, HINT, fnOnclick }) {
  try {
    const colorMapping = {
      X: "green",
      XX: "dodgerblue",
      [HINT]: "red",
      MM: "purple",
      XXX: "black",
    };

    // Extract headers from the keys of the first object
    const headers = data.length > 0 ? Object.keys(data[0]) : [];

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
                    row[header] && row[header].includes("(*)")
                      ? {
                          fontSize: "larger",
                          fontWeight: "bold",
                          color: "blue",
                        }
                      : { fontWeight: "bold", fontSize: "large" }
                  }
                  key={colIndex}
                  onClick={() => fnOnclick(row[header])}
                >
                  {colorMapping[row[header]] ? (
                    <span
                      style={{
                        padding: "0 25px",
                        backgroundColor: colorMapping[row[header]],
                        borderRadius: "5px",
                      }}
                    ></span>
                  ) : (
                    row[header]
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
