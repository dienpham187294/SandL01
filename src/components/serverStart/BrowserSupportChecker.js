import React, { useState, useEffect, useCallback } from "react";
import LinkAPI from "../../ulti/T0_linkApi";
// ===== WEB AUDIO API & MEDIARECORDER SUPPORT CHECKER FOR REACT =====
/**
 * Kiểm tra tính hỗ trợ của các API cần thiết
 * @returns {Object} Kết quả kiểm tra support
 */
const checkBrowserSupport = () => {
  const support = {
    webAudioAPI: false,
    mediaRecorder: false,
    speechSynthesis: false,
    getUserMedia: false,
    isSecureContext: false,
    isLocalhost: false,
    browserInfo: {},
    recommendations: [],
  };

  // Kiểm tra thông tin browser
  const userAgent = navigator.userAgent;
  support.browserInfo = {
    userAgent: userAgent,
    isChrome: /Chrome/.test(userAgent) && !/Edge/.test(userAgent),
    isFirefox: /Firefox/.test(userAgent),
    isSafari: /Safari/.test(userAgent) && !/Chrome/.test(userAgent),
    isEdge: /Edge/.test(userAgent),
    isMobile: /Mobile|Android|iPhone|iPad/.test(userAgent),
  };

  // 1. Kiểm tra Web Audio API
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) {
      support.webAudioAPI = true;
      console.log("✅ Web Audio API: Supported");
    } else {
      console.log("❌ Web Audio API: Not supported");
      support.recommendations.push(
        "Cập nhật browser lên phiên bản mới hơn để hỗ trợ Web Audio API"
      );
    }
  } catch (error) {
    console.log("❌ Web Audio API: Error -", error.message);
  }

  // 2. Kiểm tra MediaRecorder
  try {
    if (typeof MediaRecorder !== "undefined") {
      support.mediaRecorder = true;
      console.log("✅ MediaRecorder: Supported");

      // Kiểm tra các codec hỗ trợ
      const supportedTypes = [
        "audio/webm",
        "audio/webm;codecs=opus",
        "audio/mp4",
        "audio/mp4;codecs=mp4a.40.2",
        "audio/wav",
      ];
      console.log("📋 Supported MIME types:");
      supportedTypes.forEach((type) => {
        if (MediaRecorder.isTypeSupported(type)) {
          console.log(`  ✅ ${type}`);
        } else {
          console.log(`  ❌ ${type}`);
        }
      });
    } else {
      console.log("❌ MediaRecorder: Not supported");
      support.recommendations.push("Browser không hỗ trợ MediaRecorder API");
    }
  } catch (error) {
    console.log("❌ MediaRecorder: Error -", error.message);
  }

  // 3. Kiểm tra Speech Synthesis
  try {
    if ("speechSynthesis" in window) {
      support.speechSynthesis = true;
      console.log("✅ Speech Synthesis: Supported");
    } else {
      console.log("❌ Speech Synthesis: Not supported");
    }
  } catch (error) {
    console.log("❌ Speech Synthesis: Error -", error.message);
  }

  // 4. Kiểm tra getUserMedia (để capture audio)
  try {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      support.getUserMedia = true;
      console.log("✅ getUserMedia: Supported");
    } else {
      console.log("❌ getUserMedia: Not supported");
    }
  } catch (error) {
    console.log("❌ getUserMedia: Error -", error.message);
  }

  // 5. Kiểm tra Secure Context (HTTPS/localhost)
  support.isSecureContext = window.isSecureContext;
  support.isLocalhost =
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1" ||
    window.location.hostname === "::1";

  if (support.isSecureContext) {
    console.log("✅ Secure Context: OK (HTTPS hoặc localhost)");
  } else {
    console.log("❌ Secure Context: Cần HTTPS hoặc localhost");
    support.recommendations.push(
      "Sử dụng HTTPS hoặc localhost để access MediaRecorder API"
    );
  }

  console.log(`🏠 Is Localhost: ${support.isLocalhost ? "Yes" : "No"}`);
  console.log(`🔒 Protocol: ${window.location.protocol}`);

  return support;
};

