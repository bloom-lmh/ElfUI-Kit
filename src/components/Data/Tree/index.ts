// elf-tree - Material Design style tree view
//
// Features:
//   - expand/collapse, selection, checkbox cascade
//   - custom field names
//   - filtering and accordion mode

import {
  defineDirective,
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
import {
  draggableDirective,
  type DraggableOptions
} from "../../../directives/draggable";
import { computeVirtualWindow } from "../virtual-window";
import { listContentDirective } from "../list-content";
import {
  buildTreeCollection,
  resolveTreeFields,
  treeChildrenOf,
  treeKeyOf,
  type TreeCollection,
  type TreeFieldConfig,
  type TreeViewNode
} from "./tree-collection";
import type {
  TreeDropType,
  TreeKey,
  TreeNode,
  TreeProps,
  TreeRenderContext,
  TreeRenderValue
} from "./types";

export type { TreeExpose, TreeFieldNames, TreeNode, TreeProps } from "./types";

const SIGNATURE_SEP = "::elf-tree::";
let treeDragSequence = 0;

const draggable = defineDirective(draggableDirective);
const treeContent = defineDirective(listContentDirective);

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
  autoExpandParent: { type: Boolean, default: true },
  expandOnClickNode: { type: Boolean, default: true },
  checkOnClickNode: { type: Boolean, default: false },
  checkOnClickLeaf: { type: Boolean, default: true },
  filterable: { type: Boolean, default: false },
  filterPlaceholder: { type: String, default: "" },
  emptyText: { type: String, default: "" },
  indent: { type: Number, default: 20 },
  bordered: { type: Boolean, default: false },
  lazy: { type: Boolean, default: false },
  load: { type: Function, default: undefined },
  filterNodeMethod: { type: Function, default: undefined },
  filterMethod: { type: Function, default: undefined },
  renderContent: { type: Function, default: undefined },
  icon: { type: String, default: "" },
  draggable: { type: Boolean, default: false },
  allowDrag: { type: Function, default: undefined },
  allowDrop: { type: Function, default: undefined },
  virtual: { type: Boolean, default: false },
  height: { type: [String, Number], default: 420 },
  itemSize: { type: Number, default: 40 },
  overscan: { type: Number, default: 6 },
  scrollbarAlwaysOn: { type: Boolean, default: false },
  ariaLabel: { type: String, default: "" },
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
  "node-drag-enter",
  "node-drag-leave",
  "node-drag-over",
  "node-drag-end",
  "node-drop",
  "node-load",
]);

const collection = useRef<TreeCollection>(
  buildTreeCollection([], resolveTreeFields("", {}), false)
);

const visibleNodes = useRef<TreeViewNode[]>([]);

const expandedState = useRef<string[]>([]);

const checkedState = useRef<string[]>([]);

const selectedKey = useRef("");

const focusedKey = useRef("");

const filterText = useRef("");

const scrollTop = useRef(0);

const loadingKeys = useRef<string[]>([]);

const loadedKeys = useRef<string[]>([]);

const draggingKey = useRef("");

const dropTargetKey = useRef("");
const dropPlacement = useRef<TreeDropType>("inner");
const keyboardDragging = useRef(false);

const lastExpandedSig = useRef("");

const lastCheckedSig = useRef("");

const lastSelectedSig = useRef("");

let initialized = false;
const dragGroup = `elf-tree-${++treeDragSequence}`;

const normalizeKeys = (value: unknown): string[] => {
  if (!Array.isArray(value)) return [];
  return value.map((key) => String(key)).filter(Boolean);
};

const signature = (value: string[]): string => value.join(SIGNATURE_SEP);

const fields = (): TreeFieldConfig => {
  return resolveTreeFields(props.nodeKey, props.props);
};

const keyOf = (value: unknown): string => treeKeyOf(value, fields());

const isDescendantOf = (node: TreeViewNode, ancestorKey: string): boolean =>
  collection.peek().isDescendant(node, ancestorKey);

const findNode = (key: string): TreeViewNode | undefined => collection.peek().find(key);

const childRowsOf = (row: TreeViewNode): readonly TreeViewNode[] =>
  collection.peek().childrenOf(row);

const descendantRowsOf = (row: TreeViewNode, includeSelf = false): TreeViewNode[] =>
  collection.peek().descendantsOf(row, includeSelf);

const resolvedFilterMethod = (): TreeProps["filterNodeMethod"] =>
  props.filterNodeMethod || props.filterMethod;

const rebuildVisible = (): void => {
  visibleNodes.set(collection.peek().visible(
    expandedState.peek(),
    filterText.peek(),
    resolvedFilterMethod()
  ));
};

