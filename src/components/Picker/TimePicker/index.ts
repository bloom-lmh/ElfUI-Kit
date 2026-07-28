import {
  defineEmits,
  defineExpose,
  defineHtml,
  defineProps,
  defineStyle,
  onBeforeUnmount,
  onMounted,
  useComputed,
  useHost,
  useHostAttr,
  useHostFlag,
  useRef,
  useEffect
} from "@elfui/core";

import styles from "./style.scss?inline";
import { normalizeFieldVariant } from "../../../types/field";
import { useDisabled, useFormControl, useSize } from "../../../composables";
import { computeAnchoredPosition, listenForExternalOverlayMotion } from "../../Common/anchored-overlay";
import { useLocaleProvider } from "../../Providers/context";
import { useDismissibleOverlay } from "../../../composables/useDismissibleOverlay";
import type { TimePickerModelValue, TimePickerPlacement, TimePickerProps, TimePickerRole, TimeShortcut } from "./types";

export type {
  DisabledHours,
  DisabledMinutes,
  DisabledSeconds,
  TimePickerElement,
  TimePickerExpose,
  TimePickerModelValue,
  TimePickerPlacement,
  TimePickerPopperOptions,
  TimePickerProps,
  TimePickerRole,
  TimePickerSize,
  TimePickerVariant,
  TimeShortcut,
} from "./types";

type EditingTarget = TimePickerRole;
type ClockUnit = "hour" | "minute" | "second";

const props = defineProps<TimePickerProps>({
  modelValue: { type: null, default: "" },
  endValue: { type: String, default: "" },
  range: { type: Boolean, default: false },
  isRange: { type: Boolean, default: false },
  min: { type: String, default: "" },
  max: { type: String, default: "" },
  step: { type: Number, default: 60 },
  format: { type: String, default: "HH:mm" },
  valueFormat: { type: String, default: "HH:mm" },
  disabledHours: { type: Function, default: undefined },
  disabledMinutes: { type: Function, default: undefined },
  disabledSeconds: { type: Function, default: undefined },
  readonly: { type: Boolean, default: false },
  editable: { type: Boolean, default: true },
  size: { type: String, default: "" },
  variant: { type: String, default: "filled" },
  label: { type: String, default: "" },
  placeholder: { type: String, default: "" },
  startPlaceholder: { type: String, default: "" },
  endPlaceholder: { type: String, default: "" },
  rangeSeparator: { type: String, default: "" },
  disabled: { type: Boolean, default: false },
  clearable: { type: Boolean, default: true },
  id: { type: null, default: "" },
  name: { type: String, default: "" },
  tabindex: { type: null, default: 0 },
  valueOnClear: { type: null, default: undefined },
  emptyValues: { type: Array, default: () => [undefined, null, ""] },
  saveOnBlur: { type: Boolean, default: true },
  shortcuts: { type: Array, default: () => [] },
  defaultValue: { type: null, default: "" },
  arrowControl: { type: Boolean, default: false },
  teleported: { type: Boolean, default: true },
  placement: { type: String, default: "bottom-start" },
  fallbackPlacements: { type: Array, default: () => ["top-start"] },
  popperOptions: { type: Object, default: () => ({}) },
  popperClass: { type: String, default: "" },
  popperStyle: { type: Object, default: () => ({}) },
  ariaLabel: { type: String, default: "" },
  prefixIcon: { type: String, default: "" },
  clearIcon: { type: String, default: "" },
  validateEvent: { type: Boolean, default: true },
});

const emit = defineEmits<{
  "update:modelValue": [value: TimePickerModelValue];
  "update:endValue": [value: string];
  change: [value: TimePickerModelValue];
  clear: [];
  blur: [event: FocusEvent];
  focus: [event: FocusEvent];
  "visible-change": [visible: boolean];
}>();

const ctl = useFormControl<TimePickerModelValue>(props, emit, {
  ...(props.validateEvent === false ? { triggers: { change: false, blur: false } } : {})
});
const isDisabled = useDisabled(() => Boolean(props.disabled));
const resolvedSize = useSize(() => props.size);

