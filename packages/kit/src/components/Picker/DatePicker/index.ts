import {
  defineEmits,
  defineExpose,
  defineHtml,
  defineProps,
  defineStyle,
  onBeforeUnmount,
  useComponents,
  useComputed,
  useHost,
  useHostAttr,
  useHostFlag,
  useRef,
  useEffect,
} from "@elfui/core";

import { Calendar } from "../Calendar";
import {
  computeAnchoredPosition,
  connectAnchoredOverlayLifecycle,
} from "../../Common/overlay/anchored-overlay";
import { useLocaleProvider } from "../../Providers/context";
import styles from "./style.scss?inline";
import { normalizeFieldVariant } from "../../../types/field";
import { useDisabled, useFormControl, useSize } from "../../../composables";
import { useDateAdapter } from "../../../composables/date";
import { useDismissibleOverlay } from "../../../composables/useDismissibleOverlay";
import { useFieldValueDefaults } from "../../../composables/field-values";
import type {
  DatePickerEmits,
  DatePickerPlacement,
  DatePickerProps,
  DatePickerSlots,
  DatePickerType,
  DatePickerValue,
  DateShortcut,
} from "./types";

export type {
  DatePickerElement,
  DatePickerEmits,
  DatePickerExpose,
  DatePickerPlacement,
  DatePickerPopperOptions,
  DatePickerProps,
  DatePickerSize,
  DatePickerSlots,
  DatePickerType,
  DatePickerValue,
  DatePickerVariant,
  DateShortcut,
} from "./types";

const props = defineProps<DatePickerProps>({
  modelValue: { type: null, default: "" },
  endValue: { type: String, default: "" },
  type: { type: String, default: "date" },
  variant: { type: String, default: "filled" },
  size: { type: String, default: "" },
  label: { type: String, default: "" },
  format: { type: String, default: "" },
  valueFormat: { type: String, default: "" },
  range: { type: Boolean, default: false },
  multiple: { type: Boolean, default: false },
  actions: { type: Boolean, default: false },
  showHeader: { type: Boolean, default: false },
  header: { type: String, default: "" },
  min: { type: String, default: "" },
  max: { type: String, default: "" },
  disabledDate: { type: Function, default: undefined },
  placeholder: { type: String, default: "" },
  startPlaceholder: { type: String, default: "" },
  endPlaceholder: { type: String, default: "" },
  rangeSeparator: { type: String, default: "" },
  defaultValue: { type: String, default: "" },
  defaultTime: { type: null, default: "" },
  unlinkPanels: { type: Boolean, default: false },
  singlePanel: { type: Boolean, default: true },
  cellClassName: { type: Function, default: undefined },
  showWeekNumber: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  readonly: { type: Boolean, default: false },
  editable: { type: Boolean, default: true },
  clearable: { type: Boolean, default: false },
  id: { type: String, default: "" },
  name: { type: String, default: "" },
  tabindex: { type: null, default: 0 },
  ariaLabel: { type: String, default: "" },
  valueOnClear: { type: null, default: undefined },
  emptyValues: { type: Array, default: undefined },
  validateEvent: { type: Boolean, default: true },
  shortcuts: { type: Array, default: () => [] },
  confirmText: { type: String, default: "" },
  cancelText: { type: String, default: "" },
  clearText: { type: String, default: "" },
  teleported: { type: Boolean, default: true },
  placement: { type: String, default: "bottom-start" },
  fallbackPlacements: { type: Array, default: () => ["top-start"] },
  popperOptions: { type: Object, default: () => ({}) },
  popperClass: { type: String, default: "" },
  popperStyle: { type: Object, default: () => ({}) },
  showFooter: { type: Boolean, default: false },
  showConfirm: { type: Boolean, default: false },
});

const emit = defineEmits<DatePickerEmits>();
const fieldValues = useFieldValueDefaults();

const ctl = useFormControl<DatePickerValue>(props, emit, {
  ...(props.validateEvent === false ? { triggers: { change: false, blur: false } } : {}),
});
const isDisabled = useDisabled(() => Boolean(props.disabled));
const resolvedSize = useSize(() => props.size);

