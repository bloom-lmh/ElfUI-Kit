import type { HeadingFamily, HeadingLevel } from "./types";

export const createHeadingCounters = (): number[] => [0, 0, 0, 0, 0, 0];

export const advanceHeadingCounters = (
  counters: readonly number[],
  level: HeadingLevel,
): number[] => {
  const next = [...counters];
  next[level - 1] = (next[level - 1] ?? 0) + 1;
  for (let index = level; index < next.length; index += 1) next[index] = 0;
  return next;
};

export const formatMarkdownNumber = (level: HeadingLevel, counters: readonly number[]): string =>
  `${String(counters[level - 1] ?? 0)}.`;

const pad = (value: number, digits: number): string => String(value).padStart(digits, "0");

export const formatHeadingNumber = (
  family: HeadingFamily,
  level: HeadingLevel,
  counters: readonly number[],
): string => {
  // 层级编号约定：h1 是页面标题不参与层级；从 h2 开始编号，
  // h3 显示为「父节序号.子节序号」，以此类推。
  const startIndex = level === 1 ? 0 : 1;
  const segments = counters.slice(startIndex, level);
  if (family === "guide" || family === "brand") {
    return segments.map((value, index) => (index === 0 ? pad(value, 2) : String(value))).join(".");
  }
  if (family === "terminal" || family === "neon") {
    return segments.map((value) => pad(value, 2)).join(".");
  }
  return segments.join(".");
};
