import {
  defineEmits,
  defineHtml,
  defineProps,
  defineStyle,
  html,
  onMount,
  onUnmount,
  useComponents,
  useHost,
  useHostAttr,
  useHostFlag,
  useRef,
  watchEffect
} from "@elfui/core";

import { Calendar } from "../Calendar";
import { isEventInside, listenForExternalOverlayMotion } from "../../Common/anchored-overlay";
import { useLocaleProvider } from "../../Providers/context";
import styles from "./style.scss?inline";
import { normalizeFieldVariant } from "../../../types/field";
import type { DatePickerType, DatePickerValue, DateShortcut } from "./types";

export type { DatePickerProps, DatePickerType, DatePickerValue, DatePickerVariant, DateShortcut } from "./types";

const props = defineProps({
  modelValue: { type: null, default: "" },
  endValue: { type: String, default: "" },
  type: { type: String, default: "date" },
  variant: { type: String, default: "filled" },
  label: { type: String, default: "" },
  range: { type: Boolean, default: false },
  multiple: { type: Boolean, default: false },
  actions: { type: Boolean, default: false },
  showHeader: { type: Boolean, default: false },
  header: { type: String, default: "" },
  min: { type: String, default: "" },
  max: { type: String, default: "" },
  placeholder: { type: String, default: "" },
  endPlaceholder: { type: String, default: "" },
  disabled: { type: Boolean, default: false },
  clearable: { type: Boolean, default: false },
  shortcuts: { type: Array, default: () => [] },
  confirmText: { type: String, default: "" },
  cancelText: { type: String, default: "" },
  clearText: { type: String, default: "" }
});

const emit = defineEmits<{
  "update:modelValue": [DatePickerValue];
  "update:endValue": [string];
  change: [DatePickerValue];
  clear: [];
  confirm: [DatePickerValue];
  cancel: [];
}>();

useComponents({ "date-picker-calendar": Calendar });
const locale = useLocaleProvider();

const start = useRef("");
const end = useRef("");
const selected = useRef<string[]>([]);
const open = useRef(false);
const monthYear = useRef(new Date().getFullYear());
const host = useHost();

const placeholderText = (): string => props.placeholder || locale.t("datePicker.placeholder");
const endPlaceholderText = (): string => props.endPlaceholder || locale.t("datePicker.endPlaceholder");
const confirmText = (): string => props.confirmText || locale.t("common.confirm");
const cancelText = (): string => props.cancelText || locale.t("common.cancel");
const clearText = (): string => props.clearText || locale.t("common.clear");

const readModelValue = (): DatePickerValue => props.modelValue as DatePickerValue;

