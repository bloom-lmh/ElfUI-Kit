import {
  defineEmits,
  defineHtml,
  defineProps,
  defineStyle,
  useHostAttr,
  useHostCssVar,
  useHostFlag,
  useRef,
  useTemplateRef
} from "@elfui/core";

import { useDisabled, useFormControl, useFormItem } from "../../../composables";
import { normalizeFieldVariant } from "../../../types/field";
import styles from "./style.scss?inline";
import type { MentionOption, MentionProps, MentionPrefix } from "./types";

export type {
  MentionCheckIsWhole,
  MentionFilterOption,
  MentionOption,
  MentionPlacement,
  MentionPrefix,
  MentionProps
} from "./types";

interface ViewOption {
  key: string;
  label: string;
  insertText: string;
  disabled: boolean;
  index: number;
  raw: MentionOption;
}

interface TriggerRange {
  start: number;
  end: number;
  prefix: string;
}

const props = defineProps<MentionProps>({
  modelValue: { type: String, default: "" },
  options: { type: Array, default: () => [] },
  prefix: { type: [String, Array], default: "@" },
  prefixes: { type: Array, default: () => [] },
  placeholder: { type: String, default: "" },
  label: { type: String, default: "" },
  variant: { type: String, default: "filled" },
  backgroundColor: { type: String, default: "" },
  disabled: { type: Boolean, default: false },
  rows: { type: Number, default: 3 },
  split: { type: String, default: " " },
  filterOption: { type: Function, default: undefined },
  whole: { type: Boolean, default: false },
  checkIsWhole: { type: Function, default: undefined },
  loading: { type: Boolean, default: false },
  loadingText: { type: String, default: "Loading..." },
  placement: { type: String, default: "bottom" },
  id: { type: String, default: "" },
  name: { type: String, default: "" },
  ariaLabel: { type: String, default: "" },
  validateEvent: { type: Boolean, default: true }
});

const emit = defineEmits<{
  "update:modelValue": [value: string];
  input: [value: string];
  select: [option: MentionOption, prefix: string];
  focus: [event: FocusEvent];
  blur: [event: FocusEvent];
}>();

const ctl = useFormControl<string>(props, emit, {
  ...(props.validateEvent === false
    ? { triggers: { input: false, change: false, blur: false } }
    : {})
});
const fi = useFormItem(() => "");
const isDisabled = useDisabled(() => Boolean(props.disabled));
const textareaRef = useTemplateRef<HTMLTextAreaElement>("textareaEl");
const open = useRef(false);
const query = useRef("");
const activeIndex = useRef(-1);
const activeDescendant = (): string | null =>
  activeIndex.value >= 0 ? `${listboxId}-option-${activeIndex.value}` : null;
const range = useRef<TriggerRange | null>(null);
const listboxId = `elf-mention-${Math.random().toString(36).slice(2)}`;

const prefixes = (): string[] => {
  if (Array.isArray(props.prefixes) && props.prefixes.length) return props.prefixes.filter(Boolean).sort((a, b) => b.length - a.length);
  const value = props.prefix as MentionPrefix;
  return (Array.isArray(value) ? value : [value]).filter(Boolean).sort((a, b) => b.length - a.length);
};

const options = (): ViewOption[] => {
  const pattern = query.value.toLowerCase();
  const filter = props.filterOption;
  return (props.options || [])
    .map((item, index) => ({
      key: `${index}-${String(item.value ?? item.label ?? "")}`,
      label: String(item.label ?? item.value ?? ""),
      insertText: String(item.value ?? item.label ?? ""),
      disabled: Boolean(item.disabled),
      index,
      raw: item
    }))
    .filter((item) => {
      if (typeof filter === "function") return filter(query.value, item.raw);
      return !pattern || item.label.toLowerCase().includes(pattern);
    })
    // Event handlers address the rendered list. Source indexes are not safe after
    // filtering (for example the third source item can become the first result).
    .map((item, index) => ({ ...item, index }));
};

const resetActive = (): void => {
  activeIndex.set(options().findIndex((option) => !option.disabled));
};

const isBoundary = (value: string, index: number, prefix: string): boolean => {
  if (!props.whole) return true;
  const check = props.checkIsWhole;
  if (typeof check === "function") return check(value.slice(0, index), prefix);
  if (index === 0) return true;
  const split = String(props.split || " ");
  return split.includes(value[index - 1] ?? "");
};

const parseQuery = (value: string, caret: number): void => {
  const beforeCaret = value.slice(0, caret);
  let match: TriggerRange | null = null;
  for (const prefix of prefixes()) {
    const start = beforeCaret.lastIndexOf(prefix);
    if (start < 0 || !isBoundary(value, start, prefix)) continue;
    const pattern = beforeCaret.slice(start + prefix.length);
    if (String(props.split || " ").split("").some((separator) => pattern.includes(separator))) continue;
    if (!match || start > match.start) match = { start, end: caret, prefix };
  }
  range.set(match);
  if (!match) {
    query.set("");
    activeIndex.set(-1);
    open.set(false);
    return;
  }
  query.set(value.slice(match.start + match.prefix.length, caret));
  open.set(true);
  resetActive();
};

