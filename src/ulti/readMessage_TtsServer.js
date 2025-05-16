import LinkAPI from "./T0_linkApi";

export default function read_by_Tts(text) {
  try {
    fetch(LinkAPI + "tts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    })
      .then((res) => res.blob())
      .then((blob) => {
        const audioUrl = URL.createObjectURL(blob);

        // Tạo id giả ngẫu nhiên
        const fakeId = "audio-" + Math.random().toString(36).substring(2, 10);

        // Tạo thẻ audio mới
        const audioElement = document.createElement("audio");
        audioElement.id = fakeId;
        audioElement.src = audioUrl;
        audioElement.autoplay = true;
        audioElement.style.display = "none"; // nếu không muốn hiển thị điều khiển

        // Thêm vào DOM để audio chạy
        document.body.appendChild(audioElement);

        // Khi audio kết thúc, xóa thẻ audio và giải phóng URL
        audioElement.onended = () => {
          URL.revokeObjectURL(audioUrl);
          audioElement.remove();
        };

        // Nếu muốn bắt lỗi phát audio
        audioElement.onerror = () => {
          console.error("Error playing audio");
          URL.revokeObjectURL(audioUrl);
          audioElement.remove();
        };
      });
  } catch (error) {
    console.error(error);
  }
}
