import React, { useState, useEffect } from "react";

const UEOAI = [
  { UEOAI: "u", IPA: "uː;ʊ;u" },
  { UEOAI: "e", IPA: "e;ɛ" },
  { UEOAI: "o", IPA: "ɒ;ɔː;ɔ" },
  { UEOAI: "a", IPA: "a;ɑː;æ;ʌ;ɑ" },
  { UEOAI: "i", IPA: "iː;ɪ;i" },
  { UEOAI: "ơ", IPA: "ɜː;ə;ɜ;ᵊ" },
];

const phonetics = {
  basic: [
    { letter: "U", sounds: ["uː", "ʊ"] },
    { letter: "E", sounds: ["e", "ɛ"] },
    { letter: "O", sounds: ["ɒ", "ɔː"] },
    { letter: "A", sounds: ["ɑː", "æ", "ʌ"] },
    { letter: "I", sounds: ["iː", "ɪ"] },
    { letter: "Ơ", sounds: ["ɜː", "ə"] },
  ],
  diphthongs: [
    { ipa: "eɪ", simple: "Ei" },
    { ipa: "aɪ", simple: "Ai" },
    { ipa: "ɔɪ", simple: "Oi" },
    { ipa: "əʊ", simple: "Ơu" },
    { ipa: "aʊ", simple: "Au" },
    { ipa: "ɪə", simple: "I-ơ" },
    { ipa: "eə", simple: "E-ơ" },
    { ipa: "ʊə", simple: "U-ơ" },
  ],
};

const COLORS = {
  purple: "#9333EA",
  red: "#EF4444",
  blue: "#3B82F6",
  black: "#000000",
};

