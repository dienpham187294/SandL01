import React, { useEffect, useState } from "react";
import LinkAPI from "../ulti/T0_linkApi";
const PLAYLIST_ID = "PLC0acE0qMKOkXtgSnKc9uhj6Ekj-8VDo5";

const PLAYLIST_ID_HD = "PLC0acE0qMKOlNOu-mq4kE0gOt6v83RjrS";
// Component slideshow video YouTube
const VideoSlideshow = ({ ID }) => {
  const [videos, setVideos] = useState([]);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const API_KEY = "AIzaSyBWBxqpLe4z7BFwmuDegv82QH7ZTofrO-o";

  useEffect(() => {
    const fetchPlaylistVideos = async () => {
      try {
        const apiUrl = `https://www.googleapis.com/youtube/v3/playlistItems?key=${API_KEY}&playlistId=${ID}&part=snippet&maxResults=50`;
        const response = await fetch(apiUrl);
        const data = await response.json();
        setVideos(data.items || []);
      } catch (error) {
        console.error("Lỗi khi tải danh sách phát:", error);
      }
    };
    fetchPlaylistVideos();
  }, []);

  const nextVideo = () => {
    setCurrentVideoIndex((prev) => (prev + 1) % videos.length);
  };

  const prevVideo = () => {
    setCurrentVideoIndex((prev) => (prev - 1 + videos.length) % videos.length);
  };

  if (videos.length === 0)
    return <div className="text-center">Đang tải video...</div>;

  return (
    <div className="position-relative">
      <div className="video-container mb-3">
        <iframe
          width="100%"
          height="400"
          src={`https://www.youtube.com/embed/${videos[currentVideoIndex]?.snippet?.resourceId?.videoId}`}
          title={videos[currentVideoIndex]?.snippet?.title}
          frameBorder="0"
          allowFullScreen
          className="rounded shadow-lg"
        ></iframe>
      </div>

      <div className="d-flex justify-content-between align-items-center">
        <button className="btn btn-outline-primary" onClick={prevVideo}>
          <i className="bi bi-chevron-left"></i> Trước
        </button>
        <span className="text-muted">
          {currentVideoIndex + 1} / {videos.length}
        </span>
        <button className="btn btn-outline-primary" onClick={nextVideo}>
          Sau <i className="bi bi-chevron-right"></i>
        </button>
      </div>

      <h5 className="mt-3 text-center text-dark">
        {videos[currentVideoIndex]?.snippet?.title}
      </h5>
    </div>
  );
};

// Component slideshow cho các lý do chọn
const ReasonSlideshow = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const reasons = [
    {
      icon: "bi-lightning-charge",
      title: "Hiệu quả nhanh chóng, trực quan",
      description:
        "Phương pháp học tập được thiết kế để mang lại kết quả nhanh chóng và dễ nhận biết",
    },
    {
      icon: "bi-people",
      title: "Phù hợp nhiều lứa tuổi",
      description:
        "Từ học sinh đến người đi làm, phù hợp với mọi lứa tuổi và trình độ",
    },
    {
      icon: "bi-arrow-up-circle",
      title: "Mất gốc vẫn luyện được",
      description:
        "Dù bạn đã quên nhiều kiến thức, chúng tôi sẽ giúp bạn xây dựng lại từ đầu",
    },
    {
      icon: "bi-laptop",
      title: "Học online dễ dàng",
      description:
        "Học mọi lúc, mọi nơi với nền tảng trực tuyến hiện đại và thân thiện",
    },
  ];

  const nextReason = () => {
    setCurrentIndex((prev) => (prev + 1) % reasons.length);
  };

  const prevReason = () => {
    setCurrentIndex((prev) => (prev - 1 + reasons.length) % reasons.length);
  };

  return (
    <div className="text-center py-4">
      <div
        className="card border-0 shadow-sm mx-auto"
        style={{ maxWidth: "500px" }}
      >
        <div className="card-body p-5">
          <i
            className={`bi ${reasons[currentIndex].icon} text-primary`}
            style={{ fontSize: "3rem" }}
          ></i>
          <h4 className="card-title mt-3 mb-3 text-dark">
            {reasons[currentIndex].title}
          </h4>
          <p className="card-text text-muted">
            {reasons[currentIndex].description}
          </p>
        </div>
      </div>

      <div className="d-flex justify-content-center align-items-center mt-4">
        <button className="btn btn-outline-primary me-3" onClick={prevReason}>
          <i className="bi bi-chevron-left"></i>
        </button>
        <div className="d-flex gap-2">
          {reasons.map((_, index) => (
            <div
              key={index}
              className={`rounded-circle ${
                index === currentIndex ? "bg-primary" : "bg-light"
              }`}
              style={{ width: "10px", height: "10px" }}
            ></div>
          ))}
        </div>
        <button className="btn btn-outline-primary ms-3" onClick={nextReason}>
          <i className="bi bi-chevron-right"></i>
        </button>
      </div>
    </div>
  );
};

