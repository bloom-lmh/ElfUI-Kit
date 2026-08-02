import type { TableRow } from "./Table/types";

export interface TableTreeRow {
  key: string;
  index: number;
  raw: TableRow;
  level: number;
  parentKey: string;
  path: string[];
  hasChildren: boolean;
}

export interface BuildTableTreeOptions {
  roots: TableRow[];
  expandedKeys: ReadonlySet<string>;
  childrenOf: (row: TableRow, key: string) => TableRow[];
  keyOf: (row: TableRow, fallback: string) => string;
  isExpandable: (row: TableRow, key: string, children: TableRow[]) => boolean;
  sortRows: (rows: TableRow[]) => TableRow[];
  matchesRow?: (row: TableRow) => boolean;
}

interface BuiltNode extends TableTreeRow {
  children: BuiltNode[];
  matched: boolean;
}

export const buildTableTreeRows = (
  options: BuildTableTreeOptions,
): {
  all: TableTreeRow[];
  visible: TableTreeRow[];
  isTree: boolean;
} => {
  const all: BuiltNode[] = [];
  const visible: BuiltNode[] = [];
  let sourceIndex = 0;
  let isTree = false;

  const build = (
    rows: TableRow[],
    level: number,
    parentKey: string,
    parentPath: string[],
    ancestors: ReadonlySet<TableRow>,
  ): BuiltNode[] =>
    options.sortRows(rows).flatMap((raw: TableRow, siblingIndex: number) => {
      if (ancestors.has(raw)) return [];
      const fallback = [...parentPath, String(siblingIndex)].join("-");
      const key = options.keyOf(raw, fallback);
      const children = options.childrenOf(raw, key);
      const hasChildren = options.isExpandable(raw, key, children);
      const path = [...parentPath, key];
      const nextAncestors = new Set(ancestors);
      nextAncestors.add(raw);
      const childNodes = build(children, level + 1, key, path, nextAncestors);
      const selfMatches = options.matchesRow ? options.matchesRow(raw) : true;
      const row: BuiltNode = {
        key,
        index: sourceIndex++,
        raw,
        level,
        parentKey,
        path,
        hasChildren,
        children: childNodes,
        matched: selfMatches || childNodes.some((child: BuiltNode) => child.matched),
      };
      if (hasChildren) isTree = true;
      return [row];
    });

  const roots = build(options.roots, 0, "", [], new Set());
  const appendAll = (nodes: BuiltNode[]): void => {
    for (const node of nodes) {
      all.push(node);
      appendAll(node.children);
    }
  };
  const appendVisible = (nodes: BuiltNode[]): void => {
    for (const node of nodes) {
      if (!node.matched) continue;
      visible.push(node);
      if (options.expandedKeys.has(node.key)) appendVisible(node.children);
    }
  };
  appendAll(roots);
  appendVisible(roots);

  const normalizedAll = all.map((built: BuiltNode): TableTreeRow => {
    const { children: _children, matched: _matched, ...row } = built;
    return row;
  });
  const normalizedVisible = visible.map((built: BuiltNode, index: number): TableTreeRow => {
    const { children: _children, matched: _matched, ...row } = built;
    return { ...row, index };
  });
  return {
    all: normalizedAll,
    visible: normalizedVisible,
    isTree,
  };
};
