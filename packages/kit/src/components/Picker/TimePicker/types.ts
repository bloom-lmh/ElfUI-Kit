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
export type TimePickerPlacement =
  "bottom" | "bottom-start" | "bottom-end" | "top" | "top-start" | "top-end" | "left" | "right";
export interface TimePickerPopperOptions {
  placement?: TimePickerPlacement;
  offset?: readonly [crossAxis: number, mainAxis: number];
  padding?: number;
  flip?: boolean;
  fallbackPlacements?: TimePickerPlacement[];
}
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
  valueOnClear?: string | [string, string] | (() => string | [string, string]);
  emptyValues?: unknown[];
  saveOnBlur: boolean;
  shortcuts: TimeShortcut[];
  defaultValue: string | [string, string];
  arrowControl: boolean;
  teleported: boolean;
  placement: TimePickerPlacement;
  fallbackPlacements: TimePickerPlacement[];
  popperOptions: TimePickerPopperOptions;
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
