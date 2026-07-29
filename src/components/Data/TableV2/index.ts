import {
  defineEmits,
  defineExpose,
  defineHtml,
  defineProps,
  defineStyle,
  onMounted,
  useComputed,
  useEffect,
  useHost,
  useComponents,
  useShallowRef,
} from "@elfui/core";

import { buildTableTreeRows, type TableTreeRow } from "../table-tree-model";
import { Table } from "../Table/index";
import type {
  TableCellContext,
  TableColumn,
  TableRenderValue,
  TableRow,
  TableScrollDetail,
} from "../Table/types";
import { useLocaleProvider } from "../../Providers/context";
import styles from "./style.scss?inline";
import type {
  TableV2Column,
  TableV2Expose,
  TableV2Props,
  TableV2RowHeight,
  TableV2RowsRenderedDetail,
  TableV2Slots,
  TableV2SortBy,
} from "./types";

export type {
  TableV2CellContext,
  TableV2Column,
  TableV2Element,
  TableV2Expose,
  TableV2HeaderContext,
  TableV2Props,
  TableV2RowHeight,
  TableV2RowExpandDetail,
  TableV2RowsRenderedDetail,
  TableV2Slots,
  TableV2SortBy,
} from "./types";

const props = defineProps<TableV2Props>({
  data: { type: Array, default: () => [] },
  fixedData: { type: Array, default: () => [] },
  columns: { type: Array, default: () => [] },
  rowKey: { type: [String, Function], default: "id" },
  width: { type: [String, Number], default: "100%" },
  height: { type: [String, Number], default: 400 },
  rowHeight: { type: [Number, Function], default: 44 },
  headerHeight: { type: Number, default: 44 },
  footerHeight: { type: Number, default: 0 },
  overscan: { type: Number, default: 6 },
  expandColumnKey: { type: String, default: "" },
  expandedRowKeys: { type: Array, default: undefined },
  defaultExpandedRowKeys: { type: Array, default: () => [] },
  indentSize: { type: Number, default: 12 },
  sortBy: { type: Object, default: undefined },
  fixed: { type: Boolean, default: true },
  stripe: { type: Boolean, default: false },
  border: { type: Boolean, default: false },
  loading: { type: Boolean, default: false },
  emptyText: { type: String, default: "" },
});

const emit = defineEmits<{
  scroll: [detail: TableScrollDetail];
  "column-sort": [detail: TableV2SortBy];
  "rows-rendered": [detail: TableV2RowsRenderedDetail];
  "end-reached": [distance: number];
  "expanded-rows-change": [keys: string[]];
  "row-expand": [rowData: TableRow, expanded: boolean];
  "row-click": [row: TableRow, column: TableColumn, event: Event];
}>();

useComponents({ "elf-table": Table });

type InnerTable = HTMLElement & TableV2Expose;
const projectedRowView = Symbol("elf-table-v2-row-view");
type ProjectedRow = TableRow & { [projectedRowView]?: TableTreeRow };
const host = useHost();
const locale = useLocaleProvider();

const expandedState = useShallowRef<string[]>([]);
let reachedEnd = false;
let expansionInitialized = false;

const innerTable = (): InnerTable | null =>
  host.shadowRoot?.querySelector<InnerTable>("elf-table[data-scroll-table]") ?? null;
const fixedTable = (): InnerTable | null =>
  host.shadowRoot?.querySelector<InnerTable>("elf-table[data-fixed-table]") ?? null;

const normalizeKeys = (value: unknown): string[] =>
  Array.isArray(value)
    ? Array.from(
        new Set(
          value
            .map((item: unknown) => String(item))
            .filter((key: string) => Boolean(key)),
        ),
      )
    : [];

const valueAtPath = (row: TableRow, path: string): unknown =>
  path.split(".").reduce<unknown>((value: unknown, key: string) => {
    if (!value || typeof value !== "object") return undefined;
    return (value as Record<string, unknown>)[key];
  }, row);

