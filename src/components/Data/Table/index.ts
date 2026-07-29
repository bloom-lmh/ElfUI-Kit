// elf-table - data table with selection, sorting and pagination-friendly events

import {
  defineEmits,
  defineDirective,
  defineExpose,
  defineProps,
  defineStyle,
  onMounted,
  onUnmounted,
  useHost,
  useRef,
  useShallowRef,
  useTemplateRef,
  useEffect,
  defineHtml,
} from "@elfui/core";
import type { DirectiveBinding } from "@elfui/core";

import styles from "./style.scss?inline";
import { computeAnchoredPosition } from "../../Common/overlay/anchored-overlay";
import { useLocaleProvider } from "../../Providers/context";
import { useDismissibleOverlay } from "../../../composables/useDismissibleOverlay";
import { buildTableTree, normalizeTableTreeProps } from "./tree";
import {
  buildVirtualOffsets,
  computeVariableVirtualWindow,
  computeVirtualWindow,
  type VirtualWindow,
} from "../virtual-window";
import type {
  TableCellContext,
  TableColumn,
  TableDefaultSort,
  TableFilterOption,
  TableHeaderCellContext,
  TableProps,
  TableRow,
  TableScrollDetail,
  TableSpanResult,
  TableStyle,
  TableTreeNodeContext,
  TableRenderValue,
  TableTooltipOptions,
  TableTooltipPlacement,
} from "./types";
import { getTableColumnSize, normalizeTableColumns } from "./column-model";
import {
  activeTableFilterColumns,
  getTableValueAtPath as valueAtPath,
  normalizeTableFilterOptions as filterOptionsOf,
  normalizeTableFilterValues,
  normalizeTableSortOrders as sortOrdersOf,
  sortTableRows,
  tableFilterKey as filterKeyOf,
  tableFilterSignature as filterSignature,
  tableFilterValueEquals as filterValueEquals,
  tableFilterValueKey as filterValueKey,
  tableRowMatchesFilters,
} from "./sort-filter";

export type {
  TableAlign,
  TableCellContext,
  TableColumn,
  TableColumnType,
  TableDefaultSort,
  TableExpose,
  TableFilterMethod,
  TableFilterIconContext,
  TableFilterOption,
  TableHeaderCellContext,
  TableLayout,
  TableLoad,
  TableProps,
  TableRenderValue,
  TableRow,
  TableRowContext,
  TableRowHeight,
  TableRowKey,
  TableScrollDetail,
  TableSize,
  TableSortBy,
  TableSortMethod,
  TableSummaryContext,
  TableSummaryMethod,
  TableTreeNodeContext,
  TableTreeProps,
  TableTooltipOptions,
  TableTooltipPlacement,
  TableTitleVariant,
  TableSpanMethod,
  TableSpanResult,
  TableSortOrder,
} from "./types";

const TABLE_CELL_KEY_SEPARATOR = "::elf-table::";
const TABLE_KEY_SEPARATOR = "::elf-table::";
const TOOLTIP_PLACEMENTS: TableTooltipPlacement[] = [
  "top",
  "top-start",
  "top-end",
  "bottom",
  "bottom-start",
  "bottom-end",
];
let tableTooltipSeed = 0;

const mountTableContent = (element: HTMLElement, value: TableRenderValue): void => {
  element.replaceChildren();
  const values = Array.isArray(value) ? value : [value];

  for (const item of values) {
    if (item == null) continue;
    if (typeof item === "object" && "nodeType" in item) element.appendChild(item);
    else element.appendChild(element.ownerDocument.createTextNode(String(item)));
  }
};

const elfTableContent = defineDirective((element: HTMLElement, binding: DirectiveBinding<TableRenderValue>) => {
  mountTableContent(element, binding.value);
});

const props = defineProps<TableProps>({
  title: { type: String, default: "" },
  titleVariant: { type: String, default: "default" },
  data: { type: Array, default: () => [] },
  columns: { type: Array, default: () => [] },
  rowKey: { type: [String, Function], default: "id" },
  stripe: { type: Boolean, default: false },
  border: { type: Boolean, default: false },
  hover: { type: Boolean, default: true },
  size: { type: String, default: "default" },
  height: { type: [String, Number], default: "" },
  maxHeight: { type: [String, Number], default: "" },
  virtual: { type: Boolean, default: false },
  virtualThreshold: { type: Number, default: 100 },
  rowHeight: { type: [Number, Function], default: 48 },
  overscan: { type: Number, default: 5 },
  fit: { type: Boolean, default: true },
  tableLayout: { type: String, default: "fixed" },
  scrollbarAlwaysOn: { type: Boolean, default: false },
  emptyText: { type: String, default: "" },
  loading: { type: Boolean, default: false },
  showHeader: { type: Boolean, default: true },
  stickyHeader: { type: Boolean, default: true },
  highlightCurrentRow: { type: Boolean, default: false },
  currentRowKey: { type: [String, Number], default: "" },
  rowClassName: { type: [String, Function] },
  rowStyle: { type: [Object, Function] },
  cellClassName: { type: [String, Function] },
  cellStyle: { type: [Object, Function] },
  headerRowClassName: { type: [String, Function] },
  headerRowStyle: { type: [Object, Function] },
  headerCellClassName: { type: [String, Function] },
  headerCellStyle: { type: [Object, Function] },
  selectedKeys: { type: Array },
  defaultSelectedKeys: { type: Array, default: () => [] },
  selectOnIndeterminate: { type: Boolean, default: true },
  expandedRowKeys: { type: Array },
  defaultExpandedRowKeys: { type: Array, default: () => [] },
  defaultExpandAll: { type: Boolean, default: false },
  treeProps: {
    type: Object,
    default: () => ({ children: "children", hasChildren: "hasChildren", checkStrictly: false }),
  },
  indent: { type: Number, default: 16 },
  lazy: { type: Boolean, default: false },
  load: { type: Function },
  expandFormatter: { type: Function },
  sortProp: { type: String, default: "" },
  sortOrder: { type: String, default: "" },
  defaultSort: { type: Object },
  showOverflowTooltip: { type: Boolean, default: false },
  tooltipOptions: {
    type: Object,
    default: () => ({ placement: "top", offset: 8, showAfter: 300, hideAfter: 80, maxWidth: 320 }),
  },
  showSummary: { type: Boolean, default: false },
  sumText: { type: String, default: "" },
  summaryMethod: { type: Function },
  spanMethod: { type: Function },
});

const emit = defineEmits([
  "update:selectedKeys",
  "update:expandedRowKeys",
  "select",
  "select-all",
  "selection-change",
  "current-change",
  "cell-mouse-enter",
  "cell-mouse-leave",
  "cell-click",
  "cell-dblclick",
  "cell-contextmenu",
  "row-click",
  "row-contextmenu",
  "row-dblclick",
  "header-click",
  "header-contextmenu",
  "expand-change",
  "action-click",
  "sort-change",
  "filter-change",
  "header-dragend",
  "scroll",
]);

// Template references
const host = useHost();
const locale = useLocaleProvider();
const wrapRef = useTemplateRef<HTMLElement>("wrap");
const tooltipId = `elf-table-tooltip-${++tableTooltipSeed}`;

// Large table collections are replaced as immutable snapshots. Deep proxying
// every row/cell/key adds avoidable work to selection, pagination and virtual
// scrolling without providing any in-place mutation semantics.
const columnsState = useShallowRef<TableColumnView[]>([]);

const rowsState = useShallowRef<TableRowView[]>([]);

const virtualScrollTop = useRef(0);
let scrollEventQueued = false;
let pendingScrollDetail: TableScrollDetail | null = null;
let cachedVirtualKey = "";
let cachedVirtualWindow: VirtualWindow = { start: 0, end: 0, offset: 0, totalSize: 0 };
let cachedRowHeightSource: TableRowView[] | null = null;
let cachedRowHeightResolver: TableProps["rowHeight"] | null = null;
let cachedRowOffsets: number[] = [];
let cachedRenderSource: TableRowView[] | null = null;
let cachedRenderStart = -1;
let cachedRenderEnd = -1;
let cachedRenderRows: TableRowView[] = [];
let fastVirtualRangeKey = "";

const allRowsState = useShallowRef<TableRowView[]>([]);

const isTreeState = useRef(false);

let rowCollection: TableRowCollectionView | undefined;

const selectedState = useShallowRef<string[]>([]);
let pendingSelectedKeys: string[] | null = null;
let selectionCommitFrame = 0;
let selectionCommitTimer = 0;

const selectedKeysSnapshot = (track = false): string[] =>
  pendingSelectedKeys ?? (track ? selectedState.value : selectedState.peek());

const expandedState = useShallowRef<string[]>([]);

const lazyChildrenState = useShallowRef<Record<string, TableRow[]>>({});

const treeLoadingState = useShallowRef<string[]>([]);

const treeLoadedState = useShallowRef<string[]>([]);

const currentKey = useRef("");

const sortPropState = useRef("");

const sortOrderState = useRef<SortOrder>("");

const filterValuesState = useRef<Record<string, unknown[]>>({});

const filterDraftState = useRef<unknown[]>([]);

const filterOpenKey = useRef("");

const filterOverlayStyle = useRef<Record<string, string>>({});

const tooltipOpenState = useRef(false);

const tooltipTextState = useRef("");

const tooltipStyleState = useRef<Record<string, string>>({});

const tooltipPlacementState = useRef<TableTooltipPlacement>("top");

const tooltipCellKeyState = useRef("");

const columnWidthsState = useRef<Record<string, number>>({});

const resizeState = useRef<TableResizeState | null>(null);

const lastSelectedSig = useRef("");

const lastExpandedSig = useRef("");

let initialized = false;
let initialExpansionApplied = false;
let externalSortObserved = false;
let filterOverlayFrame = 0;
let tooltipPositionFrame = 0;
let tooltipAnchor: HTMLElement | null = null;
let tooltipShowTimer = 0;
let tooltipHideTimer = 0;
let cleanupFilterOverlay = (): void => {};
let cleanupTooltipScrollTracking = (): void => {};
const externalFilterSignatures = new Map<string, string>();

const normalizeKeys = (value: unknown): string[] => {
  if (!Array.isArray(value)) return [];
  return value.map((item) => String(item)).filter(Boolean);
};

const keySignature = (keys: readonly string[]): string => keys.join(TABLE_KEY_SEPARATOR);

const cssSize = (value: unknown): string => {
  if (value == null || value === "") return "";
  if (typeof value === "number") return `${value}px`;
  const normalized = String(value).trim();
  return /^-?\d+(?:\.\d+)?$/.test(normalized) ? `${normalized}px` : normalized;
};

