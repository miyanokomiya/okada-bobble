import { InputComponent } from "../components/InputComponent";
import { RuleComponent } from "../components/rules/RuleComponent";
import { BobbleMagazine } from "../pawns/BobbleMagazine";
import { Bobble } from "../pawns/bobbles/Bobble";
import { createBobble } from "../pawns/bobbles/bobbleFactory";
import { Turret } from "../pawns/Turret";
import { bounceBallAtWall, stickBallToBall, stickBallToWall } from "../utils/physics";
import { BOBBLE_SPEED } from "../utils/settings";

const WALL_THICKNESS = 30;

export class Level_01 {
  private turret!: Turret;
  private inputComponent!: InputComponent;
  private shootingGroup!: Phaser.GameObjects.Group;
  private bobbleGroup!: Phaser.GameObjects.Group;
  private bobbleMagazine!: BobbleMagazine;
  private loadedBobble: Bobble | undefined;
  private ruleComponent: RuleComponent = new RuleComponent();

  constructor(public scene: Phaser.Scene) {}

  create() {
    this.inputComponent = new InputComponent(this.scene);

    // Add static walls along the viewport outline
    const { width, height } = this.scene.scale;

    const ceiling = this.scene.add.rectangle(width / 2, WALL_THICKNESS / 2, width, WALL_THICKNESS, 0x000000);
    this.scene.physics.add.existing(ceiling, true);

    const floor = this.scene.add.rectangle(width / 2, height - WALL_THICKNESS / 2, width, WALL_THICKNESS, 0x000000);
    this.scene.physics.add.existing(floor, true);

    const walls = this.scene.physics.add.staticGroup([
      this.scene.add.rectangle(WALL_THICKNESS / 2, height / 2, WALL_THICKNESS, height, 0x000000),
      this.scene.add.rectangle(width - WALL_THICKNESS / 2, height / 2, WALL_THICKNESS, height, 0x000000),
    ]);

    this.turret = new Turret(this.scene, width / 2, height - WALL_THICKNESS);

    // Create a group for Bobbles
    this.shootingGroup = this.scene.add.group();
    this.bobbleGroup = this.scene.add.group();
    this.bobbleMagazine = new BobbleMagazine(this.scene, width / 2 - 180, height - WALL_THICKNESS - 30);

    // Add Bobbles to the group
    const bobbles = [
      createBobble(this.scene, 400, WALL_THICKNESS + 16, { label: "oka", color: 1 }),
      createBobble(this.scene, 400, WALL_THICKNESS + 16 * 3, { label: "da", color: 2 }),
      createBobble(this.scene, 400, WALL_THICKNESS + 16 * 5, { label: "da", color: 3 }),
      createBobble(this.scene, 600, WALL_THICKNESS + 16 * 10, { label: "da", color: 4 }),
    ] as Bobble[];
    bobbles.forEach((bobble) => {
      this.bobbleGroup.add(bobble);
    });

    this.scene.physics.add.collider(this.bobbleGroup, floor);
    this.scene.physics.add.collider(this.shootingGroup, floor);
    this.scene.physics.add.overlap(this.shootingGroup, walls, onOverlapBobbleAndWall);
    this.scene.physics.add.overlap(this.shootingGroup, ceiling, (bobble, celing) => {
      if (!(bobble instanceof Bobble)) return;

      onOverlapBobbleAndCeiling(bobble, celing);
      if (!bobble.body.moves) {
        this.finishShooting(bobble);
      }
    });
    this.scene.physics.add.overlap(this.shootingGroup, this.bobbleGroup, (a, b) => {
      if (!(a instanceof Bobble)) return;

      onOverlapBobbleAndBobble(a, b);
      if (!a.body.moves) {
        this.finishShooting(a);
      }
    });

    this.bobbleMagazine.onReloaded(() => {
      this.reloadBobble();
    });
    this.bobbleMagazine.reload();

    this.resetBobbleMoves();
  }

  update(_time: number, delta: number): void {
    this.inputComponent.update();

    if (this.inputComponent.pressedKeys.left) {
      this.turret.rotateTopBy((-60 / 1000) * delta);
    }
    if (this.inputComponent.pressedKeys.right) {
      this.turret.rotateTopBy((60 / 1000) * delta);
    }
    if (this.inputComponent.justPressedKeys.space) {
      this.shootBobble();
    }
    if (this.inputComponent.justPressedKeys.down) {
      this.cleanFloatingBobbles();
    }
  }

