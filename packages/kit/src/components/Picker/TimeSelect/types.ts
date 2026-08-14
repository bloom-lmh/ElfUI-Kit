import type { SelectElement, SelectValue } from "../../Form/Select/types";
import type { FieldVariant } from "../../../types/field";

export type TimeSelectSize = "small" | "default" | "large" | "sm" | "md" | "lg" | "";
export type TimeSelectVariant = FieldVariant;

export interface TimeSelectProps {
  modelValue: string;
  start: string;
  end: string;
  step: string;
  minTime: string;
  maxTime: string;
  format: string;
  includeEndTime: boolean;
  editable: boolean;
  disabled: boolean;
  required: boolean;
  clearable: boolean;
  size: TimeSelectSize;
  variant: TimeSelectVariant;
  backgroundColor: string;
  label: string;
  placeholder: string;
  name: string;
  form: string;
  id: string;
  tabindex: string | number;
  effect: string;
  prefixIcon: string;
  clearIcon: string;
  valueOnClear?: SelectValue | (() => SelectValue);
  emptyValues?: unknown[];
  popperClass: string;
  popperStyle: string | Record<string, string | number>;
  validateEvent: boolean;
}

export interface TimeSelectEmits {
  "update:modelValue": [value: string];
  change: [value: string];
  clear: [];
  blur: [event: FocusEvent];
  focus: [event: FocusEvent];
  "visible-change": [visible: boolean];
}

export interface TimeSelectExpose {
  open(): void;
  close(): void;
  focus(): void;
  blur(): void;
}

export type TimeSelectElement = HTMLElement &
  TimeSelectExpose & {
    modelValue: string;
  };

export type TimeSelectInnerElement = SelectElement;
