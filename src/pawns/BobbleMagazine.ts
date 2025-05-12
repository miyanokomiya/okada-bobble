import { Bobble, BOBBLE_RADIUS } from "./bobbles/Bobble";
import { createBobble } from "./bobbles/bobbleFactory";

const MAX_COUNT = 5;
const PADDING = 5;
const width = BOBBLE_RADIUS * 2 * MAX_COUNT + PADDING * (MAX_COUNT + 1);

export class BobbleMagazine extends Phaser.GameObjects.Container {
  private bobbles: Bobble[] = [];
  private reloading = false;
  private eventEmitter: Phaser.Events.EventEmitter = new Phaser.Events.EventEmitter();

  constructor(scene: Phaser.Scene, x: number, y: number) {
    const background = scene.add.rectangle(0, 0, width, BOBBLE_RADIUS * 2 + PADDING * 2, 0xaaaaaa);
    super(scene, x, y, [background]);
    scene.add.existing(this);
  }

  fill() {
    const currentCount = this.bobbles.length;
    if (currentCount >= MAX_COUNT) return;

    let x = -width / 2 + BOBBLE_RADIUS + PADDING;
    for (let i = currentCount; i < MAX_COUNT; i++) {
      const seed = Phaser.Math.Between(1, 4);
      const bobble = createBobble(this.scene, x, 0, {
        label: seed % 2 === 0 ? "oka" : "da",
        color: seed as any,
      });
      this.bobbles.push(bobble);
      this.add(bobble);
    }

    for (let i = 0; i < this.bobbles.length; i++) {
      const bobble = this.bobbles[this.bobbles.length - 1 - i];
      this.scene.tweens.add({
        targets: bobble,
        x,
        duration: 500,
        ease: "linear",
      });
      x += BOBBLE_RADIUS * 2 + PADDING;
    }
  }

  reload() {
    const currentCount = this.bobbles.length;
    if (currentCount >= MAX_COUNT) return;

    this.reloading = true;
    let x = -width / 2 + BOBBLE_RADIUS + PADDING;

    const seed = Phaser.Math.Between(1, 4);
    const bobble = createBobble(this.scene, x - BOBBLE_RADIUS, 0, {
      label: seed % 2 === 0 ? "oka" : "da",
      color: seed % 2 as any,
    });
    this.bobbles.push(bobble);
    this.add(bobble);

    const duration = 200;
    const cooltime = 20;
    this.bobbles.toReversed().forEach((bobble, i) => {
      if (i === 0) {
        bobble.scaleX = 0.1;
        bobble.scaleY = 0.1;
        this.scene.tweens.add({
          targets: bobble,
          x,
          scaleX: 1,
          scaleY: 1,
          duration,
          ease: "linear",
          onComplete: () => {
            this.scene.time.delayedCall(cooltime, () => {
              if (this.bobbles.length < MAX_COUNT) {
                this.reload();
              } else {
                this.reloading = false;
                this.eventEmitter.emit("reloaded");
              }
            });
          },
        });
      } else {
        this.scene.tweens.add({
          targets: bobble,
          x,
          duration,
          ease: "linear",
        });
      }
      x += BOBBLE_RADIUS * 2 + PADDING;
    });
  }

  isReloaded(): boolean {
    return !this.reloading;
  }

  onReloaded(callback: () => void): void {
    this.eventEmitter.on("reloaded", callback);
  }

  popBobble(): Bobble | undefined {
    if (!this.isReloaded()) return;

    const bobble = this.bobbles.shift();
    if (!bobble) return;

    const p = bobble.getWorldPoint();
    this.remove(bobble);
    bobble.setPosition(p.x, p.y);
    return bobble;
  }
}
