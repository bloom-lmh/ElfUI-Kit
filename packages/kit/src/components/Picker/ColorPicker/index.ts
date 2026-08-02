import {
  defineEmits,
  defineExpose,
  defineHtml,
  defineProps,
  defineStyle,
  onBeforeUnmount,
  useComputed,
  useEffect,
  useHost,
  useHostAttr,
  useHostFlag,
  useRef,
} from "@elfui/core";

import styles from "./style.scss?inline";
import { useDisabled, useFormControl, useSize } from "../../../composables";
import {
  computeAnchoredPosition,
  connectAnchoredOverlayLifecycle,
} from "../../Common/overlay/anchored-overlay";
import { useLocaleProvider } from "../../Providers/context";
import { normalizeFieldVariant } from "../../../types/field";
import { useDismissibleOverlay } from "../../../composables/useDismissibleOverlay";
import { useFieldValueDefaults } from "../../../composables/field-values";
import {
  formatColorValue,
  normalizeColorHex,
  normalizeColorPresets,
  parseColorAlpha,
  resolveColorFormat,
} from "./model";
import type { ColorFormat, ColorPickerProps, ColorPreset } from "./types";

export type {
  ColorFormat,
  ColorPickerElement,
  ColorPickerExpose,
  ColorPickerProps,
  ColorPickerVariant,
  ColorPreset,
} from "./types";

const props = defineProps<ColorPickerProps>({
  modelValue: { type: String, default: "#6750a4" },
  format: { type: String, default: "hex" },
  colorFormat: { type: String, default: "" },
  variant: { type: String, default: "filled" },
  label: { type: String, default: "" },
  presets: { type: Array, default: () => [] },
  predefine: { type: Array, default: () => [] },
  showAlpha: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  clearable: { type: Boolean, default: false },
  size: { type: String, default: "" },
  tabindex: { type: null, default: 0 },
  id: { type: String, default: "" },
  name: { type: String, default: "" },
  ariaLabel: { type: String, default: "Select color" },
  valueOnClear: { type: null, default: undefined },
  emptyValues: { type: Array, default: undefined },
  validateEvent: { type: Boolean, default: true },
  teleported: { type: Boolean, default: true },
  persistent: { type: Boolean, default: false },
  popperClass: { type: String, default: "" },
  popperStyle: { type: Object, default: () => ({}) },
  appendTo: { type: null, default: null },
  hueSliderClass: { type: String, default: "" },
  hueSliderStyle: { type: Object, default: () => ({}) },
  border: { type: Boolean, default: true },
});

const emit = defineEmits<{
  "update:modelValue": [value: string];
  input: [value: string];
  change: [value: string];
  clear: [];
  "active-change": [value: string];
  focus: [event: FocusEvent];
  blur: [event: FocusEvent];
  "visible-change": [visible: boolean];
}>();
const fieldValues = useFieldValueDefaults();

const ctl = useFormControl<string>(props, emit, {
  ...(props.validateEvent === false
    ? { triggers: { input: false, change: false, blur: false } }
    : {}),
});
const isDisabled = useDisabled(() => Boolean(props.disabled));
const resolvedSize = useSize(() => props.size);
const host = useHost();
const locale = useLocaleProvider();

const color = useRef("#6750a4");

const alpha = useRef(100);
const open = useRef(false);
const panelStyle = useRef<Record<string, string>>({});
let activePanel: HTMLElement | null = null;
let cleanupAnchoredOverlay = (): void => {};
let focusPanelAfterEnter = false;
let restoreFocusAfterLeave = false;
let overlayFrame = 0;

interface PanelPortalLease {
  host: HTMLElement;
  origin: { parent: Node; next: Node | null };
  panel: HTMLElement;
  root: ShadowRoot;
}

const panelPortals = new WeakMap<HTMLElement, PanelPortalLease>();
const portalLeases = new Set<PanelPortalLease>();

