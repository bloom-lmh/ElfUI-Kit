export type CountdownValue = number | string | Date;

export interface CountdownProps {
  value: CountdownValue;
  format: string;
  title: string;
  prefix: string;
  suffix: string;
  valueStyle: Record<string, string | number>;
  ariaLabel: string;
}

export interface CountdownSlots {
  title?: unknown;
  prefix?: unknown;
  suffix?: unknown;
}
