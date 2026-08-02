import {
  defineEmits,
  defineExpose,
  defineProps,
  defineStyle,
  useComputed,
  useEffect,
  useHostAttr,
  useHostFlag,
  useRef,
  defineHtml,
} from "@elfui/core";

import { useDisabled, useFormControl, useFormItem } from "../../../composables";
import styles from "./style.scss?inline";
import { useLocaleProvider } from "../../Providers/context";

export type { RateProps, RateSize } from "./types";

interface RateViewItem {
  index: number;
  score: number;
}

const readNumber = (value: unknown): number => {
  const raw =
    value && typeof value === "object" && "value" in value
      ? (value as { value: unknown }).value
      : value;
  const next = Number(raw ?? 0);
  return Number.isFinite(next) ? next : 0;
};

const props = defineProps({
  modelValue: { type: Number, default: 0 },
  max: { type: Number, default: 5 },
  allowHalf: { type: Boolean, default: false },
  previewOnHover: { type: Boolean, default: false },
  clearable: { type: Boolean, default: true },
  disabled: { type: Boolean, default: false },
  readonly: { type: Boolean, default: false },
  size: { type: String, default: "" },
  color: { type: String, default: "" },
  voidColor: { type: String, default: "" },
  disabledColor: { type: String, default: "" },
  character: { type: String, default: "★" },
  voidCharacter: { type: String, default: "☆" },
  showText: { type: Boolean, default: false },
  showScore: { type: Boolean, default: false },
  scoreTemplate: { type: String, default: "{value}" },
  texts: { type: Array, default: () => [] },
  lowThreshold: { type: Number, default: 2 },
  highThreshold: { type: Number, default: 4 },
  colors: { type: Array, default: () => [] },
  disabledVoidColor: { type: String, default: "" },
  icons: { type: Array, default: () => [] },
  voidIcon: { type: String, default: "" },
  disabledVoidIcon: { type: String, default: "" },
  textColor: { type: String, default: "" },
  id: { type: String, default: "" },
  ariaLabel: { type: String, default: "" },
  label: { type: String, default: "" },
  validateEvent: { type: Boolean, default: true },
});

const locale = useLocaleProvider();

const emit = defineEmits(["update:modelValue", "change", "hover-change", "clear"]);
const ctl = useFormControl<number>(props, emit, {
  triggers:
    props.validateEvent === false
      ? { input: false, change: false, blur: false }
      : { input: false, blur: false, change: "change" },
});

const fi = useFormItem(() => props.size as string);

const isDisabled = useDisabled(() => Boolean(props.disabled));

const innerValue = useRef(readNumber(props.modelValue));

const hoverValue = useRef(0);

useEffect(() => {
  innerValue.set(readNumber(props.modelValue));
});

useHostFlag("disabled", isDisabled);

useHostFlag("readonly", () => Boolean(props.readonly));

useHostAttr("size", () => fi.formSize);

const max = (): number => Math.max(1, Number(props.max || 5));

const displayValue = (): number =>
  props.previewOnHover ? hoverValue.value || innerValue.value : innerValue.value;
const canClearRating = (): boolean =>
  props.clearable && innerValue.value > 0 && !isDisabled() && !props.readonly;

const thresholdIndex = (value: number): number =>
  value <= Number(props.lowThreshold) ? 0 : value < Number(props.highThreshold) ? 1 : 2;

const items = (): RateViewItem[] =>
  Array.from({ length: max() }, (_, index) => ({ index, score: index + 1 }));

const stateOf = (item: RateViewItem): string => {
  const value = displayValue();
  if (value >= item.score) return "full";
  if (props.allowHalf && value + 0.5 === item.score) return "half";
  return "empty";
};

const isReadOnly = (): boolean => Boolean(isDisabled() || props.readonly);

const iconOf = (item: RateViewItem): string => {
  const state = stateOf(item);
  if (state === "empty") {
    if (isReadOnly() && props.disabledVoidIcon) return String(props.disabledVoidIcon);
    return String(props.voidIcon || props.voidCharacter || "☆");
  }
  const icons = Array.isArray(props.icons) ? (props.icons as string[]) : [];
  const index = thresholdIndex(displayValue());
  return String(icons[index] || props.character || "★");
};

const colorOf = (item: RateViewItem): string => {
  if (isReadOnly())
    return String(props.disabledColor || props.disabledVoidColor || "var(--elf-text-disabled)");
  if (stateOf(item) === "empty") return String(props.voidColor || "var(--elf-text-disabled)");
  const colors = Array.isArray(props.colors) ? (props.colors as string[]) : [];
  const index = thresholdIndex(displayValue());
  return String(colors[index] || props.color || "var(--elf-warning)");
};