const resolvedFormat = (): ColorFormat => resolveColorFormat(props.colorFormat, props.format);
const resolvedPanelStyle = useComputed((): Record<string, string> => ({
  ...(props.popperStyle || {}),
  ...panelStyle.value,
}));
const isEmptyValue = (value: unknown): boolean => fieldValues.isEmpty(value, props.emptyValues);

const outputValue = (): string =>
  formatColorValue({
    color: color.value,
    format: resolvedFormat(),
    alpha: alpha.value,
    showAlpha: Boolean(props.showAlpha),
  });

useEffect(() => {
  const raw = isEmptyValue(props.modelValue) ? "" : String(props.modelValue ?? "").trim();
  if (!raw) {
    color.set("");
    return;
  }
  const next = normalizeColorHex(raw);
  if (next) color.set(next);
  const nextAlpha = parseColorAlpha(raw);
  if (nextAlpha !== null) alpha.set(nextAlpha);
});

const commit = (next: string): void => {
  if (isDisabled()) return;
  if (!String(next || "").trim()) {
    clear();
    return;
  }
  const normalized = normalizeColorHex(next);
  if (!normalized) return;
  color.set(normalized);
  const value = outputValue();
  ctl.dispatchInput(value);
  ctl.dispatchChange(value);
  emit("active-change", value);
};

const onNative = (event: Event): void => commit((event.target as HTMLInputElement).value);

const onText = (event: Event): void => commit((event.target as HTMLInputElement).value);

const onAlpha = (event: Event): void => {
  alpha.set(Number((event.target as HTMLInputElement).value) || 100);
  const value = outputValue();
  ctl.dispatchInput(value);
  ctl.dispatchChange(value);
  emit("active-change", value);
};

const clear = (): void => {
  if (isDisabled()) return;
  const next = fieldValues.valueOnClear<string>(props.valueOnClear, () => "");
  color.set(normalizeColorHex(next) || "");
  ctl.dispatchInput(next);
  ctl.dispatchChange(next);
  emit("clear");
};

const presets = useComputed(() => normalizeColorPresets(props.predefine, props.presets));
const presetItems = (): ColorPreset[] => presets.value;

const onPresetClick = (event: Event): void => {
  const index = Number((event.currentTarget as HTMLElement).dataset.index);
  const preset = presetItems()[index];
  if (preset) commit(preset.value);
};

const presetStyle = (preset: ColorPreset): Record<string, string> => ({
  background: normalizeColorHex(preset.value) || "transparent",
});

const nativeColorValue = (): string => normalizeColorHex(color.value) || "#6750a4";

const getPanel = (): HTMLElement | null =>
  activePanel ?? host.shadowRoot?.querySelector<HTMLElement>(".panel") ?? null;

const resolveAppendTarget = (): HTMLElement | null => {
  if (props.appendTo instanceof HTMLElement) return props.appendTo;
  if (typeof props.appendTo !== "string" || !props.appendTo.trim()) return null;
  const selector = props.appendTo.trim();
  const localRoot = host.getRootNode() as Document | ShadowRoot;
  return (
    localRoot.querySelector<HTMLElement>(selector) ?? document.querySelector<HTMLElement>(selector)
  );
};

const usesTopLayer = (): boolean => Boolean(props.teleported || resolveAppendTarget());

const mountPanelPortal = (panel: HTMLElement): void => {
  const target = resolveAppendTarget();
  if (!target || target === host || host.contains(target) || panelPortals.has(panel)) return;
  const parent = panel.parentNode;
  if (!parent) return;
  const portalHost = document.createElement("div");
  portalHost.dataset.elfColorPickerPortal = "";
  portalHost.style.display = "contents";
  const portalRoot = portalHost.attachShadow({ mode: "open" });
  const style = document.createElement("style");
  style.textContent = styles;
  const lease: PanelPortalLease = {
    host: portalHost,
    origin: { parent, next: panel.nextSibling },
    panel,
    root: portalRoot,
  };
  panelPortals.set(panel, lease);
  portalLeases.add(lease);
  portalRoot.append(style, panel);
  target.appendChild(portalHost);
};

