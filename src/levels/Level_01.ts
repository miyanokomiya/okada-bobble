import { InputComponent } from "../components/InputComponent";
import { BobbleMagazine } from "../pawns/BobbleMagazine";
import { Bobble } from "../pawns/bobbles/Bobble";
import { createBobble } from "../pawns/bobbles/bobbleFactory";
import { Turret } from "../pawns/Turret";
import { bounceBallAtWall, stickBallToBall, stickBallToWall, BOBBLE_COLLISION_PADDING } from "../utils/physics";

const WALL_THICKNESS = 20;

export class Level_01 {
  private turret!: Turret;
  private inputComponent!: InputComponent;
  private bobbleGroup!: Phaser.GameObjects.Group;
  private bobbleMagazine!: BobbleMagazine;
  private loadedBobble: Bobble | undefined;

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

    this.scene.physics.add.overlap(this.bobbleGroup, ceiling, (bobble, wall) => {
      if (bobble instanceof Bobble) {
        if (stickBallToWall(bobble, wall as any)) {
          bobble.setMoves(false);
        }
      }
    });

    this.scene.physics.add.overlap(this.bobbleGroup, walls, (bobble, wall) => {
      if (bobble instanceof Bobble) {
        bounceBallAtWall(bobble, wall as any);
      }
    });

    this.scene.physics.add.overlap(this.bobbleGroup, this.bobbleGroup, (a, b) => {
      if (a instanceof Bobble && b instanceof Bobble) {
        if (!a.body.moves || !b.body.moves) {
          if (stickBallToBall(a, b)) {
            a.setMoves(false);
            b.setMoves(false);
          }
        }
      }
    });

    this.bobbleMagazine.onReloaded(() => {
      this.reloadBobble();
    });
    this.bobbleMagazine.reload();

    this.resetBobbleMoves();
    this.updateBobbleMoves();
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
      this.resetBobbleMoves();
      this.updateBobbleMoves();
    }
  }

  private shootBobble() {
    const angle = this.turret.getTurretAngle();
    const newBobble = this.loadedBobble;
    if (!newBobble) return;

    this.loadedBobble = undefined;
    this.scene.physics.add.existing(newBobble);
    const body = newBobble.body as Phaser.Physics.Arcade.Body;
    const speed = 500;
    body.setVelocity(Math.cos(Phaser.Math.DegToRad(angle)) * speed, Math.sin(Phaser.Math.DegToRad(angle)) * speed);
    this.scene.add.existing(newBobble);
    this.bobbleGroup.add(newBobble);

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
      onComplete: () => {
      },
    });

    this.bobbleMagazine.reload();
  }

  private updateBobbleMoves() {
    this.bobbleGroup.getChildren().forEach((bobble) => {
      if (!(bobble instanceof Bobble)) return;

      if (bobble.body.moves) {
        bobble.body.setAllowGravity(true);
      }
    });
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
    const clusters = this.getBobbleClusters();
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
      const fixed = cluster.some((bobble) => !bobble.body.moves);
      cluster.forEach((bobble) => {
        bobble.setMoves(!fixed);
      });
    });
  }

  private getBobbleClusters(): Bobble[][] {
    const bobbles = this.bobbleGroup.getChildren().filter((bobble) => bobble instanceof Bobble);
    const visited = new Set<Bobble>();
    const clusters: Bobble[][] = [];

    const findCluster = (bobble: Bobble, cluster: Bobble[]) => {
      if (visited.has(bobble)) return;
      visited.add(bobble);
      cluster.push(bobble);

      bobbles.forEach((other) => {
        const thresholdSq = (bobble.body.radius + other.body.radius) ** 2 + BOBBLE_COLLISION_PADDING ** 2;
        const distance = Phaser.Math.Distance.BetweenPointsSquared(bobble, other);
        if (distance <= thresholdSq) {
          findCluster(other, cluster);
        }
      });
    };

    bobbles.forEach((bobble) => {
      if (visited.has(bobble)) return;

      const cluster: Bobble[] = [];
      findCluster(bobble, cluster);
      clusters.push(cluster);
    });

    return clusters;
  }
}
