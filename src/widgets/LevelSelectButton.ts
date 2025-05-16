import { SelectableObject } from "../components/SelectableGridComponent";
import { DEFAULT_FONT } from "../utils/settings";

const WIDTH = 40;
const HEIGHT = 40;

export class LevelSelectButton extends Phaser.GameObjects.Container implements SelectableObject {
  levelGrade: string;
  levelIndex: number;
  private background: Phaser.GameObjects.Graphics;

  constructor(scene: Phaser.Scene, x: number, y: number, levelGrade: string, levelIndex: number, checked = false) {
    super(scene, x, y);
    scene.add.existing(this);

    this.levelIndex = levelIndex;
    this.levelGrade = levelGrade;

    const background = scene.add.graphics();
    this.background = background;
    this.setFocused(false);
    this.add(background);

    const levelText = scene.add.text(WIDTH / 2, HEIGHT / 2, `${(levelIndex + 1).toString().padStart(2, "0")}`, {
      fontSize: "20px",
      fontFamily: DEFAULT_FONT,
      color: "#ffffff",
    });
    levelText.setOrigin(0.5, 0.5);
    this.add(levelText);

    if (checked) {
      const checkMark = scene.add.text(WIDTH - 10, HEIGHT - 10, "✓", {
        fontSize: "20px",
        fontFamily: DEFAULT_FONT,
        color: "#ffffff",
      });
      checkMark.setOrigin(0.5, 0.5);
      this.add(checkMark);
    }

    this.setSize(WIDTH, HEIGHT);
  }

  setFocused(focused: boolean) {
    this.background.clear();
    this.background.fillStyle(0x0044ff);
    this.background.lineStyle(focused ? 4 : 2, focused ? 0xeeee00 : 0x000000);
    this.background.fillRoundedRect(0, 0, WIDTH, HEIGHT, 10);
    this.background.strokeRoundedRect(0, 0, WIDTH, HEIGHT, 10);
  }
}
