export type StatisticEasing = "linear" | "ease-out" | "ease-in-out";

export interface StatisticProps {
  value: number;
  animated: boolean;
  startValue: number;
  duration: number;
  easing: StatisticEasing;
  title: string;
  prefix: string;
  suffix: string;
  precision?: number;
  formatter?: (value: number) => string;
  groupSeparator: string;
  decimalSeparator: string;
  valueStyle: Record<string, string | number>;
}

export interface StatisticSlots {
  title?: unknown;
  prefix?: unknown;
  suffix?: unknown;
}
