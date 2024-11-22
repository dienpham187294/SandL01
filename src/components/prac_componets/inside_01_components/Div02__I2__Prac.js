import { json, Link } from "react-router-dom";
import Test from "../A1_PracMain";
import { useEffect, useState } from "react";

function PracNoidung({ queryObject }) {
  const [DataPrac, setDataPrac] = useState(null);

  useEffect(() => {
    if (queryObject.page === "prac" && queryObject.id) {
      // Dynamically import JSON file
      import(`../dataContent/file-thuchanh/${queryObject.id}.json`)
        .then((module) => {
          const data = module.default || module; // Handling module.default if necessary

          if (queryObject.sub === undefined) {
            // If no specific sub-content is requested, set the entire data
            setDataPrac(data);
          } else {
            // If sub-content is specified, filter the data
            const filteredData = data.filter(
              (e) => `${e.idFile}-${e.idContent}` === queryObject.sub
            );
            setDataPrac(filteredData);
          }
        })
        .catch((error) => {
          console.error("Error loading data:", error);
        });
    }
  }, [queryObject]);

  return (
    <div style={styles.parentContainer}>
      {
        // JSON.stringify(DataPrac)
        <Test DataPrac={DataPrac} />
      }
    </div>
  );
}

const styles = {
  parentContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    // padding: "3px",
    backgroundColor: "#f7f7f7", // Subtle background for contrast
  },
};

export default PracNoidung;
