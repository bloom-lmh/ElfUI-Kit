export type TableColumnType = "default" | "selection" | "index" | "expand" | "actions";
export type TableAlign = "left" | "center" | "right";
export type TableSortOrder = "" | "ascending" | "descending";
export type TableSize = "small" | "default" | "large";
export type TableLayout = "fixed" | "auto";
export type TableTitleVariant = "default" | "primary" | "muted";
export type TableRow = Record<string, unknown>;
export type TableStyle = Record<string, string | number>;
export type TableSortBy =
  | string
  | string[]
  | ((row: TableRow, index: number, rows: TableRow[]) => unknown);
export type TableSortMethod = (left: TableRow, right: TableRow) => number;

export interface TableFilterOption {
  text: string;
  value: unknown;
}

export type TableFilterMethod = (
  value: unknown,
  row: TableRow,
  column: TableColumn
) => boolean;

export interface TableRowContext {
  row: TableRow;
  rowIndex: number;
}

export interface TableCellContext extends TableRowContext {
  column: TableColumn;
  columnIndex: number;
}

export interface TableHeaderRowContext {
  rowIndex: number;
}

export interface TableHeaderCellContext extends TableHeaderRowContext {
  column: TableColumn;
  columnIndex: number;
}

export type TableRenderValue =
  | string
  | number
  | boolean
  | Node
  | readonly Node[]
  | null
  | undefined;

export interface TableFilterIconContext {
  column: TableColumn;
  filtered: boolean;
}

export type TableTooltipPlacement =
  | "top"
  | "top-start"
  | "top-end"
  | "bottom"
  | "bottom-start"
  | "bottom-end";

export interface TableTooltipOptions {
  placement?: TableTooltipPlacement;
  offset?: number;
  showAfter?: number;
  hideAfter?: number;
  maxWidth?: string | number;
}

export type TableRowClassName = string | ((context: TableRowContext) => string);
export type TableRowStyle = TableStyle | ((context: TableRowContext) => TableStyle);
export type TableCellClassName = string | ((context: TableCellContext) => string);
export type TableCellStyle = TableStyle | ((context: TableCellContext) => TableStyle);
export type TableHeaderRowClassName =
  | string
  | ((context: TableHeaderRowContext) => string);
export type TableHeaderRowStyle =
  | TableStyle
  | ((context: TableHeaderRowContext) => TableStyle);
export type TableHeaderCellClassName =
  | string
  | ((context: TableHeaderCellContext) => string);
export type TableHeaderCellStyle =
  | TableStyle
  | ((context: TableHeaderCellContext) => TableStyle);

export interface TableAction {
  label: string;
  type?: "primary" | "danger" | "default";
  disabled?: boolean | ((row: TableRow, index: number) => boolean);
  onClick?: (row: TableRow, index: number, action: TableAction) => void;
}

export interface TableColumn {
  columnKey?: string;
  prop?: string;
  label?: string;
  type?: TableColumnType;
  index?: number | ((index: number) => number | string);
  width?: string | number;
  minWidth?: string | number;
  align?: TableAlign;
  headerAlign?: TableAlign;
  fixed?: "left" | "right";
  sortable?: boolean | "custom";
  sortMethod?: TableSortMethod;
  sortBy?: TableSortBy;
  sortOrders?: Array<TableSortOrder | null>;
  resizable?: boolean;
  filters?: TableFilterOption[];
  filterPlacement?: "bottom" | "bottom-start" | "bottom-end" | "top" | "top-start" | "top-end";
  filterClassName?: string;
  filterMultiple?: boolean;
  filterMethod?: TableFilterMethod;
  filteredValue?: unknown[];
  renderHeader?: (context: TableHeaderCellContext) => TableRenderValue;
  renderCell?: (context: TableCellContext) => TableRenderValue;
  renderExpand?: (context: TableRowContext) => TableRenderValue;
  renderFilterIcon?: (context: TableFilterIconContext) => TableRenderValue;
  formatter?: (row: TableRow, column: TableColumn, index: number) => unknown;
  className?: string;
  headerClassName?: string;
  cellClassName?: string | ((row: TableRow, column: TableColumn, index: number) => string);
  cellStyle?:
    | TableStyle
    | ((row: TableRow, column: TableColumn, index: number) => TableStyle);
  selectable?: (row: TableRow, index: number) => boolean;
  showOverflowTooltip?: boolean;
  tooltipFormatter?: (row: TableRow, column: TableColumn, index: number) => unknown;
  actions?: TableAction[];
  [key: string]: unknown;
}

