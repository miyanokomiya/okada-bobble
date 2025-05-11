export class InputComponent {
  private cursorKeys: Phaser.Types.Input.Keyboard.CursorKeys | undefined;
  private keyW?: Phaser.Input.Keyboard.Key;
  private keyS?: Phaser.Input.Keyboard.Key;
  private keyA?: Phaser.Input.Keyboard.Key;
  private keyD?: Phaser.Input.Keyboard.Key;

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
  }

  update() {
    this.updateKye("left", this.cursorKeys?.left.isDown || this.keyA?.isDown);
    this.updateKye("up", this.cursorKeys?.up.isDown || this.keyW?.isDown);
    this.updateKye("right", this.cursorKeys?.right.isDown || this.keyD?.isDown);
    this.updateKye("down", this.cursorKeys?.down.isDown || this.keyS?.isDown);
    this.updateKye("space", this.cursorKeys?.space.isDown);
  }

  private updateKye(key: string, isDown = false) {
    if (!this.pressedKeys[key] && isDown) {
      this.justPressedKeys[key] = true;
    } else {
      this.justPressedKeys[key] = false;
    }
    this.pressedKeys[key] = isDown;
  }
}
