import { IntroLevel_01 } from "./introductions/IntroLevel_01";
import { IntroLevel_02 } from "./introductions/IntroLevel_02";
import { IntroLevel_03 } from "./introductions/IntroLevel_03";
import { IntroLevel_04 } from "./introductions/IntroLevel_04";
import { IntroLevel_05 } from "./introductions/IntroLevel_05";
import { Level_01 } from "./Level_01";

export const LEVEL_GRADE = {
  INTRODUCTION: "INTRODUCTION",
  CHALLENGE: "CHALLENGE",
} as const;
export type LevelGrade = keyof typeof LEVEL_GRADE;

export type LevelSceneConfig = { grade: LevelGrade; index: number };

export type Level = {
  grade: (typeof LEVEL_GRADE)[LevelGrade];
  LevelClass: any;
  version: number;
};

export type LevelInfo = {
  grade: LevelGrade;
  index: number;
};

export const LEVEL_LIST: Level[] = [
  { grade: LEVEL_GRADE.INTRODUCTION, LevelClass: IntroLevel_01, version: 1 },
  { grade: LEVEL_GRADE.INTRODUCTION, LevelClass: IntroLevel_02, version: 1 },
  { grade: LEVEL_GRADE.INTRODUCTION, LevelClass: IntroLevel_03, version: 1 },
  { grade: LEVEL_GRADE.INTRODUCTION, LevelClass: IntroLevel_04, version: 1 },
  { grade: LEVEL_GRADE.INTRODUCTION, LevelClass: IntroLevel_05, version: 1 },

  { grade: LEVEL_GRADE.CHALLENGE, LevelClass: Level_01, version: 1 },
  { grade: LEVEL_GRADE.CHALLENGE, LevelClass: Level_01, version: 1 },
  { grade: LEVEL_GRADE.CHALLENGE, LevelClass: Level_01, version: 1 },
];

export function getNextLevel(current: Level): Level | undefined {
  const levels = LEVEL_LIST.filter((level) => level.grade === current.grade);
  const currentIndex = levels.findIndex((level) => level === current);
  return levels.at(currentIndex + 1);
}

export function getLevel(grade: LevelGrade, index = 0): Level | undefined {
  const levels = LEVEL_LIST.filter((level) => level.grade === grade);
  return levels.at(index);
}
