import { nanoid } from "nanoid";
import Phaser from "phaser";

const BOBBLE_RADIUS = 16;

export class Bobble extends Phaser.GameObjects.Container {
  declare body: Phaser.Physics.Arcade.Body;

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame?: number) {
    const background = scene.add.circle(0, 0, BOBBLE_RADIUS, 0xffffff);
    const sprite = scene.add.sprite(0, 0, texture, frame);

    super(scene, x, y, [background, sprite]);
    scene.add.existing(this);
    this.name = nanoid();

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
