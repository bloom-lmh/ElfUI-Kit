import type { TableRow } from "./types";
import type { TableTreeRow } from "../table-tree-model";
import { resolveTableRow } from "./row-model";

export type TableRowSelectable = (row: TableTreeRow) => boolean;

export interface NormalizeTableSelectionOptions {
  keys: readonly string[];
  rows: readonly TableTreeRow[];
  isTree: boolean;
  checkStrictly: boolean;
  isSelectable: TableRowSelectable;
}

export interface TableSelectionSummary {
  selectableRows: TableTreeRow[];
  allSelected: boolean;
  indeterminate: boolean;
}

export interface ToggleTableRowSelectionOptions extends NormalizeTableSelectionOptions {
  row: TableTreeRow;
  selected?: boolean | undefined;
  ignoreSelectable?: boolean;
}

export interface ToggleAllTableSelectionOptions {
  selectedKeys: readonly string[];
  visibleRows: readonly TableTreeRow[];
  isSelectable: TableRowSelectable;
  selectOnIndeterminate: boolean;
}

export interface TableRowCollection {
  readonly allRows: readonly TableTreeRow[];
  readonly visibleRows: readonly TableTreeRow[];
  readonly isTree: boolean;
  resolve(target: unknown): TableTreeRow | undefined;
  normalizeSelection(
    keys: readonly string[],
    checkStrictly: boolean,
    isSelectable: TableRowSelectable,
  ): string[];
  selectionSummary(
    selectedKeys: readonly string[],
    isSelectable: TableRowSelectable,
  ): TableSelectionSummary;
  isRowIndeterminate(
    row: TableTreeRow,
    selectedKeys: readonly string[],
    checkStrictly: boolean,
    isSelectable: TableRowSelectable,
  ): boolean;
  toggleRowSelection(
    keys: readonly string[],
    row: TableTreeRow,
    selected: boolean | undefined,
    ignoreSelectable: boolean,
    checkStrictly: boolean,
    isSelectable: TableRowSelectable,
  ): string[];
  toggleAllSelection(
    selectedKeys: readonly string[],
    isSelectable: TableRowSelectable,
    selectOnIndeterminate: boolean,
  ): string[];
  selectedRows(selectedKeys: readonly string[]): TableRow[];
}

export const getTableDescendantRows = (
  rows: readonly TableTreeRow[],
  row: TableTreeRow,
  includeSelf = false,
): TableTreeRow[] =>
  rows.filter(
    (item) =>
      (includeSelf && item.key === row.key) ||
      (item.key !== row.key && item.path.includes(row.key)),
  );

export const normalizeTableSelection = (options: NormalizeTableSelectionOptions): string[] => {
  const existing = new Set(options.rows.map((row) => row.key));
  const selected = new Set(options.keys.map(String).filter((key) => existing.has(key)));
  if (!options.isTree || options.checkStrictly) return Array.from(selected);

  for (const row of options.rows) {
    if (!selected.has(row.key) || !row.hasChildren) continue;
    for (const descendant of getTableDescendantRows(options.rows, row)) {
      if (options.isSelectable(descendant)) selected.add(descendant.key);
    }
  }

  const rowsByDepth = [...options.rows].sort((left, right) => right.level - left.level);
  for (const row of rowsByDepth) {
    if (!row.hasChildren || !options.isSelectable(row)) continue;
    const children = options.rows.filter(
      (child) => child.parentKey === row.key && options.isSelectable(child),
    );
    if (
      children.length > 0 &&
      selected.has(row.key) &&
      !children.every((child) => selected.has(child.key))
    ) {
      selected.delete(row.key);
    }
  }
  return Array.from(selected);
};

export const getTableSelectionSummary = (
  rows: readonly TableTreeRow[],
  selectedKeys: readonly string[],
  isSelectable: TableRowSelectable,
): TableSelectionSummary => {
  const selectableRows = rows.filter(isSelectable);
  const selected = new Set(selectedKeys);
  const selectedCount = selectableRows.reduce(
    (count, row) => count + Number(selected.has(row.key)),
    0,
  );
  return {
    selectableRows,
    allSelected: selectableRows.length > 0 && selectedCount === selectableRows.length,
    indeterminate: selectedCount > 0 && selectedCount < selectableRows.length,
  };
};