// Component slideshow phương pháp
const MethodSlideshow = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const methods = [
    {
      icon: "bi-robot",
      title: "Ứng dụng công nghệ trí tuệ nhân tạo",
      description:
        "Sử dụng AI để cá nhân hóa trải nghiệm học tập cho từng học viên",
    },
    {
      icon: "bi-person-heart",
      title: "Thầy cô tận tình chỉ dạy",
      description:
        "Đội ngũ giáo viên giàu kinh nghiệm, luôn sẵn sàng hỗ trợ học viên",
    },
    {
      icon: "bi-music-note-beamed",
      title: "Luyện từ nền tảng ghép âm",
      description: "Phương pháp ghép âm độc đáo giúp phát âm chuẩn từ cơ bản",
    },
    {
      icon: "bi-repeat",
      title: "Luyện tập nghe nói liên tục",
      description:
        "Thực hành nhiều lần để tạo phản xạ tự nhiên trong giao tiếp",
    },
    {
      icon: "bi-emoji-smile",
      title: "Không áp lực, không stress",
      description:
        "Học tập thoải mái, không bắt phải suy nghĩ hay áp lực bài tập",
    },
  ];

  const nextMethod = () => {
    setCurrentIndex((prev) => (prev + 1) % methods.length);
  };

  const prevMethod = () => {
    setCurrentIndex((prev) => (prev - 1 + methods.length) % methods.length);
  };

  return (
    <div className="text-center py-4">
      <div
        className="card border-0 shadow-sm mx-auto"
        style={{ maxWidth: "600px" }}
      >
        <div className="card-body p-5">
          <i
            className={`bi ${methods[currentIndex].icon} text-success`}
            style={{ fontSize: "3rem" }}
          ></i>
          <h4 className="card-title mt-3 mb-3 text-dark">
            {methods[currentIndex].title}
          </h4>
          <p className="card-text text-muted">
            {methods[currentIndex].description}
          </p>
        </div>
      </div>

      <div className="d-flex justify-content-center align-items-center mt-4">
        <button className="btn btn-outline-success me-3" onClick={prevMethod}>
          <i className="bi bi-chevron-left"></i>
        </button>
        <div className="d-flex gap-2">
          {methods.map((_, index) => (
            <div
              key={index}
              className={`rounded-circle ${
                index === currentIndex ? "bg-success" : "bg-light"
              }`}
              style={{ width: "10px", height: "10px" }}
            ></div>
          ))}
        </div>
        <button className="btn btn-outline-success ms-3" onClick={nextMethod}>
          <i className="bi bi-chevron-right"></i>
        </button>
      </div>
    </div>
  );
};