/**
 * Buffer analysis utilities
 */
const analyzeBuffer = (buffer) => {
  if (!buffer || buffer.length === 0) {
    return {
      size: 0,
      isEmpty: true,
      hasAudioData: false,
      preview: "",
      stats: null,
    };
  }

  // Check if buffer has meaningful audio data (not all zeros)
  const nonZeroCount = buffer.filter((byte) => byte !== 0).length;
  const hasAudioData = nonZeroCount > buffer.length * 0.1; // At least 10% non-zero

  // Generate hex preview (first 32 bytes)
  const previewBytes = buffer.slice(0, 32);
  const hexPreview = Array.from(previewBytes)
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join(" ");

  // Basic statistics
  const stats = {
    totalBytes: buffer.length,
    nonZeroBytes: nonZeroCount,
    zeroBytes: buffer.length - nonZeroCount,
    nonZeroPercentage: ((nonZeroCount / buffer.length) * 100).toFixed(2),
    averageValue: buffer.reduce((sum, byte) => sum + byte, 0) / buffer.length,
    maxValue: Math.max(...buffer),
    minValue: Math.min(...buffer),
  };

  return {
    size: buffer.length,
    isEmpty: buffer.length === 0,
    hasAudioData,
    preview: hexPreview,
    stats,
    buffer: buffer,
  };
};

/**
 * Function to send buffer to server
 */
const sendBufferToServer = async (buffer, text, metadata = {}) => {
  try {
    console.log("📤 Sending buffer to server...", {
      bufferSize: buffer.length,
      text: text.substring(0, 50) + (text.length > 50 ? "..." : ""),
      metadata,
    });

    // Convert Uint8Array to regular Array for JSON
    const bufferArray = Array.from(buffer);

    const response = await fetch(LinkAPI + "buffer", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        buffer: bufferArray,
        text: text,
        metadata: {
          timestamp: new Date().toISOString(),
          size: buffer.length,
          type: "audio/webm",
          ...metadata,
        },
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result.message || `HTTP error! status: ${response.status}`
      );
    }

    console.log("✅ Buffer sent successfully:", result);
    return result;
  } catch (error) {
    console.error("❌ Error sending buffer to server:", error);
    throw error;
  }
};

/**
 * Web Audio solution cho TTS với buffer capture - Improved version
 */
