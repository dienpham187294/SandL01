import React, { useEffect, useState } from "react";

// Component slideshow video YouTube
const VideoSlideshow = ({ playlistId, title }) => {
  const [videos, setVideos] = useState([]);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const API_KEY = "AIzaSyBWBxqpLe4z7BFwmuDegv82QH7ZTofrO-o";

  useEffect(() => {
    const fetchPlaylistVideos = async () => {
      try {
        const apiUrl = `https://www.googleapis.com/youtube/v3/playlistItems?key=${API_KEY}&playlistId=${playlistId}&part=snippet&maxResults=10`;
        const response = await fetch(apiUrl);
        const data = await response.json();
        setVideos(data.items || []);
      } catch (error) {
        console.error("Lỗi khi tải danh sách phát:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPlaylistVideos();
  }, [playlistId]);

  const nextVideo = () => {
    setCurrentVideoIndex((prev) => (prev + 1) % videos.length);
  };

  const prevVideo = () => {
    setCurrentVideoIndex((prev) => (prev - 1 + videos.length) % videos.length);
  };

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-8 shadow-lg">
        <div className="flex items-center justify-center space-x-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="text-gray-600 font-medium">Đang tải video...</span>
        </div>
      </div>
    );
  }

  if (videos.length === 0) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
        <span className="text-red-600">
          Không thể tải video. Vui lòng thử lại sau.
        </span>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
      {/* Video Container */}
      <div className="relative aspect-video bg-black">
        <iframe
          src={`https://www.youtube.com/embed/${videos[currentVideoIndex]?.snippet?.resourceId?.videoId}?autoplay=0&rel=0&modestbranding=1`}
          title={videos[currentVideoIndex]?.snippet?.title}
          className="w-full h-full rounded-t-2xl"
          frameBorder="0"
          allowFullScreen
        />

        {/* Navigation Overlay */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-medium">
            {currentVideoIndex + 1} / {videos.length}
          </div>
        </div>
      </div>

      {/* Video Info & Controls */}
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 line-clamp-2">
          {videos[currentVideoIndex]?.snippet?.title}
        </h3>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between">
          <button
            onClick={prevVideo}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-all duration-200 text-gray-700 font-medium"
            disabled={videos.length <= 1}
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            <span className="hidden sm:inline">Trước</span>
          </button>

          {/* Video Indicators */}
          <div className="flex space-x-2">
            {videos.slice(0, 5).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentVideoIndex(index)}
                className={`w-2 h-2 rounded-full transition-all duration-200 ${
                  index === currentVideoIndex
                    ? "bg-blue-600 w-6"
                    : "bg-gray-300 hover:bg-gray-400"
                }`}
              />
            ))}
          </div>

          <button
            onClick={nextVideo}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-200 font-medium"
            disabled={videos.length <= 1}
          >
            <span className="hidden sm:inline">Sau</span>
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

