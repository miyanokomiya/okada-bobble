import Phaser from "phaser";
import sprite_balls from "../assets/images/character_balls.png";
import { Bobble } from "../pawns/bobbles/Bobble";

export class MainScene extends Phaser.Scene {
  constructor() {
    super({ key: "MainScene" });
  }

  preload() {
    this.load.spritesheet("balls", sprite_balls, { frameWidth: 32, frameHeight: 32 });
  }

  create() {
    // Add static walls along the viewport outline
    const { width, height } = this.scale;
    const wallThickness = 20;
    const walls = this.physics.add.staticGroup([
      this.add.rectangle(width / 2, wallThickness / 2, width, wallThickness, 0x000000),
      this.add.rectangle(width / 2, height - wallThickness / 2, width, wallThickness, 0x000000),
      this.add.rectangle(wallThickness / 2, height / 2, wallThickness, height, 0x000000),
      this.add.rectangle(width - wallThickness / 2, height / 2, wallThickness, height, 0x000000),
    ]);

    // Create a group for Bobbles
    const bobbleGroup = this.add.group();

    // Add Bobbles to the group
    bobbleGroup.add(new Bobble(this, 400, 100, "balls", 0));
    bobbleGroup.add(new Bobble(this, 400, 300, "balls", 1));
    bobbleGroup.add(new Bobble(this, 400, 400, "balls", 1));

    // Enable collision between Bobbles and walls
    this.physics.add.collider(walls, bobbleGroup);

    // Enable collision between Bobbles
    this.physics.add.collider(bobbleGroup, bobbleGroup);
  }
}
