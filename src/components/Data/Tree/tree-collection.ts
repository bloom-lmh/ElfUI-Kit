import type { TreeFieldNames, TreeNode, TreeProps } from "./types";

export interface TreeFieldConfig {
  key: string;
  label: string;
  children: string;
  disabled: string;
  isLeaf: string;
  icon: string;
  class: string;
}

export interface TreeViewNode {
  key: string;
  label: string;
  icon: string;
  className: string;
  level: number;
  disabled: boolean;
  isLeaf: boolean;
  hasChildren: boolean;
  parentKey: string;
  path: string[];
  raw: Record<string, unknown>;
}

export interface TreeCollection {
  readonly rows: readonly TreeViewNode[];
  readonly byKey: Readonly<Record<string, TreeViewNode>>;
  find(key: string): TreeViewNode | undefined;
  childrenOf(node: TreeViewNode): readonly TreeViewNode[];
  descendantsOf(node: TreeViewNode, includeSelf?: boolean): TreeViewNode[];
  isDescendant(node: TreeViewNode, ancestorKey: string): boolean;
  normalizeExpanded(keys: readonly string[], autoExpandParent: boolean): string[];
  normalizeChecked(keys: readonly string[], checkStrictly: boolean, leafOnly?: boolean): string[];
  cascadeChecked(keys: readonly string[], checkStrictly: boolean): string[];
  visible(
    expandedKeys: readonly string[],
    keyword: string,
    filterMethod?: TreeProps["filterNodeMethod"]
  ): TreeViewNode[];
}

export const treeChildrenOf = (
  node: Record<string, unknown>,
  field: string
): Record<string, unknown>[] => {
  const children = node[field];
  return Array.isArray(children) ? children as Record<string, unknown>[] : [];
};

export const resolveTreeFields = (
  nodeKey: string,
  custom: TreeFieldNames = {}
): TreeFieldConfig => ({
  key: String(nodeKey || custom.key || "key"),
  label: custom.label || "label",
  children: custom.children || "children",
  disabled: custom.disabled || "disabled",
  isLeaf: custom.isLeaf || "isLeaf",
  icon: custom.icon || "icon",
  class: custom.class || "class",
});

export const treeKeyOf = (value: unknown, fields: TreeFieldConfig): string => {
  if (typeof value === "string" || typeof value === "number") return String(value);
  if (value && typeof value === "object") {
    return String((value as Record<string, unknown>)[fields.key] ?? "");
  }
  return "";
};

export const buildTreeCollection = (
  data: readonly TreeNode[],
  fields: TreeFieldConfig,
  lazy: boolean
): TreeCollection => {
  const rows: TreeViewNode[] = [];
  const byKey: Record<string, TreeViewNode> = {};
  const childrenByParent = new Map<string, TreeViewNode[]>();

  const walk = (
    items: readonly Record<string, unknown>[],
    level: number,
    parentKey: string,
    parentPath: readonly string[]
  ): void => {
    items.forEach((raw, index) => {
      const fallbackKey = [...parentPath, String(index)].join("-");
      const key = String(raw[fields.key] ?? fallbackKey);
      const children = treeChildrenOf(raw, fields.children);
      const row: TreeViewNode = {
        key,
        label: String(raw[fields.label] ?? key),
        icon: String(raw[fields.icon] ?? ""),
        className: String(raw[fields.class] ?? ""),
        level,
        disabled: Boolean(raw[fields.disabled]),
        isLeaf: Boolean(raw[fields.isLeaf]) || (!lazy && children.length === 0),
        hasChildren: children.length > 0 || (lazy && raw[fields.isLeaf] !== true),
        parentKey,
        path: [...parentPath, key],
        raw,
      };
      rows.push(row);
      byKey[key] = row;
      const siblings = childrenByParent.get(parentKey) ?? [];
      siblings.push(row);
      childrenByParent.set(parentKey, siblings);
      if (children.length > 0) walk(children, level + 1, key, row.path);
    });
  };

  walk(data as readonly Record<string, unknown>[], 0, "", []);

  const find = (key: string): TreeViewNode | undefined => byKey[key];
  const childrenOf = (node: TreeViewNode): readonly TreeViewNode[] =>
    childrenByParent.get(node.key) ?? [];
  const isDescendant = (node: TreeViewNode, ancestorKey: string): boolean =>
    node.key !== ancestorKey && node.path.includes(ancestorKey);
  const descendantsOf = (node: TreeViewNode, includeSelf = false): TreeViewNode[] =>
    rows.filter((candidate) =>
      (includeSelf && candidate.key === node.key) || isDescendant(candidate, node.key)
    );
  const prune = (keys: readonly string[]): string[] =>
    keys.filter((key) => Boolean(byKey[key]));

  const normalizeExpanded = (
    keys: readonly string[],
    autoExpandParent: boolean
  ): string[] => {
    const normalized = new Set(prune(keys));
    if (!autoExpandParent) return [...normalized];
    for (const key of normalized) {
      for (const ancestor of find(key)?.path.slice(0, -1) ?? []) normalized.add(ancestor);
    }
    return [...normalized];
  };

  const syncCheckedParents = (checked: Set<string>, checkStrictly: boolean): void => {
    if (checkStrictly) return;
    for (const row of [...rows].sort((left, right) => right.level - left.level)) {
      if (!row.hasChildren || row.disabled) continue;
      const children = childrenOf(row).filter((child) => !child.disabled);
      if (children.length > 0 && children.every((child) => checked.has(child.key))) {
        checked.add(row.key);
      } else {
        checked.delete(row.key);
      }
    }
  };

  const normalizeChecked = (
    keys: readonly string[],
    checkStrictly: boolean,
    leafOnly = false
  ): string[] => {
    const checked = new Set<string>();
    for (const key of prune(keys)) {
      const row = find(key);
      if (!row || row.disabled || (leafOnly && row.hasChildren)) continue;
      const affected = !checkStrictly && row.hasChildren && !leafOnly
        ? descendantsOf(row, true)
        : [row];
      for (const item of affected) {
        if (!item.disabled) checked.add(item.key);
      }
    }
    syncCheckedParents(checked, checkStrictly);
    return [...checked];
  };

  const cascadeChecked = (
    keys: readonly string[],
    checkStrictly: boolean
  ): string[] => {
    const checked = new Set(prune(keys));
    syncCheckedParents(checked, checkStrictly);
    return [...checked];
  };

  const visible = (
    expandedKeys: readonly string[],
    rawKeyword: string,
    filterMethod?: TreeProps["filterNodeMethod"]
  ): TreeViewNode[] => {
    const keyword = rawKeyword.trim().toLowerCase();
    if (!keyword) {
      const expanded = new Set(expandedKeys);
      return rows.filter((row) =>
        row.level === 0 || row.path.slice(0, -1).every((key) => expanded.has(key))
      );
    }

    const matched = new Set<string>();
    for (const row of rows) {
      const matches = filterMethod
        ? Boolean(filterMethod(rawKeyword, row.raw as TreeNode))
        : row.label.toLowerCase().includes(keyword);
      if (!matches) continue;
      row.path.forEach((key) => matched.add(key));
    }
    return rows.filter((row) => matched.has(row.key));
  };

  return {
    rows,
    byKey,
    find,
    childrenOf,
    descendantsOf,
    isDescendant,
    normalizeExpanded,
    normalizeChecked,
    cascadeChecked,
    visible,
  };
};
