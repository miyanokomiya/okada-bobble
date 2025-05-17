export class InputComponent {
  private cursorKeys: Phaser.Types.Input.Keyboard.CursorKeys | undefined;
  private keyW?: Phaser.Input.Keyboard.Key;
  private keyS?: Phaser.Input.Keyboard.Key;
  private keyA?: Phaser.Input.Keyboard.Key;
  private keyD?: Phaser.Input.Keyboard.Key;
  private keyESC?: Phaser.Input.Keyboard.Key;

  public pressedKeys: {
    [key: string]: boolean;
  } = {};

  public justPressedKeys: {
    [key: string]: boolean;
  } = {};

  constructor(scene: Phaser.Scene) {
    this.cursorKeys = scene.input.keyboard?.createCursorKeys();
    this.keyA = scene.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    this.keyS = scene.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    this.keyD = scene.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    this.keyW = scene.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    this.keyESC = scene.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);

    scene.events.on(Phaser.Scenes.Events.RESUME, () => {
      this.pressedKeys = {};
      this.justPressedKeys = {};
    });
  }

  update() {
    this.updateKey("left", this.cursorKeys?.left.isDown || this.keyA?.isDown);
    this.updateKey("up", this.cursorKeys?.up.isDown || this.keyW?.isDown);
    this.updateKey("right", this.cursorKeys?.right.isDown || this.keyD?.isDown);
    this.updateKey("down", this.cursorKeys?.down.isDown || this.keyS?.isDown);
    this.updateKey("space", this.cursorKeys?.space.isDown);
    this.updateKey("esc", this.keyESC?.isDown);
  }

  updateKey(key: string, isDown = false) {
    if (!this.pressedKeys[key] && isDown) {
      this.justPressedKeys[key] = true;
    } else {
      this.justPressedKeys[key] = false;
    }
    this.pressedKeys[key] = isDown;
  }

  applyExternalKeys(externalKeys: { [key: string]: boolean }, externalJustKeys: { [key: string]: boolean }) {
    for (const key in externalKeys) {
      if (externalKeys[key]) {
        this.pressedKeys[key] = externalKeys[key];
      }
    }
    for (const key in externalJustKeys) {
      if (externalJustKeys[key]) {
        this.justPressedKeys[key] = externalJustKeys[key];
      }
    }
  }
}
