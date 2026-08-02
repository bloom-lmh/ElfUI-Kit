import type { FieldVariant } from "../../../types/field";

export type DatePickerType = "date" | "datetime-local" | "month" | "week";

export type DatePickerValue = string | string[];
export type DatePickerVariant = FieldVariant;
export type DatePickerSize = "small" | "default" | "large" | "sm" | "md" | "lg" | "";
export type DatePickerPlacement =
  "bottom" | "bottom-start" | "bottom-end" | "top" | "top-start" | "top-end" | "left" | "right";

export interface DatePickerPopperOptions {
  placement?: DatePickerPlacement;
  offset?: readonly [crossAxis: number, mainAxis: number];
  padding?: number;
  flip?: boolean;
  fallbackPlacements?: DatePickerPlacement[];
}

export interface DateShortcut {
  label: string;
  value: string | (() => string);
  endValue?: string | (() => string);
}

export interface DatePickerProps {
  modelValue: DatePickerValue;
  endValue: string;
  type: DatePickerType;
  variant: DatePickerVariant;
  size: DatePickerSize;
  label: string;
  /** 输入框展示格式，例如 YYYY/MM/DD */
  format: string;
  /** modelValue 的字符串格式，例如 YYYY/MM/DD */
  valueFormat: string;
  range: boolean;
  multiple: boolean;
  actions: boolean;
  showHeader: boolean;
  header: string;
  min: string;
  max: string;
  /** 返回 true 时禁用该日期 */
  disabledDate?: (date: Date) => boolean;
  placeholder: string;
  startPlaceholder: string;
  endPlaceholder: string;
  rangeSeparator: string;
  defaultValue: string;
  defaultTime: string | [string, string];
  unlinkPanels: boolean;
  singlePanel: boolean;
  cellClassName?: (date: Date) => string;
  showWeekNumber: boolean;
  disabled: boolean;
  readonly: boolean;
  editable: boolean;
  clearable: boolean;
  id: string;
  name: string;
  tabindex: string | number;
  ariaLabel: string;
  valueOnClear?: DatePickerValue | (() => DatePickerValue);
  emptyValues?: unknown[];
  validateEvent: boolean;
  shortcuts: DateShortcut[];
  confirmText: string;
  cancelText: string;
  clearText: string;
  /** 使用原生 Popover Top Layer 避免被父级层叠上下文遮挡 */
  teleported: boolean;
  placement: DatePickerPlacement;
  fallbackPlacements: DatePickerPlacement[];
  popperOptions: DatePickerPopperOptions;
  popperClass: string;
  popperStyle: Record<string, string>;
  showFooter: boolean;
  showConfirm: boolean;
}

export interface DatePickerSlots {
  "range-separator"?: unknown;
  "prev-month"?: unknown;
  "next-month"?: unknown;
  "prev-year"?: unknown;
  "next-year"?: unknown;
}

export interface DatePickerExpose {
  focusInput: () => void;
  blurInput: () => void;
  handleOpen: () => void;
  handleClose: () => void;
}

export interface DatePickerEmits {
  "update:modelValue": [DatePickerValue];
  "update:endValue": [string];
  change: [DatePickerValue];
  clear: [];
  confirm: [DatePickerValue];
  cancel: [];
  focus: [event: FocusEvent];
  blur: [event: FocusEvent];
  "calendar-change": [DatePickerValue];
  "panel-change": [date: Date, mode: "month" | "year"];
  "visible-change": [visible: boolean];
}

export type DatePickerElement = HTMLElement & Partial<DatePickerProps> & DatePickerExpose;
