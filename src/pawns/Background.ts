import { Gear } from "./Gear";

export class Background extends Phaser.GameObjects.Container {
  constructor(scene: Phaser.Scene) {
    super(scene, 0, 0);
    scene.add.existing(this);
    this.setAlpha(0.5);

    const { width, height } = scene.scale;

    const gear2_1 = new Gear(scene, 2).setAlpha(0.5);
    gear2_1.setPosition(width / 2 - 180, height / 2 - 50);
    gear2_1.animateAngle(10000);

    const gear2_2 = new Gear(scene, 2, true).setAlpha(0.5);
    gear2_2.setPositionBasedOn(gear2_1, 45);
    gear2_2.animateAngle(10000, true);

    const gear3_1 = new Gear(scene, 3).setAlpha(0.5);
    gear3_1.setPositionBasedOn(gear2_2, -45);
    gear3_1.animateAngle(20000);

    const gear2_3 = new Gear(scene, 2, true).setAlpha(0.5);
    gear2_3.setPositionBasedOn(gear3_1, 45);
    gear2_3.animateAngle(10000, true);

    const gear2_4 = new Gear(scene, 2).setAlpha(0.5);
    gear2_4.setPositionBasedOn(gear2_3, -45);
    gear2_4.animateAngle(10000);

    const gear3_2 = new Gear(scene, 3, true).setAlpha(0.5);
    gear3_2.setPositionBasedOn(gear2_4, 45);
    gear3_2.animateAngle(20000, true);

    const gear4_1 = new Gear(scene, 4).setAlpha(0.5);
    gear4_1.setPositionBasedOn(gear3_2, -45);
    gear4_1.animateAngle(40000);
  }
}

export class Background2 extends Phaser.GameObjects.Container {
  constructor(scene: Phaser.Scene) {
    super(scene, 0, 0);
    scene.add.existing(this);
    this.setAlpha(0.5);

    const { width, height } = scene.scale;

    const gear2_1 = new Gear(scene, 2).setAlpha(0.5);
    gear2_1.setPosition(width - 180, height / 2 - 100);
    gear2_1.animateAngle(10000);

    const gear2_2 = new Gear(scene, 2, true).setAlpha(0.5);
    gear2_2.setPositionBasedOn(gear2_1, 135);
    gear2_2.animateAngle(10000, true);

    const gear3_1 = new Gear(scene, 3).setAlpha(0.5);
    gear3_1.setPositionBasedOn(gear2_2, 45);
    gear3_1.animateAngle(20000);

    const gear2_3 = new Gear(scene, 2, true).setAlpha(0.5);
    gear2_3.setPositionBasedOn(gear3_1, 45);
    gear2_3.animateAngle(10000, true);

    const gear2_4 = new Gear(scene, 2).setAlpha(0.5);
    gear2_4.setPositionBasedOn(gear2_3, 135);
    gear2_4.animateAngle(10000);

    const gear3_2 = new Gear(scene, 3, true).setAlpha(0.5);
    gear3_2.setPositionBasedOn(gear2_4, 45);
    gear3_2.animateAngle(20000, true);

    const gear4_1 = new Gear(scene, 4).setAlpha(0.5);
    gear4_1.setPositionBasedOn(gear3_2, 135);
    gear4_1.animateAngle(40000);

    const gear3_3 = new Gear(scene, 3, true).setAlpha(0.5);
    gear3_3.setPositionBasedOn(gear4_1, 225);
    gear3_3.animateAngle(20000, true);

    const gear2_5 = new Gear(scene, 2).setAlpha(0.5);
    gear2_5.setPositionBasedOn(gear3_3, 135);
    gear2_5.animateAngle(10000);

    const gear3_4 = new Gear(scene, 3, true).setAlpha(0.5);
    gear3_4.setPositionBasedOn(gear2_5, 135);
    gear3_4.animateAngle(20000, true);
  }
}
