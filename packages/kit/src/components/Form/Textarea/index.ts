import {
  defineEmits,
  defineExpose,
  defineHtml,
  defineProps,
  defineStyle,
  onMounted,
  onUnmounted,
  useEffect,
  useHost,
  useHostAttr,
  useHostCssVar,
  useHostFlag,
  useRef,
  useTemplateRef,
} from "@elfui/core";

import { useDisabled, useFormControl, useFormItem } from "../../../composables";
import styles from "./style.scss?inline";
import { normalizeFieldVariant } from "../../../types/field";

import type { TextareaProps, TextareaSize } from "./types";

export type {
  TextareaAutosizeOptions,
  TextareaFormatter,
  TextareaGraphemeCounter,
  TextareaModelModifiers,
  TextareaParser,
  TextareaProps,
  TextareaResize,
  TextareaSize,
  TextareaVariant,
  TextareaWordLimitPosition,
} from "./types";

const normalizeSize = (size: TextareaSize | undefined): "" | "sm" | "md" | "lg" => {
  if (!size) return "";
  if (size === "small") return "sm";
  if (size === "default") return "md";
  if (size === "large") return "lg";
  return size === "sm" || size === "md" || size === "lg" ? size : "";
};

const props = defineProps<TextareaProps>({
  modelValue: { type: String, default: "" },
  modelModifiers: { type: Object, default: () => ({}) },
  size: { type: String, default: "" },
  variant: { type: String, default: "filled" },
  backgroundColor: { type: String, default: "" },
  placeholder: { type: String, default: "" },
  disabled: { type: Boolean, default: false },
  readonly: { type: Boolean, default: false },
  minlength: { type: Number, default: undefined },
  maxlength: { type: Number, default: undefined },
  showCount: { type: Boolean, default: false },
  showWordLimit: { type: Boolean, default: false },
  wordLimitPosition: { type: String, default: "inside" },
  clearable: { type: Boolean, default: false },
  clearIcon: { type: String, default: "×" },
  formatter: { type: Function, default: undefined },
  parser: { type: Function, default: undefined },
  prefixIcon: { type: String, default: "" },
  suffixIcon: { type: String, default: "" },
  rows: { type: Number, default: 3 },
  autosize: { type: [Boolean, Object], default: false },
  resize: { type: String, default: "vertical" },
  autocomplete: { type: String, default: "off" },
  autofocus: { type: Boolean, default: false },
  form: { type: String, default: "" },
  ariaLabel: { type: String, default: "" },
  tabindex: { type: null, default: undefined },
  validateEvent: { type: Boolean, default: true },
  inputStyle: { type: null, default: "" },
  label: { type: String, default: "" },
  inputmode: { type: String, default: "" },
  countGraphemes: { type: Function, default: undefined },
  id: { type: String, default: "" },
  name: { type: String, default: "" },
});

const emit = defineEmits<{
  "update:modelValue": [value: string];
  input: [value: string];
  change: [value: string];
  focus: [event: FocusEvent];
  blur: [event: FocusEvent];
  clear: [];
  keydown: [event: KeyboardEvent];
  mouseenter: [event: MouseEvent];
  mouseleave: [event: MouseEvent];
  compositionstart: [event: CompositionEvent];
  compositionupdate: [event: CompositionEvent];
  compositionend: [event: CompositionEvent];
}>();

const ctl = useFormControl<string>(props, emit, {
  ...(props.validateEvent === false
    ? { triggers: { input: false, change: false, blur: false } }
    : {}),
});
const formItem = useFormItem(() => normalizeSize(props.size));
const isDisabled = useDisabled(() => Boolean(props.disabled));
const host = useHost();
const textareaRef = useTemplateRef<HTMLTextAreaElement>("textareaEl");

const isComposing = useRef(false);
const slotVersion = useRef(0);

const getTextareaEl = (): HTMLTextAreaElement | null =>
  textareaRef.value ?? host.shadowRoot?.querySelector<HTMLTextAreaElement>("textarea") ?? null;

const hasNamedSlot = (name: string): boolean => {
  void slotVersion.value;
  return Boolean(host.querySelector(`[slot="${name}"]`));
};

const nullable = (value: unknown): unknown | null =>
  value === undefined || value === null || value === "" ? null : value;

const modelText = (): string => String(ctl.model.value ?? "");

const formatText = (value: string): string =>
  typeof props.formatter === "function" ? String(props.formatter(value)) : value;

const parseText = (value: string): string => {
  const parsed = typeof props.parser === "function" ? String(props.parser(value)) : value;
  return props.modelModifiers?.trim ? parsed.trim() : parsed;
};

