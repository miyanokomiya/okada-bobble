import { InputComponent } from "../components/InputComponent";
import { SelectableGridComponent } from "../components/SelectableGridComponent";
import { VirtualKeyboardComponent } from "../components/VirtualKeyboardComponent";
import { LevelSceneConfig } from "../levels";
import { DEFAULT_FONT } from "../utils/settings";
import { MenuButton } from "../widgets/MenuButton";

type Config = LevelSceneConfig;

export class LevelPauseScene extends Phaser.Scene {
  private config!: Config;
  protected inputComponent!: InputComponent;
  private vkc!: VirtualKeyboardComponent;
  private selectableGridComponent!: SelectableGridComponent;

  constructor() {
    super({ key: "LEVEL_PAUSE" });
  }

  init(config: Config) {
    this.config = config;
  }

  create() {
    this.inputComponent = new InputComponent(this);

    this.add.graphics().fillStyle(0x000000, 0.3).fillRect(0, 0, this.scale.width, this.scale.height);

    this.add
      .text(this.scale.width / 2, this.scale.height / 2 - 100, "Paused", {
        fontSize: "32px",
        fontFamily: DEFAULT_FONT,
        color: "#ffffff",
      })
      .setOrigin(0.5, 0.5);

    const buttons: MenuButton[] = [];

    const nextButton = new MenuButton(this, "Resume", "primary");
    const retryButton = new MenuButton(this, "Retry");
    const menuButton = new MenuButton(this, "Menu");
    buttons.push(nextButton, retryButton, menuButton);

    buttons.forEach((button, i) => {
      if (i === 0) {
        button.x = this.scale.width / 2 - button.width / 2;
        button.y = this.scale.height / 2 - button.height / 2;
      } else {
        Phaser.Display.Align.In.BottomCenter(button, buttons[i - 1], 0, button.height + 14);
      }
    });

    this.selectableGridComponent = new SelectableGridComponent(this.inputComponent);
    this.selectableGridComponent.on("item-select", (button: MenuButton) => {
      if (button === nextButton) {
        this.resumeGame();
      } else if (button === retryButton) {
        this.scene.start("MAIN", { grade: this.config.grade, index: this.config.index });
      } else if (button === menuButton) {
        this.scene.stop("MAIN").start("LEVEL_SELECT", { grade: this.config.grade, index: this.config.index });
      }
    });

    buttons.forEach((button) => {
      this.selectableGridComponent.addLine([button]);
    });
    this.selectableGridComponent.focusItem(0, 0);

    this.vkc = new VirtualKeyboardComponent(this, this.inputComponent);
  }

  private resumeGame() {
    this.scene.stop();
    this.scene.resume("MAIN");
  }

  update(_time: number, _delta: number): void {
    this.inputComponent.update();
    this.vkc.update();
    this.selectableGridComponent.update();

    if (this.inputComponent.justPressedKeys.esc) {
      this.resumeGame();
    }
  }
}
