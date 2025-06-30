import React, { useState, useEffect } from "react";

// Component slideshow phương pháp - Bố cục cải tiến
const MethodSlideshow = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);

  const methods = [
    {
      icon: "bi-robot",
      title: "Ứng dụng công nghệ trí tuệ nhân tạo",
      description:
        "Sử dụng AI để cá nhân hóa trải nghiệm học tập cho từng học viên",
      color: "success",
      bgGradient: "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)",
    },
    {
      icon: "bi-person-heart",
      title: "Thầy cô tận tình chỉ dạy",
      description:
        "Đội ngũ giáo viên giàu kinh nghiệm, luôn sẵn sàng hỗ trợ học viên",
      color: "success",
      bgGradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    },
    {
      icon: "bi-music-note-beamed",
      title: "Luyện từ nền tảng ghép âm",
      description: "Phương pháp ghép âm độc đáo giúp phát âm chuẩn từ cơ bản",
      color: "success",
      bgGradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    },
    {
      icon: "bi-repeat",
      title: "Luyện tập nghe nói liên tục",
      description:
        "Thực hành nhiều lần để tạo phản xạ tự nhiên trong giao tiếp",
      color: "success",
      bgGradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
    },
    {
      icon: "bi-emoji-smile",
      title: "Không áp lực, không stress",
      description:
        "Học tập thoải mái, không bắt phải suy nghĩ hay áp lực bài tập",
      color: "success",
      bgGradient: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
    },
  ];

  // Auto-play functionality
  useEffect(() => {
    if (isAutoPlay) {
      const interval = setInterval(() => {
        nextMethod();
      }, 4500);
      return () => clearInterval(interval);
    }
  }, [currentIndex, isAutoPlay]);

  const nextMethod = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % methods.length);
      setIsAnimating(false);
    }, 150);
  };

  const prevMethod = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + methods.length) % methods.length);
      setIsAnimating(false);
    }, 150);
  };

  const goToSlide = (index) => {
    if (isAnimating || index === currentIndex) return;
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentIndex(index);
      setIsAnimating(false);
    }, 150);
  };

  return (
    <>
      {/* Bootstrap CSS */}
      <link
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
        rel="stylesheet"
      />
      <link
        href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css"
        rel="stylesheet"
      />

      <style jsx>{`
        .method-slideshow-wrapper {
          padding: 0;
          margin: 0;
        }

        .method-slideshow-container {
          position: relative;
          overflow: hidden;
          border-radius: 24px;
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
          background: white;
          margin: 0 auto;
          max-width: 100%;
        }

        .method-slide-card {
          background: ${methods[currentIndex].bgGradient};
          border-radius: 24px;
          border: none;
          backdrop-filter: blur(15px);
          position: relative;
          overflow: hidden;
          transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
          min-height: 300px;
        }

        .method-slide-card::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(12px);
        }

        .method-card-content {
          position: relative;
          z-index: 2;
          padding: 2.5rem 2rem;
          display: flex;
          align-items: center;
          gap: 2rem;
        }

        .method-icon-section {
          flex-shrink: 0;
        }

        .method-icon-container {
          width: 110px;
          height: 110px;
          background: rgba(255, 255, 255, 0.25);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          backdrop-filter: blur(10px);
          border: 3px solid rgba(255, 255, 255, 0.4);
          transition: all 0.4s ease;
          position: relative;
        }

        .method-icon-container::after {
          content: '';
          position: absolute;
          top: -3px;
          left: -3px;
          right: -3px;
          bottom: -3px;
          border-radius: 50%;
          border: 2px solid rgba(255, 255, 255, 0.2);
          animation: methodPulse 3s infinite;
        }

        .method-icon-container:hover {
          transform: scale(1.05) rotate(5deg);
          background: rgba(255, 255, 255, 0.35);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        }

        .method-slide-icon {
          font-size: 3rem;
          color: white;
          text-shadow: 0 3px 15px rgba(0, 0, 0, 0.3);
        }

        .method-content-section {
          flex: 1;
          text-align: left;
        }

        .method-slide-title {
          color: white;
          font-weight: 700;
          font-size: 1.65rem;
          margin-bottom: 1rem;
          text-shadow: 0 2px 12px rgba(0, 0, 0, 0.3);
          line-height: 1.3;
        }

        .method-slide-description {
          color: rgba(255, 255, 255, 0.95);
          font-size: 1.1rem;
          line-height: 1.7;
          text-shadow: 0 1px 6px rgba(0, 0, 0, 0.2);
          margin: 0;
        }

        .method-controls-section {
          padding: 1.5rem 2rem;
          background: rgba(248, 249, 250, 0.98);
          backdrop-filter: blur(10px);
          border-radius: 0 0 24px 24px;
          border-top: 1px solid rgba(0, 0, 0, 0.05);
        }

        .method-controls-container {
          display: flex;
          align-items: center;
          justify-content: space-between;
          max-width: 450px;
          margin: 0 auto;
        }

        .method-nav-controls {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .method-nav-btn {
          width: 46px;
          height: 46px;
          border-radius: 50%;
          border: 2px solid transparent;
          background: ${methods[currentIndex].bgGradient};
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          font-size: 1.1rem;
        }

        .method-nav-btn:hover {
          transform: scale(1.08);
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25);
          border-color: rgba(255, 255, 255, 0.3);
        }

        .method-nav-btn:active {
          transform: scale(0.95);
        }

        .method-nav-btn:disabled {
          opacity: 0.6;
          transform: none;
          cursor: not-allowed;
        }

        .method-progress-dots {
          display: flex;
          gap: 0.6rem;
          align-items: center;
        }

        .method-progress-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: #dee2e6;
          transition: all 0.3s ease;
          cursor: pointer;
          position: relative;
        }

        .method-progress-dot::after {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          transform: translate(-50%, -50%);
          transition: all 0.3s ease;
        }

        .method-progress-dot:hover::after {
          background: rgba(0, 0, 0, 0.1);
        }

        .method-progress-dot.active {
          background: ${methods[currentIndex].bgGradient};
          transform: scale(1.4);
          box-shadow: 0 0 0 4px rgba(17, 153, 142, 0.2);
        }

        .method-auto-play-section {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .method-auto-play-toggle {
          background: none;
          border: 2px solid #e9ecef;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          color: #6c757d;
          font-size: 1rem;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .method-auto-play-toggle:hover {
          border-color: #ced4da;
          color: #495057;
          transform: scale(1.05);
        }

        .method-auto-play-toggle.active {
          border-color: #28a745;
          color: #28a745;
          background: rgba(40, 167, 69, 0.1);
        }

        .method-auto-play-label {
          font-size: 0.85rem;
          color: #6c757d;
          font-weight: 500;
        }

        .method-slide-content {
          transform: ${isAnimating ? "translateX(20px)" : "translateX(0)"};
          opacity: ${isAnimating ? "0.7" : "1"};
          transition: all 0.3s ease;
        }

        .method-floating-shapes {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
          z-index: 1;
          pointer-events: none;
        }

        .method-shape {
          position: absolute;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 50%;
          animation: methodFloat 8s ease-in-out infinite;
        }

        .method-shape:nth-child(1) {
          width: 65px;
          height: 65px;
          top: 15%;
          right: 8%;
          animation-delay: 0s;
        }

        .method-shape:nth-child(2) {
          width: 45px;
          height: 45px;
          bottom: 25%;
          left: 12%;
          animation-delay: 3s;
        }

        .method-shape:nth-child(3) {
          width: 35px;
          height: 35px;
          top: 65%;
          right: 15%;
          animation-delay: 6s;
        }

        .method-shape:nth-child(4) {
          width: 25px;
          height: 25px;
          top: 35%;
          left: 8%;
          animation-delay: 1.5s;
        }

        @keyframes methodFloat {
          0%, 100% { 
            transform: translateY(0px) rotate(0deg);
            opacity: 0.7;
          }
          50% { 
            transform: translateY(-15px) rotate(180deg);
            opacity: 1;
          }
        }

        @keyframes methodPulse {
          0%, 100% { 
            opacity: 0.4;
            transform: scale(1);
          }
          50% { 
            opacity: 0.8;
            transform: scale(1.05);
          }
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .method-card-content {
            flex-direction: column;
            text-align: center;
            padding: 2rem 1.5rem;
            gap: 1.5rem;
          }

          .method-content-section {
            text-align: center;
          }

          .method-slide-title {
            font-size: 1.45rem;
          }

          .method-slide-description {
            font-size: 1.05rem;
          }

          .method-icon-container {
            width: 90px;
            height: 90px;
          }

          .method-slide-icon {
            font-size: 2.6rem;
          }

          .method-controls-section {
            padding: 1.2rem 1.5rem;
          }

          .method-controls-container {
            flex-direction: column;
            gap: 1rem;
          }

          .method-nav-controls {
            order: 2;
          }

          .method-auto-play-section {
            order: 1;
          }
        }

        @media (max-width: 576px) {
          .method-slideshow-container {
            border-radius: 16px;
            margin: 0 0.5rem;
          }

          .method-slide-card {
            border-radius: 16px;
            min-height: 260px;
          }

          .method-card-content {
            padding: 1.5rem 1rem;
          }

          .method-slide-title {
            font-size: 1.3rem;
          }

          .method-slide-description {
            font-size: 1rem;
          }

          .method-controls-section {
            padding: 1rem;
            border-radius: 0 0 16px 16px;
          }

          .method-nav-btn {
            width: 42px;
            height: 42px;
            font-size: 1rem;
          }
        }

        /* Dark theme support */
        @media (prefers-color-scheme: dark) {
          .method-controls-section {
            background: rgba(33, 37, 41, 0.98);
          }

          .method-auto-play-label {
            color: #adb5bd;
          }

          .method-auto-play-toggle {
            border-color: #495057;
            color: #adb5bd;
          }

          .method-auto-play-toggle:hover {
            border-color: #6c757d;
            color: #e9ecef;
          }
        }
      `}</style>

      <div className="method-slideshow-wrapper">
        <div className="method-slideshow-container">
          {/* Main Slide Card */}
          <div className="method-slide-card">
            {/* Floating Shapes */}
            <div className="method-floating-shapes">
              <div className="method-shape"></div>
              <div className="method-shape"></div>
              <div className="method-shape"></div>
              <div className="method-shape"></div>
            </div>

            <div className="method-card-content">
              <div className="method-slide-content" style={{ display: 'flex', alignItems: 'center', gap: '2rem', width: '100%' }}>
                {/* Icon Section */}
                <div className="method-icon-section">
                  <div className="method-icon-container">
                    <i className={`bi ${methods[currentIndex].icon} method-slide-icon`}></i>
                  </div>
                </div>

                {/* Content Section */}
                <div className="method-content-section">
                  <h4 className="method-slide-title">{methods[currentIndex].title}</h4>
                  <p className="method-slide-description">
                    {methods[currentIndex].description}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Controls Section */}
          <div className="method-controls-section">
            <div className="method-controls-container">
              {/* Navigation Controls */}
              <div className="method-nav-controls">
                <button
                  className="method-nav-btn"
                  onClick={prevMethod}
                  disabled={isAnimating}
                  title="Phương pháp trước"
                >
                  <i className="bi bi-chevron-left"></i>
                </button>

                <div className="method-progress-dots">
                  {methods.map((_, index) => (
                    <div
                      key={index}
                      className={`method-progress-dot ${index === currentIndex ? "active" : ""}`}
                      onClick={() => goToSlide(index)}
                      title={`Phương pháp ${index + 1}`}
                    ></div>
                  ))}
                </div>

                <button
                  className="method-nav-btn"
                  onClick={nextMethod}
                  disabled={isAnimating}
                  title="Phương pháp tiếp theo"
                >
                  <i className="bi bi-chevron-right"></i>
                </button>
              </div>

              {/* Auto-play Control */}
              <div className="method-auto-play-section">
                <span className="method-auto-play-label">Auto</span>
                <button
                  className={`method-auto-play-toggle ${isAutoPlay ? "active" : ""}`}
                  onClick={() => setIsAutoPlay(!isAutoPlay)}
                  title={isAutoPlay ? "Tắt tự động phát" : "Bật tự động phát"}
                >
                  <i className={`bi ${isAutoPlay ? "bi-pause-fill" : "bi-play-fill"}`}></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

// Usage trong section
const MethodSection = () => {
  return (
    <section className="py-5" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      <div className="container">
        <h1 className="text-center text-white mb-5 display-5 fw-bold">
          Tại sao chúng tôi giúp các học viên tiến bộ trong việc nghe nói tiếng Anh thực sự?
        </h1>
        <div className="row justify-content-center">
          <div className="col-lg-10 col-xl-9">
            <MethodSlideshow />
          </div>
        </div>
      </div>
    </section>
  );
};

export default MethodSection;