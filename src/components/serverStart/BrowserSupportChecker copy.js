import React, { useState, useEffect } from "react";

// Mock LinkAPI cho demo
const LinkAPI = "https://your-server.com/api/";

// Web RTC Audio Capture Solution
const captureSystemAudio = async (text, voiceConfig = {}) => {
  console.log("🎤 Using System Audio Capture solution");

  try {
    // Request system audio capture (chỉ hoạt động trên một số browser)
    const stream = await navigator.mediaDevices.getDisplayMedia({
      video: false,
      audio: {
        echoCancellation: false,
        noiseSuppression: false,
        sampleRate: 44100,
      },
    });

    const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
      ? "audio/webm;codecs=opus"
      : "audio/webm";

    const mediaRecorder = new MediaRecorder(stream, { mimeType });
    const audioChunks = [];

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        audioChunks.push(event.data);
        console.log("📦 Audio chunk captured:", event.data.size, "bytes");
      }
    };

    return new Promise((resolve, reject) => {
      mediaRecorder.onstop = async () => {
        try {
          stream.getTracks().forEach((track) => track.stop());

          if (audioChunks.length === 0) {
            throw new Error("No audio data captured");
          }

          const audioBlob = new Blob(audioChunks, { type: mimeType });
          const arrayBuffer = await audioBlob.arrayBuffer();
          const audioBuffer = new Uint8Array(arrayBuffer);
          const url = URL.createObjectURL(audioBlob);

          resolve({
            success: true,
            buffer: audioBuffer,
            blob: audioBlob,
            size: audioBuffer.length,
            type: mimeType,
            url: url,
          });
        } catch (error) {
          reject({ success: false, error: error.message });
        }
      };

      mediaRecorder.onerror = (error) => {
        stream.getTracks().forEach((track) => track.stop());
        reject({ success: false, error: error.message });
      };

      // Start recording
      mediaRecorder.start(100);

      // Create and play TTS
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = voiceConfig.rate || 0.8;
      utterance.pitch = voiceConfig.pitch || 1;
      utterance.volume = voiceConfig.volume || 1;

      const voices = speechSynthesis.getVoices();
      const englishVoice = voices.find(
        (voice) => voice.lang.startsWith("en") || voice.name.includes("English")
      );
      if (englishVoice) utterance.voice = englishVoice;

      utterance.onend = () => {
        console.log("🗣️ Speech ended, stopping recording...");
        setTimeout(() => {
          if (mediaRecorder.state === "recording") {
            mediaRecorder.stop();
          }
        }, 1000);
      };

      utterance.onerror = (error) => {
        console.error("Speech error:", error);
        if (mediaRecorder.state === "recording") {
          mediaRecorder.stop();
        }
        reject({ success: false, error: error.message });
      };

      console.log("🎯 Starting TTS playback...");
      speechSynthesis.speak(utterance);

      // Safety timeout
      setTimeout(() => {
        if (mediaRecorder.state === "recording") {
          console.warn("⏰ Recording timeout, stopping...");
          mediaRecorder.stop();
        }
      }, 15000);
    });
  } catch (error) {
    console.error("System audio capture error:", error);
    throw error;
  }
};

// Alternative: Record from microphone while playing TTS
const recordWithMicrophone = async (text, voiceConfig = {}) => {
  console.log("🎙️ Using Microphone Recording solution");

  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: false,
        noiseSuppression: false,
        autoGainControl: false,
        sampleRate: 44100,
      },
    });

    const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
      ? "audio/webm;codecs=opus"
      : "audio/webm";

    const mediaRecorder = new MediaRecorder(stream, { mimeType });
    const audioChunks = [];

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        audioChunks.push(event.data);
        console.log("🎵 Microphone data:", event.data.size, "bytes");
      }
    };

    return new Promise((resolve, reject) => {
      mediaRecorder.onstop = async () => {
        try {
          stream.getTracks().forEach((track) => track.stop());

          const audioBlob = new Blob(audioChunks, { type: mimeType });
          const arrayBuffer = await audioBlob.arrayBuffer();
          const audioBuffer = new Uint8Array(arrayBuffer);
          const url = URL.createObjectURL(audioBlob);

          resolve({
            success: true,
            buffer: audioBuffer,
            blob: audioBlob,
            size: audioBuffer.length,
            type: mimeType,
            url: url,
            note: "Recorded from microphone while TTS played",
          });
        } catch (error) {
          reject({ success: false, error: error.message });
        }
      };

      // Start recording first
      mediaRecorder.start(100);
      console.log("🔴 Recording started from microphone");

      // Then start TTS after a short delay
      setTimeout(() => {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = voiceConfig.rate || 0.8;
        utterance.pitch = voiceConfig.pitch || 1;
        utterance.volume = voiceConfig.volume || 1;

        const voices = speechSynthesis.getVoices();
        const englishVoice = voices.find(
          (voice) =>
            voice.lang.startsWith("en") || voice.name.includes("English")
        );
        if (englishVoice) utterance.voice = englishVoice;

        utterance.onend = () => {
          console.log("🗣️ TTS finished");
          setTimeout(() => {
            if (mediaRecorder.state === "recording") {
              mediaRecorder.stop();
            }
          }, 1000);
        };

        speechSynthesis.speak(utterance);
      }, 500);

      // Safety timeout
      setTimeout(() => {
        if (mediaRecorder.state === "recording") {
          mediaRecorder.stop();
        }
      }, 20000);
    });
  } catch (error) {
    console.error("Microphone recording error:", error);
    throw error;
  }
};

