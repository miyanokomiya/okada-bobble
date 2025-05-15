export const DEFAULT_FONT = "Arial";

export const BOBBLE_LABEL = {
  OKA: "oka",
  DA: "da",
} as const;
export type BobbleLabel = (typeof BOBBLE_LABEL)[keyof typeof BOBBLE_LABEL];

export const BOBBLE_COLOR = {
  WHITE: 0,
  A: 1,
  B: 2,
  C: 3,
  D: 4,
};
export type BobbleColor = (typeof BOBBLE_COLOR)[keyof typeof BOBBLE_COLOR];

export function getBobbleTexture(label: BobbleLabel): { texture: string; frame: number } {
  switch (label) {
    case "oka":
      return { texture: "bobbles", frame: 0 };
    case "da":
      return { texture: "bobbles", frame: 1 };
    default:
      return { texture: "bobbles", frame: 0 };
  }
}

export function getBobbleThemaColor(color: BobbleColor): number {
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

export type BobbleSrc = { x: number; y: number; label: BobbleLabel; color: BobbleColor };
