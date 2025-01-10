// import { Link } from "react-router-dom";
import $ from "jquery";
import { useState, useEffect } from "react";
import T0_linkApi from "../ulti/T0_linkApi";
// import PickRandom from "../../util/commonFunction/fnRelateToArr/PickRandom";
// console.log(T0_linkApi);

let objLink = {
  replaceCode: `AAAAA`,
  basic: `<a id="btnMove" href="AAAAA"></a>`,
  otherTab: `<a id="btnMove" target="_blank" href="AAAAA"></a>`,
  origin: `https://www.phamvandien.com/lv1/`,
  LinkQL: `https://www.phamvandien.com/monitor`,
  T: `https://www.phamvandien.com/all/`,
  NHA: `https://www.phamvandien.com/part-2-c/`,
  NHB: `https://www.phamvandien.com/part-2-d/`,
  NHC: `https://www.phamvandien.com/nhplus-3/`,
};
if (T0_linkApi === "http://localhost:5000/") {
  Object.keys(objLink).forEach((key) => {
    objLink[key] = objLink[key]
      .split("https://www.phamvandien.com/")
      .join("http://localhost:3000/");
  });
}

export default function Move() {
  const [inputValue, setInputValue] = useState("");
  const handleNameChange = (event) => {
    setInputValue(event.target.value);
  };
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      let n = true;
      let getCode = e.currentTarget.value.toUpperCase();

      let getTime = Date.now();
      if (getCode.slice(0, 3) === "294") {
        n = false;
        $(".bai-an").show();
      }
      if (getCode.slice(0, 2) === "QL") {
        n = false;
        let link = objLink.otherTab
          .split(objLink.replaceCode)
          .join(objLink.LinkQL);
        $("#divMove").html(link);
        $("#btnMove")[0].click();
        $("#divMove").html(null);
      }

      if (getCode.slice(0, 4) === "NH01") {
        n = false;
        let link = objLink.basic.split(objLink.replaceCode).join(objLink.NHA);
        $("#divMove").html(link);
        $("#btnMove")[0].click();
        $("#divMove").html(null);
        return;
      }
      if (getCode.slice(0, 4) === "NH02") {
        n = false;
        let link = objLink.basic.split(objLink.replaceCode).join(objLink.NHB);
        $("#divMove").html(link);
        $("#btnMove")[0].click();
        $("#divMove").html(null);
        return;
      }
      if (getCode.slice(0, 4) === "NH03") {
        n = false;
        let link = objLink.basic.split(objLink.replaceCode).join(objLink.NHC);
        $("#divMove").html(link);
        $("#btnMove")[0].click();
        $("#divMove").html(null);
        return;
      }
      if (getCode.slice(0, 4) === "LINK") {
        n = false;
        let link = objLink.basic.split(objLink.replaceCode).join("/link");
        $("#divMove").html(link);
        $("#btnMove")[0].click();
        $("#divMove").html(null);
        return;
      }
      if (getCode.slice(0, 6) === "BIPA01") {
        n = false;
        let link = objLink.basic.split(objLink.replaceCode).join("/pro-a1");
        $("#divMove").html(link);
        $("#btnMove")[0].click();
        $("#divMove").html(null);
        return;
      }
      if (getCode.slice(0, 1) === "I") {
        n = false;
        let iValue = objLink.origin + getCode + "?t=" + getTime;
        let link = objLink.basic.split(objLink.replaceCode).join(iValue);
        $("#divMove").html(link);
        $("#btnMove")[0].click();
        $("#divMove").html(null);
      }

      if (getCode.slice(0, 1) === "T") {
        n = false;
        let iValue = objLink.T + getCode + "?t=" + getTime;
        let link = objLink.basic.split(objLink.replaceCode).join(iValue);
        $("#divMove").html(link);
        $("#btnMove")[0].click();
        $("#divMove").html(null);
      }

      if (getCode.slice(0, 1) === "V") {
        n = false;
        let id = getCode.slice(1, getCode.length);
        let requestOptions = {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: id }),
        };

        fetch(T0_linkApi + "loadSrcVideoYoutube", requestOptions)
          .then((res) => res.json())
          .then((json) => {
            if (
              json.data !== "" &&
              json.data !== undefined &&
              json.data !== null
            ) {
              let iValue = json.data + "?t=" + getTime;
              let link = objLink.otherTab
                .split(objLink.replaceCode)
                .join(iValue);
              $("#divMove").html(link);
              $("#btnMove")[0].click();
              $("#divMove").html(null);
            } else {
              alert("Không tồn tại mã này!");
            }
          });
      }
      if (n) {
        alert("Nhập sai mã!");
      }
      setInputValue("");
    }
  };
  return (
    <>
      <input
        className="form-control"
        type={"text"}
        style={{
          border: "1px solid blue",
          textTransform: "uppercase",
        }}
        onChange={handleNameChange}
        onKeyDown={handleKeyDown}
        value={inputValue}
        placeholder="Hãy nhập mã bài học vào đây và nhấn enter"
      />
      <div id="divMove" style={{ display: "none" }}></div>
    </>
  );
}
// useEffect(() => {
//   let qString = queryString.parse(window.location.search)

// }, [])