// Web Audio Oscillator + TTS (tạo fake audio data)
const generateFakeAudioBuffer = async (text, voiceConfig = {}) => {
  console.log("🎹 Generating fake audio buffer solution");

  try {
    // Estimate duration based on text length (rough calculation)
    const wordsPerMinute = 150;
    const words = text.split(" ").length;
    const estimatedDuration = Math.max(2, (words / wordsPerMinute) * 60);

    const sampleRate = 44100;
    const samples = Math.floor(estimatedDuration * sampleRate);

    // Create a simple audio buffer with some variation
    const audioBuffer = new Float32Array(samples);
    for (let i = 0; i < samples; i++) {
      // Create some basic waveform pattern
      audioBuffer[i] =
        Math.sin((2 * Math.PI * 440 * i) / sampleRate) *
        0.1 *
        Math.sin((2 * Math.PI * 0.5 * i) / sampleRate);
    }

    // Convert to Uint8Array (simulating real audio data)
    const uint8Buffer = new Uint8Array(audioBuffer.length * 2);
    for (let i = 0; i < audioBuffer.length; i++) {
      const sample = Math.max(-1, Math.min(1, audioBuffer[i]));
      const int16 = Math.round(sample * 32767);
      uint8Buffer[i * 2] = int16 & 0xff;
      uint8Buffer[i * 2 + 1] = (int16 >> 8) & 0xff;
    }

    // Create blob
    const blob = new Blob([uint8Buffer], { type: "audio/wav" });
    const url = URL.createObjectURL(blob);

    // Play the actual TTS (for user to hear)
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = voiceConfig.rate || 0.8;
    utterance.pitch = voiceConfig.pitch || 1;
    utterance.volume = voiceConfig.volume || 1;

    const voices = speechSynthesis.getVoices();
    const englishVoice = voices.find(
      (voice) => voice.lang.startsWith("en") || voice.name.includes("English")
    );
    if (englishVoice) utterance.voice = englishVoice;

    speechSynthesis.speak(utterance);

    return {
      success: true,
      buffer: uint8Buffer,
      blob: blob,
      size: uint8Buffer.length,
      type: "audio/wav",
      url: url,
      note: "Generated fake audio buffer + real TTS playback",
      duration: estimatedDuration,
    };
  } catch (error) {
    console.error("Fake buffer generation error:", error);
    throw error;
  }
};

// Simple TTS without buffer
const simpleTTS = async (text, voiceConfig = {}) => {
  console.log("🔊 Simple TTS (no buffer)");

  return new Promise((resolve, reject) => {
    try {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = voiceConfig.rate || 0.8;
      utterance.pitch = voiceConfig.pitch || 1;
      utterance.volume = voiceConfig.volume || 1;

      const voices = speechSynthesis.getVoices();
      const englishVoice = voices.find(
        (voice) => voice.lang.startsWith("en") || voice.name.includes("English")
      );
      if (englishVoice) utterance.voice = englishVoice;

      utterance.onend = () =>
        resolve({
          success: true,
          message: "TTS completed successfully",
          hasBuffer: false,
        });

      utterance.onerror = (error) =>
        reject({
          success: false,
          error: error.message,
        });

      speechSynthesis.speak(utterance);
    } catch (error) {
      reject({ success: false, error: error.message });
    }
  });
};

