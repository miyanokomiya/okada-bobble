import { LevelInfo } from "../levels";

let instance: GlobalStorageComponent | undefined;

export type LevelWithVersion = LevelInfo & { version: number };

export class GlobalStorageComponent {
  private levelProgress: { [key: string]: { version: number; status: 0 | 1 } } = {};

  constructor() {
    this.restore();
  }

  save() {
    const data = JSON.stringify(this.levelProgress);
    localStorage.setItem("levelProgress", data);
  }

  restore() {
    const data = localStorage.getItem("levelProgress");
    if (data) {
      this.levelProgress = JSON.parse(data);
    }
  }

  updateLevelProgress(level: LevelWithVersion, status: 0 | 1) {
    const key = `${level.grade}-${level.index}`;
    if (this.levelProgress[key] && this.levelProgress[key].version === level.version) {
      this.levelProgress[key].status = status;
    } else {
      this.levelProgress[key] = { version: level.version, status };
    }
    this.save();
  }

  getLevelProgress(level: LevelWithVersion): 0 | 1 {
    const key = `${level.grade}-${level.index}`;
    if (this.levelProgress[key] && this.levelProgress[key].version === level.version) {
      return this.levelProgress[key].status;
    }
    return 0;
  }
}

export function getGlobalStorageComponent(): GlobalStorageComponent {
  if (!instance) {
    instance = new GlobalStorageComponent();
  }
  return instance;
}
