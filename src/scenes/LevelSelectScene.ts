import Phaser from "phaser";
import { LEVEL_GRADE, LEVEL_LIST, LevelSceneConfig } from "../levels";
import { LevelSelectButton } from "../widgets/LevelSelectButton";
import { InputComponent } from "../components/InputComponent";
import { DEFAULT_FONT } from "../utils/settings";
import { SelectableGridComponent } from "../components/SelectableGridComponent";

export class LevelSelectScene extends Phaser.Scene {
  private inputComponent!: InputComponent;
  private selectableGridComponent!: SelectableGridComponent;
  private config: LevelSceneConfig = { grade: LEVEL_GRADE.INTRODUCTION, index: 0 };

  constructor() {
    super({ key: "LEVEL_SELECT" });
  }

  init(config: Partial<LevelSceneConfig>) {
    this.config.grade = config.grade ?? this.config.grade;
    this.config.index = config.index ?? this.config.index;
  }

  create() {
    this.inputComponent = new InputComponent(this);
    this.selectableGridComponent = new SelectableGridComponent(this.inputComponent);
    this.selectableGridComponent.on("item-select", (button: LevelSelectButton) => {
      this.scene.start("MAIN", { grade: button.levelGrade, index: button.levelIndex });
    });

    const lineX = 100;
    const lineY = 100;
    const lineHeight = 100;
    const grouped = Object.entries(Object.groupBy(LEVEL_LIST, (level) => level.grade));
    grouped.forEach(([, list], gradeIndex) => {
      const label = this.add.text(lineX, lineY + gradeIndex * lineHeight, list[0].grade, {
        fontSize: "24px",
        fontFamily: DEFAULT_FONT,
        color: "#000000",
      });

      const buttons = list.map((level, levelIndex) => {
        return new LevelSelectButton(this, label.x + levelIndex * 50, label.y + 40, level.grade, levelIndex);
      });
      this.selectableGridComponent.addLine(buttons);
    });

    this.selectableGridComponent.focusItem(
      this.config.index,
      grouped.findIndex(([grade]) => grade === this.config.grade),
    );
  }

  update(_time: number, _delta: number): void {
    this.inputComponent.update();
    this.selectableGridComponent.update();
  }
}
