import type { SelectOption } from "../Form/Select/types";

export interface TimeOptionConfig {
  start?: string;
  end?: string;
  step?: string;
  minTime?: string;
  maxTime?: string;
  format?: string;
  includeEndTime?: boolean;
}

export interface ParsedClockTime {
  hours: number;
  minutes: number;
  totalMinutes: number;
}

const CLOCK_PATTERN = /^(\d{1,2}):(\d{2})$/;
const DEFAULT_START = 9 * 60;
const DEFAULT_END = 18 * 60;
const DEFAULT_STEP = 30;

const pad = (value: number): string => String(value).padStart(2, "0");

export const parseClockTime = (value: unknown): ParsedClockTime | null => {
  const match = String(value ?? "")
    .trim()
    .match(CLOCK_PATTERN);
  if (!match) return null;

  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) return null;

  return {
    hours,
    minutes,
    totalMinutes: hours * 60 + minutes,
  };
};

export const parseTimeStep = (value: unknown): number => {
  const parsed = parseClockTime(value);
  return parsed && parsed.totalMinutes > 0 ? parsed.totalMinutes : DEFAULT_STEP;
};

export const toClockValue = (totalMinutes: number): string => {
  const normalized = Math.max(0, Math.min(23 * 60 + 59, totalMinutes));
  return `${pad(Math.floor(normalized / 60))}:${pad(normalized % 60)}`;
};

export const formatClockTime = (totalMinutes: number, pattern = "HH:mm"): string => {
  const normalized = Math.max(0, Math.min(23 * 60 + 59, totalMinutes));
  const hours = Math.floor(normalized / 60);
  const minutes = normalized % 60;
  const period = hours >= 12 ? "PM" : "AM";
  const hour12 = hours % 12 || 12;

  return String(pattern || "HH:mm")
    .replace(/HH/g, pad(hours))
    .replace(/H/g, String(hours))
    .replace(/hh/g, pad(hour12))
    .replace(/h/g, String(hour12))
    .replace(/mm/g, pad(minutes))
    .replace(/A/g, period)
    .replace(/a/g, period.toLowerCase());
};

const boundaryMinutes = (value: unknown, fallback: number | null): number | null =>
  parseClockTime(value)?.totalMinutes ?? fallback;

export const createTimeOptions = (config: TimeOptionConfig = {}): SelectOption[] => {
  const start = boundaryMinutes(config.start, DEFAULT_START) ?? DEFAULT_START;
  const end = boundaryMinutes(config.end, DEFAULT_END) ?? DEFAULT_END;
  const step = parseTimeStep(config.step);
  const minTime = boundaryMinutes(config.minTime, null);
  const maxTime = boundaryMinutes(config.maxTime, null);
  const includeEnd = Boolean(config.includeEndTime);

  if (start > end) return [];

  const values: number[] = [];
  for (let value = start; value < end; value += step) values.push(value);
  if (includeEnd && values.at(-1) !== end) values.push(end);

  return values.map((totalMinutes) => ({
    value: toClockValue(totalMinutes),
    label: formatClockTime(totalMinutes, config.format),
    disabled:
      (minTime !== null && totalMinutes < minTime) || (maxTime !== null && totalMinutes > maxTime),
  }));
};
