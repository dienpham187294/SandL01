import React, { useState, useEffect } from "react";

// Component slideshow tin tưởng - Bố cục cải tiến
const TrustSlideshow = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const trustPoints = [
    {
      icon: "bi-eye",
      title: "Trăm nghe không bằng một thấy",
      description: `Châm ngôn của chúng tôi luôn là "Trăm nghe không bằng một thấy, trăm thấy không bằng một thử."`,
      color: "warning",
      bgGradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
      buttonText: "Quét mã để tham gia nhóm",
      buttonIcon: "bi-arrow-right-circle",
    },
    {
      icon: "bi-gift",
      title: "Quét mã để tham gia nhóm",
      description:
        "Hãy tham gia khóa học miễn phí 4 buổi để được trải nghiệm phương pháp của chúng tôi.",
      color: "warning",
      bgGradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
      buttonText: "Quét mã để tham gia nhóm",
      buttonIcon: "bi-arrow-left-circle",
    },
  ];

  // Auto-play functionality (slower for reading)
  useEffect(() => {
    if (isAutoPlay) {
      const interval = setInterval(() => {
        toggleTrust();
      }, 6000);
      return () => clearInterval(interval);
    }
  }, [currentIndex, isAutoPlay]);

  const toggleTrust = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % trustPoints.length);
      setIsAnimating(false);
    }, 200);
  };

  const goToSlide = (index) => {
    if (isAnimating || index === currentIndex) return;
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentIndex(index);
      setIsAnimating(false);
    }, 200);
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
        .trust-slideshow-wrapper {
          padding: 0;
          margin: 0;
        }
        .trust-slideshow-container {
          position: relative;
          overflow: hidden;
          border-radius: 24px;
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
          background: white;
          margin: 0 auto;
          max-width: 100%;
        }
        .trust-slide-card {
          background: ${trustPoints[currentIndex].bgGradient};
          border-radius: 24px;
          border: none;
          backdrop-filter: blur(15px);
          position: relative;
          overflow: hidden;
          transition: all 0.7s cubic-bezier(0.4, 0, 0.2, 1);
          min-height: 320px;
        }
        .trust-slide-card::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(12px);
        }
        .trust-card-content {
          position: relative;
          z-index: 2;
          padding: 3rem 2.5rem;
          display: flex;
          align-items: center;
          gap: 2.5rem;
        }
        .trust-content-section {
          flex: 1;
          text-align: left;
        }
        .trust-slide-content {
          transform: ${isAnimating ? "translateY(20px)" : "translateY(0)"};
          opacity: ${isAnimating ? "0.6" : "1"};
          transition: all 0.4s ease;
        }
        .qr-content h1 {
          color: white;
          font-weight: 700;
          font-size: 1.75rem;
          margin-bottom: 1.2rem;
          text-shadow: 0 2px 12px rgba(0, 0, 0, 0.3);
          line-height: 1.3;
        }
        .qr-content h2 {
          color: rgba(255, 255, 255, 0.95);
          font-size: 1.15rem;
          line-height: 1.8;
          text-shadow: 0 1px 6px rgba(0, 0, 0, 0.2);
          margin: 0;
          font-style: italic;
          font-weight: 600;
        }
        .qr-image {
          border-radius: 15px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
          border: 4px solid rgba(255, 255, 255, 0.3);
          background: white;
          padding: 10px;
        }
        .trust-controls-section {
          padding: 2rem 2.5rem;
          background: rgba(248, 249, 250, 0.98);
          backdrop-filter: blur(10px);
          border-radius: 0 0 24px 24px;
          border-top: 1px solid rgba(0, 0, 0, 0.05);
        }
        .trust-controls-container {
          display: flex;
          align-items: center;
          justify-content: space-between;
          max-width: 500px;
          margin: 0 auto;
        }
        .trust-main-action {
          flex: 1;
          display: flex;
          justify-content: center;
        }
        .trust-action-btn {
          background: ${trustPoints[currentIndex].bgGradient};
          border: none;
          border-radius: 50px;
          color: white;
          font-weight: 600;
          font-size: 1.1rem;
          padding: 0.9rem 2.5rem;
          transition: all 0.3s ease;
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
          display: flex;
          align-items: center;
          gap: 0.8rem;
          text-transform: none;
        }
        .trust-action-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.25);
          color: white;
        }
        .trust-action-btn:active {
          transform: translateY(0);
        }
        .trust-action-btn:disabled {
          opacity: 0.7;
          transform: none;
          cursor: not-allowed;
        }
        .trust-nav-section {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        .trust-progress-dots {
          display: flex;
          gap: 0.8rem;
          align-items: center;
        }
        .trust-progress-dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: #dee2e6;
          transition: all 0.3s ease;
          cursor: pointer;
          position: relative;
        }
        .trust-progress-dot::after {
          content: "";
          position: absolute;
          top: 50%;
          left: 50%;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          transform: translate(-50%, -50%);
          transition: all 0.3s ease;
        }
        .trust-progress-dot:hover::after {
          background: rgba(0, 0, 0, 0.1);
        }
        .trust-progress-dot.active {
          background: ${trustPoints[currentIndex].bgGradient};
          transform: scale(1.5);
          box-shadow: 0 0 0 4px rgba(249, 147, 251, 0.2);
        }
        .trust-auto-play-section {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .trust-auto-play-toggle {
          background: none;
          border: 2px solid #e9ecef;
          border-radius: 50%;
          width: 42px;
          height: 42px;
          color: #6c757d;
          font-size: 1.1rem;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .trust-auto-play-toggle:hover {
          border-color: #ced4da;
          color: #495057;
          transform: scale(1.05);
        }
        .trust-auto-play-toggle.active {
          border-color: #ffc107;
          color: #ffc107;
          background: rgba(255, 193, 7, 0.1);
        }
        .trust-auto-play-label {
          font-size: 0.85rem;
          color: #6c757d;
          font-weight: 500;
        }
        .trust-floating-shapes {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
          z-index: 1;
          pointer-events: none;
        }
        .trust-shape {
          position: absolute;
          background: rgba(255, 255, 255, 0.1);
          animation: trustFloat 10s ease-in-out infinite;
        }
        .trust-shape:nth-child(1) {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          top: 10%;
          right: 5%;
          animation-delay: 0s;
        }
        .trust-shape:nth-child(2) {
          width: 60px;
          height: 20px;
          border-radius: 10px;
          bottom: 30%;
          left: 8%;
          animation-delay: 4s;
        }
        .trust-shape:nth-child(3) {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          top: 60%;
          right: 12%;
          animation-delay: 7s;
        }
        .trust-shape:nth-child(4) {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          top: 25%;
          left: 5%;
          animation-delay: 2s;
        }
        @keyframes trustFloat {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
            opacity: 0.6;
          }
          25% {
            transform: translateY(-10px) rotate(45deg);
            opacity: 0.8;
          }
          50% {
            transform: translateY(-20px) rotate(90deg);
            opacity: 1;
          }
          75% {
            transform: translateY(-10px) rotate(135deg);
            opacity: 0.8;
          }
        }
        /* Responsive Design */
        @media (max-width: 768px) {
          .trust-card-content {
            flex-direction: column;
            text-align: center;
            padding: 2.5rem 1.5rem;
            gap: 2rem;
          }
          .trust-content-section {
            text-align: center;
          }
          .qr-content h1 {
            font-size: 1.5rem;
          }
          .qr-content h2 {
            font-size: 1.08rem;
          }
          .trust-controls-section {
            padding: 1.5rem;
          }
          .trust-controls-container {
            flex-direction: column;
            gap: 1.5rem;
          }
          .trust-main-action {
            order: 1;
            width: 100%;
          }
          .trust-nav-section {
            order: 2;
            justify-content: center;
          }
          .trust-action-btn {
            font-size: 1rem;
            padding: 0.8rem 2rem;
          }
        }
        @media (max-width: 576px) {
          .trust-slideshow-container {
            border-radius: 16px;
            margin: 0 0.5rem;
          }
          .trust-slide-card {
            border-radius: 16px;
            min-height: 280px;
          }
          .trust-card-content {
            padding: 2rem 1rem;
          }
          .qr-content h1 {
            font-size: 1.3rem;
          }
          .qr-content h2 {
            font-size: 1rem;
          }
          .trust-controls-section {
            padding: 1.2rem;
            border-radius: 0 0 16px 16px;
          }
          .trust-action-btn {
            font-size: 0.95rem;
            padding: 0.7rem 1.5rem;
          }
        }
        /* Dark theme support */
        @media (prefers-color-scheme: dark) {
          .trust-controls-section {
            background: rgba(33, 37, 41, 0.98);
          }
          .trust-auto-play-label {
            color: #adb5bd;
          }
          .trust-auto-play-toggle {
            border-color: #495057;
            color: #adb5bd;
          }
          .trust-auto-play-toggle:hover {
            border-color: #6c757d;
            color: #e9ecef;
          }
        }
      `}</style>
      <div className="trust-slideshow-wrapper">
        <div className="trust-slideshow-container">
          {/* Main Slide Card */}
          <div className="trust-slide-card">
            {/* Floating Shapes */}
            <div className="trust-floating-shapes">
              <div className="trust-shape"></div>
              <div className="trust-shape"></div>
              <div className="trust-shape"></div>
              <div className="trust-shape"></div>
            </div>
            <div className="trust-card-content">
              <div
                className="trust-slide-content"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "2.5rem",
                  width: "100%",
                }}
              >
                {/* Content Section */}
                <div className="trust-content-section">
                  <div className="row qr-content">
                    <div className="col-lg-6 col-md-12 mb-3 mb-lg-0 d-flex justify-content-center">
                      <img
                        src="https://i.postimg.cc/FR8WLTdD/free-ghep-am.jpg"
                        className="qr-image"
                        style={{
                          width: "250px",
                          maxWidth: "100%",
                          height: "auto",
                        }}
                        alt="QR Code để tham gia nhóm học"
                      />
                    </div>
                    <div className="col-lg-6 col-md-12 d-flex flex-column justify-content-center">
                      <h1>
                        Nhóm học ghép âm miễn phí 7h30 tối thứ 2 hàng tuần qua
                        google meet.
                      </h1>
                      <h2>Quét mã để tham gia ngay.</h2>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Controls Section */}
          <div className="trust-controls-section">
            <div className="trust-controls-container">
              {/* Main Action Button */}
              <div className="trust-main-action">
                <button
                  className="trust-action-btn"
                  onClick={toggleTrust}
                  disabled={isAnimating}
                >
                  <span>{trustPoints[currentIndex].buttonText}</span>
                  <i
                    className={`bi ${trustPoints[currentIndex].buttonIcon}`}
                  ></i>
                </button>
              </div>
              {/* Navigation Section */}
              <div className="trust-nav-section">
                <div className="trust-progress-dots">
                  {trustPoints.map((_, index) => (
                    <div
                      key={index}
                      className={`trust-progress-dot ${
                        index === currentIndex ? "active" : ""
                      }`}
                      onClick={() => goToSlide(index)}
                      title={`${
                        index === 0
                          ? "Tham gia trải nghiệm"
                          : "Kiến thức giá trị"
                      }`}
                    ></div>
                  ))}
                </div>
                {/* Auto-play Control */}
                <div className="trust-auto-play-section">
                  <span className="trust-auto-play-label">Auto</span>
                  <button
                    className={`trust-auto-play-toggle ${
                      isAutoPlay ? "active" : ""
                    }`}
                    onClick={() => setIsAutoPlay(!isAutoPlay)}
                    title={
                      isAutoPlay ? "Tắt tự động chuyển" : "Bật tự động chuyển"
                    }
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
      </div>
    </>
  );
};

// Usage trong section
const Register = () => {
  return (
    <section
      className="py-5"
      style={{
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      }}
    >
      <div className="container">
        <h1 className="text-center text-white mb-5 display-5 fw-bold">
          Tham gia miễn phí!
        </h1>
        <div className="row justify-content-center">
          <div className="col-lg-10 col-xl-8">
            <TrustSlideshow />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Register;