const setExpandedKeys = (keys: TreeKey[], shouldEmit = true): void => {
  const next = collection.peek().normalizeExpanded(
    normalizeKeys(keys),
    props.autoExpandParent
  );
  expandedState.set(next);
  lastExpandedSig.set(signature(next));
  rebuildVisible();
  if (shouldEmit) emit("update:expandedKeys", next);
};

const commitCheckedKeys = (keys: string[], shouldEmit = true, leafOnly = false): void => {
  const next = collection.peek().normalizeChecked(keys, props.checkStrictly, leafOnly);
  checkedState.set(next);
  lastCheckedSig.set(signature(next));
  if (shouldEmit) emit("update:checkedKeys", next);
};

const setCheckedKeys = (keys: TreeKey[], leafOnly = false): void => {
  commitCheckedKeys(normalizeKeys(keys), true, leafOnly);
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
  const nextCollection = buildTreeCollection(
    Array.isArray(props.data) ? props.data : [],
    field,
    props.lazy
  );
  const rows = [...nextCollection.rows];
  collection.set(nextCollection);

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
    if (selectedKey.peek() && !nextCollection.find(selectedKey.peek())) setSelectedKey("", false);
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

const tabIndexFor = (row: TreeViewNode): number => {
  const preferredKey = focusedKey.value || selectedKey.value || visibleNodes.value[0]?.key || "";
  return row.key === preferredKey ? 0 : -1;
};

const renderNode = (row: TreeViewNode): TreeRenderValue => {
  if (typeof props.renderContent !== "function") return row.label;
  const context: TreeRenderContext = {
    key: row.key,
    level: row.level,
    expanded: isExpanded(row.key),
    checked: isChecked(row),
    selected: isSelected(row.key),
    disabled: row.disabled,
  };
  return props.renderContent(row.raw as TreeNode, context);
};

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
        collection
          .peek()
          .rows
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

const expand = (key: TreeKey): void => {
  const row = findNode(String(key));
  if (row && row.hasChildren && !isExpanded(row.key)) commitExpand(row, true);
};

const collapse = (key: TreeKey): void => {
  const row = findNode(String(key));
  if (row && row.hasChildren && isExpanded(row.key)) commitExpand(row, false);
};

const toggle = (key: TreeKey): void => {
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
  }

  const next = collection.peek().cascadeChecked([...checked], props.checkStrictly);
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
  const next = collection.peek().cascadeChecked([...set], props.checkStrictly);
  checkedState.set(next);
  lastCheckedSig.set(signature(next));
  emit("update:checkedKeys", next);
  emit("check", row.raw, next);
  emit("check-change", row.raw, checked, next);
};

const check = (key: TreeKey): void => {
  setChecked(key, true, true);
};

const uncheck = (key: TreeKey): void => {
  setChecked(key, false, true);
};

const getCheckedKeys = (leafOnly = false): string[] =>
  checkedState.peek().filter((key) => {
    const row = findNode(key);
    return row && (!leafOnly || row.isLeaf);
  });

const getHalfCheckedKeys = (): string[] =>
  collection
    .peek()
    .rows
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
      const found = visit(treeChildrenOf(node, field.children));
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

const updateKeyChildren = (key: TreeKey, children: TreeNode[]): void => {
  const location = findRawLocation(key);
  if (!location) return;
  location.node[fields().children] = Array.isArray(children) ? children : [];
  loadedKeys.set(Array.from(new Set([...loadedKeys.peek(), String(key)])));
  buildNodes();
};

const setData = (data: TreeNode[]): void => {
  const source = props.data as TreeNode[];
  source.splice(0, source.length, ...(Array.isArray(data) ? data : []));
  initialized = false;
  buildNodes();
};

const getNode = (target: unknown): Record<string, unknown> | undefined => {
  const row = findNode(keyOf(target));
  return row?.raw;
};

const select = (key: TreeKey): void => {
  const row = findNode(String(key));
  if (!row || row.disabled) return;
  setSelectedKey(row.key, true);
  emit("node-click", row.raw, row.key, row);
  emit("current-change", row.raw, row.key);
};

const onNodeClick = (row: TreeViewNode): void => {
  if (row.disabled) return;
  select(row.key);
  const shouldCheck = props.showCheckbox
    && (props.checkOnClickNode || (props.checkOnClickLeaf && row.isLeaf));
  if (shouldCheck) toggleCheck(row);
  if (props.expandOnClickNode && row.hasChildren) toggleExpand(row);
};

const onNodeFocus = (row: TreeViewNode): void => {
  focusedKey.set(row.key);
};