const preciseValue = (item: RateViewItem, event?: MouseEvent): number => {
  if (!props.allowHalf || !event) return item.score;
  const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
  const half = event.clientX - rect.left <= rect.width / 2;
  return half ? item.score - 0.5 : item.score;
};

const commit = (value: number): void => {
  if (isDisabled() || props.readonly) return;
  const next = props.clearable && value === innerValue.value ? 0 : value;
  innerValue.set(next);
  ctl.setValue(next);
  ctl.dispatchChange(next);
  if (next === 0) emit("clear");
};

const onClick = (item: RateViewItem, event: MouseEvent): void => {
  commit(preciseValue(item, event));
};

const onMouseMove = (item: RateViewItem, event: MouseEvent): void => {
  if (!props.previewOnHover || isDisabled() || props.readonly) return;
  const next = preciseValue(item, event);
  hoverValue.set(next);
  emit("hover-change", next);
};

const onMouseLeave = (): void => {
  hoverValue.set(0);
};

const clear = (): void => commit(0);
const setCurrentValue = (value: number): void =>
  commit(Math.max(0, Math.min(max(), readNumber(value))));
const resetCurrentValue = (): void => {
  hoverValue.set(0);
  innerValue.set(readNumber(props.modelValue));
};

const onKeyDown = (event: KeyboardEvent): void => {
  if (isDisabled() || props.readonly) return;
  const step = props.allowHalf ? 0.5 : 1;
  if (event.key === "ArrowRight" || event.key === "ArrowUp") {
    event.preventDefault();
    commit(Math.min(max(), innerValue.value + step));
  } else if (event.key === "ArrowLeft" || event.key === "ArrowDown") {
    event.preventDefault();
    commit(Math.max(0, innerValue.value - step));
  } else if (event.key === "Home") {
    event.preventDefault();
    commit(0);
  } else if (event.key === "End") {
    event.preventDefault();
    commit(max());
  }
};

const text = (): string => {
  const value = innerValue.value;
  if (props.showScore) {
    return String(props.scoreTemplate || "{value}").replace("{value}", value.toFixed(1));
  }
  const providedTexts = Array.isArray(props.texts) ? (props.texts as string[]) : [];
  const texts = providedTexts.length
    ? providedTexts
    : ["terrible", "disappointed", "fair", "satisfied", "surprised"].map((key) =>
        locale.t(`rate.${key}`),
      );
  const index = Math.max(0, Math.ceil(value) - 1);
  return texts[index] ?? "";
};

const rootStyle = useComputed(() => ({
  ...(props.color ? { "--rate-color": String(props.color) } : {}),
  ...(props.voidColor ? { "--rate-void-color": String(props.voidColor) } : {}),
  ...(props.disabledColor ? { "--rate-disabled-color": String(props.disabledColor) } : {}),
}));

defineExpose({ setCurrentValue, resetCurrentValue });

defineStyle(styles);

const Rate = defineHtml(`
  <div
    class="rate"
    :style=${rootStyle}
    @mouseleave=${onMouseLeave}
    @keydown=${onKeyDown}
    role="slider"
    :id=${props.id || null}
    :aria-label=${props.ariaLabel || props.label || "Rate"}
    :tabindex=${isDisabled() || props.readonly ? -1 : 0}
    :aria-valuenow=${innerValue}
    aria-valuemin="0"
    :aria-valuemax=${props.max}
  >
    <div class="stars">
      <button
        v-for="item in items()"
        :key="item.score"
        type="button"
        :class="['star', 'is-' + stateOf(item)]"
        :style='{ "--rate-item-color": colorOf(item) }'
        :disabled=${isDisabled() || props.readonly}
        @click="onClick(item, $event)"
        @mousemove="onMouseMove(item, $event)"
        :aria-label='locale.t("rate.score", { score: item.score })'
      >
        <span class="symbol">{{ iconOf(item) }}</span>
      </button>
    </div>
    <span v-if=${props.showText || props.showScore} class="text">${text()}</span>
    <button
      v-if=${canClearRating()}
      class="clear"
      type="button"
      @click=${clear}
      :aria-label=${locale.t("rate.clear")}
    >
      <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false"><path d="M4 4l8 8M12 4l-8 8"></path></svg>
    </button>
  </div>
`);

export { Rate };