useComponents({ "date-picker-calendar": Calendar });
const locale = useLocaleProvider();
const dateService = useDateAdapter();

const start = useRef("");
const end = useRef("");
const selected = useRef<string[]>([]);
const open = useRef(false);
const monthYear = useRef(dateService.adapter.now().getFullYear());
const leftPanelView = useRef("");
const rightPanelView = useRef("");
const overlayStyle = useRef<Record<string, string>>({});
const host = useHost();
let overlayFrame = 0;
let activePanel: HTMLElement | null = null;
let cleanupAnchoredOverlay = (): void => {};

const parseFormattedValue = (value: unknown): string => {
  const source = String(value || "");
  const pattern = String(props.valueFormat || "");
  if (!source || !pattern || pattern === "YYYY-MM-DD" || String(props.type || "date") !== "date")
    return source;
  const parsed = dateService.adapter.parse(source, pattern);
  return parsed ? dateService.adapter.toISODate(parsed) : source;
};

const formatValue = (value: string, pattern: string): string => {
  if (!value || !pattern || String(props.type || "date") !== "date") return value;
  const parsed = dateService.adapter.parse(value);
  return parsed ? dateService.adapter.format(parsed, pattern, dateService.context) : value;
};

const externalValue = (value: string): string =>
  formatValue(value, String(props.valueFormat || ""));
const displayDate = (value: string): string =>
  formatValue(value, String(props.format || props.valueFormat || ""));

const placeholderText = (): string =>
  props.startPlaceholder || props.placeholder || locale.t("datePicker.placeholder");
const endPlaceholderText = (): string =>
  props.endPlaceholder || locale.t("datePicker.endPlaceholder");
const rangeSeparatorText = (): string =>
  props.rangeSeparator || locale.t("datePicker.rangeSeparator");
const confirmText = (): string => props.confirmText || locale.t("common.confirm");
const cancelText = (): string => props.cancelText || locale.t("common.cancel");
const clearText = (): string => props.clearText || locale.t("common.clear");
const showActions = (): boolean => Boolean(props.actions || props.showFooter || props.showConfirm);
const resolvedPanelStyle = useComputed((): Record<string, string> => ({
  ...(props.popperStyle || {}),
  ...overlayStyle.value,
}));

const isEmptyValue = (value: unknown): boolean => fieldValues.isEmpty(value, props.emptyValues);
const readModelValue = (): DatePickerValue =>
  isEmptyValue(props.modelValue)
    ? props.multiple
      ? []
      : ""
    : (props.modelValue as DatePickerValue);

const toValues = (value: DatePickerValue): string[] => {
  if (Array.isArray(value)) return value.map(String).filter(Boolean);
  return String(value || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
};

const addMonths = (value: string, amount: number): string => {
  const source = parseFormattedValue(value || props.defaultValue);
  const date = dateService.adapter.parse(source) ?? dateService.adapter.now();
  const month = dateService.adapter.create(date.getFullYear(), date.getMonth(), 1);
  return dateService.adapter.toISODate(dateService.adapter.add(month, amount, "month"));
};

const syncPanelViews = (): void => {
  const base =
    start.peek() || props.defaultValue || dateService.adapter.toISODate(dateService.adapter.now());
  leftPanelView.set(base);
  rightPanelView.set(end.peek() || addMonths(base, 1));
};

let externalDraftSignature = "";
let expectedDraftSignature = "";
let expectedDraftToken = 0;

const draftSignature = (): string =>
  JSON.stringify([props.modelValue, props.endValue, Boolean(props.multiple), Boolean(props.range)]);

const resetDraft = (force = false): void => {
  const signature = draftSignature();
  if (!force && expectedDraftSignature && signature !== expectedDraftSignature) return;
  if (signature === expectedDraftSignature) expectedDraftSignature = "";
  if (!force && signature === externalDraftSignature) return;
  externalDraftSignature = signature;
  const value = readModelValue();
  if (props.multiple) {
    const values = toValues(value).map(parseFormattedValue);
    selected.set(values);
    start.set(values[0] ?? "");
  } else {
    start.set(parseFormattedValue(value));
    selected.set([]);
  }
  end.set(parseFormattedValue(props.endValue));
  const year = Number(String(start.peek() || "").slice(0, 4));
  if (Number.isFinite(year) && year > 0) monthYear.set(year);
  syncPanelViews();
};

useEffect(() => resetDraft());

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
  if (typeof props.disabledDate === "function") {
    const date = dateService.adapter.parse(value);
    if (date && props.disabledDate(date)) return false;
  }
  return true;
};

