import type {
  TableAlign,
  TableColumnType,
  TableRow,
} from "./types";

export interface TableColumnView {
  id: string;
  prop: string;
  label: string;
  type: TableColumnType;
  width: string;
  minWidth: string;
  align: TableAlign;
  headerAlign: TableAlign;
  sortable: boolean | "custom";
  fixed: "" | "left" | "right";
  fixedOffset: string;
  fixedLast: boolean;
  raw: Record<string, unknown>;
}

export interface NormalizeTableColumnsOptions {
  columns: readonly Record<string, unknown>[];
  firstRow?: TableRow | undefined;
  widths?: Readonly<Record<string, number>>;
  actionsLabel: string;
}

const COLUMN_TYPES: TableColumnType[] = [
  "default",
  "selection",
  "index",
  "expand",
  "actions",
];

export const normalizeTableSize = (value: unknown): string => {
  if (value == null || value === "") return "";
  if (typeof value === "number") return `${value}px`;
  const normalized = String(value).trim();
  return /^-?\d+(?:\.\d+)?$/.test(normalized) ? `${normalized}px` : normalized;
};

export const tableSizeNumber = (value: string): number => {
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

export const getTableColumnSize = (
  column: TableColumnView,
  widths: Readonly<Record<string, number>> = {},
): number =>
  widths[column.id] ||
  tableSizeNumber(column.width || column.minWidth || "120px") ||
  120;

const normalizeColumnType = (value: unknown): TableColumnType => {
  const type = String(value || "default") as TableColumnType;
  return COLUMN_TYPES.includes(type) ? type : "default";
};

const defaultColumnMinWidth = (type: TableColumnType): number => {
  if (type === "selection" || type === "expand") return 48;
  if (type === "index") return 64;
  if (type === "actions") return 140;
  return 120;
};

const normalizeAlign = (value: unknown): TableAlign =>
  value === "center" || value === "right" ? value : "left";

const defaultColumnLabel = (
  type: TableColumnType,
  prop: string,
  actionsLabel: string,
): string => {
  if (type === "selection" || type === "expand") return "";
  if (type === "index") return "#";
  if (type === "actions") return actionsLabel;
  return prop;
};

const inferTableColumns = (firstRow: TableRow | undefined): TableColumnView[] =>
  Object.keys(firstRow || {}).map((key) => ({
    id: key,
    prop: key,
    label: key,
    type: "default",
    width: "",
    minWidth: "120px",
    align: "left",
    headerAlign: "left",
    sortable: false,
    fixed: "",
    fixedOffset: "",
    fixedLast: false,
    raw: { prop: key, label: key },
  }));

const applyFixedColumnOffsets = (
  columns: TableColumnView[],
  widths: Readonly<Record<string, number>>,
): void => {
  let left = 0;
  for (const column of columns) {
    if (column.fixed !== "left") continue;
    column.fixedOffset = `${left}px`;
    left += getTableColumnSize(column, widths);
  }

  let right = 0;
  for (let index = columns.length - 1; index >= 0; index -= 1) {
    const column = columns[index]!;
    if (column.fixed !== "right") continue;
    column.fixedOffset = `${right}px`;
    right += getTableColumnSize(column, widths);
  }

  const leftBoundary = [...columns].reverse().find((column) => column.fixed === "left");
  const rightBoundary = columns.find((column) => column.fixed === "right");
  if (leftBoundary) leftBoundary.fixedLast = true;
  if (rightBoundary) rightBoundary.fixedLast = true;
};

export const normalizeTableColumns = (
  options: NormalizeTableColumnsOptions,
): TableColumnView[] => {
  if (options.columns.length === 0) return inferTableColumns(options.firstRow);

  const columns = options.columns.map((raw, index): TableColumnView => {
    const rawType = String(raw.type || "default");
    const type = normalizeColumnType(rawType);
    const prop = String(raw.prop || (rawType === "default" ? `column_${index}` : rawType));
    const align = normalizeAlign(raw.align);
    return {
      id: String(raw.id || prop || index),
      prop,
      label: String(raw.label || defaultColumnLabel(type, prop, options.actionsLabel)),
      type,
      width: normalizeTableSize(raw.width),
      minWidth: normalizeTableSize(raw.minWidth || defaultColumnMinWidth(type)),
      align,
      headerAlign:
        raw.headerAlign === "center" || raw.headerAlign === "right"
          ? raw.headerAlign
          : align,
      sortable: raw.sortable === "custom" ? "custom" : Boolean(raw.sortable),
      fixed: raw.fixed === "left" || raw.fixed === "right" ? raw.fixed : "",
      fixedOffset: "",
      fixedLast: false,
      raw,
    };
  });

  applyFixedColumnOffsets(columns, options.widths || {});
  return columns;
};
