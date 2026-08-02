import {
  defineEmits,
  defineDirective,
  defineExpose,
  defineHtml,
  defineProps,
  defineStyle,
  useReactive,
  useHost,
  useRef,
  useEffect,
} from "@elfui/core";

import styles from "./style.scss?inline";
import { computeVirtualWindow } from "../virtual-window";
import { listContentDirective } from "../list-content";
import type {
  TransferDataItem,
  TransferDirection,
  TransferProps,
  TransferRenderContext,
  TransferSlots,
} from "./types";

export type {
  TransferDataItem,
  TransferDirection,
  TransferExpose,
  TransferFieldNames,
  TransferFormat,
  TransferProps,
  TransferRenderContent,
  TransferRenderContext,
  TransferSlots,
  TransferTargetOrder,
} from "./types";

const props = defineProps<TransferProps>({
  data: { type: Array, default: () => [] },
  modelValue: { type: Array, default: () => [] },
  titles: { type: Array, default: () => ["Source", "Target"] },
  filterable: { type: Boolean, default: false },
  filterPlaceholder: { type: String, default: "Search" },
  filterMethod: { type: Function, default: undefined },
  targetOrder: { type: String, default: "original" },
  buttonTexts: { type: Array, default: () => [] },
  format: { type: Object, default: () => ({}) },
  leftDefaultChecked: { type: Array, default: () => [] },
  rightDefaultChecked: { type: Array, default: () => [] },
  props: { type: Object, default: () => ({ key: "key", label: "label", disabled: "disabled" }) },
  virtual: { type: Boolean, default: false },
  height: { type: [Number, String], default: 320 },
  itemSize: { type: Number, default: 36 },
  overscan: { type: Number, default: 4 },
  emptyText: { type: String, default: "No data" },
  renderContent: { type: Function, default: undefined },
});

const elfListContent = defineDirective(listContentDirective);

const emit = defineEmits([
  "update:modelValue",
  "change",
  "left-check-change",
  "right-check-change",
]);

type TransferViewItem = Record<string, unknown> & {
  __key: string;
  __label: string;
  __disabled: boolean;
  __original: number;
  __raw: TransferDataItem;
};

const fieldKey = useRef("key");
const fieldLabel = useRef("label");
const fieldDisabled = useRef("disabled");
const selectedKeys = useRef<string[]>([]);
const leftFilter = useRef("");
const rightFilter = useRef("");
const leftChecked = useReactive<Record<string, boolean>>({});
const rightChecked = useReactive<Record<string, boolean>>({});
const source = useRef<TransferViewItem[]>([]);
const target = useRef<TransferViewItem[]>([]);
const leftCheckedCount = useRef(0);
const rightCheckedCount = useRef(0);
const leftTotalCount = useRef(0);
const rightTotalCount = useRef(0);
const leftScrollTop = useRef(0);
const rightScrollTop = useRef(0);
const host = useHost();
let defaultsApplied = false;

const normalizeKeys = (value: unknown): string[] =>
  Array.isArray(value) ? Array.from(new Set(value.map((key) => String(key)))) : [];
const checkedKeys = (bucket: Record<string, boolean>): string[] =>
  Object.keys(bucket).filter((key) => bucket[key]);
const clearChecked = (bucket: Record<string, boolean>): void => {
  for (const key of Object.keys(bucket)) delete bucket[key];
};
const syncCheckedCounts = (): void => {
  leftCheckedCount.set(checkedKeys(leftChecked).length);
  rightCheckedCount.set(checkedKeys(rightChecked).length);
};
const sourceItems = (): TransferViewItem[] => source.value;
const targetItems = (): TransferViewItem[] => target.value;
const leftSelectable = (): TransferViewItem[] => source.value.filter((item) => !item.__disabled);
const rightSelectable = (): TransferViewItem[] => target.value.filter((item) => !item.__disabled);
const leftAllChecked = (): boolean => {
  const items = leftSelectable();
  return items.length > 0 && items.every((item) => leftChecked[item.__key]);
};
const rightAllChecked = (): boolean => {
  const items = rightSelectable();
  return items.length > 0 && items.every((item) => rightChecked[item.__key]);
};

