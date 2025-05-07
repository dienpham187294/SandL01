let LinkAPI = "";

if (typeof window !== "undefined" && window.location.hostname === "localhost") {
  console.log("LocalHost");
  LinkAPI = "http://localhost:5000/";
} else {
  console.log("Not Local");
  LinkAPI = "https://seo-onlineplay-new2024-server-428bb40ca879.herokuapp.com/";
}

export default LinkAPI;
