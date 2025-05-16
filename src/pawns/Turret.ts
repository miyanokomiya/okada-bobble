import Phaser from "phaser";
import { Gear } from "./Gear";

const TURRET_ANGLE_RANGE = 80;

export class Turret extends Phaser.GameObjects.Container {
  private sprite_top: Phaser.GameObjects.Sprite;
  private gear2_1: Gear;
  private gear3_1: Gear;
  private gear3_2: Gear;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y);

    this.gear2_1 = new Gear(scene, 2).setAlpha(0.75);
    this.gear2_1.setPosition(0, -32);
    this.gear3_1 = new Gear(scene, 3, true).setAlpha(0.75);
    this.gear3_1.setPositionBasedOn(this.gear2_1, 45);
    this.gear3_2 = new Gear(scene, 3).setAlpha(0.75);
    this.gear3_2.setPositionBasedOn(this.gear3_1, -45);
    this.add([this.gear2_1, this.gear3_1, this.gear3_2]);

    const sprite_base = scene.add.sprite(0, 0, "turret_base");
    const sprite_top = scene.add.sprite(0, -32, "turret_top");
    sprite_base.setOrigin(0.5, 1);
    sprite_top.setOrigin(0.5, 1);
    this.add([sprite_base, sprite_top]);

    this.sprite_top = sprite_top;
    scene.add.existing(this);
    this.name = "turret";
  }

  rotateTopTo(angle: number): void {
    const clampedAngle = Phaser.Math.Clamp(angle + 90, -TURRET_ANGLE_RANGE, TURRET_ANGLE_RANGE);
    this.sprite_top.setAngle(clampedAngle);
    this.rotateGears();
  }

  rotateTopBy(val: number): void {
    const clampedAngle = Phaser.Math.Clamp(this.sprite_top.angle + val, -TURRET_ANGLE_RANGE, TURRET_ANGLE_RANGE);
    this.sprite_top.setAngle(clampedAngle);
    this.rotateGears();
  }

  getTurretAngle(): number {
    return this.sprite_top.angle - 90;
  }

  getTurretCenterPosition(): Phaser.Math.Vector2 {
    return new Phaser.Math.Vector2(this.sprite_top.x, this.sprite_top.y).add(this);
  }

  getTurretTopPosition(): Phaser.Math.Vector2 {
    const r = Phaser.Math.DegToRad(this.getTurretAngle());
    const radius = this.sprite_top.displayHeight;
    return this.getTurretCenterPosition().add(new Phaser.Math.Vector2(radius, 0).rotate(r));
  }

  private rotateGears() {
    const angle = this.getTurretAngle();
    this.gear2_1.setGearAngle(angle);
    this.gear3_1.setGearAngle(-angle);
    this.gear3_2.setGearAngle(angle);
  }
}
