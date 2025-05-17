import { BobbleMagazine } from "../../pawns/BobbleMagazine";
import { BOBBLE_COLOR, BOBBLE_LABEL, BobbleSrc } from "../../utils/settings";
import { Level_01 } from "../Level_01";

export class ChalleLevel_05 extends Level_01 {
  protected countInLine = 12;
  protected lineCount = 16;

  override initBobbleMagazine() {
    this.bobbleMagazine = new BobbleMagazine(
      this.scene,
      0,
      this.scene.scale.height - this.floorThickness,
      undefined,
      true,
    );
    this.bobbleMagazine.setPreset([
      {
        label: BOBBLE_LABEL.OKA,
        color: BOBBLE_COLOR.C,
      },
      {
        label: BOBBLE_LABEL.OKA,
        color: BOBBLE_COLOR.A,
      },
      {
        label: BOBBLE_LABEL.DA,
        color: BOBBLE_COLOR.A,
      },
      {
        label: BOBBLE_LABEL.DA,
        color: BOBBLE_COLOR.B,
      },
    ]);
  }

  override getBobbleSrc(): BobbleSrc[] {
    return [
      ...[1, 2, 3].map((x) => ({
        x,
        y: 0,
        label: BOBBLE_LABEL.OKA,
        color: BOBBLE_COLOR.B,
      })),
      ...[5, 6, 7].map((x) => ({
        x,
        y: 0,
        label: BOBBLE_LABEL.DA,
        color: BOBBLE_COLOR.B,
      })),
      {
        x: 4,
        y: 0,
        label: BOBBLE_LABEL.DA,
        color: BOBBLE_COLOR.A,
      },

      {
        x: 1,
        y: 1,
        label: BOBBLE_LABEL.DA,
        color: BOBBLE_COLOR.C,
      },
      {
        x: 4,
        y: 1,
        label: BOBBLE_LABEL.DA,
        color: BOBBLE_COLOR.A,
      },
      {
        x: 7,
        y: 1,
        label: BOBBLE_LABEL.DA,
        color: BOBBLE_COLOR.B,
      },

      {
        x: 2,
        y: 2,
        label: BOBBLE_LABEL.DA,
        color: BOBBLE_COLOR.C,
      },
      {
        x: 5,
        y: 2,
        label: BOBBLE_LABEL.DA,
        color: BOBBLE_COLOR.A,
      },
      {
        x: 8,
        y: 2,
        label: BOBBLE_LABEL.DA,
        color: BOBBLE_COLOR.B,
      },

      {
        x: 2,
        y: 3,
        label: BOBBLE_LABEL.DA,
        color: BOBBLE_COLOR.C,
      },
      {
        x: 3,
        y: 3,
        label: BOBBLE_LABEL.DA,
        color: BOBBLE_COLOR.C,
      },
      {
        x: 4,
        y: 3,
        label: BOBBLE_LABEL.DA,
        color: BOBBLE_COLOR.C,
      },
      {
        x: 5,
        y: 3,
        label: BOBBLE_LABEL.DA,
        color: BOBBLE_COLOR.C,
      },
      {
        x: 6,
        y: 3,
        label: BOBBLE_LABEL.DA,
        color: BOBBLE_COLOR.A,
      },
      {
        x: 7,
        y: 3,
        label: BOBBLE_LABEL.DA,
        color: BOBBLE_COLOR.A,
      },
      {
        x: 8,
        y: 3,
        label: BOBBLE_LABEL.DA,
        color: BOBBLE_COLOR.B,
      },

      {
        x: 3,
        y: 4,
        label: BOBBLE_LABEL.DA,
        color: BOBBLE_COLOR.A,
      },
      {
        x: 6,
        y: 4,
        label: BOBBLE_LABEL.DA,
        color: BOBBLE_COLOR.C,
      },
      {
        x: 9,
        y: 4,
        label: BOBBLE_LABEL.DA,
        color: BOBBLE_COLOR.B,
      },

      {
        x: 3,
        y: 5,
        label: BOBBLE_LABEL.DA,
        color: BOBBLE_COLOR.A,
      },
      {
        x: 6,
        y: 5,
        label: BOBBLE_LABEL.DA,
        color: BOBBLE_COLOR.C,
      },
      {
        x: 9,
        y: 5,
        label: BOBBLE_LABEL.DA,
        color: BOBBLE_COLOR.B,
      },

      ...[4, 5, 6].map((x) => ({
        x,
        y: 6,
        label: BOBBLE_LABEL.DA,
        color: BOBBLE_COLOR.A,
      })),
      ...[8, 9, 10].map((x) => ({
        x,
        y: 6,
        label: BOBBLE_LABEL.OKA,
        color: BOBBLE_COLOR.A,
      })),
      {
        x: 7,
        y: 6,
        label: BOBBLE_LABEL.DA,
        color: BOBBLE_COLOR.A,
      },
    ];
  }
}
