import { socket } from "../App";
function sendMessageToServer(message, note, chanel) {
  if (message.trim()) {
    const timestamp = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    const sender =
      localStorage.getItem("nameDinhDanh") || localStorage.getItem("dinhDanh");

    socket.emit("message", {
      text: message,
      time: `${timestamp} ${sender}`,
      group: chanel ? chanel : localStorage.getItem("groupChat") || "all",
    });
  }
}
export default sendMessageToServer;