const rowKeyOf = (row: TableRow, fallback: string): string => {
  if (typeof props.rowKey === "function") {
    try {
      return String(props.rowKey(row));
    } catch {
      return fallback;
    }
  }
  return String(valueAtPath(row, String(props.rowKey || "id")) ?? fallback);
};

const childrenOf = (row: TableRow): TableRow[] =>
  Array.isArray(row.children) ? (row.children as TableRow[]) : [];

const resolvedExpandedKeys = (): string[] =>
  Array.isArray(props.expandedRowKeys) ? normalizeKeys(props.expandedRowKeys) : expandedState.value;

const expansionView = useComputed(() => {
  const tree = buildTableTreeRows({
    roots: Array.isArray(props.data) ? props.data : [],
    expandedKeys: new Set(resolvedExpandedKeys()),
    childrenOf,
    keyOf: rowKeyOf,
    isExpandable: (_row: TableRow, _key: string, children: TableRow[]) => children.length > 0,
    sortRows: (rows: TableRow[]) => rows,
  });
  const projectedRows = tree.visible.map((row: TableTreeRow): ProjectedRow => {
    const projected = { ...row.raw } as ProjectedRow;
    delete projected.children;
    Object.defineProperty(projected, projectedRowView, { value: row, configurable: true });
    return projected;
  });
  return {
    tree,
    byKey: new Map<string, TableTreeRow>(tree.visible.map((row: TableTreeRow) => [row.key, row])),
    projectedRows,
  };
});

const rowViewOf = (row: TableRow): TableTreeRow | undefined =>
  (row as ProjectedRow)[projectedRowView] ??
  expansionView.value.byKey.get(rowKeyOf(row, ""));

const rawRowOf = (row: TableRow): TableRow => rowViewOf(row)?.raw ?? row;

const innerRowKey = (row: TableRow): string => rowViewOf(row)?.key ?? rowKeyOf(row, "");

const cssSize = (value: string | number): string =>
  typeof value === "number" || /^\d+(?:\.\d+)?$/.test(String(value)) ? `${value}px` : String(value);

const baseCellValue = (column: TableV2Column, context: { row: TableRow; rowIndex: number }): TableRenderValue => {
  const row = rawRowOf(context.row);
  if (!column.cellRenderer) return row[column.dataKey || column.key] as TableRenderValue;
  return column.cellRenderer({
    cellData: row[column.dataKey || column.key],
    rowData: row,
    rowIndex: context.rowIndex,
    column,
    columnIndex: (props.columns || []).indexOf(column),
  });
};

const focusExpansionToggle = (key: string): void => {
  queueMicrotask(() => {
    innerTable()
      ?.shadowRoot?.querySelector<HTMLButtonElement>(
        `[part~="table-v2-expand-toggle"][data-row-key="${CSS.escape(key)}"]`,
      )
      ?.focus();
  });
};

const toggleRowExpansion = (row: TableTreeRow, expanded?: boolean): void => {
  if (!row.hasChildren) return;
  const current = resolvedExpandedKeys();
  const currentSet = new Set(current);
  const shouldExpand = expanded ?? !currentSet.has(row.key);
  if (shouldExpand) currentSet.add(row.key);
  else currentSet.delete(row.key);
  const validKeys = new Set(expansionView.value.tree.all.map((item: TableTreeRow) => item.key));
  const next = Array.from(currentSet).filter((key: string) => validKeys.has(key));
  if (!Array.isArray(props.expandedRowKeys)) expandedState.set(next);
  emit("expanded-rows-change", next);
  emit("row-expand", row.raw, shouldExpand);
  focusExpansionToggle(row.key);
};

