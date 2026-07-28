import type {
  TableFilterMethod,
  TableFilterOption,
  TableRow,
  TableSortBy,
  TableSortMethod,
  TableSortOrder,
} from "./types";

export interface TableSortFilterColumn {
  prop: string;
  sortable: boolean | "custom";
  raw: Record<string, unknown>;
}

export type TableFilterValues = Record<string, unknown[]>;

const FILTER_SIGNATURE_SEPARATOR = "::elf-table::";

export const getTableValueAtPath = (row: TableRow, path: string): unknown =>
  path.split(".").reduce<unknown>((value, key) => {
    if (!value || typeof value !== "object") return undefined;
    return (value as TableRow)[key];
  }, row);

export const tableFilterValueKey = (value: unknown): string => {
  if (value == null) return String(value);
  if (typeof value === "string") return `string:${value}`;
  if (typeof value === "number") return `number:${value}`;
  if (typeof value === "boolean") return `boolean:${value}`;
  try {
    return `${typeof value}:${JSON.stringify(value)}`;
  } catch {
    return `${typeof value}:${String(value)}`;
  }
};

export const tableFilterSignature = (values: readonly unknown[]): string =>
  values.map(tableFilterValueKey).join(FILTER_SIGNATURE_SEPARATOR);

export const tableFilterValueEquals = (left: unknown, right: unknown): boolean =>
  tableFilterValueKey(left) === tableFilterValueKey(right);

export const tableFilterKey = (column: TableSortFilterColumn): string =>
  String(column.raw.columnKey || column.prop);

export const normalizeTableFilterOptions = (
  column: TableSortFilterColumn,
): TableFilterOption[] => {
  const filters = Array.isArray(column.raw.filters) ? column.raw.filters : [];
  return filters
    .filter((item): item is Record<string, unknown> => Boolean(item && typeof item === "object"))
    .map((item) => ({
      text: String(item.text ?? item.value ?? ""),
      value: item.value,
    }));
};

export const normalizeTableFilterValues = (
  column: TableSortFilterColumn,
  values: readonly unknown[],
): unknown[] => {
  const allowed = normalizeTableFilterOptions(column);
  const normalized = values.filter(
    (value, index, source) =>
      source.findIndex((item) => tableFilterValueEquals(item, value)) === index &&
      allowed.some((option) => tableFilterValueEquals(option.value, value)),
  );
  return column.raw.filterMultiple === false ? normalized.slice(0, 1) : normalized;
};

export const activeTableFilterColumns = <Column extends TableSortFilterColumn>(
  columns: Column[],
  filterValues: TableFilterValues,
): Column[] =>
  columns.filter((column) => {
    const key = tableFilterKey(column);
    return normalizeTableFilterOptions(column).length > 0 && (filterValues[key]?.length || 0) > 0;
  });

export const tableRowMatchesFilters = (
  row: TableRow,
  columns: TableSortFilterColumn[],
  filterValues: TableFilterValues,
): boolean =>
  columns.every((column) => {
    const values = filterValues[tableFilterKey(column)] || [];
    if (values.length === 0) return true;
    const method = column.raw.filterMethod as TableFilterMethod | undefined;
    return values.some((value) => {
      if (typeof method === "function") {
        try {
          return Boolean(method(value, row, column.raw));
        } catch {
          return false;
        }
      }
      return tableFilterValueEquals(getTableValueAtPath(row, column.prop), value);
    });
  });

const compareTableValues = (left: unknown, right: unknown): number => {
  if (left == null && right == null) return 0;
  if (left == null) return -1;
  if (right == null) return 1;
  if (typeof left === "number" && typeof right === "number") return left - right;
  return String(left).localeCompare(String(right), "zh-Hans-CN", { numeric: true });
};

const resolveSortValue = (
  sortBy: TableSortBy | undefined,
  row: TableRow,
  index: number,
  rows: TableRow[],
  fallbackProp: string,
): unknown => {
  if (typeof sortBy === "function") {
    try {
      return sortBy(row, index, rows);
    } catch {
      return undefined;
    }
  }
  return getTableValueAtPath(row, typeof sortBy === "string" ? sortBy : fallbackProp);
};

const compareTableRows = (
  left: { row: TableRow; index: number },
  right: { row: TableRow; index: number },
  column: TableSortFilterColumn,
  rows: TableRow[],
): number => {
  const method = column.raw.sortMethod as TableSortMethod | undefined;
  if (typeof method === "function") {
    try {
      return Number(method(left.row, right.row)) || 0;
    } catch {
      return 0;
    }
  }
  const sortBy = column.raw.sortBy as TableSortBy | undefined;
  if (Array.isArray(sortBy)) {
    for (const path of sortBy) {
      const result = compareTableValues(
        getTableValueAtPath(left.row, path),
        getTableValueAtPath(right.row, path),
      );
      if (result !== 0) return result;
    }
    return 0;
  }
  return compareTableValues(
    resolveSortValue(sortBy, left.row, left.index, rows, column.prop),
    resolveSortValue(sortBy, right.row, right.index, rows, column.prop),
  );
};

export const sortTableRows = (
  columns: TableSortFilterColumn[],
  source: TableRow[],
  prop: string,
  order: TableSortOrder,
): TableRow[] => {
  const data = [...source];
  if (!prop || !order) return data;
  const column = columns.find((item) => item.prop === prop);
  if (column?.sortable === "custom") return data;
  const direction = order === "ascending" ? 1 : -1;
  if (!column) {
    return data.sort(
      (left, right) =>
        compareTableValues(
          getTableValueAtPath(left, prop),
          getTableValueAtPath(right, prop),
        ) * direction,
    );
  }
  return data
    .map((row, index) => ({ row, index }))
    .sort((left, right) => compareTableRows(left, right, column, data) * direction)
    .map(({ row }) => row);
};

export const normalizeTableSortOrders = (
  column: TableSortFilterColumn,
): TableSortOrder[] => {
  const raw = Array.isArray(column.raw.sortOrders) ? column.raw.sortOrders : [];
  const normalized = raw
    .map((order): TableSortOrder =>
      order === "ascending" || order === "descending" ? order : "")
    .filter((order, index, orders) => orders.indexOf(order) === index);
  return normalized.length > 0 ? normalized : ["ascending", "descending", ""];
};
