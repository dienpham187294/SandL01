import React, { useState } from "react";
import $ from "jquery";

function TableView({
  TableMode,
  TableData,
  screenWidth,
  screenHeight,
  SetPickData,
  PickData,
  SetTableMode,
}) {
  const [searchIndex, setSearchIndex] = useState(0);
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = (query) => {
    const tableCells = document.querySelectorAll("#tablePickingId td");
    resetSearchResults(tableCells);

    if (query) {
      searchTableCells(query, tableCells);
      if (searchResults.length > 0) {
        highlightSearchResult(searchIndex);
      }
    }
    updateSearchDisplay();
  };

  const resetSearchResults = (tableCells) => {
    setSearchResults([]);
    setSearchIndex(0);
    tableCells.forEach((cell) => {
      cell.style.backgroundColor = PickData.includes(cell.innerText)
        ? "yellow"
        : "transparent";
    });
  };

  const searchTableCells = (query, tableCells) => {
    tableCells.forEach((cell) => {
      if (cell.innerText.toLowerCase().includes(query.toLowerCase())) {
        setSearchResults((prevResults) => [...prevResults, cell]);
        cell.style.backgroundColor = "lightgreen";
      }
    });
  };

  const highlightSearchResult = (index) => {
    searchResults[index].style.backgroundColor = "orange";
  };

  const updateSearchDisplay = () => {
    const searchDisplay = document.getElementById("searchDisplay");
    searchDisplay.innerText =
      searchResults.length > 0
        ? `${searchIndex + 1}/${searchResults.length}`
        : "0/0";
  };

  const navigateResults = (direction) => {
    if (searchResults.length > 0) {
      searchResults[searchIndex].style.backgroundColor = "lightgreen";
      const newIndex =
        (searchIndex + direction + searchResults.length) % searchResults.length;
      setSearchIndex(newIndex);
      searchResults[newIndex].scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      highlightSearchResult(newIndex);
      updateSearchDisplay();
    }
  };

  return (
    TableMode !== null &&
    TableData.length > 0 && (
      <div
        id="tablePickingId"
        style={{
          width: "100%",
          fontSize: "medium",
        }}
      >
        <div id="remoteDiv" style={remoteDivStyle}>
          <div style={searchBarStyle}>
            <input
              id="searchInput"
              className="form-control"
              type="text"
              placeholder="Search..."
              style={searchInputStyle}
              onChange={(e) => handleSearch(e.target.value)}
            />
            <div id="searchDisplay" style={searchDisplayStyle}>
              0/0
            </div>
            <button
              className="btn btn-secondary"
              onClick={() => navigateResults(-1)}
            >
              &uarr;
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => navigateResults(1)}
            >
              &darr;
            </button>
          </div>
          {TableMode === 3 && (
            <div>
              {PickData.map((e, i) => (
                <span key={i}>
                  {i + 1}.{e.slice(0, 10)}... /{" "}
                </span>
              ))}
              <button
                className="btn btn-outline-danger"
                onClick={() => SetPickData([])}
              >
                <i className="bi bi-arrow-clockwise"></i>
              </button>
            </div>
          )}
          <div style={otherControlsStyle}>
            <select onChange={(e) => adjustFontSize(e.currentTarget.value)}>
              <option value={16}>Font Size</option>
              {[10, 15, 20, 25, 30, 35, 40, 45].map((size, i) => (
                <option key={i} value={size}>
                  {size}px
                </option>
              ))}
            </select>
            {/* <button
              className="btn btn-outline-danger"
              style={closeButtonStyle}
              onClick={() => SetTableMode(null)}
            >
              <i className="bi bi-x-square"></i>
            </button> */}
          </div>
        </div>
        <hr />
        <DataTableALLInformationPicking
          data={TableData}
          SetPickData={SetPickData}
          PickData={PickData}
          TableMode={TableMode}
        />
      </div>
    )
  );
}

export default TableView;

function DataTableALLInformationPicking({
  data,
  SetPickData,
  PickData,
  TableMode,
}) {
  const renderTable = (rows) => (
    <table
      className="table table-sm table-striped"
      style={tableStyle(TableMode)}
    >
      <tbody>
        {rows.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {row.map((cell, cellIndex) => (
              <td
                key={cellIndex}
                style={{
                  backgroundColor: PickData.includes(cell)
                    ? "yellow"
                    : "transparent",
                  ...cellStyle,
                }}
                onClick={() =>
                  handleCellClick(cell, SetPickData, PickData, TableMode)
                }
              >
                {cell ?? "-"}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );

  if (!Array.isArray(data) || data.length === 0)
    return <div>No data available</div>;

  return (
    <div>
      {data.map((tableData, index) => (
        <div key={index}>{renderTable(tableData)}</div>
      ))}
    </div>
  );
}

const handleCellClick = (cell, SetPickData, PickData, TableMode) => {
  if (cell !== null && TableMode === 3) {
    SetPickData((prevData) =>
      prevData.includes(cell)
        ? prevData.filter((i) => i !== cell)
        : [...prevData, cell]
    );
  }
};

const adjustFontSize = (size) => {
  $("#tablePickingId").css({ fontSize: `${size}px` });
};

const remoteDivStyle = {
  position: "sticky",
  width: "100%",
  top: "0",
  zIndex: 10,
  backgroundColor: "#f8f9fa",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "10px 20px",
  borderRadius: "8px",
  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
  border: "1px solid #ddd",
};

const searchBarStyle = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
};

const searchInputStyle = {
  display: "inline-block",
  border: "1px solid #ced4da",
  borderRadius: "4px",
  padding: "5px 10px",
  width: "200px",
};

const searchDisplayStyle = {
  fontSize: "14px",
  fontWeight: "bold",
};

const otherControlsStyle = {
  display: "flex",
  gap: "10px",
};

const closeButtonStyle = {
  width: "40px",
  height: "40px",
  borderRadius: "50%",
  display: "inline-block",
  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  cursor: "pointer",
  textAlign: "center",
};

// const tableStyle = (TableMode = {
//   backgroundColor: TableMode === 3 ? "#FFEFD5" : "yellow",
//   borderBottom: "1px solid black",
//   marginBottom: "10px",
//   marginTop: "5%",
//   textAlign: "left",
//   borderRadius: "5px",
// });

const tableStyle = (TableMode) => ({
  backgroundColor: TableMode === 3 ? "#FFEFD5" : "#B0E0E6",
  borderBottom: "1px solid black",
  marginBottom: "10px",
  marginTop: "5%",
  textAlign: "left",
  borderRadius: "5px",
});

const cellStyle = {
  borderLeft: "1px solid black",
  padding: "10px",
};
