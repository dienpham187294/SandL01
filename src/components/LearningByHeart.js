import React, { useEffect, useState, useContext } from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { useParams } from "react-router-dom";
import { ObjREADContext } from "../App"; // Import ObjREADContext

const LearningByHeartHub = ({ STTconnectFN }) => {
  const { id, id01 } = useParams();
  const [dataLearning, setDataLearning] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const ObjREAD = useContext(ObjREADContext);
  const [seconds, setSeconds] = useState(0);
  const [intervalId, setIntervalId] = useState(null);
  const [isPaused, setIsPaused] = useState(false);
  const [IsRead, setIsRead] = useState(false);
  const randomGender = () => {
    return Math.random() < 0.5 ? 1 : 2;
  };
  useEffect(() => {
    const fetchTitle = async () => {
      try {
        const response = await fetch(`/jsonData/${id}.json`);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setDataLearning(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTitle();
  }, [id]);

  useEffect(() => {
    if (currentIndex === -1) return;

    if (currentIndex < dataLearning[id01]["ListenList"].length) {
      ReadMessage(
        ObjREAD,
        dataLearning[id01]["ListenList"][currentIndex],
        randomGender(),
        setIsRead
      );
    } else {
      clearInterval(intervalId);
      setIntervalId(null);
      setCurrentIndex(-1);
    }
  }, [currentIndex]);

  useEffect(() => {
    if (seconds % 10 === 0 && seconds !== 0 && !isPaused && !IsRead) {
      setCurrentIndex((prevIndex) => prevIndex + 1);
    }
  }, [seconds, isPaused]);

  const startReading = () => {
    setCurrentIndex(0);
    setSeconds(0);
    const id = setInterval(() => {
      setSeconds((prevSeconds) => prevSeconds + 1);
    }, 1000);
    setIntervalId(id);
  };

  const pauseReading = () => {
    setIsPaused(!isPaused);
    if (isPaused) {
      const id = setInterval(() => {
        setSeconds((prevSeconds) => prevSeconds + 1);
      }, 1000);
      setIntervalId(id);
    } else {
      clearInterval(intervalId);
      setIntervalId(null);
    }
  };

  if (loading) {
    return <div style={{ fontSize: "24px", color: "#ff0000" }}>Loading...</div>;
  }

  if (error) {
    return (
      <div style={{ fontSize: "24px", color: "#ff0000" }}>Error: {error}</div>
    );
  }

  function arrayToString(array) {
    return array.join(", ");
  }

  return (
    <HelmetProvider>
      <div
        style={{
          border: "1px solid green",
          borderRadius: "10px",
          margin: "1% 10%",
          padding: "1% 10%",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "40vh",
          textAlign: "center",
          fontFamily: "Arial, sans-serif",
          color: "#333",
        }}
      >
        <Helmet>
          <title>
            {"Learning By Heart: " +
              (dataLearning[id01]?.["SEO"]["seo"].metaTitle ||
                "Learning By Heart")}
          </title>
          <meta
            name="description"
            content={dataLearning[id01]?.["SEO"]["seo"].metaDescription || ""}
          />
          <meta
            name="keywords"
            content={
              arrayToString(dataLearning[id01]?.["SEO"]["seo"].keywords) +
              ", " +
              id
            }
          />
        </Helmet>

        {STTconnectFN ? (
          <div>
            {" "}
            <hr />
            {currentIndex === -1 ? (
              <button
                onClick={startReading}
                className="btn btn-outline-primary"
              >
                Bắt đầu
              </button>
            ) : (
              <button
                onClick={pauseReading}
                className="btn btn-outline-secondary"
              >
                {isPaused ? "Tiếp tục" : "Tạm dừng"}
              </button>
            )}
            <div style={{ fontSize: "24px" }}>
              <h2>Learning by heart!</h2>
              <h2 style={{ color: "blue" }}>
                Mỗi 10 giây máy sẽ đọc 1 câu sử dụng trong bài thực hành nghe
                nói. Hãy nghe và ghi lại lên giấy nháp (có thể ghi tắt).
              </h2>
              <h1> {formatTime(seconds)}</h1>
              <hr />
              {currentIndex > 0
                ? dataLearning[id01]["ListenList"][currentIndex - 1]
                : ""}
              <hr />
              {IsRead ? "Đang đọc" : null}
            </div>
          </div>
        ) : (
          <h1>Đang kết nói với server, vui lòng đợi giây lát . . . </h1>
        )}
      </div>
    </HelmetProvider>
  );
};

export default LearningByHeartHub;

// Format time as mm:ss
const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
    .toString()
    .padStart(2, "0")}`;
};

let imale, ifemale;

function countAndSplitSentences(text) {
  const sentences = text.match(/[^!]+[!]+/g);
  return sentences || [text];
}

async function ReadMessage(ObjVoices, text, voiceNum, setIsRead) {
  // voiceNum: 1 for female, 0 for male
  console.log("read", ObjVoices, voiceNum, 0.85);

  if (text === "") {
    return;
  }

  imale = ObjVoices.imale;
  ifemale = ObjVoices.ifemale;

  try {
    if (imale === undefined || ifemale === undefined) {
      return;
    }

    let voiceIndex = voiceNum === 1 ? ifemale : imale;
    const sentences = countAndSplitSentences(text);
    console.log(sentences.length);
    // Function to recursively read each sentence
    const speakSentences = (index) => {
      if (index >= sentences.length) {
        setIsRead(false);
        return;
      }

      let msg = new SpeechSynthesisUtterance();
      let voices = window.speechSynthesis.getVoices();
      msg.voice = voices[voiceIndex];
      msg.rate = 0.8;
      msg.text = sentences[index];

      msg.onstart = () => {
        setIsRead(true);
      };

      msg.onend = () => {
        speakSentences(index + 1);
      };

      msg.onerror = (error) => {
        console.error("Error in speech synthesis: ", error);
      };

      speechSynthesis.speak(msg);
    };

    speakSentences(0);
  } catch (error) {
    console.error("Error in ReadMessage function: ", error);
  }
}
