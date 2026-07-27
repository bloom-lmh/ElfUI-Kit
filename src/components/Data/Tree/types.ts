export interface TreeNode {
  key?: string | number;
  label?: string;
  disabled?: boolean;
  children?: TreeNode[];
  isLeaf?: boolean;
  icon?: string;
  [key: string]: unknown;
}

export type TreeKey = string | number;
export type TreeDropType = "before" | "after" | "inner";
export type TreeRenderValue = string | number | boolean | Node | null | undefined;

export interface TreeRenderContext {
  key: string;
  level: number;
  expanded: boolean;
  checked: boolean;
  selected: boolean;
  disabled: boolean;
}

export type TreeRenderContent = (
  node: TreeNode,
  context: TreeRenderContext
) => TreeRenderValue;

export interface TreeFieldNames {
  key?: string;
  label?: string;
  children?: string;
  disabled?: string;
  isLeaf?: string;
  icon?: string;
  class?: string;
}

export interface TreeProps {
  data: TreeNode[];
  nodeKey: string;
  modelValue: string;
  currentNodeKey: string;
  defaultSelectedKey: string;
  defaultExpandedKeys: string[];
  defaultCheckedKeys: string[];
  expandedKeys?: string[];
  checkedKeys?: string[];
  props: TreeFieldNames;
  showCheckbox: boolean;
  checkStrictly: boolean;
  highlightCurrent: boolean;
  accordion: boolean;
  defaultExpandAll: boolean;
  autoExpandParent: boolean;
  expandOnClickNode: boolean;
  checkOnClickNode: boolean;
  checkOnClickLeaf: boolean;
  filterable: boolean;
  filterPlaceholder: string;
  emptyText: string;
  indent: number;
  bordered: boolean;
  lazy: boolean;
  load?: (node: TreeNode, resolve: (children: TreeNode[]) => void) => void | TreeNode[] | Promise<TreeNode[]>;
  filterNodeMethod?: (keyword: string, node: TreeNode) => boolean;
  filterMethod?: (keyword: string, node: TreeNode) => boolean;
  renderContent?: TreeRenderContent;
  icon: string;
  draggable: boolean;
  allowDrag?: (node: TreeNode) => boolean;
  allowDrop?: (dragging: TreeNode, drop: TreeNode, type: TreeDropType) => boolean;
  virtual: boolean;
  height: string | number;
  itemSize: number;
  overscan: number;
  scrollbarAlwaysOn: boolean;
  ariaLabel: string;
}

export interface TreeExpose {
  expand(key: TreeKey): void;
  collapse(key: TreeKey): void;
  toggle(key: TreeKey): void;
  select(key: TreeKey): void;
  check(key: TreeKey): void;
  uncheck(key: TreeKey): void;
  setChecked(target: TreeNode | TreeKey, checked: boolean, deep?: boolean): void;
  setCheckedKeys(keys: TreeKey[], leafOnly?: boolean): void;
  setCheckedNodes(nodes: TreeNode[], leafOnly?: boolean): void;
  getCheckedKeys(leafOnly?: boolean): string[];
  getCheckedNodes(leafOnly?: boolean, includeHalfChecked?: boolean): TreeNode[];
  getHalfCheckedKeys(): string[];
  getHalfCheckedNodes(): TreeNode[];
  setExpandedKeys(keys: TreeKey[]): void;
  getExpandedKeys(): string[];
  setCurrentKey(key?: TreeKey | null): void;
  setCurrentNode(node: TreeNode | null): void;
  getCurrentKey(): string;
  getCurrentNode(): TreeNode | undefined;
  getNode(target: TreeNode | TreeKey): TreeNode | undefined;
  filter(keyword: string): void;
  updateKeyChildren(key: TreeKey, children: TreeNode[]): void;
  appendNode(data: TreeNode, parent?: TreeNode | TreeKey | null): void;
  removeNode(target: TreeNode | TreeKey): TreeNode | undefined;
  insertBeforeNode(data: TreeNode, reference: TreeNode | TreeKey): void;
  insertAfterNode(data: TreeNode, reference: TreeNode | TreeKey): void;
  expandNode(target: TreeNode | TreeKey): void;
  collapseNode(target: TreeNode | TreeKey): void;
  setData(data: TreeNode[]): void;
  scrollTreeTo(options: number | ScrollToOptions): void;
  scrollToNode(key: TreeKey): void;
}
