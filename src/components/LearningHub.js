import React, { useEffect, useState, useContext } from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { useParams, useNavigate } from "react-router-dom";
import Lobby from "./Lobby";
import TableHD from "./pracPages/B101_FINAL_TABLE-HD";
import TableTB from "./pracPages/B101_FINAL_TABLE-TB-NotAdd";
// import { ObjREADContext } from "../App";

const colors = ["red", "orange", "black", "green", "blue", "indigo", "violet"];

const LearningHub = ({ setSttRoom, STTconnectFN }) => {
  const { id } = useParams();
  const [dataLearning, setDataLearning] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [STTPractice, setSTTPractice] = useState(false);
  // const ObjREAD = useContext(ObjREADContext);
  const navigate = useNavigate();

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

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Gặp lỗi trong quá trình xử lí dữ liệu, vui lòng thử lại.</div>;
    // return <div>Error: {error}</div>;
  }

  return (
    <HelmetProvider>
      <div style={{ padding: "5%" }}>
        <Helmet>
          <title>
            {`Cùng thực hành: ${
              dataLearning[currentIndex]?.SEO?.seo?.metaTitle || "Learning Hub"
            }`}
          </title>
          <meta
            name="description"
            content={
              dataLearning[currentIndex]?.SEO?.seo?.metaDescription || ""
            }
          />
          <meta
            name="keywords"
            content={`${arrayToString(
              dataLearning[currentIndex]?.SEO?.seo?.keywords
            )}, ${id}`}
          />
        </Helmet>

        {rShowLessonTABLE(dataLearning, currentIndex, setCurrentIndex)}
        <hr />
        <TableHD data={dataLearning[currentIndex]?.HDTB?.HD} HINT={"HINT"} />

        <div
          style={{
            border: "1px solid green",
            borderRadius: "5px",
            padding: "2%",
            fontSize: "larger",
          }}
        >
          {renderContent(dataLearning, currentIndex)}
        </div>

        {STTPractice && dataLearning !== null ? (
          <Lobby
            STTconnectFN={STTconnectFN}
            setSttRoom={setSttRoom}
            fileName={id}
            objList={createArrayFromNumber(dataLearning.length - 1)}
            objListDefault={[currentIndex]}
            custom={true}
          />
        ) : (
          <div style={{ textAlign: "center", padding: "20px 10px" }}>
            <button
              onClick={() => {
                setSTTPractice(true);
              }}
              className="btn btn-primary"
              style={{ fontSize: "1.6em" }}
            >
              BÀI THỰC HÀNH NGHE NÓI
            </button>
          </div>
        )}

        {dataLearning !== null && (
          <div>
            {dataLearning[currentIndex]?.HDTB?.TB.map((e, i) => (
              <TableTB key={i} data={e} color={colors[i % 7]} />
            ))}
          </div>
        )}

        <hr />

        <div style={{ fontSize: "larger" }}>
          <h1>Học thuộc lòng!</h1>
          <p>
            <i>
              Là một cách bổ trợ <b>trực tiếp, nhanh chóng và hiệu quả</b> cho
              quá trình thực hành nghe nói. Tuy có hơi nhàm chán nhưng bù lại sẽ{" "}
              <b>rút ngắn đáng kể </b>số lần cần phải thực hành để đạt đến
              ngưỡng giao tiếp được.
            </i>
          </p>
          <p>Bước 1: Hãy chép mỗi câu phía dưới đây ra giấy một lần.</p>
          <p>
            Bước 2: Bấm vào Nút <b>Learning by heart!</b> bên dưới. Máy sẽ đọc
            từng câu một, bạn có 10 giây để nghe và chép lại ra giấy (có thể ghi
            tắt).
          </p>
          <button
            onClick={() => {
              navigate(`/learningbyheart/${id}/${currentIndex}`);
            }}
            className="btn btn-primary"
            style={{ fontSize: "1.3em" }}
          >
            Learning by heart
          </button>
          <hr />
          {generateBootstrapList(dataLearning[currentIndex]?.ListenList)}
        </div>
      </div>
    </HelmetProvider>
  );
};

export default LearningHub;

function createArrayFromNumber(n) {
  return Array.from({ length: n + 1 }, (_, index) => index);
}

function generateBootstrapList(sentences) {
  try {
    if (!Array.isArray(sentences)) {
      throw new Error("Input is not an array");
    }

    const listItems = sentences.map((sentence, index) => (
      <li className="list-group-item" key={index}>
        {sentence}
      </li>
    ));

    return <ul className="list-group">{listItems}</ul>;
  } catch (error) {
    console.error(error);
    return null;
  }
}

function rShowLessonTABLE(dataLearning, currentIndex, setCurrentIndex) {
  try {
    return (
      <div>
        <div style={{ textAlign: "center" }}>
          {dataLearning.length > 1 ? (
            <h2>
              <u>
                <i>Bài {convertToRoman(currentIndex + 1)}</i>
              </u>
            </h2>
          ) : null}

          <h1>{dataLearning[currentIndex]?.SEO?.seo?.metaTitle}</h1>
          <hr />
        </div>

        {dataLearning.length > 1 ? (
          <div style={{ marginLeft: "30%", width: "40%", marginRight: "20px" }}>
            {renderContentOftable(dataLearning, currentIndex, setCurrentIndex)}
          </div>
        ) : null}
      </div>
    );
  } catch (error) {
    return null;
  }
}

function renderContent(dataLearning, currentIndex) {
  try {
    if (!dataLearning[currentIndex]) return null;

    const { cssStyles, contentArray } = dataLearning[currentIndex].SEO;

    return contentArray.map((item, index) => {
      const Tag = item.tag || "div"; // Default to 'div' if no tag specified
      const style = cssStyles[item.cssClass] || {};

      return (
        <Tag key={index} style={style}>
          {item.content}
        </Tag>
      );
    });
  } catch (error) {
    return null;
  }
}

function renderContentOftable(dataLearning, currentIndex, setCurrentIndex) {
  try {
    if (!dataLearning) return null;

    return (
      <select
        value={currentIndex}
        onChange={(e) => setCurrentIndex(parseInt(e.target.value))}
        style={{
          border: "1px solid #ccc",
          borderRadius: "5px",
          padding: "10px",
        }}
      >
        {dataLearning.map((item, index) => (
          <option
            key={index}
            value={index}
            style={{
              cursor: "pointer",
              padding: "10px 15px",
              margin: "5px 0",
              backgroundColor: index === currentIndex ? "#f0f0f0" : "#fff",
              transition: "background-color 0.3s",
            }}
          >
            {index + 1}. <b>{item.SEO.seo.metaTitle}</b>
          </option>
        ))}
      </select>
    );
  } catch (error) {
    return null;
  }
}

function arrayToString(array) {
  return array.join(", ");
}
function convertToRoman(num) {
  const romanNumerals = [
    { value: 1000, symbol: "M" },
    { value: 900, symbol: "CM" },
    { value: 500, symbol: "D" },
    { value: 400, symbol: "CD" },
    { value: 100, symbol: "C" },
    { value: 90, symbol: "XC" },
    { value: 50, symbol: "L" },
    { value: 40, symbol: "XL" },
    { value: 10, symbol: "X" },
    { value: 9, symbol: "IX" },
    { value: 5, symbol: "V" },
    { value: 4, symbol: "IV" },
    { value: 1, symbol: "I" },
  ];

  let roman = "";
  for (const numeral of romanNumerals) {
    while (num >= numeral.value) {
      roman += numeral.symbol;
      num -= numeral.value;
    }
  }
  return roman;
}
