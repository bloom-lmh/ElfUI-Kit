import type { FieldVariant } from "../../../types/field";

export type DatePickerType = "date" | "datetime-local" | "month" | "week";

export type DatePickerValue = string | string[];
export type DatePickerVariant = FieldVariant;
export type DatePickerSize = "small" | "default" | "large" | "sm" | "md" | "lg" | "";

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
  disabled: boolean;
  readonly: boolean;
  editable: boolean;
  clearable: boolean;
  id: string;
  name: string;
  tabindex: string | number;
  ariaLabel: string;
  valueOnClear: DatePickerValue | (() => DatePickerValue) | undefined;
  emptyValues: unknown[];
  validateEvent: boolean;
  shortcuts: DateShortcut[];
  confirmText: string;
  cancelText: string;
  clearText: string;
  /** 使用原生 Popover Top Layer 避免被父级层叠上下文遮挡 */
  teleported: boolean;
  placement: "top-start" | "bottom-start";
  popperClass: string;
  popperStyle: Record<string, string>;
  showFooter: boolean;
  showConfirm: boolean;
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
