import { DEFAULT_FONT } from "../utils/settings";

export class LevelHUD extends Phaser.GameObjects.Container {
  constructor(scene: Phaser.Scene, settings: { levelIndex: number }) {
    super(scene);
    scene.add.existing(this);

    const levelText = scene.add.text(8, 8, `Level: ${settings.levelIndex + 1}`, {
      fontSize: "24px",
      fontFamily: DEFAULT_FONT,
    });
    this.add(levelText);
  }
}
