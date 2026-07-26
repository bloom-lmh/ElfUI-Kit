// elf-tree - Material Design style tree view
//
// Features:
//   - expand/collapse, selection, checkbox cascade
//   - custom field names
//   - filtering and accordion mode

import {
  defineEmits,
  defineExpose,
  defineProps,
  defineStyle,
  useComputed,
  useHost,
  useRef,
  useEffect,
  defineHtml
} from "@elfui/core";

import styles from "./style.scss?inline";
import { useLocaleProvider } from "../../Providers/context";
import { computeVirtualWindow } from "../virtual-window";
import type { TreeNode, TreeProps } from "./types";

export type { TreeExpose, TreeFieldNames, TreeNode, TreeProps } from "./types";

const SIGNATURE_SEP = "::elf-tree::";

const props = defineProps<TreeProps>({
  data: { type: Array, default: () => [] },
  nodeKey: { type: String, default: "" },
  modelValue: { type: String, default: "" },
  currentNodeKey: { type: String, default: "" },
  defaultSelectedKey: { type: String, default: "" },
  defaultExpandedKeys: { type: Array, default: () => [] },
  defaultCheckedKeys: { type: Array, default: () => [] },
  expandedKeys: { type: Array },
  checkedKeys: { type: Array },
  props: { type: Object, default: () => ({}) },
  showCheckbox: { type: Boolean, default: false },
  checkStrictly: { type: Boolean, default: false },
  highlightCurrent: { type: Boolean, default: true },
  accordion: { type: Boolean, default: false },
  defaultExpandAll: { type: Boolean, default: false },
  expandOnClickNode: { type: Boolean, default: true },
  checkOnClickNode: { type: Boolean, default: false },
  filterable: { type: Boolean, default: false },
  filterPlaceholder: { type: String, default: "" },
  emptyText: { type: String, default: "" },
  indent: { type: Number, default: 20 },
  bordered: { type: Boolean, default: false },
  lazy: { type: Boolean, default: false },
  load: { type: Function, default: undefined },
  filterNodeMethod: { type: Function, default: undefined },
  draggable: { type: Boolean, default: false },
  allowDrag: { type: Function, default: undefined },
  allowDrop: { type: Function, default: undefined },
  virtual: { type: Boolean, default: false },
  height: { type: [String, Number], default: 420 },
  itemSize: { type: Number, default: 40 },
  overscan: { type: Number, default: 6 },
});

const locale = useLocaleProvider();
const host = useHost();

const emit = defineEmits([
  "update:modelValue",
  "update:expandedKeys",
  "update:checkedKeys",
  "node-click",
  "node-expand",
  "node-collapse",
  "check",
  "check-change",
  "node-contextmenu",
  "current-change",
  "node-drag-start",
  "node-drag-end",
  "node-drop",
  "node-load",
]);

const allNodes = useRef<TreeViewNode[]>([]);

const visibleNodes = useRef<TreeViewNode[]>([]);

const expandedState = useRef<string[]>([]);

const checkedState = useRef<string[]>([]);

const selectedKey = useRef("");

const filterText = useRef("");

const scrollTop = useRef(0);

const loadingKeys = useRef<string[]>([]);

const loadedKeys = useRef<string[]>([]);

const draggingKey = useRef("");

const dropTargetKey = useRef("");

const nodeMap = useRef<Record<string, TreeViewNode>>({});

const lastExpandedSig = useRef("");

const lastCheckedSig = useRef("");

const lastSelectedSig = useRef("");

let initialized = false;

const normalizeKeys = (value: unknown): string[] => {
  if (!Array.isArray(value)) return [];
  return value.map((key) => String(key)).filter(Boolean);
};

const signature = (value: string[]): string => value.join(SIGNATURE_SEP);

