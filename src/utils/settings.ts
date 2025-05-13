export type BOBBLE_LABEL = "oka" | "da";
export type BOBBLE_COLOR = 0 | 1 | 2 | 3 | 4;

export function getBobbleTexture(label: BOBBLE_LABEL): { texture: string; frame: number } {
  switch (label) {
    case "oka":
      return { texture: "bobbles", frame: 0 };
    case "da":
      return { texture: "bobbles", frame: 1 };
    default:
      return { texture: "bobbles", frame: 0 };
  }
}

export function getBobbleThemaColor(color: BOBBLE_COLOR): number {
  switch (color) {
    case 1:
      return 0x00ff00;
    case 2:
      return 0xff4400;
    case 3:
      return 0x00ffff;
    case 4:
      return 0xffff00;
    default:
      return 0xffffff;
  }
}

export const BOBBLE_SPEED = 800;

export type BobbleSrc = { x: number; y: number; label: BOBBLE_LABEL; color: BOBBLE_COLOR };
