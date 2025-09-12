import React, { useState } from "react";
import LinkAPI from "../../ulti/T0_linkApi";

function TTSStartButton() {
  const controller = new AbortController(); // Create AbortController

  const handleStart = async () => {
    try {
      const response = await fetch(LinkAPI + "ttslist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sttStart: true }),
        signal: controller.signal, // use controller
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      console.log("Response:", data);
    } catch (error) {
      if (error.name === "AbortError") {
        console.log("Request aborted");
      } else {
        console.error("Error:", error);
      }
    }
  };

  return (
    <div style={{ margin: "10%", padding: "50px" }}>
      <button onClick={() => handleStart()}>START TO TTSLIST</button>
    </div>
  );
}

export default TTSStartButton;
