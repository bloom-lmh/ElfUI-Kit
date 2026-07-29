export interface CalendarDateCell {
  iso: string;
  label: number;
  muted: boolean;
  current: boolean;
  disabled: boolean;
  rangeStart: boolean;
  rangeEnd: boolean;
  inRange: boolean;
}

export type CalendarRenderValue = string | number | Node | readonly Node[] | null | undefined;
export type CalendarDateCellRenderer = (cell: CalendarDateCell, date: Date) => CalendarRenderValue;

export interface CalendarProps {
  modelValue: string | [string, string];
  /** 仅控制初始/受控视图月份，不会把日期标记为已选择。 */
  viewDate: string;
  defaultValue: string;
  /** Weekday index from 0 (Sunday) to 6 (Saturday). Falls back to ConfigProvider. */
  firstDayOfWeek?: number;
  range: boolean;
  disabledDate?: (date: Date) => boolean;
  cellClassName?: (date: Date) => string;
  renderDateCell?: CalendarDateCellRenderer;
  showWeekNumber: boolean;
  locale: string;
  ariaLabel: string;
}

export interface CalendarSlots {
  /** Static date-cell fallback. Use renderDateCell when content needs the current date. */
  "date-cell"?: unknown;
  header?: unknown;
  "prev-month"?: unknown;
  "next-month"?: unknown;
  "prev-year"?: unknown;
  "next-year"?: unknown;
}