const commitValue = (next: string[], direction: TransferDirection, movedKeys: string[]): void => {
  const normalized = Array.from(new Set(next.map((key) => String(key))));
  selectedKeys.set(normalized);
  emit("update:modelValue", normalized);
  emit("change", normalized, direction, movedKeys);
};

const emitCheck = (side: "left" | "right", changedKeys: string[]): void => {
  const bucket = side === "left" ? leftChecked : rightChecked;
  emit(`${side}-check-change`, checkedKeys(bucket), changedKeys);
};

const matchesFilter = (query: string, item: TransferViewItem): boolean => {
  if (!query) return true;
  const method = props.filterMethod as unknown;
  if (typeof method === "function") return Boolean(method(query, item));
  return item.__label.toLowerCase().includes(query.toLowerCase());
};

const orderedTarget = (items: TransferViewItem[], keys: string[]): TransferViewItem[] => {
  if (props.targetOrder === "original") return items.filter((item) => keys.includes(item.__key));
  const byKey = new Map(items.map((item) => [item.__key, item]));
  return keys
    .map((key) => byKey.get(key))
    .filter((item): item is TransferViewItem => Boolean(item));
};

useEffect(() => {
  const fieldMap = (props.props || {}) as unknown as Record<string, string>;
  fieldKey.set(fieldMap.key || "key");
  fieldLabel.set(fieldMap.label || "label");
  fieldDisabled.set(fieldMap.disabled || "disabled");
});

useEffect(() => selectedKeys.set(normalizeKeys(props.modelValue)));

const rebuild = (): void => {
  const all = (props.data || []) as Record<string, unknown>[];
  const selected = new Set(selectedKeys.value);
  const entries = all.map((item, index) => ({
    ...item,
    __key: String(item[fieldKey.value] ?? ""),
    __label: String(item[fieldLabel.value] ?? ""),
    __disabled: Boolean(item[fieldDisabled.value]),
    __original: index,
    __raw: item,
  })) as TransferViewItem[];
  const selectedEntries = orderedTarget(entries, selectedKeys.value);
  const sourceEntries = entries.filter((item) => !selected.has(item.__key));
  const nextSource = sourceEntries.filter((item) => matchesFilter(leftFilter.value, item));
  const nextTarget = selectedEntries.filter((item) => matchesFilter(rightFilter.value, item));
  source.set(nextSource);
  target.set(nextTarget);
  leftTotalCount.set(sourceEntries.length);
  rightTotalCount.set(selectedEntries.length);

  const visibleLeft = new Set(nextSource.map((item) => item.__key));
  const visibleRight = new Set(nextTarget.map((item) => item.__key));
  for (const key of Object.keys(leftChecked)) if (!visibleLeft.has(key)) delete leftChecked[key];
  for (const key of Object.keys(rightChecked)) if (!visibleRight.has(key)) delete rightChecked[key];
  syncCheckedCounts();

  if (!defaultsApplied && entries.length > 0) {
    const leftDefaults = new Set(normalizeKeys(props.leftDefaultChecked));
    const rightDefaults = new Set(normalizeKeys(props.rightDefaultChecked));
    for (const item of sourceEntries)
      if (!item.__disabled && leftDefaults.has(item.__key)) leftChecked[item.__key] = true;
    for (const item of selectedEntries)
      if (!item.__disabled && rightDefaults.has(item.__key)) rightChecked[item.__key] = true;
    defaultsApplied = true;
    syncCheckedCounts();
  }
};
useEffect(rebuild);

const numericHeight = (): number => Math.max(120, Number.parseFloat(String(props.height)) || 320);
const numericItemSize = (): number => Math.max(28, Number(props.itemSize) || 36);
const sideItems = (side: "left" | "right"): TransferViewItem[] =>
  side === "left" ? source.value : target.value;
const sideScrollTop = (side: "left" | "right"): number =>
  side === "left" ? leftScrollTop.value : rightScrollTop.value;
const virtualWindow = (side: "left" | "right") =>
  computeVirtualWindow({
    count: sideItems(side).length,
    itemSize: numericItemSize(),
    viewportSize: numericHeight(),
    scrollOffset: sideScrollTop(side),
    overscan: Math.max(0, Number(props.overscan) || 0),
  });