const displayValue = (): string => formatText(modelText());

const autosizeEnabled = (): boolean => props.autosize === "" || Boolean(props.autosize);

const autosizeOptions = (): { minRows: number; maxRows?: number } => {
  const value = props.autosize;
  if (typeof value !== "object" || value === null) return { minRows: 1 };
  const minRows = Math.max(1, Number(value.minRows) || 1);
  const maxRows =
    value.maxRows === undefined ? undefined : Math.max(minRows, Number(value.maxRows));
  const options: { minRows: number; maxRows?: number } = { minRows };
  if (maxRows !== undefined && Number.isFinite(maxRows)) options.maxRows = maxRows;
  return options;
};

const resizeTextarea = (): void => {
  const textarea = getTextareaEl();
  if (!textarea || !autosizeEnabled()) return;

  textarea.style.height = "auto";
  const style = getComputedStyle(textarea);
  const lineHeight = Number.parseFloat(style.lineHeight) || 20;
  const verticalPadding =
    (Number.parseFloat(style.paddingTop) || 0) + (Number.parseFloat(style.paddingBottom) || 0);
  const { minRows, maxRows } = autosizeOptions();
  const minHeight = minRows * lineHeight + verticalPadding;
  const maxHeight = maxRows ? maxRows * lineHeight + verticalPadding : Number.POSITIVE_INFINITY;
  textarea.style.height = `${Math.min(Math.max(textarea.scrollHeight, minHeight), maxHeight)}px`;
};

const syncDisplayValue = (): void => {
  const textarea = getTextareaEl();
  if (textarea) textarea.value = displayValue();
};

const shouldLazyUpdate = (): boolean => Boolean(props.modelModifiers?.lazy);

const commitInputValue = (rawValue: string): void => {
  const value = parseText(rawValue);
  if (shouldLazyUpdate()) emit("input", value);
  else ctl.dispatchInput(value);
  queueMicrotask(() => {
    syncDisplayValue();
    resizeTextarea();
  });
};

const onInput = (event: Event): void => {
  if (isComposing.value) return;
  commitInputValue((event.target as HTMLTextAreaElement).value);
};

const onChange = (event: Event): void => {
  const value = parseText((event.target as HTMLTextAreaElement).value);
  if (shouldLazyUpdate()) ctl.dispatchInput(value);
  ctl.dispatchChange(value);
  queueMicrotask(syncDisplayValue);
};

const onFocus = (event: FocusEvent): void => ctl.dispatchFocus(event);

const onBlur = (event: FocusEvent): void => ctl.dispatchBlur(event);

const onKeydown = (event: KeyboardEvent): void => {
  emit("keydown", event);
};

const onMouseenter = (event: MouseEvent): void => {
  emit("mouseenter", event);
};

const onMouseleave = (event: MouseEvent): void => {
  emit("mouseleave", event);
};

const onCompositionStart = (event: CompositionEvent): void => {
  isComposing.set(true);
  emit("compositionstart", event);
};

const onCompositionUpdate = (event: CompositionEvent): void => {
  emit("compositionupdate", event);
};

const onCompositionEnd = (event: CompositionEvent): void => {
  const value = (event.target as HTMLTextAreaElement).value;
  isComposing.set(false);
  emit("compositionend", event);
  commitInputValue(value);
};

const touchSlots = (): void => slotVersion.set(slotVersion.value + 1);

const focus = (): void => getTextareaEl()?.focus();

const blur = (): void => getTextareaEl()?.blur();

const select = (): void => getTextareaEl()?.select();

const clear = (): void => {
  ctl.setValue("");
  syncDisplayValue();
  resizeTextarea();
  emit("clear");
};

const input = (): HTMLTextAreaElement | null => getTextareaEl();

const ref = (): HTMLTextAreaElement | null => getTextareaEl();

const textarea = (): HTMLTextAreaElement | null => getTextareaEl();

const textareaStyle = (): CSSStyleDeclaration | null => getTextareaEl()?.style ?? null;

const hasPrefix = (): boolean => Boolean(props.prefixIcon || hasNamedSlot("prefix"));

const hasSuffix = (): boolean => Boolean(props.suffixIcon || hasNamedSlot("suffix"));

const hasPrepend = (): boolean => hasNamedSlot("prepend");

const hasAppend = (): boolean => hasNamedSlot("append");

const countValue = (): number => {
  if (typeof props.countGraphemes === "function")
    return Number(props.countGraphemes(modelText())) || 0;
  return Array.from(modelText()).length;
};

const showWordLimit = (): boolean => Boolean(props.showCount || props.showWordLimit);