const cssSizeNumber = (value: string): number => {
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const columnSize = (column: TableColumnView, widths: Record<string, number> = columnWidthsState.peek()): number =>
  getTableColumnSize(column, widths);

const columnWidth = (column: TableColumnView): string => `${columnSize(column)}px`;

const rowKeyOf = (row: TableRow, fallback: number | string): string => {
  const key = props.rowKey;
  if (typeof key === "function") {
    try {
      return String(key(row));
    } catch {
      return String(fallback);
    }
  }
  return String(valueAtPath(row, String(key || "id")) ?? fallback);
};

const rawColumns = (): Record<string, unknown>[] =>
  Array.isArray(props.columns) ? (props.columns as Record<string, unknown>[]) : [];

const rawRows = (): TableRow[] => (Array.isArray(props.data) ? (props.data as TableRow[]) : []);

const normalizeColumns = (widths: Record<string, number> = columnWidthsState.peek()): TableColumnView[] =>
  normalizeTableColumns({
    columns: rawColumns(),
    firstRow: rawRows()[0],
    widths,
    actionsLabel: locale.t("table.actions"),
  });

const hasFilters = (column: TableColumnView): boolean => filterOptionsOf(column).length > 0;

const filterValuesOf = (column: TableColumnView): unknown[] => filterValuesState.value[filterKeyOf(column)] || [];

const syncExternalFilters = (columns: TableColumnView[]): void => {
  const next = { ...filterValuesState.peek() };
  const activeKeys = new Set<string>();
  let changed = false;

  for (const column of columns) {
    if (!hasFilters(column)) continue;
    const key = filterKeyOf(column);
    activeKeys.add(key);
    if (!Array.isArray(column.raw.filteredValue)) continue;
    const values = [...column.raw.filteredValue];
    const nextSignature = filterSignature(values);
    if (externalFilterSignatures.get(key) === nextSignature) continue;
    externalFilterSignatures.set(key, nextSignature);
    next[key] = column.raw.filterMultiple === false ? values.slice(0, 1) : values;
    changed = true;
  }

  for (const key of Object.keys(next)) {
    if (activeKeys.has(key)) continue;
    delete next[key];
    externalFilterSignatures.delete(key);
    changed = true;
  }
  if (changed) filterValuesState.set(next);
};

const activeFilterColumns = (columns: TableColumnView[]): TableColumnView[] =>
  activeTableFilterColumns(columns, filterValuesState.value);

const sortedData = (columns: TableColumnView[], source: TableRow[]): TableRow[] =>
  sortTableRows(columns, source, sortPropState.value, sortOrderState.value);

const treeConfig = () => normalizeTableTreeProps(props.treeProps);

const treeChildrenOf = (row: TableRow, key: string): TableRow[] => {
  const loaded = lazyChildrenState.value[key];
  if (Array.isArray(loaded)) return loaded;
  const children = valueAtPath(row, treeConfig().children);
  return Array.isArray(children) ? (children as TableRow[]) : [];
};

const isTreeExpandable = (row: TableRow, key: string, children: TableRow[]): boolean => {
  if (children.length > 0) return true;
  if (!props.lazy || treeLoadedState.value.includes(key)) return false;
  return Boolean(valueAtPath(row, treeConfig().hasChildren));
};

const selectionColumn = (): TableColumnView | undefined =>
  columnsState.peek().find((column) => column.type === "selection");

const isSelectable = (row: TableRowView): boolean => {
  const selectable = selectionColumn()?.raw.selectable;
  if (typeof selectable !== "function") return true;
  try {
    return Boolean(selectable(row.raw, row.index));
  } catch {
    return true;
  }
};

const normalizeTreeSelection = (keys: string[]): string[] => {
  return rowCollection?.normalizeSelection(keys, treeConfig().checkStrictly, isSelectable) ?? keys;
};

const rebuildRows = (): void => {
  fastVirtualRangeKey = "";
  const columns = normalizeColumns();
  syncExternalFilters(columns);
  const activeFilters = activeFilterColumns(columns);
  const tree = buildTableTree({
    roots: rawRows(),
    expandedKeys: new Set(expandedState.value),
    childrenOf: treeChildrenOf,
    keyOf: rowKeyOf,
    isExpandable: isTreeExpandable,
    sortRows: (rows) => sortedData(columns, rows),
    ...(activeFilters.length > 0
      ? {
          matchesRow: (row: TableRow) => tableRowMatchesFilters(row, activeFilters, filterValuesState.value),
        }
      : {}),
  });
  const rows = tree.visible as TableRowView[];
  const allRows = tree.all as TableRowView[];

  columnsState.set(columns);
  rowsState.set(rows);
  allRowsState.set(allRows);
  isTreeState.set(tree.isTree);
  rowCollection = tree.collection as TableRowCollectionView;

  const rowKeys = new Set(allRows.map((row) => row.key));
  const nextSelected = normalizeTreeSelection(selectedKeysSnapshot());
  if (keySignature(nextSelected) !== lastSelectedSig.peek()) {
    selectedState.set(nextSelected);
    lastSelectedSig.set(keySignature(nextSelected));
  }
  const nextExpanded = expandedState.peek().filter((key) => rowKeys.has(key));
  if (keySignature(nextExpanded) !== lastExpandedSig.peek()) {
    expandedState.set(nextExpanded);
    lastExpandedSig.set(keySignature(nextExpanded));
  }
  if (currentKey.peek() && !rowKeys.has(currentKey.peek())) currentKey.set("");
};

const commitSelectedKeys = (next: string[]): void => {
  pendingSelectedKeys = null;
  selectedState.set(next);
};

const scheduleSelectedKeysCommit = (next: string[]): void => {
  if (typeof window === "undefined" || typeof requestAnimationFrame === "undefined") {
    commitSelectedKeys(next);
    return;
  }
  if (selectionCommitFrame) cancelAnimationFrame(selectionCommitFrame);
  if (selectionCommitTimer) window.clearTimeout(selectionCommitTimer);
  selectionCommitFrame = requestAnimationFrame(() => {
    selectionCommitFrame = 0;
    // The optimistic checkbox/row state gets one paint before the more
    // expensive declarative table reconciliation runs.
    selectionCommitTimer = window.setTimeout(() => {
      selectionCommitTimer = 0;
      if (pendingSelectedKeys) commitSelectedKeys(pendingSelectedKeys);
    }, 0);
  });
};

const setSelectedKeys = (keys: string[], shouldEmit = true): void => {
  const next = normalizeTreeSelection(keys);
  const changed = keySignature(next) !== keySignature(selectedKeysSnapshot());
  if (!changed) return;
  pendingSelectedKeys = next;
  lastSelectedSig.set(keySignature(next));
  applySelectionDom(next);
  if (shouldEmit) scheduleSelectedKeysCommit(next);
  else commitSelectedKeys(next);
  if (shouldEmit) {
    emit("update:selectedKeys", next);
    emit("selection-change", getSelectionRows(next));
  }
};

const setExpandedKeys = (keys: string[], shouldEmit = true, row?: TableRowView, treeExpanded?: boolean): void => {
  const rowKeys = new Set(allRowsState.peek().map((item) => item.key));
  const next = Array.from(new Set(keys.map(String).filter((key) => rowKeys.has(key))));
  expandedState.set(next);
  lastExpandedSig.set(keySignature(next));
  if (shouldEmit) {
    emit("update:expandedRowKeys", next);
    emit("expand-change", row?.raw, treeExpanded ?? next);
  }
};

useEffect(() => {
  if (!initialized) {
    initialized = true;
    selectedState.set(
      normalizeKeys(Array.isArray(props.selectedKeys) ? props.selectedKeys : props.defaultSelectedKeys),
    );
    expandedState.set(
      normalizeKeys(Array.isArray(props.expandedRowKeys) ? props.expandedRowKeys : props.defaultExpandedRowKeys),
    );
    currentKey.set(String(props.currentRowKey || ""));
    const defaultSort = (props.defaultSort || {}) as TableDefaultSort;
    const initialSortProp = String(props.sortProp || defaultSort.prop || "");
    const initialSortOrder = String(
      props.sortOrder || defaultSort.order || (initialSortProp ? "ascending" : ""),
    ) as SortOrder;
    sortPropState.set(initialSortProp);
    sortOrderState.set(initialSortOrder === "ascending" || initialSortOrder === "descending" ? initialSortOrder : "");
  }
  rebuildRows();
  if (!initialExpansionApplied) {
    initialExpansionApplied = true;
    if (
      props.defaultExpandAll &&
      !Array.isArray(props.expandedRowKeys) &&
      normalizeKeys(props.defaultExpandedRowKeys).length === 0
    ) {
      setExpandedKeys(
        allRowsState
          .peek()
          .filter((row) => !isTreeState.peek() || row.hasChildren)
          .map((row) => row.key),
        false,
      );
    }
  }
});

useEffect(() => {
  if (!Array.isArray(props.expandedRowKeys)) return;
  const next = normalizeKeys(props.expandedRowKeys);
  if (keySignature(next) === lastExpandedSig.peek()) return;
  setExpandedKeys(next, false);
});

useEffect(() => {
  if (!Array.isArray(props.selectedKeys)) return;
  const next = normalizeKeys(props.selectedKeys);
  if (keySignature(next) === lastSelectedSig.peek()) return;
  setSelectedKeys(next, false);
});

useEffect(() => {
  const next = String(props.currentRowKey || "");
  if (next !== currentKey.peek()) currentKey.set(next);
});

useEffect(() => {
  const nextProp = String(props.sortProp || "");
  const nextOrder = String(props.sortOrder || "") as SortOrder;
  if (!externalSortObserved && !nextProp && !nextOrder) return;
  externalSortObserved = true;
  const normalizedOrder =
    nextOrder === "ascending" || nextOrder === "descending" ? nextOrder : nextProp ? "ascending" : "";
  if (nextProp !== sortPropState.peek() || normalizedOrder !== sortOrderState.peek()) {
    sortPropState.set(nextProp);
    sortOrderState.set(normalizedOrder);
    rebuildRows();
  }
});

const getColumns = (): TableColumnView[] => columnsState.value;

const getRows = (): TableRowView[] => rowsState.value;

const isVirtualized = (): boolean =>
  Boolean(props.virtual) &&
  Boolean(props.height) &&
  !isTreeState.value &&
  rowsState.value.length >= Math.max(0, Number(props.virtualThreshold) || 0);

const resolveVirtualRowHeight = (row: TableRowView): number => {
  const value = props.rowHeight;
  if (typeof value !== "function") return Math.max(1, Number(value) || 48);
  try {
    return Math.max(1, Number(value({ row: row.raw, rowIndex: row.index })) || 48);
  } catch {
    return 48;
  }
};

const virtualRowOffsets = (): number[] => {
  const source = rowsState.value;
  if (
    source === cachedRowHeightSource &&
    props.rowHeight === cachedRowHeightResolver &&
    cachedRowOffsets.length === source.length + 1
  )
    return cachedRowOffsets;
  const offsets = buildVirtualOffsets(source, resolveVirtualRowHeight, 48);
  cachedRowHeightSource = source;
  cachedRowHeightResolver = props.rowHeight;
  cachedRowOffsets = offsets;
  return offsets;
};

const virtualWindowAt = (scrollOffset: number): VirtualWindow => {
  const wrap = wrapRef.value;
  const viewportSize = Math.max(
    0,
    (wrap?.clientHeight || cssSizeNumber(cssSize(props.height))) - (props.showHeader ? 48 : 0),
  );
  const count = rowsState.value.length;
  const overscan = Math.max(0, Number(props.overscan) || 0);
  if (typeof props.rowHeight === "function") {
    return computeVariableVirtualWindow({ offsets: virtualRowOffsets(), viewportSize, scrollOffset, overscan });
  }
  const itemSize = Math.max(1, Number(props.rowHeight) || 48);
  const key = `${count}:${itemSize}:${viewportSize}:${scrollOffset}:${overscan}`;
  if (key === cachedVirtualKey) return cachedVirtualWindow;
  cachedVirtualKey = key;
  cachedVirtualWindow = computeVirtualWindow({ count, itemSize, viewportSize, scrollOffset, overscan });
  return cachedVirtualWindow;
};

const virtualWindow = (): VirtualWindow => virtualWindowAt(virtualScrollTop.value);

const getRenderRows = (): TableRowView[] => {
  if (!isVirtualized()) return rowsState.value;
  const range = virtualWindow();
  const source = rowsState.value;
  if (source === cachedRenderSource && range.start === cachedRenderStart && range.end === cachedRenderEnd) {
    return cachedRenderRows;
  }
  cachedRenderSource = source;
  cachedRenderStart = range.start;
  cachedRenderEnd = range.end;
  cachedRenderRows = source.slice(range.start, range.end);
  return cachedRenderRows;
};

const virtualBodyStyle = (): Record<string, string> => {
  if (!isVirtualized()) return {};
  const range = virtualWindow();
  return {
    height: `${range.totalSize}px`,
    paddingBlockStart: `${range.offset}px`,
  };
};

const tableClass = (): Record<string, boolean> => ({
  "has-title": Boolean(props.title),
  "title-primary": props.titleVariant === "primary",
  "title-muted": props.titleVariant === "muted",
  "is-stripe": Boolean(props.stripe),
  "is-border": Boolean(props.border),
  "is-hover": Boolean(props.hover),
  "is-small": props.size === "small",
  "is-large": props.size === "large",
  "is-sticky-header": Boolean(props.stickyHeader),
  "is-fit": Boolean(props.fit),
  "is-scrollbar-always": Boolean(props.scrollbarAlwaysOn),
  "is-resizing": Boolean(resizeState.value),
  "is-virtualized": isVirtualized(),
});

const wrapStyle = (): Record<string, string> => {
  const style: Record<string, string> = {};
  if (props.height) style.height = cssSize(props.height);
  if (props.maxHeight) style.maxHeight = cssSize(props.maxHeight);
  if (isVirtualized() && typeof props.rowHeight !== "function") {
    style["--_virtual-row-height"] = `${Math.max(1, Number(props.rowHeight) || 48)}px`;
  }
  return style;
};

const tableStyle = (): Record<string, string> => {
  const totalWidth = getColumns().reduce((sum, column) => sum + columnSize(column), 0);
  const style: Record<string, string> = { tableLayout: String(props.tableLayout || "fixed") };
  if (totalWidth <= 0) return style;
  style.minWidth = `${totalWidth}px`;
  if (!props.fit) style.width = `${totalWidth}px`;
  return style;
};

const colStyle = (column: TableColumnView): Record<string, string> => {
  const width = columnWidth(column);
  return { width, minWidth: width, maxWidth: width };
};

const columnBoxStyle = (column: TableColumnView): Record<string, string> => {
  const width = columnWidth(column);
  return { width, minWidth: width, maxWidth: width };
};

const baseCellClass = (
  column: TableColumnView,
  align: TableColumnView["align"] = column.align,
): Record<string, boolean> => ({
  "is-center": align === "center",
  "is-right": align === "right",
  "is-selection": column.type === "selection",
  "is-index": column.type === "index",
  "is-expand": column.type === "expand",
  "is-actions": column.type === "actions",
  "is-sortable": Boolean(column.sortable),
  "is-fixed-left": column.fixed === "left",
  "is-fixed-right": column.fixed === "right",
  "is-fixed-last": column.fixedLast,
});

const columnIndexOf = (column: TableColumnView): number => getColumns().findIndex((item) => item.id === column.id);

const resolveColumnClass = (value: unknown, row: TableRowView | null, column: TableColumnView): string => {
  if (typeof value === "function" && row) {
    try {
      return String(value(row.raw, column.raw, row.index) ?? "");
    } catch {
      return "";
    }
  }
  return typeof value === "string" ? value : "";
};

const resolveRowClass = (row: TableRowView): string => {
  const value = props.rowClassName;
  if (typeof value === "function") {
    try {
      return String(value({ row: row.raw, rowIndex: row.index }) ?? "");
    } catch {
      return "";
    }
  }
  return typeof value === "string" ? value : "";
};

const resolveRowStyle = (row: TableRowView): TableStyle => {
  const value = props.rowStyle;
  let style: TableStyle = {};
  if (typeof value === "function") {
    try {
      style = value({ row: row.raw, rowIndex: row.index }) || {};
    } catch {
      style = {};
    }
  } else if (value && typeof value === "object") {
    style = value as TableStyle;
  }
  return isVirtualized() && typeof props.rowHeight === "function"
    ? { ...style, height: `${resolveVirtualRowHeight(row)}px` }
    : style;
};

const cellContext = (column: TableColumnView, row: TableRowView): TableCellContext => ({
  row: row.raw,
  rowIndex: row.index,
  column: column.raw as TableColumn,
  columnIndex: columnIndexOf(column),
});

const resolveGlobalCellClass = (column: TableColumnView, row: TableRowView): string => {
  const value = props.cellClassName;
  if (typeof value === "function") {
    try {
      return String(value(cellContext(column, row)) ?? "");
    } catch {
      return "";
    }
  }
  return typeof value === "string" ? value : "";
};

const resolveGlobalCellStyle = (column: TableColumnView, row: TableRowView): TableStyle => {
  const value = props.cellStyle;
  if (typeof value === "function") {
    try {
      return value(cellContext(column, row)) || {};
    } catch {
      return {};
    }
  }
  return value && typeof value === "object" ? (value as TableStyle) : {};
};

const headerContext = (column: TableColumnView): TableHeaderCellContext => ({
  rowIndex: 0,
  column: column.raw as TableColumn,
  columnIndex: columnIndexOf(column),
});

const resolveHeaderCellClass = (column: TableColumnView): string => {
  const value = props.headerCellClassName;
  if (typeof value === "function") {
    try {
      return String(value(headerContext(column)) ?? "");
    } catch {
      return "";
    }
  }
  return typeof value === "string" ? value : "";
};

const resolveHeaderCellStyle = (column: TableColumnView): TableStyle => {
  const value = props.headerCellStyle;
  if (typeof value === "function") {
    try {
      return value(headerContext(column)) || {};
    } catch {
      return {};
    }
  }
  return value && typeof value === "object" ? (value as TableStyle) : {};
};

const headerCellClass = (column: TableColumnView): ClassValue => [
  baseCellClass(column, column.headerAlign),
  resolveColumnClass(column.raw.headerClassName || column.raw.className, null, column),
  resolveHeaderCellClass(column),
];

const cellClass = (column: TableColumnView, row: TableRowView): ClassValue => [
  baseCellClass(column),
  resolveColumnClass(column.raw.className, row, column),
  resolveColumnClass(column.raw.cellClassName, row, column),
  resolveGlobalCellClass(column, row),
];

const cellStyle = (column: TableColumnView, row: TableRowView): StyleValue => {
  const raw = column.raw.cellStyle;
  if (typeof raw === "function") {
    try {
      return (raw(row.raw, column.raw, row.index) || {}) as StyleValue;
    } catch {
      return {};
    }
  }
  if (raw && typeof raw === "object") return raw as StyleValue;
  return {};
};

const fixedStyle = (column: TableColumnView): Record<string, string> => {
  if (!column.fixed) return {};
  return { [column.fixed]: column.fixedOffset };
};

const headerCellStyle = (column: TableColumnView): StyleValue => ({
  ...columnBoxStyle(column),
  ...fixedStyle(column),
  ...resolveHeaderCellStyle(column),
});

const mergedCellStyle = (column: TableColumnView, row: TableRowView): StyleValue => ({
  ...columnBoxStyle(column),
  ...fixedStyle(column),
  ...resolveGlobalCellStyle(column, row),
  ...(cellStyle(column, row) as Record<string, string | number>),
});

const rowClass = (row: TableRowView): ClassValue => [
  {
    "is-current": Boolean(props.highlightCurrentRow && currentKey.value === row.key),
    "is-selected": selectedKeysSnapshot(true).includes(row.key),
  },
  resolveRowClass(row),
];

const rowStyle = (row: TableRowView): StyleValue => resolveRowStyle(row);

const headerRowClass = (): string => {
  const value = props.headerRowClassName;
  if (typeof value === "function") {
    try {
      return String(value({ rowIndex: 0 }) ?? "");
    } catch {
      return "";
    }
  }
  return typeof value === "string" ? value : "";
};

const headerRowStyle = (): StyleValue => {
  const value = props.headerRowStyle;
  if (typeof value === "function") {
    try {
      return value({ rowIndex: 0 }) || {};
    } catch {
      return {};
    }
  }
  return value && typeof value === "object" ? (value as TableStyle) : {};
};

const normalizeSpan = (value: TableSpanResult | undefined): TableSpanView => {
  const [rowspan, colspan] = Array.isArray(value) ? value : [value?.rowspan ?? 1, value?.colspan ?? 1];
  const rowValue = Number(rowspan);
  const columnValue = Number(colspan);
  const normalizedRowspan = Number.isFinite(rowValue) ? Math.max(0, Math.trunc(rowValue)) : 1;
  const normalizedColspan = Number.isFinite(columnValue) ? Math.max(0, Math.trunc(columnValue)) : 1;
  return {
    rowspan: normalizedRowspan,
    colspan: normalizedColspan,
    hidden: normalizedRowspan === 0 || normalizedColspan === 0,
  };
};

const bodyCells = (row: TableRowView): TableCellView[] =>
  getColumns().map((column, columnIndex) => {
    let span: TableSpanResult | undefined;
    if (typeof props.spanMethod === "function") {
      try {
        span = props.spanMethod(cellContext(column, row));
      } catch {
        span = undefined;
      }
    }
    return {
      column,
      columnIndex,
      ...normalizeSpan(span),
    };
  });

const getCell = (row: TableRowView, column: TableColumnView): string => {
  if (column.type === "index") {
    const index = column.raw.index;
    if (typeof index === "function") {
      try {
        return String(index(row.index));
      } catch {
        return String(row.index + 1);
      }
    }
    return String(typeof index === "number" ? index + row.index : row.index + 1);
  }
  if (column.type === "selection") return "";
  if (column.type === "expand") return "";
  if (column.type === "actions") return "";
  const formatter = column.raw.formatter;
  if (typeof formatter === "function") {
    try {
      return String(formatter(row.raw, column.raw, row.index) ?? "");
    } catch {
      return "";
    }
  }
  return String(row.raw[column.prop] ?? "");
};

const renderCellValue = (row: TableRowView, column: TableColumnView): TableRenderValue => {
  const renderer = column.raw.renderCell;
  if (typeof renderer !== "function") return getCell(row, column);
  try {
    return renderer(cellContext(column, row)) as TableRenderValue;
  } catch {
    return getCell(row, column);
  }
};

const renderHeaderValue = (column: TableColumnView): TableRenderValue => {
  const renderer = column.raw.renderHeader;
  if (typeof renderer !== "function") return column.label;
  try {
    return renderer(headerContext(column)) as TableRenderValue;
  } catch {
    return column.label;
  }
};

const hasCustomFilterIcon = (column: TableColumnView): boolean => typeof column.raw.renderFilterIcon === "function";

const renderFilterIconValue = (column: TableColumnView): TableRenderValue => {
  const renderer = column.raw.renderFilterIcon;
  if (typeof renderer !== "function") return "";
  try {
    return renderer({
      column: column.raw as TableColumn,
      filtered: filterValuesOf(column).length > 0,
    }) as TableRenderValue;
  } catch {
    return "";
  }
};

const hasCellTooltip = (column: TableColumnView): boolean =>
  column.type === "default" && Boolean(column.raw.showOverflowTooltip ?? props.showOverflowTooltip);

const cellTooltipText = (row: TableRowView, column: TableColumnView): string => {
  if (!hasCellTooltip(column)) return "";
  const formatter = column.raw.tooltipFormatter;
  if (typeof formatter === "function") {
    try {
      return String(formatter(row.raw, column.raw, row.index) ?? "");
    } catch {
      return getCell(row, column);
    }
  }
  return getCell(row, column);
};

const tooltipOptions = (): Required<TableTooltipOptions> => {
  const raw = props.tooltipOptions || {};
  const numberOr = (value: unknown, fallback: number): number => {
    if (value == null || value === "") return fallback;
    const normalized = Number(value);
    return Number.isFinite(normalized) ? Math.max(0, normalized) : fallback;
  };
  const placement = TOOLTIP_PLACEMENTS.includes(raw.placement as TableTooltipPlacement)
    ? (raw.placement as TableTooltipPlacement)
    : "top";
  return {
    placement,
    offset: numberOr(raw.offset, 8),
    showAfter: numberOr(raw.showAfter, 300),
    hideAfter: numberOr(raw.hideAfter, 80),
    maxWidth: raw.maxWidth || 320,
  };
};

const tooltipCellKey = (row: TableRowView, column: TableColumnView): string =>
  `${row.key}${TABLE_CELL_KEY_SEPARATOR}${column.id}`;

const clearTooltipTimers = (): void => {
  if (tooltipShowTimer) window.clearTimeout(tooltipShowTimer);
  if (tooltipHideTimer) window.clearTimeout(tooltipHideTimer);
  tooltipShowTimer = 0;
  tooltipHideTimer = 0;
};

const getTooltipElement = ():
  | (HTMLElement & {
      showPopover?: () => void;
      hidePopover?: () => void;
    })
  | null => host.shadowRoot?.querySelector<HTMLElement>(".table-tooltip") ?? null;

const closeTooltip = (): void => {
  if (!tooltipOpenState.peek() && !tooltipAnchor && !tooltipCellKeyState.peek()) return;
  clearTooltipTimers();
  cleanupTooltipScrollTracking();
  cleanupTooltipScrollTracking = (): void => {};
  try {
    getTooltipElement()?.hidePopover?.();
  } catch {
    // A conditionally removed popover is already closed by the browser.
  }
  tooltipAnchor = null;
  tooltipOpenState.set(false);
  tooltipCellKeyState.set("");
};

const updateTooltipPosition = (): void => {
  if (!tooltipOpenState.peek() || !tooltipAnchor) return;
  const overlay = host.shadowRoot?.querySelector<HTMLElement>(".table-tooltip");
  if (!overlay) return;
  const anchorRect = tooltipAnchor.getBoundingClientRect();
  const overlayRect = overlay.getBoundingClientRect();
  const viewport = window.visualViewport;
  const options = tooltipOptions();
  const position = computeAnchoredPosition(
    anchorRect,
    overlayRect,
    {
      width: viewport?.width || window.innerWidth,
      height: viewport?.height || window.innerHeight,
      offsetLeft: viewport?.offsetLeft || 0,
      offsetTop: viewport?.offsetTop || 0,
    },
    {
      placement: options.placement,
      offset: [0, options.offset],
      padding: 8,
      flip: true,
    },
  );
  tooltipPlacementState.set(position.placement);
  tooltipStyleState.set({
    left: `${position.left}px`,
    top: `${position.top}px`,
    maxWidth: cssSize(options.maxWidth),
  });
};

const requestTooltipPositionUpdate = (): void => {
  if (typeof window === "undefined" || !tooltipOpenState.peek()) return;
  if (tooltipPositionFrame) window.cancelAnimationFrame(tooltipPositionFrame);
  tooltipPositionFrame = window.requestAnimationFrame(() => {
    tooltipPositionFrame = 0;
    updateTooltipPosition();
  });
};

const composedParentElement = (element: HTMLElement): HTMLElement | null => {
  if (element.parentElement) return element.parentElement;
  const root = element.getRootNode();
  return root instanceof ShadowRoot && root.host instanceof HTMLElement ? root.host : null;
};

const isScrollableElement = (element: HTMLElement): boolean => {
  const style = window.getComputedStyle(element);
  const canScrollY = /(auto|scroll|overlay)/.test(style.overflowY) && element.scrollHeight > element.clientHeight + 1;
  const canScrollX = /(auto|scroll|overlay)/.test(style.overflowX) && element.scrollWidth > element.clientWidth + 1;
  return canScrollX || canScrollY;
};

const trackTooltipScrollAncestors = (anchor: HTMLElement): void => {
  cleanupTooltipScrollTracking();
  const targets: HTMLElement[] = [];
  let current = composedParentElement(anchor);
  while (current) {
    if (isScrollableElement(current)) targets.push(current);
    current = composedParentElement(current);
  }
  targets.forEach((target) => target.addEventListener("scroll", requestTooltipPositionUpdate, { passive: true }));
  cleanupTooltipScrollTracking = () => {
    targets.forEach((target) => target.removeEventListener("scroll", requestTooltipPositionUpdate));
  };
};

const isCellOverflowing = (cell: HTMLElement): boolean => {
  const content = cell.querySelector<HTMLElement>(".cell-text") || cell;
  return content.scrollWidth > content.clientWidth + 1 || content.scrollHeight > content.clientHeight + 1;
};

const openCellTooltip = (row: TableRowView, column: TableColumnView, cell: HTMLElement): void => {
  clearTooltipTimers();
  if (tooltipAnchor && tooltipAnchor !== cell) {
    tooltipAnchor = null;
    tooltipOpenState.set(false);
    tooltipCellKeyState.set("");
  }
  if (!isCellOverflowing(cell)) return;
  const text = cellTooltipText(row, column);
  if (!text) return;
  const open = (): void => {
    tooltipAnchor = cell;
    trackTooltipScrollAncestors(cell);
    tooltipTextState.set(text);
    tooltipCellKeyState.set(tooltipCellKey(row, column));
    tooltipOpenState.set(true);
    queueMicrotask(() => {
      try {
        getTooltipElement()?.showPopover?.();
      } catch {
        // Native popover support is optional; fixed positioning remains valid.
      }
      updateTooltipPosition();
    });
  };
  const delay = tooltipOptions().showAfter;
  if (delay > 0) tooltipShowTimer = window.setTimeout(open, delay);
  else open();
};

const scheduleTooltipClose = (): void => {
  if (tooltipShowTimer) window.clearTimeout(tooltipShowTimer);
  tooltipShowTimer = 0;
  const delay = tooltipOptions().hideAfter;
  if (delay > 0) tooltipHideTimer = window.setTimeout(closeTooltip, delay);
  else closeTooltip();
};

const tooltipDescriptionId = (row: TableRowView, column: TableColumnView): string | null =>
  tooltipOpenState.value && tooltipCellKeyState.value === tooltipCellKey(row, column) ? tooltipId : null;

const isSelected = (row: TableRowView): boolean => selectedKeysSnapshot(true).includes(row.key);

const isExpanded = (row: TableRowView): boolean => expandedState.value.includes(row.key);

const isRowIndeterminate = (row: TableRowView): boolean =>
  rowCollection?.isRowIndeterminate(row, selectedKeysSnapshot(true), treeConfig().checkStrictly, isSelectable) ?? false;

const selectionSummary = () =>
  rowCollection?.selectionSummary(selectedKeysSnapshot(true), isSelectable) ?? {
    selectableRows: [],
    allSelected: false,
    indeterminate: false,
  };

const selectableRows = (): TableRowView[] => selectionSummary().selectableRows as TableRowView[];

const isAllSelected = (): boolean => selectionSummary().allSelected;

const isIndeterminate = (): boolean => selectionSummary().indeterminate;

function applySelectionDom(keys: string[]): void {
  const root = host.shadowRoot;
  if (!root) return;
  const selected = new Set(keys);
  const rowsByKey = new Map(allRowsState.peek().map((row) => [row.key, row] as const));
  for (const rowElement of root.querySelectorAll<HTMLTableRowElement>("tbody tr")) {
    const key = String(rowElement.dataset.rowKey || rowElement.dataset.virtualKey || "");
    const row = rowsByKey.get(key);
    const checked = selected.has(key);
    const indeterminate = row ? isRowIndeterminate(row) : false;
    rowElement.classList.toggle("is-selected", checked);
    const checkbox = rowElement.querySelector<HTMLButtonElement>(".table-checkbox");
    if (!checkbox) continue;
    checkbox.classList.toggle("is-checked", checked);
    checkbox.classList.toggle("is-indeterminate", indeterminate);
    checkbox.setAttribute("aria-checked", indeterminate ? "mixed" : String(checked));
  }
  const headerCheckbox = root.querySelector<HTMLButtonElement>("thead .table-checkbox");
  if (headerCheckbox) {
    const all = isAllSelected();
    const indeterminate = isIndeterminate();
    headerCheckbox.classList.toggle("is-checked", all);
    headerCheckbox.classList.toggle("is-indeterminate", indeterminate);
    headerCheckbox.setAttribute("aria-checked", indeterminate ? "mixed" : String(all));
  }
}

const toggleRowSelection = (target: unknown, selected?: boolean, ignoreSelectable = false): void => {
  const row = rowCollection?.resolve(target);
  if (!row) return;
  setSelectedKeys(
    rowCollection!.toggleRowSelection(
      selectedKeysSnapshot(),
      row,
      selected,
      ignoreSelectable,
      treeConfig().checkStrictly,
      isSelectable,
    ),
    true,
  );
};

const toggleAllSelection = (): void => {
  setSelectedKeys(
    rowCollection?.toggleAllSelection(selectedKeysSnapshot(), isSelectable, props.selectOnIndeterminate) ?? [],
    true,
  );
};

const onToggleRowSelection = (row: TableRowView): void => {
  toggleRowSelection(row.key);
  emit("select", getSelectionRows(), row.raw);
};

const onToggleAllSelection = (): void => {
  toggleAllSelection();
  emit("select-all", getSelectionRows());
};

const clearSelection = (): void => setSelectedKeys([], true);

const resolveRow = (target: unknown): TableRowView | undefined => {
  return rowCollection?.resolve(target);
};

const setTreeLoading = (key: string, loading: boolean): void => {
  const set = new Set(treeLoadingState.peek());
  if (loading) set.add(key);
  else set.delete(key);
  treeLoadingState.set(Array.from(set));
};

const updateKeyChildren = (key: string | number, children: TableRow[]): void => {
  const normalizedKey = String(key);
  lazyChildrenState.set({
    ...lazyChildrenState.peek(),
    [normalizedKey]: Array.isArray(children) ? children : [],
  });
  treeLoadedState.set(Array.from(new Set([...treeLoadedState.peek(), normalizedKey])));
  setTreeLoading(normalizedKey, false);
  rebuildRows();
};

const loadTreeChildren = (row: TableRowView, shouldExpand: boolean): void => {
  if (typeof props.load !== "function" || treeLoadingState.peek().includes(row.key)) return;
  setTreeLoading(row.key, true);
  rebuildRows();
  let resolved = false;
  const resolve = (children: TableRow[]): void => {
    if (resolved) return;
    resolved = true;
    updateKeyChildren(row.key, children);
    if (shouldExpand && children.length > 0) {
      setExpandedKeys([...expandedState.peek(), row.key], true, row, true);
    }
  };
  const context: TableTreeNodeContext = {
    key: row.key,
    level: row.level,
    expanded: isExpanded(row),
    loading: true,
  };
  try {
    const result = props.load(row.raw, context, resolve);
    if (Array.isArray(result)) resolve(result);
    else if (result && typeof result.then === "function") {
      void result
        .then((children) => {
          if (Array.isArray(children)) resolve(children);
          else if (!resolved) resolve([]);
        })
        .catch(() => {
          if (!resolved) setTreeLoading(row.key, false);
        });
    }
  } catch {
    setTreeLoading(row.key, false);
  }
};

const toggleDetailRowExpansion = (target: unknown, expanded?: boolean): void => {
  const row = resolveRow(target);
  if (!row) return;
  const set = new Set(expandedState.peek());
  const shouldExpand = expanded == null ? !set.has(row.key) : expanded;
  if (shouldExpand) set.add(row.key);
  else set.delete(row.key);
  setExpandedKeys(Array.from(set), true, row);
};

const toggleTreeRow = (target: unknown, expanded?: boolean): void => {
  const row = resolveRow(target);
  if (!row?.hasChildren) return;
  const shouldExpand = expanded == null ? !expandedState.peek().includes(row.key) : expanded;
  if (
    shouldExpand &&
    props.lazy &&
    !treeLoadedState.peek().includes(row.key) &&
    treeChildrenOf(row.raw, row.key).length === 0
  ) {
    loadTreeChildren(row, true);
    return;
  }
  const set = new Set(expandedState.peek());
  if (shouldExpand) set.add(row.key);
  else set.delete(row.key);
  setExpandedKeys(Array.from(set), true, row, shouldExpand);
};

const toggleRowExpansion = (target: unknown, expanded?: boolean): void => {
  const row = resolveRow(target);
  if (row?.hasChildren) toggleTreeRow(row, expanded);
  else toggleDetailRowExpansion(row, expanded);
};

function getSelectionRows(keys: string[] = selectedKeysSnapshot()): Record<string, unknown>[] {
  return rowCollection?.selectedRows(keys) ?? [];
}

const setCurrentRow = (target: unknown): void => {
  const rows = allRowsState.peek();
  const row =
    typeof target === "string" || typeof target === "number"
      ? rows.find((item) => item.key === String(target))
      : rows.find((item) => item.raw === target);
  if (!row) return;
  const old = currentKey.peek();
  currentKey.set(row.key);
  emit("current-change", row.raw, old ? rows.find((item) => item.key === old)?.raw : undefined);
};

const columnFromEvent = (event: Event): TableColumnView | undefined => {
  const cell = (event.target as Element | null)?.closest<HTMLElement>("[data-column-index]");
  const index = Number(cell?.dataset.columnIndex);
  return Number.isInteger(index) ? getColumns()[index] : undefined;
};

const onRowClick = (row: TableRowView, event: MouseEvent): void => {
  setCurrentRow(row.key);
  emit("row-click", row.raw, columnFromEvent(event)?.raw, event);
};

const onRowDblClick = (row: TableRowView, event: MouseEvent): void => {
  emit("row-dblclick", row.raw, columnFromEvent(event)?.raw, event);
};

const onRowContextMenu = (row: TableRowView, event: MouseEvent): void => {
  emit("row-contextmenu", row.raw, columnFromEvent(event)?.raw, event);
};

const onCellMouseEnter = (row: TableRowView, column: TableColumnView, event: MouseEvent): void => {
  const cell = event.currentTarget as HTMLElement;
  emit("cell-mouse-enter", row.raw, column.raw, cell, event);
  if (hasCellTooltip(column)) openCellTooltip(row, column, cell);
};

const onCellMouseLeave = (row: TableRowView, column: TableColumnView, event: MouseEvent): void => {
  emit("cell-mouse-leave", row.raw, column.raw, event.currentTarget, event);
  if (hasCellTooltip(column)) scheduleTooltipClose();
};

const onCellFocusIn = (row: TableRowView, column: TableColumnView, event: Event): void => {
  if (!(event instanceof FocusEvent)) return;
  if (hasCellTooltip(column)) openCellTooltip(row, column, event.currentTarget as HTMLElement);
};

const onCellFocusOut = (column: TableColumnView, event: Event): void => {
  if (!(event instanceof FocusEvent)) return;
  if (!hasCellTooltip(column)) return;
  const cell = event.currentTarget as HTMLElement;
  if (event.relatedTarget instanceof Node && cell.contains(event.relatedTarget)) return;
  scheduleTooltipClose();
};

const onCellKeydown = (event: KeyboardEvent): void => {
  if (event.key !== "Escape" || !tooltipOpenState.peek()) return;
  event.preventDefault();
  closeTooltip();
};

const onCellClick = (row: TableRowView, column: TableColumnView, event: MouseEvent): void => {
  emit("cell-click", row.raw, column.raw, event.currentTarget, event);
};

const onCellDblClick = (row: TableRowView, column: TableColumnView, event: MouseEvent): void => {
  emit("cell-dblclick", row.raw, column.raw, event.currentTarget, event);
};

const onCellContextMenu = (row: TableRowView, column: TableColumnView, event: MouseEvent): void => {
  emit("cell-contextmenu", row.raw, column.raw, event.currentTarget, event);
};

const onHeaderClick = (column: TableColumnView, event: MouseEvent): void => {
  emit("header-click", column.raw, event);
};

const onHeaderContextMenu = (column: TableColumnView, event: MouseEvent): void => {
  emit("header-contextmenu", column.raw, event);
};

const getExpandContent = (row: TableRowView): TableRenderValue => {
  const expandColumn = getColumns().find((column) => column.type === "expand");
  const renderer = expandColumn?.raw.renderExpand;
  if (typeof renderer === "function") {
    try {
      return renderer({ row: row.raw, rowIndex: row.index }) as TableRenderValue;
    } catch {
      // Fall through to the formatter/default representation.
    }
  }
  if (typeof props.expandFormatter === "function") {
    try {
      return String(props.expandFormatter(row.raw, row.index) ?? "");
    } catch {
      return "";
    }
  }
  const entries = Object.entries(row.raw).map(([key, value]) => `${key}: ${String(value ?? "")}`);
  return entries.join("    ");
};

const hasExpandColumn = (): boolean => getColumns().some((column) => column.type === "expand");

const treeColumnIndex = (): number => getColumns().findIndex((column) => column.type === "default");

const isTreeCell = (row: TableRowView, columnIndex: number): boolean =>
  Boolean(isTreeState.value && columnIndex === treeColumnIndex() && row.level >= 0);

const treeCellStyle = (row: TableRowView): Record<string, string> => ({
  paddingInlineStart: `${Math.max(0, row.level * Math.max(0, Number(props.indent) || 0))}px`,
});

const isTreeLoading = (row: TableRowView): boolean => treeLoadingState.value.includes(row.key);

const treeToggleLabel = (row: TableRowView): string => {
  if (isTreeLoading(row)) return locale.t("table.loadingChildren");
  return locale.t(isExpanded(row) ? "table.collapseChildren" : "table.expandChildren");
};

const focusTreeToggle = (key: string): void => {
  queueMicrotask(() => {
    const buttons = host.shadowRoot?.querySelectorAll<HTMLButtonElement>(".tree-toggle[data-tree-key]");
    Array.from(buttons || [])
      .find((button) => button.dataset.treeKey === key)
      ?.focus();
  });
};

const onTreeToggleKeydown = (row: TableRowView, event: KeyboardEvent): void => {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    toggleTreeRow(row);
    return;
  }
  if (event.key === "ArrowRight") {
    event.preventDefault();
    if (!isExpanded(row)) toggleTreeRow(row, true);
    else {
      const child = rowsState.peek().find((item) => item.parentKey === row.key);
      if (child?.hasChildren) focusTreeToggle(child.key);
    }
    return;
  }
  if (event.key !== "ArrowLeft") return;
  event.preventDefault();
  if (isExpanded(row)) toggleTreeRow(row, false);
  else if (row.parentKey) focusTreeToggle(row.parentKey);
};

