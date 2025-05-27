import React, { useState, useEffect } from "react";

export default function EnglishCourseLanding() {
  const [isVisible, setIsVisible] = useState({});

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible((prev) => ({ ...prev, [entry.target.id]: true }));
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll("[id]").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <style>{`
        :root {
          --primary-blue: #1e40af;
          --secondary-blue: #3b82f6;
          --light-blue: #60a5fa;
          --dark-blue: #1e3a8a;
          --purple: #7c3aed;
          --gradient-bg: linear-gradient(135deg, #1e3a8a 0%, #1e40af 50%, #7c3aed 100%);
        }

        .hero-section {
          min-height: 100vh;
          background: var(--gradient-bg);
          position: relative;
          overflow: hidden;
          display: flex;
          align-items: center;
          color: white;
        }

        .hero-section::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: radial-gradient(circle at 20% 20%, rgba(59, 130, 246, 0.3) 0%, transparent 50%),
                      radial-gradient(circle at 80% 80%, rgba(124, 58, 237, 0.3) 0%, transparent 50%);
          pointer-events: none;
        }

        .glass-card {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 20px;
          transition: all 0.3s ease;
        }

        .glass-card:hover {
          background: rgba(255, 255, 255, 0.15);
          transform: translateY(-5px);
        }

        .gradient-text {
          background: linear-gradient(135deg, #ffffff 0%, #60a5fa 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .btn-primary-custom {
          background: linear-gradient(135deg, var(--secondary-blue) 0%, var(--primary-blue) 100%);
          border: none;
          border-radius: 50px;
          padding: 12px 30px;
          font-weight: 600;
          transition: all 0.3s ease;
          color: white;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }

        .btn-primary-custom:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(30, 64, 175, 0.4);
          color: white;
        }

        .btn-success-custom {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          border: none;
          border-radius: 20px;
          padding: 15px 0;
          font-weight: 600;
          transition: all 0.3s ease;
          color: white;
          width: 100%;
        }

        .btn-success-custom:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(16, 185, 129, 0.4);
          color: white;
        }

        .feature-icon {
          width: 64px;
          height: 64px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 20px;
          transition: transform 0.3s ease;
        }

        .feature-icon:hover {
          transform: rotate(6deg);
        }

        .pricing-card {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 24px;
          padding: 40px 30px;
          transition: all 0.3s ease;
          position: relative;
          color: white;
        }

        .pricing-card:hover {
          transform: translateY(-10px);
          background: rgba(255, 255, 255, 0.15);
        }

        .pricing-card.featured {
          border: 2px solid var(--light-blue);
        }

        .pricing-badge {
          position: absolute;
          top: -12px;
          left: 50%;
          transform: translateX(-50%);
          background: linear-gradient(135deg, var(--secondary-blue) 0%, var(--purple) 100%);
          color: white;
          padding: 8px 20px;
          border-radius: 20px;
          font-size: 14px;
          font-weight: 600;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
          gap: 20px;
          margin-top: 40px;
        }

        .stat-item {
          text-align: center;
        }

        .stat-number {
          font-size: 28px;
          font-weight: bold;
          color: var(--light-blue);
          display: block;
        }

        .stat-label {
          font-size: 14px;
          color: rgba(255, 255, 255, 0.8);
          margin-top: 5px;
        }

        .section-padding {
          padding: 80px 0;
        }

        .text-blue-light {
          color: rgba(255, 255, 255, 0.9);
        }

        .bg-blue-section {
          background: rgba(30, 64, 175, 0.3);
          backdrop-filter: blur(10px);
        }

        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }

        .feature-list {
          list-style: none;
          padding: 0;
        }

        .feature-list li {
          display: flex;
          align-items: center;
          margin-bottom: 12px;
          color: rgba(255, 255, 255, 0.9);
        }

        .check-icon {
          color: #10b981;
          margin-right: 12px;
          font-weight: bold;
        }

        @media (max-width: 768px) {
          .hero-section h1 {
            font-size: 2.5rem !important;
          }
          
          .pricing-card {
            margin-bottom: 30px;
          }
        }
      `}</style>
      <div style={{ height: "70px" }}></div>
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="row justify-content-center text-center">
            <div className="col-lg-10">
              <div className="mb-4">
                <span className="badge glass-card px-4 py-2 mb-4">
                  <i className="bi bi-star-fill text-warning me-2"></i>
                  Phương pháp học độc đáo
                </span>
              </div>

              <h1 className="display-2 fw-bold mb-4 gradient-text">
                Bạn có muốn sau này thực sự
                <span className="d-block text-info">
                  sử dụng nghe nói tiếng Anh
                </span>
                được trong thực tế?
              </h1>

              <p className="lead fs-4 text-blue-light mb-4">
                90% người học chỉ biết lý thuyết, không nói được vì thiếu luyện
                nói thực tế.
                <span className="d-block mt-2">
                  Phương pháp 3 bước ghép âm siêu dễ | 3000 từ & 1000 câu thông
                  dụng.
                </span>
                <span className="d-block mt-2">
                  Luyện nghe nói 5.000 – 20.000+ câu tiếng Anh thành tiếng –
                  chìa khóa để giỏi thật!
                </span>
              </p>

              <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center align-items-center mb-5">
                <a href="#pricing" className="btn btn-primary-custom btn-lg">
                  <i className="bi bi-play-circle me-2"></i>
                  Học ngay 4 buổi miễn phí
                </a>
                <div className="d-flex align-items-center text-blue-light">
                  <i className="bi bi-people me-2"></i>
                  <span>Hơn 1,000 học viên tin tưởng</span>
                </div>
              </div>

              <div className="stats-grid">
                <div className="stat-item">
                  <span className="stat-number">3000+</span>
                  <div className="stat-label">Từ vựng cơ bản</div>
                </div>
                <div className="stat-item">
                  <span className="stat-number">1000+</span>
                  <div className="stat-label">Câu giao tiếp</div>
                </div>
                <div className="stat-item">
                  <span className="stat-number">5000+</span>
                  <div className="stat-label">Lần thực nói</div>
                </div>
                <div className="stat-item">
                  <span className="stat-number">AI</span>
                  <div className="stat-label">Công nghệ hỗ trợ</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Value Proposition */}
      <section className="section-padding bg-blue-section text-white">
        <div className="container">
          <div className="row">
            <div className="col-lg-8 mx-auto text-center mb-5">
              <h2 className="display-4 fw-bold mb-4">
                Tại sao bạn cần học với chúng tôi?
              </h2>
              <p className="fs-5 text-blue-light">
                Vì học giao tiếp chỉ bằng đọc – viết là chưa đủ. Bạn cần thực sự
                luyện nói, được nghe - được sửa. Bạn đã tìm được chỗ nào giúp
                bạn thật sự nói đầy đủ các câu tiếng Anh thành tiếng được trên
                5.000 lần chưa?
              </p>
            </div>
          </div>

          <div className="row g-4">
            <div className="col-lg-4">
              <div className="glass-card p-4 h-100">
                <div className="feature-icon bg-primary">
                  <i className="bi bi-mic text-white fs-2"></i>
                </div>
                <h3 className="h4 fw-bold mb-3">Phát âm AI</h3>
                <p className="text-blue-light">
                  Học phát âm dễ dàng nhờ công nghệ AI và phương pháp ghép âm 3
                  bước độc đáo
                </p>
              </div>
            </div>

            <div className="col-lg-4">
              <div className="glass-card p-4 h-100">
                <div
                  className="feature-icon"
                  style={{
                    background:
                      "linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)",
                  }}
                >
                  <i className="bi bi-headphones text-white fs-2"></i>
                </div>
                <h3 className="h4 fw-bold mb-3">Luyện Nghe Nói</h3>
                <p className="text-blue-light">
                  Luyện nghe nói hàng ngàn lần như thực tế với giáo trình thiết
                  kế trực quan
                </p>
              </div>
            </div>

            <div className="col-lg-4">
              <div className="glass-card p-4 h-100">
                <div className="feature-icon bg-success">
                  <i className="bi bi-book text-white fs-2"></i>
                </div>
                <h3 className="h4 fw-bold mb-3">Từ Vựng & Giao Tiếp</h3>
                <p className="text-blue-light">
                  Luyện tập 3000 từ vựng cơ bản đi kèm 1000 mẫu câu giao tiếp
                  hiệu quả
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section
        className="section-padding"
        style={{ background: "var(--gradient-bg)" }}
      >
        <div className="container text-white">
          <div className="row">
            <div className="col-lg-6 mx-auto text-center mb-5">
              <h2 className="display-4 fw-bold mb-4">Lợi ích vượt trội</h2>
            </div>
          </div>

          <div className="row align-items-center">
            <div className="col-lg-6">
              <div className="mb-4">
                <div className="d-flex align-items-start">
                  <div
                    className="feature-icon bg-primary me-3"
                    style={{ width: "50px", height: "50px", minWidth: "50px" }}
                  >
                    <i className="bi bi-volume-up text-white"></i>
                  </div>
                  <div>
                    <h4 className="fw-bold mb-2">Tự tin sử dụng tiếng Anh</h4>
                    <p className="text-blue-light">
                      Nhận diện và chấm điểm phát âm dễ dàng nhờ phương pháp đọc
                      ghép âm 3 bước
                    </p>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <div className="d-flex align-items-start">
                  <div
                    className="feature-icon me-3"
                    style={{
                      width: "50px",
                      height: "50px",
                      minWidth: "50px",
                      background:
                        "linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)",
                    }}
                  >
                    <i className="bi bi-headphones text-white"></i>
                  </div>
                  <div>
                    <h4 className="fw-bold mb-2">
                      Nghe hiểu nhanh, phản xạ tốt
                    </h4>
                    <p className="text-blue-light">
                      Luyện phản xạ với giáo trình thiết kế trực quan, rèn luyện
                      nói thành câu trên 5000 lần
                    </p>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <div className="d-flex align-items-start">
                  <div
                    className="feature-icon bg-success me-3"
                    style={{ width: "50px", height: "50px", minWidth: "50px" }}
                  >
                    <i className="bi bi-award text-white"></i>
                  </div>
                  <div>
                    <h4 className="fw-bold mb-2">
                      Nền tảng vững chắc để thi lấy bằng
                    </h4>
                    <p className="text-blue-light">
                      Sau khi có nền tảng vững chắc, thi bằng chỉ cần học thêm
                      mẹo ngữ pháp
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-6">
              <div className="glass-card p-5 text-center">
                <div className="mb-4">
                  <div
                    className="feature-icon mx-auto"
                    style={{
                      background:
                        "linear-gradient(135deg, #3b82f6 0%, #7c3aed 100%)",
                    }}
                  >
                    <i className="bi bi-robot text-white fs-1"></i>
                  </div>
                </div>
                <h3 className="h4 fw-bold mb-3">Công nghệ AI tiên tiến</h3>
                <p className="text-blue-light">
                  Hệ thống AI giúp nhận diện phát âm chính xác, đưa ra phản hồi
                  chi tiết và cải thiện kỹ năng nói của bạn
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section
        id="pricing"
        className="section-padding bg-blue-section text-white"
      >
        <div className="container">
          <div className="row">
            <div className="col-lg-8 mx-auto text-center mb-5">
              <h2 className="display-4 fw-bold mb-4">Chọn lộ trình phù hợp</h2>
              <p className="fs-5 text-blue-light">
                Cam kết hoàn tiền nếu không hài lòng sau 7 ngày
              </p>
            </div>
          </div>

          <div className="row g-4">
            {/* Free Course */}
            <div className="col-lg-4">
              <div className="pricing-card h-100">
                <div className="text-center mb-4">
                  <div className="feature-icon mx-auto bg-success">
                    <i className="bi bi-star text-white fs-2"></i>
                  </div>
                  <h3 className="h4 fw-bold mb-2">Học thử miễn phí</h3>
                  <div className="display-4 fw-bold text-success mb-2">
                    MIỄN PHÍ
                  </div>
                  <p className="text-blue-light">4 buổi học thử</p>
                </div>

                <ul className="feature-list mb-4">
                  <li>
                    <span className="check-icon">✓</span> Trải nghiệm phương
                    pháp 3 bước
                  </li>
                  <li>
                    <span className="check-icon">✓</span> Học thử với AI
                  </li>
                  <li>
                    <span className="check-icon">✓</span> Không ràng buộc
                  </li>
                </ul>

                <button className="btn btn-success-custom">
                  Đăng ký học ngay
                </button>
              </div>
            </div>

            {/* Intermediate Course */}
            <div className="col-lg-4">
              <div className="pricing-card featured h-100">
                <div className="pricing-badge">Giảm 20%</div>

                <div className="text-center mb-4">
                  <div className="feature-icon mx-auto bg-primary">
                    <i className="bi bi-book text-white fs-2"></i>
                  </div>
                  <h3 className="h4 fw-bold mb-2">Khóa Cơ Bản</h3>
                  <div className="mb-2">
                    <span className="fs-5 text-decoration-line-through text-muted">
                      6.000.000đ
                    </span>
                    <div className="display-4 fw-bold text-primary">
                      5.000.000đ
                    </div>
                  </div>
                  <p className="text-blue-light">24 buổi học</p>
                </div>

                <ul className="feature-list mb-4">
                  <li>
                    <span className="check-icon">✓</span> 500 từ vựng cơ bản
                  </li>
                  <li>
                    <span className="check-icon">✓</span> 200 câu giao tiếp cơ
                    bản
                  </li>
                  <li>
                    <span className="check-icon">✓</span> Phương pháp ghép âm 3
                    bước
                  </li>
                  <li>
                    <span className="check-icon">✓</span> Hỗ trợ AI phát âm
                  </li>
                </ul>

                <button className="btn btn-primary-custom w-100 py-3">
                  Đăng ký ngay
                </button>
              </div>
            </div>

            {/* Premium Course */}
            <div className="col-lg-4">
              <div className="pricing-card h-100">
                <div
                  className="pricing-badge"
                  style={{
                    background:
                      "linear-gradient(135deg, #7c3aed 0%, #ec4899 100%)",
                  }}
                >
                  Phổ biến nhất
                </div>

                <div className="text-center mb-4">
                  <div
                    className="feature-icon mx-auto"
                    style={{
                      background:
                        "linear-gradient(135deg, #7c3aed 0%, #ec4899 100%)",
                    }}
                  >
                    <i className="bi bi-trophy text-white fs-2"></i>
                  </div>
                  <h3 className="h4 fw-bold mb-2">Khóa Toàn Diện</h3>
                  <div
                    className="display-4 fw-bold mb-2"
                    style={{ color: "#a855f7" }}
                  >
                    15.000.000đ
                  </div>
                  <p className="text-blue-light">50 buổi học</p>
                </div>

                <ul className="feature-list mb-4">
                  <li>
                    <span className="check-icon">✓</span> 3000 từ vựng cơ bản
                  </li>
                  <li>
                    <span className="check-icon">✓</span> 1000 câu giao tiếp
                  </li>
                  <li>
                    <span className="check-icon">✓</span> Ngữ pháp đi thi
                  </li>
                  <li>
                    <span className="check-icon">✓</span> Luyện nói 5000+ lần
                  </li>
                  <li>
                    <span className="check-icon">✓</span> Chứng chỉ hoàn thành
                  </li>
                </ul>

                <button
                  className="btn w-100 py-3"
                  style={{
                    background:
                      "linear-gradient(135deg, #7c3aed 0%, #ec4899 100%)",
                    border: "none",
                    color: "white",
                    borderRadius: "20px",
                    fontWeight: "600",
                  }}
                >
                  Đăng ký ngay
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section
        className="section-padding"
        style={{
          background: "linear-gradient(135deg, #3b82f6 0%, #7c3aed 100%)",
        }}
      >
        <div className="container text-center text-white">
          <div className="row">
            <div className="col-lg-8 mx-auto">
              <h2 className="display-4 fw-bold mb-4">
                Bắt đầu hành trình học tiếng Anh của bạn ngay hôm nay
              </h2>
              <p className="fs-5 mb-4">
                Cơ hội học phương pháp ghép âm độc đáo dễ dàng với 3 bước. Tham
                gia học thử miễn phí 4 buổi – Không ràng buộc
              </p>

              <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center align-items-center mb-4">
                <button
                  className="btn btn-light btn-lg px-5 py-3 fw-bold"
                  style={{ borderRadius: "50px", color: "var(--primary-blue)" }}
                >
                  <i className="bi bi-play-circle me-2"></i>
                  Tham gia học thử miễn phí
                </button>

                <div className="d-flex align-items-center text-light">
                  <i className="bi bi-clock me-2"></i>
                  <span>Chỉ cần 30 giây để đăng ký</span>
                </div>
              </div>

              <div className="d-flex align-items-center justify-content-center text-light">
                <i className="bi bi-shield-check text-success me-2"></i>
                <span>Cam kết hoàn tiền nếu không hài lòng sau 7 ngày</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-5 bg-dark text-light">
        <div className="container text-center">
          <p className="mb-1">
            &copy; 2024 PVD English Learning Platform. Tất cả quyền được bảo
            lưu.
          </p>
          <p className="mb-0">Liên hệ: pvkadien0209@gmail.com | 0918 284 482</p>
        </div>
      </footer>
    </>
  );
}