const locale = useLocaleProvider();

const start = useRef("");
const end = useRef("");
const open = useRef(false);
const editingTarget = useRef<EditingTarget>("start");
const activeUnit = useRef<ClockUnit>("hour");
const panelStyle = useRef<Record<string, string>>({});
const host = useHost();
let overlayFrame = 0;

const resolvedPanelStyle = useComputed((): Record<string, string> => ({
  ...(props.popperStyle || {}),
  ...panelStyle.value,
}));

interface TimeParts {
  hour: number;
  minute: number;
  second: number;
}

const isEmptyValue = (value: unknown): boolean =>
  (props.emptyValues || []).some((candidate) => Object.is(candidate, value));

const pad = (value: number): string => String(value).padStart(2, "0");

const parseTime = (value: string): TimeParts => {
  const numbers =
    String(value || "")
      .match(/\d+/g)
      ?.map(Number) ?? [];
  return {
    hour: Math.max(0, Math.min(23, numbers[0] || 0)),
    minute: Math.max(0, Math.min(59, numbers[1] || 0)),
    second: Math.max(0, Math.min(59, numbers[2] || 0)),
  };
};

const formatTime = (value: TimeParts, pattern: string): string =>
  String(pattern || "HH:mm")
    .replace(/HH/g, pad(value.hour))
    .replace(/mm/g, pad(value.minute))
    .replace(/ss/g, pad(value.second));

const normalizeTime = (value: string): string => formatTime(parseTime(value), "HH:mm:ss");
const externalValue = (value: string): string => formatTime(parseTime(value), props.valueFormat || "HH:mm");
const displayValue = (value: string): string =>
  formatTime(parseTime(value), props.format || props.valueFormat || "HH:mm");
const showsSeconds = (): boolean => /ss/.test(String(props.format || props.valueFormat || "")) || props.step < 60;

const placeholderText = (): string => props.placeholder || locale.t("timePicker.placeholder");
const startPlaceholderText = (): string => props.startPlaceholder || locale.t("timePicker.startPlaceholder");
const endPlaceholderText = (): string => props.endPlaceholder || locale.t("timePicker.endPlaceholder");
const rangeSeparatorText = (): string => props.rangeSeparator || locale.t("timePicker.rangeSeparator");

useEffect(() => {
  if (isEmptyValue(props.modelValue)) {
    start.set("");
    end.set("");
    return;
  }
  if (Array.isArray(props.modelValue)) {
    start.set(props.modelValue[0] ? normalizeTime(String(props.modelValue[0])) : "");
    end.set(props.modelValue[1] ? normalizeTime(String(props.modelValue[1])) : "");
    return;
  }
  start.set(props.modelValue ? normalizeTime(String(props.modelValue)) : "");
  end.set(props.endValue ? normalizeTime(String(props.endValue)) : "");
});

const rangeMode = (): boolean => Boolean(props.range || props.isRange || Array.isArray(props.modelValue));

const currentValue = (): TimePickerModelValue =>
  rangeMode()
    ? [start.value ? externalValue(start.value) : "", end.value ? externalValue(end.value) : ""]
    : start.value
      ? externalValue(start.value)
      : "";

const emitChange = (value: TimePickerModelValue = currentValue()): void => ctl.dispatchChange(value);

const isAllowed = (value: string): boolean => {
  const normalized = normalizeTime(value);
  if (props.min && normalized < normalizeTime(String(props.min))) return false;
  if (props.max && normalized > normalizeTime(String(props.max))) return false;
  return true;
};

const setStart = (value: string): void => {
  if (isDisabled() || props.readonly || !isAllowed(value)) return;
  start.set(value);
  const next = currentValue();
  ctl.setValue(next);
  emitChange(next);
};

const setEnd = (value: string): void => {
  if (isDisabled() || props.readonly || !isAllowed(value)) return;
  end.set(value);
  if (rangeMode()) ctl.setValue(currentValue());
  emit("update:endValue", value);
  emitChange();
};