const currentValue = (): DatePickerValue => {
  if (props.multiple) return [...selected.value];
  if (props.range) return [start.value, end.value];
  return start.value;
};

const emitCurrent = (): DatePickerValue => {
  const value = currentValue();
  const emittedValue: DatePickerValue = Array.isArray(value)
    ? value.map(externalValue)
    : externalValue(value);
  expectedDraftSignature = JSON.stringify([
    props.multiple ? emittedValue : externalValue(start.value),
    props.range ? externalValue(end.value) : props.endValue,
    Boolean(props.multiple),
    Boolean(props.range),
  ]);
  const token = ++expectedDraftToken;
  window.setTimeout(() => {
    if (token === expectedDraftToken) expectedDraftSignature = "";
  }, 80);
  ctl.setValue(props.multiple ? emittedValue : externalValue(start.value));
  if (props.range) emit("update:endValue", externalValue(end.value));
  ctl.dispatchChange(emittedValue);
  return emittedValue;
};

const commitIfNeeded = (): void => {
  if (!showActions()) emitCurrent();
};

const setStart = (value: string): void => {
  if (isDisabled() || props.readonly || !inRange(value)) return;
  start.set(value);
  commitIfNeeded();
};

const setEnd = (value: string): void => {
  if (isDisabled() || props.readonly || !inRange(value)) return;
  end.set(value);
  commitIfNeeded();
};

const toggleMultiple = (value: string): void => {
  if (isDisabled() || props.readonly || !inRange(value)) return;
  selected.set(
    selected.value.includes(value)
      ? selected.value.filter((item) => item !== value)
      : [...selected.value, value].sort(),
  );
  start.set(value);
  commitIfNeeded();
};

const setOpen = (visible: boolean): void => {
  if (open.peek() === visible) return;
  if (visible) syncPanelViews();
  open.set(visible);
  emit("visible-change", visible);
};

const toggleOpen = (): void => {
  if (isDisabled() || props.readonly || usesNativeField()) return;
  setOpen(!open.peek());
};

const closePanel = (): void => setOpen(false);

const getPanelEl = (): HTMLElement | null =>
  activePanel ?? host.shadowRoot?.querySelector<HTMLElement>(".panel") ?? null;
const getTriggerEl = (): HTMLButtonElement | null =>
  host.shadowRoot?.querySelector<HTMLButtonElement>(".field-trigger") ?? null;

const dismissibleOverlay = useDismissibleOverlay({
  kind: "date-picker",
  containers: () => [host, getPanelEl()],
  closeOnEscape: () => true,
  closeOnOutside: () => true,
  outsideEvent: "pointerdown",
  outsideCapture: true,
  onRequestClose: (reason) => {
    closePanel();
    if (reason === "escape") queueMicrotask(() => getTriggerEl()?.focus());
  },
});

const updateOverlayPosition = (): void => {
  if (!props.teleported || !open.peek()) {
    overlayStyle.set({});
    return;
  }
  const trigger = getTriggerEl();
  const panel = getPanelEl();
  if (!trigger || !panel) return;
  const anchor = trigger.getBoundingClientRect();
  if (anchor.width === 0 && anchor.height === 0) return;
  const rect = panel.getBoundingClientRect();
  const viewport = window.visualViewport;
  const options = props.popperOptions || {};
  const preferredPlacement = (options.placement ||
    props.placement ||
    "bottom-start") as DatePickerPlacement;
  const next = computeAnchoredPosition(
    anchor,
    { width: rect.width || Math.min(420, window.innerWidth - 32), height: rect.height || 360 },
    {
      width: viewport?.width || window.innerWidth,
      height: viewport?.height || window.innerHeight,
      offsetLeft: viewport?.offsetLeft || 0,
      offsetTop: viewport?.offsetTop || 0,
    },
    {
      placement: preferredPlacement,
      offset: options.offset || [0, 8],
      padding: options.padding ?? 8,
      flip: options.flip ?? true,
      fallbackPlacements: options.fallbackPlacements || props.fallbackPlacements,
    },
  );
  overlayStyle.set({
    position: "fixed",
    top: `${Math.round(next.top)}px`,
    left: `${Math.round(next.left)}px`,
    right: "auto",
    bottom: "auto",
    margin: "0",
  });
};