const actionType = (value: unknown): TableActionView["type"] =>
  value === "primary" || value === "danger" ? value : "default";

const getActions = (row: TableRowView, column: TableColumnView): TableActionView[] => {
  const actions = Array.isArray(column.raw.actions) ? column.raw.actions : [];
  return actions.map((action) => {
    const raw = action as Record<string, unknown>;
    let disabled = Boolean(raw.disabled);
    if (typeof raw.disabled === "function") {
      try {
        disabled = Boolean(raw.disabled(row.raw, row.index));
      } catch {
        disabled = false;
      }
    }
    return {
      label: String(raw.label || ""),
      type: actionType(raw.type),
      disabled,
      raw,
    };
  });
};

const actionClass = (action: TableActionView): Record<string, boolean> => ({
  "is-primary": action.type === "primary",
  "is-danger": action.type === "danger",
});

const invokeAction = (action: TableActionView, row: TableRowView): void => {
  if (action.disabled) return;
  const handler = action.raw.onClick;
  if (typeof handler === "function") handler(row.raw, row.index, action.raw);
  emit("action-click", action.raw, row.raw, row.index);
};

const isColumnResizable = (column: TableColumnView): boolean => Boolean(props.border && column.raw.resizable !== false);

const columnMinWidth = (column: TableColumnView): number => Math.max(48, cssSizeNumber(column.minWidth) || 48);

