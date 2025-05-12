import { BOBBLE_COLOR, BOBBLE_LABEL } from "../../utils/settings";
import { Bobble } from "./Bobble";

export type BobbleSettings = {
  label: BOBBLE_LABEL;
  color: BOBBLE_COLOR;
};

export function createBobble(scene: Phaser.Scene, x: number, y: number, settings: BobbleSettings): Bobble {
  const bobble = new Bobble(scene, x, y, settings.label, settings.color);
  return bobble;
}
