import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { socket } from "../App";
import "bootstrap/dist/css/bootstrap.min.css";
import PracticeDIV from "./pracPages/B101_FINAL_PROJECTS";
import CountdownTimer from "./pracPages/B101_FINAL_CounterTime";
import LinkAPI from "../ulti/T0_linkApi";

const Room = ({ setSttRoom }) => {
  const dataPracticingOverRoll = useRef(null);
  const data_typeSets = useRef(null);
  const { roomCode, currentIndex } = useParams();

  useEffect(() => {
    if (roomCode) {
      const fetchTitle = async () => {
        try {
          const response = await fetch(`/jsonData/${roomCode}.json`);
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          const data = await response.json();
          dataPracticingOverRoll.current = data;
          const dataType = [];
          data.forEach((e, i) => {
            e.charactor.forEach((e1) => {
              dataType.push({ no: i, type: e1.type, stt: e1.stt });
            });
          });
          data_typeSets.current = dataType;
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };

      fetchTitle();
    }
  }, [roomCode]);
  useEffect(() => {
    //Bỏ Header
    setSttRoom(true);
  }, []);
  return (
    <div style={{ marginTop: "10vh", padding: "1%" }}>
      <h1>Fetch Data{roomCode}</h1>
      {JSON.stringify(data_typeSets.current)}
    </div>
  );
};

export default Room;

function interleaveCharacters(array1, array2, reverse, setIndexSets) {
  const numberGetPerOne = Math.floor(200 / array2.length);
  let arrRes = [];
  array2.forEach((e) => {
    let resTemp = splitAndConcatArray(array1[e].charactor, reverse).slice(
      0,
      numberGetPerOne
    );
    arrRes = arrRes.concat(resTemp);
  });

  setIndexSets(generateRandomArray(arrRes.length));

  return arrRes;
}

function splitAndConcatArray(array, m) {
  const n = array.length;
  const splitIndex = Math.floor((n * m) / 10);

  const arr1 = array.slice(0, splitIndex);
  const arr2 = array.slice(splitIndex);

  const resultArray = arr2.concat(arr1);

  return resultArray;
}

function generateRandomArray(m) {
  let randomArray = [];
  for (let i = 0; i < m; i++) {
    randomArray.push(Math.floor(Math.random() * (m + 1)));
  }
  return randomArray;
}

function saveNumberWithDailyExpiry(key, value) {
  const now = new Date();
  const expiry = new Date();

  // Đặt thời gian hết hạn vào cuối ngày hiện tại (23:59:59)
  expiry.setHours(23, 59, 59, 999);

  const item = {
    value: value,
    expiry: expiry.getTime(), // Thời gian hết hạn
  };

  localStorage.setItem(key, JSON.stringify(item)); // Lưu vào localStorage
}

function getNumberWithDailyExpiry(key) {
  const itemStr = localStorage.getItem(key);

  // Kiểm tra nếu không có dữ liệu
  if (!itemStr) return null;

  const item = JSON.parse(itemStr);
  const now = new Date().getTime();

  // Kiểm tra nếu hết hạn
  if (now > item.expiry) {
    localStorage.removeItem(key); // Xóa dữ liệu hết hạn
    return null;
  }

  return item.value; // Trả về số nếu chưa hết hạn
}
