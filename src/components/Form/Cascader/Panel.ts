// elf-cascader-panel — 级联选择器面板

import {
  defineEmits,
  defineExpose,
  defineHtml,
  defineProps,
  defineStyle,
  useHostCssVar,
  useRef,
  useEffect,
} from "@elfui/core";

import styles from "./style.scss?inline";
import { useLocaleProvider } from "../../Providers/context";
import type {
  CascaderChangeDetail,
  CascaderFieldNames,
  CascaderModelValue,
  CascaderNodeSnapshot,
  CascaderOption,
  CascaderPanelProps,
  CascaderPathValue,
  CascaderValue,
} from "./types";

type RawOption = Record<string, unknown>;
type CheckState = "checked" | "indeterminate" | "unchecked";

interface PanelColumn {
  key: string;
  level: number;
  parentPath: RawOption[];
  options: RawOption[];
}

interface PanelConfig {
  label: string;
  value: string;
  disabled: string | ((data: CascaderOption) => boolean);
  children: string;
  leaf: string | ((data: CascaderOption) => boolean);
  multiple: boolean;
  checkStrictly: boolean;
  emitPath: boolean;
  checkOnClickNode: boolean;
  checkOnClickLeaf: boolean;
  showPrefix: boolean;
}

const props = defineProps<CascaderPanelProps>({
  modelValue: { type: null, default: () => [] },
  options: { type: Array, default: () => [] as CascaderOption[] },
  multiple: { type: Boolean, default: false },
  checkable: { type: Boolean, default: false },
  checkStrictly: { type: Boolean, default: false },
  emitPath: { type: Boolean, default: true },
  showPrefix: { type: Boolean, default: true },
  virtualScroll: { type: Boolean, default: false },
  itemSize: { type: Number, default: 34 },
  height: { type: Number, default: 204 },
  props: {
    type: Object,
    default: () => ({
      label: "label",
      value: "value",
      disabled: "disabled",
      children: "children",
      leaf: "leaf",
      multiple: false,
      checkStrictly: false,
      emitPath: true,
      checkOnClickNode: false,
      checkOnClickLeaf: true,
      showPrefix: true,
    }),
  },
});

const locale = useLocaleProvider();

const emit = defineEmits<{
  "update:modelValue": [value: CascaderModelValue];
  change: [detail: CascaderChangeDetail];
  "expand-change": [value: CascaderPathValue];
  close: [];
}>();

const selectedValues = useRef<CascaderPathValue[]>([]);
const activePath = useRef<RawOption[]>([]);

const config = (): PanelConfig => {
  const o = (props.props || {}) as CascaderFieldNames;
  return {
    label: o.label || "label",
    value: o.value || "value",
    disabled: o.disabled || "disabled",
    children: o.children || "children",
    leaf: o.leaf || "leaf",
    multiple: Boolean(props.multiple || props.checkable || o.multiple),
    checkStrictly: Boolean(props.checkStrictly || o.checkStrictly),
    emitPath: props.emitPath !== false && o.emitPath !== false,
    checkOnClickNode: Boolean(o.checkOnClickNode),
    checkOnClickLeaf: o.checkOnClickLeaf !== false,
    showPrefix: props.showPrefix !== false && o.showPrefix !== false,
  };
};

const rawOptions = (): RawOption[] => (Array.isArray(props.options) ? (props.options as RawOption[]) : []);

const optionLabel = (option: RawOption): string => String(option[config().label] ?? option[config().value] ?? "");

const optionValue = (option: RawOption): CascaderValue =>
  (option[config().value] ?? option[config().label] ?? "") as CascaderValue;

const optionDisabled = (option: RawOption): boolean => {
  const disabled = config().disabled;
  if (typeof disabled === "function") return disabled(option as CascaderOption);
  return Boolean(option[disabled]);
};

const optionChildren = (option: RawOption): RawOption[] => {
  const children = option[config().children];
  return Array.isArray(children) ? (children as RawOption[]) : [];
};

const optionLeaf = (option: RawOption): boolean => {
  const leaf = config().leaf;
  if (typeof leaf === "function") return leaf(option as CascaderOption);
  if (leaf in option) return Boolean(option[leaf]);
  return optionChildren(option).length === 0;
};

