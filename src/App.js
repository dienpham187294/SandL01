import React, { useEffect, useState, createContext } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import Header from "./components/A1_Header";
import Lobby from "./components/Lobby";
import Room from "./components/Room";
import NotExist from "./components/NotExist";
import LearningHub from "./components/LearningHub";
import LearningByHeartHub from "./components/LearningByHeart";
import io from "socket.io-client";
import initializeVoicesAndPlatform from "./ulti/initializeVoicesAndPlatform";
import "bootstrap-icons/font/bootstrap-icons.css";

import LinkAPI from "./ulti/T0_linkApi";

const socket = io(LinkAPI, {
  transports: ["websocket", "polling", "flashsocket"],
});

export const ObjREADContext = createContext(null);

const App = () => {
  const [sttRoom, setSttRoom] = useState(false);
  const [ObjREAD, setObjREAD] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const data = await initializeVoicesAndPlatform();
      setObjREAD(data);
    };
    if (ObjREAD === null) {
      fetchData();
    }
  }, [sttRoom]);

  return (
    <HelmetProvider>
      <ObjREADContext.Provider value={ObjREAD}>
        <Router>
          <div className="chat-app">
            <Header sttRoom={sttRoom} />
            <Routes>
              <Route
                path="/room/:roomCode"
                element={<Room setSttRoom={setSttRoom} />}
              />
              <Route
                path="/"
                element={
                  <Lobby
                    setSttRoom={setSttRoom}
                    fileName={"elementary-a1-lesson-plan"}
                    objList={[0, 1, 2, 3, 4, 5, 6, 7, 8, 9]}
                    objListDefault={[0, 1, 2, 3, 4, 5, 6, 7, 8, 9]}
                    custom={false}
                  />
                }
              />
              <Route path="/noexist" element={<NotExist />} />
              <Route
                path="/learninghub/:id"
                element={<LearningHub setSttRoom={setSttRoom} />}
              />
              <Route
                path="/learningbyheart/:id/:id01"
                element={<LearningByHeartHub />}
              />
            </Routes>
          </div>
        </Router>
      </ObjREADContext.Provider>
    </HelmetProvider>
  );
};

export default App;
export { socket };
