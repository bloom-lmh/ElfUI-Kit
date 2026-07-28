// elf-select — 下拉选择

import {
  defineExpose,
  defineEmits,
  defineHtml,
  defineProps,
  defineStyle,
  inject,
  onMounted,
  onUnmounted,
  useClickOutside,
  useEffect,
  useEventListener,
  useHost,
  useHostAttr,
  useHostCssVar,
  useHostFlag,
  useRef,
} from "@elfui/core";

import { useDisabled, useFormItem } from "../../../composables";
import { computeVirtualWindow } from "../../../utils/virtual-window";
import { FORM_ITEM_KEY } from "../context";
import { listenForExternalOverlayMotion } from "../../Common/anchored-overlay";
import { useLocaleProvider } from "../../Providers/context";
import styles from "./style.scss?inline";
import { normalizeFieldVariant } from "../../../types/field";

import type { SelectEmits, SelectExpose, SelectFieldNames, SelectOption, SelectProps, SelectValue } from "./types";

export type {
  SelectElement,
  SelectEmits,
  SelectExpose,
  SelectFieldNames,
  SelectOption,
  SelectProps,
  SelectSize,
  SelectVariant,
  SelectValue,
} from "./types";

const SELECT_OPEN_EVENT = "elf-select-open";
let selectId = 0;

const props = defineProps<SelectProps>({
  modelValue: { type: null, default: "" },
  options: { type: Array, default: () => [] as SelectOption[] },
  props: {
    type: Object,
    default: () => ({
      value: "value",
      label: "label",
      disabled: "disabled",
      options: "options",
    }),
  },
  size: { type: String, default: "" },
  variant: { type: String, default: "filled" },
  backgroundColor: { type: String, default: "" },
  label: { type: String, default: "" },
  placeholder: { type: String, default: "" },
  disabled: { type: Boolean, default: false },
  valueKey: { type: String, default: "value" },
  clearable: { type: Boolean, default: false },
  multiple: { type: Boolean, default: false },
  collapseTags: { type: Boolean, default: false },
  maxCollapseTags: { type: Number, default: 1 },
  collapseTagsTooltip: { type: Boolean, default: false },
  tagTooltip: { type: Boolean, default: false },
  tagType: { type: String, default: "info" },
  tagEffect: { type: String, default: "light" },
  multipleLimit: { type: Number, default: 0 },
  filterable: { type: Boolean, default: false },
  allowCreate: { type: Boolean, default: false },
  filterMethod: { type: Function, default: undefined },
  remote: { type: Boolean, default: false },
  remoteShowSuffix: { type: Boolean, default: false },
  remoteMethod: { type: Function, default: undefined },
  debounce: { type: Number, default: 300 },
  reserveKeyword: { type: Boolean, default: true },
  defaultFirstOption: { type: Boolean, default: false },
  automaticDropdown: { type: Boolean, default: false },
  loading: { type: Boolean, default: false },
  loadingText: { type: String, default: "" },
  noDataText: { type: String, default: "" },
  noMatchText: { type: String, default: "" },
  valueOnClear: { type: null, default: undefined },
  emptyValues: { type: Array, default: () => [undefined, null, ""] },
  height: { type: Number, default: 240 },
  virtual: { type: Boolean, default: false },
  virtualThreshold: { type: Number, default: 100 },
  itemHeight: { type: Number, default: 40 },
  overscan: { type: Number, default: 4 },
  fitInputWidth: { type: Boolean, default: false },
  effect: { type: String, default: "light" },
  autocomplete: { type: String, default: "off" },
  popperClass: { type: String, default: "" },
  popperStyle: { type: null, default: "" },
  persistent: { type: Boolean, default: false },
  clearIcon: { type: String, default: "×" },
  suffixIcon: { type: String, default: "▼" },
  validateEvent: { type: Boolean, default: true },
  offset: { type: Number, default: 0 },
  tabindex: { type: null, default: 0 },
  id: { type: String, default: "" },
  name: { type: String, default: "" },
});

