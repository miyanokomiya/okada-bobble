import { InputComponent } from "../components/InputComponent";
import { Bobble } from "../pawns/bobbles/Bobble";
import { createBobble } from "../pawns/bobbles/bobbleFactory";
import { Turret } from "../pawns/bobbles/Turret";

export class Level_01 {
  private turret!: Turret;
  private inputComponent!: InputComponent;

  constructor(public scene: Phaser.Scene) {}

  create() {
    this.inputComponent = new InputComponent(this.scene);

    // Add static walls along the viewport outline
    const { width, height } = this.scene.scale;
    const wallThickness = 20;
    const walls = this.scene.physics.add.staticGroup([
      this.scene.add.rectangle(width / 2, wallThickness / 2, width, wallThickness, 0x000000),
      this.scene.add.rectangle(width / 2, height - wallThickness / 2, width, wallThickness, 0x000000),
      this.scene.add.rectangle(wallThickness / 2, height / 2, wallThickness, height, 0x000000),
      this.scene.add.rectangle(width - wallThickness / 2, height / 2, wallThickness, height, 0x000000),
    ]);

    this.turret = new Turret(this.scene, width / 2, height - wallThickness);

    // Create a group for Bobbles
    const bobbleGroup = this.scene.add.group();

    // Add Bobbles to the group
    const bobbles = [
      createBobble(this.scene, 400, wallThickness + 16, { texture: "oka" }),
      createBobble(this.scene, 400, wallThickness + 16 * 3, { texture: "da" }),
      createBobble(this.scene, 400, wallThickness + 16 * 5, { texture: "da" }),
      createBobble(this.scene, 400, wallThickness + 16 * 10, { texture: "da" }),
    ] as Bobble[];
    bobbles.forEach((bobble) => {
      bobbleGroup.add(bobble);
    });

    const bobbleOverlapGroup = this.scene.add.group(
      bobbleGroup.getChildren().map((bobble) => (bobble as Bobble).overlapObject),
    );

    this.scene.physics.add.collider(walls, bobbleGroup);
    this.scene.physics.add.collider(bobbleGroup, bobbleGroup);

    this.scene.physics.add.overlap(walls, bobbleOverlapGroup, (a, b) => {
      const parentA = (a as Phaser.GameObjects.GameObject).parentContainer;
      const parentB = (b as Phaser.GameObjects.GameObject).parentContainer;
      if (parentA instanceof Bobble) {
        parentA.setMoves(false);
      }
      if (parentB instanceof Bobble) {
        parentB.setMoves(false);
      }
    });
    this.scene.physics.add.overlap(bobbleOverlapGroup, bobbleOverlapGroup, (a, b) => {
      const parentA = (a as Phaser.GameObjects.GameObject).parentContainer;
      const parentB = (b as Phaser.GameObjects.GameObject).parentContainer;
      if (parentA instanceof Bobble && parentB instanceof Bobble) {
        if (!parentA.body.moves || !parentB.body.moves) {
          parentA.setMoves(false);
          parentB.setMoves(false);
        }
      }
    });
  }

  update(_time: number, delta: number): void {
    this.inputComponent.update();

    if (this.inputComponent.pressedKeys.left) {
      this.turret.rotateTopBy((-60 / 1000) * delta);
    }
    if (this.inputComponent.pressedKeys.right) {
      this.turret.rotateTopBy((60 / 1000) * delta);
    }
    return;
  }
}
