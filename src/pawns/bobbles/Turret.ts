import Phaser from "phaser";

const TURRET_ANGLE_RANGE = 60;

export class Turret extends Phaser.GameObjects.Container {
  private sprite_top: Phaser.GameObjects.Sprite;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    const sprite_base = scene.add.sprite(0, 0, "turret_base");
    const sprite_top = scene.add.sprite(0, 0, "turret_top");
    sprite_base.setOrigin(0.5, 1);
    sprite_top.setOrigin(0.5, 1);

    super(scene, x, y, [sprite_base, sprite_top]);
    this.sprite_top = sprite_top;
    scene.add.existing(this);
    this.name = "turret";
  }

  rotateTopTo(angle: number): void {
    const clampedAngle = Phaser.Math.Clamp(angle + 90, -TURRET_ANGLE_RANGE, TURRET_ANGLE_RANGE);
    this.sprite_top.setAngle(clampedAngle);
  }

  rotateTopBy(val: number): void {
    const clampedAngle = Phaser.Math.Clamp(this.sprite_top.angle + val, -TURRET_ANGLE_RANGE, TURRET_ANGLE_RANGE);
    this.sprite_top.setAngle(clampedAngle);
  }

  getTurretAngle(): number {
    return this.sprite_top.angle - 90;
  }
}