const emit = defineEmits<SelectEmits>();

const fi = useFormItem(() => props.size as string);
const formItem = inject(FORM_ITEM_KEY);

const isDisabled = useDisabled(() => Boolean(props.disabled));

const host = useHost();
const locale = useLocaleProvider();
const fallbackId = `elf-select-${++selectId}`;

const open = useRef(false);

const filterText = useRef("");

const rendered = useRef(false);

const closing = useRef(false);
const activeIndex = useRef(-1);
const virtualScrollTop = useRef(0);

const innerValue = useRef<unknown>(props.modelValue);

let remoteTimer: ReturnType<typeof setTimeout> | null = null;

const placeholderText = (): string => props.placeholder || locale.t("common.select");
const loadingText = (): string => props.loadingText || locale.t("table.loading");
const noDataText = (): string => props.noDataText || locale.t("table.empty");
const noMatchText = (): string => props.noMatchText || locale.t("field.noMatch");

useEffect(() => {
  innerValue.set(props.modelValue);
});

useEffect(() => {
  if (open.value) {
    rendered.set(true);
    closing.set(false);
  } else if (rendered.peek()) {
    closing.set(true);
    if (props.persistent) return;
    const timer = setTimeout(() => {
      rendered.set(false);
      closing.set(false);
    }, 200);
    return () => clearTimeout(timer);
  }
});

useHostFlag("data-open", () => open.value);

useHostAttr("data-state", () => fi.state);

useHostFlag("disabled", isDisabled);

useHostAttr("size", () => fi.formSize);
useHostAttr("variant", () => normalizeFieldVariant(props.variant));
useHostFlag("data-has-label", () => Boolean(props.label));
useHostCssVar("--elf-field-custom-bg", () => props.backgroundColor || "");

useHostCssVar("--_select-dropdown-height", () => `${Math.max(80, Number(props.height) || 240)}px`);
useHostCssVar("--_select-offset", () => `${Number(props.offset) || 0}px`);

const closeDropdown = (emitChange = true): void => {
  if (!open.peek()) return;
  open.set(false);
  filterText.set("");
  if (emitChange) emit("visible-change", false);
};

const getDropdownEl = (): HTMLElement | null => host.shadowRoot?.querySelector<HTMLElement>(".dropdown") ?? null;

const openDropdown = (): void => {
  if (isDisabled() || open.peek()) return;
  document.dispatchEvent(new CustomEvent(SELECT_OPEN_EVENT, { detail: host }));
  open.set(true);
  const nextActiveIndex = preferredActiveIndex();
  activeIndex.set(nextActiveIndex);
  queueMicrotask(() => ensureOptionVisible(nextActiveIndex));
  emit("visible-change", true);
};

useClickOutside(host, () => {
  closeDropdown();
});

let cleanupOverlayMotion = (): void => {};
onMounted(() => {
  cleanupOverlayMotion = listenForExternalOverlayMotion(
    () => [getDropdownEl()],
    () => closeDropdown(),
  );
});
onUnmounted(() => cleanupOverlayMotion());

useEventListener<CustomEvent<HTMLElement>>(document, SELECT_OPEN_EVENT, (e) => {
  if (e.detail !== host) closeDropdown();
});

const isMulti = (): boolean => Boolean(props.multiple);

const fieldNames = (): Required<SelectFieldNames> => {
  const fields = (props.props || {}) as SelectFieldNames;
  return {
    value: fields.value || "value",
    label: fields.label || "label",
    disabled: fields.disabled || "disabled",
    options: fields.options || "options",
  };
};

const rawOptions = (): SelectOption[] => (Array.isArray(props.options) ? (props.options as SelectOption[]) : []);

const optionChildren = (option: SelectOption): SelectOption[] => {
  const children = option[fieldNames().options];
  return Array.isArray(children) ? (children as SelectOption[]) : [];
};

