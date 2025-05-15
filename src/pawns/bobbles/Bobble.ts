import Phaser from "phaser";
import { BobbleColor, BobbleLabel, getBobbleTexture, getBobbleThemaColor } from "../../utils/settings";

export const BOBBLE_RADIUS = 16;

export class Bobble extends Phaser.GameObjects.Container {
  declare body: Phaser.Physics.Arcade.Body;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    public label: BobbleLabel,
    public color: BobbleColor,
  ) {
    const background = scene.add.circle(0, 0, BOBBLE_RADIUS, getBobbleThemaColor(color));
    const textureInfo = getBobbleTexture(label);
    const sprite = scene.add.sprite(0, 0, textureInfo.texture, textureInfo.frame);

    super(scene, x, y, [background, sprite]);
    scene.add.existing(this);
    this.name = `bobble_${Phaser.Utils.String.UUID()}`;

    // Add the primary physics body
    scene.physics.add.existing(this);
    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setCircle(BOBBLE_RADIUS, -BOBBLE_RADIUS, -BOBBLE_RADIUS);
    body.setAllowGravity(false);
    body.pushable = false;
  }

  setMoves(val: boolean) {
    const body = this.body as Phaser.Physics.Arcade.Body;
    body.moves = val;
    if (!val) {
      body.setVelocity(0, 0);
    }
  }
}