const onNodeKeydown = (row: TreeViewNode, event: KeyboardEvent): void => {
  if (props.draggable && canDrag(row) && event.key === " " && !keyboardDragging.peek()) {
    event.preventDefault();
    draggingKey.set(row.key);
    dropTargetKey.set(row.key);
    dropPlacement.set("inner");
    keyboardDragging.set(true);
    emit("node-drag-start", row.raw, event);
    return;
  }
  if (keyboardDragging.peek()) {
    if (event.key === "Escape") {
      event.preventDefault();
      const dragging = findNode(draggingKey.peek());
      clearDragState();
      if (dragging) emit("node-drag-end", dragging.raw, event);
      return;
    }
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      const target = findNode(dropTargetKey.peek());
      if (target) performDrop(target, dropPlacement.peek(), event);
      return;
    }
    if (["ArrowUp", "ArrowDown", "ArrowRight"].includes(event.key)) {
      event.preventDefault();
      const rows = visibleNodes.peek();
      const currentIndex = Math.max(0, rows.findIndex((item) => item.key === dropTargetKey.peek()));
      const direction = event.key === "ArrowUp" ? -1 : event.key === "ArrowDown" ? 1 : 0;
      const target = direction
        ? rows[Math.max(0, Math.min(rows.length - 1, currentIndex + direction))]
        : rows[currentIndex];
      const dragging = findNode(draggingKey.peek());
      const placement: TreeDropType = event.key === "ArrowRight" ? "inner" : direction < 0 ? "before" : "after";
      if (target && dragging && canDropOnRow(dragging, target, placement)) {
        dropTargetKey.set(target.key);
        dropPlacement.set(placement);
        queueMicrotask(() => host.shadowRoot
          ?.querySelector<HTMLElement>(`.tree-content[data-tree-key="${target.key}"]`)
          ?.focus());
      }
      return;
    }
  }
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

const canDropOnRow = (dragging: TreeViewNode, row: TreeViewNode, placement: TreeDropType = "inner"): boolean =>
  dragging.key !== row.key
  && !row.path.includes(dragging.key)
  && (
    typeof props.allowDrop !== "function"
    || Boolean(props.allowDrop(dragging.raw as TreeNode, row.raw as TreeNode, placement))
  );

const placementFromPointer = (event: DragEvent): TreeDropType => {
  const target = event.currentTarget as HTMLElement;
  const rect = target.getBoundingClientRect();
  const ratio = rect.height > 0 ? (event.clientY - rect.top) / rect.height : 0.5;
  return ratio < 0.25 ? "before" : ratio > 0.75 ? "after" : "inner";
};

const clearDragState = (): void => {
  draggingKey.set("");
  dropTargetKey.set("");
  dropPlacement.set("inner");
  keyboardDragging.set(false);
};

const performDrop = (row: TreeViewNode, placement: TreeDropType, event: Event): void => {
  const dragging = findNode(draggingKey.peek());
  if (!dragging || !canDropOnRow(dragging, row, placement)) return;
  const moved = removeNode(dragging.key);
  if (!moved) return;
  if (placement === "before") insertBeforeNode(moved, row.key);
  else if (placement === "after") insertAfterNode(moved, row.key);
  else appendNode(moved, row.key);
  emit("node-drop", dragging.raw, row.raw, placement, event);
  clearDragState();
};

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

const onDragEnter = (row: TreeViewNode, event: Event): void => {
  const dragging = findNode(draggingKey.peek());
  const placement = placementFromPointer(event as DragEvent);
  if (!dragging || !canDropOnRow(dragging, row, placement)) return;
  event.preventDefault();
  dropTargetKey.set(row.key);
  dropPlacement.set(placement);
  emit("node-drag-enter", dragging.raw, row.raw, event as DragEvent);
};

const onDragOver = (row: TreeViewNode, event: Event): void => {
  const dragging = findNode(draggingKey.peek());
  const placement = placementFromPointer(event as DragEvent);
  if (!dragging || !canDropOnRow(dragging, row, placement)) return;
  event.preventDefault();
  dropTargetKey.set(row.key);
  dropPlacement.set(placement);
  emit("node-drag-over", dragging.raw, row.raw, event as DragEvent);
};

const onDragLeave = (row: TreeViewNode, event: Event): void => {
  const dragEvent = event as DragEvent;
  const currentTarget = dragEvent.currentTarget as HTMLElement;
  if (dragEvent.relatedTarget instanceof Node && currentTarget.contains(dragEvent.relatedTarget)) return;
  if (dropTargetKey.peek() === row.key) dropTargetKey.set("");
  const dragging = findNode(draggingKey.peek());
  if (dragging) emit("node-drag-leave", dragging.raw, row.raw, dragEvent);
};

