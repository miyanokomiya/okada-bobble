import { Level_01 } from "./Level_01";

export const LEVEL_GRADE = {
  INTRODUCTION: "INTRODUCTION",
} as const;
export type LevelGrade = keyof typeof LEVEL_GRADE;

export type Level = {
  grade: (typeof LEVEL_GRADE)[LevelGrade];
  LevelClass: any;
};

const LEVEL_INDEX: Level[] = [
  { grade: LEVEL_GRADE.INTRODUCTION, LevelClass: Level_01 },
  { grade: LEVEL_GRADE.INTRODUCTION, LevelClass: Level_01 },
  { grade: LEVEL_GRADE.INTRODUCTION, LevelClass: Level_01 },
];

export function getNextLevel(current: Level): Level | undefined {
  const levels = LEVEL_INDEX.filter((level) => level.grade === current.grade);
  const currentIndex = levels.findIndex((level) => level === current);
  return levels.at(currentIndex + 1);
}

export function getLevel(grade: LevelGrade, index = 0): Level | undefined {
  const levels = LEVEL_INDEX.filter((level) => level.grade === grade);
  return levels.at(index);
}
