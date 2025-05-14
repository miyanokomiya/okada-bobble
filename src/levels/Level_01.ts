import { InputComponent } from "../components/InputComponent";
import { RuleComponent } from "../components/rules/RuleComponent";
import { TrajectoryComponent } from "../components/TrajectoryComponent";
import { BobbleMagazine } from "../pawns/BobbleMagazine";
import { Bobble, BOBBLE_RADIUS } from "../pawns/bobbles/Bobble";
import { createBobble } from "../pawns/bobbles/bobbleFactory";
import { TrajectoryPath } from "../pawns/TrajectoryPath";
import { Turret } from "../pawns/Turret";
import { bounceBallAtWall, stickBallToBall, stickBallToWall } from "../utils/physics";
import { BOBBLE_SPEED, BobbleSrc } from "../utils/settings";

export class Level_01 extends Phaser.Events.EventEmitter {
  private turret!: Turret;
  private inputComponent!: InputComponent;
  private shootingGroup!: Phaser.GameObjects.Group;
  private bobbleGroup!: Phaser.GameObjects.Group;
  private bobbleMagazine!: BobbleMagazine;
  private loadedBobble: Bobble | undefined;
  private ruleComponent: RuleComponent = new RuleComponent();
  private trajectoryComponent!: TrajectoryComponent;
  private firstLineType: 0 | 1 = 0;
  private trajectoryPath!: TrajectoryPath;
  private isLoading: boolean = false;

  private soundBobbleShoot: Phaser.Sound.BaseSound;
  private soundBobbleLand: Phaser.Sound.BaseSound;
  private soundBobbleComplete: Phaser.Sound.BaseSound;

  protected wallThickness = 32;
  protected ceilingThickness = 32;
  protected floorThickness = 32;
  protected countInLine = 12; // should be equal or less than 20
  protected lineCount = 16; // should be equal or less than 16

  constructor(public scene: Phaser.Scene) {
    super();

    this.soundBobbleShoot = scene.sound.add("bobble_shoot", { volume: 0.5 });
    this.soundBobbleLand = scene.sound.add("bobble_land", { volume: 0.5 });
    this.soundBobbleComplete = scene.sound.add("bobble_complete", { volume: 0.5 });

    this.inputComponent = new InputComponent(this.scene);
  }

