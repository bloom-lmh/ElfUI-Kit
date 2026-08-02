import type { TableAlign, TableRenderValue, TableRow, TableSortOrder } from "../Table/types";

export interface TableV2CellContext {
  cellData: unknown;
  rowData: TableRow;
  rowIndex: number;
  column: TableV2Column;
  columnIndex: number;
}

export interface TableV2HeaderContext {
  column: TableV2Column;
  columnIndex: number;
}

export interface TableV2Column {
  key: string;
  dataKey?: string;
  title?: string;
  width?: string | number;
  minWidth?: string | number;
  align?: TableAlign;
  fixed?: "left" | "right";
  sortable?: boolean | "custom";
  cellRenderer?: (context: TableV2CellContext) => TableRenderValue;
  headerCellRenderer?: (context: TableV2HeaderContext) => TableRenderValue;
}

export interface TableV2SortBy {
  key: string;
  order: TableSortOrder;
}

export interface TableV2RowsRenderedDetail {
  rowCacheStart: number;
  rowCacheEnd: number;
  rowVisibleStart: number;
  rowVisibleEnd: number;
}

export type TableV2RowExpandDetail = [rowData: TableRow, expanded: boolean];

export type TableV2RowHeight = number | ((row: TableRow, rowIndex: number) => number);

export interface TableV2Slots {
  empty?: unknown;
  footer?: unknown;
  overlay?: unknown;
}

export interface TableV2Props {
  data: TableRow[];
  /** Rows pinned between the header and the virtualized body. */
  fixedData: TableRow[];
  columns: TableV2Column[];
  rowKey: string | ((row: TableRow) => string | number);
  width: string | number;
  height: string | number;
  rowHeight: TableV2RowHeight;
  headerHeight: number;
  footerHeight: number;
  overscan: number;
  expandColumnKey: string;
  expandedRowKeys?: string[];
  defaultExpandedRowKeys: string[];
  indentSize: number;
  sortBy?: TableV2SortBy;
  fixed: boolean;
  stripe: boolean;
  border: boolean;
  loading: boolean;
  emptyText: string;
}

export interface TableV2Expose {
  scrollTableTo: (options: { left?: number; top?: number }) => void;
  scrollToRow: (row: number, strategy?: "auto" | "start" | "center" | "end") => void;
  setScrollTop: (top: number) => void;
  setScrollLeft: (left: number) => void;
}

export type TableV2Element = HTMLElement & TableV2Expose;