const applyColumnWidth = (column: TableColumnView, width: number): number => {
  const next = Math.max(columnMinWidth(column), Math.round(Number(width) || columnSize(column)));
  const widths = { ...columnWidthsState.peek(), [column.id]: next };
  columnWidthsState.set(widths);
  columnsState.set(normalizeColumns(widths));
  return next;
};

const cleanupColumnResize = (): void => {
  if (typeof document === "undefined") return;
  document.removeEventListener("pointermove", onResizePointerMove);
  document.removeEventListener("pointerup", onResizePointerUp);
  document.removeEventListener("pointercancel", onResizePointerCancel);
};

const onResizePointerMove = (event: PointerEvent): void => {
  const state = resizeState.peek();
  if (!state || event.pointerId !== state.pointerId) return;
  const column = getColumns().find((item) => item.id === state.columnId);
  if (!column) return;
  event.preventDefault();
  const currentWidth = applyColumnWidth(column, state.oldWidth + event.clientX - state.startX);
  resizeState.set({ ...state, currentWidth });
};

const finishColumnResize = (event: PointerEvent): void => {
  const state = resizeState.peek();
  if (!state || event.pointerId !== state.pointerId) return;
  cleanupColumnResize();
  resizeState.set(null);
  const column = getColumns().find((item) => item.id === state.columnId);
  if (column && state.currentWidth !== state.oldWidth) {
    emit("header-dragend", state.currentWidth, state.oldWidth, column.raw, event);
  }
};

