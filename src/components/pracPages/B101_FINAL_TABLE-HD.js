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
        }}
      >
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {headers.map((header, colIndex) => (
                <td key={colIndex} onClick={() => fnOnclick(row[header])}>
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
