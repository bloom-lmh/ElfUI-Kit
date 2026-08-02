export type DateAdapterUnit = "day" | "month" | "year";

export type DateFormatPreset =
  | "fullDate"
  | "keyboardDate"
  | "keyboardDateTime"
  | "monthAndYear"
  | "monthLong"
  | "monthShort"
  | "weekdayShort";

export interface DateAdapterContext {
  locale?: string;
  timeZone?: string;
  formats?: Partial<Record<DateFormatPreset, Intl.DateTimeFormatOptions>>;
}

export interface DateAdapter {
  now(): Date;
  create(
    year: number,
    month: number,
    day?: number,
    hour?: number,
    minute?: number,
    second?: number,
  ): Date;
  parse(value: unknown, pattern?: string): Date | null;
  format(value: Date, pattern?: string, context?: DateAdapterContext): string;
  toISODate(value: Date): string;
  toISODateTime(value: Date): string;
  getYear(value: Date): number;
  getMonth(value: Date): number;
  getDate(value: Date): number;
  getWeekday(value: Date): number;
  getWeekNumber(value: Date): number;
  add(value: Date, amount: number, unit: DateAdapterUnit): Date;
  compare(left: Date, right: Date): number;
  daysInMonth(value: Date): number;
  isValid(value: unknown): boolean;
}

export interface DateOptions extends DateAdapterContext {
  adapter?: DateAdapter;
  firstDayOfWeek?: number;
}

const DEFAULT_FORMATS: Record<DateFormatPreset, Intl.DateTimeFormatOptions> = {
  fullDate: { dateStyle: "full" },
  keyboardDate: { year: "numeric", month: "2-digit", day: "2-digit" },
  keyboardDateTime: {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  },
  monthAndYear: { year: "numeric", month: "long" },
  monthLong: { month: "long" },
  monthShort: { month: "short" },
  weekdayShort: { weekday: "short" },
};

const TOKEN_PATTERN = /YYYY|MM|DD|HH|mm|ss/g;
const TOKEN_VALUE = "(\\d{2})";

const pad = (value: number): string => String(value).padStart(2, "0");

const exactDate = (
  year: number,
  month: number,
  day: number,
  hour = 0,
  minute = 0,
  second = 0,
): Date | null => {
  const date = new Date(year, month - 1, day, hour, minute, second, 0);
  return date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day &&
    date.getHours() === hour &&
    date.getMinutes() === minute &&
    date.getSeconds() === second
    ? date
    : null;
};

const parseByPattern = (value: string, pattern: string): Date | null => {
  const tokens: string[] = [];
  const expression = pattern
    .replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
    .replace(TOKEN_PATTERN, (token) => {
      tokens.push(token);
      return token === "YYYY" ? "(\\d{4})" : TOKEN_VALUE;
    });
  const match = new RegExp(`^${expression}$`).exec(value);
  if (!match) return null;

  const parts: Record<string, number> = {};
  tokens.forEach((token, index) => {
    parts[token] = Number(match[index + 1]);
  });
  return exactDate(
    parts.YYYY ?? new Date().getFullYear(),
    parts.MM ?? 1,
    parts.DD ?? 1,
    parts.HH ?? 0,
    parts.mm ?? 0,
    parts.ss ?? 0,
  );
};

const parseLocalISO = (value: string): Date | null => {
  const match = /^(\d{4})-(\d{2})-(\d{2})(?:[T ](\d{2}):(\d{2})(?::(\d{2}))?)?$/.exec(value);
  if (!match) return null;
  return exactDate(
    Number(match[1]),
    Number(match[2]),
    Number(match[3]),
    Number(match[4] ?? 0),
    Number(match[5] ?? 0),
    Number(match[6] ?? 0),
  );
};

const cloneDate = (value: Date): Date => new Date(value.getTime());

export const createNativeDateAdapter = (): DateAdapter => ({
  now: () => new Date(),

  create: (year, month, day = 1, hour = 0, minute = 0, second = 0) =>
    new Date(year, month, day, hour, minute, second, 0),

  parse(value, pattern) {
    if (value instanceof Date) return this.isValid(value) ? cloneDate(value) : null;
    if (typeof value === "number") {
      const date = new Date(value);
      return this.isValid(date) ? date : null;
    }
    const source = String(value ?? "").trim();
    if (!source) return null;
    const date = pattern
      ? parseByPattern(source, pattern)
      : (parseLocalISO(source) ?? new Date(source));
    return this.isValid(date) ? date : null;
  },

  format(value, pattern = "YYYY-MM-DD", context) {
    if (!this.isValid(value)) return "";
    const preset = DEFAULT_FORMATS[pattern as DateFormatPreset];
    if (preset) {
      return new Intl.DateTimeFormat(context?.locale, {
        ...preset,
        ...context?.formats?.[pattern as DateFormatPreset],
        ...(context?.timeZone ? { timeZone: context.timeZone } : {}),
      }).format(value);
    }
    const values: Record<string, string> = {
      YYYY: String(value.getFullYear()),
      MM: pad(value.getMonth() + 1),
      DD: pad(value.getDate()),
      HH: pad(value.getHours()),
      mm: pad(value.getMinutes()),
      ss: pad(value.getSeconds()),
    };
    return pattern.replace(TOKEN_PATTERN, (token) => values[token] ?? token);
  },

  toISODate(value) {
    return this.format(value, "YYYY-MM-DD");
  },

  toISODateTime(value) {
    return this.format(value, "YYYY-MM-DDTHH:mm:ss");
  },

  getYear: (value) => value.getFullYear(),

  getMonth: (value) => value.getMonth(),

  getDate: (value) => value.getDate(),

  getWeekday: (value) => value.getDay(),

  getWeekNumber(value) {
    const utc = new Date(Date.UTC(this.getYear(value), this.getMonth(value), this.getDate(value)));
    utc.setUTCDate(utc.getUTCDate() + 4 - (utc.getUTCDay() || 7));
    const yearStart = new Date(Date.UTC(utc.getUTCFullYear(), 0, 1));
    return Math.ceil(((utc.getTime() - yearStart.getTime()) / 86_400_000 + 1) / 7);
  },

  add(value, amount, unit) {
    const date = cloneDate(value);
    if (unit === "day") date.setDate(date.getDate() + amount);
    if (unit === "month") {
      const day = date.getDate();
      date.setDate(1);
      date.setMonth(date.getMonth() + amount);
      date.setDate(Math.min(day, this.daysInMonth(date)));
    }
    if (unit === "year") {
      const month = date.getMonth();
      const day = date.getDate();
      date.setDate(1);
      date.setFullYear(date.getFullYear() + amount);
      date.setMonth(month);
      date.setDate(Math.min(day, this.daysInMonth(date)));
    }
    return date;
  },

  compare(left, right) {
    return Math.sign(left.getTime() - right.getTime());
  },

  daysInMonth(value) {
    return new Date(value.getFullYear(), value.getMonth() + 1, 0).getDate();
  },

  isValid(value) {
    return value instanceof Date && Number.isFinite(value.getTime());
  },
});

export const nativeDateAdapter = createNativeDateAdapter();