export const isTableRowIndeterminate = (
  rows: readonly TableTreeRow[],
  row: TableTreeRow,
  selectedKeys: readonly string[],
  checkStrictly: boolean,
  isSelectable: TableRowSelectable,
): boolean => {
  if (!row.hasChildren || checkStrictly) return false;
  const descendants = getTableDescendantRows(rows, row).filter(isSelectable);
  const selected = new Set(selectedKeys);
  const selectedCount = descendants.reduce(
    (count, item) => count + Number(selected.has(item.key)),
    0,
  );
  return selectedCount > 0 && (!selected.has(row.key) || selectedCount < descendants.length);
};

export const toggleTableRowSelection = (options: ToggleTableRowSelectionOptions): string[] => {
  if (!options.ignoreSelectable && !options.isSelectable(options.row)) {
    return [...options.keys];
  }
  const selected = new Set(options.keys);
  const shouldSelect = options.selected == null ? !selected.has(options.row.key) : options.selected;
  const affected =
    options.isTree && !options.checkStrictly
      ? getTableDescendantRows(options.rows, options.row, true).filter(
          (row) => options.ignoreSelectable || options.isSelectable(row),
        )
      : [options.row];

  for (const row of affected) {
    if (shouldSelect) selected.add(row.key);
    else selected.delete(row.key);
  }
  return Array.from(selected);
};

export const toggleAllTableSelection = (options: ToggleAllTableSelectionOptions): string[] => {
  const summary = getTableSelectionSummary(
    options.visibleRows,
    options.selectedKeys,
    options.isSelectable,
  );
  const shouldClear =
    summary.allSelected || (summary.indeterminate && !options.selectOnIndeterminate);
  const visibleKeys = new Set(options.visibleRows.map((row) => row.key));
  const retainedKeys = options.selectedKeys.filter((key) => !visibleKeys.has(key));
  const disabledKeys = options.selectedKeys.filter((key) => {
    const row = options.visibleRows.find((item) => item.key === key);
    return row ? !options.isSelectable(row) : false;
  });
  return shouldClear
    ? [...retainedKeys, ...disabledKeys]
    : [...retainedKeys, ...disabledKeys, ...summary.selectableRows.map((row) => row.key)];
};

export const getSelectedTableRows = (
  rows: readonly TableTreeRow[],
  selectedKeys: readonly string[],
): TableRow[] => {
  const selected = new Set(selectedKeys);
  return rows.filter((row) => selected.has(row.key)).map((row) => row.raw);
};

export const createTableRowCollection = (
  allRows: readonly TableTreeRow[],
  visibleRows: readonly TableTreeRow[],
  isTree: boolean,
): TableRowCollection => ({
  allRows,
  visibleRows,
  isTree,
  resolve: (target) => resolveTableRow(allRows, target),
  normalizeSelection: (keys, checkStrictly, isSelectable) =>
    normalizeTableSelection({
      keys,
      rows: allRows,
      isTree,
      checkStrictly,
      isSelectable,
    }),
  selectionSummary: (selectedKeys, isSelectable) =>
    getTableSelectionSummary(visibleRows, selectedKeys, isSelectable),
  isRowIndeterminate: (row, selectedKeys, checkStrictly, isSelectable) =>
    isTableRowIndeterminate(allRows, row, selectedKeys, checkStrictly, isSelectable),
  toggleRowSelection: (keys, row, selected, ignoreSelectable, checkStrictly, isSelectable) =>
    toggleTableRowSelection({
      keys,
      rows: allRows,
      row,
      selected,
      ignoreSelectable,
      isTree,
      checkStrictly,
      isSelectable,
    }),
  toggleAllSelection: (selectedKeys, isSelectable, selectOnIndeterminate) =>
    toggleAllTableSelection({
      selectedKeys,
      visibleRows,
      isSelectable,
      selectOnIndeterminate,
    }),
  selectedRows: (selectedKeys) => getSelectedTableRows(allRows, selectedKeys),
});