const renderedItems = (side: "left" | "right"): TransferViewItem[] => {
  const items = sideItems(side);
  if (!props.virtual) return items;
  const state = virtualWindow(side);
  return items.slice(state.start, state.end);
};
const panelBodyStyle = (): Record<string, string> =>
  props.virtual
    ? {
        height: `${numericHeight()}px`,
        minHeight: `${numericHeight()}px`,
        maxHeight: `${numericHeight()}px`,
      }
    : {};
const panelWindowStyle = (side: "left" | "right"): Record<string, string> => {
  if (!props.virtual) return {};
  const state = virtualWindow(side);
  return {
    paddingTop: `${state.offset}px`,
    paddingBottom: `${Math.max(0, state.totalSize - state.offset - (state.end - state.start) * numericItemSize())}px`,
  };
};
const itemStyle = (): Record<string, string> =>
  props.virtual ? { height: `${numericItemSize()}px` } : {};
const onPanelScroll = (side: "left" | "right", event: Event): void => {
  const value = event.currentTarget instanceof HTMLElement ? event.currentTarget.scrollTop : 0;
  if (side === "left") leftScrollTop.set(value);
  else rightScrollTop.set(value);
};

const setChecked = (side: "left" | "right", item: TransferViewItem, checked: boolean): void => {
  if (item.__disabled) return;
  const bucket = side === "left" ? leftChecked : rightChecked;
  if (checked) bucket[item.__key] = true;
  else delete bucket[item.__key];
  syncCheckedCounts();
  emitCheck(side, [item.__key]);
};

const onItemChecked = (side: "left" | "right", item: TransferViewItem, event: Event): void => {
  if (!(event.currentTarget instanceof HTMLInputElement)) return;
  setChecked(side, item, event.currentTarget.checked);
};

const toggleAll = (side: "left" | "right", event: Event): void => {
  const bucket = side === "left" ? leftChecked : rightChecked;
  const items = side === "left" ? leftSelectable() : rightSelectable();
  clearChecked(bucket);
  if ((event.target as HTMLInputElement).checked) {
    for (const item of items) bucket[item.__key] = true;
  }
  syncCheckedCounts();
  emitCheck(
    side,
    items.map((item) => item.__key),
  );
};

const moveToRight = (): void => {
  const keys = checkedKeys(leftChecked);
  if (keys.length === 0) return;
  const existing = selectedKeys.peek();
  const next = props.targetOrder === "unshift" ? [...keys, ...existing] : [...existing, ...keys];
  commitValue(next, "right", keys);
  clearChecked(leftChecked);
  syncCheckedCounts();
};

const moveToLeft = (): void => {
  const keys = checkedKeys(rightChecked);
  if (keys.length === 0) return;
  const removed = new Set(keys);
  commitValue(
    selectedKeys.peek().filter((key) => !removed.has(key)),
    "left",
    keys,
  );
  clearChecked(rightChecked);
  syncCheckedCounts();
};

