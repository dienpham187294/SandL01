import { useRef, useState, useEffect } from "react";
import { Stage, Sprite, Graphics, Container } from "@pixi/react";

const PixiCanvas = () => {
  const [characterPosition, setCharacterPosition] = useState({
    x: 100,
    y: 100,
  });
  const [animationFrame, setAnimationFrame] = useState(0);
  const [currentMapSection, setCurrentMapSection] = useState(1);
  const [showCoordinatePopup, setShowCoordinatePopup] = useState(false);
  const [clickedCoordinate, setClickedCoordinate] = useState({ x: 0, y: 0 });

  const targetPosition = useRef({ x: 100, y: 100 });
  const isMoving = useRef(false);

  // Kích thước bản đồ đầy đủ
  const MAP_FULL_WIDTH = 800;
  const MAP_FULL_HEIGHT = 600;

  // Kích thước mỗi phần (chia thành 2 cột x 3 hàng)
  const SECTION_WIDTH = 400;
  const SECTION_HEIGHT = 200;

  const backgroundUrl = "https://i.postimg.cc/9MtnC6PS/Map-Game-1.jpg";

  // Tính toán viewport offset dựa trên section (1-6)
  const getViewportOffset = (section) => {
    const offsets = {
      1: { x: 0, y: 0 }, // Top-left
      2: { x: 400, y: 0 }, // Top-right
      3: { x: 0, y: 200 }, // Middle-left
      4: { x: 400, y: 200 }, // Middle-right
      5: { x: 0, y: 400 }, // Bottom-left
      6: { x: 400, y: 400 }, // Bottom-right
    };
    return offsets[section] || { x: 0, y: 0 };
  };

  const viewportOffset = getViewportOffset(currentMapSection);

  // Vẽ nhân vật
  const drawCharacter = (g) => {
    g.clear();
    const bounceY = isMoving.current ? Math.sin(animationFrame * 0.5) * 3 : 0;

    // Body
    g.beginFill(0x4a90e2);
    g.drawCircle(0, bounceY, 20);
    g.endFill();

    // Head
    g.beginFill(0xffdbb5);
    g.drawCircle(0, -25 + bounceY, 15);
    g.endFill();

    // Eyes
    g.beginFill(0x000000);
    g.drawCircle(-5, -28 + bounceY, 2);
    g.drawCircle(5, -28 + bounceY, 2);
    g.endFill();

    // Smile
    g.lineStyle(1, 0x000000);
    g.arc(0, -23 + bounceY, 5, 0, Math.PI, false);
  };

  // Di chuyển nhân vật
  const moveCharacter = (steps) => {
    let i = 0;
    const intervalId = setInterval(() => {
      if (i >= steps.length) {
        clearInterval(intervalId);
        isMoving.current = false;
        setAnimationFrame(0);
        // Hiện popup khi đến điểm đích
        setShowCoordinatePopup(true);
      } else {
        setCharacterPosition(steps[i]);
        setAnimationFrame((prev) => prev + 1);
        i++;
      }
    }, 16);
  };

  // Xử lý click trên map
  const handleClick = (e) => {
    try {
      if (!isMoving.current && e && e.currentTarget) {
        const rect = e.currentTarget.getBoundingClientRect();
        const clickX = Math.round(e.clientX - rect.left);
        const clickY = Math.round(e.clientY - rect.top);

        // Chuyển đổi tọa độ click sang tọa độ map thực tế (800x600)
        const realMapX = clickX + viewportOffset.x;
        const realMapY = clickY + viewportOffset.y;

        // Giới hạn trong phạm vi map
        const targetX = Math.max(0, Math.min(MAP_FULL_WIDTH, realMapX));
        const targetY = Math.max(0, Math.min(MAP_FULL_HEIGHT, realMapY));

        setClickedCoordinate({ x: targetX, y: targetY });
        targetPosition.current = { x: targetX, y: targetY };
        isMoving.current = true;

        const steps = countStep(
          characterPosition.x,
          characterPosition.y,
          targetX,
          targetY
        );

        moveCharacter(steps);
      }
    } catch (error) {
      console.error("Error in handleClick:", error);
    }
  };

  // Animation loop
  useEffect(() => {
    if (isMoving.current) {
      const animationLoop = () => {
        setAnimationFrame((prev) => prev + 1);
        if (isMoving.current) {
          requestAnimationFrame(animationLoop);
        }
      };
      requestAnimationFrame(animationLoop);
    }
  }, [isMoving.current]);

  // Kiểm tra nếu nhân vật nằm trong viewport hiện tại
  const isCharacterInCurrentView = () => {
    return (
      characterPosition.x >= viewportOffset.x &&
      characterPosition.x <= viewportOffset.x + SECTION_WIDTH &&
      characterPosition.y >= viewportOffset.y &&
      characterPosition.y <= viewportOffset.y + SECTION_HEIGHT
    );
  };

  const isMobile = window.innerWidth <= 768;

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        overflow: "hidden",
        fontFamily: "Arial, sans-serif",
      }}
    >
      {/* Header Bar */}
      <div
        style={{
          height: isMobile ? "50px" : "60px",
          background: "rgba(0,0,0,0.8)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 15px",
          color: "white",
          boxShadow: "0 2px 10px rgba(0,0,0,0.5)",
        }}
      >
        <div
          style={{ fontSize: isMobile ? "16px" : "20px", fontWeight: "bold" }}
        >
          🎮 Map Explorer
        </div>
        <div style={{ fontSize: isMobile ? "11px" : "14px" }}>
          📍 Vị trí: ({Math.round(characterPosition.x)},{" "}
          {Math.round(characterPosition.y)})
        </div>
      </div>

      {/* Main Content */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          gap: "10px",
          padding: "10px",
          overflow: "hidden",
        }}
      >
        {/* Left/Top Sidebar - Map Navigation */}
        <div
          style={{
            width: isMobile ? "100%" : "180px",
            minHeight: isMobile ? "auto" : "0",
            background: "rgba(255,255,255,0.95)",
            borderRadius: "12px",
            padding: "15px",
            boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          <div
            style={{
              fontSize: "16px",
              fontWeight: "bold",
              textAlign: "center",
              color: "#333",
              marginBottom: "5px",
            }}
          >
            🗺️ Chọn khu vực
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: isMobile
                ? "repeat(6, 1fr)"
                : "repeat(2, 1fr)",
              gap: "8px",
            }}
          >
            {[1, 2, 3, 4, 5, 6].map((section) => (
              <button
                key={section}
                onClick={() => setCurrentMapSection(section)}
                style={{
                  padding: isMobile ? "8px 4px" : "12px 8px",
                  fontSize: isMobile ? "13px" : "15px",
                  border: "none",
                  borderRadius: "8px",
                  background:
                    currentMapSection === section
                      ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                      : "#e0e0e0",
                  color: currentMapSection === section ? "white" : "#333",
                  cursor: "pointer",
                  fontWeight: currentMapSection === section ? "bold" : "normal",
                  transition: "all 0.3s ease",
                  boxShadow:
                    currentMapSection === section
                      ? "0 4px 12px rgba(102, 126, 234, 0.5)"
                      : "0 2px 5px rgba(0,0,0,0.1)",
                  transform:
                    currentMapSection === section ? "scale(1.05)" : "scale(1)",
                }}
                onMouseEnter={(e) => {
                  if (!isMobile)
                    e.currentTarget.style.transform = "scale(1.05)";
                }}
                onMouseLeave={(e) => {
                  if (!isMobile)
                    e.currentTarget.style.transform =
                      currentMapSection === section
                        ? "scale(1.05)"
                        : "scale(1)";
                }}
              >
                {section}
              </button>
            ))}
          </div>

          {!isMobile && (
            <div
              style={{
                marginTop: "10px",
                padding: "10px",
                background: "rgba(102, 126, 234, 0.1)",
                borderRadius: "8px",
                fontSize: "12px",
                color: "#333",
              }}
            >
              <div>
                <strong>Khu vực:</strong> {currentMapSection}/6
              </div>
              <div>
                <strong>Trạng thái:</strong>{" "}
                {isMoving.current ? "🏃 Di chuyển" : "🧍 Đứng yên"}
              </div>
              <div
                style={{ marginTop: "5px", fontSize: "11px", color: "#666" }}
              >
                {isCharacterInCurrentView()
                  ? "✅ Nhân vật trong view"
                  : "❌ Nhân vật ngoài view"}
              </div>
            </div>
          )}
        </div>

        {/* Center - Game Canvas */}
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(0,0,0,0.3)",
            borderRadius: "12px",
            overflow: "hidden",
            boxShadow: "inset 0 0 30px rgba(0,0,0,0.5)",
            position: "relative",
          }}
        >
          <Stage
            width={SECTION_WIDTH}
            height={SECTION_HEIGHT}
            onClick={handleClick}
            options={{ backgroundColor: 0x000000 }}
            style={{
              cursor: "pointer",
              maxWidth: "100%",
              maxHeight: "100%",
              borderRadius: "8px",
            }}
          >
            <Container>
              {/* Background - hiển thị phần tương ứng của map */}
              <Sprite
                image={backgroundUrl}
                width={MAP_FULL_WIDTH}
                height={MAP_FULL_HEIGHT}
                x={-viewportOffset.x}
                y={-viewportOffset.y}
              />

              {/* Character - chỉ hiển thị nếu trong viewport */}
              {isCharacterInCurrentView() && (
                <Graphics
                  draw={drawCharacter}
                  x={characterPosition.x - viewportOffset.x}
                  y={characterPosition.y - viewportOffset.y}
                />
              )}
            </Container>
          </Stage>

          {/* Overlay info */}
          <div
            style={{
              position: "absolute",
              top: "10px",
              left: "10px",
              background: "rgba(0,0,0,0.7)",
              color: "white",
              padding: "8px 12px",
              borderRadius: "8px",
              fontSize: "12px",
            }}
          >
            Khu vực {currentMapSection}
          </div>
        </div>

        {/* Right/Bottom Sidebar - Info & Controls */}
        <div
          style={{
            width: isMobile ? "100%" : "180px",
            minHeight: isMobile ? "auto" : "0",
            background: "rgba(255,255,255,0.95)",
            borderRadius: "12px",
            padding: "15px",
            boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          <div
            style={{
              fontSize: "16px",
              fontWeight: "bold",
              textAlign: "center",
              color: "#333",
              marginBottom: "5px",
            }}
          >
            🎯 Điều khiển
          </div>

          <button
            style={{
              padding: "12px",
              border: "none",
              borderRadius: "8px",
              background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
              color: "white",
              cursor: "pointer",
              fontWeight: "bold",
              fontSize: "14px",
              transition: "all 0.3s ease",
              boxShadow: "0 4px 10px rgba(245, 87, 108, 0.3)",
            }}
            onMouseEnter={(e) => {
              if (!isMobile) e.currentTarget.style.transform = "scale(1.05)";
            }}
            onMouseLeave={(e) => {
              if (!isMobile) e.currentTarget.style.transform = "scale(1)";
            }}
            onClick={() => {
              setCharacterPosition({ x: 200, y: 100 });
              setCurrentMapSection(1);
            }}
          >
            🔄 Reset
          </button>

          <div
            style={{
              padding: "10px",
              background: "rgba(102, 126, 234, 0.1)",
              borderRadius: "8px",
              fontSize: "11px",
              color: "#333",
              lineHeight: "1.6",
            }}
          >
            <div style={{ fontWeight: "bold", marginBottom: "5px" }}>
              💡 Hướng dẫn:
            </div>
            <div>• Click vào map để di chuyển</div>
            <div>• Chọn số 1-6 để đổi view</div>
            <div>
              • Map: {MAP_FULL_WIDTH}x{MAP_FULL_HEIGHT}
            </div>
            <div>
              • View: {SECTION_WIDTH}x{SECTION_HEIGHT}
            </div>
          </div>

          {!isMobile && (
            <div
              style={{
                marginTop: "auto",
                padding: "8px",
                background: "rgba(255,193,7,0.2)",
                borderRadius: "8px",
                fontSize: "10px",
                color: "#666",
                textAlign: "center",
              }}
            >
              Chia map thành 6 phần đều nhau
            </div>
          )}
        </div>
      </div>

      {/* Coordinate Popup Modal */}
      {showCoordinatePopup && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            backdropFilter: "blur(5px)",
          }}
        >
          <div
            style={{
              background: "white",
              borderRadius: "16px",
              padding: "30px",
              maxWidth: "400px",
              width: "90%",
              boxShadow: "0 10px 40px rgba(0,0,0,0.3)",
              animation: "popupSlideIn 0.3s ease-out",
            }}
          >
            <div
              style={{
                fontSize: "24px",
                textAlign: "center",
                marginBottom: "20px",
              }}
            >
              🎯
            </div>
            <div
              style={{
                fontSize: "18px",
                fontWeight: "bold",
                textAlign: "center",
                marginBottom: "15px",
                color: "#333",
              }}
            >
              Đã đến điểm đích!
            </div>
            <div
              style={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                color: "white",
                padding: "15px",
                borderRadius: "10px",
                marginBottom: "20px",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: "14px", marginBottom: "5px" }}>
                📍 Tọa độ:
              </div>
              <div style={{ fontSize: "24px", fontWeight: "bold" }}>
                ({clickedCoordinate.x}, {clickedCoordinate.y})
              </div>
            </div>
            <button
              onClick={() => setShowCoordinatePopup(false)}
              style={{
                width: "100%",
                padding: "14px",
                border: "none",
                borderRadius: "10px",
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                color: "white",
                fontSize: "16px",
                fontWeight: "bold",
                cursor: "pointer",
                transition: "all 0.3s ease",
                boxShadow: "0 4px 15px rgba(102, 126, 234, 0.4)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.02)";
                e.currentTarget.style.boxShadow =
                  "0 6px 20px rgba(102, 126, 234, 0.6)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.boxShadow =
                  "0 4px 15px rgba(102, 126, 234, 0.4)";
              }}
            >
              ✓ Đồng ý
            </button>
          </div>
        </div>
      )}

      {/* CSS Animations */}
      <style>{`
        @keyframes popupSlideIn {
          from {
            transform: scale(0.8) translateY(-20px);
            opacity: 0;
          }
          to {
            transform: scale(1) translateY(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

// Helper function - di chuyển theo đường chéo mượt mà
function countStep(x1, y1, x2, y2) {
  const steps = [];
  const distance = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
  const numSteps = Math.ceil(distance / 2); // Di chuyển 2 pixel mỗi bước

  for (let i = 0; i <= numSteps; i++) {
    const t = i / numSteps;
    steps.push({
      x: Math.round(x1 + (x2 - x1) * t),
      y: Math.round(y1 + (y2 - y1) * t),
    });
  }

  return steps;
}

export default PixiCanvas;