const onInput = (event: Event): void => {
  const textarea = event.target as HTMLTextAreaElement;
  const value = textarea.value;
  ctl.dispatchInput(value);
  parseQuery(value, textarea.selectionStart ?? value.length);
};

const selectAt = (index: number): void => {
  const option = options()[index];
  const currentRange = range.value;
  if (!option || option.disabled || !currentRange) return;
  const value = String(ctl.model.value || "");
  const suffix = String(props.split || " ");
  const next = `${value.slice(0, currentRange.start)}${currentRange.prefix}${option.insertText}${suffix}${value.slice(currentRange.end)}`;
  ctl.dispatchInput(next);
  emit("select", option.raw, currentRange.prefix);
  open.set(false);
  activeIndex.set(-1);
  queueMicrotask(() => {
    const textarea = textareaRef.value;
    if (!textarea) return;
    const position = currentRange.start + currentRange.prefix.length + option.insertText.length + suffix.length;
    textarea.focus();
    textarea.setSelectionRange(position, position);
  });
};

const onOptionClick = (event: Event): void => {
  const index = Number((event.currentTarget as HTMLElement).dataset.index);
  if (Number.isInteger(index)) selectAt(index);
};

const moveActive = (step: 1 | -1): void => {
  const items = options();
  if (!items.length) return;
  let index = activeIndex.value;
  for (let attempt = 0; attempt < items.length; attempt += 1) {
    index = (index + step + items.length) % items.length;
    const item = items[index];
    if (item && !item.disabled) {
      activeIndex.set(index);
      return;
    }
  }
};

const onKeydown = (event: KeyboardEvent): void => {
  if (!open.value || isDisabled()) return;
  if (event.key === "ArrowDown" || event.key === "ArrowUp") {
    event.preventDefault();
    moveActive(event.key === "ArrowDown" ? 1 : -1);
  } else if (event.key === "Enter" && activeIndex.value >= 0) {
    event.preventDefault();
    selectAt(activeIndex.value);
  } else if (event.key === "Escape") {
    open.set(false);
    activeIndex.set(-1);
  }
};

const onOptionMouseenter = (event: Event): void => {
  const index = Number((event.currentTarget as HTMLElement).dataset.index);
  if (Number.isInteger(index) && !options()[index]?.disabled) activeIndex.set(index);
};

const inputPlaceholder = (): string => {
  if (props.label && props.placeholder.trim() === props.label.trim()) return "";
  return props.placeholder;
};

useHostAttr("variant", () => normalizeFieldVariant(props.variant));
useHostAttr("data-state", () => fi.state || "");
useHostFlag("disabled", isDisabled);
useHostFlag("data-open", () => open.value);
useHostFlag("data-dirty", () => Boolean(ctl.model.value));
useHostFlag("data-has-label", () => Boolean(props.label));
useHostCssVar("--elf-field-custom-bg", () => props.backgroundColor || "");

defineStyle(styles);

const Mention = defineHtml<MentionProps>(`
  <div class="mention" part="mention" :class=${[`placement-${props.placement}`, { loading: Boolean(props.loading) }]} :data-state=${fi.state || null}>
    <div class="field" part="field">
      <fieldset class="field-outline" aria-hidden="true">
        <legend><span v-if=${props.label}>${props.label}</span></legend>
      </fieldset>
      <span v-if=${props.label} class="field-label" part="label">${props.label}</span>
      <textarea
        ref="textareaEl"
        part="textarea"
        :id=${props.id || null}
        :name=${props.name || null}
        :value.prop=${ctl.model.value}
        :rows.prop=${props.rows}
        :placeholder=${inputPlaceholder()}
        :disabled=${isDisabled()}
        :aria-label=${props.ariaLabel || props.label || props.placeholder || null}
        role="combobox"
        aria-autocomplete="list"
        :aria-expanded=${open ? "true" : "false"}
        :aria-controls=${listboxId}
        :aria-activedescendant=${activeDescendant()}
        @input=${onInput}
        @keydown=${onKeydown}
        @focus=${(event: FocusEvent) => ctl.dispatchFocus(event)}
        @blur=${(event: FocusEvent) => { ctl.dispatchBlur(event); setTimeout(() => open.set(false), 120); }}
      ></textarea>
    </div>
    <div v-if=${open && props.loading} class="panel status" role="status"><slot name="loading">${props.loadingText}</slot></div>
    <div v-else-if=${open && options().length} :id=${listboxId} class="panel" role="listbox">
      <button
        v-for="item in options()"
        :key="item.key"
        :id="\`${listboxId}-option-\${item.index}\`"
        class="option"
        type="button"
        :data-index="item.index"
        :disabled="item.disabled"
        role="option"
        :aria-selected="activeIndex === item.index ? 'true' : 'false'"
        :class="{ active: activeIndex === item.index }"
        @mousedown=${onOptionClick}
        @mouseenter=${onOptionMouseenter}
      ><slot :item="item">{{ item.label }}</slot></button>
    </div>
  </div>
`);

export { Mention };