const syncTopLayer = (element = getPanelEl()): void => {
  const panel = element as
    (HTMLElement & { showPopover?: () => void; hidePopover?: () => void }) | null;
  if (!panel) return;
  try {
    if (props.teleported && open.peek()) panel.showPopover?.();
    else panel.hidePopover?.();
  } catch {
    // Rapid conditional replacement can update the native popover state first.
  }
  if (open.peek()) updateOverlayPosition();
};

const hideTopLayer = (element: Element): void => {
  try {
    (element as HTMLElement & { hidePopover?: () => void }).hidePopover?.();
  } catch {
    // A disconnected native popover is already equivalent to a hidden panel.
  }
};

const requestOverlayUpdate = (): void => {
  if (!open.peek()) return;
  if (overlayFrame) cancelAnimationFrame(overlayFrame);
  overlayFrame = requestAnimationFrame(() => {
    overlayFrame = 0;
    updateOverlayPosition();
  });
};

const focusCalendar = (): void => {
  queueMicrotask(() =>
    queueMicrotask(() => {
      const calendar = host.shadowRoot?.querySelector<HTMLElement>("elf-calendar");
      calendar?.shadowRoot
        ?.querySelector<HTMLElement>('[tabindex="0"]')
        ?.focus({ preventScroll: true });
    }),
  );
};

const onTriggerKeydown = (event: KeyboardEvent): void => {
  if (event.key === "Escape" && open.peek()) {
    event.preventDefault();
    event.stopPropagation();
    if (dismissibleOverlay.claim(event)) closePanel();
    return;
  }
  if (!["ArrowDown", "Enter", " "].includes(event.key) || isDisabled() || props.readonly) return;
  event.preventDefault();
  event.stopPropagation();
  setOpen(true);
  focusCalendar();
};

const onTriggerFocus = (event: FocusEvent): void => {
  ctl.dispatchFocus(event);
};
const onTriggerBlur = (event: FocusEvent): void => {
  ctl.dispatchBlur(event);
};

const connectAnchoredOverlay = (panel = getPanelEl()): void => {
  cleanupAnchoredOverlay();
  syncTopLayer(panel);
  if (!panel || !props.teleported || !open.peek()) return;
  cleanupAnchoredOverlay = connectAnchoredOverlayLifecycle({
    resizeTargets: [getTriggerEl(), panel],
    motionContainers: () => [host, panel],
    onResize: requestOverlayUpdate,
    onExternalMotion: closePanel,
  });
  requestOverlayUpdate();
};

const onNativeStart = (event: Event): void => {
  const value = withDefaultTime((event.target as HTMLInputElement).value, "start");
  if (props.multiple) toggleMultiple(value);
  else setStart(value);
};

const onNativeEnd = (event: Event): void =>
  setEnd(withDefaultTime((event.target as HTMLInputElement).value, "end"));

const defaultTimeFor = (target: "start" | "end"): string => {
  const value = props.defaultTime;
  return String(Array.isArray(value) ? value[target === "end" ? 1 : 0] || "" : value || "").replace(
    /^T/,
    "",
  );
};

const withDefaultTime = (value: string, target: "start" | "end"): string => {
  if (inputType() !== "datetime-local" || !value || value.includes("T")) return value;
  const time = defaultTimeFor(target);
  return time ? `${value}T${time}` : value;
};

const calendarValue = (): string | [string, string] => {
  if (props.range) return [start.value, end.value];
  return start.value;
};