  private isShooting() {
    return this.shootingGroup.getLength() > 0;
  }

  private finishShooting(bobble: Bobble) {
    this.shootingGroup.remove(bobble);
    this.bobbleGroup.add(bobble);

    this.ruleComponent.setBobbles(this.bobbleGroup.getChildren().filter((b) => b instanceof Bobble) as Bobble[]);
    const result = this.ruleComponent.landBobble(bobble);
    if (result.completed) {
      this.scene.time.delayedCall(100, () => {
        result.completed?.forEach((bobble) => {
          bobble.setMoves(true);
        });
        // Clean up the completed bobbles
        this.cleanFloatingBobbles();
        // Reset current bobble moves then clean floating bobbles
        this.resetBobbleMoves();
        this.cleanFloatingBobbles();
      });
    }
  }

  private shootBobble() {
    if (this.isShooting()) return;

    const angle = this.turret.getTurretAngle();
    const newBobble = this.loadedBobble;
    if (!newBobble) return;

    this.loadedBobble = undefined;
    this.scene.physics.add.existing(newBobble);
    const body = newBobble.body as Phaser.Physics.Arcade.Body;
    const speed = BOBBLE_SPEED;
    body.setVelocity(Math.cos(Phaser.Math.DegToRad(angle)) * speed, Math.sin(Phaser.Math.DegToRad(angle)) * speed);
    this.scene.add.existing(newBobble);
    this.shootingGroup.add(newBobble);

    this.reloadBobble();
  }

  private reloadBobble() {
    if (!this.bobbleMagazine.isReloaded()) return;
    if (this.loadedBobble) return;

    this.loadedBobble = this.bobbleMagazine.popBobble();
    if (!this.loadedBobble) return;

    const center = this.turret.getTurretCenterPosition();
    this.scene.tweens.add({
      targets: this.loadedBobble,
      x: center.x,
      y: center.y,
      duration: 200,
      ease: "linear",
      onComplete: () => {},
    });

    this.bobbleMagazine.reload();
  }

  private isTouchingWall(bobble: Bobble): boolean {
    const { x, y } = bobble;
    const radius = bobble.body.radius;
    return (
      y - radius <= WALL_THICKNESS ||
      y + radius >= this.scene.scale.height - WALL_THICKNESS ||
      x - radius <= WALL_THICKNESS ||
      x + radius >= this.scene.scale.width - WALL_THICKNESS
    );
  }

  private resetBobbleMoves() {
    this.ruleComponent.setBobbles(this.bobbleGroup.getChildren().filter((b) => b instanceof Bobble));
    const clusters = this.ruleComponent.getBobbleClusters();
    clusters.forEach((cluster) => {
      cluster.forEach((bobble) => {
        if (this.isTouchingWall(bobble)) {
          bobble.setMoves(false);
        } else {
          bobble.setMoves(true);
        }
      });
    });

    clusters.forEach((cluster) => {
      const fixed = Array.from(cluster).some((bobble) => !bobble.body.moves);
      if (fixed) {
        cluster.forEach((bobble) => {
          bobble.setMoves(false);
        });
      } else {
        cluster.forEach((bobble) => {
          bobble.setMoves(true);
        });
      }
    });
  }

  private cleanFloatingBobbles() {
    const completed = this.bobbleGroup
      .getChildren()
      .filter((bobble) => bobble instanceof Bobble)
      .filter((bobble) => bobble.body.moves);
    completed.forEach((bobble) => {
      this.bobbleGroup.remove(bobble);
    });

    this.scene.tweens.add({
      targets: completed,
      alpha: 0,
      y: "+=160",
      duration: 1000,
      ease: Phaser.Math.Easing.Quadratic.In,
      onComplete: () => {
        completed.forEach((bobble) => {
          bobble.destroy();
        });
      },
    });
  }
}

function onOverlapBobbleAndCeiling(bobble: any, ceiling: any) {
  if (bobble instanceof Bobble) {
    if (stickBallToWall(bobble, ceiling)) {
      bobble.setMoves(false);
    }
  }
}

function onOverlapBobbleAndWall(bobble: any, wall: any) {
  if (bobble instanceof Bobble) {
    bounceBallAtWall(bobble, wall as any);
  }
}

function onOverlapBobbleAndBobble(a: any, b: any) {
  if (a instanceof Bobble && b instanceof Bobble) {
    if (!a.body.moves || !b.body.moves) {
      if (stickBallToBall(a, b)) {
        a.setMoves(false);
        b.setMoves(false);
      }
    }
  }
}
