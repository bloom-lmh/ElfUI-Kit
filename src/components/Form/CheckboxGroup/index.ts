// elf-checkbox-group

import {
  defineEmits,
  defineProps,
  defineStyle,
  inject,
  provide,
  useEffect,
  useHostCssVar,
  useRef,
  defineHtml
} from "@elfui/core";

import { CHECKBOX_GROUP_KEY, FORM_KEY } from "../context";
import type { CheckboxGroupContext } from "../context";
import styles from "./style.scss?inline";
import type { CheckboxGroupOption, CheckboxGroupProps } from "./types";

export type { CheckboxGroupOption, CheckboxGroupOptionProps, CheckboxGroupProps } from "./types";

interface CheckboxOptionView {
  __elfCheckboxOption: true;
  key: string;
  label: string;
  value: unknown;
  disabled: boolean;
}

const props = defineProps<CheckboxGroupProps>({
  modelValue: { type: Array, default: () => [] },
  disabled: { type: Boolean, default: false },
  size: { type: String, default: "md" },
  min: { type: Number, default: 0 },
  max: { type: Number, default: Infinity },
  ariaLabel: { type: String, default: "" },
  variant: { type: String, default: "default" },
  fill: { type: String, default: "" },
  textColor: { type: String, default: "" },
  options: { type: Array, default: () => [] },
  props: { type: Object, default: () => ({}) }
});

const emit = defineEmits(["update:modelValue", "change"]);

const form = inject(FORM_KEY);

const inner = useRef<unknown[]>((props.modelValue as unknown[]) ?? []);

const optionItems = (): CheckboxOptionView[] => {
  const mapping = props.props || {};
  const labelKey = mapping.label || "label";
  const valueKey = mapping.value || "value";
  const disabledKey = mapping.disabled || "disabled";

  return (props.options || []).map((option: CheckboxGroupOption, index: number) => {
    if (option === null || typeof option !== "object") {
      return { __elfCheckboxOption: true, key: `${typeof option}:${String(option)}`, label: String(option), value: option, disabled: false };
    }
    const record = option as Record<string, unknown>;
    const value = record[valueKey];
    return {
      __elfCheckboxOption: true,
      key: `${typeof value}:${String(value)}:${index}`,
      label: String(record[labelKey] ?? value ?? ""),
      value,
      disabled: Boolean(record[disabledKey])
    };
  });
};

const resolveValue = (value: unknown): unknown => {
  if (value && typeof value === "object" && (value as Partial<CheckboxOptionView>).__elfCheckboxOption) {
    return (value as CheckboxOptionView).value;
  }
  return value;
};

useEffect(() => {
  const pv = (props.modelValue as unknown[]) ?? [];
  if (pv !== inner.peek()) inner.set([...pv]);
});

provide<CheckboxGroupContext>(CHECKBOX_GROUP_KEY, {
  get modelValue() {
    return inner.value;
  },
  get disabled() {
    return Boolean(props.disabled) || (form?.disabled ?? false);
  },
  get size() {
    return props.size as "sm" | "md" | "lg";
  },
  get min() {
    return props.min as number;
  },
  get max() {
    return props.max as number;
  },
  get variant() {
    return props.variant;
  },
  resolveValue,
  changeEvent(v: unknown[]) {
    inner.set(v);
    emit("update:modelValue", v);
    emit("change", v);
  }
});

useHostCssVar("--_checkbox-fill", () => props.fill || "var(--elf-primary)");
useHostCssVar("--_checkbox-text-color", () => props.textColor || "white");

defineStyle(styles);

const CheckboxGroup = defineHtml(`
  <div
    :class=${["group", `variant-${props.variant}`]}
    role="group"
    :aria-label=${props.ariaLabel || null}
  >
    <elf-checkbox
      v-for="option in optionItems()"
      :key="option.key"
      :value.prop="option.value"
      :label="option.label"
      :disabled="option.disabled"
    ></elf-checkbox>
    <slot></slot>
  </div>
`);

export { CheckboxGroup };
