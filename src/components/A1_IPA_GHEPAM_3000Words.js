import { useEffect, useState } from "react";
import DataInput from "./A1_IPA_GHEPAM_3000WordsJSON.json";
export default function GHEPAM3000WORDS() {
  return (
    <div style={{}}>
      <div style={{ height: "12vh" }}></div>
      <div className="container">
        <table className="table">
          <tbody>
            {DataInput.map((e, i) => (
              <tr key={i}>
                <td>{e.id}</td>
                <td>{e.ZZ01}</td>
                <td>{e.ZZ12}</td>
                <td>{e.ZZ03}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
