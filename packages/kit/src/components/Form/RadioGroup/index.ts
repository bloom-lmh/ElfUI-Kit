import {
  defineEmits,
  defineHtml,
  defineProps,
  defineStyle,
  provide,
  useEventListener,
  useHost,
  useHostCssVar,
} from "@elfui/core";

import { useDisabled, useFormControl } from "../../../composables";
import { RADIO_GROUP_KEY } from "../context";
import type { RadioGroupContext } from "../context";
import styles from "./style.scss?inline";
import type { RadioGroupOption, RadioGroupProps } from "./types";

export type { RadioGroupOption, RadioGroupOptionProps, RadioGroupProps } from "./types";

interface RadioOptionView {
  __elfRadioOption: true;
  key: string;
  label: string;
  value: unknown;
  disabled: boolean;
}

const props = defineProps<RadioGroupProps>({
  modelValue: { type: null, default: "" },
  disabled: { type: Boolean, default: false },
  size: { type: String, default: "md" },
  variant: { type: String, default: "default" },
  fill: { type: String, default: "" },
  textColor: { type: String, default: "" },
  id: { type: String, default: "" },
  name: { type: String, default: "" },
  ariaLabel: { type: String, default: "" },
  label: { type: String, default: "" },
  validateEvent: { type: Boolean, default: true },
  options: { type: Array, default: () => [] },
  props: { type: Object, default: () => ({}) },
});

const emit = defineEmits<{
  "update:modelValue": [value: unknown];
  change: [value: unknown];
}>();
const ctl = useFormControl<unknown>(props, emit, {
  triggers:
    props.validateEvent === false
      ? { input: false, change: false, blur: false }
      : { input: false, blur: false },
});
const isDisabled = useDisabled(() => Boolean(props.disabled));
const host = useHost();

const optionItems = (): RadioOptionView[] => {
  const mapping = props.props || {};
  const labelKey = mapping.label || "label";
  const valueKey = mapping.value || "value";
  const disabledKey = mapping.disabled || "disabled";

  return (props.options || []).map((option: RadioGroupOption, index: number) => {
    if (option === null || typeof option !== "object") {
      return {
        __elfRadioOption: true,
        key: `${typeof option}:${String(option)}`,
        label: String(option),
        value: option,
        disabled: false,
      };
    }
    const record = option as Record<string, unknown>;
    const value = record[valueKey];
    return {
      __elfRadioOption: true,
      key: `${typeof value}:${String(value)}:${index}`,
      label: String(record[labelKey] ?? value ?? ""),
      value,
      disabled: Boolean(record[disabledKey]),
    };
  });
};

const resolveValue = (value: unknown): unknown => {
  if (value && typeof value === "object" && (value as Partial<RadioOptionView>).__elfRadioOption) {
    return (value as RadioOptionView).value;
  }
  return value;
};

useHostCssVar("--_radio-fill", () => props.fill || "var(--elf-primary)");
useHostCssVar("--_radio-text-color", () => props.textColor || "white");

const changeEvent = (value: unknown): void => {
  const resolved = resolveValue(value);
  if (Object.is(ctl.model.value, resolved) || isDisabled()) return;
  ctl.setValue(resolved);
  ctl.dispatchChange(resolved);
};

provide<RadioGroupContext>(RADIO_GROUP_KEY, {
  get modelValue() {
    return ctl.model.value;
  },
  get disabled() {
    return isDisabled();
  },
  get size() {
    return props.size as "sm" | "md" | "lg";
  },
  get name() {
    return props.name || "";
  },
  get variant() {
    return props.variant;
  },
  resolveValue,
  changeEvent,
});

const radioElements = (): HTMLElement[] =>
  Array.from(host.querySelectorAll("elf-radio")).filter((radio) => !radio.hasAttribute("disabled"));

const focusRadio = (offset: number): void => {
  const radios = radioElements();
  if (!radios.length) return;
  const selected = radios.findIndex((radio) => radio.hasAttribute("data-checked"));
  const next = radios[(selected + offset + radios.length) % radios.length];
  if (!next) return;
  const control = next.shadowRoot?.querySelector<HTMLButtonElement>(".control");
  control?.focus();
  control?.click();
};

useEventListener(host, "elf-radio-select", (event) => {
  event.stopPropagation();
  changeEvent((event as CustomEvent).detail);
});

useEventListener(host, "elf-radio-navigate", (event) => {
  event.stopPropagation();
  focusRadio(Number((event as CustomEvent).detail) || 1);
});

defineStyle(styles);

const RadioGroup = defineHtml<RadioGroupProps>(`
  <div
    class="group"
    role="radiogroup"
    :id=${props.id || null}
    :aria-label=${props.ariaLabel || props.label || null}
    :class=${[`variant-${props.variant}`]}
  >
    <elf-radio
      v-for="option in optionItems()"
      :key="option.key"
      :value.prop="option.value"
      :label="option.label"
      :disabled="option.disabled"
    ></elf-radio>
    <slot></slot>
  </div>
`);

export { RadioGroup };