const usesDualPanels = (): boolean => Boolean(props.range && !props.singlePanel);
const onCalendarPanelChange = (side: "left" | "right", event: CustomEvent<Date>): void => {
  const date = dateService.adapter.parse(event.detail);
  if (!date) return;
  const next = dateService.adapter.toISODate(
    dateService.adapter.create(date.getFullYear(), date.getMonth(), 1),
  );
  if (side === "left") {
    leftPanelView.set(next);
    if (!props.unlinkPanels) rightPanelView.set(addMonths(next, 1));
  } else {
    rightPanelView.set(next);
    if (!props.unlinkPanels) leftPanelView.set(addMonths(next, -1));
  }
  emit("panel-change", date, "month");
};

const calendarDisabled = (date: Date): boolean => {
  return !inRange(dateService.adapter.toISODate(date));
};

const onCalendarUpdate = (event: CustomEvent): void => {
  const detail = event.detail;
  emit("calendar-change", detail as DatePickerValue);
  if (props.multiple) {
    toggleMultiple(String(detail || ""));
    return;
  }
  if (props.range && Array.isArray(detail)) {
    start.set(String(detail[0] || ""));
    end.set(String(detail[1] || ""));
    commitIfNeeded();
    if (!showActions()) closePanel();
    return;
  }
  setStart(String(detail || ""));
  if (!showActions()) closePanel();
};

const monthItems = (): Array<{ id: string; label: string; active: boolean }> =>
  Array.from({ length: 12 }, (_, month) => {
    const id = `${monthYear.value}-${String(month + 1).padStart(2, "0")}`;
    return {
      id,
      label: dateService.adapter.format(
        dateService.adapter.create(monthYear.value, month, 1),
        "monthShort",
        dateService.context,
      ),
      active: start.value === id,
    };
  });

const selectMonth = (event: Event): void => {
  const value = (event.currentTarget as HTMLElement).dataset.month || "";
  setStart(value);
  if (!showActions()) closePanel();
};

const shiftMonthYear = (offset: number): void => {
  monthYear.set(monthYear.value + offset);
  emit("panel-change", dateService.adapter.create(monthYear.value, 0, 1), "year");
};
const currentMonthYear = (): number => monthYear.value;

const applyShortcut = (shortcut: DateShortcut): void => {
  if (isDisabled() || props.readonly) return;
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
  if (isDisabled() || props.readonly) return;
  const next = fieldValues.valueOnClear<DatePickerValue>(props.valueOnClear, () =>
    props.multiple || props.range ? [] : "",
  );
  const values = Array.isArray(next) ? next.map(String) : [String(next || "")];
  start.set(values[0] || "");
  end.set(props.range ? values[1] || "" : "");
  selected.set(props.multiple ? values.filter(Boolean) : []);
  ctl.setValue(next);
  emit("update:endValue", props.range ? end.value : "");
  ctl.dispatchChange(next);
  emit("clear");
};

const confirm = (): void => {
  if (isDisabled() || props.readonly) return;
  const value = emitCurrent();
  emit("confirm", value);
  closePanel();
};

const cancel = (): void => {
  if (isDisabled() || props.readonly) return;
  resetDraft(true);
  emit("cancel");
  closePanel();
};

const removeValue = (value: string): void => {
  if (isDisabled() || props.readonly) return;
  selected.set(selected.value.filter((item) => item !== value));
  commitIfNeeded();
};

const hasValue = (): boolean => Boolean(start.value || end.value || selected.value.length);
const hasStartValue = (): boolean => Boolean(start.value);
const hasEndValue = (): boolean => Boolean(end.value);
const startDisplayValue = (): string => displayDate(start.value) || placeholderText();
const endDisplayValue = (): string => displayDate(end.value) || endPlaceholderText();

const displayValue = (): string => {
  if (props.multiple)
    return selected.value.length
      ? locale.t("datePicker.selectedCount", { count: selected.value.length })
      : placeholderText();
  if (props.range)
    return start.value || end.value
      ? `${displayDate(start.value) || placeholderText()} — ${displayDate(end.value) || endPlaceholderText()}`
      : `${placeholderText()} — ${endPlaceholderText()}`;
  return displayDate(start.value) || placeholderText();
};

