import { BobbleMagazine } from "../../pawns/BobbleMagazine";
import { BOBBLE_COLOR, BOBBLE_LABEL, BobbleSrc } from "../../utils/settings";
import { Level_01 } from "../Level_01";

export class ChalleLevel_04 extends Level_01 {
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
        label: BOBBLE_LABEL.DA,
        color: BOBBLE_COLOR.B
      },
      {
        label: BOBBLE_LABEL.DA,
        color: BOBBLE_COLOR.B,
      },
      {
        label: BOBBLE_LABEL.DA,
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
      {
        x: 4,
        y: 0,
        label: BOBBLE_LABEL.DA,
        color: BOBBLE_COLOR.A,
      },

      {
        x: 4,
        y: 1,
        label: BOBBLE_LABEL.OKA,
        color: BOBBLE_COLOR.B,
      },

      {
        x: 5,
        y: 2,
        label: BOBBLE_LABEL.OKA,
        color: BOBBLE_COLOR.A,
      },

      {
        x: 5,
        y: 3,
        label: BOBBLE_LABEL.OKA,
        color: BOBBLE_COLOR.C,
      },

      {
        x: 5,
        y: 4,
        label: BOBBLE_LABEL.OKA,
        color: BOBBLE_COLOR.A,
      },
      {
        x: 6,
        y: 4,
        label: BOBBLE_LABEL.OKA,
        color: BOBBLE_COLOR.B,
      },

      {
        x: 4,
        y: 5,
        label: BOBBLE_LABEL.OKA,
        color: BOBBLE_COLOR.B,
      },
      {
        x: 6,
        y: 5,
        label: BOBBLE_LABEL.OKA,
        color: BOBBLE_COLOR.A,
      },

      {
        x: 4,
        y: 6,
        label: BOBBLE_LABEL.OKA,
        color: BOBBLE_COLOR.A,
      },
      {
        x: 7,
        y: 6,
        label: BOBBLE_LABEL.OKA,
        color: BOBBLE_COLOR.B,
      },
    ];
  }
}
