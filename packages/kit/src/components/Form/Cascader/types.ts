import type { FieldVariant } from "../../../types/field";

export type CascaderValue = string | number | boolean;
export type CascaderPathValue = CascaderValue[];
export type CascaderMultipleValue = CascaderPathValue[];
export type CascaderModelValue =
  CascaderValue | CascaderPathValue | CascaderValue[] | CascaderMultipleValue;
export type CascaderSize = "small" | "default" | "large" | "sm" | "md" | "lg";
export type CascaderVariant = FieldVariant;
export type CascaderExpandTrigger = "click" | "hover";
export type CascaderPanelMode = "auto" | "columns" | "tree";
export type CascaderShowCheckedStrategy = "child" | "parent";
export type CascaderPlacement =
  "top" | "top-start" | "top-end" | "bottom" | "bottom-start" | "bottom-end";

export interface CascaderPopperModifier {
  name: string;
  enabled?: boolean;
  options?: {
    offset?: [number, number];
    padding?: number;
    [key: string]: unknown;
  };
}

export interface CascaderPopperOptions {
  placement?: CascaderPlacement;
  modifiers?: CascaderPopperModifier[];
  [key: string]: unknown;
}

/** Decides whether a selectable cascader node matches a search keyword. */
export type CascaderFilterMethod = (node: CascaderNodeSnapshot, keyword: string) => boolean;
/** May cancel a search before its result list is rendered. */
export type CascaderBeforeFilter = (keyword: string) => boolean | Promise<boolean>;
export type CascaderValueOnClear = CascaderValue | (() => CascaderValue);

export interface CascaderOption {
  label?: string;
  value?: CascaderValue;
  disabled?: boolean;
  children?: CascaderOption[];
  [key: string]: unknown;
}

export interface CascaderFieldNames {
  label?: string;
  value?: string;
  disabled?: string | ((data: CascaderOption) => boolean);
  children?: string;
  leaf?: string | ((data: CascaderOption) => boolean);
  expandTrigger?: CascaderExpandTrigger;
  multiple?: boolean;
  checkStrictly?: boolean;
  emitPath?: boolean;
  lazy?: boolean;
  lazyLoad?: (
    node: unknown,
    resolve: (data: CascaderOption[]) => void,
    reject?: () => void,
  ) => void;
  hoverThreshold?: number;
  checkOnClickNode?: boolean;
  checkOnClickLeaf?: boolean;
  showPrefix?: boolean;
}

export interface CascaderChangeDetail {
  value: CascaderModelValue;
  path: string[] | string[][];
  selected: CascaderOption[] | CascaderOption[][];
  multiple: boolean;
}

export interface CascaderProps {
  modelValue: CascaderModelValue;
  options: CascaderOption[];
  size: CascaderSize | "";
  variant: CascaderVariant;
  backgroundColor: string;
  label: string;
  placeholder: string;
  disabled: boolean;
  clearable: boolean;
  clearIcon: string;
  multiple: boolean;
  checkable: boolean;
  panelMode: CascaderPanelMode;
  treeThreshold: number;
  separator: string;
  props: CascaderFieldNames;
  showAllLevels: boolean;
  collapseTags: boolean;
  collapseTagsTooltip: boolean;
  maxCollapseTags: number;
  maxCollapseTagsTooltipHeight: string | number;
  checkStrictly: boolean;
  emitPath: boolean;
  expandTrigger: CascaderExpandTrigger;
  checkOnClickNode: boolean;
  checkOnClickLeaf: boolean;
  showPrefix: boolean;
  showCheckedStrategy: CascaderShowCheckedStrategy;
  filterable: boolean;
  filterMethod?: CascaderFilterMethod;
  beforeFilter?: CascaderBeforeFilter;
  debounce: number;
  popperClass: string;
  popperStyle: Record<string, string | number>;
  popperOptions: CascaderPopperOptions;
  teleported: boolean;
  appendTo: string | HTMLElement;
  persistent: boolean;
  placement: CascaderPlacement;
  fitInputWidth: boolean;
  fallbackPlacements: CascaderPlacement[];
  effect: string;
  tagType: string;
  tagEffect: string;
  emptyValues?: unknown[];
  valueOnClear?: CascaderValueOnClear;
  validateEvent: boolean;
  virtualScroll: boolean;
  itemSize: number;
  height: number;
}

export interface CascaderNodeSnapshot {
  value: CascaderValue;
  label: string;
  level: number;
  data: CascaderOption;
  pathValues: CascaderPathValue;
  pathLabels: string[];
  checked: boolean;
  isLeaf: boolean;
}

export interface CascaderPanelProps {
  modelValue: CascaderModelValue;
  options: CascaderOption[];
  props: CascaderFieldNames;
  multiple: boolean;
  checkable: boolean;
  checkStrictly: boolean;
  emitPath: boolean;
  showPrefix: boolean;
  virtualScroll: boolean;
  itemSize: number;
  height: number;
}

export type CascaderEmits = {
  "update:modelValue": [value: CascaderModelValue];
  change: [detail: CascaderChangeDetail];
  "expand-change": [value: CascaderPathValue];
  blur: [event: FocusEvent];
  focus: [event: FocusEvent];
  clear: [];
  "visible-change": [visible: boolean];
  "remove-tag": [value: CascaderValue | CascaderPathValue];
};

export interface CascaderSlots {
  default?: unknown;
  empty?: unknown;
  prefix?: unknown;
  "suggestion-item"?: unknown;
  tag?: unknown;
  header?: unknown;
  footer?: unknown;
}

export interface CascaderExpose {
  clearSelection: () => void;
  openPanel: () => void;
  closePanel: () => void;
  togglePopperVisible: (visible?: boolean) => void;
  getCheckedNodes: (leafOnly?: boolean) => CascaderNodeSnapshot[];
  presentText: () => string;
  getContentElement: () => HTMLElement | null;
}

export type CascaderElement = HTMLElement & CascaderExpose & Partial<CascaderProps>;