const flatOptions = (): SelectOption[] => {
  const result: SelectOption[] = [];
  const walk = (items: SelectOption[], groupDisabled = false): void => {
    for (const option of items) {
      const children = optionChildren(option);
      if (children.length > 0) {
        walk(
          children.map((child) => ({
            ...child,
            disabled: groupDisabled || Boolean(child.disabled),
          })),
          groupDisabled || isOptionDisabled(option),
        );
      } else {
        result.push(option);
      }
    }
  };
  walk(rawOptions());
  return result;
};

const optionValue = (option: SelectOption): SelectValue =>
  (option[fieldNames().value] ?? option.value ?? option[fieldNames().label] ?? option.label ?? "") as SelectValue;

const optionLabel = (option: SelectOption): string =>
  String(option[fieldNames().label] ?? option.label ?? optionValue(option) ?? "");

const isOptionDisabled = (option: SelectOption): boolean => Boolean(option[fieldNames().disabled] ?? option.disabled);

const valueIdentity = (value: unknown): unknown => {
  if (value && typeof value === "object") {
    return (value as Record<string, unknown>)[props.valueKey || "value"] ?? value;
  }
  return value;
};

const sameValue = (a: unknown, b: unknown): boolean => Object.is(valueIdentity(a), valueIdentity(b));

const isEmptyValue = (value: unknown): boolean =>
  (Array.isArray(props.emptyValues) ? props.emptyValues : [undefined, null, ""]).some((item) => Object.is(item, value));

const valueArr = (): SelectValue[] => {
  const v = innerValue.value;
  if (isMulti() && Array.isArray(v)) return v as SelectValue[];
  return !isEmptyValue(v) ? [v as SelectValue] : [];
};

const filteredOptions = (): SelectOption[] => {
  const opts = flatOptions();
  if (!props.filterable || props.remote || !filterText.value) return opts;
  if (typeof props.filterMethod === "function") {
    return opts.filter((option) => props.filterMethod?.(filterText.value, option));
  }
  const q = filterText.value.toLowerCase();
  return opts.filter((o) => optionLabel(o).toLowerCase().includes(q));
};

const createdOption = (): SelectOption | null => {
  const query = filterText.value.trim();
  if (!props.allowCreate || !props.filterable || query.length === 0) return null;
  const exists = flatOptions().some((option) => String(optionLabel(option)) === query);
  return exists ? null : { label: query, value: query };
};

const viewOptions = (): SelectOption[] => {
  const created = createdOption();
  return created ? [created, ...filteredOptions()] : filteredOptions();
};

const viewOptionEntries = (): Array<{
  option: SelectOption;
  index: number;
  key: string;
}> =>
  viewOptions().map((option, index) => ({
    option,
    index,
    key: `${index}-${String(valueIdentity(optionValue(option)))}`,
  }));

const virtualEnabled = (): boolean => Boolean(
  props.virtual && viewOptions().length >= Math.max(0, Number(props.virtualThreshold) || 0),
);

useHostFlag("data-virtualized", virtualEnabled);

const normalizedItemHeight = (): number => Math.max(24, Number(props.itemHeight) || 40);

const virtualWindow = () => computeVirtualWindow({
  count: viewOptions().length,
  itemSize: normalizedItemHeight(),
  viewportSize: Math.max(80, Number(props.height) || 240),
  scrollOffset: virtualScrollTop.value,
  overscan: Math.max(0, Number(props.overscan) || 0),
});

const renderedOptionEntries = (): ReturnType<typeof viewOptionEntries> => {
  const entries = viewOptionEntries();
  if (!virtualEnabled()) return entries;
  const range = virtualWindow();
  return entries.slice(range.start, range.end);
};

const optionsTrackStyle = (): Record<string, string> => virtualEnabled()
  ? { height: `${virtualWindow().totalSize}px` }
  : {};