const onResizePointerUp = (event: PointerEvent): void => finishColumnResize(event);

const onResizePointerCancel = (event: PointerEvent): void => {
  const state = resizeState.peek();
  if (!state || event.pointerId !== state.pointerId) return;
  const column = getColumns().find((item) => item.id === state.columnId);
  if (column) applyColumnWidth(column, state.oldWidth);
  cleanupColumnResize();
  resizeState.set(null);
};

const onResizePointerDown = (column: TableColumnView, event: Event): void => {
  if (!(event instanceof PointerEvent)) return;
  if (!isColumnResizable(column) || (event.button !== 0 && event.button !== -1)) return;
  event.preventDefault();
  event.stopPropagation();
  cleanupColumnResize();
  const oldWidth = columnSize(column);
  resizeState.set({
    columnId: column.id,
    pointerId: event.pointerId,
    startX: event.clientX,
    oldWidth,
    currentWidth: oldWidth,
  });
  document.addEventListener("pointermove", onResizePointerMove, { passive: false });
  document.addEventListener("pointerup", onResizePointerUp);
  document.addEventListener("pointercancel", onResizePointerCancel);
};

const onResizeKeydown = (column: TableColumnView, event: KeyboardEvent): void => {
  if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
  event.preventDefault();
  event.stopPropagation();
  const oldWidth = columnSize(column);
  const step = event.shiftKey ? 24 : 8;
  const nextWidth = applyColumnWidth(column, oldWidth + (event.key === "ArrowRight" ? step : -step));
  if (nextWidth !== oldWidth) emit("header-dragend", nextWidth, oldWidth, column.raw, event);
};