const fields = (): TreeFieldConfig => {
  const custom = (props.props || {}) as Record<string, string>;
  return {
    key: String(props.nodeKey || custom.key || "key"),
    label: custom.label || "label",
    children: custom.children || "children",
    disabled: custom.disabled || "disabled",
    isLeaf: custom.isLeaf || "isLeaf",
    icon: custom.icon || "icon",
  };
};

const childListOf = (node: Record<string, unknown>, field: string): Record<string, unknown>[] => {
  const children = node[field];
  return Array.isArray(children) ? (children as Record<string, unknown>[]) : [];
};

const keyOf = (value: unknown): string => {
  if (typeof value === "string" || typeof value === "number") return String(value);
  if (value && typeof value === "object") {
    const field = fields();
    return String((value as Record<string, unknown>)[field.key] ?? "");
  }
  return "";
};

const findNode = (key: string): TreeViewNode | undefined => nodeMap.peek()[key];

const isDescendantOf = (node: TreeViewNode, ancestorKey: string): boolean =>
  node.key !== ancestorKey && node.path.includes(ancestorKey);

const childRowsOf = (row: TreeViewNode): TreeViewNode[] => allNodes.peek().filter((node) => node.parentKey === row.key);

const descendantRowsOf = (row: TreeViewNode, includeSelf = false): TreeViewNode[] =>
  allNodes.peek().filter((node) => (includeSelf ? node.key === row.key : false) || isDescendantOf(node, row.key));

const pruneKeys = (keys: string[]): string[] => {
  const map = nodeMap.peek();
  return keys.filter((key) => !!map[key]);
};

const rebuildVisible = (): void => {
  const rows = allNodes.peek();
  const expanded = new Set(expandedState.peek());
  const keyword = filterText.peek().trim().toLowerCase();

  if (!keyword) {
    visibleNodes.set(rows.filter((row) => row.level === 0 || row.path.slice(0, -1).every((key) => expanded.has(key))));
    return;
  }

  const matched = new Set<string>();
  for (const row of rows) {
    const matches = typeof props.filterNodeMethod === "function"
      ? Boolean(props.filterNodeMethod(filterText.peek(), row.raw as TreeNode))
      : row.label.toLowerCase().includes(keyword);
    if (!matches) continue;
    for (const key of row.path) matched.add(key);
  }
  visibleNodes.set(rows.filter((row) => matched.has(row.key)));
};

const syncCascadeParents = (set: Set<string>): void => {
  if (props.checkStrictly) return;
  const rows = [...allNodes.peek()].sort((a, b) => b.level - a.level);
  for (const row of rows) {
    if (!row.hasChildren || row.disabled) continue;
    const children = childRowsOf(row).filter((child) => !child.disabled);
    if (children.length > 0 && children.every((child) => set.has(child.key))) {
      set.add(row.key);
    } else {
      set.delete(row.key);
    }
  }
};

const normalizeCheckedInput = (keys: string[], leafOnly = false): string[] => {
  const set = new Set<string>();
  const existing = pruneKeys(keys);

  for (const key of existing) {
    const row = findNode(key);
    if (!row || row.disabled) continue;
    if (leafOnly && row.hasChildren) continue;

    if (!props.checkStrictly && row.hasChildren && !leafOnly) {
      for (const item of descendantRowsOf(row, true)) {
        if (!item.disabled) set.add(item.key);
      }
    } else {
      set.add(row.key);
    }
  }

  syncCascadeParents(set);
  return Array.from(set);
};

const setExpandedKeys = (keys: string[], shouldEmit = true): void => {
  const next = Array.from(new Set(pruneKeys(keys)));
  expandedState.set(next);
  lastExpandedSig.set(signature(next));
  rebuildVisible();
  if (shouldEmit) emit("update:expandedKeys", next);
};

const commitCheckedKeys = (keys: string[], shouldEmit = true, leafOnly = false): void => {
  const next = normalizeCheckedInput(keys, leafOnly);
  checkedState.set(next);
  lastCheckedSig.set(signature(next));
  if (shouldEmit) emit("update:checkedKeys", next);
};