const sameValue = (a: unknown, b: unknown): boolean => Object.is(a, b);

const samePathValue = (a: CascaderPathValue, b: CascaderPathValue): boolean =>
  a.length === b.length && a.every((value, index) => sameValue(value, b[index]));

const pathValues = (path: RawOption[]): CascaderPathValue => path.map(optionValue);

const pathLabels = (path: RawOption[]): string[] => path.map(optionLabel);

const findPathByValues = (
  values: CascaderPathValue,
  options = rawOptions(),
  level = 0,
  path: RawOption[] = [],
): RawOption[] => {
  if (level >= values.length) return path;
  for (const option of options) {
    if (!sameValue(optionValue(option), values[level])) continue;
    const nextPath = [...path, option];
    if (level === values.length - 1) return nextPath;
    return findPathByValues(values, optionChildren(option), level + 1, nextPath);
  }
  return [];
};

const findPathByValue = (value: CascaderValue, options = rawOptions(), path: RawOption[] = []): RawOption[] => {
  for (const option of options) {
    const nextPath = [...path, option];
    if (sameValue(optionValue(option), value)) return nextPath;
    const childPath = findPathByValue(value, optionChildren(option), nextPath);
    if (childPath.length > 0) return childPath;
  }
  return [];
};

const normalizePathValue = (value: unknown): CascaderPathValue => {
  if (!Array.isArray(value)) return value == null || value === "" ? [] : [value as CascaderValue];
  return (value as unknown[]).filter((item) => item != null && item !== "").map((item) => item as CascaderValue);
};

const toValuePaths = (value: unknown): CascaderPathValue[] => {
  if (!config().emitPath) {
    const values = Array.isArray(value) ? value : value == null || value === "" ? [] : [value];
    return values
      .map((item) => findPathByValue(item as CascaderValue))
      .filter((path) => path.length > 0)
      .map(pathValues);
  }
  if (!Array.isArray(value)) {
    const path = normalizePathValue(value);
    return path.length > 0 ? [path] : [];
  }
  if (value.length === 0) return [];
  if (Array.isArray(value[0])) {
    return (value as unknown[]).map(normalizePathValue).filter((path) => path.length > 0);
  }
  const path = normalizePathValue(value);
  return path.length > 0 ? [path] : [];
};

const selectedPaths = (): RawOption[][] =>
  selectedValues.value.map((value) => findPathByValues(value)).filter((path) => path.length > 0);

const selectedPath = (): RawOption[] => selectedPaths()[0] ?? [];

const modelValueFromPaths = (paths: CascaderPathValue[]): CascaderModelValue => {
  if (config().emitPath) return config().multiple ? paths : (paths[0] ?? []);
  const values = paths
    .map((path) => path[path.length - 1])
    .filter((value): value is CascaderValue => value !== undefined);
  return config().multiple ? values : (values[0] ?? "");
};

const detailFromPaths = (paths: CascaderPathValue[]): CascaderChangeDetail => {
  const optionPaths = paths.map((value) => findPathByValues(value));
  if (config().multiple) {
    return {
      value: modelValueFromPaths(paths),
      path: optionPaths.map(pathLabels),
      selected: optionPaths as CascaderOption[][],
      multiple: true,
    };
  }
  const first = optionPaths[0] ?? [];
  return {
    value: modelValueFromPaths(paths),
    path: pathLabels(first),
    selected: first as CascaderOption[],
    multiple: false,
  };
};

const emitChange = (paths: CascaderPathValue[]): void => {
  emit("update:modelValue", modelValueFromPaths(paths));
  emit("change", detailFromPaths(paths));
};

const optionPath = (option: RawOption, column: PanelColumn): RawOption[] => [...column.parentPath, option];

const valuePathKey = (path: CascaderPathValue): string => JSON.stringify(path);

const optionPathKey = (option: RawOption, column: PanelColumn): string =>
  valuePathKey(pathValues(optionPath(option, column)));

const findPathByKey = (key: string, options = rawOptions(), path: RawOption[] = []): RawOption[] => {
  for (const option of options) {
    const nextPath = [...path, option];
    if (valuePathKey(pathValues(nextPath)) === key) return nextPath;
    const childPath = findPathByKey(key, optionChildren(option), nextPath);
    if (childPath.length > 0) return childPath;
  }
  return [];
};