const onFilterInput = (side: "left" | "right", event: Event): void => {
  const value = (event.target as HTMLInputElement).value;
  if (side === "left") {
    leftFilter.set(value);
    leftScrollTop.set(0);
  } else {
    rightFilter.set(value);
    rightScrollTop.set(0);
  }
};
const clearQuery = (side?: "left" | "right"): void => {
  if (!side || side === "left") {
    leftFilter.set("");
    leftScrollTop.set(0);
  }
  if (!side || side === "right") {
    rightFilter.set("");
    rightScrollTop.set(0);
  }
};
const focusItem = (side: "left" | "right", key: string): void => {
  const rows = Array.from(
    host.shadowRoot?.querySelectorAll<HTMLElement>(`[data-transfer-side="${side}"]`) || [],
  );
  rows.find((row) => row.dataset.transferKey === key)?.focus();
};
const scrollToItem = (side: "left" | "right", key: string): void => {
  const index = sideItems(side).findIndex((item) => item.__key === String(key));
  if (index < 0) return;
  const body = host.shadowRoot?.querySelector<HTMLElement>(`.panel-${side} .panel-body`);
  const top = props.virtual
    ? index * numericItemSize()
    : Math.max(0, index * numericItemSize() - numericHeight() / 2);
  if (body) body.scrollTop = top;
  if (side === "left") leftScrollTop.set(top);
  else rightScrollTop.set(top);
  queueMicrotask(() => focusItem(side, String(key)));
};
const onItemKeydown = (
  side: "left" | "right",
  item: TransferViewItem,
  event: KeyboardEvent,
): void => {
  const items = sideItems(side).filter((entry) => !entry.__disabled);
  const index = items.findIndex((entry) => entry.__key === item.__key);
  if (event.key === " " || event.key === "Enter") {
    event.preventDefault();
    const bucket = side === "left" ? leftChecked : rightChecked;
    setChecked(side, item, !bucket[item.__key]);
    return;
  }
  if (
    event.key === "ArrowDown" ||
    event.key === "ArrowUp" ||
    event.key === "Home" ||
    event.key === "End"
  ) {
    event.preventDefault();
    const nextIndex =
      event.key === "Home"
        ? 0
        : event.key === "End"
          ? items.length - 1
          : Math.max(0, Math.min(items.length - 1, index + (event.key === "ArrowDown" ? 1 : -1)));
    const next = items[nextIndex];
    if (next) scrollToItem(side, next.__key);
    return;
  }
  if (
    (side === "left" && event.key === "ArrowRight") ||
    (side === "right" && event.key === "ArrowLeft")
  ) {
    event.preventDefault();
    const bucket = side === "left" ? leftChecked : rightChecked;
    if (!bucket[item.__key]) setChecked(side, item, true);
    if (side === "left") moveToRight();
    else moveToLeft();
  }
};
const title = (side: "left" | "right"): string =>
  String(
    (props.titles as string[])[side === "left" ? 0 : 1] || (side === "left" ? "Source" : "Target"),
  );
const buttonText = (direction: "left" | "right"): string => {
  const texts = props.buttonTexts as string[];
  return String(texts?.[direction === "left" ? 0 : 1] || "");
};
const countText = (side: "left" | "right"): string => {
  const checked = side === "left" ? leftCheckedCount.value : rightCheckedCount.value;
  const total = side === "left" ? leftTotalCount.value : rightTotalCount.value;
  const format = (props.format || {}) as Record<string, string>;
  const template =
    checked > 0 ? format.hasChecked || "${checked}/${total}" : format.noChecked || "${total}";
  return template.replace(/\$\{checked\}/g, String(checked)).replace(/\$\{total\}/g, String(total));
};
const hasCheckedItems = (side: "left" | "right"): boolean =>
  (side === "left" ? leftCheckedCount.value : rightCheckedCount.value) > 0;

const renderContext = (side: "left" | "right", item: TransferViewItem): TransferRenderContext => ({
  side,
  key: item.__key,
  label: item.__label,
  checked: Boolean((side === "left" ? leftChecked : rightChecked)[item.__key]),
  disabled: item.__disabled,
});
const renderItem = (side: "left" | "right", item: TransferViewItem): unknown =>
  typeof props.renderContent === "function"
    ? props.renderContent(item.__raw, renderContext(side, item))
    : item.__label;

defineExpose({
  clearQuery,
  scrollToItem,
  leftPanel: {
    get query() {
      return leftFilter.peek();
    },
  },
  rightPanel: {
    get query() {
      return rightFilter.peek();
    },
  },
});
defineStyle(styles);

