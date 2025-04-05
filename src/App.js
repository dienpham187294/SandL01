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
import LinkAPI from "./ulti/T0_linkApi";
import KnowGhepAm from "./components/A1_Know_Ghepam";
// import PixiCanvas from "./components/PixiJS";
// import RootPrac from "./components/prac_componets/B1_RootPrac";
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