const collectLeafValuePaths = (path: RawOption[]): CascaderPathValue[] => {
  const current = path[path.length - 1];
  if (!current || optionDisabled(current)) return [];
  const children = optionChildren(current).filter((item) => !optionDisabled(item));
  if (children.length === 0 || optionLeaf(current) || config().checkStrictly) return [pathValues(path)];
  return children.flatMap((child) => collectLeafValuePaths([...path, child]));
};

const isPathSelected = (value: CascaderPathValue): boolean =>
  selectedValues.value.some((item) => samePathValue(item, value));

const setSinglePath = (path: RawOption[]): void => {
  const next = [pathValues(path)];
  selectedValues.set(next);
  activePath.set(path);
  emitChange(next);
  emit("close");
};

const setMultiplePath = (path: RawOption[]): void => {
  const leaves = collectLeafValuePaths(path);
  if (leaves.length === 0) return;
  const current = selectedValues.peek();
  const allSelected = leaves.every((leaf) => current.some((item) => samePathValue(item, leaf)));
  const next = allSelected
    ? current.filter((item) => !leaves.some((leaf) => samePathValue(item, leaf)))
    : [...current, ...leaves.filter((leaf) => !current.some((item) => samePathValue(item, leaf)))];
  selectedValues.set(next);
  activePath.set(path);
  emitChange(next);
};

const toggleStrictPath = (path: RawOption[]): void => {
  const value = pathValues(path);
  const current = selectedValues.peek();
  const selected = current.some((item) => samePathValue(item, value));
  const next = selected ? current.filter((item) => !samePathValue(item, value)) : [...current, value];
  selectedValues.set(next);
  activePath.set(path);
  emitChange(next);
};

const onOptionPathClick = (path: RawOption[], event?: Event): void => {
  event?.preventDefault();
  event?.stopPropagation();
  const option = path[path.length - 1];
  if (!option || optionDisabled(option)) return;
  activePath.set(path);
  const hasChildren = optionChildren(option).length > 0;
  if (hasChildren) emit("expand-change", pathValues(path));
  if (config().multiple) {
    if (config().checkStrictly) {
      if (config().checkOnClickNode || (!hasChildren && config().checkOnClickLeaf)) {
        toggleStrictPath(path);
      }
      return;
    }
    if (props.checkable || config().checkOnClickNode || !hasChildren) setMultiplePath(path);
    return;
  }
  if (hasChildren && !config().checkStrictly) return;
  setSinglePath(path);
};

const onColumnsClick = (event: Event): void => {
  const target = event.target as HTMLElement | null;
  const optionButton = target?.closest?.(".option") as HTMLElement | null;
  const key = optionButton?.dataset.pathKey;
  if (!key) return;
  const path = findPathByKey(key);
  if (path.length > 0) onOptionPathClick(path, event);
};

const isActive = (option: RawOption, column: PanelColumn): boolean =>
  sameValue(optionValue(activePath.value[column.level] ?? {}), optionValue(option));

const checkState = (option: RawOption, column: PanelColumn): CheckState => {
  const leaves = collectLeafValuePaths(optionPath(option, column));
  if (leaves.length === 0) return "unchecked";
  const checkedCount = leaves.filter(isPathSelected).length;
  if (checkedCount === leaves.length) return "checked";
  return checkedCount > 0 ? "indeterminate" : "unchecked";
};

const isSelected = (option: RawOption, column: PanelColumn): boolean => {
  if (config().multiple) return checkState(option, column) === "checked";
  const path = selectedPath();
  return sameValue(optionValue(path[column.level] ?? {}), optionValue(option));
};

const isIndeterminate = (option: RawOption, column: PanelColumn): boolean =>
  config().multiple && checkState(option, column) === "indeterminate";

const checkboxClass = (option: RawOption, column: PanelColumn): Record<string, boolean> => ({
  "is-checked": isSelected(option, column),
  "is-indeterminate": isIndeterminate(option, column),
});