const Transfer = defineHtml<TransferProps, Record<string, never>, TransferSlots>(`
  <div class="transfer">
  <section class="panel panel-left" aria-label="Source transfer panel">
    <div class="panel-header">
      <input type="checkbox" :checked.prop=${leftAllChecked()} @change="toggleAll('left', $event)" aria-label="Select all source items" />
      <span>${title("left")}</span>
      <span class="count">${countText("left")}</span>
    </div>
    <div class="panel-filter" v-if=${props.filterable}>
      <input :value=${leftFilter} :placeholder=${props.filterPlaceholder} aria-label="Filter source items" @input="onFilterInput('left', $event)" />
    </div>
    <div class="panel-body" role="listbox" aria-multiselectable="true" :style=${panelBodyStyle()} @scroll="onPanelScroll('left', $event)">
      <div v-if=${sourceItems().length === 0} class="panel-empty"><slot name="left-empty">${props.emptyText}</slot></div>
      <div class="panel-window" :style=${panelWindowStyle("left")}>
        <label
          v-for="item in renderedItems('left')"
          :key="item.__key"
          class="panel-item"
          :class="{ 'is-disabled': item.__disabled }"
          :style=${itemStyle()}
          role="option"
          :aria-selected="leftChecked[item.__key] ? 'true' : 'false'"
          :tabindex="item.__disabled ? -1 : 0"
          data-transfer-side="left"
          :data-transfer-key="item.__key"
          @keydown="onItemKeydown('left', item, $event)"
        >
          <input tabindex="-1" type="checkbox" :checked.prop="leftChecked[item.__key] || false" :disabled="item.__disabled" @change="onItemChecked('left', item, $event)" />
          <span v-if=${props.renderContent} class="item-content" :title="item.__label" v-elf-list-content="renderItem('left', item)"></span>
          <span v-else :title="item.__label">{{ item.__label }}</span>
        </label>
      </div>
    </div>
    <footer class="panel-footer"><slot name="left-footer"></slot></footer>
  </section>

  <div class="buttons" aria-label="Transfer actions">
    <button type="button" @click=${moveToRight} :disabled=${!hasCheckedItems("left")} aria-label="Move selected to target">
      <span v-if=${buttonText("right")}>${buttonText("right")}</span>
      <svg v-else class="direction-icon is-right" viewBox="0 0 20 20" aria-hidden="true" focusable="false">
        <path d="M3.5 10h12M11 5.5l4.5 4.5-4.5 4.5"></path>
      </svg>
    </button>
    <button type="button" @click=${moveToLeft} :disabled=${!hasCheckedItems("right")} aria-label="Move selected to source">
      <span v-if=${buttonText("left")}>${buttonText("left")}</span>
      <svg v-else class="direction-icon is-left" viewBox="0 0 20 20" aria-hidden="true" focusable="false">
        <path d="M3.5 10h12M11 5.5l4.5 4.5-4.5 4.5"></path>
      </svg>
    </button>
  </div>

  <section class="panel panel-right" aria-label="Target transfer panel">
    <div class="panel-header">
      <input type="checkbox" :checked.prop=${rightAllChecked()} @change="toggleAll('right', $event)" aria-label="Select all target items" />
      <span>${title("right")}</span>
      <span class="count">${countText("right")}</span>
    </div>
    <div class="panel-filter" v-if=${props.filterable}>
      <input :value=${rightFilter} :placeholder=${props.filterPlaceholder} aria-label="Filter target items" @input="onFilterInput('right', $event)" />
    </div>
    <div class="panel-body" role="listbox" aria-multiselectable="true" :style=${panelBodyStyle()} @scroll="onPanelScroll('right', $event)">
      <div v-if=${targetItems().length === 0} class="panel-empty"><slot name="right-empty">${props.emptyText}</slot></div>
      <div class="panel-window" :style=${panelWindowStyle("right")}>
        <label
          v-for="item in renderedItems('right')"
          :key="item.__key"
          class="panel-item"
          :class="{ 'is-disabled': item.__disabled }"
          :style=${itemStyle()}
          role="option"
          :aria-selected="rightChecked[item.__key] ? 'true' : 'false'"
          :tabindex="item.__disabled ? -1 : 0"
          data-transfer-side="right"
          :data-transfer-key="item.__key"
          @keydown="onItemKeydown('right', item, $event)"
        >
          <input tabindex="-1" type="checkbox" :checked.prop="rightChecked[item.__key] || false" :disabled="item.__disabled" @change="onItemChecked('right', item, $event)" />
          <span v-if=${props.renderContent} class="item-content" :title="item.__label" v-elf-list-content="renderItem('right', item)"></span>
          <span v-else :title="item.__label">{{ item.__label }}</span>
        </label>
      </div>
    </div>
    <footer class="panel-footer"><slot name="right-footer"></slot></footer>
  </section>
  </div>
`);

export { Transfer };
