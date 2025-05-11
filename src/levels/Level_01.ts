import { InputComponent } from "../components/InputComponent";
import { Bobble, BOBBLE_COLLISION_PADDING } from "../pawns/bobbles/Bobble";
import { createBobble } from "../pawns/bobbles/bobbleFactory";
import { Turret } from "../pawns/bobbles/Turret";

const WALL_THICKNESS = 20;

export class Level_01 {
  private turret!: Turret;
  private inputComponent!: InputComponent;
  private bobbleGroup!: Phaser.GameObjects.Group;
  private bobbleOverlapGroup!: Phaser.GameObjects.Group;
  private shootCount = 0;

  constructor(public scene: Phaser.Scene) {}

  create() {
    this.inputComponent = new InputComponent(this.scene);

    // Add static walls along the viewport outline
    const { width, height } = this.scene.scale;
    const walls = this.scene.physics.add.staticGroup([
      this.scene.add.rectangle(width / 2, WALL_THICKNESS / 2, width, WALL_THICKNESS, 0x000000),
      this.scene.add.rectangle(width / 2, height - WALL_THICKNESS / 2, width, WALL_THICKNESS, 0x000000),
      this.scene.add.rectangle(WALL_THICKNESS / 2, height / 2, WALL_THICKNESS, height, 0x000000),
      this.scene.add.rectangle(width - WALL_THICKNESS / 2, height / 2, WALL_THICKNESS, height, 0x000000),
    ]);

    this.turret = new Turret(this.scene, width / 2, height - WALL_THICKNESS);

    // Create a group for Bobbles
    this.bobbleGroup = this.scene.add.group();

    // Add Bobbles to the group
    const bobbles = [
      createBobble(this.scene, 400, WALL_THICKNESS + 16, { texture: "oka" }),
      createBobble(this.scene, 400, WALL_THICKNESS + 16 * 3, { texture: "da" }),
      createBobble(this.scene, 400, WALL_THICKNESS + 16 * 5, { texture: "da" }),
      createBobble(this.scene, 200, WALL_THICKNESS + 16 * 10, { texture: "da" }),
    ] as Bobble[];
    bobbles.forEach((bobble) => {
      this.bobbleGroup.add(bobble);
    });

    this.bobbleOverlapGroup = this.scene.add.group(
      this.bobbleGroup.getChildren().map((bobble) => (bobble as Bobble).overlapObject),
    );

    this.scene.physics.add.collider(walls, this.bobbleGroup);
    this.scene.physics.add.overlap(this.bobbleGroup, this.bobbleGroup, (a, b) => {
      if (a instanceof Bobble && b instanceof Bobble) {
        if (!a.body.moves || !b.body.moves) {
          const distance = Phaser.Math.Distance.BetweenPoints(a, b);
          const desiredDistance = a.body.radius + b.body.radius;
          if (distance <= desiredDistance + BOBBLE_COLLISION_PADDING) {
            if (a.body.moves) {
              const v = new Phaser.Math.Vector2(a.x, a.y).subtract(new Phaser.Math.Vector2(b.x, b.y)).normalize();
              a.setPosition(b.x + v.x * desiredDistance, b.y + v.y * desiredDistance);
            } else if (b.body.moves) {
              const v = new Phaser.Math.Vector2(b.x, b.y).subtract(new Phaser.Math.Vector2(a.x, a.y)).normalize();
              b.setPosition(a.x + v.x * desiredDistance, a.y + v.y * desiredDistance);
            }
            a.setMoves(false);
            b.setMoves(false);
          }
        }
      }
    });

    this.scene.physics.add.overlap(walls, this.bobbleOverlapGroup, (a, b) => {
      const parentA = (a as Phaser.GameObjects.GameObject).parentContainer;
      const parentB = (b as Phaser.GameObjects.GameObject).parentContainer;
      [parentA, parentB].forEach((parent) => {
        if (parent instanceof Bobble) {
          parent.setMoves(false);
        }
      });
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
    if (this.inputComponent.justPressedKeys.space) {
      this.shoot();
    }
    if (this.inputComponent.justPressedKeys.down) {
      this.resetBobbleMoves();
      this.updateBobbleMoves();
    }
  }

  private shoot() {
    const angle = this.turret.getTurretAngle();
    const from = this.turret.getTurretTopPosition();

    // Create a new bobble
    const newBobble = createBobble(this.scene, from.x, from.y, { texture: this.shootCount % 2 === 0 ? "oka" : "da" });

    // Add physics to the bobble and set its velocity
    this.scene.physics.add.existing(newBobble);
    const body = newBobble.body as Phaser.Physics.Arcade.Body;
    const speed = 300;
    body.setVelocity(Math.cos(Phaser.Math.DegToRad(angle)) * speed, Math.sin(Phaser.Math.DegToRad(angle)) * speed);

    // Add the bobble to the scene and groups
    this.scene.add.existing(newBobble);
    this.bobbleGroup.add(newBobble);
    this.bobbleOverlapGroup.add(newBobble.overlapObject);

    this.shootCount++;
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
        const distance = Phaser.Math.Distance.BetweenPoints(bobble, other);
        if (distance <= bobble.body.radius + other.body.radius + BOBBLE_COLLISION_PADDING) {
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