const setCheckedKeys = (keys: string[], leafOnly = false): void => {
  commitCheckedKeys(keys, true, leafOnly);
};

const setCheckedNodes = (nodes: Record<string, unknown>[], leafOnly = false): void => {
  setCheckedKeys(
    nodes.map((node) => keyOf(node)),
    leafOnly,
  );
};

const setSelectedKey = (key: string, shouldEmit = true): void => {
  selectedKey.set(key);
  lastSelectedSig.set(key);
  if (shouldEmit) emit("update:modelValue", key);
};

const buildNodes = (): void => {
  const field = fields();
  const source = Array.isArray(props.data) ? (props.data as Record<string, unknown>[]) : [];
  const rows: TreeViewNode[] = [];
  const map: Record<string, TreeViewNode> = {};

  const walk = (items: Record<string, unknown>[], level: number, parentKey: string, parentPath: string[]): void => {
    items.forEach((raw, index) => {
      const fallbackKey = [...parentPath, String(index)].join("-");
      const key = String(raw[field.key] ?? fallbackKey);
      const children = childListOf(raw, field.children);
      const row: TreeViewNode = {
        key,
        label: String(raw[field.label] ?? key),
        icon: String(raw[field.icon] ?? ""),
        level,
        disabled: Boolean(raw[field.disabled]),
        isLeaf: Boolean(raw[field.isLeaf]) || (!props.lazy && children.length === 0),
        hasChildren: children.length > 0 || (Boolean(props.lazy) && raw[field.isLeaf] !== true),
        parentKey,
        path: [...parentPath, key],
        raw,
      };
      rows.push(row);
      map[key] = row;
      if (children.length > 0) walk(children, level + 1, key, row.path);
    });
  };

  walk(source, 0, "", []);
  allNodes.set(rows);
  nodeMap.set(map);

  if (!initialized) {
    initialized = true;
    const controlledExpanded = normalizeKeys(props.expandedKeys);
    const controlledChecked = normalizeKeys(props.checkedKeys);
    const initialExpanded = Array.isArray(props.expandedKeys)
      ? controlledExpanded
      : props.defaultExpandAll
        ? rows.filter((row) => row.hasChildren).map((row) => row.key)
        : normalizeKeys(props.defaultExpandedKeys);
    const initialChecked = Array.isArray(props.checkedKeys)
      ? controlledChecked
      : normalizeKeys(props.defaultCheckedKeys);
    setExpandedKeys(initialExpanded, false);
    commitCheckedKeys(initialChecked, false);
    setSelectedKey(String(props.modelValue || props.currentNodeKey || props.defaultSelectedKey || ""), false);
  } else {
    setExpandedKeys(expandedState.peek(), false);
    commitCheckedKeys(checkedState.peek(), false);
    if (selectedKey.peek() && !map[selectedKey.peek()]) setSelectedKey("", false);
  }

  rebuildVisible();
};

useEffect(() => {
  buildNodes();
});

useEffect(() => {
  if (!Array.isArray(props.expandedKeys)) return;
  const next = normalizeKeys(props.expandedKeys);
  const sig = signature(next);
  if (sig === lastExpandedSig.peek()) return;
  setExpandedKeys(next, false);
});

useEffect(() => {
  if (!Array.isArray(props.checkedKeys)) return;
  const next = normalizeKeys(props.checkedKeys);
  const sig = signature(next);
  if (sig === lastCheckedSig.peek()) return;
  commitCheckedKeys(next, false);
});

useEffect(() => {
  const next = String(props.modelValue || props.currentNodeKey || "");
  if (next === lastSelectedSig.peek()) return;
  setSelectedKey(next, false);
});

