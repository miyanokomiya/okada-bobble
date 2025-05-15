import { BobbleColor, BobbleLabel } from "../../utils/settings";
import { Bobble } from "./Bobble";

export type BobbleSettings = {
  label: BobbleLabel;
  color: BobbleColor;
};

export function createBobble(scene: Phaser.Scene, x: number, y: number, settings: BobbleSettings): Bobble {
  const bobble = new Bobble(scene, x, y, settings.label, settings.color);
  return bobble;
}
