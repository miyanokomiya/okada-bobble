import { LEVEL_GRADE, LevelInfo } from "../levels";
import { DEFAULT_FONT } from "../utils/settings";

export class LevelHUD extends Phaser.GameObjects.Container {
  constructor(scene: Phaser.Scene, levelInfo: LevelInfo) {
    super(scene);
    scene.add.existing(this);

    const levelText = scene.add.text(
      scene.scale.width / 2,
      16,
      `${LEVEL_GRADE[levelInfo.grade]}    Level: ${levelInfo.index + 1}`,
      {
        fontSize: "24px",
        fontFamily: DEFAULT_FONT,
      },
    );
    levelText.setOrigin(0.5, 0);
    this.add(levelText);
  }
}