const headerText = (): string => {
  if (props.header) return String(props.header);
  if (props.multiple) return locale.t("datePicker.multiple");
  if (props.range) return locale.t("datePicker.range");
  return inputType() === "month"
    ? locale.t("datePicker.month")
    : locale.t("datePicker.placeholder");
};

useEffect(() => {
  void open.value;
  void props.teleported;
  void props.placement;
  void props.popperOptions;
  if (activePanel && open.value) connectAnchoredOverlay(activePanel);
});

/** Starts one positioned popover transaction for the inserted panel root. */
const onBeforeEnter = (element: Element): void => {
  const panel = element as HTMLElement;
  activePanel = panel;
  if (!dismissibleOverlay.isActive()) dismissibleOverlay.activate();
  connectAnchoredOverlay(panel);
};

const onAfterEnter = (element: Element): void => {
  if (activePanel === element && open.peek()) requestOverlayUpdate();
};

/** Releases input ownership immediately while retaining the leaving panel until Core settles it. */
const onBeforeLeave = (element: Element): void => {
  if (activePanel !== element) return;
  dismissibleOverlay.beginClose();
  cleanupAnchoredOverlay();
};

/** Completes Top Layer and dismissible ownership for the final active panel only. */
const onAfterLeave = (element: Element): void => {
  hideTopLayer(element);
  if (activePanel !== element || open.peek()) return;
  if (!dismissibleOverlay.completeClose()) dismissibleOverlay.deactivate();
  activePanel = null;
  overlayStyle.set({});
};

onBeforeUnmount(() => {
  if (activePanel) hideTopLayer(activePanel);
  activePanel = null;
  dismissibleOverlay.deactivate();
  cleanupAnchoredOverlay();
  if (overlayFrame) cancelAnimationFrame(overlayFrame);
});
useHostAttr("variant", () => normalizeFieldVariant(props.variant));
useHostAttr("size", resolvedSize);
useHostFlag("disabled", isDisabled);
useHostFlag("data-open", () => open.value);
useHostFlag("data-dirty", hasValue);
useHostFlag("data-has-label", () => Boolean(props.label));

defineStyle(styles);
defineExpose({
  focusInput: () => getTriggerEl()?.focus(),
  blurInput: () => getTriggerEl()?.blur(),
  handleOpen: () => setOpen(true),
  handleClose: closePanel,
});