  create() {
    // Add static walls along the viewport outline
    const { width, height } = this.scene.scale;
    this.wallThickness = (width - this.countInLine * BOBBLE_RADIUS * 2) / 2;
    const linesHeight = this.lineCount * Math.sqrt(3) * BOBBLE_RADIUS;
    const turretHeight = 100;
    this.ceilingThickness = height - linesHeight - turretHeight;
    const wallThickness = this.wallThickness;

    const ceilings = this.scene.physics.add.staticGroup([
      this.scene.add.rectangle(width / 2, this.ceilingThickness / 2, width, this.ceilingThickness, 0x000000),
    ]);

    const floor = this.scene.add.rectangle(
      width / 2,
      height - this.floorThickness / 2,
      width,
      this.floorThickness,
      0x000000,
    );
    this.scene.physics.add.existing(floor, true);

    const walls = this.scene.physics.add.staticGroup([
      this.scene.add.rectangle(wallThickness / 2, height / 2, wallThickness, height, 0x000000),
      this.scene.add.rectangle(width - wallThickness / 2, height / 2, wallThickness, height, 0x000000),
    ]);

    this.trajectoryComponent = new TrajectoryComponent(ceilings, walls);

    this.turret = new Turret(this.scene, width / 2, height - this.floorThickness);
    this.trajectoryPath = new TrajectoryPath(this.scene);

    // Create a group for Bobbles
    this.shootingGroup = this.scene.add.group();
    this.bobbleGroup = this.scene.add.group();
    this.bobbleMagazine = new BobbleMagazine(this.scene, width / 2 - 160, height - this.floorThickness - 22, "123456");

    const bobbles = this.getBobbleSrc().map((src) => {
      const { x, y } = this.getBobblePositionFromCoordinates(src.x, src.y);
      return createBobble(this.scene, x, y, {
        label: src.label,
        color: src.color,
      });
    });
    bobbles.forEach((bobble) => {
      this.bobbleGroup.add(bobble);
    });

    this.scene.physics.add.collider(this.bobbleGroup, floor);
    this.scene.physics.add.collider(this.shootingGroup, floor);
    this.scene.physics.add.overlap(this.shootingGroup, walls, onOverlapBobbleAndWall);
    this.scene.physics.add.overlap(this.shootingGroup, ceilings, (bobble, celing) => {
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

    this.alignBobbles();
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
      // this.cleanFloatingBobbles();
      this.emit("level-clear");
    }
    this.updateTrajectory();
  }

  protected getBobbleSrc(): BobbleSrc[] {
    return [
      { x: 6, y: 0, label: "oka", color: 1 },
      { x: 7, y: 0, label: "da", color: 2 },
      { x: 6, y: 1, label: "oka", color: 1 },
      { x: 5, y: 1, label: "da", color: 2 },
    ];
  }

  private getBobblePositionFromCoordinates(xIndex: number, yIndex: number) {
    const originX = this.wallThickness + BOBBLE_RADIUS + (this.firstLineType === 0 ? 0 : BOBBLE_RADIUS);
    const originY = this.ceilingThickness + BOBBLE_RADIUS;
    const unitX = BOBBLE_RADIUS * 2;
    const unitY = Math.sqrt(3) * BOBBLE_RADIUS;
    const noPadding = yIndex % 2 === this.firstLineType;
    const adjustedOriginX = noPadding ? originX : originX + unitX / 2;
    const x = xIndex * unitX + adjustedOriginX;
    const y = yIndex * unitY + originY;
    return { x, y };
  }

  private alignBobbles(animate = false) {
    const originX = this.wallThickness + BOBBLE_RADIUS + (this.firstLineType === 0 ? 0 : BOBBLE_RADIUS);
    const originY = this.ceilingThickness + BOBBLE_RADIUS;
    const unitX = BOBBLE_RADIUS * 2;
    const unitY = Math.sqrt(3) * BOBBLE_RADIUS;

    const bobbles = this.bobbleGroup.getChildren().filter((b) => b instanceof Bobble) as Bobble[];
    bobbles.forEach((bobble) => {
      const yIndex = Math.round((bobble.y - originY) / unitY);
      const noPadding = yIndex % 2 === this.firstLineType;

      const adjustedOriginX = noPadding ? originX : originX + unitX / 2;
      const xIndex = Math.round((bobble.x - adjustedOriginX) / unitX);
      const x = xIndex * unitX + adjustedOriginX;
      const y = yIndex * unitY + originY;
      if (bobble.x === x && bobble.y === y) return;

      if (animate) {
        this.scene.tweens.add({
          targets: bobble,
          x,
          y,
          duration: 25,
        });
      } else {
        bobble.setPosition(x, y);
      }
    });
  }

  private isShooting() {
    return this.shootingGroup.getLength() > 0;
  }

  private finishShooting(bobble: Bobble) {
    this.shootingGroup.remove(bobble);
    this.bobbleGroup.add(bobble);
    this.alignBobbles(true);
    this.soundBobbleLand.play();

    // Have to delay to wait for the alignment animation
    this.scene.time.delayedCall(100, () => {
      this.ruleComponent.setBobbles(this.bobbleGroup.getChildren().filter((b) => b instanceof Bobble) as Bobble[]);
      const result = this.ruleComponent.landBobble(bobble);
      if (result.completed) {
        result.completed?.forEach((bobble) => {
          bobble.setMoves(true);
        });
        // Clean up the completed bobbles
        this.cleanFloatingBobbles();
        // Reset current bobble moves then clean floating bobbles
        this.resetBobbleMoves();
        this.cleanFloatingBobbles();
        this.soundBobbleComplete.play();
      }
    });
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
    this.soundBobbleShoot.play();

    this.reloadBobble();
  }

  private updateTrajectory() {
    if (!this.loadedBobble || this.isLoading) {
      this.trajectoryPath.clearPath();
      return;
    }

    const angle = this.turret.getTurretAngle();
    const v = new Phaser.Math.Vector2(Math.cos(Phaser.Math.DegToRad(angle)), Math.sin(Phaser.Math.DegToRad(angle)));
    const paths = this.trajectoryComponent.getTrajectoryPaths(this.loadedBobble, v);
    this.trajectoryPath.drawPath(paths);
  }

  private reloadBobble() {
    if (!this.bobbleMagazine.isReloaded()) return;
    if (this.loadedBobble) return;

    this.loadedBobble = this.bobbleMagazine.popBobble();
    if (!this.loadedBobble) return;

    this.isLoading = true;
    const center = this.turret.getTurretCenterPosition();
    this.scene.tweens.add({
      targets: this.loadedBobble,
      x: center.x,
      y: center.y,
      duration: 200,
      ease: "linear",
      onComplete: () => {
        this.isLoading = false;
      },
    });

    this.bobbleMagazine.reload();
  }

  private isTouchingWall(bobble: Bobble): boolean {
    const { x, y } = bobble;
    const radius = bobble.body.radius;
    return (
      y - radius <= this.wallThickness ||
      y + radius >= this.scene.scale.height - this.wallThickness ||
      x - radius <= this.wallThickness ||
      x + radius >= this.scene.scale.width - this.wallThickness
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
