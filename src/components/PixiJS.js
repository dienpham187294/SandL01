import { useRef, useState, useEffect } from "react";
import { Stage, Sprite, Graphics } from "@pixi/react";

const PixiCanvas = ({ widthPixi = 800, heightPixi = 600 }) => {
  const [bunnyPosition, setBunnyPosition] = useState({ x: 200, y: 200 });
  const [BunnyRotation, setBunnyRotation] = useState(0);
  const [alpha, setAlpha] = useState(1); // State for alpha transparency
  const targetPosition = useRef({ x: 200, y: 200 });
  const isMoving = useRef(false);
  const requestId = useRef(null);

  const bunnyUrl = "https://pixijs.io/pixi-react/img/bunny.png";
  const backgroundUrl = "https://i.postimg.cc/9MtnC6PS/Map-Game-1.jpg";
  const characterSpeed = 2;
  // Function to draw the yellow circle with dynamic alpha for blinking effect
  const drawCircle = (g) => {
    g.clear();
    g.lineStyle(4, 0xffff00, alpha); // 4px stroke width, yellow color, dynamic alpha
    g.drawCircle(0, 0, 35); // Draw a circle with radius 35
  };

  const moveCharacter = (sets) => {
    let i = 0;
    const intervalId = setInterval(() => {
      if (i >= sets.length) {
        clearInterval(intervalId); // Correct syntax to clear the interval
        isMoving.current = false; // Stop the movement
      } else {
        setBunnyRotation((prevRotation) => prevRotation + 0.05);
        setBunnyPosition(sets[i]); // Update the position
        i++; // Move to the next set in the array
      }
    }, 16); // Run the interval every 16 ms (~60fps)
  };

  const handleClick = (e) => {
    if (!isMoving.current) {
      const rect = e.currentTarget.getBoundingClientRect();
      const targetX = roundToNearest(e.clientX - rect.left, 2);
      const targetY = roundToNearest(e.clientY - rect.top, 2);
      targetPosition.current = { x: targetX, y: targetY };
      isMoving.current = true;
      moveCharacter(
        countStep(
          roundToNearest(bunnyPosition.x, 2),
          roundToNearest(bunnyPosition.y, 2),
          targetX,
          targetY
        )
      );
    }
  };
  // Update alpha transparency continuously to create a blinking effect
  useEffect(() => {
    const intervalId = setInterval(() => {
      setAlpha((prevAlpha) => (prevAlpha === 1 ? 0.3 : 1)); // Toggle between 1 and 0.3
    }, 500); // Blink every 500ms

    return () => clearInterval(intervalId); // Clean up the interval on component unmount
  }, []);

  return (
    <div
      style={{
        overflow: "hidden",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
        borderRadius: "10px",
        marginTop: "1%",
      }}
    >
      <Stage
        width={widthPixi}
        height={heightPixi}
        options={{ background: 0x1099bb }}
        onClick={handleClick}
      >
        {/* Background image as a Sprite */}
        <Sprite
          image={backgroundUrl}
          width={widthPixi}
          height={heightPixi}
          x={0}
          y={0}
        />
        <Graphics x={bunnyPosition.x} y={bunnyPosition.y} draw={drawCircle} />
        {/* Bunny sprite, moves on click */}
        <Sprite
          image={bunnyUrl}
          width={50}
          height={50}
          x={bunnyPosition.x}
          y={bunnyPosition.y}
          anchor={0.5}
          rotation={BunnyRotation}
        />
      </Stage>
      {/* <div>{JSON.stringify(bunnyPosition)}</div> */}
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