const optionStyle = (index: number): Record<string, string> => virtualEnabled()
  ? {
      height: `${normalizedItemHeight()}px`,
      transform: `translateY(${index * normalizedItemHeight()}px)`,
    }
  : {};

const firstEnabledIndex = (): number => viewOptions().findIndex((option) => !isOptionDisabled(option));

const preferredActiveIndex = (): number => {
  const options = viewOptions();
  const selectedIndex = options.findIndex((option) => !isOptionDisabled(option) && isSelected(option));
  return selectedIndex >= 0 ? selectedIndex : firstEnabledIndex();
};

const lastEnabledIndex = (): number => {
  const options = viewOptions();
  for (let index = options.length - 1; index >= 0; index -= 1) {
    const option = options[index];
    if (option && !isOptionDisabled(option)) return index;
  }
  return -1;
};

const syncDropdownScroll = (scrollTop: number): void => {
  queueMicrotask(() => {
    const dropdown = getDropdownEl();
    const track = dropdown?.querySelector<HTMLElement>(".options-track");
    if (dropdown) dropdown.scrollTop = Math.max(0, (track?.offsetTop ?? 0) + scrollTop);
  });
};

const ensureOptionVisible = (index: number): void => {
  if (index < 0) return;
  if (!virtualEnabled()) {
    queueMicrotask(() => {
      host.shadowRoot
        ?.querySelector<HTMLElement>(`[data-index="${index}"]`)
        ?.scrollIntoView({ block: "nearest" });
    });
    return;
  }

  const rowTop = index * normalizedItemHeight();
  const rowBottom = rowTop + normalizedItemHeight();
  const viewportSize = Math.max(80, Number(props.height) || 240);
  const current = virtualScrollTop.peek();
  const next = rowTop < current
    ? rowTop
    : rowBottom > current + viewportSize
      ? rowBottom - viewportSize
      : current;
  if (next !== current) virtualScrollTop.set(next);
  syncDropdownScroll(next);
};

const setActiveIndex = (index: number): void => {
  activeIndex.set(index);
  ensureOptionVisible(index);
};

const moveActive = (step: 1 | -1): void => {
  const options = viewOptions();
  if (options.length === 0) {
    activeIndex.set(-1);
    return;
  }
  let index = activeIndex.peek();
  for (let attempts = 0; attempts < options.length; attempts += 1) {
    index = (index + step + options.length) % options.length;
    const option = options[index];
    if (option && !isOptionDisabled(option)) {
      setActiveIndex(index);
      return;
    }
  }
};

const selectedOptions = (): SelectOption[] =>
  valueArr()
    .map((val) => flatOptions().find((o) => sameValue(optionValue(o), val)))
    .filter((x): x is SelectOption => Boolean(x));

const isSelected = (opt: SelectOption): boolean => valueArr().some((value) => sameValue(value, optionValue(opt)));

const hasValue = (): boolean => valueArr().length > 0;

useHostFlag("data-dirty", hasValue);

const displayOpts = (): SelectOption[] => {
  const sel = selectedOptions();
  if (!props.collapseTags) return sel;
  return sel.slice(0, Math.max(1, Number(props.maxCollapseTags) || 1));
};

const displayOptionEntries = (): Array<{
  option: SelectOption;
  index: number;
  key: string;
}> =>
  displayOpts().map((option, index) => ({
    option,
    index,
    key: `${index}-${String(valueIdentity(optionValue(option)))}`,
  }));

const toggleOpen = (e: Event): void => {
  e.stopPropagation();
  if (isDisabled()) return;
  const next = !open.value;
  if (next) openDropdown();
  else closeDropdown();
};

