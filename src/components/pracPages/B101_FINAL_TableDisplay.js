import React from "react";

const TableDisplay = ({ OnTable, DataAllSets, setOnTable }) => {
  try {
    if (OnTable === null) {
      return (
        <div
          style={{
            border: "1px solid green",
            borderRadius: "5px",
            margin: "5%",
            padding: "1%",
            cursor: "pointer",
            height: "250px",
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-around",
            // alignItems: "center",
            overflow: "auto",
          }}
        >
          {DataAllSets.map((e, i) => (
            <div
              className="tableItemsI"
              onClick={() => setOnTable(i)}
              key={i}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "left",
                margin: "10px",
              }}
            >
              <img
                src={e.HDTB.IF.IFimg}
                alt={e.HDTB.IF.IFname}
                style={{
                  borderRadius: "10px",
                  width: "120px",
                  height: "120px",
                  objectFit: "cover",
                }}
              />

              <span style={{ width: "120px", color: "blue" }}>
                <b>{e.HDTB.IF.IFname} </b>
              </span>
            </div>
          ))}
        </div>
      );
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error rendering TableDisplay:", error);
    return null;
  }
};

export default TableDisplay;
