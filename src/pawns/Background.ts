export class Background extends Phaser.GameObjects.Container {
  constructor(scene: Phaser.Scene) {
    super(scene, 0, 0);
    scene.add.existing(this);
    this.setAlpha(0.5);

    const { width, height } = scene.scale;

    const gear2_1 = this.scene.add.image(width / 2, height / 2, "gear2");
    this.add(gear2_1);

    const gear2_2 = this.scene.add.image(0, 0, "gear2");
    gear2_2.setPosition(
      gear2_1.x - ((gear2_1.width + gear2_2.width) / 2) * 0.625,
      gear2_1.y - ((gear2_1.height + gear2_2.height) / 2) * 0.625,
    );
    this.add(gear2_2);

    const gear3_1 = this.scene.add.image(0, 0, "gear3");
    gear3_1.setPosition(
      gear2_1.x + ((gear2_1.width + gear3_1.width) / 2) * 0.65,
      gear2_1.y - ((gear2_1.height + gear3_1.height) / 2) * 0.65,
    );
    this.add(gear3_1);

    const gear3_2 = this.scene.add.image(0, 0, "gear3");
    gear3_2.setPosition(
      gear2_2.x - ((gear2_2.width + gear3_2.width) / 2) * 0.65,
      gear2_2.y + ((gear2_2.height + gear3_2.height) / 2) * 0.65,
    );
    this.add(gear3_2);

    const gear2_3 = this.scene.add.image(0, 0, "gear2");
    gear2_3.setPosition(gear2_1.x + ((gear2_1.width + gear3_1.width) / 2) * 1.3, gear2_1.y);
    this.add(gear2_3);

    const gear4_1 = this.scene.add.image(0, 0, "gear4");
    gear4_1.setPosition(
      gear3_1.x + ((gear3_1.width + gear4_1.width) / 2) * 0.68,
      gear3_1.y - ((gear3_1.height + gear4_1.height) / 2) * 0.68,
    );
    this.add(gear4_1);

    const gear4_2 = this.scene.add.image(0, 0, "gear4");
    gear4_2.setPosition(
      gear3_2.x - ((gear3_2.width + gear4_2.width) / 2) * 0.68,
      gear3_2.y - ((gear3_2.height + gear4_2.height) / 2) * 0.68,
    );
    this.add(gear4_2);

    const duration = 20000;
    this.scene.tweens.add({
      targets: [gear2_1, gear2_3],
      angle: { from: 0, to: 360 },
      duration,
      repeat: -1,
      ease: "Linear",
    });
    this.scene.tweens.add({
      targets: [gear2_2],
      angle: { from: 360 / 16, to: -360 + 360 / 16 },
      duration,
      repeat: -1,
      ease: "Linear",
    });
    this.scene.tweens.add({
      targets: [gear3_1],
      angle: { from: 360 / 32, to: -360 + 360 / 32 },
      duration: duration * 2,
      repeat: -1,
      ease: "Linear",
    });
    this.scene.tweens.add({
      targets: [gear3_2],
      angle: { from: 0, to: 360 },
      duration: duration * 2,
      repeat: -1,
      ease: "Linear",
    });
    this.scene.tweens.add({
      targets: [gear4_1],
      angle: { from: 0, to: 360 },
      duration: duration * 4,
      repeat: -1,
      ease: "Linear",
    });
    this.scene.tweens.add({
      targets: [gear4_2],
      angle: { from: 360 / 64, to: -360 + 360 / 64 },
      duration: duration * 4,
      repeat: -1,
      ease: "Linear",
    });
  }
}
