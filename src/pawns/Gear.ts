export class Gear extends Phaser.GameObjects.Container {
  private shiftAngle = 0;
  private gearImage: Phaser.GameObjects.Image;
  private angleAnimation?: Phaser.Tweens.Tween;

  constructor(scene: Phaser.Scene, gearType: number, angleShifted = false) {
    super(scene, 0, 0);
    scene.add.existing(this);

    const gearInfo = getGearInfo(gearType);
    this.shiftAngle = angleShifted ? 180 / gearInfo.teethCount : 0;

    this.gearImage = this.scene.add.image(0, 0, gearInfo.texture);
    this.add(this.gearImage);
    this.setGearAngle(0);
  }

  setGearAngle(angle: number) {
    this.gearImage.setAngle(angle + this.shiftAngle);
  }

  animateAngle(duration: number, counterClockwise = false) {
    this.angleAnimation?.stop().destroy();

    this.angleAnimation = this.scene.tweens.add({
      targets: [this.gearImage],
      angle: { from: this.shiftAngle, to: this.shiftAngle + (counterClockwise ? -360 : 360) },
      duration,
      repeat: -1,
      ease: "Linear",
    });
  }

  setPositionBasedOn(gear: Gear, angle: number) {
    const d = gear.gearImage.width / 2 + this.gearImage.width / 2 - 9;
    const r = Phaser.Math.DegToRad(angle);
    const x = gear.x + d * Math.cos(r);
    const y = gear.y + d * Math.sin(r);
    this.setPosition(x, y);
  }
}

function getGearInfo(gearType: number) {
  switch (gearType) {
    case 2:
      return { texture: "gear2", teethCount: 8 };
    case 3:
      return { texture: "gear3", teethCount: 16 };
    case 4:
      return { texture: "gear4", teethCount: 32 };
    default:
      return { texture: "gear1", teethCount: 6 };
  }
}