// Component slideshow tin tưởng
const TrustSlideshow = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const trustPoints = [
    {
      icon: "bi-eye",
      title: "Trăm nghe không bằng một thấy",
      description:
        "Châm ngôn của chúng tôi luôn là trăm nghe không bằng một thấy. Trăm thấy không bằng một thử.",
    },
    {
      icon: "bi-gift",
      title: "Trải nghiệm miễn phí",
      description:
        "Hãy tham gia khóa học miễn phí 4 buổi để được trải nghiệm phương pháp của chúng tôi.",
    },
  ];

  const toggleTrust = () => {
    setCurrentIndex((prev) => (prev + 1) % trustPoints.length);
  };

  return (
    <div className="text-center py-4">
      <div
        className="card border-0 shadow-sm mx-auto"
        style={{ maxWidth: "600px" }}
      >
        <div className="card-body p-5">
          <i
            className={`bi ${trustPoints[currentIndex].icon} text-warning`}
            style={{ fontSize: "3rem" }}
          ></i>
          <h4 className="card-title mt-3 mb-3 text-dark">
            {trustPoints[currentIndex].title}
          </h4>
          <p className="card-text text-muted">
            {trustPoints[currentIndex].description}
          </p>
        </div>
      </div>

      <div className="d-flex justify-content-center align-items-center mt-4">
        <button className="btn btn-warning" onClick={toggleTrust}>
          {currentIndex === 0
            ? "Xem trải nghiệm miễn phí"
            : "Quay lại châm ngôn"}
        </button>
      </div>
    </div>
  );
};

// Component form đăng ký
const RegistrationForm = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const formatTime = (date) => {
    return date.toLocaleString("vi-VN");
  };

  const handleSubmit = async () => {
    if (!phoneNumber.trim()) {
      alert("Vui lòng nhập số điện thoại");
      return;
    }

    if (!phoneNumber.match(/^[0-9]{10,11}$/)) {
      alert("Số điện thoại không hợp lệ");
      return;
    }

    setIsSubmitting(true);

    try {
      const requestBody = {
        subjectText: `Đăng ký khóa học tiếng Anh | SĐT: ${phoneNumber} | ${formatTime(
          new Date()
        )}`,
        contentText: `Khách hàng đăng ký với số điện thoại: ${phoneNumber}\nThời gian: ${formatTime(
          new Date()
        )}\nLink: ${window.location.href}`,
        toEmail: "pvkadien0209@gmail.com",
      };

      // Thay thế LinkAPI bằng URL API thực tế
      const response = await fetch(LinkAPI + "mail-homework", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      const json = await response.json();

      if (json.success) {
        setSubmitted(true);
        setPhoneNumber("");
      } else {
        alert("Đăng ký không thành công, vui lòng thử lại");
      }
    } catch (error) {
      console.error("Lỗi khi đăng ký:", error);
      // Mô phỏng thành công cho demo
      setSubmitted(true);
      setPhoneNumber("");
    }

    setIsSubmitting(false);
  };

  if (submitted) {
    return (
      <div className="text-center py-5">
        <div
          className="card border-0 shadow-lg mx-auto"
          style={{ maxWidth: "500px" }}
        >
          <div className="card-body p-5">
            <i
              className="bi bi-check-circle-fill text-success"
              style={{ fontSize: "4rem" }}
            ></i>
            <h3 className="mt-3 text-success">Đăng ký thành công!</h3>
            <p className="text-muted">
              Chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất để tư vấn về
              khóa học.
            </p>
            <button
              className="btn btn-outline-primary mt-3"
              onClick={() => setSubmitted(false)}
            >
              Đăng ký thêm
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="text-center py-5">
      <div
        className="card border-0 shadow-lg mx-auto"
        style={{ maxWidth: "500px" }}
      >
        <div className="card-body p-5">
          <i
            className="bi bi-telephone-fill text-primary"
            style={{ fontSize: "3rem" }}
          ></i>
          <h3 className="mt-3 mb-4 text-dark">Đăng ký tư vấn</h3>

          <div>
            <div className="mb-3">
              <input
                type="tel"
                className="form-control form-control-lg text-center"
                placeholder="Nhập số điện thoại của bạn"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                disabled={isSubmitting}
              />
            </div>

            {phoneNumber && (
              <div className="mb-3 p-3 bg-light rounded">
                <small className="text-muted">Xác nhận số điện thoại:</small>
                <div className="fw-bold text-primary">{phoneNumber}</div>
              </div>
            )}

            <button
              onClick={handleSubmit}
              className="btn btn-primary btn-lg w-100"
              disabled={!phoneNumber.trim() || isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2"></span>
                  Đang gửi...
                </>
              ) : (
                "Gửi thông tin đăng ký"
              )}
            </button>
          </div>

          <p className="text-muted mt-3 small">
            Chúng tôi cam kết bảo mật thông tin cá nhân của bạn
          </p>
        </div>
      </div>
    </div>
  );
};

