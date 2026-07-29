import {
  defineEmits,
  defineExpose,
  defineHtml,
  defineProps,
  defineStyle,
  useComponents,
  useEffect,
  useHost,
  useHostAttr,
  useHostFlag,
  useRef,
} from "@elfui/core";

import { useDateAdapter } from "../../../composables/date";
import { useDisabled, useFormControl, useSize } from "../../../composables/form";
import { useFieldValueDefaults } from "../../../composables/field-values";
import { normalizeFieldVariant } from "../../../types/field";
import { useLocaleProvider } from "../../Providers/context";
import { DatePicker } from "../DatePicker";
import { TimePicker } from "../TimePicker";
import styles from "./style.scss?inline";
import type {
  DateTimeDateElement,
  DateTimePickerEmits,
  DateTimePickerExpose,
  DateTimePickerProps,
  DateTimePickerValue,
  DateTimeShortcut,
  DateTimeTimeElement,
} from "./types";

export type {
  DateTimePickerElement,
  DateTimePickerEmits,
  DateTimePickerExpose,
  DateTimePickerProps,
  DateTimePickerSize,
  DateTimePickerValue,
  DateTimePickerVariant,
  DateTimeShortcut,
} from "./types";

const props = defineProps<DateTimePickerProps>({
  modelValue: { type: null, default: "" },
  range: { type: Boolean, default: false },
  format: { type: String, default: "YYYY-MM-DD HH:mm:ss" },
  valueFormat: { type: String, default: "YYYY-MM-DD HH:mm:ss" },
  dateFormat: { type: String, default: "" },
  timeFormat: { type: String, default: "" },
  label: { type: String, default: "" },
  dateLabel: { type: String, default: "" },
  timeLabel: { type: String, default: "" },
  placeholder: { type: String, default: "" },
  startPlaceholder: { type: String, default: "" },
  endPlaceholder: { type: String, default: "" },
  rangeSeparator: { type: String, default: "" },
  defaultTime: { type: null, default: "00:00:00" },
  min: { type: String, default: "" },
  max: { type: String, default: "" },
  disabledDate: { type: Function, default: undefined },
  disabledHours: { type: Function, default: undefined },
  disabledMinutes: { type: Function, default: undefined },
  disabledSeconds: { type: Function, default: undefined },
  shortcuts: { type: Array, default: () => [] },
  step: { type: Number, default: 60 },
  variant: { type: String, default: "filled" },
  size: { type: String, default: "" },
  disabled: { type: Boolean, default: false },
  readonly: { type: Boolean, default: false },
  editable: { type: Boolean, default: true },
  clearable: { type: Boolean, default: true },
  teleported: { type: Boolean, default: true },
  placement: { type: String, default: "bottom-start" },
  fallbackPlacements: { type: Array, default: () => ["top-start"] },
  popperOptions: { type: Object, default: () => ({}) },
  popperClass: { type: String, default: "" },
  popperStyle: { type: Object, default: () => ({}) },
  id: { type: String, default: "" },
  name: { type: String, default: "" },
  tabindex: { type: null, default: 0 },
  ariaLabel: { type: String, default: "" },
  valueOnClear: { type: null, default: undefined },
  emptyValues: { type: Array, default: undefined },
  validateEvent: { type: Boolean, default: true },
});

const emit = defineEmits<DateTimePickerEmits>();
const form = useFormControl<DateTimePickerValue>(props, emit, {
  ...(props.validateEvent === false
    ? { triggers: { change: false, blur: false } }
    : {}),
});
const fieldValues = useFieldValueDefaults();
const dateService = useDateAdapter();
const locale = useLocaleProvider();
const isDisabled = useDisabled(() => Boolean(props.disabled));
const resolvedSize = useSize(() => props.size);

useComponents({
  "date-time-date-picker": DatePicker,
  "date-time-time-picker": TimePicker,
});

const startDate = useRef("");
const endDate = useRef("");
const startTime = useRef("");
const endTime = useRef("");
const host = useHost();

const rangeMode = (): boolean => Boolean(props.range || Array.isArray(props.modelValue));
const formatParts = (): [date: string, time: string] => {
  const format = String(props.format || "");
  const timeStart = format.search(/HH|mm|ss/);
  if (timeStart < 0) return [format || "YYYY-MM-DD", "HH:mm:ss"];
  const date = format.slice(0, timeStart).replace(/[\sT,;:/-]+$/g, "");
  return [date || "YYYY-MM-DD", format.slice(timeStart) || "HH:mm:ss"];
};
const resolvedDateFormat = (): string => props.dateFormat || formatParts()[0];
const resolvedTimeFormat = (): string => props.timeFormat || formatParts()[1];
const isEmptyValue = (value: unknown): boolean =>
  fieldValues.isEmpty(value, props.emptyValues);
const defaultTimeFor = (target: "start" | "end"): string => {
  const value = props.defaultTime;
  const resolved = Array.isArray(value)
    ? value[target === "end" ? 1 : 0] || value[0]
    : value;
  return String(resolved || "00:00:00");
};

