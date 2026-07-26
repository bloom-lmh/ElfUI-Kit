// elf-cascader — 级联选择器

import {
  defineEmits,
  defineExpose,
  defineHtml,
  defineProps,
  defineStyle,
  inject,
  onMounted,
  onUnmounted,
  useClickOutside,
  useComputed,
  useEffect,
  useEventListener,
  useHost,
  useHostAttr,
  useHostCssVar,
  useHostFlag,
  useRef,
} from "@elfui/core";

import { useDisabled, useFormItem } from "../../../composables";
import { computeAnchoredPosition, listenForExternalOverlayMotion } from "../../Common/anchored-overlay";
import { useLocaleProvider } from "../../Providers/context";
import { FORM_ITEM_KEY } from "../context";
import styles from "./style.scss?inline";
import { normalizeFieldVariant } from "../../../types/field";
import type {
  CascaderBeforeFilter,
  CascaderChangeDetail,
  CascaderEmits,
  CascaderExpandTrigger,
  CascaderFilterMethod,
  CascaderFieldNames,
  CascaderModelValue,
  CascaderNodeSnapshot,
  CascaderOption,
  CascaderPanelMode,
  CascaderPlacement,
  CascaderPathValue,
  CascaderPopperModifier,
  CascaderPopperOptions,
  CascaderProps,
  CascaderSlots,
  CascaderShowCheckedStrategy,
  CascaderValue,
  CascaderValueOnClear,
  CascaderVariant,
} from "./types";

export type {
  CascaderBeforeFilter,
  CascaderChangeDetail,
  CascaderElement,
  CascaderEmits,
  CascaderExpose,
  CascaderExpandTrigger,
  CascaderFilterMethod,
  CascaderFieldNames,
  CascaderModelValue,
  CascaderMultipleValue,
  CascaderNodeSnapshot,
  CascaderOption,
  CascaderPanelProps,
  CascaderPanelMode,
  CascaderPlacement,
  CascaderPathValue,
  CascaderPopperModifier,
  CascaderPopperOptions,
  CascaderProps,
  CascaderSize,
  CascaderShowCheckedStrategy,
  CascaderSlots,
  CascaderValue,
  CascaderValueOnClear,
} from "./types";

const CASCADER_OPEN_EVENT = "elf-cascader-open";

type RawOption = Record<string, unknown>;
type CheckState = "checked" | "indeterminate" | "unchecked";

const LAZY_CHILDREN = Symbol("elf-cascader-lazy-children");
const LAZY_RESOLVED = Symbol("elf-cascader-lazy-resolved");
const LAZY_LOADING = Symbol("elf-cascader-lazy-loading");

type LazyOption = RawOption & {
  [LAZY_CHILDREN]?: RawOption[];
  [LAZY_RESOLVED]?: boolean;
  [LAZY_LOADING]?: boolean;
};

interface CascaderColumn {
  key: string;
  level: number;
  parentPath: RawOption[];
  options: RawOption[];
}

interface CascaderTagEntry {
  key: string;
  label: string;
  path: RawOption[];
  value: CascaderPathValue;
}

interface CascaderTreeEntry {
  key: string;
  level: number;
  option: RawOption;
  path: RawOption[];
  column: CascaderColumn;
}

interface CascaderConfig extends Required<Omit<CascaderFieldNames, "disabled" | "leaf" | "lazyLoad">> {
  disabled: string | ((data: CascaderOption) => boolean);
  leaf: string | ((data: CascaderOption) => boolean);
  lazyLoad?: CascaderFieldNames["lazyLoad"];
}

const props = defineProps<CascaderProps>({
  modelValue: { type: Array, default: () => [] as CascaderPathValue },
  options: { type: Array, default: () => [] as CascaderOption[] },
  size: { type: String, default: "" },
  variant: { type: String, default: "filled" },
  backgroundColor: { type: String, default: "" },
  label: { type: String, default: "" },
  placeholder: { type: String, default: "" },
  disabled: { type: Boolean, default: false },
  clearable: { type: Boolean, default: false },
  clearIcon: { type: String, default: "" },
  multiple: { type: Boolean, default: false },
  checkable: { type: Boolean, default: false },
  panelMode: { type: String, default: "auto" },
  treeThreshold: { type: Number, default: 3 },
  separator: { type: String, default: " / " },
  showAllLevels: { type: Boolean, default: true },
  collapseTags: { type: Boolean, default: false },
  collapseTagsTooltip: { type: Boolean, default: false },
  maxCollapseTags: { type: Number, default: 1 },
  maxCollapseTagsTooltipHeight: { type: null, default: "" },
  checkStrictly: { type: Boolean, default: false },
  emitPath: { type: Boolean, default: true },
  expandTrigger: { type: String, default: "click" },
  checkOnClickNode: { type: Boolean, default: false },
  checkOnClickLeaf: { type: Boolean, default: true },
  showPrefix: { type: Boolean, default: true },
  showCheckedStrategy: { type: String, default: "child" },
  filterable: { type: Boolean, default: false },
  filterMethod: { type: Function, default: undefined },
  beforeFilter: { type: Function, default: undefined },
  debounce: { type: Number, default: 300 },
  popperClass: { type: String, default: "" },
  popperStyle: { type: Object, default: () => ({}) },
  popperOptions: { type: Object, default: () => ({}) },
  teleported: { type: Boolean, default: true },
  appendTo: { type: [String, Object], default: "body" },
  persistent: { type: Boolean, default: true },
  placement: { type: String, default: "bottom-start" },
  fitInputWidth: { type: Boolean, default: false },
  fallbackPlacements: { type: Array, default: () => ["bottom-start", "top-start", "bottom-end", "top-end"] },
  effect: { type: String, default: "light" },
  tagType: { type: String, default: "info" },
  tagEffect: { type: String, default: "light" },
  emptyValues: { type: Array, default: () => ["", null, undefined] },
  valueOnClear: { type: null, default: undefined },
  validateEvent: { type: Boolean, default: true },
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
      expandTrigger: "click",
      multiple: false,
      checkStrictly: false,
      emitPath: true,
      checkOnClickNode: false,
      checkOnClickLeaf: true,
      showPrefix: true,
    }),
  },
});

const emit = defineEmits<CascaderEmits>();