const itemSize = (): number => Math.max(28, Number(props.itemSize) || 40);
const numericHeight = (): number => Math.max(itemSize(), Number.parseFloat(String(props.height)) || 420);
const virtualWindow = () => computeVirtualWindow({
  count: visibleNodes.value.length,
  itemSize: itemSize(),
  viewportSize: numericHeight(),
  scrollOffset: scrollTop.value,
  overscan: Math.max(0, Number(props.overscan) || 0),
});
const getVisibleNodes = (): TreeViewNode[] => {
  if (!props.virtual) return visibleNodes.value;
  const state = virtualWindow();
  return visibleNodes.value.slice(state.start, state.end);
};
const bodyStyle = (): Record<string, string> => props.virtual
  ? {
      height: `${numericHeight()}px`,
      maxHeight: `${numericHeight()}px`,
    }
  : { maxHeight: `${numericHeight()}px` };
const windowStyle = (): Record<string, string> => {
  if (!props.virtual) return {};
  const state = virtualWindow();
  return {
    paddingTop: `${state.offset}px`,
    paddingBottom: `${Math.max(0, state.totalSize - state.offset - (state.end - state.start) * itemSize())}px`,
  };
};

const isExpanded = (key: string): boolean => expandedState.value.includes(key);

const isSelected = (key: string): boolean => selectedKey.value === key;

const isChecked = (row: TreeViewNode): boolean => checkedState.value.includes(row.key);

const isIndeterminate = (row: TreeViewNode): boolean => {
  if (props.checkStrictly || !row.hasChildren || row.disabled) return false;
  const children = childRowsOf(row).filter((child) => !child.disabled);
  if (children.length === 0) return false;
  const checked = children.some((child) => isChecked(child));
  const partial = children.some((child) => isIndeterminate(child));
  return !isChecked(row) && (checked || partial);
};

const nodeClass = (row: TreeViewNode): Record<string, boolean> => ({
  "is-selected": Boolean(props.highlightCurrent) && isSelected(row.key),
  "is-expanded": isExpanded(row.key),
  "is-disabled": row.disabled,
  "is-leaf": row.isLeaf,
  "has-children": row.hasChildren,
  "is-loading": loadingKeys.value.includes(row.key),
  "is-dragging": draggingKey.value === row.key,
  "is-drop-target": dropTargetKey.value === row.key,
});

const rowStyle = (row: TreeViewNode): Record<string, string> => ({
  paddingLeft: `${row.level * (Number(props.indent) || 20)}px`,
  minHeight: props.virtual ? `${itemSize()}px` : "",
});

const commitExpand = (row: TreeViewNode, open: boolean): void => {
  if (!row.hasChildren) return;
  const current = expandedState.peek();
  let next = current.filter(
    (key) => key !== row.key && !(open === false && findNode(key) && isDescendantOf(findNode(key)!, row.key)),
  );

  if (open) {
    if (props.accordion) {
      const siblings = new Set(
        allNodes
          .peek()
          .filter((node) => node.parentKey === row.parentKey && node.hasChildren)
          .map((node) => node.key),
      );
      next = next.filter((key) => !siblings.has(key));
    }
    next.push(row.key);
  }

  setExpandedKeys(next, true);
  emit(open ? "node-expand" : "node-collapse", row.raw, row.key, next);
};

const loadChildren = async (row: TreeViewNode): Promise<void> => {
  if (!props.lazy || typeof props.load !== "function" || loadedKeys.peek().includes(row.key)) return;
  loadingKeys.set([...loadingKeys.peek(), row.key]);
  let resolved = false;
  const resolve = (children: TreeNode[]): void => {
    if (resolved) return;
    resolved = true;
    const field = fields();
    row.raw[field.children] = Array.isArray(children) ? children : [];
    loadedKeys.set(Array.from(new Set([...loadedKeys.peek(), row.key])));
    loadingKeys.set(loadingKeys.peek().filter((key) => key !== row.key));
    buildNodes();
    const refreshed = findNode(row.key);
    if (refreshed?.hasChildren) commitExpand(refreshed, true);
    emit("node-load", row.raw, children);
  };
  try {
    const result = await props.load(row.raw as TreeNode, resolve);
    if (Array.isArray(result)) resolve(result);
  } finally {
    if (!resolved) loadingKeys.set(loadingKeys.peek().filter((key) => key !== row.key));
  }
};

