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

  useEffect(() => {
    setTextData([{ text, type: "normal", nextText }]);
    setIsPlaying(false);
    setProgress(0);
    setCurrentPhase(1);
  }, [text, nextText]);

  useEffect(() => {
    if (!isPlaying) return;

    let animationFrameId;
    let lastTime = performance.now();

    const animate = (currentTime) => {
      const deltaTime = currentTime - lastTime;

      // Update every ~16ms (60fps)
      if (deltaTime >= 16) {
        lastTime = currentTime;

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
            // Dừng animation nhưng giữ phase 5
            setIsPlaying(false);
            setCurrentPhase(5);
            return 600; // Giữ progress ở 600
          }

          return next;
        });
      }

      if (isPlaying) {
        animationFrameId = requestAnimationFrame(animate);
      }
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
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

  const renderCharacterCell = (character, index, phaseToRender) => {
    const isIPA = character.isIPA;
    const phaseProgress = getPhaseProgress();

    return (
      <td key={index} className={`character-cell ${isIPA ? "ipa-char" : ""}`}>
        {/* Phase 1: Yellow circle */}
        {phaseToRender === 1 && isIPA && currentPhase >= 1 && (
          <div
            className="yellow-circle"
            style={{
              transform: `translate(-50%, -50%) scale(${
                currentPhase === 1 ? Math.min(phaseProgress * 1.2, 1.2) : 1.2
              })`,
              opacity:
                currentPhase === 1 ? Math.min(phaseProgress * 2, 0.8) : 0.8,
            }}
          />
        )}

        {/* Phase 1: Original character with yellow circle */}
        {phaseToRender === 1 && (
          <div
            className="original-char"
            style={{
              color: COLORS.black,
              fontWeight: isIPA && currentPhase >= 1 ? "bold" : "normal",
            }}
          >
            {character.original}
          </div>
        )}

        {/* Phase 2: Purple character with replacement below */}
        {phaseToRender === 2 && (
          <>
            <div
              className="original-char"
              style={{
                color:
                  isIPA && currentPhase >= 2 ? COLORS.purple : COLORS.black,
                fontWeight: isIPA ? "bold" : "normal",
              }}
            >
              {character.original}
            </div>
            {isIPA && currentPhase >= 2 && (
              <div
                className="replacement-below"
                style={{
                  color: COLORS.purple,
                  opacity:
                    currentPhase === 2
                      ? Math.max(((phaseProgress - 0.4) / 0.6) * 0.8, 0)
                      : 0.8,
                }}
              >
                {character.replacement}
              </div>
            )}
          </>
        )}

        {/* Phase 3: Red character sliding up */}
        {phaseToRender === 3 && (
          <>
            <div
              className="original-char"
              style={{
                color: isIPA && currentPhase >= 3 ? COLORS.red : COLORS.black,
                fontWeight: isIPA ? "bold" : "normal",
                opacity:
                  isIPA && currentPhase === 3
                    ? Math.max(1 - phaseProgress * 3, 0)
                    : 1,
              }}
            >
              {currentPhase < 3 || !isIPA ? character.original : ""}
            </div>
            {isIPA && currentPhase >= 3 && (
              <div
                className="replacement-sliding"
                style={{
                  color: COLORS.red,
                  top:
                    currentPhase === 3 ? `${32 - phaseProgress * 32}px` : "0px",
                }}
              >
                {character.replacement}
              </div>
            )}
          </>
        )}

        {/* Phase 4: Blue uppercase character */}
        {phaseToRender === 4 && isIPA && currentPhase >= 4 && (
          <div
            className="replacement-final"
            style={{
              color: COLORS.blue,
              opacity:
                currentPhase === 4 ? Math.max(phaseProgress / 0.3, 0) : 1,
            }}
          >
            {character.replacement.toUpperCase()}
          </div>
        )}

        {phaseToRender === 4 && !isIPA && (
          <div className="original-char" style={{ color: COLORS.black }}>
            {character.original}
          </div>
        )}
      </td>
    );
  };

  return (
    <div className="ipa-container">
      <style>{`
        * {
          box-sizing: border-box;
        }
        
        .ipa-container {
          width: 100%;
          margin: 0 auto;
          padding: 16px;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        
        .ipa-card {
          background: white;
          border-radius: 12px;
          padding: 16px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }
        
        .ipa-title {
          text-align: center;
          color: #1f2937;
          margin: 0 0 16px 0;
          font-size: 20px;
          font-weight: bold;
        }
        
        .text-display {
          background: #f9fafb;
          padding: 12px;
          border-radius: 8px;
          margin-bottom: 12px;
        }
        
        .text-display-label {
          font-size: 12px;
          color: #6b7280;
          margin-bottom: 4px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .text-display-value {
          font-size: 16px;
          color: #111827;
          font-family: monospace;
          font-weight: bold;
          word-break: break-all;
        }
        
        .controls {
          display: flex;
          justify-content: center;
          gap: 8px;
          margin-bottom: 16px;
          flex-wrap: wrap;
        }
        
        .btn {
          padding: 10px 20px;
          font-size: 14px;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.2s ease;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        
        .btn-primary {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          min-width: 120px;
        }
        
        .btn-primary:active {
          transform: scale(0.98);
        }
        
        .btn-primary:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        
        .btn-secondary {
          background: #f3f4f6;
          color: #374151;
        }
        
        .btn-secondary:active {
          background: #e5e7eb;
          transform: scale(0.98);
        }
        
        .phase-indicator {
          text-align: center;
          margin-bottom: 16px;
          padding: 12px;
          background: #f9fafb;
          border-radius: 8px;
        }
        
        .phase-indicator h3 {
          margin: 0 0 8px 0;
          color: #374151;
          font-size: 16px;
        }
        
        .phase-bar {
          height: 6px;
          background: #e5e7eb;
          border-radius: 3px;
          overflow: hidden;
        }
        
        .phase-progress {
          height: 100%;
          background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
          transition: width 0.1s linear;
        }
        
        .phase-description {
          margin-top: 8px;
          color: #6b7280;
          font-size: 12px;
          line-height: 1.4;
        }
        
        .animation-area {
          background: #fafafa;
          border-radius: 8px;
          padding: 20px 10px;
          margin-bottom: 16px;
          min-height: 400px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-start;
          overflow-x: auto;
          gap: 20px;
        }
        
        .phase-display {
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 12px;
          background: white;
          border-radius: 8px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          opacity: 0;
          transition: opacity 0.5s ease-in-out;
          will-change: opacity;
          backface-visibility: hidden;
        }
        
        .phase-display.visible {
          opacity: 1;
        }
        
        .phase-label {
          font-size: 12px;
          color: #6b7280;
          font-weight: 600;
          margin-bottom: 8px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .character-table {
          border-collapse: collapse;
          margin: 0 auto;
        }
        
        .character-cell {
          width: 28px;
          height: 60px;
          text-align: center;
          vertical-align: top;
          position: relative;
          font-size: 22px;
          font-family: monospace;
          padding: 0;
          will-change: transform;
          backface-visibility: hidden;
          -webkit-font-smoothing: antialiased;
        }
        
        .yellow-circle {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 36px;
          height: 36px;
          background-color: #FFD700;
          border-radius: 50%;
          z-index: 1;
          border: 2px solid #FFA500;
          box-shadow: 0 0 8px rgba(255, 215, 0, 0.5);
          will-change: transform, opacity;
          backface-visibility: hidden;
        }
        
        .original-char {
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          z-index: 2;
          line-height: 1;
          will-change: color, opacity;
          backface-visibility: hidden;
          -webkit-font-smoothing: antialiased;
        }
        
        .replacement-below {
          position: absolute;
          top: 32px;
          left: 50%;
          transform: translateX(-50%);
          font-size: 20px;
          font-weight: bold;
          line-height: 1;
          will-change: opacity;
          backface-visibility: hidden;
        }
        
        .replacement-sliding {
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
          font-size: 20px;
          font-weight: bold;
          opacity: 0.8;
          z-index: 3;
          line-height: 1;
          will-change: top;
          backface-visibility: hidden;
        }
        
        .replacement-final {
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          font-weight: bold;
          z-index: 4;
          line-height: 1;
          will-change: opacity;
          backface-visibility: hidden;
        }
        
        .next-text-display {
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          font-weight: bold;
          font-size: 22px;
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
          margin-top: 16px;
          padding: 16px;
          background: #f9fafb;
          border-radius: 8px;
        }
        
        .table-title {
          margin: 0 0 12px 0;
          color: #374151;
          font-size: 16px;
          font-weight: bold;
        }
        
        .phonetics-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 16px;
          font-size: 14px;
        }
        
        .phonetics-table td {
          border: 1px solid #d1d5db;
          padding: 8px 4px;
          text-align: center;
        }
        
        .phonetics-table thead td {
          background: #667eea;
          color: white;
          font-weight: bold;
          font-size: 18px;
        }
        
        .phonetics-table tbody td {
          background: white;
        }
        
        .segment-wrapper {
          margin-bottom: 24px;
          position: relative;
        }
        
        /* Tablet breakpoint */
        @media (min-width: 640px) {
          .ipa-container {
            padding: 24px;
          }
          
          .ipa-card {
            padding: 24px;
          }
          
          .ipa-title {
            font-size: 24px;
            margin-bottom: 20px;
          }
          
          .text-display {
            padding: 16px;
            margin-bottom: 16px;
          }
          
          .text-display-label {
            font-size: 13px;
          }
          
          .text-display-value {
            font-size: 20px;
          }
          
          .controls {
            gap: 12px;
            margin-bottom: 20px;
          }
          
          .btn {
            padding: 12px 24px;
            font-size: 15px;
          }
          
          .animation-area {
            padding: 30px 20px;
            min-height: 500px;
          }
          
          .character-cell {
            width: 32px;
            height: 70px;
            font-size: 26px;
          }
          
          .yellow-circle {
            width: 42px;
            height: 42px;
          }
          
          .replacement-below {
            top: 36px;
            font-size: 22px;
          }
          
          .replacement-sliding {
            font-size: 22px;
          }
          
          .next-text-display {
            font-size: 26px;
          }
          
          .phonetics-table {
            font-size: 16px;
          }
          
          .phonetics-table thead td {
            font-size: 20px;
          }
          
          .phonetics-table td {
            padding: 10px 6px;
          }
        }
        
        /* Desktop breakpoint */
        @media (min-width: 1024px) {
          .ipa-container {
            max-width: 1000px;
            padding: 32px;
          }
          
          .ipa-card {
            padding: 32px;
            border-radius: 16px;
          }
          
          .ipa-title {
            font-size: 28px;
            margin-bottom: 24px;
          }
          
          .text-display {
            padding: 20px;
            margin-bottom: 20px;
          }
          
          .text-display-label {
            font-size: 14px;
          }
          
          .text-display-value {
            font-size: 24px;
          }
          
          .controls {
            gap: 16px;
            margin-bottom: 24px;
          }
          
          .btn {
            padding: 12px 32px;
            font-size: 16px;
          }
          
          .btn-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
          }
          
          .btn-secondary:hover {
            background: #e5e7eb;
          }
          
          .phase-indicator {
            padding: 16px;
            margin-bottom: 20px;
          }
          
          .phase-indicator h3 {
            font-size: 18px;
          }
          
          .phase-bar {
            height: 8px;
          }
          
          .phase-description {
            font-size: 14px;
          }
          
          .animation-area {
            padding: 40px;
            min-height: 600px;
            border-radius: 12px;
            margin-bottom: 24px;
          }
          
          .character-cell {
            width: 36px;
            height: 75px;
            font-size: 28px;
          }
          
          .yellow-circle {
            width: 48px;
            height: 48px;
          }
          
          .replacement-below {
            top: 39px;
            font-size: 24px;
          }
          
          .replacement-sliding {
            font-size: 24px;
          }
          
          .next-text-display {
            font-size: 28px;
          }
          
          .info-tables {
            padding: 24px;
            border-radius: 12px;
          }
          
          .table-title {
            font-size: 18px;
            margin-bottom: 16px;
          }
          
          .phonetics-table {
            font-size: 18px;
            margin-bottom: 20px;
          }
          
          .phonetics-table thead td {
            font-size: 24px;
          }
          
          .phonetics-table td {
            padding: 12px;
          }
        }
      `}</style>

      <div className="ipa-card">
        <h1 className="ipa-title">🔤 IPA Text Transformer</h1>

        <div className="text-display">
          <div className="text-display-label">IPA Text</div>
          <div className="text-display-value">{text}</div>
        </div>

        <div className="text-display">
          <div className="text-display-label">Result Text</div>
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
          <p className="phase-description">
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
              <div key={segmentIndex} style={{ width: "100%" }}>
                {/* Phase 1: Original with yellow circles */}
                <div
                  className={`phase-display ${
                    currentPhase >= 1 ? "visible" : ""
                  }`}
                >
                  <div className="phase-label">Phase 1: Đánh dấu ký tự IPA</div>
                  <table className="character-table">
                    <tbody>
                      <tr>
                        {processedChars.map((char, charIndex) =>
                          renderCharacterCell(char, charIndex, 1)
                        )}
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Phase 2: Purple with replacement below */}
                <div
                  className={`phase-display ${
                    currentPhase >= 2 ? "visible" : ""
                  }`}
                >
                  <div className="phase-label">
                    Phase 2: Hiển thị ký tự thay thế
                  </div>
                  <table className="character-table">
                    <tbody>
                      <tr>
                        {processedChars.map((char, charIndex) =>
                          renderCharacterCell(char, charIndex, 2)
                        )}
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Phase 3: Red sliding up */}
                <div
                  className={`phase-display ${
                    currentPhase >= 3 ? "visible" : ""
                  }`}
                >
                  <div className="phase-label">Phase 3: Trượt lên vị trí</div>
                  <table className="character-table">
                    <tbody>
                      <tr>
                        {processedChars.map((char, charIndex) =>
                          renderCharacterCell(char, charIndex, 3)
                        )}
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Phase 4: Blue uppercase */}
                <div
                  className={`phase-display ${
                    currentPhase >= 4 ? "visible" : ""
                  }`}
                >
                  <div className="phase-label">Phase 4: Chữ hoa kết quả</div>
                  <table className="character-table">
                    <tbody>
                      <tr>
                        {processedChars.map((char, charIndex) =>
                          renderCharacterCell(char, charIndex, 4)
                        )}
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Phase 5: Final nextText */}
                {segment.nextText && (
                  <div
                    className={`phase-display ${
                      currentPhase >= 5 ? "visible" : ""
                    }`}
                  >
                    <div className="phase-label">
                      Phase 5: Kết quả cuối cùng
                    </div>
                    <div
                      style={{
                        fontSize: "22px",
                        fontWeight: "bold",
                        textAlign: "center",
                      }}
                    >
                      {highlightIPAChars(segment.nextText).map(
                        (part, partIndex) => (
                          <span
                            key={partIndex}
                            style={{
                              color: part.highlight ? "#EF4444" : "#000000",
                              fontWeight: "bold",
                            }}
                          >
                            {part.text}
                          </span>
                        )
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="info-tables">
          <h3 className="table-title">📊 Bảng Phiên Âm Cơ Bản</h3>
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

          <h3 className="table-title">🔗 Nguyên Âm Đôi</h3>
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
