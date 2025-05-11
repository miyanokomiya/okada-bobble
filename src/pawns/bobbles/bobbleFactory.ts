import { Bobble } from "./Bobble";

export type BobbleSettings = {
  texture: "oka" | "da";
};

export function createBobble(
  scene: Phaser.Scene,
  x: number,
  y: number,
  settings: BobbleSettings,
): Phaser.GameObjects.Container {
  const frame = settings.texture === "oka" ? 0 : 1;
  const bobble = new Bobble(scene, x, y, "bobbles", frame);
  return bobble;
}
