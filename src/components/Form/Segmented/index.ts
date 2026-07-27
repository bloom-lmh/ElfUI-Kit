import { defineEmits, defineHtml, defineProps, defineStyle, useHostAttr, useHostFlag } from "@elfui/core";

import styles from "./style.scss?inline";
import { useFormControl } from "../../../composables";
import type { SegmentedFieldNames, SegmentedOption, SegmentedProps, SegmentedSize, SegmentedValue } from "./types";

export type {
  SegmentedFieldNames,
  SegmentedOption,
  SegmentedOptionObject,
  SegmentedProps,
  SegmentedSize,
  SegmentedValue,
} from "./types";

interface ViewOption {
  key: string;
  label: string;
  value: SegmentedValue;
  disabled: boolean;
}

const props = defineProps<SegmentedProps>({
  modelValue: { type: [String, Number, Boolean], default: undefined },
  options: { type: Array, default: () => [] },
  size: { type: String, default: "" },
  disabled: { type: Boolean, default: false },
  block: { type: Boolean, default: false },
  name: { type: String, default: "" },
  id: { type: String, default: "" },
  ariaLabel: { type: String, default: "" },
  label: { type: String, default: "" },
  validateEvent: { type: Boolean, default: true },
  props: {
    type: Object,
    default: () => ({ label: "label", value: "value", disabled: "disabled" }),
  },
});

const emit = defineEmits(["update:modelValue", "change"]);
const ctl = useFormControl<SegmentedValue>(props, emit, {
  triggers:
    props.validateEvent === false ? { change: false, input: false, blur: false } : { input: false, blur: false },
});

const fields = (): Required<SegmentedFieldNames> => {
  const value = props.props || {};
  return {
    label: value.label || "label",
    value: value.value || "value",
    disabled: value.disabled || "disabled",
  };
};

const options = (): ViewOption[] => {
  const names = fields();
  const source = Array.isArray(props.options) ? props.options : [];
  return source.map((entry, index) => {
    if (typeof entry !== "object" || entry === null) {
      return {
        key: String(index),
        label: String(entry),
        value: entry as SegmentedValue,
        disabled: false,
      };
    }
    const record = entry as Record<string, unknown>;
    const value = (record[names.value] ?? record[names.label] ?? "") as SegmentedValue;
    return {
      key: String(index),
      label: String(record[names.label] ?? value),
      value,
      disabled: Boolean(record[names.disabled]),
    };
  });
};

const isActive = (option: ViewOption): boolean => String(option.value) === String(ctl.model.value);

const select = (option: ViewOption): void => {
  if (props.disabled || option.disabled || isActive(option)) return;
  ctl.setValue(option.value);
  ctl.dispatchChange(option.value);
};

const onContainerClick = (event: Event): void => {
  const button = (event.target as HTMLElement | null)?.closest(".option") as HTMLElement | null;
  const index = Number(button?.dataset.index);
  const option = Number.isInteger(index) ? options()[index] : undefined;
  if (option) select(option);
};

const optionIndexFromEvent = (event: Event): number => {
  const index = Number((event.currentTarget as HTMLElement | null)?.dataset.index);
  return Number.isInteger(index) ? index : -1;
};

const onOptionKeyDown = (event: KeyboardEvent): void => {
  if (!["ArrowRight", "ArrowDown", "ArrowLeft", "ArrowUp", "Home", "End"].includes(event.key)) return;
  const source = options();
  const enabled = source.filter((option) => !props.disabled && !option.disabled);
  if (!enabled.length) return;
  event.preventDefault();
  const current = source[optionIndexFromEvent(event)];
  const currentIndex = current ? enabled.findIndex((option) => option.key === current.key) : -1;
  const backwards = event.key === "ArrowLeft" || event.key === "ArrowUp";
  const next =
    event.key === "Home"
      ? enabled[0]
      : event.key === "End"
        ? enabled[enabled.length - 1]
        : enabled[(currentIndex + (backwards ? -1 : 1) + enabled.length) % enabled.length];
  if (!next) return;
  select(next);
  const target = (event.currentTarget as HTMLElement | null)?.parentElement?.querySelector<HTMLElement>(
    `.option[data-index="${next.key}"]`,
  );
  target?.focus();
};

const tabIndex = (option: ViewOption): number => {
  if (props.disabled) return -1;
  if (isActive(option)) return 0;
  const source = options();
  if (source.some(isActive)) return -1;
  return source.find((entry) => !entry.disabled)?.key === option.key ? 0 : -1;
};

const normalizedSize = (): SegmentedSize => {
  const value = String(props.size || "") as SegmentedSize;
  return value === "sm" || value === "lg" ? value : "";
};

useHostAttr("size", normalizedSize);
useHostFlag("block", () => Boolean(props.block));
useHostFlag("disabled", () => Boolean(props.disabled));

defineStyle(styles);

const Segmented = defineHtml<SegmentedProps>(`
  <div class="segmented" role="radiogroup" :id=${props.id || null}
    :aria-label=${props.ariaLabel || props.label || props.name || null} part="segmented" @click=${onContainerClick}>
    <button v-for="option in options()" :key="option.key" type="button"
      :class="['option', { 'is-active': isActive(option) }]" :data-index="option.key"
      :disabled="props.disabled || option.disabled" role="radio" :aria-checked="isActive(option) ? 'true' : 'false'"
      :name=${props.name || null} :tabindex="tabIndex(option)" @keydown=${onOptionKeyDown}>{{ option.label }}</button>
  </div>
`);

export { Segmented };
