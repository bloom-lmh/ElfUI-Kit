import type { FieldVariant } from "../../../types/field";
import type {
  TreeExpose,
  TreeFieldNames,
  TreeNode,
  TreeRenderContent,
} from "../../Data/Tree/types";

export type TreeSelectValue = string | number;
export type TreeSelectModelValue = TreeSelectValue | TreeSelectValue[];
export type TreeSelectSize = "small" | "default" | "large" | "sm" | "md" | "lg";
export type TreeSelectVariant = FieldVariant;
export type TreeSelectPlacement = "bottom-start" | "bottom-end" | "top-start" | "top-end";

export interface TreeSelectProps {
  modelValue: TreeSelectModelValue;
  data: TreeNode[];
  props: TreeFieldNames;
  nodeKey: string;
  valueKey: string;
  multiple: boolean;
  showCheckbox: boolean;
  checkStrictly: boolean;
  defaultExpandAll: boolean;
  defaultExpandedKeys: TreeSelectValue[];
  autoExpandParent: boolean;
  expandOnClickNode: boolean;
  checkOnClickNode: boolean;
  checkOnClickLeaf: boolean;
  accordion: boolean;
  filterable: boolean;
  filterNodeMethod?: (keyword: string, node: TreeNode) => boolean;
  lazy: boolean;
  load?: (
    node: TreeNode,
    resolve: (children: TreeNode[]) => void,
  ) => void | TreeNode[] | Promise<TreeNode[]>;
  renderContent?: TreeRenderContent;
  virtual: boolean;
  height: string | number;
  itemSize: number;
  overscan: number;
  clearable: boolean;
  collapseTags: boolean;
  maxCollapseTags: number;
  multipleLimit: number;
  disabled: boolean;
  size: TreeSelectSize;
  variant: TreeSelectVariant;
  backgroundColor: string;
  label: string;
  placeholder: string;
  filterPlaceholder: string;
  emptyText: string;
  ariaLabel: string;
  clearIcon: string;
  suffixIcon: string;
  valueOnClear?: TreeSelectModelValue | (() => TreeSelectModelValue);
  emptyValues?: unknown[];
  validateEvent: boolean;
  teleported: boolean;
  placement: TreeSelectPlacement;
  fallbackPlacements: TreeSelectPlacement[];
  fitInputWidth: boolean;
  offset: number;
  popperClass: string;
  popperStyle: Record<string, string>;
  tabindex: string | number;
  id: string;
  name: string;
}

export interface TreeSelectEmits {
  "update:modelValue": [value: TreeSelectModelValue];
  change: [value: TreeSelectModelValue];
  clear: [];
  "visible-change": [visible: boolean];
  "remove-tag": [value: TreeSelectValue];
  "node-click": [node: TreeNode, key: TreeSelectValue];
  check: [node: TreeNode, values: TreeSelectValue[]];
  "node-load": [node: TreeNode, children: TreeNode[]];
  focus: [event: FocusEvent];
  blur: [event: FocusEvent];
}

export interface TreeSelectExpose {
  open(): void;
  close(restoreFocus?: boolean): void;
  toggle(visible?: boolean): void;
  focus(): void;
  blur(): void;
  filter(keyword: string): void;
  selectedLabel(): string | string[];
  getCheckedKeys(leafOnly?: boolean): string[];
  setCheckedKeys(keys: TreeSelectValue[], leafOnly?: boolean): void;
  getCurrentNode(): TreeNode | undefined;
  scrollToNode(key: TreeSelectValue): void;
}

export type TreeSelectElement = HTMLElement & TreeSelectExpose;
export type TreeSelectTreeElement = HTMLElement & TreeExpose;
