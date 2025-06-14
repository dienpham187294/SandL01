import React, { useEffect, useState, useContext } from "react";

import { ObjREADContext } from "../App"; // Import ObjREADContext

const Settings = () => {
  const ObjREAD = useContext(ObjREADContext);

  return (
    <div>
      {" "}
      <div style={{ height: "100px" }}></div> {JSON.stringify(ObjREAD)}
    </div>
  );
};

export default Settings;