const resizeLabel = (column: TableColumnView): string =>
  locale.t("table.resizeColumn", { column: column.label || locale.t("table.currentColumn") });

const isColumnResizing = (column: TableColumnView): boolean => resizeState.value?.columnId === column.id;

const stopResizeClick = (event: MouseEvent): void => event.stopPropagation();

const sort = (prop: string, order: SortOrder = "ascending"): void => {
  const normalizedOrder = order === "ascending" || order === "descending" ? order : "";
  sortPropState.set(prop);
  sortOrderState.set(normalizedOrder);
  rebuildRows();
  queueMicrotask(() => {
    if (!canUseFastVirtualBody()) return;
    const scrollTop = Math.max(0, getWrap()?.scrollTop || 0);
    renderFastVirtualBody(virtualWindowAt(scrollTop));
  });
  emit("sort-change", {
    column: getColumns().find((column) => column.prop === prop)?.raw,
    prop,
    order: normalizedOrder,
  });
};

const clearSort = (): void => sort("", "");

const toggleSort = (column: TableColumnView): void => {
  if (!column.sortable) return;
  const orders = sortOrdersOf(column);
  const currentIndex = sortPropState.peek() === column.prop ? orders.indexOf(sortOrderState.peek()) : -1;
  const next = orders[(currentIndex + 1) % orders.length] || "";
  sort(column.prop, next);
};

const sortClass = (column: TableColumnView): Record<string, boolean> => ({
  "is-sorted": sortPropState.value === column.prop && !!sortOrderState.value,
  "is-asc": sortPropState.value === column.prop && sortOrderState.value === "ascending",
  "is-desc": sortPropState.value === column.prop && sortOrderState.value === "descending",
});

const ariaSort = (column: TableColumnView): "ascending" | "descending" | "none" | undefined => {
  if (!column.sortable) return undefined;
  if (sortPropState.value !== column.prop) return "none";
  return sortOrderState.value || "none";
};

const sortLabel = (column: TableColumnView): string => {
  const order = ariaSort(column);
  const state = locale.t(
    order === "ascending" ? "table.ascending" : order === "descending" ? "table.descending" : "table.unsorted",
  );
  return locale.t("table.sortState", { column: column.label, state });
};

const activeFilterColumn = (): TableColumnView | undefined =>
  getColumns().find((column) => filterKeyOf(column) === filterOpenKey.value);

const filterPlacementOf = (column: TableColumnView): FilterPlacement => {
  const placement = String(column.raw.filterPlacement || "bottom-start");
  return FILTER_PLACEMENTS.includes(placement as FilterPlacement) ? (placement as FilterPlacement) : "bottom-start";
};

const filterPanelClass = (column: TableColumnView): ClassValue => [
  "filter-panel",
  String(column.raw.filterClassName || ""),
  { "is-multiple": column.raw.filterMultiple !== false },
];

const isFilterActive = (column: TableColumnView): boolean => filterValuesOf(column).length > 0;

const filterButtonClass = (column: TableColumnView): Record<string, boolean> => ({
  "is-active": isFilterActive(column),
  "is-open": filterOpenKey.value === filterKeyOf(column),
  "has-custom-icon": hasCustomFilterIcon(column),
});

const filterLabel = (column: TableColumnView): string => {
  const count = filterValuesOf(column).length;
  return locale.t(count > 0 ? "table.filterSelected" : "table.filter", {
    column: column.label,
    count,
  });
};

const filterPanelLabel = (column: TableColumnView): string => locale.t("table.filterOptions", { column: column.label });

const isDraftFilterSelected = (value: unknown): boolean =>
  filterDraftState.value.some((item) => filterValueEquals(item, value));

const filterOptionViews = (column: TableColumnView): TableFilterOptionView[] =>
  filterOptionsOf(column).map((option) => ({
    ...option,
    selected: isDraftFilterSelected(option.value),
  }));

const filterChangePayload = (): Record<string, unknown[]> =>
  Object.fromEntries(
    getColumns()
      .filter(hasFilters)
      .map((column) => [filterKeyOf(column), [...filterValuesOf(column)]]),
  );

const setAppliedFilters = (column: TableColumnView, values: unknown[], shouldEmit = true): void => {
  const key = filterKeyOf(column);
  const nextValues = normalizeTableFilterValues(column, values);
  const current = filterValuesState.peek()[key] || [];
  if (filterSignature(current) === filterSignature(nextValues)) return;
  filterValuesState.set({ ...filterValuesState.peek(), [key]: nextValues });
  rebuildRows();
  if (shouldEmit) emit("filter-change", filterChangePayload());
};

const clearFilter = (columnKeys?: string | string[]): void => {
  const requested =
    columnKeys == null ? null : new Set((Array.isArray(columnKeys) ? columnKeys : [columnKeys]).map(String));
  const columns = getColumns().filter(
    (column) => hasFilters(column) && (!requested || requested.has(filterKeyOf(column))),
  );
  if (columns.length === 0 || !columns.some((column) => filterValuesOf(column).length > 0)) return;
  const next = { ...filterValuesState.peek() };
  for (const column of columns) next[filterKeyOf(column)] = [];
  filterValuesState.set(next);
  if (activeFilterColumn() && columns.includes(activeFilterColumn()!)) filterDraftState.set([]);
  rebuildRows();
  emit("filter-change", filterChangePayload());
};

const getFilterTrigger = (key = filterOpenKey.peek()): HTMLButtonElement | null =>
  Array.from(host.shadowRoot?.querySelectorAll<HTMLButtonElement>("[data-filter-trigger]") || []).find(
    (item) => item.dataset.filterKey === key,
  ) || null;

const getFilterPanel = (): HTMLElement | null => host.shadowRoot?.querySelector<HTMLElement>(".filter-panel") || null;

const dismissibleFilterOverlay = useDismissibleOverlay({
  kind: "table-filter",
  containers: () => [host, getFilterPanel()],
  closeOnEscape: () => Boolean(filterOpenKey.value),
  closeOnOutside: () => Boolean(filterOpenKey.value),
  outsideEvent: "click",
  outsideCapture: true,
  onRequestClose: (reason) => closeFilterPanel(reason === "escape"),
});

const updateFilterOverlayPosition = (): void => {
  if (typeof window === "undefined") return;
  const column = activeFilterColumn();
  const trigger = getFilterTrigger();
  const panel = getFilterPanel();
  if (!column || !trigger || !panel) return;
  const anchorRect = trigger.getBoundingClientRect();
  const panelRect = panel.getBoundingClientRect();
  const viewport = window.visualViewport;
  const position = computeAnchoredPosition(
    anchorRect,
    { width: Math.max(panelRect.width, 184), height: panelRect.height },
    {
      width: viewport?.width || window.innerWidth,
      height: viewport?.height || window.innerHeight,
      offsetLeft: viewport?.offsetLeft || 0,
      offsetTop: viewport?.offsetTop || 0,
    },
    { placement: filterPlacementOf(column), offset: [0, 7], padding: 8, flip: true },
  );
  filterOverlayStyle.set({
    position: "fixed",
    left: `${position.left}px`,
    top: `${position.top}px`,
  });
};

const requestFilterOverlayUpdate = (): void => {
  if (typeof window === "undefined") return;
  if (filterOverlayFrame) window.cancelAnimationFrame(filterOverlayFrame);
  filterOverlayFrame = window.requestAnimationFrame(() => {
    filterOverlayFrame = 0;
    updateFilterOverlayPosition();
  });
};

const connectFilterOverlay = (): void => {
  cleanupFilterOverlay();
  if (!filterOpenKey.peek() || typeof window === "undefined") return;
  const observer = typeof ResizeObserver !== "undefined" ? new ResizeObserver(requestFilterOverlayUpdate) : undefined;
  const trigger = getFilterTrigger();
  const panel = getFilterPanel();
  if (trigger) observer?.observe(trigger);
  if (panel) observer?.observe(panel);
  window.addEventListener("resize", requestFilterOverlayUpdate, { passive: true });
  window.addEventListener("scroll", requestFilterOverlayUpdate, { passive: true, capture: true });
  window.visualViewport?.addEventListener("resize", requestFilterOverlayUpdate, { passive: true });
  window.visualViewport?.addEventListener("scroll", requestFilterOverlayUpdate, { passive: true });
  cleanupFilterOverlay = () => {
    observer?.disconnect();
    window.removeEventListener("resize", requestFilterOverlayUpdate);
    window.removeEventListener("scroll", requestFilterOverlayUpdate, { capture: true });
    window.visualViewport?.removeEventListener("resize", requestFilterOverlayUpdate);
    window.visualViewport?.removeEventListener("scroll", requestFilterOverlayUpdate);
  };
};

const syncFilterTopLayer = (): void => {
  const panel = getFilterPanel() as (HTMLElement & { showPopover?: () => void }) | null;
  try {
    panel?.showPopover?.();
  } catch {
    // The panel may be replaced while the reactive template updates.
  }
  requestFilterOverlayUpdate();
};

const openFilterPanel = (column: TableColumnView): void => {
  const key = filterKeyOf(column);
  filterOpenKey.set(key);
  filterDraftState.set([...(filterValuesState.peek()[key] || [])]);
  dismissibleFilterOverlay.activate();
  queueMicrotask(() => {
    syncFilterTopLayer();
    connectFilterOverlay();
    getFilterPanel()?.querySelector<HTMLButtonElement>(".filter-option")?.focus();
  });
};

function closeFilterPanel(returnFocus = false): void {
  const key = filterOpenKey.peek();
  dismissibleFilterOverlay.deactivate();
  const panel = getFilterPanel() as (HTMLElement & { hidePopover?: () => void }) | null;
  try {
    panel?.hidePopover?.();
  } catch {
    // A disconnected popover is already closed by the browser.
  }
  filterOpenKey.set("");
  filterDraftState.set([]);
  cleanupFilterOverlay();
  if (returnFocus) getFilterTrigger(key)?.focus();
}

const toggleFilterPanel = (column: TableColumnView): void => {
  if (filterOpenKey.peek() === filterKeyOf(column)) closeFilterPanel();
  else openFilterPanel(column);
};

const toggleFilterDraft = (column: TableColumnView, value: unknown): void => {
  if (column.raw.filterMultiple === false) {
    setAppliedFilters(column, [value]);
    closeFilterPanel(true);
    return;
  }
  const next = [...filterDraftState.peek()];
  const index = next.findIndex((item) => filterValueEquals(item, value));
  if (index >= 0) next.splice(index, 1);
  else next.push(value);
  filterDraftState.set(next);
};

const applyFilterDraft = (column: TableColumnView): void => {
  setAppliedFilters(column, filterDraftState.peek());
  closeFilterPanel(true);
};

const resetFilter = (column: TableColumnView): void => {
  setAppliedFilters(column, []);
  closeFilterPanel(true);
};

const onFilterTriggerKeydown = (column: TableColumnView, event: KeyboardEvent): void => {
  if (event.key === "Enter" || event.key === " " || event.key === "ArrowDown") {
    event.preventDefault();
    openFilterPanel(column);
  } else if (event.key === "Escape" && filterOpenKey.peek() === filterKeyOf(column)) {
    event.preventDefault();
    dismissibleFilterOverlay.claim(event);
    closeFilterPanel(true);
  }
};

const onFilterPanelKeydown = (event: KeyboardEvent): void => {
  if (event.key !== "Escape") return;
  event.preventDefault();
  dismissibleFilterOverlay.claim(event);
  closeFilterPanel(true);
};

