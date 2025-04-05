import { useEffect, useState } from "react";

export default function LocalName() {
  const [name, setName] = useState("");
  const [input, setInput] = useState("");

  // Load name from localStorage on first render
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

    localStorage.setItem("nameDinhDanh", input);
    setName(input);
    setInput("");
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
    </div>
  );
}