const fi = useFormItem(() => props.size as string);
const formItem = inject(FORM_ITEM_KEY);
const isDisabled = useDisabled(() => Boolean(props.disabled));
const host = useHost();
const locale = useLocaleProvider();
const open = useRef(false);
const selectedValues = useRef<CascaderPathValue[]>([]);
const activePath = useRef<RawOption[]>([]);
const query = useRef("");
const filtering = useRef(false);
const filteredPaths = useRef<RawOption[][]>([]);
const overlayStyle = useRef<Record<string, string>>({});
const resolvedPlacement = useRef<CascaderPlacement>("bottom-start");
const lazyRevision = useRef(0);

let filterTimer: ReturnType<typeof setTimeout> | null = null;
let filterRequest = 0;
let cleanupAnchoredOverlay = (): void => {};
let overlayFrame = 0;
let mounted = false;

const placeholderText = (): string => props.placeholder || locale.t("common.select");

const resolvePlacement = (value: unknown): CascaderPlacement => {
  const next = String(value || "bottom-start") as CascaderPlacement;
  return ["top", "top-start", "top-end", "bottom", "bottom-start", "bottom-end"].includes(next) ? next : "bottom-start";
};

const toStyleObject = (value: unknown): Record<string, string> => {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  return Object.fromEntries(
    Object.entries(value as Record<string, string | number>).map(([key, item]) => [key, String(item)]),
  );
};

const config = (): CascaderConfig => {
  const o = (props.props || {}) as CascaderFieldNames;
  const topExpandTrigger = String(props.expandTrigger || "") as CascaderExpandTrigger;
  const propExpandTrigger = String(o.expandTrigger || "") as CascaderExpandTrigger;
  return {
    label: o.label || "label",
    value: o.value || "value",
    disabled: o.disabled || "disabled",
    children: o.children || "children",
    leaf: o.leaf || "leaf",
    expandTrigger:
      topExpandTrigger === "hover" || topExpandTrigger === "click"
        ? topExpandTrigger
        : propExpandTrigger === "hover"
          ? "hover"
          : "click",
    multiple: Boolean(props.multiple || props.checkable || o.multiple),
    checkStrictly: Boolean(props.checkStrictly || o.checkStrictly),
    emitPath: props.emitPath !== false && o.emitPath !== false,
    lazy: Boolean(o.lazy),
    hoverThreshold: Number(o.hoverThreshold ?? 500),
    checkOnClickNode: Boolean(props.checkOnClickNode || o.checkOnClickNode),
    checkOnClickLeaf: props.checkOnClickLeaf !== false && o.checkOnClickLeaf !== false,
    showPrefix: props.showPrefix !== false && o.showPrefix !== false,
    lazyLoad: o.lazyLoad,
  };
};

const fieldNames = (): Required<Pick<CascaderFieldNames, "label" | "value" | "children">> => {
  const c = config();
  return {
    label: c.label,
    value: c.value,
    children: c.children,
  };
};

const isMultiple = (): boolean => config().multiple;

const isCheckStrictly = (): boolean => config().checkStrictly;

const shouldEmitPath = (): boolean => config().emitPath;

const showPrefix = (): boolean => isMultiple() && config().showPrefix;

const showCheckedStrategy = (): CascaderShowCheckedStrategy =>
  props.showCheckedStrategy === "parent" ? "parent" : "child";

const isEmptyValue = (value: unknown): boolean =>
  (Array.isArray(props.emptyValues) ? props.emptyValues : ["", null, undefined]).some((item) => Object.is(item, value));

const normalizePathValue = (value: unknown): CascaderPathValue => {
  if (!Array.isArray(value)) return value == null || value === "" ? [] : [value as CascaderValue];
  return (value as unknown[]).filter((item) => item != null && item !== "").map((item) => item as CascaderValue);
};

