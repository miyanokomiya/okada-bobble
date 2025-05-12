import { Bobble } from "../pawns/bobbles/Bobble";
import { BOBBLE_SPEED } from "./settings";

export const BOBBLE_COLLISION_PADDING = BOBBLE_SPEED / 60;

export function stickBallToBall(a: Bobble, b: Bobble): boolean {
  const distanceSq = Phaser.Math.Distance.BetweenPointsSquared(a, b);
  const desiredDistance = a.body.radius + b.body.radius;
  const thresholdSq = desiredDistance ** 2 + BOBBLE_COLLISION_PADDING ** 2;
  if (distanceSq >= thresholdSq) return false;

  if (a.body.moves) {
    const v = new Phaser.Math.Vector2(a.x, a.y).subtract(new Phaser.Math.Vector2(b.x, b.y)).normalize();
    a.setPosition(b.x + v.x * desiredDistance, b.y + v.y * desiredDistance);
  } else if (b.body.moves) {
    const v = new Phaser.Math.Vector2(b.x, b.y).subtract(new Phaser.Math.Vector2(a.x, a.y)).normalize();
    b.setPosition(a.x + v.x * desiredDistance, a.y + v.y * desiredDistance);
  }

  return true;
}

export function stickBallToWall(ball: Bobble, wall: Phaser.GameObjects.Rectangle): boolean {
  return getRectangleSegments(wall).some((segment) => {
    const info = checkWallCollision(ball, segment);
    if (!info) return false;

    ball.x += info.normal.x * info.penetration;
    ball.y += info.normal.y * info.penetration;
    return true;
  });
}

export function bounceBallAtWall(ball: Bobble, wall: Phaser.GameObjects.Rectangle): boolean {
  return getRectangleSegments(wall).some((segment) => {
    const info = checkWallCollision(ball, segment);
    if (!info) return false;

    ball.x += info.normal.x * info.penetration;
    ball.y += info.normal.y * info.penetration;

    // Bounce the ball
    const velocityDotNormal = ball.body.velocity.dot(info.normal);
    const reflection = info.normal
      .clone()
      .scale(-2 * velocityDotNormal)
      .add(ball.body.velocity);
    ball.body.velocity.set(reflection.x, reflection.y);

    return true;
  });
}

function getRectangleSegments(rectangle: Phaser.GameObjects.Rectangle): [Phaser.Math.Vector2, Phaser.Math.Vector2][] {
  const topLeft = rectangle.getTopLeft();
  const topRight = rectangle.getTopRight();
  const bottomLeft = rectangle.getBottomLeft();
  const bottomRight = rectangle.getBottomRight();
  return [
    [new Phaser.Math.Vector2(topLeft), new Phaser.Math.Vector2(topRight)],
    [new Phaser.Math.Vector2(topRight), new Phaser.Math.Vector2(bottomRight)],
    [new Phaser.Math.Vector2(bottomRight), new Phaser.Math.Vector2(bottomLeft)],
    [new Phaser.Math.Vector2(bottomLeft), new Phaser.Math.Vector2(topLeft)],
  ];
}

function checkWallCollision(ball: Bobble, wall: [Phaser.Math.Vector2, Phaser.Math.Vector2]) {
  const ballCenter = new Phaser.Math.Vector2(ball.x, ball.y);
  const [p1, p2] = wall;
  const closestPoint = Phaser.Geom.Line.GetNearestPoint(new Phaser.Geom.Line(p1.x, p1.y, p2.x, p2.y), ballCenter);
  const distanceSq = Phaser.Math.Distance.BetweenPointsSquared(ballCenter, closestPoint);
  const radiusSq = ball.body.radius ** 2;

  const extra = ball.body.velocity.lengthSq() > 0 ? BOBBLE_COLLISION_PADDING ** 2 : 0;
  if (distanceSq >= radiusSq + extra) return;

  const normalRaw = ballCenter.clone().subtract(closestPoint);
  // Check if the ball isn't moving away from the wall
  if (normalRaw.dot(ball.body.velocity) > 0) return;

  const normal = normalRaw.normalize();
  const distance = Math.sqrt(distanceSq);
  const penetration = ball.body.radius - distance;
  return { normal, penetration, contactPoint: closestPoint };
}
