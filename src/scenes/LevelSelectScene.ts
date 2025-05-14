import Phaser from "phaser";
import { LEVEL_LIST } from "../levels";
import { LevelSelectButton } from "../widgets/LevelSelectButton";
import { InputComponent } from "../components/InputComponent";
import { DEFAULT_FONT } from "../utils/settings";

export class LevelSelectScene extends Phaser.Scene {
  private inputComponent!: InputComponent;
  private buttonGrid: LevelSelectButton[][] = [];
  private focusedButtonCoordinates: { x: number; y: number } = { x: 0, y: 0 };

  constructor() {
    super({ key: "LEVEL_SELECT" });
  }

  init() {
    this.buttonGrid = [];
  }

  create() {
    this.inputComponent = new InputComponent(this);

    const lineX = 100;
    const lineY = 100;
    const lineHeight = 100;
    const grouped = Object.groupBy(LEVEL_LIST, (level) => level.grade);
    Object.entries(grouped).forEach(([, list], gradeIndex) => {
      const label = this.add.text(lineX, lineY + gradeIndex * lineHeight, list[0].grade, {
        fontSize: "24px",
        fontFamily: DEFAULT_FONT,
        color: "#000000",
      });

      const buttons = list.map((level, levelIndex) => {
        return new LevelSelectButton(this, label.x + levelIndex * 50, label.y + 40, level.grade, levelIndex);
      });
      this.buttonGrid.push(buttons);
    });

    this.focusButton(this.focusedButtonCoordinates.x, this.focusedButtonCoordinates.y);
  }

  update(_time: number, _delta: number): void {
    this.inputComponent.update();

    const focusedButton = this.getFocusedButton();
    if (this.inputComponent.justPressedKeys.left) {
      this.focusButton(Math.max(0, this.focusedButtonCoordinates.x - 1), this.focusedButtonCoordinates.y);
    }
    if (this.inputComponent.justPressedKeys.right) {
      this.focusButton(
        Math.min(this.buttonGrid[this.focusedButtonCoordinates.y].length - 1, this.focusedButtonCoordinates.x + 1),
        this.focusedButtonCoordinates.y,
      );
    }
    if (this.inputComponent.justPressedKeys.up) {
      this.focusButton(this.focusedButtonCoordinates.x, Math.max(0, this.focusedButtonCoordinates.y - 1));
    }
    if (this.inputComponent.justPressedKeys.down) {
      this.focusButton(
        this.focusedButtonCoordinates.x,
        Math.min(this.buttonGrid.length - 1, this.focusedButtonCoordinates.y + 1),
      );
    }
    if (this.inputComponent.justPressedKeys.space) {
      const button = this.getFocusedButton();
      if (button) {
        this.scene.start("MAIN", { grade: button.levelGrade, index: button.levelIndex });
        return;
      }
    }

    const nextFocusedButton = this.getFocusedButton();
    if (focusedButton !== nextFocusedButton) {
      focusedButton?.setFocused(false);
      nextFocusedButton?.setFocused(true);
    }
  }

  private focusButton(x: number, y: number) {
    this.buttonGrid[this.focusedButtonCoordinates.y]?.[this.focusedButtonCoordinates.x]?.setFocused(false);
    this.buttonGrid[y]?.[x]?.setFocused(true);
    this.focusedButtonCoordinates.x = x;
    this.focusedButtonCoordinates.y = y;
  }

  private getFocusedButton(): LevelSelectButton | undefined {
    return this.buttonGrid[this.focusedButtonCoordinates.y]?.[this.focusedButtonCoordinates.x];
  }
}
