import { BobbleMagazine } from "../../pawns/BobbleMagazine";
import { BOBBLE_COLOR, BOBBLE_LABEL, BobbleSrc } from "../../utils/settings";
import { Level_01 } from "../Level_01";

export class IntroLevel_01 extends Level_01 {
  protected countInLine = 12;
  protected lineCount = 16;

  override initBobbleMagazine() {
    this.bobbleMagazine = new BobbleMagazine(
      this.scene,
      this.scene.scale.width / 2 - 160,
      this.scene.scale.height - this.floorThickness - 22,
      undefined,
      true,
    );
    this.bobbleMagazine.setPreset([
      {
        label: BOBBLE_LABEL.DA,
        color: BOBBLE_COLOR.D,
      },
      {
        label: BOBBLE_LABEL.OKA,
        color: BOBBLE_COLOR.D,
      },
      {
        label: BOBBLE_LABEL.OKA,
        color: BOBBLE_COLOR.C,
      },
      {
        label: BOBBLE_LABEL.DA,
        color: BOBBLE_COLOR.C,
      },
      {
        label: BOBBLE_LABEL.DA,
        color: BOBBLE_COLOR.B,
      },
      {
        label: BOBBLE_LABEL.OKA,
        color: BOBBLE_COLOR.B,
      },
      {
        label: BOBBLE_LABEL.OKA,
        color: BOBBLE_COLOR.A,
      },
      {
        label: BOBBLE_LABEL.DA,
        color: BOBBLE_COLOR.A,
      },
    ]);
  }

  override getBobbleSrc(): BobbleSrc[] {
    return [
      ...Array.from({ length: this.countInLine }).map((_, i) => ({
        x: i,
        y: 0,
        label: BOBBLE_LABEL.OKA,
        color: BOBBLE_COLOR.A,
      })),
      ...Array.from({ length: this.countInLine - 1 }).map((_, i) => ({
        x: i,
        y: 1,
        label: BOBBLE_LABEL.DA,
        color: BOBBLE_COLOR.B,
      })),
      ...Array.from({ length: this.countInLine }).map((_, i) => ({
        x: i,
        y: 2,
        label: BOBBLE_LABEL.OKA,
        color: BOBBLE_COLOR.C,
      })),
      ...Array.from({ length: this.countInLine - 1 }).map((_, i) => ({
        x: i,
        y: 3,
        label: BOBBLE_LABEL.DA,
        color: BOBBLE_COLOR.D,
      })),
    ];
  }
}