const onDrop = (row: TreeViewNode, event: Event): void => {
  const dragEvent = event as DragEvent;
  event.preventDefault();
  performDrop(row, dropPlacement.peek(), dragEvent);
};

const onDragEnd = (row: TreeViewNode, event: Event): void => {
  clearDragState();
  emit("node-drag-end", row.raw, event as DragEvent);
};

const treeDragOptions = (row: TreeViewNode): DraggableOptions<TreeViewNode> => ({
  key: row.key,
  data: row,
  group: dragGroup,
  draggable: canDrag(row),
  droppable: Boolean(props.draggable),
  mode: "sort",
  canDrop: ({ source, placement }) => canDropOnRow(source.data, row, placement === "inside" ? "inner" : placement)
});

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

const scrollTreeTo = (options: number | ScrollToOptions): void => {
  const body = host.shadowRoot?.querySelector<HTMLElement>(".tree-body");
  if (!body) return;
  if (typeof options === "number") body.scrollTop = Math.max(0, options);
  else {
    if (typeof options.top === "number") body.scrollTop = Math.max(0, options.top);
    if (typeof options.left === "number") body.scrollLeft = Math.max(0, options.left);
  }
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

const expandNode = (target: TreeNode | TreeKey): void => expand(keyOf(target));
const collapseNode = (target: TreeNode | TreeKey): void => collapse(keyOf(target));

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
  updateKeyChildren,
  appendNode,
  removeNode,
  insertBeforeNode,
  insertAfterNode,
  expandNode,
  collapseNode,
  setData,
  scrollTreeTo,
  scrollToNode,
});

defineStyle(styles);

const hasVisibleNodes = (): boolean => visibleNodes.value.length > 0;

const rootClass = useComputed(() => ({
  tree: true,
  "is-bordered": props.bordered,
  "is-scrollbar-always-on": props.scrollbarAlwaysOn,
}));

const Tree = defineHtml(`
  <div
    :class=${rootClass}
    role="tree"
    :aria-label=${props.ariaLabel || undefined}
    :aria-multiselectable=${props.showCheckbox ? "true" : "false"}
  >
    <div class="tree-filter" v-if=${props.filterable}>
      <input
        type="search"
        :value=${filterText}
        :placeholder=${props.filterPlaceholder || locale.t("tree.search")}
        :aria-label=${props.filterPlaceholder || locale.t("tree.search")}
        @input="onFilterInput($event)"
      />
    </div>

    <div class="tree-body" :style=${bodyStyle()} @scroll=${onTreeScroll}>
      <div v-if=${!hasVisibleNodes()} class="tree-empty" role="status">
        <slot name="empty">${props.emptyText || locale.t("table.empty")}</slot>
      </div>

      <div class="tree-window" :style=${windowStyle()}>

      <div
        v-for="row in getVisibleNodes()"
        :key="row.key"
        class="tree-node"
        :class="[nodeClass(row), row.className]"
        :style="rowStyle(row)"
        role="treeitem"
        :aria-level="row.level + 1"
        :aria-expanded="row.hasChildren ? (isExpanded(row.key) ? 'true' : 'false') : null"
        :aria-selected="isSelected(row.key) ? 'true' : 'false'"
        :aria-disabled="row.disabled ? 'true' : 'false'"
        :aria-grabbed="draggingKey === row.key ? 'true' : 'false'"
        :data-drop-placement="dropTargetKey === row.key ? dropPlacement : null"
        :aria-checked="props.showCheckbox ? (isIndeterminate(row) ? 'mixed' : isChecked(row) ? 'true' : 'false') : null"
        v-draggable="treeDragOptions(row)"
        @dragstart="onDragStart(row, $event)"
        @dragenter="onDragEnter(row, $event)"
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
          <span
            v-if="row.hasChildren"
            :class='["switch-icon", { "is-custom": props.icon, "is-loading": loadingKeys.includes(row.key) }]'
          >${props.icon}</span>
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
          :tabindex="tabIndexFor(row)"
          :data-tree-key="row.key"
          @focus="onNodeFocus(row)"
          @click="onNodeClick(row)"
          @keydown="onNodeKeydown(row, $event)"
        >
          <span v-if="row.icon" class="tree-icon">{{ row.icon }}</span>
          <span class="tree-label" v-tree-content="renderNode(row)"></span>
        </div>
      </div>
      </div>
    </div>
  </div>
`);

export { Tree };
