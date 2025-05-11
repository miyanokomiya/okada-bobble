import Phaser from "phaser";
import sprite_balls from "../assets/images/character_balls.png";
import { Level_01 } from "../levels/Level_01";

export class MainScene extends Phaser.Scene {
  private level: Level_01;

  constructor() {
    super({ key: "MainScene" });
    this.level = new Level_01(this);
  }

  preload() {
    this.load.spritesheet("bobbles", sprite_balls, { frameWidth: 32, frameHeight: 32 });
  }

  create() {
    this.level.create();
  }

  update(time: number, delta: number): void {
    this.level.update(time, delta);
  }
}