const setEditingValue = (value: string): void => {
  if (editingTarget.value === "end") setEnd(value);
  else setStart(value);
};

const defaultEditingValue = (): string => {
  const value = props.defaultValue;
  if (Array.isArray(value)) return String(value[editingTarget.value === "end" ? 1 : 0] || value[0] || "00:00");
  return String(value || "00:00");
};

const editingValue = (): string =>
  normalizeTime(editingTarget.value === "end" ? end.value || start.value || defaultEditingValue() : start.value || defaultEditingValue());

const editingHour = (): number => Number(editingValue().slice(0, 2));
const editingMinute = (): number => Number(editingValue().slice(3, 5));
const editingSecond = (): number => Number(editingValue().slice(6, 8));
const period = (): "AM" | "PM" => (editingHour() >= 12 ? "PM" : "AM");

interface ClockItem {
  key: string;
  amount: number;
  label: number | string;
  active: boolean;
  disabled: boolean;
  style: Record<string, string>;
}

const hourItems = (): ClockItem[] =>
  Array.from({ length: 12 }, (_, index) => {
    const label = index + 1;
    const normalized = label % 12;
    return {
      key: `hour-${normalized}`,
      amount: normalized,
      label,
      active: editingHour() % 12 === normalized,
      disabled: disabledHourValues().includes(normalized + (period() === "PM" ? 12 : 0)),
      style: {
        "--clock-angle": `${label * 30}deg`,
        "--clock-angle-neg": `${label * -30}deg`,
      },
    };
  });

const unitStep = (unit: "minute" | "second"): number => {
  const seconds = Math.max(1, Number(props.step) || 60);
  return unit === "minute" ? Math.max(1, Math.min(30, Math.round(seconds / 60))) : Math.max(1, Math.min(30, seconds));
};

const radialValues = (step: number): number[] => {
  const values: number[] = [];
  for (let value = 0; value < 60; value += step) values.push(value);
  return values.length <= 12 ? values : Array.from({ length: 12 }, (_, index) => index * 5);
};

const disabledHourValues = (): number[] => props.disabledHours?.(editingTarget.value) ?? [];
const disabledMinuteValues = (): number[] => props.disabledMinutes?.(editingHour(), editingTarget.value) ?? [];
const disabledSecondValues = (): number[] =>
  props.disabledSeconds?.(editingHour(), editingMinute(), editingTarget.value) ?? [];

const minuteItems = (): ClockItem[] => {
  const values = radialValues(unitStep("minute"));
  return values.map((value, index) => {
    return {
      key: `minute-${value}`,
      amount: value,
      label: String(value).padStart(2, "0"),
      active: editingMinute() === value,
      disabled: disabledMinuteValues().includes(value),
      style: {
        "--clock-angle": `${index * (360 / values.length)}deg`,
        "--clock-angle-neg": `${index * (-360 / values.length)}deg`,
      },
    };
  });
};

const secondItems = (): ClockItem[] => {
  const values = radialValues(unitStep("second"));
  return values.map((value, index) => ({
    key: `second-${value}`,
    amount: value,
    label: pad(value),
    active: editingSecond() === value,
    disabled: disabledSecondValues().includes(value),
    style: {
      "--clock-angle": `${index * (360 / values.length)}deg`,
      "--clock-angle-neg": `${index * (-360 / values.length)}deg`,
    },
  }));
};

const clockItems = () =>
  activeUnit.value === "hour" ? hourItems() : activeUnit.value === "minute" ? minuteItems() : secondItems();

const syncClockSelection = (value: number): void => {
  host.shadowRoot?.querySelectorAll<HTMLButtonElement>(".clock-number").forEach((button) => {
    const selected = Number(button.dataset.clockValue) === value;
    button.classList.toggle("is-active", selected);
    button.setAttribute("aria-pressed", selected ? "true" : "false");
  });
};