const showOutsideWordLimit = (): boolean =>
  showWordLimit() && props.wordLimitPosition === "outside";

const wordLimitText = (): string =>
  props.maxlength === undefined ? String(countValue()) : `${countValue()}/${props.maxlength}`;

const showClear = (): boolean =>
  Boolean(props.clearable && modelText() && !isDisabled() && !props.readonly);

const ariaText = (): string | null => props.ariaLabel || props.label || props.placeholder || null;

useHostAttr("data-state", () => formItem.state);
useHostAttr("size", () => formItem.formSize);
useHostAttr("resize", () => props.resize);
useHostAttr("variant", () => normalizeFieldVariant(props.variant));
useHostFlag("disabled", isDisabled);
useHostFlag("autosize", autosizeEnabled);
useHostFlag("data-dirty", () => Boolean(modelText()));
useHostFlag("data-has-label", () => Boolean(props.label));
useHostCssVar("--elf-field-custom-bg", () => props.backgroundColor || "");

useEffect(() => {
  void ctl.model.value;
  void props.autosize;
  queueMicrotask(() => {
    syncDisplayValue();
    resizeTextarea();
  });
});

onMounted(() => {
  Object.defineProperties(host, {
    focus: { configurable: true, value: focus },
    blur: { configurable: true, value: blur },
  });
});

onUnmounted(() => {
  delete (host as Partial<HTMLElement>).focus;
  delete (host as Partial<HTMLElement>).blur;
});

defineExpose({
  clear,
  input,
  ref,
  resizeTextarea,
  select,
  textarea,
  textareaStyle,
  isComposing,
});

defineStyle(styles);

const Textarea = defineHtml(`
  <div :class=${["group", { "has-prepend": hasPrepend(), "has-append": hasAppend() }]} @mouseenter=${onMouseenter}
    @mouseleave=${onMouseleave}>
    <span v-if=${hasPrepend()} class="prepend" part="prepend">
      <slot name="prepend" @slotchange=${touchSlots}></slot>
    </span>

    <div class="field">
      <div class="wrapper" part="wrapper">
        <fieldset v-if=${props.label} class="field-outline" aria-hidden="true">
          <legend><span>${props.label}</span></legend>
        </fieldset>
        <span v-if=${props.label} class="field-label">${props.label}</span>
        <div v-if=${hasPrefix() || hasSuffix()} class="decorations" part="decorations">
          <span v-if=${hasPrefix()} class="prefix" part="prefix">
            <slot name="prefix" @slotchange=${touchSlots}>${props.prefixIcon}</slot>
          </span>
          <span v-if=${hasSuffix()} class="suffix" part="suffix">
            <slot name="suffix" @slotchange=${touchSlots}>${props.suffixIcon}</slot>
          </span>
        </div>

        <textarea ref="textareaEl" part="textarea" :id=${nullable(props.id)} :name=${nullable(props.name)}
          :value.prop=${displayValue()} :placeholder=${props.placeholder} :disabled=${isDisabled()}
          :readonly=${props.readonly} :minlength=${nullable(props.minlength)} :maxlength=${nullable(props.maxlength)}
          :rows=${props.rows} :autocomplete=${nullable(props.autocomplete)} :autofocus=${props.autofocus}
          :form=${nullable(props.form)} :aria-label=${ariaText()} :tabindex=${nullable(props.tabindex)}
          :inputmode=${nullable(props.inputmode)} :style=${nullable(props.inputStyle)} @input=${onInput} @change=${onChange}
          @focus=${onFocus} @blur=${onBlur} @keydown=${onKeydown} @compositionstart=${onCompositionStart}
          @compositionupdate=${onCompositionUpdate} @compositionend=${onCompositionEnd}></textarea>

        <button v-if=${showClear()} class="clear" type="button" tabindex="-1" aria-label="clear textarea" @click=${clear}>
          <span v-if=${props.clearIcon && props.clearIcon !== "×"}>${props.clearIcon}</span>
          <svg v-else viewBox="0 0 16 16" aria-hidden="true">
            <path d="M4 4l8 8M12 4l-8 8"></path>
          </svg>
        </button>
        <span v-if=${showWordLimit() && !showOutsideWordLimit()} class="count" part="count">
          ${wordLimitText()}
        </span>
      </div>

      <span v-if=${showOutsideWordLimit()} class="count outside" part="count">
        ${wordLimitText()}
      </span>
    </div>

    <span v-if=${hasAppend()} class="append" part="append">
      <slot name="append" @slotchange=${touchSlots}></slot>
    </span>
  </div>
`);

export { Textarea };