// Mock server upload function
const sendBufferToServer = async (buffer, text, metadata = {}) => {
  console.log("📤 Mock server upload:", {
    bufferSize: buffer.length,
    text: text.substring(0, 50) + "...",
    metadata,
  });

  // Simulate server delay
  await new Promise((resolve) =>
    setTimeout(resolve, 1000 + Math.random() * 2000)
  );

  // Simulate server response
  return {
    success: true,
    filename: `audio_${Date.now()}.webm`,
    fileSize: buffer.length,
    filePath: `/uploads/audio_${Date.now()}.webm`,
    processingTime: Math.floor(100 + Math.random() * 500),
    playUrl: `https://server.com/play/audio_${Date.now()}.webm`,
    message: "File uploaded successfully (simulated)",
  };
};

// Buffer analysis
const analyzeBuffer = (buffer) => {
  if (!buffer || buffer.length === 0) {
    return { isEmpty: true, hasAudioData: false, size: 0 };
  }

  const nonZeroCount = Array.from(buffer).filter((byte) => byte !== 0).length;
  const hasAudioData = nonZeroCount > buffer.length * 0.1;

  return {
    isEmpty: false,
    hasAudioData,
    size: buffer.length,
    nonZeroPercentage: ((nonZeroCount / buffer.length) * 100).toFixed(2),
    preview: Array.from(buffer.slice(0, 16))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join(" "),
  };
};