const expansionControl = (row: TableTreeRow): HTMLElement => {
  const control = document.createElement(row.hasChildren ? "button" : "span");
  control.setAttribute("part", row.hasChildren ? "table-v2-expand-toggle" : "table-v2-expand-spacer");
  control.style.setProperty("--elf-table-v2-level", String(row.level));
  control.style.setProperty("--elf-table-v2-indent-size", `${Math.max(0, Number(props.indentSize) || 0)}px`);
  if (!row.hasChildren) {
    control.setAttribute("aria-hidden", "true");
    return control;
  }

  const button = control as HTMLButtonElement;
  const expanded = resolvedExpandedKeys().includes(row.key);
  button.type = "button";
  button.dataset.rowKey = row.key;
  button.setAttribute("aria-expanded", String(expanded));
  button.setAttribute("aria-label", locale.t(expanded ? "table.collapseChildren" : "table.expandChildren"));
  const icon = document.createElement("span");
  icon.setAttribute("part", "table-v2-expand-icon");
  icon.setAttribute("aria-hidden", "true");
  icon.style.transform = expanded ? "rotate(45deg)" : "rotate(-45deg)";
  button.append(icon);
  button.addEventListener("click", (event: MouseEvent) => {
    event.stopPropagation();
    toggleRowExpansion(row);
  });
  button.addEventListener("keydown", (event: KeyboardEvent) => {
    if (event.key === "ArrowRight" && !expanded) {
      event.preventDefault();
      event.stopPropagation();
      toggleRowExpansion(row, true);
    } else if (event.key === "ArrowLeft" && expanded) {
      event.preventDefault();
      event.stopPropagation();
      toggleRowExpansion(row, false);
    }
  });
  return button;
};

const renderCellValue = (
  column: TableV2Column,
  context: { row: TableRow; rowIndex: number },
): TableRenderValue => {
  const value = baseCellValue(column, context);
  if (!props.expandColumnKey || column.key !== props.expandColumnKey) return value;
  const row = rowViewOf(context.row);
  if (!row) return value;
  const values = Array.isArray(value) ? value : [value];
  return [expansionControl(row), ...values];
};

const mapColumn = (column: TableV2Column, columnIndex: number): TableColumn => {
  const mapped: TableColumn = {
    columnKey: column.key,
    prop: column.dataKey || column.key,
    label: column.title || column.key,
  };
  if (column.width !== undefined) mapped.width = column.width;
  if (column.minWidth !== undefined) mapped.minWidth = column.minWidth;
  if (column.align !== undefined) mapped.align = column.align;
  if (column.fixed !== undefined) mapped.fixed = column.fixed;
  if (column.sortable !== undefined) mapped.sortable = column.sortable;
  if (column.headerCellRenderer) {
    mapped.renderHeader = () => column.headerCellRenderer!({ column, columnIndex });
  }
  mapped.renderCell = ({ row, rowIndex }: TableCellContext) => renderCellValue(column, { row, rowIndex });
  return mapped;
};

const mappedColumns = (): TableColumn[] => (Array.isArray(props.columns) ? props.columns : []).map(mapColumn);

const numericHeight = (): number => Math.max(1, Number.parseFloat(String(props.height)) || 400);
const rowHeightAt = (row: TableRow, rowIndex: number): number => {
  const raw = rawRowOf(row);
  const value = props.rowHeight as TableV2RowHeight;
  if (typeof value !== "function") return Math.max(1, Number(value) || 44);
  try {
    return Math.max(1, Number(value(raw, rowIndex)) || 44);
  } catch {
    return 44;
  }
};
const tableRowHeight = (): number | ((context: { row: TableRow; rowIndex: number }) => number) =>
  typeof props.rowHeight === "function"
    ? (context: { row: TableRow; rowIndex: number }) => rowHeightAt(context.row, context.rowIndex)
    : Math.max(1, Number(props.rowHeight) || 44);
const headerHeight = (): number => Math.max(0, Number(props.headerHeight) || 44);
const footerHeight = (): number => Math.max(0, Number(props.footerHeight) || 0);
const fixedRows = (): TableRow[] => (Array.isArray(props.fixedData) ? props.fixedData : []);
const bodyRows = (): TableRow[] =>
  props.expandColumnKey
    ? expansionView.value.projectedRows
    : Array.isArray(props.data)
      ? props.data
      : [];
