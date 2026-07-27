import type { FieldVariant } from "../../../types/field";

export interface TimeShortcut {
  label: string;
  value: string;
  endValue?: string;
}

export type TimePickerModelValue = string | [string, string];
export type TimePickerSize = "small" | "default" | "large" | "sm" | "md" | "lg" | "";
export type TimePickerVariant = FieldVariant;
export type TimePickerRole = "start" | "end";
export type DisabledHours = (role: TimePickerRole) => number[];
export type DisabledMinutes = (hour: number, role: TimePickerRole) => number[];
export type DisabledSeconds = (hour: number, minute: number, role: TimePickerRole) => number[];

export interface TimePickerProps {
  modelValue: TimePickerModelValue;
  endValue: string;
  range: boolean;
  isRange: boolean;
  min: string;
  max: string;
  step: number;
  format: string;
  valueFormat: string;
  disabledHours?: DisabledHours;
  disabledMinutes?: DisabledMinutes;
  disabledSeconds?: DisabledSeconds;
  readonly: boolean;
  editable: boolean;
  size: TimePickerSize;
  variant: TimePickerVariant;
  label: string;
  placeholder: string;
  startPlaceholder: string;
  endPlaceholder: string;
  rangeSeparator: string;
  disabled: boolean;
  clearable: boolean;
  id: string | [string, string];
  name: string;
  tabindex: string | number;
  valueOnClear: string | [string, string] | (() => string | [string, string]) | undefined;
  emptyValues: unknown[];
  saveOnBlur: boolean;
  shortcuts: TimeShortcut[];
  arrowControl: boolean;
  teleported: boolean;
  placement: "top-start" | "bottom-start";
  popperClass: string;
  popperStyle: Record<string, string>;
  ariaLabel: string;
  prefixIcon: string;
  clearIcon: string;
  validateEvent: boolean;
}

export interface TimePickerExpose {
  focusInput: (target?: TimePickerRole) => void;
  blurInput: () => void;
  handleOpen: (target?: TimePickerRole) => void;
  handleClose: () => void;
}

export type TimePickerElement = HTMLElement & TimePickerExpose;