const webAudioTTSSolution = async (text, voiceConfig = {}) => {
  console.log("🎵 Using Web Audio TTS solution - Improved");

  try {
    // Tạo AudioContext
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const audioContext = new AudioContext();

    // Resume AudioContext nếu bị suspended
    if (audioContext.state === "suspended") {
      await audioContext.resume();
    }

    // Tạo một oscillator để tạo silent audio stream
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    // Set gain to 0 để tạo silent stream
    gainNode.gain.setValueAtTime(0, audioContext.currentTime);

    // Connect nodes
    oscillator.connect(gainNode);

    // Tạo MediaStream destination
    const destination = audioContext.createMediaStreamDestination();
    gainNode.connect(destination);

    // Start silent oscillator
    oscillator.start();

    // Determine best MIME type
    let mimeType = "audio/webm;codecs=opus";
    if (!MediaRecorder.isTypeSupported(mimeType)) {
      mimeType = "audio/webm";
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = "audio/mp4";
        if (!MediaRecorder.isTypeSupported(mimeType)) {
          mimeType = ""; // Let browser choose
        }
      }
    }

    const mediaRecorder = new MediaRecorder(
      destination.stream,
      mimeType ? { mimeType } : undefined
    );

    const audioChunks = [];
    let recordingStarted = false;

    mediaRecorder.ondataavailable = (event) => {
      console.log("Data available:", event.data.size, "bytes");
      if (event.data.size > 0) {
        audioChunks.push(event.data);
      }
    };

    return new Promise((resolve, reject) => {
      let timeoutId;

      mediaRecorder.onstop = async () => {
        try {
          console.log("MediaRecorder stopped. Chunks:", audioChunks.length);

          if (audioChunks.length === 0) {
            throw new Error("No audio data captured");
          }

          const audioBlob = new Blob(audioChunks, {
            type: mimeType || "audio/webm",
          });

          console.log("Created blob size:", audioBlob.size, "bytes");

          if (audioBlob.size === 0) {
            throw new Error("Audio blob is empty");
          }

          const arrayBuffer = await audioBlob.arrayBuffer();
          const audioBuffer = new Uint8Array(arrayBuffer);
          const url = URL.createObjectURL(audioBlob);

          // Analyze buffer
          const bufferAnalysis = analyzeBuffer(audioBuffer);
          console.log("Buffer analysis:", bufferAnalysis);

          // Clean up
          oscillator.stop();
          await audioContext.close();

          resolve({
            success: true,
            buffer: audioBuffer,
            blob: audioBlob,
            size: audioBuffer.length,
            type: mimeType || "webm",
            url: url,
            analysis: bufferAnalysis,
          });
        } catch (error) {
          console.error("Error in onstop:", error);
          oscillator.stop();
          await audioContext.close();
          reject({ success: false, error: error.message });
        }
      };

      mediaRecorder.onerror = (error) => {
        console.error("MediaRecorder error:", error);
        oscillator.stop();
        audioContext.close();
        if (timeoutId) clearTimeout(timeoutId);
        reject({ success: false, error: error.message });
      };

      // Start recording
      try {
        mediaRecorder.start(100); // Collect data every 100ms
        recordingStarted = true;
        console.log("Recording started");

        // Tạo Speech Synthesis utterance
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = voiceConfig.rate || 0.8;
        utterance.pitch = voiceConfig.pitch || 1;
        utterance.volume = voiceConfig.volume || 1;

        // Chọn giọng tiếng Anh
        const voices = speechSynthesis.getVoices();
        const englishVoice = voices.find(
          (voice) =>
            voice.lang.startsWith("en") || voice.name.includes("English")
        );
        if (englishVoice) {
          utterance.voice = englishVoice;
        }

        utterance.onstart = () => {
          console.log("Speech started");
        };

        utterance.onend = () => {
          console.log("Speech ended");
          // Dừng recording sau khi speech kết thúc
          setTimeout(() => {
            if (mediaRecorder.state === "recording") {
              console.log("Stopping recording...");
              mediaRecorder.stop();
            }
          }, 800); // Increased delay to ensure we capture the end
        };

        utterance.onerror = (error) => {
          console.error("Speech synthesis error:", error);
          if (mediaRecorder.state === "recording") {
            mediaRecorder.stop();
          }
          if (timeoutId) clearTimeout(timeoutId);
          reject({ success: false, error: error.message });
        };

        // Safety timeout
        timeoutId = setTimeout(() => {
          console.warn("Recording timeout");
          if (mediaRecorder.state === "recording") {
            mediaRecorder.stop();
          }
        }, 15000); // 15 second timeout

        // Phát speech
        console.log("Starting speech synthesis");
        speechSynthesis.speak(utterance);
      } catch (error) {
        console.error("Error starting recording:", error);
        oscillator.stop();
        audioContext.close();
        reject({ success: false, error: error.message });
      }
    });
  } catch (error) {
    console.error("Web Audio TTS Error:", error);
    throw error;
  }
};

/**
 * Simple TTS solution (chỉ phát âm thanh, không capture buffer)
 */
const simpleTTSSolution = async (text, voiceConfig = {}) => {
  console.log("🔊 Using Simple TTS solution");

  return new Promise((resolve, reject) => {
    try {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = voiceConfig.rate || 0.8;
      utterance.pitch = voiceConfig.pitch || 1;
      utterance.volume = voiceConfig.volume || 1;

      // Chọn giọng tiếng Anh
      const voices = speechSynthesis.getVoices();
      const englishVoice = voices.find(
        (voice) => voice.lang.startsWith("en") || voice.name.includes("English")
      );
      if (englishVoice) {
        utterance.voice = englishVoice;
      }

      utterance.onend = () => {
        resolve({
          success: true,
          message: "Speech synthesis completed",
          hasBuffer: false,
        });
      };

      utterance.onerror = (error) => {
        reject({ success: false, error: error.message });
      };

      speechSynthesis.speak(utterance);
    } catch (error) {
      reject({ success: false, error: error.message });
    }
  });
};

