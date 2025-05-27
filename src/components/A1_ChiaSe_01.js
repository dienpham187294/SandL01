// const screenWidth = window.screen.width;

function HomeView() {
  // State để lưu id của div được chọn

  // if (screenWidth < 1000) {
  //   return (
  //     <div>
  //       <h1>Mobile Screen</h1>
  //     </div>
  //   );
  // }

  return (
    <div style={{ marginTop: "10vh", padding: "5%", textAlign: "center" }}>
      <div>
        <h1>Khóa thực hành tiếng anh</h1>
        <div
          style={{
            borderRadius: "20px",
            padding: "20px",
            backgroundColor: "blue",
            color: "white",
            fontSize: "larger",
            fontWeight: "900",
          }}
        >
          <h1> 10.000 LƯỢT NGHE NÓI</h1>
        </div>
        <div
          style={{
            fontFamily: "Arial, sans-serif",
            lineHeight: "2",
            fontSize: "larger",
            padding: "30px",
            maxWidth: "800px",
            margin: "0 auto",
            backgroundColor: "#f9f9f9",
            borderRadius: "8px",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          }}
        >
          <h2
            style={{ color: "#333", textAlign: "center", marginBottom: "20px" }}
          >
            Sức mạnh của thực hành
          </h2>
          <p style={{ color: "#555", marginBottom: "15px" }}>
            Ông bà ta thường nói: <strong>“Quen tay hay việc”</strong> hay{" "}
            <strong>“Trăm hay không bằng quen tay”</strong>. Câu nói này nhấn
            mạnh rằng, dù lý thuyết có giỏi đến đâu, cũng không thể sánh bằng sự
            thành thạo nhờ thực hành liên tục.
          </p>
          <p style={{ color: "#555", marginBottom: "15px" }}>
            Việc học nghe và nói tiếng Anh cũng không ngoại lệ. Dù học lý thuyết
            nhiều đến đâu, nếu không thực sự thực hành nghe và nói, kết quả đạt
            được sẽ khó lòng như mong đợi.
          </p>
          <p style={{ color: "#555", marginBottom: "15px" }}>
            Với chúng tôi, con số <strong>10.000 lượt</strong> luyện tập là một
            cột mốc quan trọng. Nó đánh dấu sự chuyển mình từ cảm giác tự ti,
            không thể giao tiếp tiếng Anh, sang sự tự tin, sẵn sàng trao đổi một
            cách tự nhiên bằng ngôn ngữ này.
          </p>
          {/* <div style={{ textAlign: "center", marginTop: "20px" }}>
            <button
              style={{
                padding: "10px 20px",
                fontSize: "16px",
                backgroundColor: "blue",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Bắt đầu luyện tập ngay
            </button>
          </div> */}
        </div>
      </div>
      <h1 style={{ marginTop: "5%" }}>Chúng tôi sẽ giúp bạn !</h1>
      <div
        style={{
          borderRadius: "20px",
          padding: "20px",
          backgroundColor: "blue",
          color: "white",
          fontSize: "larger",
          fontWeight: "900",
        }}
      >
        <h1>Đạt được 10.000 lượt nghe nói</h1>
      </div>
      <div
        style={{
          fontFamily: "Arial, sans-serif",
          textAlign: "left",
          lineHeight: "1.8",
          fontSize: "larger",
          padding: "30px",
          maxWidth: "800px",
          margin: "0 auto",
          backgroundColor: "#f9f9f9",
          borderRadius: "8px",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        }}
      >
        <h2
          style={{ color: "#333", textAlign: "center", marginBottom: "20px" }}
        >
          4 Bước Để Hình Thành Kỹ Năng Nghe Nói!
        </h2>

        <div style={{ marginBottom: "20px" }}>
          <h3 style={{ color: "blue", marginBottom: "10px" }}>
            Bước 1: Chia nhỏ kỹ năng
          </h3>
          <p style={{ color: "#555" }}>
            Tập trung vào kỹ năng cơ bản và cốt lõi nhất.
            <strong>
              {" "}
              Thay vì "học nghe nói", hãy tập trung vào "Ghép âm và tách âm".
            </strong>
          </p>
          <p style={{ fontStyle: "italic", color: "#777" }}>
            Trong quá trình học tiếng Anh, nhiều người thường băn khoăn vì sao
            họ có thể hiểu từ vựng và ngữ pháp nhưng vẫn không thể nghe hiểu hay
            nói chuyện tự nhiên. Bí quyết nằm ở kỹ năng cơ bản nhất nhưng cũng
            quan trọng nhất: ghép âm và tách âm.
          </p>
        </div>

        <div style={{ marginBottom: "20px" }}>
          <h3 style={{ color: "blue", marginBottom: "10px" }}>
            Bước 2: Học đủ để thực hành
          </h3>
          <p style={{ color: "#555" }}>
            Học nhanh các nguyên tắc và phương pháp nền tảng.
            <strong> Không dành quá nhiều thời gian cho lý thuyết,</strong> tập
            trung vào những gì cần thiết để bắt đầu thực hành ngay.
          </p>
        </div>

        <div style={{ marginBottom: "20px" }}>
          <h3 style={{ color: "blue", marginBottom: "10px" }}>
            Bước 3: Loại bỏ các rào cản
          </h3>
          <p style={{ color: "#555" }}>
            Có hai loại rào cản chính cần vượt qua:
          </p>
          <ul style={{ paddingLeft: "20px", color: "#555" }}>
            <li>
              <strong>Rào cản khách quan:</strong> Không có môi trường luyện tập
              phù hợp hoặc môi trường hiện tại gặp nhiều vấn đề không thuận lợi.
            </li>
            <li>
              <strong>Rào cản chủ quan:</strong> Thiếu tập trung, lười biếng,
              cảm giác chán nản, sợ hãi thất bại hoặc không thể kiên trì.
            </li>
          </ul>
          <p style={{ color: "#555" }}>
            Hiểu được những thách thức này, chúng tôi đã phát triển và áp dụng
            các phương pháp hỗ trợ để giúp bạn dễ dàng vượt qua mọi rào cản.
          </p>
        </div>

        <div>
          <h3 style={{ color: "blue", marginBottom: "10px" }}>
            Bước 4: Luyện tập lặp lại
          </h3>
          <p style={{ color: "#555" }}>Luyện tập hiệu quả theo chu trình:</p>
          <p style={{ textAlign: "center", fontWeight: "bold", color: "#555" }}>
            Luyện tập → Ghi nhận phản hồi → Sửa chữa, tinh chỉnh → Luyện tập
            tiếp tục.
          </p>
          <p style={{ color: "#555" }}>
            Lặp lại chu trình này một cách đều đặn và có định hướng cho đến khi
            đạt được mục tiêu
            <strong> 10.000 lượt thực hành.</strong> Đây chính là chìa khóa để
            xây dựng sự thành thạo và tự tin với kỹ năng bạn đang rèn luyện.
          </p>
        </div>
      </div>

      <h1 style={{ marginTop: "5%" }}>Nếu bạn là người bình thường?</h1>
      <div
        style={{
          borderRadius: "20px",
          padding: "20px",
          backgroundColor: "blue",
          color: "white",
          fontSize: "larger",
          fontWeight: "900",
        }}
      >
        <h1>Khóa thực hành "bình dân", "không năng khiếu".</h1>
      </div>

      {/* <p>Xác định nhóm khách hàng mục tiêu mà sản phẩm nhắm đến.</p> */}
      {/* <h1>Sản phẩm này mang lại lợi ích gì?</h1>
      <p>Lợi ích cụ thể mà khách hàng có thể nhận được khi sử dụng sản phẩm.</p> */}
      {/* <h1>Sản phẩm này khác biệt như thế nào so với đối thủ?</h1>
      <p>
        Những ưu điểm, đặc điểm nổi bật mà sản phẩm có thể cung cấp tốt hơn các
        sản phẩm khác trên thị trường.
      </p> */}
      {/* <h1>Giá của sản phẩm là bao nhiêu?</h1> */}
      <div
        style={{
          fontFamily: "Arial, sans-serif",
          lineHeight: "1.8",
          textAlign: "left",
          fontSize: "larger",
          padding: "30px",
          maxWidth: "800px",
          margin: "0 auto",
          backgroundColor: "#f9f9f9",
          borderRadius: "8px",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        }}
      >
        <h2
          style={{ color: "#333", textAlign: "center", marginBottom: "20px" }}
        >
          Đơn Giản - Thực Dụng - Hiệu Quả
        </h2>

        <div style={{ marginBottom: "20px" }}>
          <h3 style={{ color: "blue", marginBottom: "10px" }}>
            {" "}
            1. "Bình dân"
          </h3>
          <p style={{ color: "#555" }}>
            Khóa học tập trung vào các nguyên tắc “đơn giản”, “dễ sử dụng” và
            “bình dân” thay vì các yếu tố “hoa mỹ” hay “học thuật”.
            <strong>
              {" "}
              Mục tiêu chính là giúp bạn thực hành nhiều và tiến bộ nhanh.
            </strong>{" "}
            Chúng tôi ưu tiên tính thực tế, giúp người học nắm bắt kỹ năng nghe
            nói hiệu quả mà không bị áp lực bởi sự phức tạp của ngôn ngữ học
            thuật.
          </p>
        </div>

        <div style={{ marginBottom: "20px" }}>
          <h3 style={{ color: "blue", marginBottom: "10px" }}>
            2."Không năng khiếu"
          </h3>
          <p style={{ color: "#555" }}>
            Phương pháp học tập trung vào các kỹ năng cơ bản nhất, đơn giản và
            có thể lặp đi lặp lại. Không yêu cầu{" "}
            <strong> "có khiếu học tiếng anh",</strong> chỉ cần bạn làm đúng và
            đủ, kết quả sẽ tự động đến.
          </p>
        </div>
      </div>

      {/* <h1>Sản phẩm này có bảo hành không?</h1>
      <p>Chính sách bảo hành, dịch vụ hậu mãi liên quan.</p> */}

      <h1 style={{ marginTop: "5%" }}>
        Làm thế nào để tham gia khóa thực hành?
      </h1>
      <div
        style={{
          borderRadius: "20px",
          padding: "20px",
          backgroundColor: "blue",
          color: "white",
          fontSize: "larger",
          fontWeight: "900",
        }}
      >
        <h1> Liên hệ qua zalo 0918 284 482 để được tư vấn khóa thực hành.</h1>
      </div>
      <h1></h1>
      <p></p>
      {/* <h1>Sản phẩm có các đánh giá từ người dùng khác không?</h1>
      <p>
        Cung cấp phản hồi, đánh giá thực tế từ những khách hàng đã sử dụng sản
        phẩm.
      </p> */}
      {/* <h1>Làm thế nào để mua sản phẩm này?</h1>
      <p>Thông tin về kênh mua hàng, phương thức thanh toán, giao hàng.</p> */}
    </div>
  );
}

export default HomeView;
