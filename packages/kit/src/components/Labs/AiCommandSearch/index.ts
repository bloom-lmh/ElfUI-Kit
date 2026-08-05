import {
  defineEmits,
  defineExpose,
  defineHtml,
  defineProps,
  defineStyle,
  onMounted,
  useHostAttr,
  useHostFlag,
  useRef,
  useTemplateRef,
} from "@elfui/core";

import styles from "./style.scss?inline";
import type {
  AiCommandItem,
  AiCommandSearchEmits,
  AiCommandSearchExpose,
  AiCommandSearchProps,
  AiCommandLabels,
} from "./types";

export type {
  AiCommandItem,
  AiCommandSearchElement,
  AiCommandSearchEmits,
  AiCommandSearchExpose,
  AiCommandSearchProps,
  AiCommandLabels,
  AiCommandSubmitDetail,
} from "./types";

const DEFAULT_LABELS: AiCommandLabels = {
  placeholder: "Search…",
  empty: "No matches",
  results: "Results",
  select: "Select command",
};

const props = defineProps<AiCommandSearchProps>({
  items: { type: Array, default: () => [] },
  placeholder: { type: String, default: "" },
  emptyText: { type: String, default: "" },
  maxResults: { type: Number, default: 8 },
  autofocus: { type: Boolean, default: false },
  labels: { type: Object, default: () => ({}) },
  ariaLabel: { type: String, default: "Command search" },
});

const emit = defineEmits<AiCommandSearchEmits>(["select", "query-change", "submit"]);
const input = useTemplateRef<HTMLInputElement>("input");
const query = useRef("");
const activeIndex = useRef(-1);

const label = (key: keyof AiCommandLabels): string =>
  props.labels?.[key] || DEFAULT_LABELS[key] || key;
const placeholder = (): string => props.placeholder || label("placeholder");
const emptyText = (): string => props.emptyText || label("empty");
const normalizedQuery = (): string => query.value.trim().toLowerCase();
const itemText = (item: AiCommandItem): string =>
  `${item.title} ${item.description || ""} ${item.keywords || ""}`.toLowerCase();
const matches = (item: AiCommandItem): boolean => {
  const needle = normalizedQuery();
  return needle.length === 0 || itemText(item).includes(needle);
};
const filteredItems = (): AiCommandItem[] =>
  props.items.filter(matches).slice(0, Math.max(1, Number(props.maxResults) || 8));
const hasResults = (): boolean => filteredItems().length > 0;
const isEmpty = (): boolean => !hasResults();
const resultCount = (): number => filteredItems().length;
const optionId = (index: number): string => `elf-ai-command-option-${index}`;
const itemKey = (item: AiCommandItem, index: number): string | number =>
  item.id ?? `command-option-${index}`;
const isActive = (index: number): boolean => activeIndex.value === index;
const activeItem = (): AiCommandItem | null => filteredItems()[activeIndex.value] || null;
const resultsLabel = (): string => `${label("results")} ${resultCount()}`;
const activeDescendant = (): string => (activeItem() ? optionId(activeIndex.value) : "");

const selectItem = (item: AiCommandItem): void => {
  emit("select", item);
  emit("submit", { query: query.value, item });
};

const onInput = (event: Event): void => {
  query.set((event.currentTarget as HTMLInputElement).value);
  activeIndex.set(-1);
  emit("query-change", query.value);
};

const onKeydown = (event: KeyboardEvent): void => {
  const items = filteredItems();
  if (event.key === "ArrowDown") {
    event.preventDefault();
    activeIndex.set(items.length === 0 ? -1 : (activeIndex.value + 1) % items.length);
  } else if (event.key === "ArrowUp") {
    event.preventDefault();
    activeIndex.set(
      items.length === 0 ? -1 : (activeIndex.value - 1 + items.length) % items.length,
    );
  } else if (event.key === "Enter") {
    event.preventDefault();
    const item = activeItem();
    if (item) selectItem(item);
    else emit("submit", { query: query.value, item: null });
  } else if (event.key === "Escape") {
    event.preventDefault();
    clear();
  }
};

const onItemClick = (event: Event): void => {
  const index = Number((event.currentTarget as HTMLElement).dataset.index);
  const item = filteredItems()[index];
  if (item) {
    activeIndex.set(index);
    selectItem(item);
  }
};

const focus = (): void => input.value?.focus();
const blur = (): void => input.value?.blur();
const clear = (): void => {
  query.set("");
  activeIndex.set(-1);
  emit("query-change", "");
  focus();
};
const getQuery = (): string => query.value;

onMounted(() => {
  if (props.autofocus) focus();
});

useHostFlag("data-empty", isEmpty);
useHostFlag("data-open", () => hasResults());
useHostAttr("aria-label", () => props.ariaLabel || label("placeholder"));

defineExpose<AiCommandSearchExpose>(
  { focus, blur, clear, getQuery },
  { overrideNative: ["focus", "blur"] },
);

defineStyle(styles);

const AiCommandSearch = defineHtml(`
  <div class="command-search" role="combobox" :aria-expanded=${String(hasResults())}>
    <div class="field">
      <span class="search-icon" aria-hidden="true"></span>
      <input
        ref="input"
        class="input"
        type="text"
        :value=${query}
        :placeholder=${placeholder()}
        :aria-label=${props.ariaLabel}
        role="searchbox"
        aria-autocomplete="list"
        :aria-controls="'elf-ai-command-list'"
        :aria-activedescendant=${activeDescendant()}
        @input=${onInput}
        @keydown=${onKeydown}
      >
      <span class="kbd" aria-hidden="true">/</span>
    </div>
    <div
      v-if=${hasResults()}
      id="elf-ai-command-list"
      class="list"
      role="listbox"
      :aria-label=${resultsLabel()}
    >
      <span class="list-label">${resultsLabel()}</span>
      <button
        v-for="(item, index) in filteredItems()"
        :key="itemKey(item, index)"
        class="option"
        :class="{ active: isActive(index) }"
        type="button"
        role="option"
        :id="optionId(index)"
        :data-index="index"
        :aria-selected="String(isActive(index))"
        @click=${onItemClick}
      >
        <span class="option-text">
          <span class="option-title">{{ item.title }}</span>
          <span v-if="item.description" class="option-description">{{ item.description }}</span>
        </span>
        <span v-if="item.hint" class="option-hint">{{ item.hint }}</span>
      </button>
    </div>
    <div v-else class="empty" role="status">
      <span class="empty-icon" aria-hidden="true"></span>
      <span>${emptyText()}</span>
    </div>
  </div>
`);

export { AiCommandSearch };
