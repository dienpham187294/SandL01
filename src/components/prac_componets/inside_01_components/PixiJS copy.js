import { useRef, useState, useEffect } from "react";
import { Stage, Sprite, Graphics, Container, Text } from "@pixi/react";

const PixiCanvas = ({ widthPixi = 1000, heightPixi = 700 }) => {
  const [characterPosition, setCharacterPosition] = useState({
    x: 200,
    y: 200,
  });
  const [characterRotation, setCharacterRotation] = useState(0);
  const [alpha, setAlpha] = useState(1);
  const [animationFrame, setAnimationFrame] = useState(0);
  const [gameState, setGameState] = useState({
    money: 500,
    level: 1,
    experience: 0,
    energy: 100,
    inventory: {
      seeds: { carrot: 5, corn: 3, tomato: 2 },
      crops: { carrot: 0, corn: 0, tomato: 0 },
      tools: { wateringCan: 1, hoe: 1, fishingRod: 1 },
    },
  });

  const [crops, setCrops] = useState([]);
  const [animals, setAnimals] = useState([
    {
      id: 1,
      type: "chicken",
      x: 650,
      y: 150,
      happiness: 80,
      lastFed: Date.now(),
    },
    { id: 2, type: "cow", x: 700, y: 180, happiness: 70, lastFed: Date.now() },
    { id: 3, type: "pig", x: 750, y: 200, happiness: 90, lastFed: Date.now() },
  ]);

  const [buildings, setBuildings] = useState([
    { id: 1, type: "house", x: 100, y: 100, level: 1 },
    { id: 2, type: "barn", x: 650, y: 120, level: 1 },
    { id: 3, type: "shop", x: 850, y: 100, level: 1 },
    { id: 4, type: "fishing_spot", x: 200, y: 500, level: 1 },
  ]);

  const [activeZone, setActiveZone] = useState(null);
  const [selectedTool, setSelectedTool] = useState("hoe");
  const [notifications, setNotifications] = useState([]);
  const [weather, setWeather] = useState("sunny");
  const [timeOfDay, setTimeOfDay] = useState("morning");

  const targetPosition = useRef({ x: 200, y: 200 });
  const isMoving = useRef(false);
  const backgroundUrl = "https://i.postimg.cc/9MtnC6PS/Map-Game-1.jpg";
  const characterSpeed = 2;

  // Game zones definition
  const gameZones = [
    {
      name: "crop_field",
      x: 300,
      y: 300,
      width: 200,
      height: 150,
      color: 0x90ee90,
    },
    {
      name: "animal_area",
      x: 600,
      y: 120,
      width: 200,
      height: 150,
      color: 0xdeb887,
    },
    {
      name: "fishing_area",
      x: 150,
      y: 450,
      width: 150,
      height: 100,
      color: 0x87ceeb,
    },
    {
      name: "market_area",
      x: 800,
      y: 80,
      width: 120,
      height: 120,
      color: 0xffd700,
    },
    {
      name: "forest_area",
      x: 50,
      y: 350,
      width: 100,
      height: 200,
      color: 0x228b22,
    },
  ];

  // Add notification function
  const addNotification = (message, type = "info") => {
    const newNotification = {
      id: Date.now(),
      message,
      type,
      timestamp: Date.now(),
    };
    setNotifications((prev) => [...prev, newNotification]);
    setTimeout(() => {
      setNotifications((prev) =>
        prev.filter((n) => n.id !== newNotification.id)
      );
    }, 3000);
  };

  // Weather and time system
  useEffect(() => {
    const weatherInterval = setInterval(() => {
      const weathers = ["sunny", "cloudy", "rainy"];
      setWeather(weathers[Math.floor(Math.random() * weathers.length)]);
    }, 30000); // Change weather every 30 seconds

    const timeInterval = setInterval(() => {
      const times = ["morning", "afternoon", "evening", "night"];
      setTimeOfDay((prev) => {
        const currentIndex = times.indexOf(prev);
        return times[(currentIndex + 1) % times.length];
      });
    }, 20000); // Change time every 20 seconds

    return () => {
      clearInterval(weatherInterval);
      clearInterval(timeInterval);
    };
  }, []);

  // Animal care system
  useEffect(() => {
    const animalInterval = setInterval(() => {
      setAnimals((prev) =>
        prev.map((animal) => ({
          ...animal,
          happiness: Math.max(0, animal.happiness - 1), // Decrease happiness over time
        }))
      );
    }, 5000);

    return () => clearInterval(animalInterval);
  }, []);

  // Crop growth system
  useEffect(() => {
    const cropInterval = setInterval(() => {
      setCrops((prev) =>
        prev.map((crop) => {
          if (crop.stage < 3) {
            return { ...crop, stage: crop.stage + 1 };
          }
          return crop;
        })
      );
    }, 10000); // Crops grow every 10 seconds

    return () => clearInterval(cropInterval);
  }, []);

  // Character drawing function
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

    // Tool in hand
    if (selectedTool === "hoe") {
      g.lineStyle(3, 0x8b4513);
      g.moveTo(25, -10 + bounceY);
      g.lineTo(35, -5 + bounceY);
      g.lineTo(30, 5 + bounceY);
    } else if (selectedTool === "wateringCan") {
      g.beginFill(0x4169e1);
      g.drawRect(25, -5 + bounceY, 8, 10);
      g.endFill();
    }
  };

  // Zone drawing function
  const drawZones = (g) => {
    g.clear();
    gameZones.forEach((zone) => {
      if (activeZone === zone.name) {
        g.beginFill(zone.color, 0.3);
        g.lineStyle(3, zone.color, 1);
      } else {
        g.beginFill(zone.color, 0.1);
        g.lineStyle(1, zone.color, 0.5);
      }
      g.drawRect(zone.x, zone.y, zone.width, zone.height);
      g.endFill();
    });
  };

  // Building drawing function
  const drawBuildings = (g) => {
    g.clear();
    buildings.forEach((building) => {
      switch (building.type) {
        case "house":
          g.beginFill(0x8b4513);
          g.drawRect(building.x, building.y, 60, 50);
          g.beginFill(0xff0000);
          g.moveTo(building.x, building.y);
          g.lineTo(building.x + 30, building.y - 20);
          g.lineTo(building.x + 60, building.y);
          g.endFill();
          break;
        case "barn":
          g.beginFill(0xdeb887);
          g.drawRect(building.x, building.y, 80, 60);
          g.beginFill(0x8b0000);
          g.drawRect(building.x, building.y - 10, 80, 10);
          g.endFill();
          break;
        case "shop":
          g.beginFill(0xffd700);
          g.drawRect(building.x, building.y, 50, 40);
          g.beginFill(0x00ff00);
          g.drawRect(building.x + 20, building.y + 10, 10, 20);
          g.endFill();
          break;
        case "fishing_spot":
          g.beginFill(0x87ceeb);
          g.drawCircle(building.x, building.y, 30);
          g.beginFill(0x4169e1);
          g.drawCircle(building.x, building.y, 20);
          g.endFill();
          break;
      }
    });
  };

  // Crop drawing function
  const drawCrops = (g) => {
    g.clear();
    crops.forEach((crop) => {
      const size = 5 + crop.stage * 3;
      const colors = {
        carrot: [0xffa500, 0xff8c00, 0xff6347, 0xff4500],
        corn: [0x90ee90, 0x32cd32, 0xffd700, 0xffa500],
        tomato: [0x90ee90, 0x32cd32, 0xff6347, 0xff0000],
      };

      g.beginFill(colors[crop.type][crop.stage]);
      g.drawCircle(crop.x, crop.y, size);
      g.endFill();

      if (crop.stage === 3) {
        // Add sparkle effect for ready crops
        g.beginFill(0xffffff, 0.8);
        g.drawCircle(crop.x - 3, crop.y - 3, 2);
        g.drawCircle(crop.x + 3, crop.y + 3, 2);
        g.endFill();
      }
    });
  };

  // Animal drawing function
  const drawAnimals = (g) => {
    g.clear();
    animals.forEach((animal) => {
      let color, size;
      switch (animal.type) {
        case "chicken":
          color = 0xffffff;
          size = 8;
          break;
        case "cow":
          color = 0x000000;
          size = 15;
          break;
        case "pig":
          color = 0xffc0cb;
          size = 12;
          break;
      }

      g.beginFill(color);
      g.drawCircle(animal.x, animal.y, size);
      g.endFill();

      // Happiness indicator
      const happinessColor =
        animal.happiness > 70
          ? 0x00ff00
          : animal.happiness > 40
          ? 0xffff00
          : 0xff0000;
      g.beginFill(happinessColor);
      g.drawCircle(animal.x, animal.y - size - 5, 3);
      g.endFill();
    });
  };

  // Weather effects drawing
  const drawWeatherEffects = (g) => {
    g.clear();
    if (weather === "rainy") {
      g.lineStyle(1, 0x87ceeb, 0.6);
      for (let i = 0; i < 50; i++) {
        const x = Math.random() * widthPixi;
        const y =
          (Math.random() * heightPixi + animationFrame * 2) % heightPixi;
        g.moveTo(x, y);
        g.lineTo(x - 2, y + 10);
      }
    }
  };

  // Zone detection
  const getZoneAtPosition = (x, y) => {
    return gameZones.find(
      (zone) =>
        x >= zone.x &&
        x <= zone.x + zone.width &&
        y >= zone.y &&
        y <= zone.y + zone.height
    );
  };

  // Interaction handlers
  const handleZoneInteraction = (zoneName, x, y) => {
    switch (zoneName) {
      case "crop_field":
        if (selectedTool === "hoe" && gameState.inventory.seeds.carrot > 0) {
          const newCrop = {
            id: Date.now(),
            type: "carrot",
            x: x,
            y: y,
            stage: 0,
            plantedAt: Date.now(),
          };
          setCrops((prev) => [...prev, newCrop]);
          setGameState((prev) => ({
            ...prev,
            inventory: {
              ...prev.inventory,
              seeds: {
                ...prev.inventory.seeds,
                carrot: prev.inventory.seeds.carrot - 1,
              },
            },
          }));
          addNotification("🥕 Đã trồng cà rót!", "success");
        }
        break;

      case "animal_area":
        const nearbyAnimal = animals.find(
          (animal) => Math.abs(animal.x - x) < 30 && Math.abs(animal.y - y) < 30
        );
        if (nearbyAnimal) {
          setAnimals((prev) =>
            prev.map((animal) =>
              animal.id === nearbyAnimal.id
                ? {
                    ...animal,
                    happiness: Math.min(100, animal.happiness + 20),
                    lastFed: Date.now(),
                  }
                : animal
            )
          );
          addNotification(`🐾 Đã cho ${nearbyAnimal.type} ăn!`, "success");
        }
        break;

      case "fishing_area":
        if (selectedTool === "fishingRod") {
          const fishCaught = Math.random() > 0.5;
          if (fishCaught) {
            setGameState((prev) => ({
              ...prev,
              money: prev.money + 20,
              experience: prev.experience + 5,
            }));
            addNotification("🐟 Đã câu được cá! +20 vàng", "success");
          } else {
            addNotification("🎣 Không có cá nào cắn câu...", "info");
          }
        }
        break;

      case "market_area":
        // Simple selling mechanism
        const totalCrops = Object.values(gameState.inventory.crops).reduce(
          (a, b) => a + b,
          0
        );
        if (totalCrops > 0) {
          const earnings = totalCrops * 15;
          setGameState((prev) => ({
            ...prev,
            money: prev.money + earnings,
            inventory: {
              ...prev.inventory,
              crops: { carrot: 0, corn: 0, tomato: 0 },
            },
          }));
          addNotification(`💰 Đã bán nông sản! +${earnings} vàng`, "success");
        }
        break;

      case "forest_area":
        // Random resource gathering
        const resources = ["wood", "stone", "herbs"];
        const found = resources[Math.floor(Math.random() * resources.length)];
        addNotification(`🌲 Đã tìm thấy ${found}!`, "success");
        break;
    }
  };

  // Harvest crops
  const harvestCrop = (crop) => {
    if (crop.stage === 3) {
      setCrops((prev) => prev.filter((c) => c.id !== crop.id));
      setGameState((prev) => ({
        ...prev,
        inventory: {
          ...prev.inventory,
          crops: {
            ...prev.inventory.crops,
            [crop.type]: prev.inventory.crops[crop.type] + 1,
          },
        },
        experience: prev.experience + 10,
      }));
      addNotification(`🌾 Đã thu hoạch ${crop.type}!`, "success");
    }
  };

  // Movement functions
  const moveCharacter = (steps) => {
    let i = 0;
    const intervalId = setInterval(() => {
      if (i >= steps.length) {
        clearInterval(intervalId);
        isMoving.current = false;
        setAnimationFrame(0);

        // Check for zone interactions
        const zone = getZoneAtPosition(
          characterPosition.x,
          characterPosition.y
        );
        setActiveZone(zone?.name || null);
      } else {
        setCharacterPosition(steps[i]);
        setAnimationFrame((prev) => prev + 1);
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

        // Check if clicking on a ready crop
        const clickedCrop = crops.find(
          (crop) =>
            Math.abs(crop.x - targetX) < 15 &&
            Math.abs(crop.y - targetY) < 15 &&
            crop.stage === 3
        );

        if (clickedCrop) {
          harvestCrop(clickedCrop);
          return;
        }

        targetPosition.current = { x: targetX, y: targetY };
        isMoving.current = true;

        const steps = countStep(
          roundToNearest(characterPosition.x, 2),
          roundToNearest(characterPosition.y, 2),
          targetX,
          targetY
        );
        moveCharacter(steps);

        // Handle zone interactions
        const zone = getZoneAtPosition(targetX, targetY);
        if (zone) {
          setTimeout(() => {
            handleZoneInteraction(zone.name, targetX, targetY);
          }, steps.length * 16);
        }
      }
    } catch (error) {
      console.error("Error in handleClick:", error);
    }
  };

  // Selection circle drawing
  const drawSelectionCircle = (g) => {
    g.clear();
    g.lineStyle(4, 0xffff00, alpha);
    g.drawCircle(0, 0, 35);
  };

  // Effects
  useEffect(() => {
    const intervalId = setInterval(() => {
      setAlpha((prevAlpha) => (prevAlpha === 1 ? 0.3 : 1));
    }, 500);
    return () => clearInterval(intervalId);
  }, []);

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
    <div style={{ fontFamily: "Arial, sans-serif", marginTop: "20vh" }}>
      {/* Top UI Bar */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "10px",
          background: "linear-gradient(90deg, #4a90e2, #67b26f)",
          color: "white",
          borderRadius: "10px",
          marginBottom: "10px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.3)",
        }}
      >
        <div style={{ display: "flex", gap: "20px" }}>
          <div>💰 {gameState.money}</div>
          <div>⭐ Level {gameState.level}</div>
          <div>🔋 {gameState.energy}/100</div>
          <div>📈 EXP: {gameState.experience}</div>
        </div>
        <div style={{ display: "flex", gap: "15px" }}>
          <div>
            {weather === "sunny" ? "☀️" : weather === "cloudy" ? "☁️" : "🌧️"}{" "}
            {weather}
          </div>
          <div>
            {timeOfDay === "morning"
              ? "🌅"
              : timeOfDay === "afternoon"
              ? "☀️"
              : timeOfDay === "evening"
              ? "🌅"
              : "🌙"}{" "}
            {timeOfDay}
          </div>
        </div>
      </div>

      {/* Tool Selection */}
      <div
        style={{
          display: "flex",
          gap: "10px",
          marginBottom: "10px",
          padding: "10px",
          background: "rgba(255,255,255,0.9)",
          borderRadius: "8px",
          boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
        }}
      >
        <span style={{ fontWeight: "bold" }}>Công cụ:</span>
        {["hoe", "wateringCan", "fishingRod"].map((tool) => (
          <button
            key={tool}
            onClick={() => setSelectedTool(tool)}
            style={{
              padding: "5px 10px",
              border:
                selectedTool === tool ? "2px solid #4a90e2" : "1px solid #ccc",
              borderRadius: "5px",
              background: selectedTool === tool ? "#e3f2fd" : "white",
              cursor: "pointer",
            }}
          >
            {tool === "hoe"
              ? "🪓 Cuốc"
              : tool === "wateringCan"
              ? "💧 Tưới"
              : "🎣 Câu cá"}
          </button>
        ))}
      </div>

      {/* Game Canvas */}
      <div
        style={{
          overflow: "hidden",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          position: "relative",
          borderRadius: "15px",
          border: "3px solid #4A90E2",
          boxShadow: "0 6px 20px rgba(0,0,0,0.3)",
          background: "linear-gradient(45deg, #87ceeb, #98fb98)",
        }}
      >
        <Stage
          width={widthPixi}
          height={heightPixi}
          options={{ background: 0x87ceeb }}
          onClick={handleClick}
          onPointerDown={handleClick}
        >
          {/* Background */}
          <Sprite
            image={backgroundUrl}
            width={widthPixi}
            height={heightPixi}
            x={0}
            y={0}
          />

          {/* Game Zones */}
          <Graphics draw={drawZones} />

          {/* Buildings */}
          <Graphics draw={drawBuildings} />

          {/* Crops */}
          <Graphics draw={drawCrops} />

          {/* Animals */}
          <Graphics draw={drawAnimals} />

          {/* Weather Effects */}
          <Graphics draw={drawWeatherEffects} />

          {/* Selection Circle */}
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

        {/* Game Info Panel */}
        <div
          style={{
            position: "absolute",
            top: "15px",
            left: "15px",
            background: "rgba(0,0,0,0.85)",
            color: "white",
            padding: "15px",
            borderRadius: "10px",
            minWidth: "200px",
            fontSize: "12px",
          }}
        >
          <div style={{ fontWeight: "bold", marginBottom: "8px" }}>
            🎮 Thông tin Game
          </div>
          <div>
            📍 Vị trí: ({Math.round(characterPosition.x)},{" "}
            {Math.round(characterPosition.y)})
          </div>
          <div>{isMoving.current ? "🏃 Đang di chuyển..." : "🧍 Đứng yên"}</div>
          <div style={{ marginTop: "8px", fontWeight: "bold" }}>
            Khu vực hiện tại:
          </div>
          <div style={{ color: activeZone ? "#90EE90" : "#FFB6C1" }}>
            {activeZone
              ? `🎯 ${activeZone.replace("_", " ")}`
              : "🌍 Khu vực chung"}
          </div>

          <div style={{ marginTop: "10px", fontWeight: "bold" }}>
            📦 Kho đồ:
          </div>
          <div>
            🌱 Hạt giống:{" "}
            {Object.entries(gameState.inventory.seeds)
              .map(([type, count]) => `${type}(${count})`)
              .join(", ")}
          </div>
          <div>
            🌾 Nông sản:{" "}
            {Object.entries(gameState.inventory.crops)
              .map(([type, count]) => `${type}(${count})`)
              .join(", ")}
          </div>
        </div>

        {/* Zone Guide */}
        <div
          style={{
            position: "absolute",
            top: "15px",
            right: "15px",
            background: "rgba(255,255,255,0.95)",
            color: "black",
            padding: "15px",
            borderRadius: "10px",
            fontSize: "11px",
            maxWidth: "200px",
          }}
        >
          <div style={{ fontWeight: "bold", marginBottom: "8px" }}>
            🗺️ Hướng dẫn khu vực:
          </div>
          <div>
            🌱 <span style={{ color: "#90EE90" }}>Xanh lá:</span> Trồng trọt
          </div>
          <div>
            🐄 <span style={{ color: "#DEB887" }}>Nâu:</span> Chăn nuôi
          </div>
          <div>
            🐟 <span style={{ color: "#87CEEB" }}>Xanh dương:</span> Câu cá
          </div>
          <div>
            🏪 <span style={{ color: "#FFD700" }}>Vàng:</span> Chợ bán hàng
          </div>
          <div>
            🌲 <span style={{ color: "#228B22" }}>Xanh đậm:</span> Khu rừng
          </div>

          <div style={{ marginTop: "10px", fontWeight: "bold" }}>
            🎯 Nhiệm vụ:
          </div>
          <div>• Trồng và thu hoạch cây</div>
          <div>• Chăm sóc động vật</div>
          <div>• Câu cá kiếm tiền</div>
          <div>• Bán nông sản tại chợ</div>
          <div>• Khám phá khu rừng</div>
        </div>

        {/* Animal Status Panel */}
        <div
          style={{
            position: "absolute",
            bottom: "15px",
            left: "15px",
            background: "rgba(139, 69, 19, 0.9)",
            color: "white",
            padding: "10px",
            borderRadius: "8px",
            fontSize: "11px",
          }}
        >
          <div style={{ fontWeight: "bold", marginBottom: "5px" }}>
            🐾 Trạng thái động vật:
          </div>
          {animals.map((animal) => (
            <div key={animal.id}>
              {animal.type === "chicken"
                ? "🐔"
                : animal.type === "cow"
                ? "🐄"
                : "🐷"}
              {animal.type}: {animal.happiness}% hạnh phúc
            </div>
          ))}
        </div>
      </div>

      {/* Notifications */}
      <div
        style={{
          position: "fixed",
          top: "20px",
          right: "20px",
          zIndex: 1000,
        }}
      >
        {notifications.map((notification) => (
          <div
            key={notification.id}
            style={{
              background:
                notification.type === "success"
                  ? "#4CAF50"
                  : notification.type === "error"
                  ? "#f44336"
                  : "#2196F3",
              color: "white",
              padding: "10px 15px",
              borderRadius: "5px",
              marginBottom: "5px",
              boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
              animation: "slideIn 0.3s ease-out",
            }}
          >
            {notification.message}
          </div>
        ))}
      </div>

      {/* Bottom Status Bar */}
      <div
        style={{
          marginTop: "15px",
          padding: "10px",
          background: "linear-gradient(90deg, #667eea, #764ba2)",
          color: "white",
          borderRadius: "10px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <span style={{ fontWeight: "bold" }}>🏆 Thành tích:</span>
          {gameState.experience >= 100
            ? " 🌟 Nông dân chuyên nghiệp!"
            : gameState.experience >= 50
            ? " 🌱 Nông dân có kinh nghiệm"
            : " 🌱 Nông dân mới"}
        </div>
        <div>
          <span style={{ fontWeight: "bold" }}>💡 Mẹo:</span>
          {activeZone === "crop_field"
            ? " Sử dụng cuốc để trồng cây!"
            : activeZone === "animal_area"
            ? " Click vào động vật để cho ăn!"
            : activeZone === "fishing_area"
            ? " Dùng cần câu để câu cá!"
            : " Click vào các khu vực màu để tương tác!"}
        </div>
      </div>

      <style jsx>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @keyframes bounce {
          0%,
          20%,
          53%,
          80%,
          100% {
            transform: translate3d(0, 0, 0);
          }
          40%,
          43% {
            transform: translate3d(0, -5px, 0);
          }
          70% {
            transform: translate3d(0, -3px, 0);
          }
          90% {
            transform: translate3d(0, -1px, 0);
          }
        }
      `}</style>
    </div>
  );
};

// Helper functions
function roundToNearest(num, NearestNum) {
  return Math.round(num / NearestNum) * NearestNum;
}

function countStep(n, m, n1, m1) {
  let res = [{ x: n, y: m }];
  do {
    let x = res[res.length - 1].x;
    let y = res[res.length - 1].y;

    if (n1 - x > 0) {
      x += 2;
    } else if (n1 - x < 0) {
      x -= 2;
    }

    if (m1 - y > 0) {
      y += 2;
    } else if (m1 - y < 0) {
      y -= 2;
    }

    res.push({ x, y });
  } while (res[res.length - 1].x !== n1 || res[res.length - 1].y !== m1);

  return res;
}

export default PixiCanvas;
