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
            padding: "5%",
            cursor: "pointer",
            height: "500px",
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-around",
            alignItems: "center",
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
                alignItems: "center",
                margin: "10px",
              }}
            >
              <img
                src={e.HDTB.IF.IFimg}
                alt={e.HDTB.IF.IFname}
                style={{
                  borderRadius: "10px",
                  width: "150px",
                  height: "150px",
                  objectFit: "cover",
                }}
              />
              <span>{e.HDTB.IF.IFname}</span>
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
