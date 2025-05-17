import Phaser from "phaser";
import { InputComponent } from "./InputComponent";

export class VirtualKeyboardComponent {
  private scene: Phaser.Scene;
  private inputComponent: InputComponent;
  private pressedKeys: { [key: string]: boolean } = {};
  public justPressedKeys: {
    [key: string]: boolean;
  } = {};

  constructor(scene: Phaser.Scene, inputComponent: InputComponent) {
    this.scene = scene;
    this.inputComponent = inputComponent;

    scene.events.on(Phaser.Scenes.Events.RESUME, () => {
      this.pressedKeys = {};
      this.justPressedKeys = {};
    });

    this.createButtons();
  }

  private createButtons() {
    const left = 40;
    const buttonSize = 60;
    const padding = 10;
    const screenWidth = this.scene.scale.width;
    const screenHeight = this.scene.scale.height;

    // Arrow keys on the left-hand side
    this.createButton(left + padding, screenHeight - buttonSize - padding, buttonSize, "←", "left");
    this.createButton(
      left + padding + buttonSize + padding,
      screenHeight - buttonSize * 2 - padding * 2,
      buttonSize,
      "↑",
      "up",
    );
    this.createButton(
      left + padding + buttonSize + padding,
      screenHeight - buttonSize - padding,
      buttonSize,
      "↓",
      "down",
    );
    this.createButton(
      left + padding + buttonSize * 2 + padding * 2,
      screenHeight - buttonSize - padding,
      buttonSize,
      "→",
      "right",
    );

    // Action buttons on the right-hand side
    this.createButton(
      screenWidth - buttonSize - padding,
      screenHeight - buttonSize - padding,
      buttonSize * 1.5,
      "Space",
      "space",
    );
    this.createButton(left + padding, buttonSize + padding, buttonSize, "Esc", "esc");
  }

  private createButton(x: number, y: number, width: number, label: string, key: string) {
    const button = this.scene.add
      .rectangle(x, y, width, 60, 0xaaaaaa, 0.5)
      .setInteractive()
      .on("pointerdown", () => this.handleButtonPress(key))
      .on("pointerup", () => this.handleButtonRelease(key));

    this.scene.add
      .text(x, y, label, {
        fontSize: "20px",
        fontFamily: "Arial",
        color: "#ffffff",
      })
      .setOrigin(0.5);

    return button;
  }

  private handleButtonPress(key: string) {
    this.updateKey(key, true);
  }

  private handleButtonRelease(key: string) {
    this.updateKey(key, false);
  }

  private updateKey(key: string, isDown = false) {
    if (isDown) {
      this.justPressedKeys[key] = true;
    } else {
      this.justPressedKeys[key] = false;
    }
    this.pressedKeys[key] = isDown;
  }

  update() {
    this.inputComponent.applyExternalKeys(this.pressedKeys, this.justPressedKeys);
    this.justPressedKeys = {};
  }
}
