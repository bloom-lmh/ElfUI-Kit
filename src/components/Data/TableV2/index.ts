import {
  defineEmits,
  defineExpose,
  defineHtml,
  defineProps,
  defineStyle,
  onMounted,
  useHost,
  useComponents,
} from "@elfui/core";

import { Table } from "../Table/index";
import type { TableColumn, TableRow, TableScrollDetail } from "../Table/types";
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
  "row-click": [row: TableRow, column: TableColumn, event: Event];
}>();

useComponents({ "elf-table": Table });

type InnerTable = HTMLElement & TableV2Expose;
const host = useHost();
let reachedEnd = false;

const innerTable = (): InnerTable | null =>
  host.shadowRoot?.querySelector<InnerTable>("elf-table[data-scroll-table]") ?? null;
const fixedTable = (): InnerTable | null =>
  host.shadowRoot?.querySelector<InnerTable>("elf-table[data-fixed-table]") ?? null;

const cssSize = (value: string | number): string =>
  typeof value === "number" || /^\d+(?:\.\d+)?$/.test(String(value)) ? `${value}px` : String(value);

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
  if (column.cellRenderer) {
    mapped.renderCell = ({ row, rowIndex }) =>
      column.cellRenderer!({
        cellData: row[column.dataKey || column.key],
        rowData: row,
        rowIndex,
        column,
        columnIndex,
      });
  }
  return mapped;
};

const mappedColumns = (): TableColumn[] => (Array.isArray(props.columns) ? props.columns : []).map(mapColumn);

const numericHeight = (): number => Math.max(1, Number.parseFloat(String(props.height)) || 400);
const rowHeightAt = (row: TableRow, rowIndex: number): number => {
  const value = props.rowHeight as TableV2RowHeight;
  if (typeof value !== "function") return Math.max(1, Number(value) || 44);
  try {
    return Math.max(1, Number(value(row, rowIndex)) || 44);
  } catch {
    return 44;
  }
};
const tableRowHeight = (): number | ((context: { row: TableRow; rowIndex: number }) => number) =>
  typeof props.rowHeight === "function"
    ? ({ row, rowIndex }) => rowHeightAt(row, rowIndex)
    : Math.max(1, Number(props.rowHeight) || 44);
const headerHeight = (): number => Math.max(0, Number(props.headerHeight) || 44);
const footerHeight = (): number => Math.max(0, Number(props.footerHeight) || 0);
const fixedRows = (): TableRow[] => (Array.isArray(props.fixedData) ? props.fixedData : []);
const bodyRows = (): TableRow[] => (Array.isArray(props.data) ? props.data : []);
const fixedBodyHeight = (): number =>
  fixedRows().reduce((total, row, index) => total + rowHeightAt(row, index), 0);
const fixedTableHeight = (): number => headerHeight() + fixedBodyHeight();
const bodyHeight = (): number => Math.max(1, numericHeight() - fixedTableHeight() - footerHeight());
const headerRowStyle = (): Record<string, string> => ({ height: `${headerHeight()}px` });

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
  const totalHeight = source.reduce((total, row, index) => total + rowHeightAt(row, index), 0);
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
  const column = (props.columns || []).find((item) => (item.dataKey || item.key) === detail.prop);
  emit("column-sort", {
    key: column?.key || detail.prop,
    order: (detail.order || "") as TableV2SortBy["order"],
  });
};

const forwardRowClick = (event: CustomEvent<unknown[]>): void => {
  const args = event.detail as [TableRow, TableColumn, Event];
  emit("row-click", args[0], args[1], args[2]);
};

const scrollTableTo = (options: { left?: number; top?: number }): void => innerTable()?.scrollTableTo(options);
const setScrollTop = (top: number): void => innerTable()?.setScrollTop(top);
const setScrollLeft = (left: number): void => innerTable()?.setScrollLeft(left);
const scrollToRow = (row: number, strategy: "auto" | "start" | "center" | "end" = "auto"): void => {
  const source = bodyRows();
  const index = Math.max(0, Math.min((source.length || 1) - 1, Math.floor(row)));
  const viewport = bodyHeight();
  const start = source.slice(0, index).reduce((total, item, rowIndex) => total + rowHeightAt(item, rowIndex), 0);
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

defineExpose<TableV2Expose>({ scrollTableTo, scrollToRow, setScrollTop, setScrollLeft });
defineStyle(styles);

const TableV2 = defineHtml<TableV2Props, Record<string, never>, TableV2Slots>(`
  <div class="table-v2" :style=${{ width: cssSize(props.width) }}>
    <elf-table
      v-if=${fixedRows().length > 0}
      data-fixed-table
      class="fixed-table"
      :data.prop=${fixedRows()}
      :columns.prop=${mappedColumns()}
      :rowKey.prop=${props.rowKey}
      :height=${fixedTableHeight()}
      :rowHeight.prop=${tableRowHeight()}
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
      :rowKey.prop=${props.rowKey}
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
      :virtualThreshold=${0}
      @scroll=${onScroll}
      @sort-change=${onSort}
      @row-click=${forwardRowClick}
    ></elf-table>
    <div v-if=${bodyRows().length === 0 && fixedRows().length > 0} class="body-fill"></div>
    <div v-if=${bodyRows().length === 0 && fixedRows().length === 0} class="empty" part="empty">
      <slot name="empty">${props.emptyText}</slot>
    </div>
    <div v-if=${props.loading} class="overlay" part="overlay" role="status" aria-live="polite">
      <slot name="overlay">Loading...</slot>
    </div>
    <footer v-if=${footerHeight() > 0} class="footer" part="footer" :style=${{ height: `${footerHeight()}px` }}>
      <slot name="footer"></slot>
    </footer>
  </div>
`);

export { TableV2 };