const ariaChecked = (option: RawOption, column: PanelColumn): string | null => {
  if (!config().multiple || !config().showPrefix) return null;
  const state = checkState(option, column);
  if (state === "checked") return "true";
  if (state === "indeterminate") return "mixed";
  return "false";
};

const columns = (): PanelColumn[] => {
  const path = activePath.value.length > 0 ? activePath.value : selectedPath();
  const result: PanelColumn[] = [{ key: "root", level: 0, parentPath: [], options: rawOptions() }];
  for (let level = 0; level < path.length; level += 1) {
    const children = optionChildren(path[level]!);
    if (children.length === 0) break;
    const parentPath = path.slice(0, level + 1);
    result.push({
      key: String(optionValue(path[level]!)),
      level: level + 1,
      parentPath,
      options: children,
    });
  }
  return result;
};

const optionKey = (option: RawOption, level: number): string => `${level}-${String(optionValue(option))}`;

const optionClass = (option: RawOption, column: PanelColumn): Record<string, boolean> => ({
  "is-active": isActive(option, column),
  "is-selected": isSelected(option, column),
  "is-indeterminate": isIndeterminate(option, column),
  "is-disabled": optionDisabled(option),
  "has-children": optionChildren(option).length > 0,
});

const nodeSnapshot = (path: RawOption[]): CascaderNodeSnapshot | null => {
  const option = path[path.length - 1];
  if (!option) return null;
  const values = pathValues(path);
  return {
    value: optionValue(option),
    label: optionLabel(option),
    level: path.length,
    data: option as CascaderOption,
    pathValues: values,
    pathLabels: pathLabels(path),
    checked: isPathSelected(values),
    isLeaf: optionLeaf(option),
  };
};

const getCheckedNodes = (leafOnly = false): CascaderNodeSnapshot[] =>
  selectedPaths()
    .filter((path) => !leafOnly || optionLeaf(path[path.length - 1] ?? {}))
    .map(nodeSnapshot)
    .filter((node): node is CascaderNodeSnapshot => Boolean(node));

const clearCheckedNodes = (): void => {
  selectedValues.set([]);
  emitChange([]);
};

useEffect(() => {
  const next = toValuePaths(props.modelValue);
  selectedValues.set(config().multiple ? next : next.slice(0, 1));
  // Controlled multi-select updates must not force the open columns back to the
  // first selected node. Keep the user's current navigation path once established.
  if (activePath.peek().length === 0) activePath.set(findPathByValues(next[0] ?? []));
});

useHostCssVar("--_cascader-height", () => `${Math.max(120, Number(props.height) || 204)}px`);
useHostCssVar("--_cascader-item-size", () => `${Math.max(24, Number(props.itemSize) || 34)}px`);
useHostCssVar("--_cascader-column-count", () => String(columns().length));
defineExpose({ getCheckedNodes, clearCheckedNodes });
defineStyle(styles);

const CascaderPanel = defineHtml<CascaderPanelProps>(`
  <div class="panel" part="panel">
    <div v-if=${rawOptions().length === 0} class="empty">
      <slot name="empty">${locale.t("table.empty")}</slot>
    </div>
    <div v-else class="columns">
      <div v-for="column in columns()" :key="column.key" class="column">
        <button v-for="option in column.options" :key="optionKey(option, column.level)"
          :data-path-key="optionPathKey(option, column)" type="button" :class="['option', optionClass(option, column)]"
          :disabled="optionDisabled(option)"
          :role=${config().multiple && config().showPrefix ? "menuitemcheckbox" : "menuitem"}
          :aria-checked="ariaChecked(option, column)" @click="onOptionPathClick(optionPath(option, column), $event)">
          <span v-if=${config().multiple && config().showPrefix} class="option-checkbox"
            :class="checkboxClass(option, column)">
            <span class="checkbox-mark"></span>
          </span>
          <span class="option-label">
            <slot>{{ optionLabel(option) }}</slot>
          </span>
          <span v-if="optionChildren(option).length > 0" class="option-arrow">›</span>
          <span v-else-if="isSelected(option, column) && !(config().multiple && config().showPrefix)"
            class="check">✓</span>
        </button>
      </div>
    </div>
  </div>
`);

export { CascaderPanel };