const toggleDropdown = (visible?: boolean): void => {
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

const selectOption = (opt: SelectOption, e?: Event): void => {
  if (e) {
    e.stopPropagation();
    e.preventDefault();
  }
  if (isOptionDisabled(opt)) return;
  const value = optionValue(opt);
  if (isMulti()) {
    const arr = valueArr();
    const idx = arr.findIndex((item) => sameValue(item, value));
    let next: SelectValue[];
    if (idx >= 0) {
      next = arr.filter((_, i) => i !== idx);
    } else {
      if (Number(props.multipleLimit) > 0 && arr.length >= Number(props.multipleLimit)) return;
      next = [...arr, value];
    }
    innerValue.set(next); // 更新本地副本，防 mutate
    emit("update:modelValue", next);
    emit("change", next);
    if (props.validateEvent) formItem?.validateTrigger("change");
    if (!props.reserveKeyword) filterText.set("");
  } else {
    innerValue.set(value);
    emit("update:modelValue", value);
    emit("change", value);
    if (props.validateEvent) formItem?.validateTrigger("change");
    closeDropdown();
  }
};

const removeTag = (opt: SelectOption): void => {
  if (!isMulti()) return;
  const removed = optionValue(opt);
  const arr = valueArr().filter((x) => !sameValue(x, removed));
  innerValue.set(arr);
  emit("update:modelValue", arr);
  emit("change", arr);
  emit("remove-tag", removed);
  if (props.validateEvent) formItem?.validateTrigger("change");
};

const clear = (): void => {
  const configured = props.valueOnClear;
  const next =
    typeof configured === "function" ? configured() : configured !== undefined ? configured : isMulti() ? [] : "";
  innerValue.set(next);
  emit("update:modelValue", next);
  emit("change", next);
  emit("clear");
  if (props.validateEvent) formItem?.validateTrigger("change");
};

const onFilterInput = (e: Event): void => {
  filterText.set((e.target as HTMLInputElement).value);
  virtualScrollTop.set(0);
  setActiveIndex(firstEnabledIndex());
  if (!open.value) openDropdown();
  if (props.remote) {
    if (remoteTimer) clearTimeout(remoteTimer);
    remoteTimer = setTimeout(
      () => {
        props.remoteMethod?.(filterText.value);
        emit("search", filterText.value);
      },
      Math.max(0, Number(props.debounce) || 0),
    );
  }
};

const onDropdownClick = (event: Event): void => {
  event.stopPropagation();
  const target = event.target as HTMLElement | null;
  const optionEl = target?.closest?.(".option") as HTMLElement | null;
  const index = Number(optionEl?.dataset.index ?? -1);
  const option = viewOptions()[index];
  if (option) {
    activeIndex.set(index);
    selectOption(option, event);
  }
};

const onRemoveTagClick = (event: Event): void => {
  event.stopPropagation();
  const target = event.target as HTMLElement | null;
  const button = target?.closest?.(".tag-remove") as HTMLElement | null;
  const index = Number(button?.dataset.index ?? -1);
  const option = displayOpts()[index];
  if (option) removeTag(option);
};

const onClearClick = (event: Event): void => {
  event.stopPropagation();
  clear();
};

const displayLabel = (): string => {
  return selectedOptions().map(optionLabel).join("，");
};

const collapsedCount = (): number => {
  const selected = selectedOptions();
  const count = Math.max(1, Number(props.maxCollapseTags) || 1);
  return props.collapseTags && selected.length > count ? selected.length - count : 0;
};

const collapsedLabels = (): string => {
  const count = Math.max(1, Number(props.maxCollapseTags) || 1);
  return selectedOptions().slice(count).map(optionLabel).join("、");
};

const tagTitle = (option: SelectOption): string | null => (props.tagTooltip ? optionLabel(option) : null);

const showClear = (): boolean => {
  return Boolean(props.clearable && hasValue() && !isDisabled());
};

const showFilter = (): boolean => {
  return Boolean(props.filterable && open.value);
};

const stopClick = (event: Event): void => event.stopPropagation();

const onTriggerFocus = (event: FocusEvent): void => {
  emit("focus", event);
  if (props.automaticDropdown) openDropdown();
};

const onTriggerBlur = (event: FocusEvent): void => {
  emit("blur", event);
  if (props.validateEvent) formItem?.validateTrigger("blur");
};

const showSuffix = (): boolean => !showFilter() || !props.remote || Boolean(props.remoteShowSuffix);

const onTriggerKeydown = (event: KeyboardEvent): void => {
  if (event.key === "ArrowDown" || event.key === "ArrowUp") {
    event.preventDefault();
    if (!open.peek()) openDropdown();
    moveActive(event.key === "ArrowDown" ? 1 : -1);
    return;
  }
  if (event.key === "Home" && open.peek()) {
    event.preventDefault();
    setActiveIndex(firstEnabledIndex());
    return;
  }
  if (event.key === "End" && open.peek()) {
    event.preventDefault();
    setActiveIndex(lastEnabledIndex());
    return;
  }
  if (event.key === "Enter") {
    event.preventDefault();
    if (!open.peek()) {
      openDropdown();
      return;
    }
    const index = activeIndex.peek() >= 0 ? activeIndex.peek() : props.defaultFirstOption ? firstEnabledIndex() : -1;
    const option = viewOptions()[index];
    if (option) selectOption(option, event);
    return;
  }
  if (event.key === "Escape") closeDropdown();
  if (event.key === "Tab") closeDropdown();
};

const onDropdownScroll = (event: Event): void => {
  const target = event.currentTarget as HTMLElement;
  if (virtualEnabled()) {
    const track = target.querySelector<HTMLElement>(".options-track");
    virtualScrollTop.set(Math.max(0, target.scrollTop - (track?.offsetTop ?? 0)));
  }
  emit("popup-scroll", {
    scrollTop: target.scrollTop,
    scrollLeft: target.scrollLeft,
  });
  if (target.scrollTop <= 0) emit("end-reached", "top");
  if (target.scrollTop + target.clientHeight >= target.scrollHeight - 1) {
    emit("end-reached", "bottom");
  }
};

const selectedLabel = (): string | string[] => (isMulti() ? selectedOptions().map(optionLabel) : displayLabel());

const focus = (): void => host.shadowRoot?.querySelector<HTMLElement>(".trigger")?.focus();

const blur = (): void => host.shadowRoot?.querySelector<HTMLElement>(".trigger")?.blur();

const scrollToOption = (index: number): void => {
  const count = viewOptions().length;
  if (count === 0) return;
  const normalized = Math.max(0, Math.min(count - 1, Math.floor(Number(index) || 0)));
  if (virtualEnabled()) {
    const next = normalized * normalizedItemHeight();
    virtualScrollTop.set(next);
    syncDropdownScroll(next);
    return;
  }
  queueMicrotask(() => {
    host.shadowRoot
      ?.querySelector<HTMLElement>(`[data-index="${normalized}"]`)
      ?.scrollIntoView({ block: "start" });
  });
};

const controlId = (): string => props.id || fallbackId;
const listboxId = (): string => `${controlId()}-listbox`;
const optionId = (index: number): string => `${listboxId()}-option-${index}`;
const activeOptionId = (): string | null => (activeIndex.value >= 0 ? optionId(activeIndex.value) : null);

defineExpose<SelectExpose>({
  open: openDropdown,
  close: closeDropdown,
  toggle: toggleDropdown,
  focus,
  blur,
  selectedLabel,
  scrollToOption,
});

defineStyle(styles);

const Select = defineHtml(`
    <div class="trigger" part="trigger" :id=${controlId()} :tabindex=${props.tabindex} role="combobox"
        aria-haspopup="listbox" :aria-controls=${listboxId()} :aria-disabled=${isDisabled() ? "true" : "false"}
        :aria-expanded=${open ? "true" : "false"} :aria-activedescendant=${activeOptionId()} @click=${toggleOpen}
        @focus=${onTriggerFocus} @blur=${onTriggerBlur} @keydown=${onTriggerKeydown}>
        <fieldset v-if=${props.label} class="field-outline" aria-hidden="true">
            <legend><span>${props.label}</span></legend>
        </fieldset>
        <span v-if=${props.label} class="field-label">${props.label}</span>
        <slot name="prefix"></slot>
        <span v-if=${!hasValue() && !showFilter()} class="placeholder">${placeholderText()}</span>
        <template v-if=${isMulti()}>
            <span v-for="entry in displayOptionEntries()" :key="entry.key" class="tag" part="tag"
                :data-type=${props.tagType} :data-effect=${props.tagEffect} :title="tagTitle(entry.option)">
                <slot name="tag" :option="entry.option" :index="entry.index" :value="optionValue(entry.option)"
                    :label="optionLabel(entry.option)" :remove=${removeTag}>
                    {{ optionLabel(entry.option) }}
                    <button type="button" class="tag-remove" :data-index="String(entry.index)"
                        @click=${onRemoveTagClick}>×</button>
                </slot>
            </span>
            <span v-if=${collapsedCount() > 0} class="collapse-tag"
                :title=${props.collapseTagsTooltip ? collapsedLabels() : null}>+${collapsedCount()}</span>
        </template>
        <span v-else-if=${hasValue() && !showFilter()} class="value">${displayLabel()}</span>
        <input v-if=${showFilter()} class="filter-input" :id=${props.id || null} :name=${props.name || null}
            :autocomplete=${props.autocomplete || "off"} role="searchbox" :value=${filterText} @input=${onFilterInput}
            @click=${stopClick} />
        <span class="suffix" part="suffix">
            <button v-if=${showClear()} type="button" class="clear" @click=${onClearClick}>
                <slot name="clear-icon">${props.clearIcon || "×"}</slot>
            </button>
            <span v-else-if=${showSuffix()} class="arrow">
                <slot name="suffix-icon">${props.suffixIcon || "▼"}</slot>
            </span>
        </span>
    </div>
    <div v-if=${rendered && !isDisabled()}
        :class=${[
          "dropdown",
          props.popperClass,
          "is-effect-" + props.effect,
          {
            active: open && !closing,
            closing: closing,
            "fit-input-width": props.fitInputWidth,
          },
        ]}
        :style=${props.popperStyle} part="dropdown" :id=${listboxId()} role="listbox"
        :aria-multiselectable=${isMulti() ? "true" : null} @click=${onDropdownClick} @scroll=${onDropdownScroll}>
        <slot name="header"></slot>
        <div v-if=${props.loading} class="status">
            <slot name="loading">${loadingText()}</slot>
        </div>
        <div v-else-if=${viewOptions().length === 0} class="status">
            <slot name="empty">${filterText ? noMatchText() : noDataText()}</slot>
        </div>
        <div class="options-track" :style=${optionsTrackStyle()}>
          <div v-for="entry in renderedOptionEntries()" :key="entry.key" :data-index="String(entry.index)"
              :id="optionId(entry.index)" role="option" :aria-selected="isSelected(entry.option) ? 'true' : 'false'"
              :aria-disabled="isOptionDisabled(entry.option) ? 'true' : 'false'" :style="optionStyle(entry.index)"
              :class="[
                    'option',
                    {
                      selected: isSelected(entry.option),
                      disabled: isOptionDisabled(entry.option),
                      active: activeIndex === entry.index,
                      'is-virtual': virtualEnabled()
                    }
                  ]">
              <span>
                  <slot name="label" :option="entry.option" :index="entry.index" :value="optionValue(entry.option)"
                      :label="optionLabel(entry.option)">{{ optionLabel(entry.option) }}</slot>
              </span>
              <span v-if="isSelected(entry.option)" class="check">✓</span>
          </div>
        </div>
        <slot name="footer"></slot>
    </div>
`);

export { Select };
