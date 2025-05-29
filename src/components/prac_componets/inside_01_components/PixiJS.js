import { useRef, useState, useEffect } from "react";
import { Stage, Sprite, Graphics, Container } from "@pixi/react";

const PixiCanvas = ({ widthPixi = 800, heightPixi = 600 }) => {
  const [characterPosition, setCharacterPosition] = useState({
    x: 200,
    y: 200,
  });
  const [characterRotation, setCharacterRotation] = useState(0);
  const [alpha, setAlpha] = useState(1);
  const [animationFrame, setAnimationFrame] = useState(0);
  const targetPosition = useRef({ x: 200, y: 200 });
  const isMoving = useRef(false);
  const requestId = useRef(null);

  const backgroundUrl = "https://i.postimg.cc/9MtnC6PS/Map-Game-1.jpg";
  const characterSpeed = 2;

  // Function to draw the character (a cute chibi-style character)
  const drawCharacter = (g) => {
    g.clear();

    // Animation bounce effect when moving
    const bounceY = isMoving.current ? Math.sin(animationFrame * 0.5) * 3 : 0;

    // Body (main circle)
    g.beginFill(0x4a90e2); // Blue color
    g.drawCircle(0, bounceY, 20);
    g.endFill();

    // Head
    g.beginFill(0xffdbb5); // Skin color
    g.drawCircle(0, -25 + bounceY, 15);
    g.endFill();

    // Eyes
    g.beginFill(0x000000); // Black
    g.drawCircle(-5, -28 + bounceY, 2);
    g.drawCircle(5, -28 + bounceY, 2);
    g.endFill();

    // Eye highlights
    g.beginFill(0xffffff);
    g.drawCircle(-4, -29 + bounceY, 1);
    g.drawCircle(6, -29 + bounceY, 1);
    g.endFill();

    // Mouth
    g.lineStyle(1, 0x000000);
    g.arc(0, -22 + bounceY, 3, 0, Math.PI);

    // Arms (simple lines)
    g.lineStyle(3, 0xffdbb5);
    const armSwing = isMoving.current ? Math.sin(animationFrame * 0.3) * 10 : 0;
    g.moveTo(-15, -5 + bounceY);
    g.lineTo(-25 + armSwing, 5 + bounceY);
    g.moveTo(15, -5 + bounceY);
    g.lineTo(25 - armSwing, 5 + bounceY);

    // Legs (simple lines)
    const legSwing = isMoving.current ? Math.sin(animationFrame * 0.4) * 8 : 0;
    g.lineStyle(3, 0xffdbb5);
    g.moveTo(-8, 15 + bounceY);
    g.lineTo(-12 + legSwing, 30 + bounceY);
    g.moveTo(8, 15 + bounceY);
    g.lineTo(12 - legSwing, 30 + bounceY);

    // Hair
    g.beginFill(0x8b4513); // Brown hair
    g.drawCircle(-8, -35 + bounceY, 5);
    g.drawCircle(0, -38 + bounceY, 6);
    g.drawCircle(8, -35 + bounceY, 5);
    g.endFill();
  };

  // Function to draw the selection circle
  const drawSelectionCircle = (g) => {
    g.clear();
    g.lineStyle(4, 0xffff00, alpha);
    g.drawCircle(0, 0, 35);
  };

  const moveCharacter = (steps) => {
    let i = 0;
    const intervalId = setInterval(() => {
      if (i >= steps.length) {
        clearInterval(intervalId);
        isMoving.current = false;
        setAnimationFrame(0); // Reset animation
      } else {
        setCharacterPosition(steps[i]);
        setAnimationFrame((prev) => prev + 1); // Update animation frame
        i++;
      }
    }, 16);
  };

  const handleClick = (e) => {
    try {
      if (!isMoving.current && e && e.currentTarget) {
        const rect = e.currentTarget.getBoundingClientRect();
        const targetX = roundToNearest(e.clientX - rect.left, 2);
        const targetY = roundToNearest(e.clientY - rect.top, 2);
        targetPosition.current = { x: targetX, y: targetY };
        isMoving.current = true;
        console.log("Moving to:", targetX, targetY);

        const steps = countStep(
          roundToNearest(characterPosition.x, 2),
          roundToNearest(characterPosition.y, 2),
          targetX,
          targetY
        );
        moveCharacter(steps);
      }
    } catch (error) {
      console.error("Error in handleClick:", error);
    }
  };

  // Blinking effect for selection circle
  useEffect(() => {
    const intervalId = setInterval(() => {
      setAlpha((prevAlpha) => (prevAlpha === 1 ? 0.3 : 1));
    }, 500);
    return () => clearInterval(intervalId);
  }, []);

  // Animation loop for character movement
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

  return (
    <div>
      <div style={{ height: "9vh" }}></div>
      <div
        style={{
          overflow: "hidden",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          position: "relative",
          borderRadius: "10px",
          marginTop: "1%",
          border: "3px solid #4A90E2",
          boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
        }}
      >
        <Stage
          width={widthPixi}
          height={heightPixi}
          options={{ background: 0x87ceeb }}
          onClick={handleClick}
          onPointerDown={handleClick}
        >
          {/* Background image */}
          <Sprite
            image={backgroundUrl}
            width={widthPixi}
            height={heightPixi}
            x={0}
            y={0}
          />

          {/* Selection circle */}
          <Graphics
            x={characterPosition.x}
            y={characterPosition.y}
            draw={drawSelectionCircle}
          />

          {/* Character */}
          <Graphics
            x={characterPosition.x}
            y={characterPosition.y}
            draw={drawCharacter}
          />
        </Stage>

        {/* Game UI */}
        <div
          style={{
            position: "absolute",
            top: "10px",
            left: "10px",
            background: "rgba(0,0,0,0.7)",
            color: "white",
            padding: "10px",
            borderRadius: "5px",
            fontFamily: "Arial, sans-serif",
          }}
        >
          <div>🎮 Click anywhere to move!</div>
          <div>
            📍 Position: ({Math.round(characterPosition.x)},{" "}
            {Math.round(characterPosition.y)})
          </div>
          <div>{isMoving.current ? "🏃 Moving..." : "🧍 Idle"}</div>
        </div>
      </div>
    </div>
  );
};

export default PixiCanvas;

function roundToNearest(num, NearestNum) {
  return Math.round(num / NearestNum) * NearestNum;
}

function countStep(n, m, n1, m1) {
  let res = [{ x: n, y: m }];
  do {
    let x = res[res.length - 1].x;
    let y = res[res.length - 1].y;

    // Điều chỉnh giá trị của x
    if (n1 - x > 0) {
      x += 2;
    } else if (n1 - x < 0) {
      x -= 2;
    }

    // Điều chỉnh giá trị của y
    if (m1 - y > 0) {
      y += 2;
    } else if (m1 - y < 0) {
      y -= 2;
    }

    res.push({ x, y });
  } while (res[res.length - 1].x !== n1 || res[res.length - 1].y !== m1);

  return res;
}