const selectClockValue = (event: Event): void => {
  const value = Number((event.currentTarget as HTMLElement).dataset.clockValue);
  if (!Number.isFinite(value) || (event.currentTarget as HTMLButtonElement).disabled) return;
  if (activeUnit.value === "hour") {
    const nextHour = value + (period() === "PM" ? 12 : 0);
    setEditingValue(`${pad(nextHour)}:${pad(editingMinute())}:${pad(editingSecond())}`);
    activeUnit.set("minute");
    return;
  }
  if (activeUnit.value === "minute") {
    setEditingValue(`${pad(editingHour())}:${pad(value)}:${pad(editingSecond())}`);
    if (showsSeconds()) activeUnit.set("second");
  } else {
    setEditingValue(`${pad(editingHour())}:${pad(editingMinute())}:${pad(value)}`);
  }
  syncClockSelection(value);
  queueMicrotask(() => syncClockSelection(value));
};

const setPeriod = (next: "AM" | "PM"): void => {
  let hour = editingHour();
  if (next === "AM" && hour >= 12) hour -= 12;
  if (next === "PM" && hour < 12) hour += 12;
  setEditingValue(`${pad(hour)}:${pad(editingMinute())}:${pad(editingSecond())}`);
};

const applyShortcut = (shortcut: TimeShortcut): void => {
  const nextStart = normalizeTime(shortcut.value);
  const nextEnd = normalizeTime(shortcut.endValue || shortcut.value);
  start.set(nextStart);
  end.set(nextEnd);
  const next: TimePickerModelValue = rangeMode()
    ? [externalValue(nextStart), externalValue(nextEnd)]
    : externalValue(nextStart);
  ctl.setValue(next);
  if (rangeMode()) emit("update:endValue", externalValue(nextEnd));
  emitChange(next);
};

const shortcutItems = (): TimeShortcut[] => (Array.isArray(props.shortcuts) ? (props.shortcuts as TimeShortcut[]) : []);

const shortcutEntries = (): Array<{ item: TimeShortcut; index: number; key: string }> =>
  shortcutItems().map((item, index) => ({ item, index, key: `${index}-${item.label}` }));

const onShortcutClick = (event: Event): void => {
  const index = Number((event.currentTarget as HTMLElement).dataset.index ?? -1);
  const shortcut = shortcutItems()[index];
  if (shortcut) applyShortcut(shortcut);
};

const clear = (): void => {
  if (isDisabled() || props.readonly) return;
  const configured = props.valueOnClear;
  const next: TimePickerModelValue =
    typeof configured === "function"
      ? configured()
      : configured !== undefined
        ? configured
        : rangeMode()
          ? ["", ""]
          : "";
  if (Array.isArray(next)) {
    start.set(String(next[0] || ""));
    end.set(String(next[1] || ""));
  } else {
    start.set(String(next || ""));
    end.set("");
  }
  ctl.setValue(next);
  emit("update:endValue", Array.isArray(next) ? String(next[1] || "") : "");
  ctl.dispatchChange(next);
  emit("clear");
};

const hasValue = (): boolean => Boolean(start.value || end.value);

const handleOpen = (target: EditingTarget = "start"): void => {
  if (isDisabled() || props.readonly) return;
  editingTarget.set(target);
  activeUnit.set("hour");
  if (open.peek()) return;
  dismissibleOverlay.activate();
  open.set(true);
  emit("visible-change", true);
  queueMicrotask(syncPanelTopLayer);
};

const handleClose = (): void => {
  if (!open.peek()) return;
  const panel = getPanelEl() as (HTMLElement & { hidePopover?: () => void }) | null;
  try {
    if (props.teleported) panel?.hidePopover?.();
  } catch {
    // Rapid conditional rendering can disconnect an already closed popover.
  }
  dismissibleOverlay.deactivate();
  open.set(false);
  emit("visible-change", false);
};

const getPanelEl = (): HTMLElement | null => host.shadowRoot?.querySelector<HTMLElement>(".panel") ?? null;