const toggleExpand = async (row: TreeViewNode): Promise<void> => {
  if (!row.hasChildren) return;
  if (!isExpanded(row.key) && props.lazy && !loadedKeys.peek().includes(row.key) && childRowsOf(row).length === 0) {
    await loadChildren(row);
    return;
  }
  commitExpand(row, !isExpanded(row.key));
};

const expand = (key: string): void => {
  const row = findNode(String(key));
  if (row && row.hasChildren && !isExpanded(row.key)) commitExpand(row, true);
};

const collapse = (key: string): void => {
  const row = findNode(String(key));
  if (row && row.hasChildren && isExpanded(row.key)) commitExpand(row, false);
};

const toggle = (key: string): void => {
  const row = findNode(String(key));
  if (row) toggleExpand(row);
};

const toggleCheck = (row: TreeViewNode): void => {
  if (row.disabled) return;
  const checked = new Set(checkedState.peek());
  const shouldCheck = !checked.has(row.key);

  if (props.checkStrictly) {
    if (shouldCheck) checked.add(row.key);
    else checked.delete(row.key);
  } else {
    const affected = descendantRowsOf(row, true).filter((node) => !node.disabled);
    for (const node of affected) {
      if (shouldCheck) checked.add(node.key);
      else checked.delete(node.key);
    }
    syncCascadeParents(checked);
  }

  const next = Array.from(checked);
  checkedState.set(next);
  lastCheckedSig.set(signature(next));
  emit("update:checkedKeys", next);
  emit("check", row.raw, next);
  emit("check-change", row.raw, shouldCheck, next);
};

const setChecked = (target: unknown, checked: boolean, deep = true): void => {
  const row = findNode(keyOf(target));
  if (!row || row.disabled) return;

  const set = new Set(checkedState.peek());
  const affected = !props.checkStrictly && deep ? descendantRowsOf(row, true).filter((node) => !node.disabled) : [row];

  for (const node of affected) {
    if (checked) set.add(node.key);
    else set.delete(node.key);
  }
  syncCascadeParents(set);

  const next = Array.from(set);
  checkedState.set(next);
  lastCheckedSig.set(signature(next));
  emit("update:checkedKeys", next);
  emit("check", row.raw, next);
  emit("check-change", row.raw, checked, next);
};

const check = (key: string): void => {
  setChecked(key, true, true);
};

const uncheck = (key: string): void => {
  setChecked(key, false, true);
};

const getCheckedKeys = (leafOnly = false): string[] =>
  checkedState.peek().filter((key) => {
    const row = findNode(key);
    return row && (!leafOnly || row.isLeaf);
  });

const getHalfCheckedKeys = (): string[] =>
  allNodes
    .peek()
    .filter((row) => isIndeterminate(row))
    .map((row) => row.key);

const getCheckedNodes = (leafOnly = false, includeHalfChecked = false): Record<string, unknown>[] => {
  const keys = new Set(getCheckedKeys(leafOnly));
  if (includeHalfChecked) {
    for (const key of getHalfCheckedKeys()) {
      const row = findNode(key);
      if (row && (!leafOnly || row.isLeaf)) keys.add(key);
    }
  }
  return Array.from(keys)
    .map((key) => findNode(key)?.raw)
    .filter((node): node is Record<string, unknown> => !!node);
};

const getHalfCheckedNodes = (): Record<string, unknown>[] =>
  getHalfCheckedKeys()
    .map((key) => findNode(key)?.raw)
    .filter((node): node is Record<string, unknown> => !!node);

const getExpandedKeys = (): string[] => [...expandedState.peek()];

const getCurrentKey = (): string => selectedKey.peek();

