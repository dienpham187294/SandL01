// export default
let LinkAPI =
  "https://seo-onlineplay-new2024-server-428bb40ca879.herokuapp.com/";
try {
  const JA = require("./JA.json");
  console.log("LocalHost");
  LinkAPI = "http://localhost:5000/";
} catch (error) {
  console.log("not local");
}
export default LinkAPI;
