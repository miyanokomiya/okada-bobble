import Phaser from "phaser";

const TURRET_ANGLE_RANGE = 80;

export class Turret extends Phaser.GameObjects.Container {
  private sprite_top: Phaser.GameObjects.Sprite;
  private gear2_1: Phaser.GameObjects.Image;
  private gear3_1: Phaser.GameObjects.Image;
  private gear3_2: Phaser.GameObjects.Image;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y);

    const gear2_1 = this.scene.add.image(0, -32, "gear2");
    this.gear2_1 = gear2_1;
    this.gear2_1 = gear2_1;

    const gear3_1 = this.scene.add.image(64, 0, "gear3");
    this.gear3_1 = gear3_1;
    gear3_1.setPosition(
      gear2_1.x + ((gear2_1.width + gear3_1.width) / 2) * 0.65,
      gear2_1.y + ((gear2_1.height + gear3_1.height) / 2) * 0.65,
    );
    gear3_1.angle = 360 / 32;

    const gear3_2 = this.scene.add.image(64, 0, "gear3");
    this.gear3_2 = gear3_2;
    gear3_2.setPosition(gear3_1.x + ((gear3_1.width + gear3_2.width) / 2) * 0.92, gear3_1.y);
    const gears = [gear3_1, gear2_1, gear3_2];
    this.add(gears);

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
    this.gear2_1.angle = angle;
    this.gear3_1.angle = -angle / 2 + 360 / 32;
    this.gear3_2.angle = angle / 2;
  }
}
