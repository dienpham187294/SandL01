import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for routing

const LinkToday = () => {
  const [linkTodayData, setLinkTodayData] = useState(null);

  useEffect(() => {
    // Fetch data from localStorage when the component mounts
    const data = localStorage.getItem("linktoday");
    setLinkTodayData(data);
  }, []); // Empty dependency array ensures this runs only once when the component mounts

  return (
    <div style={styles.container}>
      <h1>Đường dẫn bài học hôm nay!</h1>

      {returnLinksToday(linkTodayData)}
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    textAlign: "center",
    fontFamily: "Arial, sans-serif",
  },
  message: {
    fontSize: "48px",
    marginBottom: "20px",
  },
  countdown: {
    fontSize: "48px",
  },
};

export default LinkToday;

function returnLinksToday(linkTodayData) {
  try {
    let jsonData = JSON.parse(linkTodayData);
    let objKey = Object.keys(jsonData[0]);
    console.log();
    console.log(objKey);
    return (
      <table style={{ cursor: "pointer" }} className="table">
        <tbody>
          {jsonData.map((e, i) => (
            <tr
              onClick={() => {
                try {
                  window.location.href = e.link;
                } catch (error) {}
              }}
            >
              {objKey.map((e1, i1) => (
                <td>{e[e1]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  } catch (error) {
    console.log(error);
    return <i>{linkTodayData}</i>;
  }
}
