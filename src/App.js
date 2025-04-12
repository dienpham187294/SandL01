import React, { useEffect, useState, createContext } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import Header from "./components/A1_Header";
import Lobby from "./components/Lobby";
import NameDiv from "./components/A1_Name";
import RoomN from "./components/RoomN";
import Room from "./components/Room";
import RoomOffline from "./components/Roomoffline";
import NotExist from "./components/NotExist";
import LinkToday from "./components/LinkToday";
import LearningHub from "./components/LearningHub";
import LearningByHeartHub from "./components/LearningByHeart";
import Settings from "./components/setting";
import ChatWidget from "./components/ChatWidget";
import io from "socket.io-client";
import initializeVoicesAndPlatform from "./ulti/initializeVoicesAndPlatform";
import "bootstrap-icons/font/bootstrap-icons.css";
import HomeView from "./components/A1_Home";
// import LinkAPI from "./ulti/T0_linkApi";
import KnowGhepAm from "./components/A1_Know_Ghepam";
// import PixiCanvas from "./components/PixiJS";
// import RootPrac from "./components/prac_componets/B1_RootPrac";

const LinkAPI =
  window.location.hostname === "localhost"
    ? "http://localhost:5000"
    : "https://seo-onlineplay-new2024-server-428bb40ca879.herokuapp.com/";

const socket = io(LinkAPI, {
  transports: ["websocket", "polling", "flashsocket"],
});

export const ObjREADContext = createContext(null);

const App = () => {
  const [sttRoom, setSttRoom] = useState(false);
  const [STTconnect01, setSTTconnect01] = useState(false);
  const [STTconnect02, setSTTconnect02] = useState(false);
  const [STTconnectFN, setSTTconnectFN] = useState(0);
  const [ObjREAD, setObjREAD] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const data = await initializeVoicesAndPlatform();
      console.log(data);
      setObjREAD(data);
      // console.log(JSON.stringify(data));
      if (data.imale === null || data.ifemale === null) {
        setTimeout(() => {
          fetchData();
        }, 1000);
        // setSTTconnectFN(2);
      } else {
        setSTTconnect01(true);
      }
    };
    if (ObjREAD === null) {
      fetchData();
    }
  }, []);

  useEffect(() => {
    // Check socket connection status
    const handleSocketConnection = () => {
      localStorage.getItem("dinhDanh") ||
        localStorage.setItem("dinhDanh", socket.id);
      setSTTconnect02(socket.connected);
    };

    // Listen to socket connection events
    socket.on("connect", handleSocketConnection);
    socket.on("disconnect", handleSocketConnection);

    // Clean up socket event listeners
    return () => {
      socket.off("connect", handleSocketConnection);
      socket.off("disconnect", handleSocketConnection);
    };
  }, [sttRoom]);

  useEffect(() => {
    if (STTconnect01 === true && STTconnect02) {
      setSTTconnectFN(1);
    }
  }, [STTconnect01, STTconnect02]);
  useEffect(() => {
    cleanExpiredScoresAndOldItems();
  }, []);
  return (
    <HelmetProvider>
      <ObjREADContext.Provider value={ObjREAD}>
        <Router>
          <div className="chat-app">
            <ChatWidget />
            <Routes>
              <Route
                path="/room/:roomCode"
                element={<Room setSttRoom={setSttRoom} />}
              />
              <Route
                path="/roomn/:roomCode/:currentIndex"
                element={<RoomN setSttRoom={setSttRoom} />}
              />

              <Route
                path="/roomoffline/:roomCode/:currentIndex"
                element={<RoomOffline setSttRoom={setSttRoom} />}
              />
              <Route path="/" element={<HomeView />} />

              <Route
                path="/coreknowledge/ghep-tach-am"
                element={<KnowGhepAm />}
              />

              <Route path="/noexist" element={<NotExist />} />
              <Route path="/link" element={<LinkToday />} />
              <Route
                path="/learninghub/:id"
                element={
                  <LearningHub
                    setSttRoom={setSttRoom}
                    STTconnectFN={STTconnectFN}
                  />
                }
              />
              <Route
                path="/learningbyheart/:id/:id01"
                element={<LearningByHeartHub STTconnectFN={STTconnectFN} />}
              />

              <Route path="/setting" element={<Settings />} />
              <Route path="/name" element={<NameDiv />} />
              <Route
                path="*"
                element={
                  <main style={{ padding: "1rem" }}>
                    <p>There's nothing here!</p>
                  </main>
                }
              />
            </Routes>
            <Header sttRoom={sttRoom} STTconnectFN={STTconnectFN} />
          </div>
        </Router>
      </ObjREADContext.Provider>
    </HelmetProvider>
  );
};

export default App;
export { socket };

// <Lobby
// STTconnectFN={STTconnectFN}
// setSttRoom={setSttRoom}
// fileName={"elementary-a1-lesson-plan"}
// objList={[0, 1, 2, 3, 4, 5, 6, 7, 8, 9]}
// objListDefault={[0, 1, 2, 3, 4, 5, 6, 7, 8, 9]}
// custom={false}
// />
function cleanExpiredScoresAndOldItems() {
  const now = Date.now();
  const FOUR_HOURS = 4 * 60 * 60 * 1000;
  const TEN_HOURS = 10 * 60 * 60 * 1000;

  const skipKeys = [
    "ReadMessage",
    "dinhDanh",
    "nameDinhDanh",
    "speechly-auth-token",
    "speechly-device-id",
  ];

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);

    try {
      const raw = localStorage.getItem(key);
      const item = JSON.parse(raw);
      const expires = item?.expires;
      const createdAt = item?.createdAt;

      const isScoreKey = key.includes("score");
      const isExpired = expires && now > expires;
      const isTooOld4h = createdAt && now - createdAt > FOUR_HOURS;
      const hasNoTimeInfo = !expires && !createdAt;

      const isTooOld10h = createdAt && now - createdAt > TEN_HOURS;
      const isInSkipList = skipKeys.includes(key);

      // 1. Xử lý key chứa 'score'
      if (isScoreKey && (isExpired || isTooOld4h || hasNoTimeInfo)) {
        localStorage.removeItem(key);
        i--;
        continue;
      }

      // 2. Nếu key không nằm trong danh sách loại trừ:
      if (!isInSkipList) {
        // Xóa nếu quá 10 tiếng hoặc không có createdAt
        // if (isTooOld10h || !createdAt) {
        //   localStorage.removeItem(key);
        //   i--;
        //   continue;
        // }
        if (isTooOld10h) {
          localStorage.removeItem(key);
          i--;
          continue;
        }
      }
    } catch (e) {
      // Nếu không parse được JSON → xóa trừ khi nằm trong danh sách loại trừ
      if (!skipKeys.includes(key)) {
        localStorage.removeItem(key);
        i--;
      }
    }
  }
}
