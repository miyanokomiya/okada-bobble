import Phaser from "phaser";

export class TrajectoryPath extends Phaser.GameObjects.Container {
  private polyline: Phaser.GameObjects.Graphics;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, 0, 0);
    this.polyline = scene.add.graphics();
    this.add(this.polyline);
    scene.add.existing(this);
  }

  drawPath(points: Phaser.Math.Vector2[], color: number = 0xffffff, lineWidth: number = 3): void {
    this.polyline.clear();
    this.polyline.lineStyle(lineWidth, color);

    if (points.length > 0) {
      this.polyline.beginPath();
      this.polyline.moveTo(points[0].x, points[0].y);

      for (let i = 1; i < points.length; i++) {
        this.polyline.lineTo(points[i].x, points[i].y);
      }

      this.polyline.strokePath();
    }
  }

  clearPath(): void {
    this.polyline.clear();
  }
}
