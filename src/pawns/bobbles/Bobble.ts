import Phaser from "phaser";

const BOBBLE_RADIUS = 16;

export class Bobble extends Phaser.GameObjects.Container {
  constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame?: number) {
    // Create a circular background
    const background = scene.add.circle(0, 0, BOBBLE_RADIUS, 0xffffff);

    // Create the sprite
    const sprite = scene.add.sprite(0, 0, texture, frame);

    // Call the parent constructor with the container's position
    super(scene, x, y, [background, sprite]);

    // Add the container to the scene
    scene.add.existing(this);

    // Enable physics for the container
    scene.physics.add.existing(this);

    // Set the container's body to be a circle
    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setCircle(BOBBLE_RADIUS, -BOBBLE_RADIUS, -BOBBLE_RADIUS);
  }
}