const summaryCells = (): string[] => {
  const columns = getColumns();
  const data = rowsState.value.map((row) => row.raw);
  if (typeof props.summaryMethod === "function") {
    try {
      const values = props.summaryMethod({
        columns: columns.map((column) => column.raw as TableColumn),
        data,
      });
      return Array.isArray(values) ? values.map((value) => String(value ?? "")) : [];
    } catch {
      return [];
    }
  }
  const labelIndex = Math.max(
    0,
    columns.findIndex((column) => column.type === "default"),
  );
  return columns.map((column, index) => {
    if (index === labelIndex) return String(props.sumText || locale.t("table.sum"));
    const values = data.map((row) => row[column.prop]);
    if (values.length === 0 || values.some((value) => typeof value !== "number")) return "";
    return String(values.reduce<number>((sum, value) => sum + Number(value), 0));
  });
};

const summaryCellClass = (index: number): Record<string, boolean> => {
  const column = getColumns()[index];
  return column ? baseCellClass(column) : {};
};

const summaryCellStyle = (index: number): StyleValue => {
  const column = getColumns()[index];
  return column ? headerCellStyle(column) : {};
};

const getWrap = (): HTMLElement | null =>
  wrapRef.value ?? host.shadowRoot?.querySelector<HTMLElement>(".table-wrap") ?? null;

interface FastVirtualRowElement extends HTMLTableRowElement {
  __row?: TableRowView;
}

interface FastVirtualCellElement extends HTMLTableCellElement {
  __column?: TableColumnView;
}

const classNamesOf = (value: unknown): string[] => {
  if (!value) return [];
  if (typeof value === "string") return value.split(/\s+/).filter(Boolean);
  if (Array.isArray(value)) return value.flatMap(classNamesOf);
  if (typeof value === "object") {
    return Object.entries(value as Record<string, unknown>)
      .filter(([, enabled]) => Boolean(enabled))
      .map(([name]) => name);
  }
  return [];
};

const canUseFastVirtualBody = (): boolean =>
  isVirtualized() &&
  typeof props.rowHeight !== "function" &&
  !props.showSummary &&
  typeof props.spanMethod !== "function" &&
  typeof props.rowClassName !== "function" &&
  typeof props.rowStyle !== "function" &&
  typeof props.cellClassName !== "function" &&
  typeof props.cellStyle !== "function" &&
  getColumns().every(
    (column) =>
      (column.type === "default" || column.type === "index") &&
      typeof column.raw.formatter !== "function" &&
      typeof column.raw.renderCell !== "function" &&
      !hasCellTooltip(column),
  );

const createFastVirtualCell = (): FastVirtualCellElement => {
  const cell = document.createElement("td") as FastVirtualCellElement;
  const content = document.createElement("span");
  content.className = "cell-text rendered-content";
  cell.appendChild(content);
  cell.addEventListener("mouseenter", (event) => {
    const row = (cell.parentElement as FastVirtualRowElement | null)?.__row;
    if (row && cell.__column) onCellMouseEnter(row, cell.__column, event);
  });
  cell.addEventListener("mouseleave", (event) => {
    const row = (cell.parentElement as FastVirtualRowElement | null)?.__row;
    if (row && cell.__column) onCellMouseLeave(row, cell.__column, event);
  });
  cell.addEventListener("focusin", (event) => {
    const row = (cell.parentElement as FastVirtualRowElement | null)?.__row;
    if (row && cell.__column) onCellFocusIn(row, cell.__column, event);
  });
  cell.addEventListener("focusout", (event) => {
    if (cell.__column) onCellFocusOut(cell.__column, event);
  });
  cell.addEventListener("keydown", onCellKeydown);
  cell.addEventListener("click", (event) => {
    const row = (cell.parentElement as FastVirtualRowElement | null)?.__row;
    if (row && cell.__column) onCellClick(row, cell.__column, event);
  });
  cell.addEventListener("dblclick", (event) => {
    const row = (cell.parentElement as FastVirtualRowElement | null)?.__row;
    if (row && cell.__column) onCellDblClick(row, cell.__column, event);
  });
  cell.addEventListener("contextmenu", (event) => {
    const row = (cell.parentElement as FastVirtualRowElement | null)?.__row;
    if (row && cell.__column) onCellContextMenu(row, cell.__column, event);
  });
  return cell;
};

const createFastVirtualRow = (): FastVirtualRowElement => {
  const rowElement = document.createElement("tr") as FastVirtualRowElement;
  rowElement.addEventListener("click", (event) => {
    if (rowElement.__row) onRowClick(rowElement.__row, event);
  });
  rowElement.addEventListener("dblclick", (event) => {
    if (rowElement.__row) onRowDblClick(rowElement.__row, event);
  });
  rowElement.addEventListener("contextmenu", (event) => {
    if (rowElement.__row) onRowContextMenu(rowElement.__row, event);
  });
  return rowElement;
};

const updateFastVirtualRow = (rowElement: FastVirtualRowElement, row: TableRowView): void => {
  rowElement.__row = row;
  rowElement.dataset.virtualKey = row.key;
  rowElement.dataset.rowKey = row.key;
  rowElement.className = classNamesOf(rowClass(row)).join(" ");
  rowElement.removeAttribute("style");
  Object.assign(rowElement.style, rowStyle(row));

  const columns = getColumns();
  while (rowElement.children.length < columns.length) rowElement.appendChild(createFastVirtualCell());
  while (rowElement.children.length > columns.length) rowElement.lastElementChild?.remove();
  columns.forEach((column, columnIndex) => {
    const cell = rowElement.children[columnIndex] as FastVirtualCellElement;
    cell.__column = column;
    cell.dataset.columnIndex = String(columnIndex);
    cell.className = classNamesOf(cellClass(column, row)).join(" ");
    cell.removeAttribute("style");
    Object.assign(cell.style, mergedCellStyle(column, row));
    const content = cell.firstElementChild as HTMLElement;
    content.textContent = getCell(row, column);
  });
};

const renderFastVirtualBody = (range: VirtualWindow): void => {
  const body = host.shadowRoot?.querySelector<HTMLTableSectionElement>("tbody");
  if (!body) return;
  const existing = new Map(
    Array.from(body.querySelectorAll<FastVirtualRowElement>("tr[data-virtual-key]")).map(
      (row) => [String(row.dataset.virtualKey), row] as const,
    ),
  );
  const rows = rowsState.peek().slice(range.start, range.end);
  const nextElements = rows.map((row) => {
    const rowElement = existing.get(row.key) ?? createFastVirtualRow();
    updateFastVirtualRow(rowElement, row);
    return rowElement;
  });
  body.style.height = `${range.totalSize}px`;
  body.style.paddingBlockStart = `${range.offset}px`;
  body.replaceChildren(...nextElements);
  fastVirtualRangeKey = `${range.start}:${range.end}:${range.offset}:${range.totalSize}`;
};

const virtualRangeKey = (range: VirtualWindow): string =>
  `${range.start}:${range.end}:${range.offset}:${range.totalSize}`;

const flushScrollEvent = (): void => {
  scrollEventQueued = false;
  if (pendingScrollDetail) {
    emit("scroll", pendingScrollDetail);
    pendingScrollDetail = null;
  }
};

const onScroll = (event: Event): void => {
  const target = event.currentTarget as HTMLElement;
  if (isVirtualized()) closeTooltip();
  else requestTooltipPositionUpdate();
  if (isVirtualized()) {
    const next = virtualWindowAt(target.scrollTop);
    // Table and VirtualList share the same fixed-row window engine and update
    // the visible range before the browser can paint a newly-scrolled viewport.
    if (canUseFastVirtualBody()) {
      if (fastVirtualRangeKey !== virtualRangeKey(next)) renderFastVirtualBody(next);
    } else {
      const normalizedScrollTop = Math.max(0, target.scrollTop);
      if (virtualScrollTop.peek() !== normalizedScrollTop) virtualScrollTop.set(normalizedScrollTop);
    }
  }
  pendingScrollDetail = { scrollLeft: target.scrollLeft, scrollTop: target.scrollTop };
  if (scrollEventQueued) return;
  scrollEventQueued = true;
  queueMicrotask(flushScrollEvent);
};

const scrollTableTo = (optionsOrX: ScrollToOptions | number, y = 0): void => {
  const wrap = getWrap();
  if (!wrap) return;
  if (typeof optionsOrX === "number") {
    wrap.scrollLeft = Math.max(0, optionsOrX);
    wrap.scrollTop = Math.max(0, Number(y) || 0);
    return;
  }
  if (typeof wrap.scrollTo === "function") wrap.scrollTo(optionsOrX);
  else {
    if (optionsOrX.left != null) wrap.scrollLeft = Math.max(0, Number(optionsOrX.left) || 0);
    if (optionsOrX.top != null) wrap.scrollTop = Math.max(0, Number(optionsOrX.top) || 0);
  }
};

const setScrollTop = (value: number): void => {
  const wrap = getWrap();
  if (wrap) wrap.scrollTop = Math.max(0, Number(value) || 0);
};

const setScrollLeft = (value: number): void => {
  const wrap = getWrap();
  if (wrap) wrap.scrollLeft = Math.max(0, Number(value) || 0);
};

const doLayout = (): void => {
  // Native table layout updates synchronously; touching the measured width makes
  // this method useful to callers that schedule work after a container resize.
  void getWrap()?.offsetWidth;
};

onMounted(() => {
  window.addEventListener("resize", requestTooltipPositionUpdate, { passive: true });
  window.addEventListener("scroll", requestTooltipPositionUpdate, { passive: true, capture: true });
  window.visualViewport?.addEventListener("resize", requestTooltipPositionUpdate, { passive: true });
  window.visualViewport?.addEventListener("scroll", requestTooltipPositionUpdate, { passive: true });
});

onUnmounted(() => {
  window.removeEventListener("resize", requestTooltipPositionUpdate);
  window.removeEventListener("scroll", requestTooltipPositionUpdate, { capture: true });
  window.visualViewport?.removeEventListener("resize", requestTooltipPositionUpdate);
  window.visualViewport?.removeEventListener("scroll", requestTooltipPositionUpdate);
  cleanupColumnResize();
  cleanupFilterOverlay();
  cleanupTooltipScrollTracking();
  cleanupTooltipScrollTracking = (): void => {};
  closeTooltip();
  if (filterOverlayFrame && typeof window !== "undefined") {
    window.cancelAnimationFrame(filterOverlayFrame);
  }
  if (tooltipPositionFrame && typeof window !== "undefined") {
    window.cancelAnimationFrame(tooltipPositionFrame);
  }
  scrollEventQueued = false;
  pendingScrollDetail = null;
  if (selectionCommitFrame && typeof window !== "undefined") window.cancelAnimationFrame(selectionCommitFrame);
  if (selectionCommitTimer && typeof window !== "undefined") window.clearTimeout(selectionCommitTimer);
  selectionCommitFrame = 0;
  selectionCommitTimer = 0;
  pendingSelectedKeys = null;
});

defineExpose({
  clearSelection,
  toggleRowSelection,
  toggleAllSelection,
  toggleRowExpansion,
  updateKeyChildren,
  getSelectionRows,
  setCurrentRow,
  sort,
  clearSort,
  clearFilter,
  doLayout,
  scrollTableTo,
  setScrollTop,
  setScrollLeft,
});

defineStyle(styles);