const getCurrentNode = (): Record<string, unknown> | undefined =>
  selectedKey.peek() ? findNode(selectedKey.peek())?.raw : undefined;

const setCurrentKey = (key: string | number | null = ""): void => {
  const next = key == null ? "" : String(key);
  if (next && !findNode(next)) return;
  setSelectedKey(next, true);
};

const setCurrentNode = (node: Record<string, unknown> | null): void => {
  setCurrentKey(node ? keyOf(node) : null);
};

interface RawLocation {
  list: Record<string, unknown>[];
  index: number;
  node: Record<string, unknown>;
}

const findRawLocation = (target: unknown): RawLocation | undefined => {
  const wanted = keyOf(target);
  const field = fields();
  const visit = (list: Record<string, unknown>[]): RawLocation | undefined => {
    for (let index = 0; index < list.length; index += 1) {
      const node = list[index]!;
      if (keyOf(node) === wanted) return { list, index, node };
      const found = visit(childListOf(node, field.children));
      if (found) return found;
    }
    return undefined;
  };
  return visit((props.data || []) as Record<string, unknown>[]);
};

const appendNode = (data: TreeNode, parent: TreeNode | string | number | null = null): void => {
  const source = props.data as Record<string, unknown>[];
  if (parent == null) source.push(data as Record<string, unknown>);
  else {
    const location = findRawLocation(parent);
    if (!location) return;
    const field = fields();
    if (!Array.isArray(location.node[field.children])) location.node[field.children] = [];
    (location.node[field.children] as Record<string, unknown>[]).push(data as Record<string, unknown>);
  }
  buildNodes();
  if (parent != null) expand(keyOf(parent));
};

const removeNode = (target: TreeNode | string | number): TreeNode | undefined => {
  const location = findRawLocation(target);
  if (!location) return undefined;
  const [removed] = location.list.splice(location.index, 1);
  buildNodes();
  return removed as TreeNode | undefined;
};

const insertRelative = (data: TreeNode, reference: TreeNode | string | number, offset: 0 | 1): void => {
  const location = findRawLocation(reference);
  if (!location) return;
  location.list.splice(location.index + offset, 0, data as Record<string, unknown>);
  buildNodes();
};

const insertBeforeNode = (data: TreeNode, reference: TreeNode | string | number): void => insertRelative(data, reference, 0);
const insertAfterNode = (data: TreeNode, reference: TreeNode | string | number): void => insertRelative(data, reference, 1);

const getNode = (target: unknown): Record<string, unknown> | undefined => {
  const row = findNode(keyOf(target));
  return row?.raw;
};

const select = (key: string): void => {
  const row = findNode(String(key));
  if (!row || row.disabled) return;
  setSelectedKey(row.key, true);
  emit("node-click", row.raw, row.key, row);
  emit("current-change", row.raw, row.key);
};

const onNodeClick = (row: TreeViewNode): void => {
  if (row.disabled) return;
  select(row.key);
  if (props.checkOnClickNode && props.showCheckbox) toggleCheck(row);
  if (props.expandOnClickNode && row.hasChildren) toggleExpand(row);
};

const onNodeKeydown = (row: TreeViewNode, event: KeyboardEvent): void => {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    onNodeClick(row);
    return;
  }
  const rows = visibleNodes.peek();
  const index = rows.findIndex((item) => item.key === row.key);
  const focusRow = (target?: TreeViewNode): void => {
    if (!target) return;
    queueMicrotask(() => host.shadowRoot?.querySelector<HTMLElement>(`.tree-content[data-tree-key="${target.key}"]`)?.focus());
  };
  if (event.key === "ArrowDown" || event.key === "ArrowUp" || event.key === "Home" || event.key === "End") {
    event.preventDefault();
    const nextIndex = event.key === "Home"
      ? 0
      : event.key === "End"
        ? rows.length - 1
        : Math.max(0, Math.min(rows.length - 1, index + (event.key === "ArrowDown" ? 1 : -1)));
    focusRow(rows[nextIndex]);
    return;
  }
  if (event.key === "ArrowRight" && row.hasChildren) {
    event.preventDefault();
    if (!isExpanded(row.key)) void toggleExpand(row);
    else focusRow(rows[index + 1]?.parentKey === row.key ? rows[index + 1] : undefined);
    return;
  }
  if (event.key === "ArrowLeft") {
    event.preventDefault();
    if (row.hasChildren && isExpanded(row.key)) collapse(row.key);
    else focusRow(findNode(row.parentKey));
  }
};