const DatePicker = defineHtml<DatePickerProps, DatePickerEmits, DatePickerSlots>(`
  <div
    :class=${[
      "date-picker",
      {
        "is-disabled": isDisabled(),
        "is-open": open,
        "is-range": props.range && !props.multiple,
        "is-multiple": props.multiple,
        "has-actions": showActions(),
      },
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
          :disabled=${isDisabled()}
          :readonly=${props.readonly || !props.editable}
          :id=${props.id}
          :name=${props.name}
          :tabindex=${props.tabindex}
          :aria-label=${props.ariaLabel || placeholderText()}
          @change=${onNativeStart}
        />
        <span v-if=${props.range && !props.multiple} class="separator">${rangeSeparatorText()}</span>
        <input
          v-if=${props.range && !props.multiple}
          class="field"
          :type=${inputType()}
          :value.prop=${end}
          :min=${props.min}
          :max=${props.max}
          :placeholder=${endPlaceholderText()}
          :disabled=${isDisabled()}
          :readonly=${props.readonly || !props.editable}
          @change=${onNativeEnd}
        />
      </template>
      <button
        v-else
        type="button"
        class="field-trigger"
        role="combobox"
        :aria-expanded=${open ? "true" : "false"}
        aria-haspopup="dialog"
        :disabled=${isDisabled()}
        :tabindex=${props.tabindex}
        :aria-label=${props.ariaLabel || props.label || placeholderText()}
        @click=${toggleOpen}
        @keydown=${onTriggerKeydown}
        @focus=${onTriggerFocus}
        @blur=${onTriggerBlur}
      >
        <fieldset class="field-outline" aria-hidden="true">
          <legend><span>${props.label}</span></legend>
        </fieldset>
        <span v-if=${props.label} class="field-label">${props.label}</span>
        <span class="calendar-icon" aria-hidden="true"></span>
        <template v-if=${props.range && !props.multiple}>
          <span :class=${["field-value", { "is-placeholder": !hasStartValue() }]}>${startDisplayValue()}</span>
          <span class="separator"><slot name="range-separator">${rangeSeparatorText()}</slot></span>
          <span :class=${["field-value", { "is-placeholder": !hasEndValue() }]}>${endDisplayValue()}</span>
        </template>
        <span v-else :class=${["field-value", { "is-placeholder": !hasValue() }]}>${displayValue()}</span>
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

    <Transition
      name="date-picker-panel"
      appear
      @before-enter=${onBeforeEnter}
      @after-enter=${onAfterEnter}
      @before-leave=${onBeforeLeave}
      @after-leave=${onAfterLeave}
    >
      <div
        v-if=${open}
        :class=${["panel", props.popperClass, { "is-teleported": props.teleported }]}
        :style=${resolvedPanelStyle}
        :popover=${props.teleported ? "manual" : undefined}
        role="dialog"
      >
        <div v-if=${inputType() === "month"} class="month-panel">
          <div class="month-nav">
            <button type="button" @click=${() => shiftMonthYear(-1)}><slot name="prev-year">‹</slot></button>
            <strong>${locale.t("datePicker.yearSuffix", { year: currentMonthYear() })}</strong>
            <button type="button" @click=${() => shiftMonthYear(1)}><slot name="next-year">›</slot></button>
          </div>
          <div class="month-grid">
            <button
              v-for="month in monthItems()"
              :key="month.id"
              type="button"
              :class='["month-option", { "is-active": month.active }]'
              :data-month="month.id"
              @click=${selectMonth}
            >{{ month.label }}</button>
          </div>
        </div>
        <div v-else :class=${["calendar-panels", { "is-dual": usesDualPanels() }]}>
          <date-picker-calendar
            :modelValue.prop=${calendarValue()}
            :viewDate.prop=${leftPanelView}
            :defaultValue.prop=${props.defaultValue}
            :range=${props.range}
            :disabledDate.prop=${calendarDisabled}
            :cellClassName.prop=${props.cellClassName}
            :showWeekNumber.prop=${props.showWeekNumber}
            :firstDayOfWeek.prop=${dateService.firstDayOfWeek}
            @panel-change="onCalendarPanelChange('left', $event)"
            @update:modelValue=${onCalendarUpdate}
          >
            <span slot="prev-month"><slot name="prev-month">‹</slot></span>
            <span slot="next-month"><slot name="next-month">›</slot></span>
            <span slot="prev-year"><slot name="prev-year">‹</slot></span>
            <span slot="next-year"><slot name="next-year">›</slot></span>
          </date-picker-calendar>
          <date-picker-calendar
            v-if=${usesDualPanels()}
            :modelValue.prop=${calendarValue()}
            :viewDate.prop=${rightPanelView}
            :defaultValue.prop=${addMonths(props.defaultValue, 1)}
            range
            :disabledDate.prop=${calendarDisabled}
            :cellClassName.prop=${props.cellClassName}
            :showWeekNumber.prop=${props.showWeekNumber}
            :firstDayOfWeek.prop=${dateService.firstDayOfWeek}
            @panel-change="onCalendarPanelChange('right', $event)"
            @update:modelValue=${onCalendarUpdate}
          ></date-picker-calendar>
        </div>

        <div v-if=${shortcutItems().length > 0} class="shortcuts">
          <button
            v-for="item in shortcutItems()"
            :key="item.label"
            type="button"
            class="shortcut"
            @click="applyShortcut(item)"
          >{{ item.label }}</button>
        </div>

        <div v-if=${showActions()} class="actions">
          <button v-if=${props.clearable} type="button" class="text-action" @click=${clear}>
            ${clearText()}
          </button>
          <span class="actions-spacer"></span>
          <button type="button" class="text-action" @click=${cancel}>${cancelText()}</button>
          <button type="button" class="primary-action" @click=${confirm}>${confirmText()}</button>
        </div>
      </div>
    </Transition>
  </div>
`);

export { DatePicker };
