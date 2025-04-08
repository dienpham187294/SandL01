import { useEffect, useState } from "react";

export default function LocalName() {
  const [name, setName] = useState("");
  const [input, setInput] = useState("");
  const [status, setStatus] = useState(""); // Thông báo thành công

  useEffect(() => {
    const savedName = localStorage.getItem("nameDinhDanh");
    if (savedName) {
      setName(savedName);
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (input.trim().length === 0) {
      alert("Tên không được để trống.");
      return;
    }

    if (input.length > 10) {
      alert("Tên không được dài hơn 10 ký tự.");
      return;
    }

    const oldName = localStorage.getItem("nameDinhDanh");

    localStorage.setItem("nameDinhDanh", input);
    setName(input);
    setInput("");

    // Cập nhật thông báo
    if (oldName && oldName !== input) {
      setStatus("✅ Đổi tên thành công!");
    } else if (!oldName) {
      setStatus("✅ Nhập tên mới thành công!");
    } else {
      setStatus("✅ Tên không thay đổi.");
    }

    // Tự ẩn thông báo sau 3 giây
    setTimeout(() => {
      setStatus("");
    }, 3000);
  };

  return (
    <div
      style={{
        padding: "1rem",
        maxWidth: "400px",
        marginTop: "200px",
        marginLeft: "35%",
      }}
    >
      <h2>Xin chào {name ? name : "bạn chưa nhập tên"}</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={input}
          placeholder="Nhập tên (tối đa 10 ký tự)"
          maxLength={10}
          onChange={(e) => setInput(e.target.value)}
          style={{ padding: "0.5rem", width: "100%", marginBottom: "0.5rem" }}
        />
        <button type="submit" style={{ padding: "0.5rem", width: "100%" }}>
          Lưu tên
        </button>
      </form>

      {status && (
        <p style={{ marginTop: "1rem", color: "green", fontWeight: "bold" }}>
          {status}
        </p>
      )}
    </div>
  );
}
