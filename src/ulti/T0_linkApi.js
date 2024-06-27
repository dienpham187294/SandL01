let LinkAPI = "";

try {
  const JA = require("./JA.json");
  console.log("LocalHost");
  LinkAPI = "http://localhost:5000/";
} catch (error) {
  LinkAPI = "https://seo-onlineplay-new2024-server-428bb40ca879.herokuapp.com/";
  console.log("not local");
}
export default LinkAPI;
