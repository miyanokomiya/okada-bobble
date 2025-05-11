import Phaser from "phaser";
import { Level_01 } from "../levels/Level_01";
import sprite_balls from "../assets/images/character_balls.png";
import turret_top from "../assets/images/turret_top.png";
import turret_base from "../assets/images/turret_base.png";

export class MainScene extends Phaser.Scene {
  private level: Level_01;

  constructor() {
    super({ key: "MainScene" });
    this.level = new Level_01(this);
  }

  preload() {
    this.load.spritesheet("bobbles", sprite_balls, { frameWidth: 32, frameHeight: 32 });
    this.load.image("turret_top", turret_top);
    this.load.image("turret_base", turret_base);
  }

  create() {
    this.level.create();
  }

  update(time: number, delta: number): void {
    this.level.update(time, delta);
  }
}