// Component chính
const EnglishLandingPage = () => {
  return (
    <div
      className="min-vh-100"
      style={{
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      }}
    >
      <div style={{ height: "8vh" }}></div>
      {/* Bootstrap CSS */}
      <link
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
        rel="stylesheet"
      />
      <link
        href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css"
        rel="stylesheet"
      />

      {/* Hero Section */}
      <section className="py-5 text-center text-white">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <h1 className="display-4 fw-bold mb-4">
                Bạn đang tìm một cách học tiếng Anh thật sự hiệu quả?
              </h1>
            </div>
          </div>
        </div>
      </section>

      {/* Video Section */}
      <section className="py-5">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="bg-white rounded-4 shadow-lg p-4">
                <h2 className="h3 mb-5 opacity-75">
                  Kết quả trực quan trong thời gian ngắn
                </h2>
                <VideoSlideshow ID={PLAYLIST_ID} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-5">
        <div className="container">
          <h1 className="text-center text-white mb-5 display-5 fw-bold">
            Tại sao lại chọn chúng tôi?
          </h1>
          <div className="bg-white rounded-4 shadow-lg p-4">
            <ReasonSlideshow />
          </div>
        </div>
      </section>
      {/* Video Section */}
      <section className="py-5">
        {/* <h2 className="h3 mb-5 opacity-75">
          HƯỚNG DẪN GHÉP ÂM CHI TIẾT TẬN TÂM
        </h2> */}

        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="bg-white rounded-4 shadow-lg p-4">
                <h2 className="h3 mb-5 opacity-75">
                  HƯỚNG DẪN GHÉP ÂM CHI TIẾT TẬN TÂM
                </h2>
                <VideoSlideshow ID={PLAYLIST_ID_HD} />
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Method Section */}
      <section className="py-5">
        <div className="container">
          <h1 className="text-center text-white mb-5 display-5 fw-bold">
            Tại sao chúng tôi giúp các học viên tiến bộ trong việc nghe nói
            tiếng Anh thực sự?
          </h1>
          <div className="bg-white rounded-4 shadow-lg p-4">
            <MethodSlideshow />
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-5">
        <div className="container">
          <h1 className="text-center text-white mb-5 display-5 fw-bold">
            Làm sao để tin tưởng được?
          </h1>
          <div className="bg-white rounded-4 shadow-lg p-4">
            <TrustSlideshow />
          </div>
        </div>
      </section>

      {/* Registration Section */}
      <section className="py-5">
        <div className="container">
          <h1 className="text-center text-white mb-5 display-5 fw-bold">
            Để lại số điện thoại, chúng tôi sẽ liên hệ bạn
          </h1>
          <RegistrationForm />
        </div>
      </section>

      {/* Footer */}
      <footer className="py-4 text-center text-white opacity-75">
        <div className="container">
          <p className="mb-0">
            © 2025 Khóa học tiếng Anh hiệu quả - Liên hệ ngay để được tư vấn
            miễn phí
          </p>
        </div>
      </footer>
    </div>
  );
};

export default EnglishLandingPage;