const onNodeContextMenu = (row: TreeViewNode, event: MouseEvent): void => {
  emit("node-contextmenu", event, row.raw, row.key);
};

const canDrag = (row: TreeViewNode): boolean =>
  Boolean(props.draggable) && (typeof props.allowDrag !== "function" || Boolean(props.allowDrag(row.raw as TreeNode)));

const onDragStart = (row: TreeViewNode, event: Event): void => {
  const dragEvent = event as DragEvent;
  if (!canDrag(row)) {
    dragEvent.preventDefault();
    return;
  }
  draggingKey.set(row.key);
  dragEvent.dataTransfer?.setData("text/plain", row.key);
  emit("node-drag-start", row.raw, dragEvent);
};

const onDragOver = (row: TreeViewNode, event: Event): void => {
  const dragging = findNode(draggingKey.peek());
  if (!dragging || dragging.key === row.key || row.path.includes(dragging.key)) return;
  const allowed = typeof props.allowDrop !== "function"
    || Boolean(props.allowDrop(dragging.raw as TreeNode, row.raw as TreeNode, "inner"));
  if (!allowed) return;
  event.preventDefault();
  dropTargetKey.set(row.key);
};

const onDragLeave = (row: TreeViewNode, event: Event): void => {
  const dragEvent = event as DragEvent;
  const currentTarget = dragEvent.currentTarget as HTMLElement;
  if (dragEvent.relatedTarget instanceof Node && currentTarget.contains(dragEvent.relatedTarget)) return;
  if (dropTargetKey.peek() === row.key) dropTargetKey.set("");
};

const onDrop = (row: TreeViewNode, event: Event): void => {
  const dragEvent = event as DragEvent;
  event.preventDefault();
  dropTargetKey.set("");
  const dragging = findNode(draggingKey.peek());
  if (!dragging || dragging.key === row.key || row.path.includes(dragging.key)) return;
  if (typeof props.allowDrop === "function" && !props.allowDrop(dragging.raw as TreeNode, row.raw as TreeNode, "inner")) return;
  const moved = removeNode(dragging.key);
  if (!moved) return;
  appendNode(moved, row.key);
  emit("node-drop", dragging.raw, row.raw, "inner", dragEvent);
  draggingKey.set("");
};

const onDragEnd = (row: TreeViewNode, event: Event): void => {
  draggingKey.set("");
  dropTargetKey.set("");
  emit("node-drag-end", row.raw, event as DragEvent);
};

const onTreeScroll = (event: Event): void => {
  scrollTop.set((event.currentTarget as HTMLElement).scrollTop);
};

const scrollToNode = (target: string | number): void => {
  const index = visibleNodes.peek().findIndex((row) => row.key === String(target));
  if (index < 0) return;
  const body = host.shadowRoot?.querySelector<HTMLElement>(".tree-body");
  if (!body) return;
  body.scrollTop = index * itemSize();
  scrollTop.set(body.scrollTop);
};

const onFilterInput = (event: Event): void => {
  filterText.set((event.target as HTMLInputElement).value);
  rebuildVisible();
};

const filter = (keyword: string): void => {
  filterText.set(keyword);
  rebuildVisible();
};

