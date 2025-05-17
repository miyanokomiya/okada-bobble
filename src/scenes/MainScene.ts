import sprite_balls from "../assets/images/character_balls.png";

import turret_top from "../assets/images/turret_top.png";
import turret_base from "../assets/images/turret_base.png";

import fall_1 from "../assets/sounds/fall_1.mp3";
import coin_1 from "../assets/sounds/coin_1.mp3";
import coin_2 from "../assets/sounds/coin_2.mp3";

import Phaser from "phaser";
import { Level_01 } from "../levels/Level_01";
import { getLevel, LEVEL_GRADE, LevelSceneConfig } from "../levels";
import { LevelHUD } from "../widgets/LevelHUD";
import { getGlobalStorageComponent } from "../components/GlobalStorageComponent";

export class MainScene extends Phaser.Scene {
  private level!: Level_01;
  private config: LevelSceneConfig = { grade: LEVEL_GRADE.INTRODUCTION, index: 0 };

  constructor() {
    super({ key: "MAIN" });
  }

  init(config: Partial<LevelSceneConfig>) {
    this.config.grade = config.grade ?? this.config.grade;
    this.config.index = config.index ?? this.config.index;
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
    const levelInfo = getLevel(this.config.grade, this.config.index)!;
    const LevelClass = levelInfo.LevelClass;
    this.level = new LevelClass(this);
    this.level.create();
    this.level.on("level-clear", () => {
      getGlobalStorageComponent().updateLevelProgress({ ...this.config, version: levelInfo.version }, 1);
      this.scene.pause().launch("LEVEL_END", { grade: this.config.grade, index: this.config.index, cleared: true });
    });
    this.level.on("level-fail", () => {
      this.scene.pause().launch("LEVEL_END", { grade: this.config.grade, index: this.config.index });
    });
    this.level.on("level-pause", () => {
      this.scene.pause().launch("LEVEL_PAUSE", { grade: this.config.grade, index: this.config.index });
    });

    new LevelHUD(this, this.config);
  }

  update(time: number, delta: number): void {
    this.level?.update(time, delta);
  }
}
