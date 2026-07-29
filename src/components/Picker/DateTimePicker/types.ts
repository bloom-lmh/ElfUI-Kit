import type { DatePickerPlacement, DatePickerPopperOptions } from "../DatePicker/types";
import type {
  DisabledHours,
  DisabledMinutes,
  DisabledSeconds,
  TimePickerElement,
} from "../TimePicker/types";
import type { DatePickerElement } from "../DatePicker/types";
import type { FieldVariant } from "../../../types/field";

export type DateTimePickerValue = string | [string, string];
export type DateTimePickerSize =
  | "small"
  | "default"
  | "large"
  | "sm"
  | "md"
  | "lg"
  | "";
export type DateTimePickerVariant = FieldVariant;

export interface DateTimeShortcut {
  label: string;
  value: string | (() => string);
  endValue?: string | (() => string);
}

export interface DateTimePickerProps {
  modelValue: DateTimePickerValue;
  range: boolean;
  format: string;
  valueFormat: string;
  dateFormat: string;
  timeFormat: string;
  label: string;
  dateLabel: string;
  timeLabel: string;
  placeholder: string;
  startPlaceholder: string;
  endPlaceholder: string;
  rangeSeparator: string;
  defaultTime: string | [string, string];
  min: string;
  max: string;
  disabledDate?: (date: Date) => boolean;
  disabledHours?: DisabledHours;
  disabledMinutes?: DisabledMinutes;
  disabledSeconds?: DisabledSeconds;
  shortcuts: DateTimeShortcut[];
  step: number;
  variant: DateTimePickerVariant;
  size: DateTimePickerSize;
  disabled: boolean;
  readonly: boolean;
  editable: boolean;
  clearable: boolean;
  teleported: boolean;
  placement: DatePickerPlacement;
  fallbackPlacements: DatePickerPlacement[];
  popperOptions: DatePickerPopperOptions;
  popperClass: string;
  popperStyle: Record<string, string>;
  id: string;
  name: string;
  tabindex: string | number;
  ariaLabel: string;
  valueOnClear?: DateTimePickerValue | (() => DateTimePickerValue);
  emptyValues?: unknown[];
  validateEvent: boolean;
}

export interface DateTimePickerEmits {
  "update:modelValue": [value: DateTimePickerValue];
  change: [value: DateTimePickerValue];
  clear: [];
  focus: [event: FocusEvent];
  blur: [event: FocusEvent];
  "calendar-change": [value: DateTimePickerValue];
  "visible-change": [visible: boolean];
}

export interface DateTimePickerExpose {
  focus(): void;
  blur(): void;
  openDate(): void;
  openTime(): void;
  close(): void;
}

export type DateTimePickerElement = HTMLElement &
  DateTimePickerExpose &
  Partial<DateTimePickerProps>;

export type DateTimeDateElement = DatePickerElement;
export type DateTimeTimeElement = TimePickerElement;
