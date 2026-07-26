export interface TreeNode {
  key?: string | number;
  label?: string;
  disabled?: boolean;
  children?: TreeNode[];
  isLeaf?: boolean;
  icon?: string;
  [key: string]: unknown;
}

export interface TreeFieldNames {
  key?: string;
  label?: string;
  children?: string;
  disabled?: string;
  isLeaf?: string;
  icon?: string;
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
  expandOnClickNode: boolean;
  checkOnClickNode: boolean;
  filterable: boolean;
  filterPlaceholder: string;
  emptyText: string;
  indent: number;
  bordered: boolean;
  lazy: boolean;
  load?: (node: TreeNode, resolve: (children: TreeNode[]) => void) => void | TreeNode[] | Promise<TreeNode[]>;
  filterNodeMethod?: (keyword: string, node: TreeNode) => boolean;
  draggable: boolean;
  allowDrag?: (node: TreeNode) => boolean;
  allowDrop?: (dragging: TreeNode, drop: TreeNode, type: "inner") => boolean;
  virtual: boolean;
  height: string | number;
  itemSize: number;
  overscan: number;
}

export interface TreeExpose {
  appendNode: (data: TreeNode, parent?: TreeNode | string | number | null) => void;
  removeNode: (target: TreeNode | string | number) => TreeNode | undefined;
  insertBeforeNode: (data: TreeNode, reference: TreeNode | string | number) => void;
  insertAfterNode: (data: TreeNode, reference: TreeNode | string | number) => void;
  filter: (keyword: string) => void;
  scrollToNode: (key: string | number) => void;
}