const toValuePaths = (value: unknown): CascaderPathValue[] => {
  if (!Array.isArray(value) && isEmptyValue(value)) return [];
  if (!shouldEmitPath()) {
    const values = (Array.isArray(value) ? value : [value]).filter((item) => !isEmptyValue(item));
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

const rawOptions = (): RawOption[] => (Array.isArray(props.options) ? (props.options as RawOption[]) : []);

const optionLabel = (option: RawOption): string => {
  const fields = fieldNames();
  return String(option[fields.label] ?? option[fields.value] ?? "");
};

const optionValue = (option: RawOption): CascaderValue => {
  const fields = fieldNames();
  return (option[fields.value] ?? option[fields.label] ?? "") as CascaderValue;
};

const optionDisabled = (option: RawOption): boolean => {
  const disabled = config().disabled;
  if (typeof disabled === "function") return disabled(option as CascaderOption);
  return Boolean(option[disabled]);
};

const optionChildren = (option: RawOption): RawOption[] => {
  void lazyRevision.value;
  const fields = fieldNames();
  const children = option[fields.children];
  if (Array.isArray(children)) return children as RawOption[];
  return (option as LazyOption)[LAZY_CHILDREN] || [];
};

const optionLeaf = (option: RawOption): boolean => {
  const leaf = config().leaf;
  if (typeof leaf === "function") return leaf(option as CascaderOption);
  if (leaf in option) return Boolean(option[leaf]);
  if (config().lazy && config().lazyLoad) {
    void lazyRevision.value;
    if (!(option as LazyOption)[LAZY_RESOLVED]) return false;
  }
  return optionChildren(option).length === 0;
};

const optionTreeDepth = (options = rawOptions()): number =>
  options.reduce((depth, option) => Math.max(depth, 1 + optionTreeDepth(optionChildren(option))), 0);

const resolvedPanelModeState = useComputed((): Exclude<CascaderPanelMode, "auto"> => {
  if (props.panelMode === "tree" || props.panelMode === "columns") return props.panelMode;
  const threshold = Math.max(1, Math.floor(Number(props.treeThreshold) || 3));
  return optionTreeDepth() > threshold ? "tree" : "columns";
});

const resolvedPanelMode = (): Exclude<CascaderPanelMode, "auto"> => resolvedPanelModeState.value;

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

const selectedPaths = (): RawOption[][] =>
  selectedValues.value.map((value) => findPathByValues(value)).filter((path) => path.length > 0);

const selectedPath = (): RawOption[] => selectedPaths()[0] ?? [];

const hasValue = (): boolean => selectedValues.value.length > 0;

const isPathAncestor = (ancestor: CascaderPathValue, child: CascaderPathValue): boolean =>
  ancestor.length < child.length && ancestor.every((value, index) => sameValue(value, child[index]));

const collectCheckedParentPaths = (options = rawOptions(), parentPath: RawOption[] = []): RawOption[][] => {
  const result: RawOption[][] = [];
  for (const option of options) {
    const path = [...parentPath, option];
    const children = optionChildren(option);
    const leaves = collectLeafValuePaths(path);
    if (children.length > 0 && leaves.length > 0 && leaves.every((leaf) => isPathSelected(leaf))) {
      result.push(path);
    } else if (children.length > 0) {
      result.push(...collectCheckedParentPaths(children, path));
    }
  }
  return result;
};

const displaySelectedPaths = (): RawOption[][] => {
  const selected = selectedPaths();
  if (!isMultiple() || showCheckedStrategy() !== "parent") return selected;
  const parentPaths = collectCheckedParentPaths();
  const parentValues = parentPaths.map(pathValues);
  const rest = selected.filter((path) => {
    const value = pathValues(path);
    return !parentValues.some((parent) => isPathAncestor(parent, value));
  });
  return [...parentPaths, ...rest];
};

const displayPathLabel = (path: RawOption[]): string => {
  if (!props.showAllLevels) return optionLabel(path[path.length - 1] ?? {});
  return pathLabels(path).join(String(props.separator || " / "));
};

const displayLabel = (): string => {
  const separator = String(props.separator || " / ");
  const paths = displaySelectedPaths();
  const labels = paths.map(displayPathLabel);
  if (isMultiple() && props.collapseTags && labels.length > Math.max(1, Number(props.maxCollapseTags) || 1)) {
    const count = Math.max(1, Number(props.maxCollapseTags) || 1);
    return `${labels.slice(0, count).join("、")} +${labels.length - count}`;
  }
  if (paths.length > 0) {
    return labels.join("、");
  }
  return selectedValues.value.map((path) => path.map(String).join(separator)).join("、");
};

const tagEntries = (): CascaderTagEntry[] =>
  displaySelectedPaths().map((path) => {
    const value = pathValues(path);
    return {
      key: valuePathKey(value),
      label: displayPathLabel(path),
      path,
      value,
    };
  });

const visibleTagEntries = (): CascaderTagEntry[] => {
  const entries = tagEntries();
  if (!props.collapseTags) return entries;
  return entries.slice(0, Math.max(1, Number(props.maxCollapseTags) || 1));
};

const collapsedTagEntries = (): CascaderTagEntry[] => tagEntries().slice(visibleTagEntries().length);

const collapseTooltipText = (): string =>
  collapsedTagEntries()
    .map((entry) => entry.label)
    .join("\n");

const tagClass = (): unknown[] => [
  "tag",
  `is-${String(props.tagType || "info")}`,
  `is-${String(props.tagEffect || "light")}`,
];

const modelValueFromPaths = (paths: CascaderPathValue[]): CascaderModelValue => {
  if (shouldEmitPath()) {
    if (isMultiple()) return paths;
    return paths[0] ?? [];
  }
  const values = paths
    .map((path) => path[path.length - 1])
    .filter((value): value is CascaderValue => value !== undefined);
  if (isMultiple()) return values;
  return values[0] ?? "";
};

const detailFromPaths = (paths: CascaderPathValue[]): CascaderChangeDetail => {
  const optionPaths = paths.map((value) => findPathByValues(value));
  if (isMultiple()) {
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

const clearPendingFilter = (): void => {
  if (filterTimer) clearTimeout(filterTimer);
  filterTimer = null;
};

const clearFilter = (): void => {
  clearPendingFilter();
  filterRequest += 1;
  query.set("");
  filtering.set(false);
  filteredPaths.set([]);
};

const isSearchMode = (): boolean => Boolean(props.filterable && query.value.trim());

const isSearchTarget = (path: RawOption[]): boolean => {
  const option = path[path.length - 1];
  if (!option || optionDisabled(option)) return false;
  return optionLeaf(option) || isCheckStrictly() || props.checkable || config().checkOnClickNode;
};

const defaultFilter = (node: CascaderNodeSnapshot, keyword: string): boolean =>
  node.pathLabels.join(" / ").toLocaleLowerCase().includes(keyword.toLocaleLowerCase());

const matchesFilter = (node: CascaderNodeSnapshot, keyword: string): boolean => {
  try {
    return Boolean(((props.filterMethod as CascaderFilterMethod | undefined) ?? defaultFilter)(node, keyword));
  } catch {
    return false;
  }
};

const collectFilterResults = (keyword: string): RawOption[][] => {
  const result: RawOption[][] = [];
  const visit = (options: RawOption[], parentPath: RawOption[] = []): void => {
    options.forEach((option) => {
      const path = [...parentPath, option];
      const snapshot = nodeSnapshot(path);
      if (snapshot && isSearchTarget(path) && matchesFilter(snapshot, keyword)) result.push(path);
      visit(optionChildren(option), path);
    });
  };
  visit(rawOptions());
  return result;
};

const runFilter = async (keyword: string, request: number): Promise<void> => {
  const beforeFilter = props.beforeFilter as CascaderBeforeFilter | undefined;
  try {
    const allowed = beforeFilter ? await beforeFilter(keyword) : true;
    if (request !== filterRequest) return;
    const nextAllowed = allowed !== false;
    filteredPaths.set(nextAllowed ? collectFilterResults(keyword) : []);
  } catch {
    if (request !== filterRequest) return;
    filteredPaths.set([]);
  } finally {
    if (request === filterRequest) filtering.set(false);
  }
};

const scheduleFilter = (): void => {
  clearPendingFilter();
  const keyword = query.value.trim();
  const request = ++filterRequest;
  if (!keyword) {
    filtering.set(false);
    filteredPaths.set([]);
    return;
  }
  filtering.set(true);
  filterTimer = setTimeout(
    () => {
      filterTimer = null;
      void runFilter(keyword, request);
    },
    Math.max(0, Number(props.debounce) || 0),
  );
};

const emitChange = (paths: CascaderPathValue[]): void => {
  emit("update:modelValue", modelValueFromPaths(paths));
  emit("change", detailFromPaths(paths));
  if (props.validateEvent) formItem?.validateTrigger("change");
};

const restoreFocusBeforeClose = (): void => {
  const dropdown = host.shadowRoot?.querySelector<HTMLElement>(".dropdown");
  let activeElement: Element | null = null;
  try {
    activeElement = host.shadowRoot?.activeElement ?? null;
  } catch {
    // The panel can be removed in the same task as an option command.
  }
  if (!dropdown || !activeElement || !dropdown.contains(activeElement)) return;
  host.shadowRoot?.querySelector<HTMLElement>(".trigger")?.focus({ preventScroll: true });
};

const closeDropdown = (): void => {
  if (!open.peek()) return;
  restoreFocusBeforeClose();
  open.set(false);
  clearFilter();
  emit("visible-change", false);
};

const openDropdown = (): void => {
  if (isDisabled() || open.peek()) return;
  document.dispatchEvent(new CustomEvent(CASCADER_OPEN_EVENT, { detail: host }));
  activePath.set(selectedPath());
  open.set(true);
  emit("visible-change", true);
};

const toggleOpen = (event: Event): void => {
  event.stopPropagation();
  if (open.peek()) closeDropdown();
  else openDropdown();
};

const optionPath = (option: RawOption, column: CascaderColumn): RawOption[] => [...column.parentPath, option];

const valuePathKey = (path: CascaderPathValue): string => JSON.stringify(path);

const optionPathKey = (option: RawOption, column: CascaderColumn): string =>
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
  if (children.length === 0 || optionLeaf(current) || isCheckStrictly()) return [pathValues(path)];
  return children.flatMap((child) => collectLeafValuePaths([...path, child]));
};

const setSinglePath = (path: RawOption[]): void => {
  const next = [pathValues(path)];
  selectedValues.set(next);
  activePath.set(path);
  emitChange(next);
  closeDropdown();
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

const removeTag = (event: Event): void => {
  event.preventDefault();
  event.stopPropagation();
  const key = (event.currentTarget as HTMLElement).dataset.pathKey;
  if (!key) return;
  const entry = tagEntries().find((item) => item.key === key);
  if (!entry) return;
  const covered = collectLeafValuePaths(entry.path);
  const next = selectedValues
    .peek()
    .filter((item) => !samePathValue(item, entry.value) && !covered.some((leaf) => samePathValue(item, leaf)));
  selectedValues.set(next);
  emitChange(next);
  emit("remove-tag", shouldEmitPath() ? entry.value : entry.value[entry.value.length - 1]!);
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

const emitExpand = (path: RawOption[]): void => {
  emit("expand-change", pathValues(path));
};

const isLazyLoading = (option: RawOption): boolean => {
  void lazyRevision.value;
  return Boolean((option as LazyOption)[LAZY_LOADING]);
};

const loadLazyChildren = (path: RawOption[]): void => {
  const option = path[path.length - 1];
  const loader = config().lazyLoad;
  if (!option || !config().lazy || !loader) return;
  const state = option as LazyOption;
  if (state[LAZY_LOADING] || state[LAZY_RESOLVED]) return;
  state[LAZY_LOADING] = true;
  lazyRevision.set(lazyRevision.peek() + 1);

  const finish = (children: CascaderOption[] = []): void => {
    state[LAZY_CHILDREN] = children as RawOption[];
    state[LAZY_RESOLVED] = true;
    state[LAZY_LOADING] = false;
    lazyRevision.set(lazyRevision.peek() + 1);
    activePath.set([...path]);
  };
  const reject = (): void => {
    state[LAZY_LOADING] = false;
    lazyRevision.set(lazyRevision.peek() + 1);
  };
  try {
    loader(nodeSnapshot(path), finish, reject);
  } catch {
    reject();
  }
};

const onOptionPathClick = (path: RawOption[], event?: Event): void => {
  event?.preventDefault();
  event?.stopPropagation();
  const option = path[path.length - 1];
  if (!option) return;
  if (optionDisabled(option)) return;
  activePath.set(path);
  const hasChildren = optionChildren(option).length > 0;
  if (!hasChildren && !optionLeaf(option)) {
    emitExpand(path);
    loadLazyChildren(path);
    return;
  }
  if (hasChildren) emitExpand(path);
  if (isMultiple()) {
    if (isCheckStrictly()) {
      if (config().checkOnClickNode || (!hasChildren && config().checkOnClickLeaf)) {
        toggleStrictPath(path);
      }
      return;
    }
    if (props.checkable || config().checkOnClickNode || !hasChildren) setMultiplePath(path);
    return;
  }
  if (hasChildren && !isCheckStrictly()) return;
  setSinglePath(path);
};

const onOptionHover = (event: Event): void => {
  if (config().expandTrigger !== "hover") return;
  const key = (event.currentTarget as HTMLElement | null)?.dataset.pathKey;
  if (!key) return;
  const path = findPathByKey(key);
  const option = path[path.length - 1];
  if (!option || optionDisabled(option)) return;
  if (optionChildren(option).length === 0 && !optionLeaf(option)) loadLazyChildren(path);
  if (optionChildren(option).length === 0 && optionLeaf(option)) return;
  activePath.set(path);
  emitExpand(path);
};

const onColumnsClick = (event: Event): void => {
  const target = event.target as HTMLElement | null;
  const optionButton = target?.closest?.(".option") as HTMLElement | null;
  const key = optionButton?.dataset.pathKey;
  if (!key) return;
  const path = findPathByKey(key);
  if (path.length > 0) onOptionPathClick(path, event);
};

const onTreeClick = (event: Event): void => {
  const target = event.target as HTMLElement | null;
  const optionButton = target?.closest?.(".tree-option") as HTMLElement | null;
  const key = optionButton?.dataset.pathKey;
  if (!key) return;
  const path = findPathByKey(key);
  if (path.length === 0) return;
  if (target?.closest?.(".tree-toggle") && isTreePathExpanded(path)) {
    event.preventDefault();
    event.stopPropagation();
    activePath.set(path.slice(0, -1));
    focusPathOption(path);
    return;
  }
  onOptionPathClick(path, event);
};

const stopClick = (event: Event): void => {
  event.stopPropagation();
};

const clear = (event?: Event): void => {
  event?.preventDefault();
  event?.stopPropagation();
  selectedValues.set([]);
  activePath.set([]);
  const configured = props.valueOnClear as CascaderValueOnClear | undefined;
  const value = configured === undefined ? [] : typeof configured === "function" ? configured() : configured;
  emit("update:modelValue", value);
  emit("change", { value, path: [], selected: [], multiple: isMultiple() });
  emit("clear");
  if (props.validateEvent) formItem?.validateTrigger("change");
};

const onFilterInput = (event: Event): void => {
  const input = event.currentTarget as HTMLInputElement | null;
  query.set(input?.value ?? "");
  if (!open.peek()) openDropdown();
  scheduleFilter();
};

const focusableOptions = (): HTMLButtonElement[] =>
  Array.from(host.shadowRoot?.querySelectorAll<HTMLButtonElement>(".dropdown button:not(:disabled)") || []);

const focusElement = (element: HTMLButtonElement | undefined): void => {
  if (!element) return;
  element.focus();
  element.scrollIntoView?.({ block: "nearest", inline: "nearest" });
};

const focusOption = (edge: "first" | "last" = "first"): void => {
  queueMicrotask(() => {
    const items = focusableOptions();
    focusElement(edge === "last" ? items[items.length - 1] : items[0]);
  });
};

const optionFromKeyEvent = (event: KeyboardEvent): HTMLButtonElement | null =>
  (event.target as HTMLElement | null)?.closest?.(".option") as HTMLButtonElement | null;

const columnOptions = (option: HTMLButtonElement): HTMLButtonElement[] =>
  Array.from(option.closest(".column")?.querySelectorAll<HTMLButtonElement>(".option:not(:disabled)") || []);

const focusPathOption = (path: RawOption[]): void => {
  const key = valuePathKey(pathValues(path));
  queueMicrotask(() => {
    const option = Array.from(host.shadowRoot?.querySelectorAll<HTMLButtonElement>(".option") || []).find(
      (item) => item.dataset.pathKey === key,
    );
    focusElement(option);
  });
};

const focusFirstChild = (path: RawOption[]): void => {
  queueMicrotask(() => {
    const column = host.shadowRoot?.querySelectorAll<HTMLElement>(".column")[path.length];
    focusElement(column?.querySelector<HTMLButtonElement>(".option:not(:disabled)") || undefined);
  });
};

const expandWithKeyboard = (path: RawOption[]): void => {
  const option = path[path.length - 1];
  if (!option || optionDisabled(option) || optionLeaf(option)) return;
  activePath.set(path);
  emitExpand(path);
  if (optionChildren(option).length === 0) loadLazyChildren(path);
  focusFirstChild(path);
};

const treeOptionButtons = (): HTMLButtonElement[] =>
  Array.from(host.shadowRoot?.querySelectorAll<HTMLButtonElement>(".tree-option:not(:disabled)") || []);

const onTreeKeydown = (event: KeyboardEvent, option: HTMLButtonElement, path: RawOption[]): void => {
  const items = treeOptionButtons();
  const current = items.indexOf(option);
  if (event.key === "ArrowDown" || event.key === "ArrowUp") {
    event.preventDefault();
    const step = event.key === "ArrowDown" ? 1 : -1;
    focusElement(items[(current + step + items.length) % items.length]);
    return;
  }
  if (event.key === "Home" || event.key === "End") {
    event.preventDefault();
    focusElement(event.key === "Home" ? items[0] : items[items.length - 1]);
    return;
  }
  if (event.key === "ArrowRight") {
    event.preventDefault();
    const currentOption = path[path.length - 1];
    if (!currentOption || optionLeaf(currentOption)) return;
    if (!isTreePathExpanded(path)) {
      activePath.set(path);
      emitExpand(path);
      if (optionChildren(currentOption).length === 0) loadLazyChildren(path);
      return;
    }
    queueMicrotask(() => {
      const next = treeOptionButtons().find((item) => {
        const childPath = findPathByKey(item.dataset.pathKey || "");
        return childPath.length === path.length + 1 && isRawPathPrefix(path, childPath);
      });
      focusElement(next);
    });
    return;
  }
  if (event.key === "ArrowLeft" && path.length > 0) {
    event.preventDefault();
    if (isTreePathExpanded(path)) {
      activePath.set(path.slice(0, -1));
      focusPathOption(path);
      return;
    }
    if (path.length > 1) {
      const parentPath = path.slice(0, -1);
      activePath.set(parentPath);
      focusPathOption(parentPath);
    }
    return;
  }
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    onOptionPathClick(path, event);
  }
};

const onFilterKeydown = (event: KeyboardEvent): void => {
  if (event.key === "Escape") {
    event.preventDefault();
    closeDropdown();
    return;
  }
  if (event.key === "ArrowDown") {
    event.preventDefault();
    if (!open.peek()) openDropdown();
    focusOption();
  }
};

const onTriggerKeydown = (event: KeyboardEvent): void => {
  if (event.key === "Escape") {
    event.preventDefault();
    closeDropdown();
    return;
  }
  if (event.key !== "Enter" && event.key !== " " && event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
  event.preventDefault();
  if (!open.peek()) openDropdown();
  focusOption(event.key === "ArrowUp" ? "last" : "first");
};

const onDropdownKeydown = (event: KeyboardEvent): void => {
  if (event.key === "Escape") {
    event.preventDefault();
    closeDropdown();
    getTriggerEl()?.focus();
    return;
  }
  const option = optionFromKeyEvent(event);
  if (!option) return;
  const pathKey = option.dataset.pathKey;
  if (!pathKey) return;
  const path = findPathByKey(pathKey);
  if (path.length === 0) return;
  if (option.classList.contains("tree-option")) {
    onTreeKeydown(event, option, path);
    return;
  }
  const items = columnOptions(option);
  const current = items.indexOf(option);
  if (event.key === "ArrowDown" || event.key === "ArrowUp") {
    event.preventDefault();
    const step = event.key === "ArrowDown" ? 1 : -1;
    focusElement(items[(current + step + items.length) % items.length]);
  } else if (event.key === "Home" || event.key === "End") {
    event.preventDefault();
    focusElement(event.key === "Home" ? items[0] : items[items.length - 1]);
  } else if (event.key === "ArrowRight") {
    event.preventDefault();
    expandWithKeyboard(path);
  } else if (event.key === "ArrowLeft" && path.length > 1) {
    event.preventDefault();
    const parentPath = path.slice(0, -1);
    activePath.set(parentPath);
    focusPathOption(parentPath);
  } else if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    onOptionPathClick(path, event);
  }
};

const onFilterResultsClick = (event: Event): void => {
  const target = event.target as HTMLElement | null;
  const option = target?.closest?.(".filter-option") as HTMLElement | null;
  const key = option?.dataset.pathKey;
  if (!key) return;
  const path = findPathByKey(key);
  if (path.length > 0) onOptionPathClick(path, event);
};

const isActive = (option: RawOption, column: CascaderColumn): boolean =>
  sameValue(optionValue(activePath.value[column.level] ?? {}), optionValue(option));

const isPathSelected = (value: CascaderPathValue): boolean =>
  selectedValues.value.some((item) => samePathValue(item, value));

const checkState = (option: RawOption, column: CascaderColumn): CheckState => {
  const leaves = collectLeafValuePaths(optionPath(option, column));
  if (leaves.length === 0) return "unchecked";
  const checkedCount = leaves.filter(isPathSelected).length;
  if (checkedCount === leaves.length) return "checked";
  return checkedCount > 0 ? "indeterminate" : "unchecked";
};

const isSelected = (option: RawOption, column: CascaderColumn): boolean => {
  if (isMultiple()) return checkState(option, column) === "checked";
  const path = selectedPath();
  return sameValue(optionValue(path[column.level] ?? {}), optionValue(option));
};

const isIndeterminate = (option: RawOption, column: CascaderColumn): boolean =>
  isMultiple() && checkState(option, column) === "indeterminate";

const checkboxClass = (option: RawOption, column: CascaderColumn): Record<string, boolean> => ({
  "is-checked": isSelected(option, column),
  "is-indeterminate": isIndeterminate(option, column),
});

const ariaChecked = (option: RawOption, column: CascaderColumn): string | null => {
  if (!showPrefix()) return null;
  const state = checkState(option, column);
  if (state === "checked") return "true";
  if (state === "indeterminate") return "mixed";
  return "false";
};

const showClear = (): boolean => Boolean(props.clearable && hasValue() && !isDisabled());

const columns = (): CascaderColumn[] => {
  const path = open.value && activePath.value.length > 0 ? activePath.value : selectedPath();
  const result: CascaderColumn[] = [{ key: "root", level: 0, parentPath: [], options: rawOptions() }];
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

const optionClass = (option: RawOption, column: CascaderColumn): Record<string, boolean> => ({
  "is-active": isActive(option, column),
  "is-selected": isSelected(option, column),
  "is-indeterminate": isIndeterminate(option, column),
  "is-disabled": optionDisabled(option),
  "has-children": !optionLeaf(option),
  "is-loading": isLazyLoading(option),
});

const isRawPathPrefix = (prefix: RawOption[], path: RawOption[]): boolean =>
  prefix.length <= path.length &&
  prefix.every((option, index) => sameValue(optionValue(option), optionValue(path[index] ?? {})));

const isTreePathExpanded = (path: RawOption[]): boolean => {
  const option = path[path.length - 1];
  return Boolean(option && !optionLeaf(option) && isRawPathPrefix(path, activePath.value));
};

const treeEntries = (): CascaderTreeEntry[] => {
  const entries: CascaderTreeEntry[] = [];
  const visit = (options: RawOption[], parentPath: RawOption[] = []): void => {
    for (const option of options) {
      const path = [...parentPath, option];
      const level = path.length - 1;
      entries.push({
        key: valuePathKey(pathValues(path)),
        level,
        option,
        path,
        column: { key: valuePathKey(pathValues(parentPath)), level, parentPath, options },
      });
      if (isTreePathExpanded(path)) visit(optionChildren(option), path);
    }
  };
  visit(rawOptions());
  return entries;
};

const treeOptionStyle = (entry: CascaderTreeEntry): Record<string, string> => ({
  "--_cascader-tree-level": String(entry.level),
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

const togglePopperVisible = (visible?: boolean): void => {
  if (visible === true) {
    openDropdown();
    return;
  }
  if (visible === false) {
    closeDropdown();
    return;
  }
  if (open.peek()) closeDropdown();
  else openDropdown();
};

const onTriggerFocus = (event: FocusEvent): void => {
  emit("focus", event);
};

const onTriggerBlur = (event: FocusEvent): void => {
  emit("blur", event);
  if (props.validateEvent) formItem?.validateTrigger("blur");
};

const popperOptions = (): CascaderPopperOptions =>
  props.popperOptions && typeof props.popperOptions === "object" ? (props.popperOptions as CascaderPopperOptions) : {};

const placement = (): CascaderPlacement => resolvePlacement(popperOptions().placement || props.placement);

const popperModifier = (name: string): CascaderPopperModifier | undefined =>
  popperOptions().modifiers?.find((item) => item.name === name && item.enabled !== false);

const popperOffset = (): [number, number] => popperModifier("offset")?.options?.offset || [0, -1];

const overflowPadding = (): number => Math.max(0, Number(popperModifier("preventOverflow")?.options?.padding) || 8);

const flipEnabled = (): boolean => popperModifier("flip")?.enabled !== false;

const fallbackPlacements = (): CascaderPlacement[] =>
  (Array.isArray(props.fallbackPlacements) ? props.fallbackPlacements : [])
    .map(resolvePlacement)
    .filter((item, index, source) => source.indexOf(item) === index);

const shouldRenderDropdown = (): boolean => Boolean(props.persistent) || open.value;

const getTriggerEl = (): HTMLElement | null => host.shadowRoot?.querySelector<HTMLElement>(".trigger") || null;
const getDropdownEl = (): HTMLElement | null => host.shadowRoot?.querySelector<HTMLElement>(".dropdown") || null;

const dropdownClass = (): unknown[] => [
  "dropdown",
  props.popperClass,
  `placement-${props.teleported ? resolvedPlacement.value : placement()}`,
  `is-effect-${String(props.effect || "light")}`,
  {
    "is-teleported": props.teleported,
    "is-open": open.value,
    "is-fit-input": props.fitInputWidth,
    "is-tree-panel": resolvedPanelMode() === "tree",
  },
];

const dropdownStyle = (): Record<string, string> => ({
  ...toStyleObject(props.popperStyle),
  ...(props.teleported ? overlayStyle.value : {}),
});

const updateOverlayPosition = (): void => {
  if (!props.teleported || typeof window === "undefined") {
    overlayStyle.set({});
    resolvedPlacement.set(placement());
    return;
  }
  const trigger = getTriggerEl();
  const dropdown = getDropdownEl();
  if (!trigger || !dropdown) return;
  const anchorRect = trigger.getBoundingClientRect();
  if (anchorRect.width === 0 && anchorRect.height === 0) {
    resolvedPlacement.set(placement());
    return;
  }
  const dropdownRect = dropdown.getBoundingClientRect();
  const visualViewport = window.visualViewport;
  const measuredDropdownWidth = dropdownRect.width || dropdown.offsetWidth || 184;
  const width = props.fitInputWidth ? anchorRect.width : measuredDropdownWidth;
  const next = computeAnchoredPosition(
    anchorRect,
    { width, height: dropdownRect.height || dropdown.offsetHeight || 0 },
    {
      width: visualViewport?.width || window.innerWidth,
      height: visualViewport?.height || window.innerHeight,
      offsetLeft: visualViewport?.offsetLeft || 0,
      offsetTop: visualViewport?.offsetTop || 0,
    },
    {
      placement: placement(),
      offset: popperOffset(),
      padding: overflowPadding(),
      flip: flipEnabled(),
      fallbackPlacements: fallbackPlacements(),
    },
  );
  resolvedPlacement.set(next.placement);
  overlayStyle.set({
    position: "fixed",
    left: `${Math.round(next.left * 100) / 100}px`,
    top: `${Math.round(next.top * 100) / 100}px`,
    right: "auto",
    bottom: "auto",
    margin: "0",
    width: props.fitInputWidth ? `${Math.round(width * 100) / 100}px` : "auto",
    minWidth: props.fitInputWidth ? `${Math.round(anchorRect.width * 100) / 100}px` : "0px",
  });
};

const requestOverlayUpdate = (): void => {
  if (typeof window === "undefined") return;
  if (overlayFrame) cancelAnimationFrame(overlayFrame);
  overlayFrame = requestAnimationFrame(() => {
    overlayFrame = 0;
    updateOverlayPosition();
  });
};

const syncTopLayer = (): void => {
  const dropdown = getDropdownEl() as
    | (HTMLElement & {
        showPopover?: () => void;
        hidePopover?: () => void;
      })
    | null;
  if (!dropdown) return;
  try {
    if (props.teleported && open.peek()) dropdown.showPopover?.();
    else dropdown.hidePopover?.();
  } catch {
    // Rapid conditional updates can disconnect the panel before its popover state settles.
  }
  if (open.peek()) requestOverlayUpdate();
};

const connectAnchoredOverlay = (): void => {
  cleanupAnchoredOverlay();
  if (!props.teleported || typeof window === "undefined") return;
  const trigger = getTriggerEl();
  const dropdown = getDropdownEl();
  const observer = typeof ResizeObserver !== "undefined" ? new ResizeObserver(requestOverlayUpdate) : undefined;
  if (trigger) observer?.observe(trigger);
  if (dropdown) observer?.observe(dropdown);
  const cleanupOverlayMotion = listenForExternalOverlayMotion(() => [dropdown], closeDropdown);
  window.addEventListener("resize", requestOverlayUpdate, { passive: true });
  window.visualViewport?.addEventListener("resize", requestOverlayUpdate, { passive: true });
  cleanupAnchoredOverlay = () => {
    observer?.disconnect();
    cleanupOverlayMotion();
    window.removeEventListener("resize", requestOverlayUpdate);
    window.visualViewport?.removeEventListener("resize", requestOverlayUpdate);
  };
  syncTopLayer();
  requestOverlayUpdate();
};

useEffect(() => {
  const next = toValuePaths(props.modelValue);
  selectedValues.set(isMultiple() ? next : next.slice(0, 1));
  if (!open.peek()) activePath.set(findPathByValues(next[0] ?? []));
});

useEffect(() => {
  void open.value;
  void props.teleported;
  void props.placement;
  void props.popperOptions;
  void props.fitInputWidth;
  void props.persistent;
  if (mounted)
    queueMicrotask(() => {
      syncTopLayer();
      connectAnchoredOverlay();
    });
});

useClickOutside(host, closeDropdown);
onMounted(() => {
  mounted = true;
  connectAnchoredOverlay();
});
onUnmounted(() => {
  mounted = false;
  clearPendingFilter();
  cleanupAnchoredOverlay();
  if (overlayFrame) cancelAnimationFrame(overlayFrame);
});
useEventListener<CustomEvent<HTMLElement>>(document, CASCADER_OPEN_EVENT, (event) => {
  if (event.detail !== host) closeDropdown();
});
useHostFlag("data-open", () => open.value);
useHostAttr("data-state", () => fi.state);
useHostFlag("disabled", isDisabled);
useHostAttr("size", () => fi.formSize);
useHostAttr("variant", () => normalizeFieldVariant(props.variant));
useHostFlag("data-dirty", hasValue);
useHostCssVar("--elf-field-custom-bg", () => props.backgroundColor || "");
useHostFlag("data-has-label", () => Boolean(props.label));

defineExpose({
  clearSelection: clear,
  openPanel: openDropdown,
  closePanel: closeDropdown,
  togglePopperVisible,
  getCheckedNodes,
  presentText: displayLabel,
  getContentElement: getDropdownEl,
});
defineStyle(styles);

const Cascader = defineHtml<CascaderProps, CascaderEmits, CascaderSlots>(`
  <div class="trigger" part="trigger" :tabindex=${props.filterable ? undefined : 0} role="combobox"
    :aria-expanded=${open ? "true" : "false"} @click=${toggleOpen} @focus=${onTriggerFocus} @blur=${onTriggerBlur}
    @keydown=${onTriggerKeydown}>
    <fieldset v-if=${props.label} class="field-outline" aria-hidden="true">
      <legend><span>${props.label}</span></legend>
    </fieldset>
    <span v-if=${props.label} class="field-label">${props.label}</span>
    <span class="prefix" part="prefix">
      <slot name="prefix"></slot>
    </span>
    <input v-if=${props.filterable} class="filter-input" type="text" autocomplete="off" :value=${query}
      :placeholder=${hasValue() ? displayLabel() : props.placeholder} :aria-label=${placeholderText()} @click=${stopClick}
      @input=${onFilterInput} @keydown=${onFilterKeydown} @focus=${onTriggerFocus} @blur=${onTriggerBlur} />
    <span v-else-if=${!hasValue()} class="placeholder">${placeholderText()}</span>
    <slot v-else-if=${isMultiple() && hasValue()} name="tag" :data=${getCheckedNodes()}>
      <span class="tags value">
        <span v-for="entry in visibleTagEntries()" :key="entry.key" :class=${tagClass()}>
          <span class="tag-label">{{ entry.label }}</span>
          <button type="button" class="tag-remove" :data-path-key="entry.key"
            :aria-label='locale.t("common.remove") + " " + entry.label' @click=${removeTag}>
            <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false">
              <path d="M4 4l8 8M12 4l-8 8"></path>
            </svg>
          </button>
        </span>
        <span v-if="collapsedTagEntries().length > 0" :class=${[...tagClass(), "collapsed-tag"]}
          :title=${props.collapseTagsTooltip ? collapseTooltipText() : null}>+${collapsedTagEntries().length}</span>
      </span>
    </slot>
    <span v-else class="value">${displayLabel()}</span>
    <span class="suffix" part="suffix">
      <button v-if=${showClear()} type="button" class="clear" :aria-label=${locale.t("common.clear")}
        @click=${clear}><span v-if=${props.clearIcon}>${props.clearIcon}</span><svg v-else viewBox="0 0 16 16"
          aria-hidden="true" focusable="false">
          <path d="M4 4l8 8M12 4l-8 8"></path>
        </svg></button>
      <span v-else class="arrow" aria-hidden="true">▼</span>
    </span>
  </div>
  <div v-if=${shouldRenderDropdown() && !isDisabled()} :class=${dropdownClass()} :style=${dropdownStyle()} part="dropdown"
    :popover=${props.teleported ? "manual" : undefined}
    :data-append-to=${typeof props.appendTo === "string" ? props.appendTo : "element"} role="menu"
    :aria-hidden=${open ? "false" : "true"} :inert=${open ? undefined : ""}
    @click=${stopClick} @keydown=${onDropdownKeydown}>
    <slot name="header"></slot>
    <div v-if=${isSearchMode()} class="filter-results" role="listbox" @click=${onFilterResultsClick}>
      <div v-if=${filtering} class="empty" aria-live="polite">${locale.t("table.loading")}</div>
      <template v-else>
        <button v-for="path in filteredPaths" :key="valuePathKey(pathValues(path))" class="filter-option" type="button"
          role="option" :data-path-key="valuePathKey(pathValues(path))"
          :aria-selected="isPathSelected(pathValues(path)) ? 'true' : 'false'">
          <slot name="suggestion-item" :node="nodeSnapshot(path)" :data="path[path.length - 1]">
            {{ displayPathLabel(path) }}
          </slot>
        </button>
        <slot v-if="filteredPaths.length === 0" name="empty">
          <div class="empty">${locale.t("field.noMatch")}</div>
        </slot>
      </template>
    </div>
    <slot v-else-if=${rawOptions().length === 0} name="empty">
      <div class="empty">${locale.t("table.empty")}</div>
    </slot>
    <div v-else-if=${resolvedPanelMode() === "tree"} class="tree-panel" role="tree" @click=${onTreeClick}>
      <button v-for="entry in treeEntries()" :key="entry.key" :data-path-key="entry.key" :style="treeOptionStyle(entry)"
        type="button" :class="['option', 'tree-option', optionClass(entry.option, entry.column)]"
        :disabled="optionDisabled(entry.option)" role="treeitem" :aria-level="entry.level + 1"
        :aria-expanded="optionLeaf(entry.option) ? undefined : (isTreePathExpanded(entry.path) ? 'true' : 'false')"
        :aria-selected="isSelected(entry.option, entry.column) ? 'true' : 'false'"
        :aria-checked="ariaChecked(entry.option, entry.column)" @pointerenter=${onOptionHover}>
        <span v-if="!optionLeaf(entry.option)" class="tree-toggle"
          :class="{ 'is-expanded': isTreePathExpanded(entry.path), 'is-loading': isLazyLoading(entry.option) }"
          aria-hidden="true"></span>
        <span v-else class="tree-leaf" aria-hidden="true"></span>
        <span v-if=${showPrefix()} class="option-checkbox" :class="checkboxClass(entry.option, entry.column)">
          <span class="checkbox-mark"></span>
        </span>
        <span class="option-label">
          <slot :node="nodeSnapshot(entry.path)" :data="entry.option"> {{ optionLabel(entry.option) }} </slot>
        </span>
        <span v-if="optionLeaf(entry.option) && isSelected(entry.option, entry.column) && !props.checkable"
          class="check">✓</span>
      </button>
    </div>
    <div v-else class="columns" @click=${onColumnsClick}>
      <div v-for="column in columns()" :key="column.key" class="column">
        <button v-for="option in column.options" :key="optionKey(option, column.level)"
          :data-path-key="optionPathKey(option, column)" type="button" :class="['option', optionClass(option, column)]"
          :disabled="optionDisabled(option)" :role=${showPrefix() ? "menuitemcheckbox" : "menuitem"}
          :aria-checked="ariaChecked(option, column)" @pointerenter=${onOptionHover}>
          <span v-if=${showPrefix()} class="option-checkbox" :class="checkboxClass(option, column)">
            <span class="checkbox-mark"></span>
          </span>
          <span class="option-label">
            <slot :node="nodeSnapshot(optionPath(option, column))" :data="option"> {{ optionLabel(option) }} </slot>
          </span>
          <span v-if="!optionLeaf(option)" class="option-arrow">{{ isLazyLoading(option) ? '…' : '›' }}</span>
          <span v-else-if="isSelected(option, column) && !props.checkable" class="check">✓</span>
        </button>
      </div>
    </div>
    <slot name="footer"></slot>
  </div>
`);

export { Cascader };