const dismissibleOverlay = useDismissibleOverlay({
  kind: "time-picker",
  containers: () => [host, getPanelEl()],
  closeOnEscape: () => true,
  closeOnOutside: () => true,
  outsideEvent: "pointerdown",
  outsideCapture: true,
  onRequestClose: (reason) => {
    handleClose();
    if (reason === "escape") queueMicrotask(() => focusInput(editingTarget.peek()));
  },
});

const updatePanelPosition = (): void => {
  if (!props.teleported || !open.peek() || typeof window === "undefined") {
    panelStyle.set({ ...(props.popperStyle || {}) });
    return;
  }
  const trigger = host.shadowRoot?.querySelector<HTMLElement>(`.field-trigger[data-target="${editingTarget.peek()}"]`);
  const panel = getPanelEl();
  if (!trigger || !panel) return;

  const anchorRect = trigger.getBoundingClientRect();
  const panelRect = panel.getBoundingClientRect();
  const viewport = window.visualViewport;
  const width = Math.min(320, Math.max(240, (viewport?.width || window.innerWidth) - 16));
  const height = panelRect.height || panel.offsetHeight || 420;
  const options = props.popperOptions || {};
  const next = computeAnchoredPosition(
    anchorRect,
    { width, height },
    {
      width: viewport?.width || window.innerWidth,
      height: viewport?.height || window.innerHeight,
      offsetLeft: viewport?.offsetLeft || 0,
      offsetTop: viewport?.offsetTop || 0,
    },
    {
      placement: (options.placement || props.placement || "bottom-start") as TimePickerPlacement,
      offset: options.offset || [0, 8],
      padding: options.padding ?? 8,
      flip: options.flip ?? true,
      fallbackPlacements: options.fallbackPlacements || props.fallbackPlacements,
    },
  );
  panelStyle.set({
    position: "fixed",
    inset: "auto",
    left: `${Math.round(next.left)}px`,
    top: `${Math.round(next.top)}px`,
    width: `${Math.round(width)}px`,
    margin: "0",
    ...(props.popperStyle || {}),
  });
};

const requestPanelUpdate = (): void => {
  if (typeof window === "undefined") return;
  if (overlayFrame && typeof cancelAnimationFrame === "function") cancelAnimationFrame(overlayFrame);
  if (typeof requestAnimationFrame === "function") {
    overlayFrame = requestAnimationFrame(() => {
      overlayFrame = 0;
      updatePanelPosition();
    });
  } else {
    updatePanelPosition();
  }
};

const syncPanelTopLayer = (): void => {
  const panel = getPanelEl() as (HTMLElement & { showPopover?: () => void }) | null;
  if (!panel || !open.peek()) return;
  try {
    if (props.teleported) panel.showPopover?.();
  } catch {
    // A panel replaced during the same render cycle may already be in the top layer.
  }
  requestPanelUpdate();
};

let cleanupOverlayMotion = (): void => {};

const onTriggerClick = (event: Event): void => {
  const target = ((event.currentTarget as HTMLElement).dataset.target || "start") as EditingTarget;
  if (open.peek() && editingTarget.peek() === target) handleClose();
  else handleOpen(target);
};

const onFocus = (event: FocusEvent): void => {
  ctl.dispatchFocus(event);
};
const onBlur = (event: FocusEvent): void => {
  if (props.saveOnBlur) ctl.dispatchBlur(event);
  else emit("blur", event);
};

const adjustByKeyboard = (event: KeyboardEvent): void => {
  if (event.key !== "ArrowUp" && event.key !== "ArrowDown") return;
  event.preventDefault();
  const direction = event.key === "ArrowUp" ? 1 : -1;
  const total = editingHour() * 3600 + editingMinute() * 60 + editingSecond() + direction * Math.max(1, props.step);
  const normalized = (total + 24 * 3600) % (24 * 3600);
  setEditingValue(
    `${pad(Math.floor(normalized / 3600))}:${pad(Math.floor((normalized % 3600) / 60))}:${pad(normalized % 60)}`,
  );
};

