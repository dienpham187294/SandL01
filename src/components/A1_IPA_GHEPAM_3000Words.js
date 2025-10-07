import { useState } from "react";
import DataInput from "./A1_IPA_GHEPAM_3000WordsJSON.json";
import IpaTransformer from "../ulti/IpaTrans";
import ReadMessage from "../ulti/ReadMessage_2024";

export default function GHEPAM3000WORDS() {
  const [selectedWord, setSelectedWord] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const handleShowDetail = (word) => {
    setSelectedWord(word);
    document.body.style.overflow = "hidden"; // Prevent background scroll
  };

  const handleCloseDetail = () => {
    setSelectedWord(null);
    document.body.style.overflow = "auto";
  };

  const filteredData = DataInput.filter(
    (word) =>
      word.ZZ01?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      word.ZZ03?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <style>{`
        * {
          box-sizing: border-box;
          -webkit-tap-highlight-color: transparent;
        }
        
        .word-list-container {
          padding: 0;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          min-height: 100vh;
        }
        
        .content-wrapper {
          max-width: 1200px;
          margin: 0 auto;
        }
        
        .header-sticky {
          position: sticky;
          top: 0;
          z-index: 100;
          background: white;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          padding: 12px 16px;
        }
        
        .search-box {
          width: 100%;
          max-width: 600px;
          margin: 0 auto;
          display: block;
          padding: 12px 16px;
          border: 2px solid #e5e7eb;
          border-radius: 12px;
          font-size: 16px;
          outline: none;
          transition: all 0.3s;
        }
        
        .search-box:focus {
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }
        
        .words-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 12px;
          padding: 0 16px;
        }
        
        .word-card {
          background: white;
          padding: 16px;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          cursor: pointer;
          transition: all 0.2s;
          border-left: 4px solid #667eea;
        }
        
        .word-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }
        
        .word-card:active {
          transform: scale(0.98);
          box-shadow: 0 1px 4px rgba(0,0,0,0.1);
        }
        
        .word-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }
        
        .word-title {
          font-size: 20px;
          font-weight: bold;
          color: #1f2937;
          margin: 0;
        }
        
        .word-id {
          font-size: 14px;
          color: #9ca3af;
          background: #f3f4f6;
          padding: 4px 8px;
          border-radius: 6px;
        }
        
        .word-type {
          display: inline-block;
          font-size: 12px;
          color: #667eea;
          background: #ede9fe;
          padding: 4px 10px;
          border-radius: 6px;
          margin-bottom: 8px;
          font-weight: 600;
        }
        
        .word-meaning {
          color: #4b5563;
          font-size: 15px;
          line-height: 1.5;
        }
        
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: fadeIn 0.2s;
          padding: 0;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        
        @keyframes slideIn {
          from { 
            opacity: 0;
            transform: scale(0.95);
          }
          to { 
            opacity: 1;
            transform: scale(1);
          }
        }
        
        .modal-content {
          background: white;
          width: 100%;
          max-height: 90vh;
          border-radius: 20px 20px 0 0;
          overflow-y: auto;
          animation: slideUp 0.3s;
          -webkit-overflow-scrolling: touch;
        }
        
        .modal-header {
          position: sticky;
          top: 0;
          background: white;
          padding: 16px;
          border-bottom: 1px solid #e5e7eb;
          display: flex;
          justify-content: space-between;
          align-items: center;
          z-index: 10;
        }
        
        .modal-title {
          font-size: 20px;
          font-weight: bold;
          color: #1f2937;
          margin: 0;
        }
        
        .close-btn {
          background: #f3f4f6;
          border: none;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          font-size: 20px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }
        
        .close-btn:active {
          background: #e5e7eb;
          transform: scale(0.95);
        }
        
        .modal-body {
          padding: 20px;
        }
        
        .detail-section {
          margin-bottom: 20px;
          padding: 16px;
          background: #f9fafb;
          border-radius: 12px;
        }
        
        .detail-label {
          font-size: 13px;
          color: #6b7280;
          margin-bottom: 6px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .detail-value {
          font-size: 16px;
          color: #1f2937;
          line-height: 1.6;
        }
        
        .detail-value-large {
          font-size: 24px;
          font-weight: bold;
          color: #667eea;
        }
        
        .read-btn {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          margin-top: 8px;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          transition: all 0.2s;
        }
        
        .read-btn:active {
          transform: scale(0.95);
        }
        
        .example-box {
          background: white;
          border: 2px solid #e5e7eb;
          border-radius: 10px;
          padding: 12px;
          margin-bottom: 12px;
        }
        
        .example-en {
          color: #1f2937;
          font-size: 15px;
          margin-bottom: 6px;
          font-style: italic;
        }
        
        .example-vi {
          color: #6b7280;
          font-size: 14px;
        }
        
        .ipa-container {
          margin-top: 24px;
          padding-top: 24px;
          border-top: 2px solid #e5e7eb;
        }
        
        .result-count {
          padding: 8px 16px;
          background: white;
          color: #6b7280;
          font-size: 14px;
          text-align: center;
        }
        
        /* Tablet breakpoint */
        @media (min-width: 640px) {
          .words-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 16px;
            padding: 0 20px;
          }
          
          .word-card {
            padding: 20px;
          }
        }
        
        /* Desktop breakpoint */
        @media (min-width: 1024px) {
          .words-grid {
            grid-template-columns: repeat(3, 1fr);
            gap: 20px;
            padding: 0 24px;
          }
          
          .modal-overlay {
            align-items: center;
            justify-content: center;
            padding: 20px;
          }
          
          .modal-content {
            max-width: 800px;
            max-height: 85vh;
            border-radius: 16px;
            animation: slideIn 0.3s;
          }
          
          .word-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 6px 16px rgba(0,0,0,0.2);
          }
        }
        
        /* Large desktop */
        @media (min-width: 1280px) {
          .words-grid {
            grid-template-columns: repeat(4, 1fr);
          }
        }
      `}</style>

      <div className="word-list-container">
        <div style={{ height: "12vh" }}></div>

        <div className="content-wrapper">
          <div className="header-sticky">
            <input
              type="text"
              className="search-box"
              placeholder="🔍 Tìm kiếm từ vựng..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="result-count">Tìm thấy {filteredData.length} từ</div>

          <div className="words-grid">
            {filteredData.map((word, index) => (
              <div
                key={index}
                className="word-card"
                onClick={() => handleShowDetail(word)}
              >
                <div className="word-header">
                  <h3 className="word-title">{word.ZZ01}</h3>
                  <span className="word-id">#{word.id}</span>
                </div>
                <div className="word-type">{word.ZZ12}</div>
                <div className="word-meaning">{word.ZZ03}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {selectedWord && (
        <div className="modal-overlay" onClick={handleCloseDetail}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Chi tiết từ vựng</h2>
              <button className="close-btn" onClick={handleCloseDetail}>
                ✕
              </button>
            </div>

            <div className="modal-body">
              <div className="detail-section">
                <div className="detail-label">Từ vựng</div>
                <div className="detail-value-large">
                  {selectedWord.ZZ01} | {selectedWord.ZZ10}
                </div>
                <button
                  className="read-btn"
                  onClick={() => {
                    ReadMessage(
                      { imale: 0, ifemale: 2 },
                      selectedWord.ZZ01,
                      1,
                      [{ id: selectedWord.ZZ02 }]
                    );
                  }}
                >
                  🔊 Phát âm
                </button>
              </div>

              <div className="detail-section">
                <div className="detail-label">Từ loại</div>
                <div className="detail-value">{selectedWord.ZZ12}</div>
              </div>

              <div className="detail-section">
                <div className="detail-label">Nghĩa tiếng Việt</div>
                <div className="detail-value">{selectedWord.ZZ03}</div>
              </div>

              {selectedWord.ZZ04 && (
                <div className="detail-section">
                  <div className="detail-label">Ví dụ 1</div>
                  <div className="example-box">
                    <div className="example-en">{selectedWord.ZZ04}</div>
                    <div className="example-vi">{selectedWord.ZZ06}</div>
                  </div>
                  <button
                    className="read-btn"
                    onClick={() => {
                      ReadMessage(
                        { imale: 0, ifemale: 2 },
                        selectedWord.ZZ04,
                        1,
                        [{ id: selectedWord.ZZ05 }]
                      );
                    }}
                  >
                    🔊 Nghe ví dụ
                  </button>
                </div>
              )}

              {selectedWord.ZZ07 && (
                <div className="detail-section">
                  <div className="detail-label">Ví dụ 2</div>
                  <div className="example-box">
                    <div className="example-en">{selectedWord.ZZ07}</div>
                    <div className="example-vi">{selectedWord.ZZ09}</div>
                  </div>
                  <button
                    className="read-btn"
                    onClick={() => {
                      ReadMessage(
                        { imale: 0, ifemale: 2 },
                        selectedWord.ZZ07,
                        1,
                        [{ id: selectedWord.ZZ08 }]
                      );
                    }}
                  >
                    🔊 Nghe ví dụ
                  </button>
                </div>
              )}

              <div className="ipa-container">
                <IpaTransformer
                  text={selectedWord.ZZ11}
                  nextText={selectedWord.ZZ10}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
