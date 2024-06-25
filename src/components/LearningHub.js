import React, { useEffect, useState, useContext } from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { useParams, useNavigate } from "react-router-dom";
import Lobby from "./Lobby";
import TableHD from "./pracPages/B101_FINAL_TABLE-HD";
import TableTB from "./pracPages/B101_FINAL_TABLE-TB-NotAdd";
import { ObjREADContext } from "../App"; // Import ObjREADContext
const colors = ["red", "orange", "black", "green", "blue", "indigo", "violet"];

const LearningHub = ({ setSttRoom }) => {
  const { id } = useParams();
  const [dataLearning, setDataLearning] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [LearnByHeart, setLearnByHeart] = useState(false);
  const ObjREAD = useContext(ObjREADContext);
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

  const renderContentOftable = () => {
    try {
      if (!dataLearning) return null;

      return (
        <ul
          style={{
            listStyleType: "none",
            padding: 0,
            height: "300px",
            overflow: "auto",
          }}
        >
          {dataLearning.map((item, index) => (
            <li
              key={index}
              style={{
                cursor: "pointer",
                padding: "10px 15px",
                margin: "5px 0",
                border: "1px solid #ccc",
                borderRadius: "5px",
                backgroundColor: index === currentIndex ? "#f0f0f0" : "#fff",
                transition: "background-color 0.3s",
              }}
              onClick={() => setCurrentIndex(index)}
            >
              {index + 1}. <b>{item["SEO"]["seo"].metaTitle}</b>
            </li>
          ))}
        </ul>
      );
    } catch (error) {
      return null;
    }
  };
  const renderContent = () => {
    try {
      if (!dataLearning[currentIndex]) return null;

      const { cssStyles, contentArray } = dataLearning[currentIndex]["SEO"];

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
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }
  function arrayToString(array) {
    return array.join(", ");
  }
  return (
    <HelmetProvider>
      <div style={{ padding: "5%" }}>
        <Helmet>
          <title>
            {id + ": " + dataLearning[currentIndex]["SEO"]["seo"].metaTitle ||
              "Learning Hub"}
          </title>
          <meta
            name="description"
            content={
              dataLearning[currentIndex]["SEO"]["seo"].metaDescription || ""
            }
          />
          <meta
            name="keywords"
            content={
              arrayToString(dataLearning[currentIndex]["SEO"]["seo"].keywords) +
              ", " +
              id
            }
          />
        </Helmet>
        <div style={{ textAlign: "center" }}>
          <h2>
            <i> Bài {currentIndex + 1}</i>
          </h2>
          <h1>{dataLearning[currentIndex]["SEO"]["seo"].metaTitle}</h1>
          <hr />
        </div>
        <div style={{ marginLeft: "30%", width: "40%", marginRight: "20px" }}>
          {renderContentOftable()}
        </div>
        <TableHD
          data={dataLearning[currentIndex]["HDTB"]["HD"]}
          HINT={"HINT"}
        />
        <div
          style={{
            border: "1px solid green",
            borderRadius: "5px",
            padding: "2%",
            fontSize: "larger",
          }}
        >
          {" "}
          {renderContent()}
        </div>
        {dataLearning !== null ? (
          <Lobby
            setSttRoom={setSttRoom}
            fileName={id}
            objList={createArrayFromNumber(dataLearning.length - 1)}
            objListDefault={[currentIndex]}
            custom={true}
          />
        ) : null}
        {dataLearning !== null ? (
          <div>
            {" "}
            {dataLearning[currentIndex]["HDTB"]["TB"].map((e, i) => (
              <TableTB key={i} data={e} color={colors[i % 7]} />
            ))}
          </div>
        ) : null}
        <hr />
        <div>
          <div style={{ fontSize: "larger" }}>
            {" "}
            <h1>Học thuộc lòng!</h1>
            <p>
              {" "}
              <i>
                Là một cách bổ trợ <b>trực tiếp, nhanh chóng và hiệu quả</b> cho
                quá trình thực hành nghe nói. Tuy có hơi nhàm chán nhưng bù lại
                sẽ <b>rút ngắn đáng kể </b>số lần cần phải thực hành để đạt đến
                ngưỡng giao tiếp được.
              </i>
            </p>
            <p>Bước 1: Hãy chép mỗi câu phía dưới đây ra giấy một lần.</p>
            <p>
              Bước 2: Bấm vào Nút <b>Learning by heart!</b> bên dưới. Máy sẽ đọc
              từng câu một, bạn có 10 giây để nghe và chép lại ra giấy (có thể
              ghi tắt).
            </p>
            <button
              onClick={() => {
                navigate("/learningbyheart/" + id + "/" + currentIndex);
              }}
              className="btn btn-outline-primary"
            >
              Learning by heart!
            </button>
            <hr />
            {generateBootstrapList(dataLearning[currentIndex]["ListenList"])}
          </div>
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
    // Kiểm tra nếu input không phải là một mảng
    if (!Array.isArray(sentences)) {
      throw new Error("Input is not an array");
    }

    // Tạo các phần tử Bootstrap list group items
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