defineExpose({
  expand,
  collapse,
  toggle,
  select,
  check,
  uncheck,
  setChecked,
  setCheckedKeys,
  setCheckedNodes,
  getCheckedKeys,
  getCheckedNodes,
  getHalfCheckedKeys,
  getHalfCheckedNodes,
  setExpandedKeys,
  getExpandedKeys,
  setCurrentKey,
  setCurrentNode,
  getCurrentKey,
  getCurrentNode,
  getNode,
  filter,
  appendNode,
  removeNode,
  insertBeforeNode,
  insertAfterNode,
  scrollToNode,
});

defineStyle(styles);

const hasVisibleNodes = (): boolean => visibleNodes.value.length > 0;

const rootClass = useComputed(() => (props.bordered ? "tree is-bordered" : "tree"));

const Tree = defineHtml(`
  <div :class=${rootClass} role="tree" :aria-multiselectable=${props.showCheckbox ? "true" : "false"}>
    <div class="tree-filter" v-if=${props.filterable}>
      <input
        type="search"
        :value=${filterText}
        :placeholder=${props.filterPlaceholder || locale.t("tree.search")}
        @input="onFilterInput($event)"
      />
    </div>

    <div class="tree-body" :style=${bodyStyle()} @scroll=${onTreeScroll}>
      <div v-if=${!hasVisibleNodes()} class="tree-empty">${props.emptyText || locale.t("table.empty")}</div>

      <div class="tree-window" :style=${windowStyle()}>

      <div
        v-for="row in getVisibleNodes()"
        :key="row.key"
        class="tree-node"
        :class="nodeClass(row)"
        :style="rowStyle(row)"
        role="treeitem"
        :aria-level="row.level + 1"
        :aria-expanded="row.hasChildren ? (isExpanded(row.key) ? 'true' : 'false') : null"
        :aria-selected="isSelected(row.key) ? 'true' : 'false'"
        :draggable="canDrag(row)"
        @dragstart="onDragStart(row, $event)"
        @dragover="onDragOver(row, $event)"
        @dragleave="onDragLeave(row, $event)"
        @drop="onDrop(row, $event)"
        @dragend="onDragEnd(row, $event)"
        @contextmenu="onNodeContextMenu(row, $event)"
      >
        <button
          class="tree-switch"
          :class="{ 'is-expanded': isExpanded(row.key) }"
          type="button"
          :disabled="!row.hasChildren"
          :title='locale.t(isExpanded(row.key) ? "common.collapse" : "common.expand")'
          @click.stop="toggleExpand(row)"
        >
          <span v-if="row.hasChildren" :class='["switch-icon", { "is-loading": loadingKeys.includes(row.key) }]'></span>
        </button>

        <button
          v-if=${props.showCheckbox}
          class="tree-checkbox"
          type="button"
          :class="{ 'is-checked': isChecked(row), 'is-indeterminate': isIndeterminate(row) }"
          :disabled="row.disabled"
          :aria-checked="isIndeterminate(row) ? 'mixed' : isChecked(row) ? 'true' : 'false'"
          @click.stop="toggleCheck(row)"
        >
          <span class="checkbox-mark"></span>
        </button>

        <div
          class="tree-content"
          tabindex="0"
          :data-tree-key="row.key"
          @click="onNodeClick(row)"
          @keydown="onNodeKeydown(row, $event)"
        >
          <span v-if="row.icon" class="tree-icon">{{ row.icon }}</span>
          <span class="tree-label">{{ row.label }}</span>
        </div>
      </div>
      </div>
    </div>
  </div>
`);

interface TreeViewNode {
  key: string;
  label: string;
  icon: string;
  level: number;
  disabled: boolean;
  isLeaf: boolean;
  hasChildren: boolean;
  parentKey: string;
  path: string[];
  raw: Record<string, unknown>;
}

type TreeFieldConfig = {
  key: string;
  label: string;
  children: string;
  disabled: string;
  isLeaf: string;
  icon: string;
};

export { Tree };
