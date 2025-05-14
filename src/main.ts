import Phaser from "phaser";
import "./style.css";
import { LevelSelectScene } from "./scenes/LevelSelectScene";
import { MainScene } from "./scenes/MainScene";

new Phaser.Game({
  parent: document.getElementById("app") as HTMLElement,
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  backgroundColor: "#1099bb",
  scene: [LevelSelectScene, MainScene],
  physics: {
    default: "arcade",
    arcade: {
      gravity: { x: 0, y: 100 },
      debug: true,
    },
  },
});
