import type {
  TreeCollection,
  TreeFieldConfig,
} from "../../Data/Tree/tree-collection";
import type { TreeNode } from "../../Data/Tree/types";
import type { TreeSelectModelValue, TreeSelectValue } from "./types";

export interface TreeSelectEntry {
  key: string;
  value: TreeSelectValue;
  label: string;
  node?: TreeNode;
}

export const normalizeTreeSelectKeys = (
  value: TreeSelectModelValue,
  multiple: boolean,
): string[] => {
  const source = multiple ? (Array.isArray(value) ? value : []) : [value];
  return source
    .filter(
      (item): item is TreeSelectValue =>
        typeof item === "string" || typeof item === "number",
    )
    .map(String)
    .filter(Boolean);
};

export const treeSelectEntry = (
  collection: TreeCollection,
  fields: TreeFieldConfig,
  key: string,
): TreeSelectEntry => {
  const row = collection.find(key);
  const rawValue = row?.raw[fields.key];
  const value =
    typeof rawValue === "string" || typeof rawValue === "number"
      ? rawValue
      : key;
  return {
    key,
    value,
    label: row?.label || String(value),
    ...(row ? { node: row.raw as TreeNode } : {}),
  };
};

export const treeSelectEntries = (
  collection: TreeCollection,
  fields: TreeFieldConfig,
  keys: readonly string[],
): TreeSelectEntry[] =>
  keys.map((key) => treeSelectEntry(collection, fields, key));

export const treeSelectModelValue = (
  entries: readonly TreeSelectEntry[],
  multiple: boolean,
): TreeSelectModelValue =>
  multiple ? entries.map((entry) => entry.value) : (entries[0]?.value ?? "");
