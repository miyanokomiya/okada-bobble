import { MainScene } from "./scenes/MainScene";
import "./style.css";

new Phaser.Game({
  parent: document.getElementById("app") as HTMLElement,
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  backgroundColor: "#1099bb",
  scene: MainScene,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { x: 0, y: 200 },
      debug: true,
    },
  },
});
