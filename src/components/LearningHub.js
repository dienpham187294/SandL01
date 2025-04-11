import React, { useEffect, useState, useContext } from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import Lobby from "./Lobby";
import TableHD from "./pracPages/B101_FINAL_TABLE-HD";
import TableTB from "./pracPages/B101_FINAL_TABLE-TB-NotAdd";
// import { ObjREADContext } from "../App";
import Dictaphone from "../ulti/RegcognitionV2024-05-NG_FOR_TEACHING";
import NguyenTacghepam from "./A1_NguyentacGhepam";
import ReadMessage from "../ulti/ReadMessage_2024";
const colors = ["red", "orange", "black", "green", "blue", "indigo", "violet"];

const LearningHub = ({ setSttRoom, STTconnectFN }) => {
  const { id } = useParams();
  const locationSet = useLocation();
  const params = new URLSearchParams(locationSet.search);
  const [dataLearning, setDataLearning] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [STTPractice, setSTTPractice] = useState(true);
  // const ObjREAD = useContext(ObjREADContext);

  const [choose_a_st, setchoose_a_st] = useState(null);
  const [CMDlist, setCMDlist] = useState("Hi how are you");

  const [StartToGetData, setStartToGetData] = useState(false);

  const navigate = useNavigate();

  // useEffect(() => {
  //   const fetchTitle = async () => {
  //     try {
  //       let response;
  //       if (id.charAt(1) === "z") {
  //         response = await fetch(`/jsonData/forseo/${id}.json`);
  //       } else {
  //         response = await fetch(`/jsonData/${id}.json`);
  //       }
  //       if (!response.ok) {
  //         throw new Error("Network response was not ok");
  //       }
  //       const data = await response.json();
  //       setDataLearning(data);
  //     } catch (error) {
  //       setError(error.message);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchTitle();
  // }, [id]);
  const fetchTitle = async () => {
    try {
      let response;
      if (id.charAt(1) === "z") {
        response = await fetch(`/jsonData/forseo/${id}.json`);
      } else {
        response = await fetch(`/jsonData/${id}.json`);
      }
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

  useEffect(() => {
    // alert(params.id);
    handle_div(params.get("id"));
    if (params.get("st")) {
      try {
        try {
          setCMDlist(params.get("st").split("-").join(" "));
        } catch (error) {}
      } catch (error) {}
    }

    if (params.get("ls")) {
      try {
        try {
          setCurrentIndex(params.get("ls"));
        } catch (error) {}
      } catch (error) {}
    }
  }, [params]);

  useEffect(() => {
    try {
      navigate(
        `/learninghub/${id}?ls=${currentIndex}&&id=div_01_prac_ghep_am&&st=` +
          choose_a_st.split(" ").join("-")
      );
    } catch (error) {}
  }, [choose_a_st]);

  if (!StartToGetData) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          backgroundColor: "#f9f9f9",
        }}
      >
        <img
          src="https://i.postimg.cc/Bv9MGGy8/favicon-ico.png"
          width={"160px"}
          style={{
            margin: "10px",
            border: "1px solid blue",
            borderRadius: "15px",
            cursor: "pointer",
          }}
        />
        <button
          onClick={() => {
            setStartToGetData(true);
            fetchTitle();
          }}
          style={{
            padding: "12px 24px",
            fontSize: "16px",
            backgroundColor: "#0070f3",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            transition: "background-color 0.3s ease",
          }}
          onMouseOver={(e) =>
            (e.currentTarget.style.backgroundColor = "#0059c1")
          }
          onMouseOut={(e) =>
            (e.currentTarget.style.backgroundColor = "#0070f3")
          }
        >
          Bấm để lấy dữ liệu
        </button>
      </div>
    );
  }
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Gặp lỗi trong quá trình xử lí dữ liệu, vui lòng thử lại.</div>;
    // return <div>Error: {error}</div>;
  }

  return (
    <HelmetProvider>
      <div style={{ marginTop: "8vh", padding: "5%" }}>
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
            content={`Cùng thực hành, cung thuc hanh, ${arrayToString(
              dataLearning[currentIndex]?.SEO?.seo?.keywords
            )}, ${id}`}
          />
        </Helmet>
        <section>
          <select
            onChange={(e) => {
              // Tìm tất cả các div có class 'divlearnHub'
              navigate(
                `/learninghub/${id}?ls=` +
                  currentIndex +
                  `&&id=` +
                  e.target.value
              );
              // handle_div);
            }}
          >
            {" "}
            <option value="div_01_content_table_to_practice">Chọn</option>
            <option value="div_01_content_to_learn">Nội dung</option>
            <option value="div_01_content_table_to_practice">Thực hành</option>
            <option value="div_01_prac_ghep_am">Ghép âm</option>{" "}
            <option value="div_01_prac_luyen_am">Nguyên tắc ghép âm</option>
            <option value="div_01_prac_hoc_thuoc">Học thuộc</option>{" "}
            <option value="div_01_prac_phuongphaphoc">Phương pháp học</option>
            <option value="div_01_prac_bangnhap">Bảng nháp</option>
            <option value="div_01_prac_vaothuchanh">Vào thực hành</option>
          </select>
          <div style={{ display: "flex" }}>
            {" "}
            <div
              id="div_01_content_to_learn"
              className="divlearnHub"
              style={{
                flex: 0,
                backgroundColor: "",
                transition: "all 1s ease",
                whiteSpace: "pre-line",
                border: "1px solid black",
                padding: "2%",
                borderRadius: "5px",
                width: "0",
                padding: "0",
              }}
            >
              <p style={{ fontSize: "30px", fontWeight: "400" }}>
                {" "}
                {dataLearning[currentIndex]?.HDTB?.IF?.IFdes}{" "}
                {dataLearning[currentIndex] ? (
                  <div>{renderContent(dataLearning, currentIndex)}</div>
                ) : null}
              </p>
            </div>
            <div
              id="div_01_content_table_to_practice"
              className="divlearnHub"
              style={{
                flex: 8,
                backgroundColor: "lightgreen",
                transition: "all 1s ease",
                width: "80wh",
                padding: "20px",
              }}
            >
              {rShowLessonTABLE(
                dataLearning,
                currentIndex,
                setCurrentIndex,
                navigate,
                id
              )}
              <TableHD
                data={dataLearning[currentIndex]?.HDTB?.HD}
                data_TB={[]}
                HINT={"HINT"}
                fnOnclick={(e) => {
                  try {
                    navigate(
                      `/learninghub/${id}?ls=${currentIndex}&&id=div_01_prac_ghep_am&&st=` +
                        (e + "").split(" ").join("-")
                    );
                  } catch (error) {}
                  // setchoose_a_st(e);
                }}
              />{" "}
              {/* {dataLearning !== null && (
                <div>
                  {dataLearning[currentIndex]?.HDTB?.TB.map((e, i) => (
                    <TableTB key={i} data={e} color={colors[i % 7]} />
                  ))}
                </div>
              )} */}
            </div>
            <div
              id="div_01_prac_ghep_am"
              className="divlearnHub"
              style={{
                flex: 0,
                backgroundColor: "lightblue",
                transition: "all 1s ease",
                padding: "20px",
                overflow: "hidden",
                width: "0",
                padding: "0",
              }}
            >
              <div className="row">
                <div className="col-6">
                  <div className="row">
                    <div className="col-2">
                      {" "}
                      <button
                        onClick={() => {
                          navigate(
                            `/learninghub/${id}?ls=` +
                              currentIndex +
                              `&&id=div_01_content_table_to_practice`
                          );
                        }}
                        className="btn btn-info"
                      >
                        Quay lại bảng
                      </button>
                    </div>
                    <div className="col-6">
                      {" "}
                      {generateBootstrapList(
                        dataLearning[currentIndex]?.ListenList,
                        choose_a_st,
                        setchoose_a_st
                      )}{" "}
                    </div>
                    <div className="col-3">
                      {" "}
                      <button
                        onClick={() => {
                          try {
                            const textArea =
                              document.getElementById("clearClassForTable");
                            if (textArea) {
                              textArea.value = ""; // Đặt giá trị rỗng cho textarea
                            }
                          } catch (error) {
                            console.error(
                              "Error clearing input values:",
                              error
                            );
                          }
                        }}
                        style={{ marginLeft: "100px" }}
                        className="btn btn-primary"
                      >
                        Clear Table
                      </button>
                    </div>
                  </div>
                  <hr />
                  <div className="row">
                    {" "}
                    <h5>Đoán - Tra - Tìm - Ghép</h5>
                    <h4 style={{ color: "blue" }}>U - E - O - A - i - Ơ</h4>
                  </div>
                  <hr />
                  <h1>{choose_a_st ? choose_a_st : CMDlist}</h1> <hr />
                  <textarea
                    style={{
                      width: "90%",
                      height: "300px",
                      fontSize: "36px",
                      fontWeight: "700",
                      color: "#ffffff",
                      backgroundColor: "#1e90ff",
                      cursor: "pointer",
                      marginLeft: "40px",
                      zIndex: 100,
                      textDecoration: "underline",
                    }}
                    id="clearClassForTable"
                  ></textarea>
                  <div className="row">
                    <hr />
                    <div className="col-6">
                      {" "}
                      <h5>4 bước: Đoán - Tra - Tìm - Ghép</h5>
                    </div>
                    <div className="col-6">
                      <h4>
                        * Nguyên lý ghép âm: ghép trái trước-ghép phải sau
                      </h4>
                    </div>{" "}
                    <div className="col-6">
                      {" "}
                      "Tìm" là tìm đầu tiên:
                      <h4 style={{ color: "blue" }}>U - E - O - A - i - Ơ</h4>
                    </div>{" "}
                    <div className="col-6">
                      <h4> * Đọc giữ nhịp theo quy tắc 4 ngón bàn tay phải</h4>
                    </div>
                  </div>
                </div>
                <div className="col-6">
                  {CMDlist}
                  <Dictaphone CMDlist={CMDlist} />
                  <hr />
                  <button
                    className="btn btn-danger"
                    onClick={() => {
                      ReadMessage(
                        { imale: 0, ifemale: 2 },
                        "Sorry, what did you say?",
                        1,
                        [{ id: "sorryFemale" }]
                      );
                    }}
                  >
                    Kiểm tra thử âm thanh
                  </button>
                  <i>
                    (Có nghe âm thanh máy nói "Sorry, what did you say?" là ổn)
                  </i>
                  <br /> <br />
                  <button
                    className="btn btn-danger"
                    onClick={() => {
                      kiemtramic();
                    }}
                  >
                    Kiểm tra microphone
                  </button>
                  <br />
                  <i id="kiemtramicro"></i> <hr />
                </div>
              </div>

              {/* <button
                className="btn btn-danger"
                onClick={() => {
                  setchoose_a_st(null);
                }}
              >
                Hide table
              </button> */}
            </div>
            <div
              id="div_01_prac_luyen_am"
              className="divlearnHub"
              style={{
                flex: 0,
                backgroundColor: "",
                transition: "all 1s ease",
                whiteSpace: "pre-line",
                border: "1px solid black",
                padding: "2%",
                borderRadius: "5px",
                overflow: "hidden",
                width: "0",
                padding: "0",
              }}
            >
              <h1></h1>
              <p style={{ fontSize: "larger" }}>
                {" "}
                <NguyenTacghepam />
              </p>
            </div>
            <div
              id="div_01_prac_hoc_thuoc"
              className="divlearnHub"
              style={{
                flex: 0,
                backgroundColor: "",
                transition: "all 1s ease",
                whiteSpace: "pre-line",
                border: "1px solid black",
                padding: "2%",
                borderRadius: "5px",
                overflow: "hidden",
                width: "0",
                padding: "0",
              }}
            >
              <p style={{ fontSize: "30px" }}>
                {" "}
                <h1>Học thuộc lòng!</h1>
                <p>
                  <i>
                    Là một cách bổ trợ <b>trực tiếp, nhanh chóng và hiệu quả</b>{" "}
                    cho quá trình thực hành nghe nói. Tuy có hơi nhàm chán nhưng
                    bù lại sẽ <b>rút ngắn đáng kể </b>số lần cần phải thực hành
                    để đạt đến ngưỡng giao tiếp được.
                  </i>
                </p>
                <p>Bước 1: Hãy chép mỗi câu phía dưới đây ra giấy một lần.</p>
                <p>
                  Bước 2: Bấm vào Nút <b>Learning by heart!</b> bên dưới. Máy sẽ
                  đọc từng câu một, bạn có 10 giây để nghe và chép lại ra giấy
                  (có thể ghi tắt).
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
              </p>
            </div>
            <div
              id="div_01_prac_phuongphaphoc"
              className="divlearnHub"
              style={{
                flex: 0,
                backgroundColor: "",
                transition: "all 1s ease",
                whiteSpace: "pre-line",
                border: "1px solid black",
                padding: "2%",
                borderRadius: "5px",
                overflow: "hidden",
                width: "0",
                padding: "0",
              }}
            >
              <h1></h1>
              <p style={{ fontSize: "30px" }}>
                {" "}
                <div style={{ padding: "5%" }}>
                  <h1>
                    Thực hành lặp lại (có ghi nhận phản hồi-sửa chửa) là con
                    đường phải đi qua để đạt được kĩ năng. Hãy lấy kỉ luật và
                    cùng thực hành chung làm động lực.
                  </h1>
                  <ul>
                    <li>
                      Mục tiêu tối thiểu để biết nghe nói là 10.000 lượt nghe
                      nói.
                    </li>
                    <li>
                      Mục tiêu mỗi buổi thực hành ít cũng phải trên 100 lượt
                      nghe nói. Một buổi thực hành không dành thời gian nghe-nói
                      nhiều là một buổi chưa hiệu quả.
                    </li>
                    <li>
                      Mỗi buổi học đều nên nhắc lại các kiến thức cốt lõi về
                      tách ghép âm.
                    </li>
                    <li>
                      Thực hành ghép âm (chọn vài từ trong bảng nội dung để
                      ghép)
                    </li>{" "}
                    <li>
                      Thực hành tách âm (người hướng dẫn đọc vài từ và yêu cầu
                      người thực hành nghe xem nguyên âm đại diện là gì?)
                    </li>
                    <li>
                      ***Lưu ý khi hướng dẫn và học về Ghép âm - Phân tách âm:
                      Giai đoạn ban đầu hãy tập trung vào nguyên âm đại diện
                      UEOAI-ơ và nguyên lý ghép âm, các âm phụ khác thì lướt qua
                      hoặc chỉ thị phạm mà không phân tích kĩ.
                    </li>
                    <li>
                      Khi hướng dẫn và học nội dung trong bảng, chỉ cần vừa đủ
                      để có thể thực hành, đừng quá học kĩ càng, cũng đừng tập
                      trung vào làm rõ nghĩa hoặc cấu trúc câu, hãy nắm vừa đủ
                      và nhanh chóng chuyển qua thực hành, khi thực hành tự khắc
                      sẽ nắm nội dung.
                    </li>
                    <li>
                      Sau khi đã thực hành 1 hoặc 1 vài lần quay lại làm rõ, học
                      thuộc các "gán nghĩa" từ bảng nội dung (ưu tiên phụ nếu có
                      thời gian).
                    </li>
                    <li>Mở rộng thực hành nhiều bài cùng một lúc.</li>
                  </ul>
                </div>
              </p>
            </div>{" "}
            <div
              id="div_01_prac_bangnhap"
              className="divlearnHub"
              style={{
                flex: 0,
                backgroundColor: "",
                transition: "all 1s ease",
                whiteSpace: "pre-line",
                border: "1px solid black",
                padding: "2%",
                borderRadius: "5px",
                overflow: "hidden",
                width: "0",
                padding: "0",
              }}
            >
              <h1>Nháp!</h1>
              <div className="row">
                <div className="col-4">
                  {" "}
                  <textarea
                    style={{
                      width: "90%",
                      height: "800px",
                      fontSize: "36px",
                      fontWeight: "700",
                      color: "#ffffff",
                      backgroundColor: "#1e90ff",
                      cursor: "pointer",
                      marginLeft: "60px",
                      padding: "10px",
                      zIndex: 100,
                      textDecoration: "underline",
                    }}
                  ></textarea>
                </div>{" "}
                <div className="col-4">
                  {" "}
                  <textarea
                    style={{
                      width: "90%",
                      height: "800px",
                      fontSize: "36px",
                      fontWeight: "700",
                      color: "#ffffff",
                      backgroundColor: "#1e90ff",
                      cursor: "pointer",
                      marginLeft: "60px",
                      padding: "10px",
                      zIndex: 100,
                      textDecoration: "underline",
                    }}
                  ></textarea>
                </div>{" "}
                <div className="col-4">
                  {" "}
                  <textarea
                    style={{
                      width: "90%",
                      height: "800px",
                      fontSize: "36px",
                      fontWeight: "700",
                      color: "#ffffff",
                      backgroundColor: "#1e90ff",
                      cursor: "pointer",
                      marginLeft: "60px",
                      padding: "10px",
                      zIndex: 100,
                      textDecoration: "underline",
                    }}
                  ></textarea>
                </div>
              </div>
            </div>
            <div
              id="div_01_prac_vaothuchanh"
              className="divlearnHub"
              style={{
                flex: 0,
                backgroundColor: "",
                transition: "all 1s ease",
                whiteSpace: "pre-line",
                border: "1px solid black",
                padding: "2%",
                borderRadius: "5px",
                overflow: "hidden",
                width: "0",
                padding: "0",
              }}
            >
              {STTPractice && dataLearning !== null ? (
                <Lobby
                  STTconnectFN={STTconnectFN}
                  setSttRoom={setSttRoom}
                  fileName={id}
                  objList={createArrayFromNumber(dataLearning.length - 1)}
                  objListDefault={[currentIndex]}
                  custom={true}
                  id={id}
                  currentIndex={currentIndex}
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
                    Cùng thực hành
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>
        {/* <div style={{ display: "flex", transition: "flex 1s ease" }}>
          <div
            id="div_01_content_to_learn"
            className="divlearnHub"
            style={{ flex: 0, width: "80wh", overflow: "hidden" }}
          >
            <h1>{dataLearning[currentIndex]?.SEO?.seo?.metaTitle}</h1>
          </div>
          <div
            id="div_01_content_table_to_practice"
            style={{ flex: 8, width: "80wh", overflow: "hidden" }}
          >
            {rShowLessonTABLE(dataLearning, currentIndex, setCurrentIndex)}
            <TableHD
              data={dataLearning[currentIndex]?.HDTB?.HD}
              HINT={"HINT"}
              fnOnclick={(e) => {
                setchoose_a_st(e);
              }}
            />
          </div>
          <div
            id="div_01_practice"
            className="divlearnHub"
            style={{ flex: 0, width: "80wh", overflow: "hidden" }}
          >
            {generateBootstrapList(
              dataLearning[currentIndex]?.ListenList,
              choose_a_st,
              setchoose_a_st
            )}{" "}
            <hr />
            <h1>{choose_a_st}</h1>
            {choose_a_st ? (
              <table style={{ textAlign: "center", fontSize: "30px" }}>
                <tbody>
                  <tr>
                    {choose_a_st.split(" ").map((e, i) => (
                      <td key={i}>
                        {" "}
                        <span style={{ padding: "20px" }}>{e}</span>{" "}
                      </td>
                    ))}
                  </tr>

                  {["Đoán", "Tra", "Tìm", "Ghép"].map((e_key) => (
                    <tr key={e_key}>
                      {choose_a_st.split(" ").map((e, i) => (
                        <td key={i}>
                          <input
                            type="text"
                            className="clearClassForTable"
                            style={{
                              width: "90%",
                              textAlign: "center",
                              // padding: "5px",
                              // boxSizing: "border-box",
                            }}
                            // placeholder={e_key}
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : null}{" "}
            <button
              onClick={() => {
                try {
                  const inputs =
                    document.getElementsByClassName("clearClassForTable");
                  for (let i = 0; i < inputs.length; i++) {
                    if (inputs[i] instanceof HTMLInputElement) {
                      inputs[i].value = ""; // Clear the value of input elements
                    }
                  }
                } catch (error) {
                  console.error("Error clearing input values:", error);
                }
              }}
              className="btn btn-primary me-3"
            >
              Clear Table
            </button>
            <button
              className="btn btn-danger"
              onClick={() => {
                setchoose_a_st(null);
              }}
            >
              Hide table
            </button>
            <h5>Đoán - Tra - Tìm - Ghép</h5>
            {choose_a_st ? (
              <input
                className="form-control"
                type="text"
                style={{
                  // width: "90%",
                  textAlign: "center",
                  padding: "5px",
                  boxSizing: "border-box",
                  fontSize: "30px",
                }}
                // placeholder="Type here"
              />
            ) : null}
          </div>
        </div> */}
      </div>
    </HelmetProvider>
  );
};

export default LearningHub;

function createArrayFromNumber(n) {
  return Array.from({ length: n + 1 }, (_, index) => index);
}

function generateBootstrapList(sentences, choose_a_st, setchoose_a_st) {
  try {
    if (!Array.isArray(sentences)) {
      throw new Error("Input is not an array");
    }

    const listItems = sentences.map((sentence, index) => (
      <option value={sentence} key={index}>
        {sentence}
      </option>
    ));

    return (
      <div>
        <select
          onChange={(e) => {
            setchoose_a_st(e.target.value);
          }}
          style={{ width: "300px", padding: "5px" }}
          className=""
        >
          <option value={""}>Các câu trong bài thực hành</option>
          {listItems}
        </select>
      </div>
    );
  } catch (error) {
    console.error(error);
    return null;
  }
}

function rShowLessonTABLE(
  dataLearning,
  currentIndex,
  setCurrentIndex,
  navigate,
  id
) {
  try {
    return (
      <div>
        <div style={{ textAlign: "center" }}>
          {dataLearning.length > 1 ? (
            <h2>
              <u>
                <i>Bài {convertToRoman(parseInt(currentIndex) + 1)}</i>
              </u>
            </h2>
          ) : null}

          <h1>{dataLearning[currentIndex]?.SEO?.seo?.metaTitle}</h1>
          <hr />

          {dataLearning[currentIndex].youtubeSrc ? (
            <div
              style={{
                position: "relative",
                overflow: "hidden",
                width: "100%",
                paddingTop:
                  "56.25%" /* 16:9 Aspect Ratio (divide 9 by 16 = 0.5625) */,
              }}
            >
              <iframe
                style={{
                  position: "absolute",
                  top: "15%",
                  left: "15%",
                  bottom: "15%",
                  right: "15%",
                  width: "70%",
                  height: "70%",
                  border: 0 /* Optional: Remove border */,
                }}
                src={dataLearning[currentIndex].youtubeSrc}
                allowFullScreen
              ></iframe>

              <i>
                Video được trích dẫn với mục đích tư liệu học tập. <br />
                Nguồn:
                {dataLearning[currentIndex].youtubeSrc}
              </i>
            </div>
          ) : null}
        </div>

        {dataLearning.length > 1 ? (
          <div style={{ marginLeft: "30%", width: "40%", marginRight: "20px" }}>
            {renderContentOftable(
              dataLearning,
              currentIndex,
              setCurrentIndex,
              navigate,
              id
            )}
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
    // console.log(dataLearning[currentIndex].SEO.contentArray);
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

function renderContentOftable(
  dataLearning,
  currentIndex,
  setCurrentIndex,
  navigate,
  id
) {
  try {
    if (!dataLearning) return null;

    return (
      <select
        value={currentIndex}
        onChange={(e) => {
          navigate(`/learninghub/${id}?ls=` + e.target.value);
          // setCurrentIndex(parseInt(e.target.value));
        }}
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
function handle_div(id) {
  if (!id) {
    id = "div_01_content_table_to_practice";
  }
  const divs = document.querySelectorAll(".divlearnHub");
  // Chuyển tất cả các div này thành flex: 0
  divs.forEach((div) => {
    div.style.flex = "0";
    div.style.opacity = "0";
    div.style.width = "0px";
    div.style.padding = "0px";
    div.style.pointerEvents = "none";
  });

  // Tìm div có id bằng giá trị của e.target.value
  const targetDiv = document.getElementById(id);
  if (targetDiv) {
    // Chuyển flex của div này thành 8
    targetDiv.style.opacity = "1";
    targetDiv.style.flex = "8";
    targetDiv.style.width = "80wh";
    targetDiv.style.padding = "24px";
    targetDiv.style.pointerEvents = "auto";
  } else {
    console.warn("No div found with the id:", id);
  }
}

function kiemtramic() {
  try {
    // Kiểm tra trạng thái quyền truy cập micro
    navigator.permissions
      .query({ name: "microphone" })
      .then(function (permissionStatus) {
        if (permissionStatus.state === "denied") {
          // Nếu quyền bị từ chối trước đó, yêu cầu lại quyền
          document.getElementById("kiemtramicro").innerText =
            "Quyền truy cập micro đã bị từ chối trước đó. Vui lòng cấp quyền lại!";

          // Yêu cầu lại quyền truy cập micro
          navigator.mediaDevices
            .getUserMedia({ audio: true })
            .then(function (stream) {
              document.getElementById("kiemtramicro").innerText =
                "Trang web có quyền sử dụng micro!";
              // Dừng stream sau khi thông báo
              stream.getTracks().forEach((track) => track.stop());
            })
            .catch(function (error) {
              document.getElementById("kiemtramicro").innerText =
                "Trang web không có quyền sử dụng micro hoặc bạn chưa cấp quyền.";
            });
        } else if (permissionStatus.state === "granted") {
          // Nếu đã cấp quyền truy cập micro
          document.getElementById("kiemtramicro").innerText =
            "Trang web có quyền sử dụng micro!";
        } else {
          // Nếu trạng thái không rõ, yêu cầu quyền lần đầu
          navigator.mediaDevices
            .getUserMedia({ audio: true })
            .then(function (stream) {
              document.getElementById("kiemtramicro").innerText =
                "Trang web có quyền sử dụng micro!";
              stream.getTracks().forEach((track) => track.stop());
            })
            .catch(function (error) {
              document.getElementById("kiemtramicro").innerText =
                "Trang web không có quyền sử dụng micro hoặc bạn chưa cấp quyền.";
            });
        }
      });
  } catch (error) {
    console.error("Lỗi khi kiểm tra micro:", error);
  }
}
