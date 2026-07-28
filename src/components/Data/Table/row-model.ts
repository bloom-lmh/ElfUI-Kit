import { getTableValueAtPath } from "./sort-filter";
import type { TableRow, TableRowKey } from "./types";
import type { TableTreeRow } from "./tree";

export const normalizeTableKeys = (value: unknown): string[] => {
  if (!Array.isArray(value)) return [];
  return value.map((item) => String(item)).filter(Boolean);
};

export const tableKeySignature = (
  keys: readonly string[],
  separator = "::elf-table::",
): string => keys.join(separator);

export const resolveTableRowKey = (
  row: TableRow,
  fallback: number | string,
  rowKey: TableRowKey,
): string => {
  if (typeof rowKey === "function") {
    try {
      return String(rowKey(row));
    } catch {
      return String(fallback);
    }
  }
  return String(getTableValueAtPath(row, String(rowKey || "id")) ?? fallback);
};

export const resolveTableRow = (
  rows: readonly TableTreeRow[],
  target: unknown,
): TableTreeRow | undefined => {
  if (typeof target === "string" || typeof target === "number") {
    return rows.find((row) => row.key === String(target));
  }
  if (target && typeof target === "object" && "key" in target && "raw" in target) {
    return target as TableTreeRow;
  }
  return rows.find((row) => row.raw === target);
};