const parsePart = (
  value: unknown,
  target: "start" | "end",
): { date: string; time: string } => {
  if (isEmptyValue(value)) return { date: "", time: "" };
  const parsed = dateService.adapter.parse(value, props.valueFormat);
  return parsed
    ? {
        date: dateService.adapter.toISODate(parsed),
        time: dateService.adapter.format(parsed, "HH:mm:ss"),
      }
    : { date: "", time: defaultTimeFor(target) };
};

let externalSignature = "";
const syncExternalValue = (): void => {
  const signature = JSON.stringify([props.modelValue, props.valueFormat, rangeMode()]);
  if (signature === externalSignature) return;
  externalSignature = signature;
  const values = Array.isArray(props.modelValue)
    ? props.modelValue
    : [props.modelValue, ""];
  const start = parsePart(values[0], "start");
  const end = parsePart(values[1], "end");
  startDate.set(start.date);
  startTime.set(start.time);
  endDate.set(end.date);
  endTime.set(end.time);
};

useEffect(syncExternalValue);

const compose = (date: string, time: string, target: "start" | "end"): string => {
  if (!date) return "";
  const parsed = dateService.adapter.parse(
    `${date}T${time || defaultTimeFor(target)}`,
  );
  return parsed
    ? dateService.adapter.format(
        parsed,
        props.valueFormat || "YYYY-MM-DD HH:mm:ss",
        dateService.context,
      )
    : "";
};

const currentValue = (): DateTimePickerValue => {
  const start = compose(startDate.value, startTime.value, "start");
  if (!rangeMode()) return start;
  return [start, compose(endDate.value, endTime.value, "end")];
};

const commit = (): void => {
  const value = currentValue();
  externalSignature = JSON.stringify([value, props.valueFormat, rangeMode()]);
  form.setValue(value);
  form.dispatchChange(value);
};

const detailValue = (event: CustomEvent<unknown>): unknown => event.detail;

const onDateUpdate = (event: CustomEvent<unknown>): void => {
  startDate.set(String(detailValue(event) || ""));
  commit();
};
const onEndDateUpdate = (event: CustomEvent<unknown>): void => {
  endDate.set(String(detailValue(event) || ""));
  commit();
};
const onTimeUpdate = (event: CustomEvent<unknown>): void => {
  const value = detailValue(event);
  if (Array.isArray(value)) {
    startTime.set(String(value[0] || ""));
    endTime.set(String(value[1] || ""));
  } else {
    startTime.set(String(value || ""));
  }
  commit();
};
const onEndTimeUpdate = (event: CustomEvent<unknown>): void => {
  endTime.set(String(detailValue(event) || ""));
};

const resolveShortcut = (value: string | (() => string)): string =>
  typeof value === "function" ? value() : value;
const dateShortcuts = (): Array<{
  label: string;
  value: string;
  endValue?: string;
}> =>
  (Array.isArray(props.shortcuts) ? props.shortcuts : []).map(
    (shortcut: DateTimeShortcut) => ({
      label: shortcut.label,
      value: parsePart(resolveShortcut(shortcut.value), "start").date,
      ...(shortcut.endValue
        ? { endValue: parsePart(resolveShortcut(shortcut.endValue), "end").date }
        : {}),
    }),
  );

const dateMin = (): string => parsePart(props.min, "start").date;
const dateMax = (): string => parsePart(props.max, "end").date;
const childPopperStyle = (): Record<string, string> => props.popperStyle;
const childClearable = (): boolean => false;
const childValidateEvent = (): boolean => false;
const timeModelValue = (): string | [string, string] =>
  rangeMode() ? [startTime.value, endTime.value] : startTime.value;
const timeId = (): string | [string, string] =>
  props.id
    ? rangeMode()
      ? [`${props.id}-start-time`, `${props.id}-end-time`]
      : `${props.id}-time`
    : "";
const timeMin = (): string =>
  props.min && startDate.value === dateMin()
    ? parsePart(props.min, "start").time
    : "";
const timeMax = (): string =>
  props.max && startDate.value === dateMax()
    ? parsePart(props.max, "end").time
    : "";

const hasValue = (): boolean =>
  Array.isArray(props.modelValue)
    ? props.modelValue.some((value) => !isEmptyValue(value))
    : !isEmptyValue(props.modelValue);

const clear = (): void => {
  if (isDisabled() || props.readonly) return;
  const value = fieldValues.valueOnClear<DateTimePickerValue>(
    props.valueOnClear,
    () => (rangeMode() ? ["", ""] : ""),
  );
  startDate.set("");
  endDate.set("");
  startTime.set("");
  endTime.set("");
  externalSignature = JSON.stringify([value, props.valueFormat, rangeMode()]);
  form.setValue(value);
  form.dispatchChange(value);
  emit("clear");
};

const focusDetail = (event: CustomEvent<unknown>): FocusEvent =>
  event.detail instanceof FocusEvent ? event.detail : new FocusEvent(event.type);
const onFocus = (event: CustomEvent<unknown>): void =>
  form.dispatchFocus(focusDetail(event));
const onBlur = (event: CustomEvent<unknown>): void =>
  form.dispatchBlur(focusDetail(event));