const fixedBodyHeight = (): number =>
  fixedRows().reduce((total: number, row: TableRow, index: number) => total + rowHeightAt(row, index), 0);
const fixedTableHeight = (): number => headerHeight() + fixedBodyHeight();
const bodyHeight = (): number => Math.max(1, numericHeight() - fixedTableHeight() - footerHeight());
const headerRowStyle = (): Record<string, string> => ({ height: `${headerHeight()}px` });
const fixedRowStyle = (context: { row: TableRow; rowIndex: number }): Record<string, string> => ({
  height: `${rowHeightAt(context.row, context.rowIndex)}px`,
});

const renderedDetail = (scrollTop: number): TableV2RowsRenderedDetail => {
  const source = bodyRows();
  const count = source.length;
  let visibleStart = 0;
  let visibleEnd = Math.max(0, count - 1);
  if (count > 0) {
    let offset = 0;
    while (visibleStart < count - 1 && offset + rowHeightAt(source[visibleStart]!, visibleStart) <= scrollTop) {
      offset += rowHeightAt(source[visibleStart]!, visibleStart);
      visibleStart += 1;
    }
    visibleEnd = visibleStart;
    let visibleSize = 0;
    while (visibleEnd < count && visibleSize < bodyHeight()) {
      visibleSize += rowHeightAt(source[visibleEnd]!, visibleEnd);
      visibleEnd += 1;
    }
    visibleEnd = Math.max(visibleStart, visibleEnd - 1);
  }
  const overscan = Math.max(0, Number(props.overscan) || 0);
  return {
    rowCacheStart: Math.max(0, visibleStart - overscan),
    rowCacheEnd: Math.min(Math.max(0, count - 1), visibleEnd + overscan),
    rowVisibleStart: visibleStart,
    rowVisibleEnd: visibleEnd,
  };
};

const firstEventDetail = <T>(event: CustomEvent<unknown[]>): T | undefined => {
  const detail = event.detail;
  return (Array.isArray(detail) ? detail[0] : detail) as T | undefined;
};

const onScroll = (event: CustomEvent<unknown[]>): void => {
  const detail = firstEventDetail<TableScrollDetail>(event) || { scrollLeft: 0, scrollTop: 0 };
  fixedTable()?.setScrollLeft(detail.scrollLeft);
  emit("scroll", detail);
  const rendered = renderedDetail(detail.scrollTop);
  emit("rows-rendered", rendered);
  const source = bodyRows();
  const count = source.length;
  const totalHeight = source.reduce(
    (total: number, row: TableRow, index: number) => total + rowHeightAt(row, index),
    0,
  );
  const distance = Math.max(0, totalHeight - bodyHeight() - detail.scrollTop);
  if (rendered.rowVisibleEnd >= count - 1) {
    if (!reachedEnd) emit("end-reached", distance);
    reachedEnd = true;
  } else {
    reachedEnd = false;
  }
};

const onFixedScroll = (event: CustomEvent<unknown[]>): void => {
  const detail = firstEventDetail<TableScrollDetail>(event);
  if (detail) innerTable()?.setScrollLeft(detail.scrollLeft);
};

const onSort = (event: CustomEvent<unknown[]>): void => {
  const detail = firstEventDetail<{ prop: string; order: string }>(event) || { prop: "", order: "" };
  const column = (props.columns || []).find(
    (item: TableV2Column) => (item.dataKey || item.key) === detail.prop,
  );
  emit("column-sort", {
    key: column?.key || detail.prop,
    order: (detail.order || "") as TableV2SortBy["order"],
  });
};

const forwardRowClick = (event: CustomEvent<unknown[]>): void => {
  const args = event.detail as [TableRow, TableColumn, Event];
  emit("row-click", rawRowOf(args[0]), args[1], args[2]);
};