const onTriggerKeydown = (event: KeyboardEvent): void => {
  if (["ArrowDown", "Enter", " "].includes(event.key) && !open.peek()) {
    event.preventDefault();
    handleOpen(((event.currentTarget as HTMLElement).dataset.target || "start") as EditingTarget);
    queueMicrotask(() => getPanelEl()?.querySelector<HTMLButtonElement>(".clock-number:not(:disabled)")?.focus());
    return;
  }
  if (event.key === "Escape") {
    event.preventDefault();
    if (dismissibleOverlay.claim(event)) handleClose();
    return;
  }
  adjustByKeyboard(event);
};

const onPanelKeydown = (event: KeyboardEvent): void => {
  if (event.key !== "Escape") return;
  event.preventDefault();
  if (dismissibleOverlay.claim(event)) {
    handleClose();
    queueMicrotask(() => focusInput(editingTarget.peek()));
  }
};

const focusInput = (target: EditingTarget = "start"): void => {
  host.shadowRoot?.querySelector<HTMLButtonElement>(`.field-trigger[data-target="${target}"]`)?.focus();
};

const blurInput = (): void => {
  host.shadowRoot?.querySelectorAll<HTMLButtonElement>(".field-trigger").forEach((field) => field.blur());
};

useHostAttr("size", resolvedSize);
useHostAttr("variant", () => normalizeFieldVariant(props.variant));
useHostFlag("disabled", isDisabled);
useHostFlag("data-open", () => open.value);
useHostFlag("data-dirty", hasValue);
useHostFlag("data-has-label", () => Boolean(props.label));
onMounted(() => {
  cleanupOverlayMotion = listenForExternalOverlayMotion(() => [getPanelEl()], handleClose);
  window.addEventListener("resize", requestPanelUpdate, { passive: true });
  window.visualViewport?.addEventListener("resize", requestPanelUpdate, { passive: true });
});
onBeforeUnmount(() => {
  cleanupOverlayMotion();
  window.removeEventListener("resize", requestPanelUpdate);
  window.visualViewport?.removeEventListener("resize", requestPanelUpdate);
  if (overlayFrame && typeof cancelAnimationFrame === "function") cancelAnimationFrame(overlayFrame);
});

const isEditingTarget = (target: EditingTarget): boolean => editingTarget.value === target;
const isActiveUnit = (unit: ClockUnit): boolean => activeUnit.value === unit;
const startValue = (): string => start.value;
const endValue = (): string => end.value;
const activeUnitLabel = (): string => {
  if (isActiveUnit("hour")) return locale.t("timePicker.selectHour");
  if (isActiveUnit("minute")) return locale.t("timePicker.selectMinute");
  return locale.t("timePicker.selectSecond");
};
const editingTargetLabel = (): string =>
  isEditingTarget("start") ? startPlaceholderText() : endPlaceholderText();

defineExpose({ focusInput, blurInput, handleOpen, handleClose });
defineStyle(styles);