const onCalendarChange = (): void => {
  emit("calendar-change", currentValue());
};
const onVisibleChange = (event: CustomEvent<unknown>): void => {
  emit("visible-change", Boolean(event.detail));
};

const dateElement = (): DateTimeDateElement | null =>
  host.shadowRoot?.querySelector("elf-date-picker") as DateTimeDateElement | null;
const timeElement = (): DateTimeTimeElement | null =>
  host.shadowRoot?.querySelector("elf-time-picker") as DateTimeTimeElement | null;
const focus = (): void => dateElement()?.focusInput();
const blur = (): void => {
  dateElement()?.blurInput();
  timeElement()?.blurInput();
};
const openDate = (): void => dateElement()?.handleOpen();
const openTime = (): void => timeElement()?.handleOpen();
const close = (): void => {
  dateElement()?.handleClose();
  timeElement()?.handleClose();
};

useHostAttr("size", resolvedSize);
useHostAttr("variant", () => normalizeFieldVariant(props.variant));
useHostFlag("disabled", isDisabled);
useHostFlag("range", rangeMode);
useHostFlag("dirty", hasValue);

defineExpose<DateTimePickerExpose>(
  { focus, blur, openDate, openTime, close },
  { overrideNative: ["focus", "blur"] },
);
defineStyle(styles);

const DateTimePicker = defineHtml<DateTimePickerProps>(`
  <div class="date-time-picker" role="group" :aria-label=${props.ariaLabel || props.label || props.placeholder}>
    <div class="fields">
      <date-time-date-picker
        :modelValue.prop=${startDate}
        :endValue.prop=${endDate}
        :range=${rangeMode()}
        :format=${resolvedDateFormat()}
        valueFormat="YYYY-MM-DD"
        :label=${props.dateLabel || props.label}
        :placeholder=${props.placeholder}
        :startPlaceholder=${props.startPlaceholder}
        :endPlaceholder=${props.endPlaceholder}
        :rangeSeparator=${props.rangeSeparator}
        :min=${dateMin()}
        :max=${dateMax()}
        :disabledDate.prop=${props.disabledDate}
        :shortcuts.prop=${dateShortcuts()}
        :variant=${normalizeFieldVariant(props.variant)}
        :size=${resolvedSize()}
        :disabled=${isDisabled()}
        :readonly=${props.readonly}
        :editable=${props.editable}
        :teleported=${props.teleported}
        :placement=${props.placement}
        :fallbackPlacements.prop=${props.fallbackPlacements}
        :popperOptions.prop=${props.popperOptions}
        :popperClass=${props.popperClass}
        :popperStyle.prop=${childPopperStyle()}
        :id=${props.id ? props.id + "-date" : ""}
        :name=${props.name ? props.name + "-date" : ""}
        :tabindex=${props.tabindex}
        :clearable.prop=${childClearable()}
        :validateEvent.prop=${childValidateEvent()}
        @update:modelValue=${onDateUpdate}
        @update:endValue=${onEndDateUpdate}
        @calendar-change=${onCalendarChange}
        @visible-change=${onVisibleChange}
        @focus=${onFocus}
        @blur=${onBlur}
      ></date-time-date-picker>
      <date-time-time-picker
        :modelValue.prop=${timeModelValue()}
        :endValue.prop=${endTime}
        :range=${rangeMode()}
        :format=${resolvedTimeFormat()}
        valueFormat="HH:mm:ss"
        :label=${props.timeLabel}
        :startPlaceholder=${props.startPlaceholder}
        :endPlaceholder=${props.endPlaceholder}
        :rangeSeparator=${props.rangeSeparator}
        :min=${timeMin()}
        :max=${timeMax()}
        :step=${props.step}
        :disabledHours.prop=${props.disabledHours}
        :disabledMinutes.prop=${props.disabledMinutes}
        :disabledSeconds.prop=${props.disabledSeconds}
        :variant=${normalizeFieldVariant(props.variant)}
        :size=${resolvedSize()}
        :disabled=${isDisabled()}
        :readonly=${props.readonly}
        :editable=${props.editable}
        :teleported=${props.teleported}
        :placement=${props.placement}
        :fallbackPlacements.prop=${props.fallbackPlacements}
        :popperOptions.prop=${props.popperOptions}
        :popperClass=${props.popperClass}
        :popperStyle.prop=${childPopperStyle()}
        :id.prop=${timeId()}
        :name=${props.name ? props.name + "-time" : ""}
        :tabindex=${props.tabindex}
        :clearable.prop=${childClearable()}
        :validateEvent.prop=${childValidateEvent()}
        @update:modelValue=${onTimeUpdate}
        @update:endValue=${onEndTimeUpdate}
        @visible-change=${onVisibleChange}
        @focus=${onFocus}
        @blur=${onBlur}
      ></date-time-time-picker>
    </div>
    <button
      v-if=${props.clearable && hasValue()}
      type="button"
      class="clear"
      :aria-label=${locale.t("common.clear")}
      @click=${clear}
    >×</button>
  </div>
`);

export { DateTimePicker };