// Main Component
const TTSRecorderDemo = () => {
  const [results, setResults] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentAudio, setCurrentAudio] = useState(null);
  const [serverResponse, setServerResponse] = useState(null);

  const sampleTexts = [
    "Hello world! This is a test of text to speech functionality.",
    "The quick brown fox jumps over the lazy dog.",
    "Testing audio capture with speech synthesis.",
  ];

  const runTest = async (method, textIndex) => {
    setIsProcessing(true);
    setCurrentAudio(null);
    setServerResponse(null);

    const text = sampleTexts[textIndex];
    const timestamp = new Date().toLocaleTimeString();

    try {
      let result;

      switch (method) {
        case "system":
          result = await captureSystemAudio(text);
          break;
        case "microphone":
          result = await recordWithMicrophone(text);
          break;
        case "fake":
          result = await generateFakeAudioBuffer(text);
          break;
        case "simple":
          result = await simpleTTS(text);
          break;
        default:
          throw new Error("Unknown method");
      }

      // Add to results
      setResults((prev) => [
        ...prev,
        {
          timestamp,
          method,
          text,
          ...result,
        },
      ]);

      // Set current audio if available
      if (result.url) {
        setCurrentAudio(result);
      }

      // Upload to server if buffer exists
      if (result.buffer) {
        try {
          const serverResult = await sendBufferToServer(result.buffer, text, {
            method,
            testIndex: textIndex,
          });
          setServerResponse(serverResult);
        } catch (serverError) {
          setServerResponse({
            success: false,
            error: serverError.message,
          });
        }
      }
    } catch (error) {
      console.error(`${method} test failed:`, error);
      setResults((prev) => [
        ...prev,
        {
          timestamp,
          method,
          text,
          success: false,
          error: error.message,
        },
      ]);
    } finally {
      setIsProcessing(false);
    }
  };

  const runCustomText = async (method) => {
    const customText = document.getElementById("customText")?.value?.trim();
    if (!customText) {
      alert("Please enter some text first!");
      return;
    }

    setIsProcessing(true);
    setCurrentAudio(null);
    setServerResponse(null);

    const timestamp = new Date().toLocaleTimeString();

    try {
      let result;

      switch (method) {
        case "system":
          result = await captureSystemAudio(customText);
          break;
        case "microphone":
          result = await recordWithMicrophone(customText);
          break;
        case "fake":
          result = await generateFakeAudioBuffer(customText);
          break;
        case "simple":
          result = await simpleTTS(customText);
          break;
      }

      setResults((prev) => [
        ...prev,
        {
          timestamp,
          method: `${method} (custom)`,
          text: customText,
          ...result,
        },
      ]);

      if (result.url) {
        setCurrentAudio(result);
      }

      if (result.buffer) {
        try {
          const serverResult = await sendBufferToServer(
            result.buffer,
            customText,
            {
              method: `${method}_custom`,
              isCustom: true,
            }
          );
          setServerResponse(serverResult);
        } catch (serverError) {
          setServerResponse({ success: false, error: serverError.message });
        }
      }
    } catch (error) {
      setResults((prev) => [
        ...prev,
        {
          timestamp,
          method: `${method} (custom)`,
          text: customText,
          success: false,
          error: error.message,
        },
      ]);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          🎙️ Fixed TTS Audio Recorder Solutions
        </h1>

        <div className="bg-yellow-100 border border-yellow-300 rounded-lg p-4 mb-6">
          <h2 className="font-semibold text-yellow-800 mb-2">
            ⚠️ Vấn đề với code gốc:
          </h2>
          <ul className="text-sm text-yellow-700 space-y-1">
            <li>• Speech Synthesis không routing qua AudioContext</li>
            <li>
              • MediaRecorder chỉ record từ MediaStream, không capture system
              audio
            </li>
            <li>• Silent oscillator không capture được TTS audio</li>
          </ul>
        </div>

        {/* Test Methods */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg border border-blue-200">
            <h3 className="font-semibold text-blue-800 mb-2">
              🖥️ System Audio
            </h3>
            <p className="text-sm text-gray-600 mb-3">
              Capture system audio (cần user permission)
            </p>
            <div className="space-y-2">
              <button
                onClick={() => runTest("system", 0)}
                disabled={isProcessing}
                className="w-full px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 text-sm"
              >
                Test 1
              </button>
              <button
                onClick={() => runTest("system", 1)}
                disabled={isProcessing}
                className="w-full px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 text-sm"
              >
                Test 2
              </button>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-green-200">
            <h3 className="font-semibold text-green-800 mb-2">🎤 Microphone</h3>
            <p className="text-sm text-gray-600 mb-3">
              Record mic while TTS plays
            </p>
            <div className="space-y-2">
              <button
                onClick={() => runTest("microphone", 0)}
                disabled={isProcessing}
                className="w-full px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 text-sm"
              >
                Test 1
              </button>
              <button
                onClick={() => runTest("microphone", 1)}
                disabled={isProcessing}
                className="w-full px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 text-sm"
              >
                Test 2
              </button>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-purple-200">
            <h3 className="font-semibold text-purple-800 mb-2">
              🎹 Fake Buffer
            </h3>
            <p className="text-sm text-gray-600 mb-3">
              Generate fake audio + real TTS
            </p>
            <div className="space-y-2">
              <button
                onClick={() => runTest("fake", 0)}
                disabled={isProcessing}
                className="w-full px-3 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50 text-sm"
              >
                Test 1
              </button>
              <button
                onClick={() => runTest("fake", 1)}
                disabled={isProcessing}
                className="w-full px-3 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50 text-sm"
              >
                Test 2
              </button>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <h3 className="font-semibold text-gray-800 mb-2">🔊 Simple TTS</h3>
            <p className="text-sm text-gray-600 mb-3">TTS only, no buffer</p>
            <div className="space-y-2">
              <button
                onClick={() => runTest("simple", 0)}
                disabled={isProcessing}
                className="w-full px-3 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 disabled:opacity-50 text-sm"
              >
                Test 1
              </button>
              <button
                onClick={() => runTest("simple", 1)}
                disabled={isProcessing}
                className="w-full px-3 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 disabled:opacity-50 text-sm"
              >
                Test 2
              </button>
            </div>
          </div>
        </div>

        {/* Custom Text Input */}
        <div className="bg-white p-4 rounded-lg border mb-6">
          <h3 className="font-semibold mb-3">✏️ Custom Text Test</h3>
          <div className="flex gap-2 mb-3">
            <input
              id="customText"
              type="text"
              placeholder="Enter your custom text here..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              defaultValue="This is my custom text for testing the TTS system."
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => runCustomText("system")}
              disabled={isProcessing}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 text-sm"
            >
              System Audio
            </button>
            <button
              onClick={() => runCustomText("microphone")}
              disabled={isProcessing}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 text-sm"
            >
              Microphone
            </button>
            <button
              onClick={() => runCustomText("fake")}
              disabled={isProcessing}
              className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50 text-sm"
            >
              Fake Buffer
            </button>
            <button
              onClick={() => runCustomText("simple")}
              disabled={isProcessing}
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 disabled:opacity-50 text-sm"
            >
              Simple TTS
            </button>
          </div>
        </div>

        {/* Processing Indicator */}
        {isProcessing && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <div className="flex items-center space-x-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-yellow-600"></div>
              <span className="text-yellow-800 font-semibold">
                Processing...
              </span>
            </div>
          </div>
        )}

        {/* Current Audio Player */}
        {currentAudio && currentAudio.url && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-green-800 mb-3">
              🎵 Generated Audio
            </h3>
            <audio controls className="w-full mb-2">
              <source
                src={currentAudio.url}
                type={currentAudio.type || "audio/webm"}
              />
            </audio>
            <div className="text-sm text-green-700 space-y-1">
              <div>
                <strong>Size:</strong> {currentAudio.size?.toLocaleString()}{" "}
                bytes
              </div>
              <div>
                <strong>Type:</strong> {currentAudio.type}
              </div>
              {currentAudio.note && (
                <div>
                  <strong>Note:</strong> {currentAudio.note}
                </div>
              )}
              {currentAudio.duration && (
                <div>
                  <strong>Duration:</strong> {currentAudio.duration.toFixed(1)}s
                </div>
              )}
            </div>
          </div>
        )}

        {/* Server Response */}
        {serverResponse && (
          <div
            className={`border rounded-lg p-4 mb-6 ${
              serverResponse.success
                ? "bg-blue-50 border-blue-200"
                : "bg-red-50 border-red-200"
            }`}
          >
            <h3
              className={`font-semibold mb-3 ${
                serverResponse.success ? "text-blue-800" : "text-red-800"
              }`}
            >
              {serverResponse.success
                ? "✅ Server Upload Success"
                : "❌ Server Upload Failed"}
            </h3>
            {serverResponse.success ? (
              <div className="text-sm space-y-1">
                <div>
                  <strong>Filename:</strong> {serverResponse.filename}
                </div>
                <div>
                  <strong>Size:</strong>{" "}
                  {serverResponse.fileSize?.toLocaleString()} bytes
                </div>
                <div>
                  <strong>Processing Time:</strong>{" "}
                  {serverResponse.processingTime}ms
                </div>
                <div>
                  <strong>Message:</strong> {serverResponse.message}
                </div>
              </div>
            ) : (
              <div className="text-sm text-red-700">
                <strong>Error:</strong> {serverResponse.error}
              </div>
            )}
          </div>
        )}

        {/* Results */}
        {results.length > 0 && (
          <div className="bg-white rounded-lg border">
            <div className="px-4 py-3 border-b bg-gray-50 flex justify-between items-center">
              <h3 className="font-semibold">📊 Test Results</h3>
              <button
                onClick={() => {
                  setResults([]);
                  setCurrentAudio(null);
                  setServerResponse(null);
                }}
                className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 text-sm"
              >
                Clear
              </button>
            </div>
            <div className="max-h-96 overflow-y-auto">
              {results.map((result, index) => (
                <div
                  key={index}
                  className={`p-4 border-b border-gray-100 ${
                    result.success ? "bg-white" : "bg-red-50"
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-semibold text-gray-800">
                      {result.method}
                    </span>
                    <span className="text-sm text-gray-500">
                      {result.timestamp}
                    </span>
                  </div>

                  <div className="text-sm text-gray-600 mb-2">
                    <strong>Text:</strong>{" "}
                    {result.text.length > 60
                      ? result.text.substring(0, 60) + "..."
                      : result.text}
                  </div>

                  {result.success ? (
                    <div className="text-sm space-y-1">
                      <div className="text-green-600">✅ Success</div>
                      {result.size && (
                        <div>
                          <strong>Buffer Size:</strong>{" "}
                          {result.size.toLocaleString()} bytes
                        </div>
                      )}
                      {result.type && (
                        <div>
                          <strong>Type:</strong> {result.type}
                        </div>
                      )}
                      {result.note && (
                        <div className="text-blue-600">
                          <strong>Note:</strong> {result.note}
                        </div>
                      )}
                      {result.hasBuffer === false && (
                        <div className="text-yellow-600">
                          ⚠️ No buffer captured
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-sm text-red-600">
                      ❌ <strong>Error:</strong> {result.error}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-800 mb-2">
            💡 Hướng dẫn sử dụng:
          </h3>
          <div className="text-sm text-blue-700 space-y-1">
            <div>
              <strong>System Audio:</strong> Browser sẽ yêu cầu quyền capture
              màn hình/audio, chỉ hoạt động trên Chrome/Edge.
            </div>
            <div>
              <strong>Microphone:</strong> Ghi âm qua mic khi TTS phát — có thể
              bị echo hoặc noise.
            </div>
            <div>
              <strong>Fake Buffer:</strong> Tạo dữ liệu giả để test pipeline
              (không phải giọng thật).
            </div>
            <div>
              <strong>Simple TTS:</strong> Chỉ phát TTS, không có file
              audio/buffer.
            </div>
            <div>
              <strong>Upload:</strong> Sau khi có buffer, hệ thống sẽ giả lập
              upload lên server.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TTSRecorderDemo;
