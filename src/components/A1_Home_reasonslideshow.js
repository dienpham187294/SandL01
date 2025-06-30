import React, { useState, useEffect } from "react";

// Component slideshow cho các lý do chọn - Bố cục cải tiến
const ReasonSlideshow = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);

  const reasons = [
    {
      icon: "bi-lightning-charge",
      title: "Hiệu quả nhanh chóng, trực quan",
      description:
        "Phương pháp học tập được thiết kế để mang lại kết quả nhanh chóng và dễ nhận biết",
      color: "primary",
      bgGradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    },
    {
      icon: "bi-people",
      title: "Phù hợp nhiều lứa tuổi",
      description:
        "Từ học sinh đến người đi làm, phù hợp với mọi lứa tuổi và trình độ",
      color: "success",
      bgGradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
    },
    {
      icon: "bi-arrow-up-circle",
      title: "Mất gốc vẫn luyện được",
      description:
        "Dù bạn đã quên nhiều kiến thức, chúng tôi sẽ giúp bạn xây dựng lại từ đầu",
      color: "warning",
      bgGradient: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
    },
    {
      icon: "bi-laptop",
      title: "Học online dễ dàng",
      description:
        "Học mọi lúc, mọi nơi với nền tảng trực tuyến hiện đại và thân thiện",
      color: "info",
      bgGradient: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
    },
  ];

  // Auto-play functionality
  useEffect(() => {
    if (isAutoPlay) {
      const interval = setInterval(() => {
        nextReason();
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [currentIndex, isAutoPlay]);

  const nextReason = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % reasons.length);
      setIsAnimating(false);
    }, 150);
  };

  const prevReason = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + reasons.length) % reasons.length);
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
        .slideshow-wrapper {
          padding: 0;
          margin: 0;
        }

        .slideshow-container {
          position: relative;
          overflow: hidden;
          border-radius: 24px;
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
          background: white;
          margin: 0 auto;
          max-width: 100%;
        }

        .slide-card {
          background: ${reasons[currentIndex].bgGradient};
          border-radius: 24px;
          border: none;
          backdrop-filter: blur(15px);
          position: relative;
          overflow: hidden;
          transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
          min-height: 280px;
        }

        .slide-card::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(12px);
        }

        .card-content {
          position: relative;
          z-index: 2;
          padding: 2.5rem 2rem;
          display: flex;
          align-items: center;
          gap: 2rem;
        }

        .icon-section {
          flex-shrink: 0;
        }

        .icon-container {
          width: 100px;
          height: 100px;
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

        .icon-container::after {
          content: "";
          position: absolute;
          top: -3px;
          left: -3px;
          right: -3px;
          bottom: -3px;
          border-radius: 50%;
          border: 2px solid rgba(255, 255, 255, 0.2);
          animation: pulse 3s infinite;
        }

        .icon-container:hover {
          transform: scale(1.05) rotate(5deg);
          background: rgba(255, 255, 255, 0.35);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        }

        .slide-icon {
          font-size: 2.8rem;
          color: white;
          text-shadow: 0 3px 15px rgba(0, 0, 0, 0.3);
        }

        .content-section {
          flex: 1;
          text-align: left;
        }

        .slide-title {
          color: white;
          font-weight: 700;
          font-size: 1.6rem;
          margin-bottom: 1rem;
          text-shadow: 0 2px 12px rgba(0, 0, 0, 0.3);
          line-height: 1.3;
        }

        .slide-description {
          color: rgba(255, 255, 255, 0.95);
          font-size: 1.05rem;
          line-height: 1.7;
          text-shadow: 0 1px 6px rgba(0, 0, 0, 0.2);
          margin: 0;
        }

        .controls-section {
          padding: 1.5rem 2rem;
          background: rgba(248, 249, 250, 0.98);
          backdrop-filter: blur(10px);
          border-radius: 0 0 24px 24px;
          border-top: 1px solid rgba(0, 0, 0, 0.05);
        }

        .controls-container {
          display: flex;
          align-items: center;
          justify-content: space-between;
          max-width: 400px;
          margin: 0 auto;
        }

        .nav-controls {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .nav-btn {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          border: 2px solid transparent;
          background: ${reasons[currentIndex].bgGradient};
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          font-size: 1.1rem;
        }

        .nav-btn:hover {
          transform: scale(1.08);
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25);
          border-color: rgba(255, 255, 255, 0.3);
        }

        .nav-btn:active {
          transform: scale(0.95);
        }

        .nav-btn:disabled {
          opacity: 0.6;
          transform: none;
          cursor: not-allowed;
        }

        .progress-dots {
          display: flex;
          gap: 0.6rem;
          align-items: center;
        }

        .progress-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: #dee2e6;
          transition: all 0.3s ease;
          cursor: pointer;
          position: relative;
        }

        .progress-dot::after {
          content: "";
          position: absolute;
          top: 50%;
          left: 50%;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          transform: translate(-50%, -50%);
          transition: all 0.3s ease;
        }

        .progress-dot:hover::after {
          background: rgba(0, 0, 0, 0.1);
        }

        .progress-dot.active {
          background: ${reasons[currentIndex].bgGradient};
          transform: scale(1.4);
          box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.2);
        }

        .auto-play-section {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .auto-play-toggle {
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

        .auto-play-toggle:hover {
          border-color: #ced4da;
          color: #495057;
          transform: scale(1.05);
        }

        .auto-play-toggle.active {
          border-color: #28a745;
          color: #28a745;
          background: rgba(40, 167, 69, 0.1);
        }

        .auto-play-label {
          font-size: 0.85rem;
          color: #6c757d;
          font-weight: 500;
        }

        .slide-content {
          transform: ${isAnimating ? "translateX(20px)" : "translateX(0)"};
          opacity: ${isAnimating ? "0.7" : "1"};
          transition: all 0.3s ease;
        }

        .floating-shapes {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
          z-index: 1;
          pointer-events: none;
        }

        .shape {
          position: absolute;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 50%;
          animation: float 8s ease-in-out infinite;
        }

        .shape:nth-child(1) {
          width: 60px;
          height: 60px;
          top: 15%;
          right: 10%;
          animation-delay: 0s;
        }

        .shape:nth-child(2) {
          width: 40px;
          height: 40px;
          bottom: 20%;
          left: 15%;
          animation-delay: 3s;
        }

        .shape:nth-child(3) {
          width: 30px;
          height: 30px;
          top: 70%;
          right: 20%;
          animation-delay: 6s;
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
            opacity: 0.7;
          }
          50% {
            transform: translateY(-15px) rotate(180deg);
            opacity: 1;
          }
        }

        @keyframes pulse {
          0%,
          100% {
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
          .card-content {
            flex-direction: column;
            text-align: center;
            padding: 2rem 1.5rem;
            gap: 1.5rem;
          }

          .content-section {
            text-align: center;
          }

          .slide-title {
            font-size: 1.4rem;
          }

          .slide-description {
            font-size: 1rem;
          }

          .icon-container {
            width: 85px;
            height: 85px;
          }

          .slide-icon {
            font-size: 2.4rem;
          }

          .controls-section {
            padding: 1.2rem 1.5rem;
          }

          .controls-container {
            flex-direction: column;
            gap: 1rem;
          }

          .nav-controls {
            order: 2;
          }

          .auto-play-section {
            order: 1;
          }
        }

        @media (max-width: 576px) {
          .slideshow-container {
            border-radius: 16px;
            margin: 0 0.5rem;
          }

          .slide-card {
            border-radius: 16px;
            min-height: 240px;
          }

          .card-content {
            padding: 1.5rem 1rem;
          }

          .slide-title {
            font-size: 1.2rem;
          }

          .slide-description {
            font-size: 0.95rem;
          }

          .controls-section {
            padding: 1rem;
            border-radius: 0 0 16px 16px;
          }

          .nav-btn {
            width: 40px;
            height: 40px;
            font-size: 1rem;
          }
        }

        /* Dark theme support */
        @media (prefers-color-scheme: dark) {
          .controls-section {
            background: rgba(33, 37, 41, 0.98);
          }

          .auto-play-label {
            color: #adb5bd;
          }

          .auto-play-toggle {
            border-color: #495057;
            color: #adb5bd;
          }

          .auto-play-toggle:hover {
            border-color: #6c757d;
            color: #e9ecef;
          }
        }
      `}</style>

      <div className="slideshow-wrapper">
        <div className="slideshow-container">
          {/* Main Slide Card */}
          <div className="slide-card">
            {/* Floating Shapes */}
            <div className="floating-shapes">
              <div className="shape"></div>
              <div className="shape"></div>
              <div className="shape"></div>
            </div>

            <div className="card-content">
              <div
                className="slide-content"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "2rem",
                  width: "100%",
                }}
              >
                {/* Icon Section */}
                <div className="icon-section">
                  <div className="icon-container">
                    <i
                      className={`bi ${reasons[currentIndex].icon} slide-icon`}
                    ></i>
                  </div>
                </div>

                {/* Content Section */}
                <div className="content-section">
                  <h4 className="slide-title">{reasons[currentIndex].title}</h4>
                  <p className="slide-description">
                    {reasons[currentIndex].description}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Controls Section */}
          <div className="controls-section">
            <div className="controls-container">
              {/* Navigation Controls */}
              <div className="nav-controls">
                <button
                  className="nav-btn"
                  onClick={prevReason}
                  disabled={isAnimating}
                  title="Slide trước"
                >
                  <i className="bi bi-chevron-left"></i>
                </button>

                <div className="progress-dots">
                  {reasons.map((_, index) => (
                    <div
                      key={index}
                      className={`progress-dot ${
                        index === currentIndex ? "active" : ""
                      }`}
                      onClick={() => goToSlide(index)}
                      title={`Slide ${index + 1}`}
                    ></div>
                  ))}
                </div>

                <button
                  className="nav-btn"
                  onClick={nextReason}
                  disabled={isAnimating}
                  title="Slide tiếp theo"
                >
                  <i className="bi bi-chevron-right"></i>
                </button>
              </div>

              {/* Auto-play Control */}
              <div className="auto-play-section">
                <span className="auto-play-label">Auto</span>
                <button
                  className={`auto-play-toggle ${isAutoPlay ? "active" : ""}`}
                  onClick={() => setIsAutoPlay(!isAutoPlay)}
                  title={isAutoPlay ? "Tắt tự động phát" : "Bật tự động phát"}
                >
                  <i
                    className={`bi ${
                      isAutoPlay ? "bi-pause-fill" : "bi-play-fill"
                    }`}
                  ></i>
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
const ReasonUsage = () => {
  return (
    <section
      className="py-5"
      style={{
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      }}
    >
      <div className="container">
        <h1 className="text-center text-white mb-5 display-5 fw-bold">
          Tại sao lại chọn chúng tôi?
        </h1>
        <div className="row justify-content-center">
          <div className="col-lg-10 col-xl-8">
            <ReasonSlideshow />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReasonUsage;