const TimePicker = defineHtml(`
  <div :class=${["time-picker", { "is-disabled": isDisabled(), "is-open": open }]}>
    <div class="fields">
      <button
        type="button"
        class="field-trigger"
        :class=${{ "is-active": open && isEditingTarget("start"), "has-label": Boolean(props.label) }}
        data-target="start"
        :tabindex=${props.tabindex}
        :disabled=${isDisabled()}
        :aria-label=${props.ariaLabel || props.label || placeholderText()}
        :aria-expanded=${open && isEditingTarget("start") ? "true" : "false"}
        @click=${onTriggerClick}
        @focus=${onFocus}
        @blur=${onBlur}
        @keydown=${onTriggerKeydown}
      >
        <span v-if=${props.label} class="field-label">${props.label}</span>
        <elf-icon v-if=${props.prefixIcon} :name=${props.prefixIcon} aria-hidden="true"></elf-icon>
        <span v-else class="clock-icon" aria-hidden="true"></span>
        <span :class=${["field-value", { "is-placeholder": !startValue() }]}>
          ${startValue() ? displayValue(startValue()) : rangeMode() ? startPlaceholderText() : placeholderText()}
        </span>
      </button>
      <span v-if=${rangeMode()} class="separator">${rangeSeparatorText()}</span>
      <button
        v-if=${rangeMode()}
        type="button"
        class="field-trigger"
        :class=${{ "is-active": open && isEditingTarget("end") }}
        data-target="end"
        :tabindex=${props.tabindex}
        :disabled=${isDisabled()}
        :aria-label=${props.ariaLabel || endPlaceholderText()}
        :aria-expanded=${open && isEditingTarget("end") ? "true" : "false"}
        @click=${onTriggerClick}
        @focus=${onFocus}
        @blur=${onBlur}
        @keydown=${onTriggerKeydown}
      >
        <elf-icon v-if=${props.prefixIcon} :name=${props.prefixIcon} aria-hidden="true"></elf-icon>
        <span v-else class="clock-icon" aria-hidden="true"></span>
        <span :class=${["field-value", { "is-placeholder": !endValue() }]}
          >${endValue() ? displayValue(endValue()) : endPlaceholderText()}</span
        >
      </button>
      <button v-if=${props.clearable && hasValue()} type="button" class="clear" :aria-label=${locale.t("common.clear")} @click=${clear}>
        <elf-icon v-if=${props.clearIcon} :name=${props.clearIcon} aria-hidden="true"></elf-icon>
        <span v-else>${locale.t("common.clear")}</span>
      </button>
    </div>

    <div
      v-if=${open}
      :class=${["panel", props.popperClass]}
      :popover=${props.teleported ? "manual" : undefined}
      :style=${resolvedPanelStyle}
      @keydown=${onPanelKeydown}
    >
      <div :class=${["digital-header", { "has-seconds": showsSeconds() }]}>
        <button
          type="button"
          :class=${["digital-part", { "is-active": isActiveUnit("hour") }]}
          @click=${() => activeUnit.set("hour")}
        >
          ${String(editingHour()).padStart(2, "0")}
        </button>
        <span>:</span>
        <button
          type="button"
          :class=${["digital-part", { "is-active": isActiveUnit("minute") }]}
          @click=${() => activeUnit.set("minute")}
        >
          ${String(editingMinute()).padStart(2, "0")}
        </button>
        <template v-if=${showsSeconds()}>
          <span>:</span>
          <button
            type="button"
            :class=${["digital-part", { "is-active": isActiveUnit("second") }]}
            @click=${() => activeUnit.set("second")}
          >
            ${String(editingSecond()).padStart(2, "0")}
          </button>
        </template>
        <div class="period-switch">
          <button type="button" :class=${{ "is-active": period() === "AM" }} @click=${() => setPeriod("AM")}>AM</button>
          <button type="button" :class=${{ "is-active": period() === "PM" }} @click=${() => setPeriod("PM")}>PM</button>
        </div>
      </div>

      <div
        class="clock-face"
        :aria-label=${activeUnitLabel()}
      >
        <span class="clock-center"></span>
        <button
          v-for="item in clockItems()"
          :key="item.key"
          type="button"
          :class='["clock-number", { "is-active": item.active }]'
          :style="item.style"
          :data-clock-value="item.amount"
          :aria-pressed="item.active ? 'true' : 'false'"
          :disabled="item.disabled"
          @click=${selectClockValue}
        >
          <span>{{ item.label }}</span>
        </button>
      </div>

      <div v-if=${shortcutItems().length > 0} class="shortcuts">
        <button
          v-for="entry in shortcutEntries()"
          :key="entry.key"
          :data-index="entry.index"
          type="button"
          class="shortcut"
          @click=${onShortcutClick}
        >
          {{ entry.item.label }}
        </button>
      </div>

      <div class="panel-actions">
        <span>${editingTargetLabel()}</span>
        <button type="button" @click=${handleClose}>${locale.t("common.done")}</button>
      </div>
    </div>
  </div>
`);

export { TimePicker };