/** Restores only the portal owned by the supplied panel root. */
const restorePanelPortal = (panel: HTMLElement): void => {
  const lease = panelPortals.get(panel);
  if (!lease) return;
  const { parent, next } = lease.origin;
  if (parent.isConnected) {
    parent.insertBefore(panel, next?.parentNode === parent ? next : null);
  }
  lease.host.remove();
  panelPortals.delete(panel);
  portalLeases.delete(lease);
};

const updatePanelPosition = (): void => {
  if (!usesTopLayer() || !open.peek() || typeof window === "undefined") {
    panelStyle.set({ ...(props.popperStyle || {}) });
    return;
  }
  const trigger = host.shadowRoot?.querySelector<HTMLElement>(".trigger");
  const panel = getPanel();
  if (!trigger || !panel) return;
  const viewport = window.visualViewport;
  const width = Math.min(304, Math.max(240, (viewport?.width || window.innerWidth) - 16));
  const panelRect = panel.getBoundingClientRect();
  const next = computeAnchoredPosition(
    trigger.getBoundingClientRect(),
    { width, height: panelRect.height || panel.offsetHeight || 250 },
    {
      width: viewport?.width || window.innerWidth,
      height: viewport?.height || window.innerHeight,
      offsetLeft: viewport?.offsetLeft || 0,
      offsetTop: viewport?.offsetTop || 0,
    },
    { placement: "bottom-start", offset: [0, 8], padding: 8, flip: true },
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
  if (!open.peek()) return;
  if (typeof requestAnimationFrame !== "function") {
    updatePanelPosition();
    return;
  }
  if (overlayFrame) cancelAnimationFrame(overlayFrame);
  overlayFrame = requestAnimationFrame(() => {
    overlayFrame = 0;
    updatePanelPosition();
  });
};

const show = (): void => {
  if (isDisabled() || open.peek()) return;
  restoreFocusAfterLeave = false;
  open.set(true);
  emit("visible-change", true);
};

const hide = (): void => {
  if (!open.peek()) return;
  open.set(false);
  emit("visible-change", false);
};

const toggle = (): void => (open.peek() ? hide() : show());

const dismissibleOverlay = useDismissibleOverlay({
  kind: "color-picker",
  containers: () => [host, getPanel()],
  closeOnEscape: () => true,
  closeOnOutside: () => !props.persistent,
  outsideEvent: "pointerdown",
  outsideCapture: true,
  onRequestClose: (reason) => {
    restoreFocusAfterLeave = reason === "escape";
    hide();
  },
});

const focusInput = (): void => host.shadowRoot?.querySelector<HTMLInputElement>(".value")?.focus();
const blurInput = (): void => host.shadowRoot?.querySelector<HTMLInputElement>(".value")?.blur();

const onTriggerKeydown = (event: KeyboardEvent): void => {
  if (["Enter", " ", "ArrowDown"].includes(event.key)) {
    event.preventDefault();
    focusPanelAfterEnter = true;
    show();
  } else if (event.key === "Escape") {
    event.preventDefault();
    if (dismissibleOverlay.claim(event)) hide();
  }
};

const onPanelKeydown = (event: KeyboardEvent): void => {
  if (event.key !== "Escape") return;
  event.preventDefault();
  if (dismissibleOverlay.claim(event)) {
    restoreFocusAfterLeave = true;
    hide();
  }
};

const onPresetKeydown = (event: KeyboardEvent): void => {
  if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
  event.preventDefault();
  const buttons = Array.from(getPanel()?.querySelectorAll<HTMLButtonElement>(".preset") ?? []);
  const index = buttons.indexOf(event.currentTarget as HTMLButtonElement);
  if (index < 0 || buttons.length === 0) return;
  buttons[
    (index + (event.key === "ArrowRight" ? 1 : -1) + buttons.length) % buttons.length
  ]?.focus();
};

const onFocus = (event: FocusEvent): void => ctl.dispatchFocus(event);
const onBlur = (event: FocusEvent): void => ctl.dispatchBlur(event);

useHostAttr("variant", () => normalizeFieldVariant(props.variant));
useHostAttr("size", resolvedSize);
useHostFlag("disabled", isDisabled);
useHostFlag("data-border", () => Boolean(props.border));
useHostFlag("data-dirty", () => Boolean(color.value));
useHostFlag("data-has-label", () => Boolean(props.label));
useHostFlag("data-open", () => open.value);

const showPanelTopLayer = (panel: HTMLElement): void => {
  if (!usesTopLayer() || !open.peek()) return;
  try {
    (panel as HTMLElement & { showPopover?: () => void }).showPopover?.();
  } catch {
    // A replacement root may already be promoted during rapid reopen.
  }
};

const hidePanelTopLayer = (panel: HTMLElement): void => {
  try {
    (panel as HTMLElement & { hidePopover?: () => void }).hidePopover?.();
  } catch {
    // A disconnected native popover is already equivalent to a hidden panel.
  }
};

/** Owns positioning listeners for exactly one inserted panel transaction. */
const connectPanelOverlay = (panel: HTMLElement): void => {
  cleanupAnchoredOverlay();
  if (!usesTopLayer() || !open.peek()) return;
  const trigger = host.shadowRoot?.querySelector<HTMLElement>(".trigger") ?? null;
  cleanupAnchoredOverlay = connectAnchoredOverlayLifecycle({
    resizeTargets: [trigger, panel],
    motionContainers: () => [host, panel],
    onResize: requestPanelUpdate,
    onExternalMotion: hide,
  });
  requestPanelUpdate();
};

/** Starts one dismissible, portal, and positioning transaction for a panel root. */
const onBeforeEnter = (element: Element): void => {
  const panel = element as HTMLElement;
  activePanel = panel;
  mountPanelPortal(panel);
  if (!dismissibleOverlay.isActive()) dismissibleOverlay.activate();
  showPanelTopLayer(panel);
  connectPanelOverlay(panel);
};

const onAfterEnter = (element: Element): void => {
  if (activePanel !== element || !open.peek()) return;
  requestPanelUpdate();
  if (!focusPanelAfterEnter) return;
  focusPanelAfterEnter = false;
  (element as HTMLElement).querySelector<HTMLElement>(".native")?.focus();
};

/** Releases active input resources while Core retains the visual leave root. */
const onBeforeLeave = (element: Element): void => {
  if (activePanel !== element) return;
  dismissibleOverlay.beginClose();
  cleanupAnchoredOverlay();
};

/** Finalizes only this root so a stale leave cannot dismantle a rapid reopen. */
const onAfterLeave = (element: Element): void => {
  const panel = element as HTMLElement;
  hidePanelTopLayer(panel);
  restorePanelPortal(panel);
  if (activePanel !== panel || open.peek()) return;
  if (!dismissibleOverlay.completeClose()) dismissibleOverlay.deactivate();
  activePanel = null;
  panelStyle.set({});
  focusPanelAfterEnter = false;
  if (restoreFocusAfterLeave) focusInput();
  restoreFocusAfterLeave = false;
};

useEffect(() => {
  void open.value;
  void props.teleported;
  void props.appendTo;
  void props.popperStyle;
  if (!activePanel || !open.value) return;
  showPanelTopLayer(activePanel);
  connectPanelOverlay(activePanel);
});

onBeforeUnmount(() => {
  cleanupAnchoredOverlay();
  dismissibleOverlay.deactivate();
  if (overlayFrame && typeof cancelAnimationFrame === "function")
    cancelAnimationFrame(overlayFrame);
  for (const lease of [...portalLeases]) {
    hidePanelTopLayer(lease.panel);
    restorePanelPortal(lease.panel);
  }
  activePanel = null;
});

defineExpose({
  show,
  hide,
  focusInput,
  blurInput,
  update: commit,
  get inputRef() {
    return host.shadowRoot?.querySelector<HTMLInputElement>(".value") ?? null;
  },
});

defineStyle(styles);

const ColorPicker = defineHtml(`
    <div :class=${["color-picker", { "is-disabled": isDisabled(), "is-open": open }]}>
        <div class="trigger">
            <fieldset class="field-outline" aria-hidden="true">
                <legend><span>${props.label}</span></legend>
            </fieldset>
            <span v-if=${props.label} class="field-label">${props.label}</span>
            <button
                type="button"
                class="open-button"
                :aria-label=${props.ariaLabel}
                :aria-expanded=${open ? "true" : "false"}
                :tabindex=${props.tabindex}
                :disabled=${isDisabled()}
                @click=${toggle}
                @keydown=${onTriggerKeydown}
            >
                <slot name="color">
                    <span class="swatch" aria-hidden="true"
                        ><span class="swatch-fill" :style=${{ background: outputValue() || "transparent" }}></span
                    ></span>
                </slot>
            </button>
            <input
                class="value"
                :id=${props.id}
                :name=${props.name}
                :value.prop=${outputValue()}
                :disabled=${isDisabled()}
                :aria-label=${props.ariaLabel}
                @change=${onText}
                @focus=${onFocus}
                @blur=${onBlur}
                @keydown=${onTriggerKeydown}
            />
            <button v-if=${props.clearable && outputValue()} class="clear" type="button" aria-label="Clear color" @click=${clear}>
                <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false"><path d="M4 4l8 8M12 4l-8 8"></path></svg>
            </button>
        </div>

        <Transition
            name="color-picker-panel"
            appear
            @before-enter=${onBeforeEnter}
            @after-enter=${onAfterEnter}
            @before-leave=${onBeforeLeave}
            @after-leave=${onAfterLeave}
        >
            <div
                v-if=${open}
                :class=${["panel", props.popperClass]}
                :popover=${usesTopLayer() ? "manual" : undefined}
                :style=${resolvedPanelStyle}
                role="dialog"
                :aria-label=${props.ariaLabel}
                @keydown=${onPanelKeydown}
            >
            <div class="panel-color-row">
                <input
                    :class=${["native", props.hueSliderClass]}
                    :style=${props.hueSliderStyle}
                    type="color"
                    :value.prop=${nativeColorValue()}
                    :disabled=${isDisabled()}
                    :aria-label=${props.ariaLabel}
                    @input=${onNative}
                />
                <div>
                    <strong>${outputValue() || "—"}</strong>
                    <small>${resolvedFormat() === "rgb" ? "RGB" : "HEX"}</small>
                </div>
            </div>

            <label v-if=${props.showAlpha} class="alpha-row">
                <span>Alpha</span>
                <input
                    class="alpha"
                    type="range"
                    min="0"
                    max="100"
                    :value.prop=${alpha}
                    @input=${onAlpha}
                />
                <output>${alpha}%</output>
            </label>

            <div v-if=${presetItems().length > 0} class="presets" role="group" aria-label="Preset colors">
                <button
                    v-for="(item, index) in presetItems()"
                    :key="item.value"
                    type="button"
                    class="preset"
                    :data-index="index"
                    :aria-label="item.label"
                    :title="item.label"
                    :style="presetStyle(item)"
                    @click=${onPresetClick}
                    @keydown=${onPresetKeydown}
                ></button>
            </div>

                <div class="panel-footer">
                    <slot name="footer"><span>${resolvedFormat() === "rgb" ? "RGB / RGBA" : "HEX"}</span></slot>
                    <button type="button" @click=${hide}>${locale.t("common.done")}</button>
                </div>
            </div>
        </Transition>
    </div>
`);

export { ColorPicker };