const scrollTableTo = (options: { left?: number; top?: number }): void => innerTable()?.scrollTableTo(options);
const setScrollTop = (top: number): void => innerTable()?.setScrollTop(top);
const setScrollLeft = (left: number): void => innerTable()?.setScrollLeft(left);
const scrollToRow = (row: number, strategy: "auto" | "start" | "center" | "end" = "auto"): void => {
  const source = bodyRows();
  const index = Math.max(0, Math.min((source.length || 1) - 1, Math.floor(row)));
  const viewport = bodyHeight();
  const start = source
    .slice(0, index)
    .reduce(
      (total: number, item: TableRow, rowIndex: number) => total + rowHeightAt(item, rowIndex),
      0,
    );
  const currentHeight = source[index] ? rowHeightAt(source[index]!, index) : 44;
  const current =
    strategy === "center"
      ? start - (viewport - currentHeight) / 2
      : strategy === "end"
        ? start - viewport + currentHeight
        : start;
  setScrollTop(Math.max(0, current));
};

onMounted(() => {
  queueMicrotask(() => emit("rows-rendered", renderedDetail(0)));
});

useEffect(() => {
  if (expansionInitialized) return;
  expansionInitialized = true;
  expandedState.set(normalizeKeys(props.defaultExpandedRowKeys));
});

defineExpose<TableV2Expose>({ scrollTableTo, scrollToRow, setScrollTop, setScrollLeft });
defineStyle(styles);

const TableV2 = defineHtml<TableV2Props, Record<string, never>, TableV2Slots>(`
  <div
    class="table-v2"
    :class=${{
      "has-fixed-data": fixedRows().length > 0,
      "has-footer": footerHeight() > 0,
    }}
    :style=${{ width: cssSize(props.width) }}
  >
    <elf-table
      v-if=${fixedRows().length > 0}
      data-fixed-table
      class="fixed-table"
      :data.prop=${fixedRows()}
      :columns.prop=${mappedColumns()}
      :rowKey.prop=${innerRowKey}
      :height=${fixedTableHeight()}
      :rowHeight.prop=${tableRowHeight()}
      :rowStyle.prop=${fixedRowStyle}
      :headerRowStyle.prop=${headerRowStyle()}
      :sortProp=${props.sortBy?.key || ""}
      :sortOrder=${props.sortBy?.order || ""}
      :stripe=${props.stripe}
      :border=${props.border}
      stickyHeader
      @scroll=${onFixedScroll}
      @sort-change=${onSort}
      @row-click=${forwardRowClick}
    ></elf-table>
    <elf-table
      v-if=${bodyRows().length > 0 || fixedRows().length === 0}
      data-scroll-table
      :data.prop=${bodyRows()}
      :columns.prop=${mappedColumns()}
      :rowKey.prop=${innerRowKey}
      :height=${fixedRows().length > 0 ? bodyHeight() : numericHeight() - footerHeight()}
      :rowHeight.prop=${tableRowHeight()}
      :headerRowStyle.prop=${headerRowStyle()}
      :showHeader.prop=${fixedRows().length === 0}
      :overscan=${props.overscan}
      :sortProp=${props.sortBy?.key || ""}
      :sortOrder=${props.sortBy?.order || ""}
      :stripe=${props.stripe}
      :border=${props.border}
      :loading=${false}
      emptyText=" "
      :stickyHeader=${props.fixed}
      virtual
      :virtualThreshold.prop=${0}
      @scroll=${onScroll}
      @sort-change=${onSort}
      @row-click=${forwardRowClick}
    ></elf-table>
    <div v-if=${bodyRows().length === 0 && fixedRows().length > 0} class="body-fill"></div>
    <div v-if=${bodyRows().length === 0 && fixedRows().length === 0} class="empty" part="empty">
      <slot name="empty">${props.emptyText}</slot>
    </div>
    <div v-if=${props.loading} class="overlay" part="overlay" role="status" aria-live="polite">
      <slot name="overlay">${locale.t("table.loading")}</slot>
    </div>
    <footer v-if=${footerHeight() > 0} class="footer" part="footer" :style=${{ height: `${footerHeight()}px` }}>
      <slot name="footer"></slot>
    </footer>
  </div>
`);

export { TableV2 };