// Component slideshow cho các lý do chọn
const ReasonSlideshow = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const reasons = [
    {
      icon: "⚡",
      title: "Hiệu quả nhanh chóng, trực quan",
      description:
        "Phương pháp học tập được thiết kế để mang lại kết quả nhanh chóng và dễ nhận biết",
      color: "from-yellow-400 to-orange-500",
    },
    {
      icon: "👥",
      title: "Phù hợp nhiều lứa tuổi",
      description:
        "Từ học sinh đến người đi làm, phù hợp với mọi lứa tuổi và trình độ",
      color: "from-green-400 to-blue-500",
    },
    {
      icon: "📈",
      title: "Mất gốc vẫn luyện được",
      description:
        "Dù bạn đã quên nhiều kiến thức, chúng tôi sẽ giúp bạn xây dựng lại từ đầu",
      color: "from-purple-400 to-pink-500",
    },
    {
      icon: "💻",
      title: "Học online dễ dàng",
      description:
        "Học mọi lúc, mọi nơi với nền tảng trực tuyến hiện đại và thân thiện",
      color: "from-blue-400 to-indigo-500",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % reasons.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const nextReason = () => {
    setCurrentIndex((prev) => (prev + 1) % reasons.length);
  };

  const prevReason = () => {
    setCurrentIndex((prev) => (prev - 1 + reasons.length) % reasons.length);
  };

  return (
    <div className="relative bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
      <div className="relative h-80 sm:h-64">
        {reasons.map((reason, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-all duration-500 transform ${
              index === currentIndex
                ? "opacity-100 translate-x-0"
                : index < currentIndex
                ? "opacity-0 -translate-x-full"
                : "opacity-0 translate-x-full"
            }`}
          >
            <div
              className={`h-full bg-gradient-to-br ${reason.color} p-8 text-white flex flex-col justify-center`}
            >
              <div className="text-center">
                <div className="text-5xl mb-4">{reason.icon}</div>
                <h3 className="text-2xl font-bold mb-4">{reason.title}</h3>
                <p className="text-lg opacity-95 leading-relaxed">
                  {reason.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation */}
      <div className="absolute inset-y-0 left-0 flex items-center">
        <button
          onClick={prevReason}
          className="ml-4 p-2 bg-white/20 hover:bg-white/30 rounded-full text-white transition-all duration-200 backdrop-blur-sm"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
      </div>

      <div className="absolute inset-y-0 right-0 flex items-center">
        <button
          onClick={nextReason}
          className="mr-4 p-2 bg-white/20 hover:bg-white/30 rounded-full text-white transition-all duration-200 backdrop-blur-sm"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>

      {/* Indicators */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {reasons.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full transition-all duration-200 ${
              index === currentIndex
                ? "bg-white scale-110"
                : "bg-white/50 hover:bg-white/70"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

// Component slideshow phương pháp
const MethodSlideshow = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const methods = [
    {
      icon: "🤖",
      title: "Ứng dụng công nghệ trí tuệ nhân tạo",
      description:
        "Sử dụng AI để cá nhân hóa trải nghiệm học tập cho từng học viên",
      color: "from-cyan-400 to-blue-600",
    },
    {
      icon: "👨‍🏫",
      title: "Thầy cô tận tình chỉ dạy",
      description:
        "Đội ngũ giáo viên giàu kinh nghiệm, luôn sẵn sàng hỗ trợ học viên",
      color: "from-emerald-400 to-teal-600",
    },
    {
      icon: "🎵",
      title: "Luyện từ nền tảng ghép âm",
      description: "Phương pháp ghép âm độc đáo giúp phát âm chuẩn từ cơ bản",
      color: "from-pink-400 to-rose-600",
    },
    {
      icon: "🔄",
      title: "Luyện tập nghe nói liên tục",
      description:
        "Thực hành nhiều lần để tạo phản xạ tự nhiên trong giao tiếp",
      color: "from-orange-400 to-red-600",
    },
    {
      icon: "😊",
      title: "Không áp lực, không stress",
      description:
        "Học tập thoải mái, không bắt phải suy nghĩ hay áp lực bài tập",
      color: "from-violet-400 to-purple-600",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % methods.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const nextMethod = () => {
    setCurrentIndex((prev) => (prev + 1) % methods.length);
  };

  const prevMethod = () => {
    setCurrentIndex((prev) => (prev - 1 + methods.length) % methods.length);
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
      <div className="relative h-80 sm:h-64">
        <div
          className={`h-full bg-gradient-to-br ${methods[currentIndex].color} p-8 text-white flex flex-col justify-center transition-all duration-700`}
        >
          <div className="text-center">
            <div className="text-5xl mb-4 animate-bounce">
              {methods[currentIndex].icon}
            </div>
            <h3 className="text-2xl font-bold mb-4">
              {methods[currentIndex].title}
            </h3>
            <p className="text-lg opacity-95 leading-relaxed">
              {methods[currentIndex].description}
            </p>
          </div>
        </div>
      </div>

      {/* Control Buttons */}
      <div className="p-4 bg-gray-50 flex items-center justify-between">
        <button
          onClick={prevMethod}
          className="flex items-center space-x-2 px-4 py-2 bg-white hover:bg-gray-100 rounded-lg shadow-sm transition-all duration-200 text-gray-700"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          <span>Trước</span>
        </button>

        {/* Method Indicators */}
        <div className="flex space-x-2">
          {methods.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-3 h-3 rounded-full transition-all duration-200 ${
                index === currentIndex
                  ? "bg-blue-600 scale-110"
                  : "bg-gray-300 hover:bg-gray-400"
              }`}
            />
          ))}
        </div>

        <button
          onClick={nextMethod}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm transition-all duration-200"
        >
          <span>Sau</span>
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
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
      icon: "👁️",
      title: "Trăm nghe không bằng một thấy",
      description:
        "Châm ngôn của chúng tôi luôn là trăm nghe không bằng một thấy. Trăm thấy không bằng một thử.",
      color: "from-indigo-500 to-purple-600",
    },
    {
      icon: "🎁",
      title: "Trải nghiệm miễn phí",
      description:
        "Hãy tham gia khóa học miễn phí 4 buổi để được trải nghiệm phương pháp của chúng tôi.",
      color: "from-green-500 to-teal-600",
    },
  ];

  const toggleTrust = () => {
    setCurrentIndex((prev) => (prev + 1) % trustPoints.length);
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
      <div
        className={`bg-gradient-to-br ${trustPoints[currentIndex].color} p-8 text-white`}
      >
        <div className="text-center">
          <div className="text-6xl mb-6">{trustPoints[currentIndex].icon}</div>
          <h3 className="text-2xl font-bold mb-4">
            {trustPoints[currentIndex].title}
          </h3>
          <p className="text-lg opacity-95 leading-relaxed mb-6">
            {trustPoints[currentIndex].description}
          </p>

          <button
            onClick={toggleTrust}
            className="bg-white/20 hover:bg-white/30 text-white font-semibold py-3 px-6 rounded-lg backdrop-blur-sm transition-all duration-300 hover:scale-105"
          >
            {currentIndex === 0
              ? "Xem trải nghiệm miễn phí"
              : "Quay lại châm ngôn"}
          </button>
        </div>
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

      // Mô phỏng API call thành công cho demo
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setSubmitted(true);
      setPhoneNumber("");
    } catch (error) {
      console.error("Lỗi khi đăng ký:", error);
      setSubmitted(true);
      setPhoneNumber("");
    }
    setIsSubmitting(false);
  };

  if (submitted) {
    return (
      <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-2xl p-8 text-center border border-green-200 shadow-lg">
        <div className="text-6xl mb-4">✅</div>
        <h3 className="text-2xl font-bold text-green-800 mb-4">
          Đăng ký thành công!
        </h3>
        <p className="text-green-700 mb-6 leading-relaxed">
          Chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất để tư vấn về
          khóa học.
        </p>
        <button
          onClick={() => setSubmitted(false)}
          className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 hover:scale-105"
        >
          Đăng ký thêm
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-8 shadow-lg border border-blue-200">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-gray-800 mb-2">
          📞 Đăng ký tư vấn
        </h3>
        <p className="text-gray-600">
          Để lại thông tin, chúng tôi sẽ liên hệ ngay
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <input
            type="tel"
            placeholder="Nhập số điện thoại của bạn"
            value={phoneNumber}
            onChange={(e) =>
              setPhoneNumber(e.target.value.replace(/[^0-9]/g, ""))
            }
            disabled={isSubmitting}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-all duration-200 text-lg"
            maxLength="11"
          />
        </div>

        {phoneNumber && (
          <div className="bg-white/70 rounded-lg p-3 border border-blue-200">
            <p className="text-sm text-gray-600">Xác nhận số điện thoại:</p>
            <p className="font-semibold text-blue-700 text-lg">{phoneNumber}</p>
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={isSubmitting || !phoneNumber.trim()}
          className={`w-full py-4 rounded-lg font-semibold text-lg transition-all duration-300 ${
            isSubmitting || !phoneNumber.trim()
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white hover:scale-105 shadow-lg"
          }`}
        >
          {isSubmitting ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              <span>Đang gửi...</span>
            </div>
          ) : (
            "🚀 Gửi thông tin đăng ký"
          )}
        </button>

        <p className="text-xs text-gray-500 text-center">
          🔒 Chúng tôi cam kết bảo mật thông tin cá nhân của bạn
        </p>
      </div>
    </div>
  );
};

// Component chính
const EnglishLandingPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Bạn đang tìm một cách học
              <span className="text-yellow-400"> tiếng Anh </span>
              thật sự hiệu quả?
            </h1>
            <p className="text-xl md:text-2xl opacity-90 mb-8">
              Khám phá phương pháp học độc đáo giúp bạn nói tiếng Anh tự nhiên
            </p>
            <div className="inline-flex items-center space-x-2 bg-white/10 rounded-full px-6 py-3 backdrop-blur-sm">
              <span className="text-lg">✨</span>
              <span className="font-medium">
                Kết quả thấy rõ chỉ sau vài buổi học
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Video Section 1 */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              🎯 Kết quả trực quan trong thời gian ngắn
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Xem những video thực tế về tiến bộ của học viên sau khi học với
              phương pháp của chúng tôi
            </p>
          </div>
          <div className="max-w-4xl mx-auto">
            <VideoSlideshow
              playlistId="PLC0acE0qMKOkXtgSnKc9uhj6Ekj-8VDo5"
              title="Kết quả học viên"
            />
          </div>
        </div>
      </div>

      {/* Why Choose Us Section */}
      <div className="py-16 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              🤔 Tại sao lại chọn chúng tôi?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Những ưu điểm vượt trội khiến hàng nghìn học viên tin tưởng lựa
              chọn
            </p>
          </div>
          <div className="max-w-4xl mx-auto">
            <ReasonSlideshow />
          </div>
        </div>
      </div>

      {/* Video Section 2 */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              🎵 HƯỚNG DẪN GHÉP ÂM CHI TIẾT TẬN TÂM
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Phương pháp ghép âm độc đáo được giảng dạy chi tiết, dễ hiểu
            </p>
          </div>
          <div className="max-w-4xl mx-auto">
            <VideoSlideshow
              playlistId="PLC0acE0qMKOlNOu-mq4kE0gOt6v83RjrS"
              title="Hướng dẫn ghép âm"
            />
          </div>
        </div>
      </div>

      {/* Method Section */}
      <div className="py-16 bg-gradient-to-br from-indigo-50 to-purple-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              🚀 Tại sao chúng tôi giúp các học viên tiến bộ trong việc nghe nói
              tiếng Anh thực sự?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Khám phá 5 phương pháp độc đáo giúp bạn học tiếng Anh hiệu quả
            </p>
          </div>
          <div className="max-w-4xl mx-auto">
            <MethodSlideshow />
          </div>
        </div>
      </div>

      {/* Trust Section */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              🤝 Làm sao để tin tưởng được?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Chúng tôi tin vào chất lượng và muốn bạn trải nghiệm trước khi
              quyết định
            </p>
          </div>
          <div className="max-w-2xl mx-auto">
            <TrustSlideshow />
          </div>
        </div>
      </div>

      {/* Registration Section */}
      <div className="py-16 bg-gradient-to-br from-blue-600 to-indigo-700">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              📞 Để lại số điện thoại, chúng tôi sẽ liên hệ bạn
            </h2>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              Nhận tư vấn miễn phí và trải nghiệm khóa học ngay hôm nay
            </p>
          </div>
          <div className="max-w-lg mx-auto">
            <RegistrationForm />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400">
            © 2025 Khóa học tiếng Anh hiệu quả - Liên hệ ngay để được tư vấn
            miễn phí
          </p>
        </div>
      </div>
    </div>
  );
};

export default EnglishLandingPage;
