import { Bobble } from "../pawns/bobbles/Bobble";
import { pickMinItem } from "../utils/commons";
import { getRectangleSegments } from "../utils/physics";

type TrajectoryInfo = {
  origin: Phaser.Math.Vector2;
  intersection: Phaser.Math.Vector2;
  normal: Phaser.Math.Vector2;
  pedal: Phaser.Math.Vector2;
  distance: number;
  segment: Phaser.Geom.Line;
};

export class TrajectoryComponent {
  constructor(
    private ceilingGroup: Phaser.Physics.Arcade.StaticGroup,
    private wallGroup: Phaser.Physics.Arcade.StaticGroup,
  ) {}

  getTrajectoryPaths(bobble: Bobble, velocity: Phaser.Math.Vector2): Phaser.Math.Vector2[] {
    const paths: Phaser.Math.Vector2[] = [];
    const bobbleCenter = new Phaser.Math.Vector2(bobble.x, bobble.y);
    let latestP = bobbleCenter;
    let latestV = velocity;
    let count = 0;

    while (count < 10) {
      const result = this.getTrajectoryToward({ x: latestP.x, y: latestP.y, radius: bobble.body.radius }, latestV);
      if (!result) break;

      const info = result[0];
      paths.push(info.intersection);
      if (result[1]) break;

      latestP = new Phaser.Math.Vector2(info.intersection.x, info.intersection.y);
      latestV = info.normal
        .clone()
        .scale(-2 * latestV.dot(info.normal))
        .add(latestV);
      count++;
    }

    if (paths.length === 0) return [];
    return [bobbleCenter, ...paths];
  }

  getTrajectoryToward(
    bobble: { x: number; y: number; radius: number },
    velocity: Phaser.Math.Vector2,
  ): [TrajectoryInfo, ceiling: boolean] | undefined {
    const ceilings = this.ceilingGroup.getChildren() as Phaser.GameObjects.Rectangle[];
    const ceilingInfos = ceilings
      .map<[Phaser.GameObjects.Rectangle, TrajectoryInfo, true] | undefined>((wall) => {
        const info = this.getRaycastingResult(wall, bobble, velocity);
        return info ? [wall, info, true] : undefined;
      })
      .filter((info) => !!info);

    const walls = this.wallGroup.getChildren() as Phaser.GameObjects.Rectangle[];
    const wallInfos = walls
      .map<[Phaser.GameObjects.Rectangle, TrajectoryInfo, false] | undefined>((wall) => {
        const info = this.getRaycastingResult(wall, bobble, velocity);
        return info ? [wall, info, false] : undefined;
      })
      .filter((info) => !!info);

    const result = pickMinItem([...ceilingInfos, ...wallInfos], (a) => a[1].distance);
    if (!result) return;

    return [result[1], result[2]];
  }

  private getRaycastingResult(
    wall: Phaser.GameObjects.Rectangle,
    bobble: { x: number; y: number; radius: number },
    velocity: Phaser.Math.Vector2,
  ): TrajectoryInfo | undefined {
    const velocityNormalized = velocity.clone().normalize();
    const velocityPerpendicular = new Phaser.Math.Vector2(-velocityNormalized.y, velocityNormalized.x);

    const center = new Phaser.Math.Vector2(bobble.x, bobble.y);
    const origin1 = center.clone().add(velocityPerpendicular.clone().scale(bobble.radius));
    const origin2 = center.clone().add(velocityPerpendicular.clone().scale(-bobble.radius));
    const results = [origin1, origin2]
      .map((p) => this.getRaycastingResultAt(wall, p, velocity))
      .filter((result) => !!result);
    const closest = results.sort((a, b) => a.distance - b.distance).at(0);
    if (!closest) return;

    const awayV = closest.normal.clone().scale(bobble.radius);
    const awayParallelLine = new Phaser.Geom.Line(
      closest.segment.x1 + awayV.x,
      closest.segment.y1 + awayV.y,
      closest.segment.x2 + awayV.x,
      closest.segment.y2 + awayV.y,
    );
    const centerLine = new Phaser.Geom.Line(center.x, center.y, center.x + velocity.x, center.y + velocity.y);
    const contactCenter = Phaser.Geom.Intersects.GetLineToLine(centerLine, awayParallelLine, true);
    if (!contactCenter) return;

    const intersection = new Phaser.Math.Vector2(contactCenter.x, contactCenter.y);
    return {
      origin: center,
      intersection,
      distance: Phaser.Math.Distance.Between(center.x, center.y, contactCenter.x, contactCenter.y),
      normal: closest.normal,
      pedal: intersection.clone().subtract(awayV),
      segment: closest.segment,
    };
  }

  private getRaycastingResultAt(
    wall: Phaser.GameObjects.Rectangle,
    p: Phaser.Math.Vector2,
    v: Phaser.Math.Vector2,
  ): TrajectoryInfo | undefined {
    const wallSegments = getRectangleSegments(wall);

    let closestIntersection: TrajectoryInfo | undefined;

    for (const [start, end] of wallSegments) {
      const seg = new Phaser.Geom.Line(start.x, start.y, end.x, end.y);
      const intersection = Phaser.Geom.Intersects.GetLineToLine(
        new Phaser.Geom.Line(p.x, p.y, p.x + v.x, p.y + v.y),
        seg,
        true,
      );

      if (intersection) {
        const distance = Phaser.Math.Distance.Between(p.x, p.y, intersection.x, intersection.y);
        if (!closestIntersection || distance < closestIntersection.distance) {
          const pedal = Phaser.Geom.Line.GetNearestPoint(seg, p);
          closestIntersection = {
            origin: p,
            intersection: new Phaser.Math.Vector2(intersection.x, intersection.y),
            distance,
            normal: new Phaser.Math.Vector2(p.x - pedal.x, p.y - pedal.y).normalize(),
            pedal: new Phaser.Math.Vector2(pedal.x, pedal.y),
            segment: seg,
          };
        }
      }
    }

    return closestIntersection;
  }
}