const toValues = (value: DatePickerValue): string[] => {
  if (Array.isArray(value)) return value.map(String).filter(Boolean);
  return String(value || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
};

let externalDraftSignature = "";
let expectedDraftSignature = "";
let expectedDraftToken = 0;

const draftSignature = (): string => JSON.stringify([
  props.modelValue,
  props.endValue,
  Boolean(props.multiple),
  Boolean(props.range)
]);

const resetDraft = (force = false): void => {
  const signature = draftSignature();
  if (!force && expectedDraftSignature && signature !== expectedDraftSignature) return;
  if (signature === expectedDraftSignature) expectedDraftSignature = "";
  if (!force && signature === externalDraftSignature) return;
  externalDraftSignature = signature;
  const value = readModelValue();
  if (props.multiple) {
    const values = toValues(value);
    selected.set(values);
    start.set(values[0] ?? "");
  } else {
    start.set(String(value || ""));
    selected.set([]);
  }
  end.set(String(props.endValue || ""));
  const year = Number(String(start.peek() || "").slice(0, 4));
  if (Number.isFinite(year) && year > 0) monthYear.set(year);
};

watchEffect(() => resetDraft());

const inputType = (): DatePickerType => {
  const type = props.type as DatePickerType;
  return type === "datetime-local" || type === "month" || type === "week" ? type : "date";
};

const usesNativeField = (): boolean => inputType() === "datetime-local" || inputType() === "week";

const shortcutItems = (): DateShortcut[] =>
  Array.isArray(props.shortcuts) ? (props.shortcuts as DateShortcut[]) : [];

const shortcutValue = (value: string | (() => string)): string =>
  typeof value === "function" ? value() : value;

const inRange = (value: string): boolean => {
  if (!value) return false;
  if (props.min && value < String(props.min)) return false;
  if (props.max && value > String(props.max)) return false;
  return true;
};

const currentValue = (): DatePickerValue => {
  if (props.multiple) return [...selected.value];
  if (props.range) return [start.value, end.value];
  return start.value;
};

const emitCurrent = (): DatePickerValue => {
  const value = currentValue();
  expectedDraftSignature = JSON.stringify([
    props.multiple ? value : start.value,
    props.range ? end.value : props.endValue,
    Boolean(props.multiple),
    Boolean(props.range)
  ]);
  const token = ++expectedDraftToken;
  window.setTimeout(() => {
    if (token === expectedDraftToken) expectedDraftSignature = "";
  }, 80);
  emit("update:modelValue", props.multiple ? value : start.value);
  if (props.range) emit("update:endValue", end.value);
  emit("change", value);
  return value;
};

const commitIfNeeded = (): void => {
  if (!props.actions) emitCurrent();
};

const setStart = (value: string): void => {
  if (props.disabled || !inRange(value)) return;
  start.set(value);
  commitIfNeeded();
};

const setEnd = (value: string): void => {
  if (props.disabled || !inRange(value)) return;
  end.set(value);
  commitIfNeeded();
};

const toggleMultiple = (value: string): void => {
  if (props.disabled || !inRange(value)) return;
  selected.set(
    selected.value.includes(value)
      ? selected.value.filter((item) => item !== value)
      : [...selected.value, value].sort()
  );
  start.set(value);
  commitIfNeeded();
};

const toggleOpen = (): void => {
  if (props.disabled || usesNativeField()) return;
  open.set(!open.peek());
};

const closePanel = (): void => open.set(false);

const getPanelEl = (): HTMLElement | null =>
  host.shadowRoot?.querySelector<HTMLElement>(".panel") ?? null;

const onDocumentPointerDown = (event: Event): void => {
  if (!open.peek() || isEventInside(event, [host, getPanelEl()])) return;
  closePanel();
};

let cleanupOverlayMotion = (): void => {};

const onNativeStart = (event: Event): void => {
  const value = (event.target as HTMLInputElement).value;
  if (props.multiple) toggleMultiple(value);
  else setStart(value);
};

const onNativeEnd = (event: Event): void => setEnd((event.target as HTMLInputElement).value);

const calendarValue = (): string | [string, string] => {
  if (props.range) return [start.value, end.value];
  return start.value;
};

const calendarDisabled = (date: Date): boolean => {
  const value = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
    date.getDate()
  ).padStart(2, "0")}`;
  return !inRange(value);
};

const onCalendarUpdate = (event: CustomEvent): void => {
  const detail = event.detail;
  if (props.multiple) {
    toggleMultiple(String(detail || ""));
    return;
  }
  if (props.range && Array.isArray(detail)) {
    start.set(String(detail[0] || ""));
    end.set(String(detail[1] || ""));
    commitIfNeeded();
    if (!props.actions) closePanel();
    return;
  }
  setStart(String(detail || ""));
  if (!props.actions) closePanel();
};

const monthItems = (): Array<{ id: string; label: string; active: boolean }> =>
  Array.from({ length: 12 }, (_, month) => {
    const id = `${monthYear.value}-${String(month + 1).padStart(2, "0")}`;
    return {
      id,
      label: new Intl.DateTimeFormat(undefined, { month: "short" }).format(
        new Date(monthYear.value, month, 1)
      ),
      active: start.value === id
    };
  });

const selectMonth = (event: Event): void => {
  const value = (event.currentTarget as HTMLElement).dataset.month || "";
  setStart(value);
  if (!props.actions) closePanel();
};

const shiftMonthYear = (offset: number): void => monthYear.set(monthYear.value + offset);

const applyShortcut = (shortcut: DateShortcut): void => {
  if (props.disabled) return;
  const nextStart = shortcutValue(shortcut.value);
  const nextEnd = shortcut.endValue ? shortcutValue(shortcut.endValue) : nextStart;
  if (!inRange(nextStart) || (props.range && !inRange(nextEnd))) return;
  if (props.multiple) toggleMultiple(nextStart);
  else {
    start.set(nextStart);
    end.set(nextEnd);
    commitIfNeeded();
  }
};

const clear = (): void => {
  if (props.disabled) return;
  start.set("");
  end.set("");
  selected.set([]);
  emit("update:modelValue", props.multiple ? [] : "");
  emit("update:endValue", "");
  emit("change", props.multiple ? [] : props.range ? ["", ""] : "");
  emit("clear");
};

const confirm = (): void => {
  if (props.disabled) return;
  const value = emitCurrent();
  emit("confirm", value);
  closePanel();
};

const cancel = (): void => {
  if (props.disabled) return;
  resetDraft(true);
  emit("cancel");
  closePanel();
};

const removeValue = (value: string): void => {
  if (props.disabled) return;
  selected.set(selected.value.filter((item) => item !== value));
  commitIfNeeded();
};

const hasValue = (): boolean => Boolean(start.value || end.value || selected.value.length);

const displayValue = (): string => {
  if (props.multiple)
    return selected.value.length
      ? locale.t("datePicker.selectedCount", { count: selected.value.length })
      : placeholderText();
  if (props.range)
    return start.value || end.value
      ? `${start.value || placeholderText()} — ${end.value || endPlaceholderText()}`
      : `${placeholderText()} — ${endPlaceholderText()}`;
  return start.value || placeholderText();
};

const headerText = (): string => {
  if (props.header) return String(props.header);
  if (props.multiple) return locale.t("datePicker.multiple");
  if (props.range) return locale.t("datePicker.range");
  return inputType() === "month" ? locale.t("datePicker.month") : locale.t("datePicker.placeholder");
};

onMount(() => {
  document.addEventListener("pointerdown", onDocumentPointerDown, true);
  cleanupOverlayMotion = listenForExternalOverlayMotion(() => [getPanelEl()], closePanel);
});
onUnmount(() => {
  document.removeEventListener("pointerdown", onDocumentPointerDown, true);
  cleanupOverlayMotion();
});
useHostAttr("variant", () => normalizeFieldVariant(props.variant));
useHostFlag("disabled", () => Boolean(props.disabled));
useHostFlag("data-open", () => open.value);
useHostFlag("data-dirty", hasValue);
useHostFlag("data-has-label", () => Boolean(props.label));

defineStyle(styles);

const DatePicker = defineHtml(html`
  <div
    :class=${[
      "date-picker",
      {
        "is-disabled": props.disabled,
        "is-open": open,
        "is-range": props.range && !props.multiple,
        "is-multiple": props.multiple,
        "has-actions": props.actions
      }
    ]}
  >
    <div v-if=${props.showHeader} class="header">
      <span class="header-title">${headerText()}</span>
      <span class="header-type">${inputType()}</span>
    </div>

    <div class="controls">
      <template v-if=${usesNativeField()}>
        <input
          class="field"
          :type=${inputType()}
          :value.prop=${start}
          :min=${props.min}
          :max=${props.max}
          :placeholder=${placeholderText()}
          :disabled=${props.disabled}
          @change=${onNativeStart}
        />
        <span v-if=${props.range && !props.multiple} class="separator">${locale.t("datePicker.rangeSeparator")}</span>
        <input
          v-if=${props.range && !props.multiple}
          class="field"
          :type=${inputType()}
          :value.prop=${end}
          :min=${props.min}
          :max=${props.max}
          :placeholder=${endPlaceholderText()}
          :disabled=${props.disabled}
          @change=${onNativeEnd}
        />
      </template>
      <button
        v-else
        type="button"
        class="field-trigger"
        role="combobox"
        :aria-expanded=${open ? "true" : "false"}
        :disabled=${props.disabled}
        @click=${toggleOpen}
      >
        <fieldset v-if=${props.label} class="field-outline" aria-hidden="true">
          <legend><span>${props.label}</span></legend>
        </fieldset>
        <span v-if=${props.label} class="field-label">${props.label}</span>
        <span class="calendar-icon" aria-hidden="true"></span>
        <span :class=${["field-value", { "is-placeholder": !hasValue() }]}>${displayValue()}</span>
        <span class="chevron" aria-hidden="true"></span>
      </button>
      <button v-if=${props.clearable && hasValue()} type="button" class="clear" @click=${clear}>
        ${clearText()}
      </button>
    </div>

    <div v-if=${props.multiple} class="chips" aria-live="polite">
      <button
        v-for="value in selected"
        :key="value"
        type="button"
        class="chip"
        @click="removeValue(value)"
      >
        <span>{{ value }}</span><svg viewBox="0 0 16 16" aria-hidden="true" focusable="false"><path d="M4 4l8 8M12 4l-8 8"></path></svg>
      </button>
    </div>

    <div v-if=${open} class="panel">
      <div v-if=${inputType() === "month"} class="month-panel">
        <div class="month-nav">
          <button type="button" @click=${() => shiftMonthYear(-1)}>‹</button>
          <strong>${locale.t("datePicker.yearSuffix", { year: monthYear })}</strong>
          <button type="button" @click=${() => shiftMonthYear(1)}>›</button>
        </div>
        <div class="month-grid">
          <button
            v-for="month in monthItems()"
            :key="month.id"
            type="button"
            :class=${["month-option", { "is-active": month.active }]}
            :data-month="month.id"
            @click=${selectMonth}
          >{{ month.label }}</button>
        </div>
      </div>
      <date-picker-calendar
        v-else
        :modelValue.prop=${calendarValue()}
        :range=${props.range}
        :disabledDate.prop=${calendarDisabled}
        @update:modelValue=${onCalendarUpdate}
      ></date-picker-calendar>

      <div v-if=${shortcutItems().length > 0} class="shortcuts">
        <button
          v-for="item in shortcutItems()"
          :key="item.label"
          type="button"
          class="shortcut"
          @click="applyShortcut(item)"
        >{{ item.label }}</button>
      </div>

      <div v-if=${props.actions} class="actions">
        <button v-if=${props.clearable} type="button" class="text-action" @click=${clear}>
          ${clearText()}
        </button>
        <span class="actions-spacer"></span>
        <button type="button" class="text-action" @click=${cancel}>${cancelText()}</button>
        <button type="button" class="primary-action" @click=${confirm}>${confirmText()}</button>
      </div>
    </div>
  </div>
`);

export { DatePicker };
