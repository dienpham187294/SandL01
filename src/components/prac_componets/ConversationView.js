import React from "react";

function ConversationView({
  PracData,
  Index,
  SubmitSets,
  PickData,
  SetPickData,
  SetTableMode,
}) {
  if (!PracData) return null;

  return (
    <div style={getContainerStyle(PracData)}>
      {PracData.map((dataGroup, groupIndex) => (
        <div key={`group-${groupIndex}`}>
          {renderIndexMarker(groupIndex, Index)}

          {dataGroup.map((dataItem, itemIndex) => (
            <div
              key={`item-${groupIndex}-${itemIndex}`}
              style={getItemStyle(Index >= groupIndex)}
            >
              {renderPurpose(Index === groupIndex, dataItem)}
              {renderSubmitList(Index > groupIndex, dataItem)}
              {renderNotification(Index === groupIndex, dataItem)}
              {renderDebugInfo(
                Index === 3 && Index === groupIndex && itemIndex === 0,
                SubmitSets,
                PickData
              )}
              {renderTablePickingButton(
                Index === groupIndex && itemIndex === 0,
                dataItem,
                SetTableMode
              )}
              {renderPickingList(
                Index >= groupIndex,
                dataItem,
                SetPickData,
                PickData,
                groupIndex
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

function renderIndexMarker(groupIndex, Index) {
  return Index > groupIndex ? (
    <b style={indexMarkerStyle}>{groupIndex + 1}</b>
  ) : null;
}

function renderPurpose(isCurrent, dataItem) {
  if (isCurrent && dataItem.purpose) {
    return (
      <div>
        {dataItem.purpose.map((text, index) => (
          <i key={`purpose-${index}`} style={purposeStyle}>
            {text}
          </i>
        ))}
      </div>
    );
  }
  return null;
}

function renderSubmitList(isVisible, dataItem) {
  if (isVisible && dataItem.submitList) {
    return (
      <div>
        {dataItem.submitList.map((text, index) => (
          <i key={`submit-${index}`} style={submitListStyle}>
            __{text}
          </i>
        ))}
      </div>
    );
  }
  return null;
}

function renderNotification(isCurrent, dataItem) {
  if (isCurrent && dataItem.notify) {
    return (
      <div style={getNotificationStyle(dataItem.notify)}>
        <h5 style={notificationTextStyle}>{dataItem.notify}</h5>
      </div>
    );
  }
  return null;
}

function renderDebugInfo(shouldShow, SubmitSets, PickData) {
  if (shouldShow) {
    return (
      <div style={debugInfoStyle}>
        {JSON.stringify(SubmitSets)}
        <br />
        {JSON.stringify(PickData)}
      </div>
    );
  }
  return null;
}

function renderTablePickingButton(shouldShow, dataItem, SetTableMode) {
  if (shouldShow && dataItem.tablePicking) {
    return (
      <>
        <i>File hệ thống: </i>
        <button
          className="btn btn-primary ml-1"
          onClick={() => SetTableMode(3)}
        >
          <i className="bi bi-card-checklist"></i>
        </button>
      </>
    );
  }
  return null;
}

function renderPickingList(
  isVisible,
  dataItem,
  SetPickData,
  PickData,
  groupIndex
) {
  if (isVisible && dataItem.pickingList) {
    return dataItem.pickingList.map((pickingItem, index) => (
      <div key={`picking-${groupIndex}-${index}`}>
        {showPick(pickingItem, SetPickData, PickData, groupIndex)}
      </div>
    ));
  }
  return null;
}

export default ConversationView;

// showPick helper function
function showPick(arr, SetPickData, PickData, indexOfPhase) {
  if (!Array.isArray(arr)) {
    console.error("Invalid array input");
    return null;
  }

  const handleChange = (e) => {
    const selectedValue = e.target.value;
    if (selectedValue !== "none") {
      updatePickData(arr, selectedValue.trim(), SetPickData, PickData);
    } else {
      removeSelectedItem(arr, SetPickData, PickData);
    }
  };

  return (
    <select
      style={{ width: "200px" }}
      className="form-control"
      onChange={handleChange}
      value={PickData.find((item) => arr.includes(item)) || "none"}
    >
      {renderOptions(arr, indexOfPhase)}
    </select>
  );
}

function updatePickData(arr, selectedValue, SetPickData, PickData) {
  const updatedPickData = PickData.filter((item) => !arr.includes(item));
  SetPickData([...updatedPickData, selectedValue]);
}

function removeSelectedItem(arr, SetPickData, PickData) {
  const updatedPickData = PickData.filter((item) => !arr.includes(item));
  SetPickData(updatedPickData);
}

function renderOptions(arr, indexOfPhase) {
  return arr.map((item, index) => (
    <option
      key={`${indexOfPhase}-${index}`}
      value={index === 0 ? "None" : item.trim()}
    >
      {item}
    </option>
  ));
}

// Styles
const indexMarkerStyle = {
  width: "30px",
  height: "30px",
  borderRadius: "50%",
};

const purposeStyle = {
  fontSize: "medium",
  color: "purple",
  transition: "color 1s ease-in-out",
};

const submitListStyle = {
  marginRight: "10px",
  fontSize: "medium",
  transition: "all 1s ease-in-out",
};

const notificationTextStyle = {
  color: "blue",
  transition: "color 1s ease-in-out",
};

const debugInfoStyle = {
  fontSize: "medium",
};

const getContainerStyle = (PracData) => ({
  transition: "all 1s ease-in-out",
  opacity: PracData ? 1 : 0,
  transform: PracData ? "translateY(0)" : "translateY(-10px)",
});

const getItemStyle = (isVisible) => ({
  display: "inline-block",
  transition: "opacity 1s ease-in-out",
  opacity: isVisible ? 1 : 0,
});

const getNotificationStyle = (notify) => ({
  borderTop: "1px solid green",
  padding: "10px",
  width: "300px",
  transition: "all 1s ease-in-out",
  opacity: notify ? 1 : 0,
});