const Table = defineHtml<TableProps>(`
  <div class="table-root" :class=${tableClass()}>
    <div v-if=${props.title} class="table-title" part="title">${props.title}</div>
    <div ref="wrap" class="table-wrap" part="scroll" :style=${wrapStyle()} @scroll=${onScroll}>
      <table part="table" :style=${tableStyle()} :role=${isTreeState ? "treegrid" : null}
        :aria-label=${props.title || null}>
        <colgroup>
          <col v-for="column in getColumns()" :key="column.id" :style="colStyle(column)" />
        </colgroup>
        <thead v-if=${props.showHeader} part="header">
          <tr :class=${headerRowClass()} :style=${headerRowStyle()}>
            <th v-for="column in getColumns()" :key="column.id" :data-column-index="columnIndexOf(column)"
              :aria-sort="ariaSort(column)" :class="headerCellClass(column)" :style="headerCellStyle(column)"
              @click="onHeaderClick(column, $event)" @contextmenu="onHeaderContextMenu(column, $event)">
              <button v-if="column.type === 'selection'" type="button" class="table-checkbox"
                :class=${{ "is-checked": isAllSelected(), "is-indeterminate": isIndeterminate() }}
                :disabled=${selectableRows().length === 0}
                :aria-checked=${isIndeterminate() ? "mixed" : String(isAllSelected())}
                @click.stop=${onToggleAllSelection()} :aria-label=${locale.t("table.selectAll")}>
                <span class="checkbox-mark"></span>
              </button>
              <span v-else class="header-content">
                <button v-if="column.sortable" type="button" class="sort-button" :class="sortClass(column)"
                  :aria-label="sortLabel(column)" @click="toggleSort(column)">
                  <span class="rendered-content" v-elf-table-content="renderHeaderValue(column)"></span>
                  <span class="sort-icon"></span>
                </button>
                <span v-else class="rendered-content" v-elf-table-content="renderHeaderValue(column)"></span>
                <button v-if="hasFilters(column)" type="button" class="filter-trigger" :class="filterButtonClass(column)"
                  data-filter-trigger :data-filter-key="filterKeyOf(column)" aria-haspopup="listbox"
                  :aria-expanded="String(filterOpenKey === filterKeyOf(column))" :aria-label="filterLabel(column)"
                  @click.stop="toggleFilterPanel(column)" @keydown="onFilterTriggerKeydown(column, $event)">
                  <span class="filter-icon" aria-hidden="true" v-elf-table-content="renderFilterIconValue(column)"></span>
                </button>
                <div v-if="filterOpenKey === filterKeyOf(column)" popover="manual" :class="filterPanelClass(column)"
                  :style="filterOverlayStyle.value" role="listbox"
                  :aria-multiselectable="String(column.raw.filterMultiple !== false)"
                  :aria-label="filterPanelLabel(column)" @keydown=${onFilterPanelKeydown}>
                  <div class="filter-options">
                    <button v-for="option in filterOptionViews(column)" :key="filterValueKey(option.value)" type="button"
                      class="filter-option" :class='{ "is-selected": option.selected }' role="option"
                      :aria-selected="String(option.selected)" @click="toggleFilterDraft(column, option.value)">
                      <span class="filter-check" aria-hidden="true"></span>
                      <span>{{ option.text }}</span>
                    </button>
                  </div>
                  <div class="filter-actions">
                    <button type="button" @click="resetFilter(column)">${locale.t("common.reset")}</button>
                    <button v-if="column.raw.filterMultiple !== false" type="button" class="is-primary"
                      @click="applyFilterDraft(column)">
                      ${locale.t("common.confirm")}
                    </button>
                  </div>
                </div>
              </span>
              <span v-if="isColumnResizable(column)" class="column-resizer"
                :class='{ "is-active": isColumnResizing(column) }' role="separator" tabindex="0"
                aria-orientation="vertical" :aria-label="resizeLabel(column)" :aria-valuemin="columnMinWidth(column)"
                :aria-valuenow="columnSize(column)" @pointerdown="onResizePointerDown(column, $event)"
                @keydown="onResizeKeydown(column, $event)" @click.stop=${stopResizeClick}></span>
            </th>
          </tr>
        </thead>
        <tbody part="body" :style=${virtualBodyStyle()}>
          <template v-for="row in getRenderRows()" :key="row.key">
            <tr :data-row-key="row.key" :class="rowClass(row)" :style="rowStyle(row)"
              :aria-level="isTreeState ? String(row.level + 1) : null"
              :aria-expanded="row.hasChildren ? String(isExpanded(row)) : null" @click="onRowClick(row, $event)"
              @dblclick="onRowDblClick(row, $event)" @contextmenu="onRowContextMenu(row, $event)">
              <template v-for="cell in bodyCells(row)" :key="cell.column.id">
                <td v-if="!cell.hidden" :rowspan="cell.rowspan" :colspan="cell.colspan"
                  :data-column-index="cell.columnIndex" :class="cellClass(cell.column, row)"
                  :style="mergedCellStyle(cell.column, row)" :tabindex="hasCellTooltip(cell.column) ? 0 : null"
                  :aria-describedby="tooltipDescriptionId(row, cell.column)"
                  @mouseenter="onCellMouseEnter(row, cell.column, $event)"
                  @mouseleave="onCellMouseLeave(row, cell.column, $event)"
                  @focusin="onCellFocusIn(row, cell.column, $event)" @focusout="onCellFocusOut(cell.column, $event)"
                  @keydown=${onCellKeydown} @click="onCellClick(row, cell.column, $event)"
                  @dblclick="onCellDblClick(row, cell.column, $event)"
                  @contextmenu="onCellContextMenu(row, cell.column, $event)">
                  <button v-if="cell.column.type === 'selection'" type="button" class="table-checkbox"
                    :class="{ 'is-checked': isSelected(row), 'is-indeterminate': isRowIndeterminate(row) }"
                    :disabled="!isSelectable(row)"
                    :aria-checked='isRowIndeterminate(row) ? "mixed" : String(isSelected(row))'
                    @click.stop="onToggleRowSelection(row)" :aria-label=${locale.t("table.selectRow")}>
                    <span class="checkbox-mark"></span>
                  </button>
                  <button v-else-if="cell.column.type === 'expand'" type="button" class="expand-toggle"
                    :class="{ 'is-expanded': isExpanded(row) }"
                    @click.stop="row.hasChildren ? toggleTreeRow(row) : toggleDetailRowExpansion(row)"
                    :aria-label=${locale.t("table.expandRow")}>
                    <span class="expand-icon"></span>
                  </button>
                  <span v-else-if="cell.column.type === 'actions'" class="action-group">
                    <button v-for="action in getActions(row, cell.column)" :key="action.label" type="button"
                      class="action-button" :class="actionClass(action)" :disabled="action.disabled"
                      @click.stop="invokeAction(action, row)">
                      {{ action.label }}
                    </button>
                  </span>
                  <span v-else-if="isTreeCell(row, cell.columnIndex)" class="tree-cell" :style="treeCellStyle(row)">
                    <button v-if="row.hasChildren" type="button" class="tree-toggle"
                      :class="{ 'is-expanded': isExpanded(row), 'is-loading': isTreeLoading(row) }"
                      :data-tree-key="row.key" :disabled="isTreeLoading(row)" :aria-expanded="String(isExpanded(row))"
                      :aria-label="treeToggleLabel(row)" @click.stop="toggleTreeRow(row)"
                      @keydown="onTreeToggleKeydown(row, $event)">
                      <span class="tree-toggle-icon" aria-hidden="true"></span>
                    </button>
                    <span v-else class="tree-toggle-spacer" aria-hidden="true"></span>
                    <span class="cell-text rendered-content"
                      v-elf-table-content="renderCellValue(row, cell.column)"></span>
                  </span>
                  <span v-else class="cell-text rendered-content"
                    v-elf-table-content="renderCellValue(row, cell.column)"></span>
                </td>
              </template>
            </tr>
            <tr v-if="hasExpandColumn() && !row.hasChildren && isExpanded(row)" class="expand-row">
              <td :colspan=${getColumns().length}>
                <div class="expand-content rendered-content" v-elf-table-content="getExpandContent(row)"></div>
              </td>
            </tr>
          </template>
        </tbody>
        <tfoot v-if=${props.showSummary} part="footer">
          <tr class="summary-row">
            <td v-for="(value, index) in summaryCells()" :key="index" :class="summaryCellClass(index)"
              :style="summaryCellStyle(index)">
              <span class="summary-text">{{ value }}</span>
            </td>
          </tr>
        </tfoot>
      </table>
      <div v-if=${getRows().length === 0} class="empty" part="empty">
        <slot name="empty">${props.emptyText || locale.t("table.empty")}</slot>
      </div>
      <div class="append">
        <slot name="append"></slot>
      </div>
    </div>
    <div v-if=${tooltipOpenState} :id=${tooltipId} class="table-tooltip" popover="manual"
      :data-placement=${tooltipPlacementState} :style="tooltipStyleState.value" role="tooltip">${tooltipTextState}</div>
    <div v-if=${props.loading} class="loading">${locale.t("table.loading")}</div>
  </div>
`);

type SortOrder = "" | "ascending" | "descending";
type FilterPlacement = "bottom" | "bottom-start" | "bottom-end" | "top" | "top-start" | "top-end";
type ClassValue = string | Record<string, boolean> | Array<string | Record<string, boolean>>;
type StyleValue = string | Record<string, string | number>;

const FILTER_PLACEMENTS: FilterPlacement[] = ["bottom", "bottom-start", "bottom-end", "top", "top-start", "top-end"];

interface TableColumnView {
  id: string;
  prop: string;
  label: string;
  type: "default" | "selection" | "index" | "expand" | "actions";
  width: string;
  minWidth: string;
  align: "left" | "center" | "right";
  headerAlign: "left" | "center" | "right";
  sortable: boolean | "custom";
  fixed: "" | "left" | "right";
  fixedOffset: string;
  fixedLast: boolean;
  raw: Record<string, unknown>;
}

interface TableRowView {
  key: string;
  index: number;
  raw: Record<string, unknown>;
  level: number;
  parentKey: string;
  path: string[];
  hasChildren: boolean;
}

interface TableSelectionSummaryView {
  selectableRows: TableRowView[];
  allSelected: boolean;
  indeterminate: boolean;
}

interface TableRowCollectionView {
  resolve(target: unknown): TableRowView | undefined;
  normalizeSelection(
    keys: readonly string[],
    checkStrictly: boolean,
    isSelectable: (row: TableRowView) => boolean,
  ): string[];
  selectionSummary(
    selectedKeys: readonly string[],
    isSelectable: (row: TableRowView) => boolean,
  ): TableSelectionSummaryView;
  isRowIndeterminate(
    row: TableRowView,
    selectedKeys: readonly string[],
    checkStrictly: boolean,
    isSelectable: (row: TableRowView) => boolean,
  ): boolean;
  toggleRowSelection(
    keys: readonly string[],
    row: TableRowView,
    selected: boolean | undefined,
    ignoreSelectable: boolean,
    checkStrictly: boolean,
    isSelectable: (row: TableRowView) => boolean,
  ): string[];
  toggleAllSelection(
    selectedKeys: readonly string[],
    isSelectable: (row: TableRowView) => boolean,
    selectOnIndeterminate: boolean,
  ): string[];
  selectedRows(selectedKeys: readonly string[]): TableRow[];
}

interface TableActionView {
  label: string;
  type: "primary" | "danger" | "default";
  disabled: boolean;
  raw: Record<string, unknown>;
}

interface TableSpanView {
  rowspan: number;
  colspan: number;
  hidden: boolean;
}

interface TableFilterOptionView extends TableFilterOption {
  selected: boolean;
}

interface TableResizeState {
  columnId: string;
  pointerId: number;
  startX: number;
  oldWidth: number;
  currentWidth: number;
}

interface TableCellView extends TableSpanView {
  column: TableColumnView;
  columnIndex: number;
}

export { Table };
