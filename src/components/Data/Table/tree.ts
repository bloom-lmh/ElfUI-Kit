import type { TableRow, TableTreeProps } from "./types";
import {
  createTableRowCollection,
  type TableRowCollection,
} from "./selection-model";
import {
  buildTableTreeRows,
  type BuildTableTreeOptions,
  type TableTreeRow,
} from "../table-tree-model";

export type { BuildTableTreeOptions, TableTreeRow } from "../table-tree-model";

export interface TableTreeConfig {
  children: string;
  hasChildren: string;
  checkStrictly: boolean;
}

export const normalizeTableTreeProps = (value: TableTreeProps | undefined): TableTreeConfig => ({
  children: String(value?.children || "children"),
  hasChildren: String(value?.hasChildren || "hasChildren"),
  checkStrictly: Boolean(value?.checkStrictly),
});

export const buildTableTree = (
  options: BuildTableTreeOptions,
): {
  all: TableTreeRow[];
  visible: TableTreeRow[];
  isTree: boolean;
  collection: TableRowCollection;
} => {
  const tree = buildTableTreeRows(options);
  return {
    ...tree,
    collection: createTableRowCollection(tree.all, tree.visible, tree.isTree),
  };
};
