import {
  defineEmits,
  defineExpose,
  defineHtml,
  defineProps,
  defineStyle,
  useHost,
  useHostAttr,
  useHostFlag,
} from "@elfui/core";

import { useDisabled, useFormControl, useSize } from "../../../composables";
import { normalizeFieldVariant } from "../../../types/field";
import { createTimeOptions } from "../time-options";
import styles from "./style.scss?inline";
import type {
  TimeSelectElement,
  TimeSelectEmits,
  TimeSelectExpose,
  TimeSelectInnerElement,
  TimeSelectProps,
} from "./types";

export type {
  TimeSelectElement,
  TimeSelectEmits,
  TimeSelectExpose,
  TimeSelectProps,
  TimeSelectSize,
  TimeSelectVariant,
} from "./types";

const props = defineProps<TimeSelectProps>({
  modelValue: { type: String, default: "" },
  start: { type: String, default: "09:00" },
  end: { type: String, default: "18:00" },
  step: { type: String, default: "00:30" },
  minTime: { type: String, default: "" },
  maxTime: { type: String, default: "" },
  format: { type: String, default: "HH:mm" },
  includeEndTime: { type: Boolean, default: false },
  editable: { type: Boolean, default: true },
  disabled: { type: Boolean, default: false },
  clearable: { type: Boolean, default: true },
  size: { type: String, default: "" },
  variant: { type: String, default: "filled" },
  backgroundColor: { type: String, default: "" },
  label: { type: String, default: "" },
  placeholder: { type: String, default: "" },
  name: { type: String, default: "" },
  id: { type: String, default: "" },
  tabindex: { type: null, default: 0 },
  effect: { type: String, default: "light" },
  prefixIcon: { type: String, default: "" },
  clearIcon: { type: String, default: "" },
  valueOnClear: { type: null, default: undefined },
  emptyValues: { type: Array, default: undefined },
  popperClass: { type: String, default: "" },
  popperStyle: { type: null, default: "" },
  validateEvent: { type: Boolean, default: true },
});

const emit = defineEmits<TimeSelectEmits>();
const control = useFormControl<string>(props, emit, {
  ...(props.validateEvent === false
    ? { triggers: { change: false, blur: false } }
    : {}),
});
const isDisabled = useDisabled(() => Boolean(props.disabled));
const resolvedSize = useSize(() => props.size);
const host = useHost();

const options = () =>
  createTimeOptions({
    start: props.start,
    end: props.end,
    step: props.step,
    minTime: props.minTime,
    maxTime: props.maxTime,
    format: props.format,
    includeEndTime: props.includeEndTime,
  });

const resolveSelect = (): TimeSelectInnerElement | null =>
  host.shadowRoot?.querySelector(
    "elf-select",
  ) as TimeSelectInnerElement | null;

const eventValue = (event: CustomEvent<unknown>): string =>
  typeof event.detail === "string" ? event.detail : "";

const onUpdate = (event: CustomEvent<unknown>): void =>
  control.setValue(eventValue(event));
const onChange = (event: CustomEvent<unknown>): void =>
  control.dispatchChange(eventValue(event));
const onClear = (): void => {
  emit("clear");
};
const onFocus = (event: FocusEvent): void => control.dispatchFocus(event);
const onBlur = (event: FocusEvent): void => control.dispatchBlur(event);
const onVisibleChange = (event: CustomEvent<boolean>): void => {
  emit("visible-change", Boolean(event.detail));
};

const open = (): void => resolveSelect()?.open();
const close = (): void => resolveSelect()?.close();
const focus = (): void => resolveSelect()?.focus();
const blur = (): void => resolveSelect()?.blur();

useHostAttr("size", resolvedSize);
useHostAttr("variant", () => normalizeFieldVariant(props.variant));
useHostFlag("disabled", isDisabled);

defineExpose<TimeSelectExpose>(
  { open, close, focus, blur },
  { overrideNative: ["focus", "blur"] },
);
defineStyle(styles);

const TimeSelect = defineHtml<TimeSelectProps>(`
  <div class="time-select">
    <elf-select
      :options.prop=${options()}
      :modelValue.prop=${props.modelValue}
      :size=${resolvedSize()}
      :variant=${normalizeFieldVariant(props.variant)}
      :backgroundColor=${props.backgroundColor}
      :label=${props.label}
      :placeholder=${props.placeholder}
      :disabled=${isDisabled()}
      :clearable=${props.clearable}
      :filterable=${props.editable}
      :defaultFirstOption=${props.editable}
      :effect=${props.effect}
      :clearIcon=${props.clearIcon}
      :valueOnClear.prop=${props.valueOnClear}
      :emptyValues.prop=${props.emptyValues}
      :popperClass=${props.popperClass}
      :popperStyle.prop=${props.popperStyle}
      :validateEvent=${false}
      :id=${props.id}
      :name=${props.name}
      :tabindex=${props.tabindex}
      fit-input-width
      @update:modelValue=${onUpdate}
      @change=${onChange}
      @clear=${onClear}
      @focus=${onFocus}
      @blur=${onBlur}
      @visible-change=${onVisibleChange}
    >
      <elf-icon v-if=${props.prefixIcon} slot="prefix" :name=${props.prefixIcon}></elf-icon>
    </elf-select>
  </div>
`);

export { TimeSelect };