function IpaTransformer({ text = "əˈbaʊt", nextText = "Ờ.bAu(-t)" }) {
  const [textData, setTextData] = useState([
    { text, type: "normal", nextText },
  ]);
  const [currentPhase, setCurrentPhase] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  // Cập nhật textData khi props thay đổi
  useEffect(() => {
    setTextData([{ text, type: "normal", nextText }]);
    // Reset animation khi text thay đổi
    setIsPlaying(false);
    setProgress(0);
    setCurrentPhase(1);
  }, [text, nextText]);

  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + 1;

        if (next < 120) {
          setCurrentPhase(1);
        } else if (next < 240) {
          setCurrentPhase(2);
        } else if (next < 360) {
          setCurrentPhase(3);
        } else if (next < 480) {
          setCurrentPhase(4);
        } else if (next < 600) {
          setCurrentPhase(5);
        } else {
          setIsPlaying(false);
          return 0;
        }

        return next;
      });
    }, 16);

    return () => clearInterval(interval);
  }, [isPlaying]);

  const handleStart = () => {
    setProgress(0);
    setCurrentPhase(1);
    setIsPlaying(true);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setProgress(0);
    setCurrentPhase(1);
  };

  const processTextWithIPA = (originalText) => {
    const allIPAChars = UEOAI.flatMap((item) => item.IPA.split(";"));
    const characters = [];

    for (let i = 0; i < originalText.length; i++) {
      const char = originalText[i];
      const isIPAChar = allIPAChars.includes(char);

      if (isIPAChar) {
        const matchedUEOAI = UEOAI.find((item) =>
          item.IPA.split(";").includes(char)
        );
        characters.push({
          original: char,
          isIPA: true,
          replacement: matchedUEOAI ? matchedUEOAI.UEOAI : char,
          position: i,
        });
      } else {
        characters.push({
          original: char,
          isIPA: false,
          replacement: char,
          position: i,
        });
      }
    }

    return characters;
  };

  const getPhaseProgress = () => {
    const phaseStart = (currentPhase - 1) * 120;
    return Math.min((progress - phaseStart) / 120, 1);
  };

  const highlightIPAChars = (text) => {
    const ipaChars = [
      "U",
      "u",
      "E",
      "e",
      "O",
      "o",
      "A",
      "a",
      "I",
      "i",
      "Ơ",
      "Ờ",
      "ờ",
      "ơ",
    ];
    const parts = [];
    let currentText = "";

    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      if (ipaChars.includes(char)) {
        if (currentText) {
          parts.push({ text: currentText, highlight: false });
          currentText = "";
        }
        parts.push({ text: char, highlight: true });
      } else {
        currentText += char;
      }
    }

    if (currentText) {
      parts.push({ text: currentText, highlight: false });
    }

    return parts;
  };

  const renderCharacterCell = (character, index) => {
    const isIPA = character.isIPA;
    const phaseProgress = getPhaseProgress();

    return (
      <td key={index} className={`character-cell ${isIPA ? "ipa-char" : ""}`}>
        {isIPA && currentPhase === 1 && (
          <div
            className="yellow-circle"
            style={{
              transform: `translate(-50%, -50%) scale(${Math.min(
                phaseProgress * 1.2,
                1.2
              )})`,
              opacity: Math.min(phaseProgress * 2, 0.8),
            }}
          />
        )}

        <div
          className={`original-char ${
            currentPhase >= 2 && isIPA ? "phase-2" : ""
          } ${currentPhase >= 3 && isIPA ? "phase-3" : ""}`}
          style={{
            color:
              isIPA && currentPhase >= 2
                ? currentPhase === 2
                  ? COLORS.purple
                  : currentPhase === 3
                  ? COLORS.red
                  : COLORS.blue
                : COLORS.black,
            fontWeight: isIPA && currentPhase >= 1 ? "bold" : "normal",
            opacity:
              currentPhase === 3 && isIPA
                ? Math.max(1 - phaseProgress * 3, 0)
                : currentPhase >= 5
                ? Math.max(1 - phaseProgress * 2.5, 0)
                : 1,
          }}
        >
          {currentPhase < 3 || !isIPA ? character.original : ""}
        </div>

        {currentPhase === 2 && isIPA && (
          <div
            className="replacement-below"
            style={{
              color: COLORS.purple,
              opacity: Math.max(((phaseProgress - 0.4) / 0.6) * 0.8, 0),
            }}
          >
            {character.replacement}
          </div>
        )}

        {currentPhase === 3 && isIPA && (
          <div
            className="replacement-sliding"
            style={{
              color: COLORS.red,
              top: `${39 - phaseProgress * 39}px`,
            }}
          >
            {character.replacement}
          </div>
        )}

        {currentPhase >= 4 && isIPA && (
          <div
            className="replacement-final"
            style={{
              color: COLORS.blue,
              opacity:
                currentPhase === 4
                  ? Math.max(phaseProgress / 0.3, 0) *
                    (currentPhase >= 5
                      ? Math.max(1 - (progress - 480) / 48, 0)
                      : 1)
                  : currentPhase >= 5
                  ? Math.max(1 - (progress - 480) / 48, 0)
                  : 1,
            }}
          >
            {character.replacement.toUpperCase()}
          </div>
        )}
      </td>
    );
  };

  return (
    <div className="container">
      <style>{`
        * {
          box-sizing: border-box;
        }
        .container {
          max-width: 900px;
          margin: 0 auto;
          padding: 40px 20px;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          min-height: 100vh;
        }
        .card {
          background: white;
          border-radius: 16px;
          padding: 32px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
        }
        h1 {
          text-align: center;
          color: #333;
          margin-bottom: 30px;
          font-size: 32px;
        }
        .text-display {
          background: #f9fafb;
          padding: 20px;
          border-radius: 8px;
          margin-bottom: 24px;
          text-align: center;
        }
        .text-display-label {
          font-size: 14px;
          color: #6b7280;
          margin-bottom: 8px;
          font-weight: 600;
        }
        .text-display-value {
          font-size: 24px;
          color: #111827;
          font-family: monospace;
          font-weight: bold;
        }
        .controls {
          display: flex;
          justify-content: center;
          gap: 16px;
          margin-bottom: 30px;
          flex-wrap: wrap;
        }
        .btn {
          padding: 12px 32px;
          font-size: 16px;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.3s ease;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .btn-primary {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }
        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
        }
        .btn-primary:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }
        .btn-secondary {
          background: #f3f4f6;
          color: #374151;
        }
        .btn-secondary:hover {
          background: #e5e7eb;
        }
        .phase-indicator {
          text-align: center;
          margin-bottom: 24px;
          padding: 16px;
          background: #f9fafb;
          border-radius: 8px;
        }
        .phase-indicator h3 {
          margin: 0 0 8px 0;
          color: #374151;
          font-size: 18px;
        }
        .phase-bar {
          height: 8px;
          background: #e5e7eb;
          border-radius: 4px;
          overflow: hidden;
        }
        .phase-progress {
          height: 100%;
          background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
          transition: width 0.1s linear;
        }
        .animation-area {
          background: #fafafa;
          border-radius: 12px;
          padding: 40px;
          margin-bottom: 30px;
          min-height: 200px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .character-table {
          border-collapse: collapse;
          margin: 0 auto;
        }
        .character-cell {
          width: 36px;
          height: 75px;
          text-align: center;
          vertical-align: top;
          position: relative;
          font-size: 28px;
          font-family: monospace;
          padding: 0;
        }
        .yellow-circle {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 48px;
          height: 48px;
          background-color: #FFD700;
          border-radius: 50%;
          z-index: 1;
          border: 2px solid #FFA500;
          box-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
          animation: pulse 0.6s ease-out;
        }
        @keyframes pulse {
          0% {
            transform: translate(-50%, -50%) scale(0);
          }
          50% {
            transform: translate(-50%, -50%) scale(1.3);
          }
          100% {
            transform: translate(-50%, -50%) scale(1.2);
          }
        }
        .original-char {
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          z-index: 2;
          line-height: 1;
          transition: color 0.3s ease-in-out;
        }
        .replacement-below {
          position: absolute;
          top: 39px;
          left: 50%;
          transform: translateX(-50%);
          font-size: 24px;
          font-weight: bold;
          line-height: 1;
        }
        .replacement-sliding {
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
          font-size: 24px;
          font-weight: bold;
          opacity: 0.8;
          z-index: 3;
          line-height: 1;
          transition: top 0.3s cubic-bezier(0.33, 1, 0.68, 1);
        }
        .replacement-final {
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          font-weight: bold;
          z-index: 4;
          line-height: 1;
        }
        .next-text-display {
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          font-weight: bold;
          font-size: 28px;
          text-align: center;
          z-index: 10;
          width: 110%;
          white-space: nowrap;
        }
        .next-text-display .highlighted {
          color: #EF4444;
          font-weight: bold;
        }
        .info-tables {
          margin-top: 40px;
          padding: 24px;
          background: #f9fafb;
          border-radius: 12px;
        }
        .phonetics-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 20px;
          font-size: 18px;
        }
        .phonetics-table td {
          border: 1px solid #d1d5db;
          padding: 12px;
          text-align: center;
        }
        .phonetics-table thead td {
          background: #667eea;
          color: white;
          font-weight: bold;
          font-size: 24px;
        }
        .phonetics-table tbody td {
          background: white;
        }
        .segment-wrapper {
          margin-bottom: 48px;
          position: relative;
        }
      `}</style>

      <div className="card">
        <h1>🔤 IPA Text Transformer</h1>

        <div className="text-display">
          <div className="text-display-label">IPA Text:</div>
          <div className="text-display-value">{text}</div>
        </div>

        <div className="text-display">
          <div className="text-display-label">Result Text:</div>
          <div className="text-display-value">{nextText}</div>
        </div>

        <div className="controls">
          <button
            className="btn btn-primary"
            onClick={handleStart}
            disabled={isPlaying}
          >
            {isPlaying ? "⏸ Đang chạy..." : "▶ Bắt đầu"}
          </button>
          <button className="btn btn-secondary" onClick={handleReset}>
            🔄 Reset
          </button>
        </div>

        <div className="phase-indicator">
          <h3>Phase {currentPhase} / 5</h3>
          <div className="phase-bar">
            <div
              className="phase-progress"
              style={{ width: `${(progress / 600) * 100}%` }}
            />
          </div>
          <p style={{ marginTop: "8px", color: "#6b7280", fontSize: "14px" }}>
            {currentPhase === 1 && "Đánh dấu ký tự IPA bằng vòng tròn vàng"}
            {currentPhase === 2 &&
              "Đổi màu tím và hiển thị ký tự thay thế bên dưới"}
            {currentPhase === 3 && "Ký tự thay thế trượt lên (màu đỏ)"}
            {currentPhase === 4 && "Chuyển thành chữ hoa (màu xanh)"}
            {currentPhase === 5 && "Hiển thị nextText hoàn chỉnh"}
          </p>
        </div>

        <div className="animation-area">
          {textData.map((segment, segmentIndex) => {
            const processedChars = processTextWithIPA(segment.text);

            return (
              <div key={segmentIndex} className="segment-wrapper">
                <div
                  style={{
                    opacity:
                      currentPhase >= 5
                        ? Math.max(1 - (progress - 480) / 48, 0)
                        : 1,
                  }}
                >
                  <table className="character-table">
                    <tbody>
                      <tr>
                        {processedChars.map((char, charIndex) =>
                          renderCharacterCell(char, charIndex)
                        )}
                      </tr>
                    </tbody>
                  </table>
                </div>

                {currentPhase >= 5 && segment.nextText && (
                  <div
                    className="next-text-display"
                    style={{
                      opacity: Math.max((progress - 480) / 72, 0),
                    }}
                  >
                    {highlightIPAChars(segment.nextText).map(
                      (part, partIndex) => (
                        <span
                          key={partIndex}
                          className={part.highlight ? "highlighted" : ""}
                        >
                          {part.text}
                        </span>
                      )
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="info-tables">
          <h3 style={{ marginBottom: "16px", color: "#374151" }}>
            📊 Bảng Phiên Âm Cơ Bản
          </h3>
          <table className="phonetics-table">
            <thead>
              <tr>
                {phonetics.basic.map((item, i) => (
                  <td key={i}>{item.letter}</td>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                {phonetics.basic.map((item, i) => (
                  <td key={i}>
                    {item.sounds.map((sound, j) => (
                      <div key={j}>{sound}</div>
                    ))}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>

          <h3
            style={{
              marginBottom: "16px",
              marginTop: "24px",
              color: "#374151",
            }}
          >
            🔗 Nguyên Âm Đôi
          </h3>
          <table className="phonetics-table">
            <thead>
              <tr>
                {phonetics.diphthongs.map((item, i) => (
                  <td key={i}>{item.ipa}</td>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                {phonetics.diphthongs.map((item, i) => (
                  <td key={i}>{item.simple}</td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default IpaTransformer;
