import Phaser from "phaser";
import gear1 from "../assets/images/gear1.svg";
import gear2 from "../assets/images/gear2.svg";
import gear3 from "../assets/images/gear3.svg";
import gear4 from "../assets/images/gear4.svg";
import { LEVEL_GRADE, LEVEL_LIST, LevelSceneConfig } from "../levels";
import { LevelSelectButton } from "../widgets/LevelSelectButton";
import { InputComponent } from "../components/InputComponent";
import { DEFAULT_FONT } from "../utils/settings";
import { SelectableGridComponent } from "../components/SelectableGridComponent";
import { getGlobalStorageComponent } from "../components/GlobalStorageComponent";
import { Background2 } from "../pawns/Background";
import { VirtualKeyboardComponent } from "../components/VirtualKeyboardComponent";

export class LevelSelectScene extends Phaser.Scene {
  private inputComponent!: InputComponent;
  private vkc!: VirtualKeyboardComponent;
  private selectableGridComponent!: SelectableGridComponent;
  private config: LevelSceneConfig = { grade: LEVEL_GRADE.INTRODUCTION, index: 0 };

  constructor() {
    super({ key: "LEVEL_SELECT" });
  }

  preload() {
    this.load.image("gear1", gear1);
    this.load.image("gear2", gear2);
    this.load.image("gear3", gear3);
    this.load.image("gear4", gear4);
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

    const globalStore = getGlobalStorageComponent();

    new Background2(this);

    const lineX = 100;

    this.add.text(lineX, 62, "Okada Bobble", {
      fontSize: "70px",
      fontFamily: DEFAULT_FONT,
      color: "#000000",
    });

    const lineY = 180;

    const lineHeight = 100;
    const grouped = Object.entries(Object.groupBy(LEVEL_LIST, (level) => level.grade));
    grouped.forEach(([, list], gradeIndex) => {
      const label = this.add.text(lineX, lineY + gradeIndex * lineHeight, list[0].grade, {
        fontSize: "24px",
        fontFamily: DEFAULT_FONT,
        color: "#000000",
      });

      const buttons = list.map((level, levelIndex) => {
        const progress = globalStore.getLevelProgress({
          grade: level.grade,
          index: levelIndex,
          version: level.version,
        });
        return new LevelSelectButton(
          this,
          label.x + levelIndex * 50,
          label.y + 40,
          level.grade,
          levelIndex,
          !!progress,
        );
      });
      this.selectableGridComponent.addLine(buttons);
    });

    this.selectableGridComponent.focusItem(
      this.config.index,
      grouped.findIndex(([grade]) => grade === this.config.grade),
    );

    this.vkc = new VirtualKeyboardComponent(this, this.inputComponent);

    this.add
      .text(
        lineX,
        this.scale.height - 40,
        `Move: ↑←↓→, WASD\nAction: Space\nPause: Escape\n\n${process.env.__APP_VERSION__}`,
        {
          fontSize: "20px",
          fontFamily: DEFAULT_FONT,
          color: "#000000",
        },
      )
      .setOrigin(0, 1);
  }

  update(_time: number, _delta: number): void {
    this.inputComponent.update();
    this.vkc.update();
    this.selectableGridComponent.update();
  }
}
