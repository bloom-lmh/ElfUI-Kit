// elf-select 类型

import type { FieldVariant } from "../../../types/field";

export type SelectSize = "small" | "default" | "large" | "sm" | "md" | "lg";
export type SelectVariant = FieldVariant;
export type SelectPrimitiveValue = string | number | boolean;
export type SelectValue = SelectPrimitiveValue | Record<string, unknown>;

export interface SelectFieldNames {
  value?: string;
  label?: string;
  disabled?: string;
  options?: string;
}

export interface SelectOption {
  label?: string;
  value?: SelectValue;
  disabled?: boolean;
  options?: SelectOption[];
  [key: string]: unknown;
}

export interface SelectProps {
  modelValue: SelectValue | SelectValue[];
  options: SelectOption[];
  props: SelectFieldNames;
  size: SelectSize;
  variant: SelectVariant;
  backgroundColor: string;
  label: string;
  placeholder: string;
  disabled: boolean;
  required: boolean;
  valueKey: string;
  clearable: boolean;
  multiple: boolean;
  collapseTags: boolean;
  maxCollapseTags: number;
  collapseTagsTooltip: boolean;
  tagTooltip: boolean;
  tagType: string;
  tagEffect: string;
  multipleLimit: number;
  filterable: boolean;
  allowCreate: boolean;
  filterMethod?: (query: string, option?: SelectOption) => boolean;
  remote: boolean;
  remoteShowSuffix: boolean;
  remoteMethod?: (query: string) => void;
  debounce: number;
  reserveKeyword: boolean;
  defaultFirstOption: boolean;
  automaticDropdown: boolean;
  loading: boolean;
  loadingText: string;
  noDataText: string;
  noMatchText: string;
  valueOnClear?: SelectValue | SelectValue[] | (() => SelectValue | SelectValue[]);
  emptyValues?: unknown[];
  height: number;
  virtual: boolean;
  virtualThreshold: number;
  itemHeight: number;
  overscan: number;
  fitInputWidth: boolean;
  effect: string;
  autocomplete: string;
  popperClass: string;
  popperStyle: string | Record<string, string | number>;
  persistent: boolean;
  clearIcon: string;
  suffixIcon: string;
  validateEvent: boolean;
  offset: number;
  tabindex: string | number;
  id: string;
  name: string;
  form: string;
}

export interface SelectEmits {
  "update:modelValue": [value: SelectValue | SelectValue[]];
  change: [value: SelectValue | SelectValue[]];
  clear: [];
  "visible-change": [visible: boolean];
  blur: [event: FocusEvent];
  focus: [event: FocusEvent];
  "remove-tag": [value: SelectValue];
  "popup-scroll": [data: { scrollTop: number; scrollLeft: number }];
  "end-reached": [direction: "top" | "bottom"];
  search: [query: string];
}

export interface SelectExpose {
  open(): void;
  close(emitChange?: boolean): void;
  toggle(visible?: boolean): void;
  focus(): void;
  blur(): void;
  selectedLabel(): string | string[];
  scrollToOption(index: number): void;
}

export type SelectElement = HTMLElement & SelectExpose;
