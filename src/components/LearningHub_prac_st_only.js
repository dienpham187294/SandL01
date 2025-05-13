import React from "react";
import { useLocation } from "react-router-dom";
import Dictaphone from "../ulti/RegcognitionV2024-05-NG_FOR_TEACHING";

const LearningHub_prac_st_only = () => {
  const locationSet = useLocation();
  const params = new URLSearchParams(locationSet.search);

  const readableSt = params.get("st")?.split("-").join(" ") || "";
  const rawNote = params.get("note");
  const readNote = rawNote ? decodeURIComponent(rawNote) : "";

  return (
    <div style={{ marginTop: "50px", padding: "5%" }}>
      {/* <h2>{readableSt}</h2> */}
      <Dictaphone CMDlist={readableSt} />
      <div style={{ fontSize: "large" }}>
        {readNote && readNote.split("zzz").map((e, i) => <p key={i}>{e}</p>)}
      </div>
    </div>
  );
};

export default LearningHub_prac_st_only;