export type TableExpandFormatter = (row: TableRow, index: number) => unknown;
export type TableRowKey = string | ((row: TableRow) => string | number);

export interface TableTreeProps {
  children?: string;
  hasChildren?: string;
  checkStrictly?: boolean;
}

export interface TableTreeNodeContext {
  key: string;
  level: number;
  expanded: boolean;
  loading: boolean;
}

export type TableLoad = (
  row: TableRow,
  treeNode: TableTreeNodeContext,
  resolve: (children: TableRow[]) => void
) => void | TableRow[] | Promise<void | TableRow[]>;

export interface TableDefaultSort {
  prop: string;
  order?: TableSortOrder;
}

export interface TableSummaryContext {
  columns: TableColumn[];
  data: TableRow[];
}

export type TableSummaryMethod = (context: TableSummaryContext) => unknown[];

export type TableSpanResult =
  | [rowspan: number, colspan: number]
  | { rowspan: number; colspan: number };

export type TableSpanMethod = (context: TableCellContext) => TableSpanResult | undefined;

export interface TableScrollDetail {
  scrollLeft: number;
  scrollTop: number;
}

export interface TableProps {
  title: string;
  titleVariant: TableTitleVariant;
  data: TableRow[];
  columns: TableColumn[];
  rowKey: TableRowKey;
  stripe: boolean;
  border: boolean;
  hover: boolean;
  size: TableSize;
  height: string | number;
  maxHeight: string | number;
  /** Only renders the visible row window. Requires a fixed `height`. */
  virtual: boolean;
  /** Minimum row count before virtualization activates. */
  virtualThreshold: number;
  /** Fixed row height used by the virtual window. */
  rowHeight: number;
  /** Extra rows rendered before and after the viewport. */
  overscan: number;
  fit: boolean;
  tableLayout: TableLayout;
  scrollbarAlwaysOn: boolean;
  emptyText: string;
  loading: boolean;
  showHeader: boolean;
  stickyHeader: boolean;
  highlightCurrentRow: boolean;
  currentRowKey: string | number;
  rowClassName?: TableRowClassName;
  rowStyle?: TableRowStyle;
  cellClassName?: TableCellClassName;
  cellStyle?: TableCellStyle;
  headerRowClassName?: TableHeaderRowClassName;
  headerRowStyle?: TableHeaderRowStyle;
  headerCellClassName?: TableHeaderCellClassName;
  headerCellStyle?: TableHeaderCellStyle;
  selectedKeys?: string[];
  defaultSelectedKeys: string[];
  selectOnIndeterminate: boolean;
  expandedRowKeys?: string[];
  defaultExpandedRowKeys: string[];
  defaultExpandAll: boolean;
  treeProps: TableTreeProps;
  indent: number;
  lazy: boolean;
  load?: TableLoad;
  expandFormatter?: TableExpandFormatter;
  sortProp: string;
  sortOrder: TableSortOrder;
  defaultSort?: TableDefaultSort;
  showOverflowTooltip: boolean;
  tooltipOptions: TableTooltipOptions;
  showSummary: boolean;
  sumText: string;
  summaryMethod?: TableSummaryMethod;
  spanMethod?: TableSpanMethod;
}

export interface TableExpose {
  clearSelection(): void;
  getSelectionRows(): TableRow[];
  toggleRowSelection(rowOrKey: TableRow | string | number, selected?: boolean): void;
  toggleAllSelection(): void;
  toggleRowExpansion(rowOrKey: TableRow | string | number, expanded?: boolean): void;
  updateKeyChildren(key: string | number, children: TableRow[]): void;
  setCurrentRow(rowOrKey: TableRow | string | number): void;
  clearSort(): void;
  clearFilter(columnKeys?: string | string[]): void;
  sort(prop: string, order?: TableSortOrder): void;
  doLayout(): void;
  scrollTableTo(options: ScrollToOptions): void;
  scrollTableTo(x: number, y?: number): void;
  setScrollTop(value: number): void;
  setScrollLeft(value: number): void;
  readonly columns: TableColumn[];
}
