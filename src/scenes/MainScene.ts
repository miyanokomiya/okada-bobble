import Phaser from "phaser";
import { Level_01 } from "../levels/Level_01";

import sprite_balls from "../assets/images/character_balls.png";

import turret_top from "../assets/images/turret_top.png";
import turret_base from "../assets/images/turret_base.png";

import fall_1 from "../assets/sounds/fall_1.mp3";
import coin_1 from "../assets/sounds/coin_1.mp3";
import coin_2 from "../assets/sounds/coin_2.mp3";
import { getLevel, getNextLevel, LEVEL_GRADE, LevelGrade } from "../levels";

export class MainScene extends Phaser.Scene {
  private level!: Level_01;
  private levelIndex = 1;
  private levelGrade: LevelGrade = "INTRODUCTION";

  constructor() {
    super({ key: "MAIN" });
  }

  init(config?: { grade: LevelGrade; index: number }) {
    if (!config) return;

    const level = getLevel(config.grade, config.index);
    if (!level) return;

    this.levelGrade = config.grade;
    this.levelIndex = config.index;
  }

  preload() {
    this.load.spritesheet("bobbles", sprite_balls, { frameWidth: 32, frameHeight: 32 });

    this.load.image("turret_top", turret_top);
    this.load.image("turret_base", turret_base);

    this.load.audio("bobble_shoot", fall_1, { volume: 0.1 });
    this.load.audio("bobble_land", coin_1);
    this.load.audio("bobble_complete", coin_2);
  }

  create() {
    const LevelClass = getLevel(this.levelGrade, this.levelIndex)?.LevelClass;
    this.level = new LevelClass(this);
    this.level.create();
    this.level.on("level-clear", () => {
      this.scene.start("MAIN", { grade: this.levelGrade, index: this.levelIndex + 1 });
    });
  }

  update(time: number, delta: number): void {
    this.level?.update(time, delta);
  }
}