// Main React Component
const BrowserSupportTTSDemo = () => {
  const [support, setSupport] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [testResults, setTestResults] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const [bufferData, setBufferData] = useState(null);
  const [serverResponse, setServerResponse] = useState(null);

  // Sample English texts for testing
  const sampleTexts = [
    "Hello world! This is a test of text to speech functionality.",
    "The quick brown fox jumps over the lazy dog. This pangram contains every letter of the alphabet.",
  ];

  // Initialize browser support check
  useEffect(() => {
    const checkSupport = async () => {
      try {
        const supportResult = checkBrowserSupport();
        setSupport(supportResult);
      } catch (error) {
        console.error("Error checking browser support:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkSupport();
  }, []);

  // Test function for buffer generation with server upload
  const testBufferGeneration = async (textIndex) => {
    setIsProcessing(true);
    setAudioUrl(null);
    setBufferData(null);
    setServerResponse(null);

    const text = sampleTexts[textIndex];
    const timestamp = new Date().toLocaleTimeString();

    try {
      if (
        support?.webAudioAPI &&
        support?.mediaRecorder &&
        support?.speechSynthesis
      ) {
        console.log("Attempting Web Audio solution...");

        try {
          // Try improved Web Audio solution first
          const result = await webAudioTTSSolution(text);

          setTestResults((prev) => [
            ...prev,
            {
              timestamp,
              text,
              method: "Web Audio + Buffer (Improved)",
              success: result.success,
              bufferSize: result.size,
              type: result.type,
              error: result.error,
              analysis: result.analysis,
            },
          ]);

          if (result.success && result.url) {
            setAudioUrl(result.url);
            setBufferData(result.analysis);

            // Send buffer to server
            try {
              const serverResult = await sendBufferToServer(
                result.buffer,
                text,
                {
                  method: "Web Audio + Buffer",
                  testIndex: textIndex,
                  mimeType: result.type,
                }
              );
              setServerResponse(serverResult);
            } catch (serverError) {
              console.error("Failed to send buffer to server:", serverError);
              setServerResponse({ success: false, error: serverError.message });
            }
            return; // Success, exit early
          }
        } catch (webAudioError) {
          console.warn("Web Audio solution failed:", webAudioError.message);
        }
      }

      // Fallback to simple TTS
      console.log("Using simple TTS fallback...");
      const result = await simpleTTSSolution(text);

      setTestResults((prev) => [
        ...prev,
        {
          timestamp,
          text,
          method: "Simple TTS (Fallback)",
          success: result.success,
          hasBuffer: result.hasBuffer,
          message: result.message,
          error: result.error,
        },
      ]);
    } catch (error) {
      console.error("All TTS methods failed:", error);
      setTestResults((prev) => [
        ...prev,
        {
          timestamp,
          text,
          method: "All Methods Failed",
          success: false,
          error: error.message || "Unknown error",
        },
      ]);
    } finally {
      setIsProcessing(false);
    }
  };

  // Create audio from custom text with server upload
  const createCustomAudio = async () => {
    const customText = document.getElementById("customText").value.trim();
    if (!customText) {
      alert("Please enter some text first!");
      return;
    }

    setIsProcessing(true);
    setAudioUrl(null);
    setBufferData(null);
    setServerResponse(null);

    const timestamp = new Date().toLocaleTimeString();

    try {
      if (support?.speechSynthesis) {
        if (support?.webAudioAPI && support?.mediaRecorder) {
          try {
            // Try improved Web Audio solution
            const result = await webAudioTTSSolution(customText);

            setTestResults((prev) => [
              ...prev,
              {
                timestamp,
                text: customText,
                method: "Custom Web Audio + Buffer (Improved)",
                success: result.success,
                bufferSize: result.size,
                type: result.type,
                error: result.error,
                analysis: result.analysis,
              },
            ]);

            if (result.success && result.url) {
              setAudioUrl(result.url);
              setBufferData(result.analysis);

              // Send buffer to server
              try {
                const serverResult = await sendBufferToServer(
                  result.buffer,
                  customText,
                  {
                    method: "Custom Web Audio + Buffer",
                    isCustom: true,
                    mimeType: result.type,
                  }
                );
                setServerResponse(serverResult);
              } catch (serverError) {
                console.error(
                  "Failed to send custom buffer to server:",
                  serverError
                );
                setServerResponse({
                  success: false,
                  error: serverError.message,
                });
              }
              return;
            }
          } catch (webAudioError) {
            console.warn("Custom Web Audio failed:", webAudioError.message);
          }
        }

        // Simple TTS fallback
        const result = await simpleTTSSolution(customText);

        setTestResults((prev) => [
          ...prev,
          {
            timestamp,
            text: customText,
            method: "Custom Simple TTS (Fallback)",
            success: result.success,
            hasBuffer: false,
            message: result.message,
            error: result.error,
          },
        ]);
      } else {
        throw new Error("Speech Synthesis not supported");
      }
    } catch (error) {
      setTestResults((prev) => [
        ...prev,
        {
          timestamp,
          text: customText,
          method: "Custom Failed",
          success: false,
          error: error.message || "Unknown error",
        },
      ]);
    } finally {
      setIsProcessing(false);
    }
  };

  const clearResults = () => {
    setTestResults([]);
    setAudioUrl(null);
    setBufferData(null);
    setServerResponse(null);
  };

  if (isLoading) {
    return (
      <div className="p-8 text-center">Loading browser support check...</div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="bg-blue-50 rounded-lg p-6">
        <h1 className="text-2xl font-bold text-blue-900 mb-4">
          🔊 Browser Support & TTS Demo with Server Upload
        </h1>

        {/* Browser Support Status */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div
            className={`p-3 rounded ${
              support?.webAudioAPI ? "bg-green-100" : "bg-red-100"
            }`}
          >
            <div className="font-semibold">Web Audio API</div>
            <div className="text-sm">
              {support?.webAudioAPI ? "✅ Supported" : "❌ Not supported"}
            </div>
          </div>
          <div
            className={`p-3 rounded ${
              support?.mediaRecorder ? "bg-green-100" : "bg-red-100"
            }`}
          >
            <div className="font-semibold">MediaRecorder</div>
            <div className="text-sm">
              {support?.mediaRecorder ? "✅ Supported" : "❌ Not supported"}
            </div>
          </div>
          <div
            className={`p-3 rounded ${
              support?.speechSynthesis ? "bg-green-100" : "bg-red-100"
            }`}
          >
            <div className="font-semibold">Speech Synthesis</div>
            <div className="text-sm">
              {support?.speechSynthesis ? "✅ Supported" : "❌ Not supported"}
            </div>
          </div>
          <div
            className={`p-3 rounded ${
              support?.isSecureContext ? "bg-green-100" : "bg-red-100"
            }`}
          >
            <div className="font-semibold">Secure Context</div>
            <div className="text-sm">
              {support?.isSecureContext
                ? "✅ HTTPS/Localhost"
                : "❌ Need HTTPS"}
            </div>
          </div>
        </div>

        {/* Test Buttons */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">
            Test TTS with Buffer Generation & Server Upload
          </h2>

          <div className="flex gap-4 flex-wrap">
            <button
              onClick={() => testBufferGeneration(0)}
              disabled={isProcessing}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? "Processing..." : 'Test 1: "Hello World"'}
            </button>

            <button
              onClick={() => testBufferGeneration(1)}
              disabled={isProcessing}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? "Processing..." : 'Test 2: "Quick Brown Fox"'}
            </button>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-semibold">
              Create Custom Audio & Upload
            </h3>
            <div className="flex gap-2">
              <input
                id="customText"
                type="text"
                placeholder="Enter English text to convert to speech..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                defaultValue="This is a custom text to speech example."
              />
              <button
                onClick={createCustomAudio}
                disabled={isProcessing}
                className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? "Creating..." : "Create & Upload"}
              </button>
            </div>
          </div>

          {/* Server Response Display */}
          {serverResponse && (
            <div
              className={`p-4 rounded-lg ${
                serverResponse.success
                  ? "bg-green-50 border border-green-200"
                  : "bg-red-50 border border-red-200"
              }`}
            >
              <h3
                className={`text-lg font-semibold mb-2 ${
                  serverResponse.success ? "text-green-800" : "text-red-800"
                }`}
              >
                {serverResponse.success
                  ? "✅ Server Upload Success!"
                  : "❌ Server Upload Failed"}
              </h3>

              {serverResponse.success ? (
                <div className="text-sm space-y-1">
                  <div>
                    <strong>Filename:</strong> {serverResponse.filename}
                  </div>
                  <div>
                    <strong>File Size:</strong> {serverResponse.fileSize} bytes
                  </div>
                  <div>
                    <strong>File Path:</strong> {serverResponse.filePath}
                  </div>
                  <div>
                    <strong>Processing Time:</strong>{" "}
                    {serverResponse.processingTime}ms
                  </div>
                  {serverResponse.playUrl && (
                    <div>
                      <strong>Play URL:</strong>{" "}
                      <a
                        href={serverResponse.playUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        Play Audio
                      </a>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-sm text-red-700">
                  Error: {serverResponse.error}
                </div>
              )}
            </div>
          )}

          {audioUrl && (
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-green-800 mb-2">
                ✅ Audio Generated Successfully!
              </h3>
              <audio controls className="w-full">
                <source src={audioUrl} type="audio/webm" />
                Your browser does not support the audio element.
              </audio>
              <div className="mt-2 text-sm text-green-700">
                Audio buffer has been generated and is playable above.
              </div>
            </div>
          )}

          {/* Buffer Analysis Display */}
          {bufferData && (
            <div className="bg-blue-50 p-4 rounded-lg mt-4">
              <h3 className="text-lg font-semibold text-blue-800 mb-3">
                🔍 Buffer Analysis
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="bg-white p-3 rounded">
                  <h4 className="font-semibold mb-2">Basic Info</h4>
                  <div className="text-sm space-y-1">
                    <div>
                      <strong>Size:</strong> {bufferData.size} bytes
                    </div>
                    <div>
                      <strong>Empty:</strong>{" "}
                      {bufferData.isEmpty ? "❌ Yes" : "✅ No"}
                    </div>
                    <div>
                      <strong>Has Audio Data:</strong>{" "}
                      {bufferData.hasAudioData ? "✅ Yes" : "❌ No"}
                    </div>
                  </div>
                </div>

                {bufferData.stats && (
                  <div className="bg-white p-3 rounded">
                    <h4 className="font-semibold mb-2">Statistics</h4>
                    <div className="text-sm space-y-1">
                      <div>
                        <strong>Non-zero bytes:</strong>{" "}
                        {bufferData.stats.nonZeroBytes} (
                        {bufferData.stats.nonZeroPercentage}%)
                      </div>
                      <div>
                        <strong>Average value:</strong>{" "}
                        {bufferData.stats.averageValue.toFixed(2)}
                      </div>
                      <div>
                        <strong>Range:</strong> {bufferData.stats.minValue} -{" "}
                        {bufferData.stats.maxValue}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Hex Preview */}
              <div className="bg-white p-3 rounded mb-4">
                <h4 className="font-semibold mb-2">
                  Hex Preview (first 32 bytes)
                </h4>
                <div className="font-mono text-xs bg-gray-100 p-2 rounded overflow-x-auto">
                  {bufferData.preview || "No data"}
                </div>
              </div>
            </div>
          )}

          {/* Debug Panel */}
          <div className="mt-4 bg-yellow-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-yellow-800 mb-2">
              🔧 Debug Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <strong>Supported MIME Types:</strong>
                <div className="mt-1 text-xs">
                  {[
                    "audio/webm;codecs=opus",
                    "audio/webm",
                    "audio/mp4",
                    "audio/wav",
                  ].map((type) => (
                    <div
                      key={type}
                      className={`${
                        window.MediaRecorder &&
                        MediaRecorder.isTypeSupported(type)
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {type}:{" "}
                      {window.MediaRecorder &&
                      MediaRecorder.isTypeSupported(type)
                        ? "✅"
                        : "❌"}
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <strong>Current Environment:</strong>
                <div className="mt-1 text-xs space-y-1">
                  <div>Protocol: {window.location.protocol}</div>
                  <div>Host: {window.location.host}</div>
                  <div>
                    User Agent: {navigator.userAgent.substring(0, 50)}...
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-3">
              <button
                onClick={() => {
                  console.clear();
                  console.log("=== TTS Debug Test ===");
                  console.log("Support status:", support);
                  console.log(
                    "Available voices:",
                    speechSynthesis.getVoices().length
                  );
                  console.log("MediaRecorder support:", !!window.MediaRecorder);
                  console.log(
                    "AudioContext support:",
                    !!(window.AudioContext || window.webkitAudioContext)
                  );
                }}
                className="px-3 py-1 bg-yellow-600 text-white rounded hover:bg-yellow-700 text-sm"
              >
                Run Debug Console Test
              </button>
            </div>
          </div>
        </div>

        {/* Results Display */}
        {testResults.length > 0 && (
          <div className="mt-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Test Results</h2>
              <button
                onClick={clearResults}
                className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 text-sm"
              >
                Clear Results
              </button>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {testResults.map((result, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border ${
                    result.success
                      ? "bg-green-50 border-green-200"
                      : "bg-red-50 border-red-200"
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-semibold">{result.method}</span>
                    <span className="text-sm text-gray-500">
                      {result.timestamp}
                    </span>
                  </div>

                  <div className="text-sm mb-2">
                    <strong>Text:</strong>{" "}
                    {result.text.length > 50
                      ? result.text.substring(0, 50) + "..."
                      : result.text}
                  </div>

                  {result.success ? (
                    <div className="text-sm text-green-700">
                      ✅ Success
                      {result.bufferSize && (
                        <div>Buffer Size: {result.bufferSize} bytes</div>
                      )}
                      {result.type && <div>Type: {result.type}</div>}
                      {result.message && <div>{result.message}</div>}
                      {result.hasBuffer === false && (
                        <div>⚠️ No buffer captured (audio played directly)</div>
                      )}
                      {result.analysis && (
                        <div className="mt-1 p-2 bg-green-100 rounded text-xs">
                          <div>
                            <strong>Buffer Analysis:</strong>
                          </div>
                          <div>
                            • Has audio data:{" "}
                            {result.analysis.hasAudioData ? "✅ Yes" : "❌ No"}
                          </div>
                          <div>
                            • Non-zero bytes:{" "}
                            {result.analysis.stats?.nonZeroPercentage || 0}%
                          </div>
                          <div>
                            • Hex preview:{" "}
                            {result.analysis.preview?.substring(0, 30) || "N/A"}
                            ...
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-sm text-red-700">
                      ❌ Error: {result.error}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Browser Info */}
        {support?.browserInfo && (
          <div className="mt-6 bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Browser Information</h3>
            <div className="text-sm space-y-1">
              <div>
                <strong>Is Chrome:</strong>{" "}
                {support.browserInfo.isChrome ? "Yes" : "No"}
              </div>
              <div>
                <strong>Is Firefox:</strong>{" "}
                {support.browserInfo.isFirefox ? "Yes" : "No"}
              </div>
              <div>
                <strong>Is Safari:</strong>{" "}
                {support.browserInfo.isSafari ? "Yes" : "No"}
              </div>
              <div>
                <strong>Is Mobile:</strong>{" "}
                {support.browserInfo.isMobile ? "Yes" : "No"}
              </div>
              <div>
                <strong>Is Localhost:</strong>{" "}
                {support.isLocalhost ? "Yes" : "No"}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BrowserSupportTTSDemo;
