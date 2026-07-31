// elf-pop-confirm — 气泡确认框

import {
  defineEmits,
  defineExpose,
  defineHtml,
  defineProps,
  defineStyle,
  onBeforeUnmount,
  onMounted,
  useEffect,
  useEventListener,
  useFocusTrap,
  useHost,
  useHostFlag,
  useRef,
  useTemplateRef,
} from "@elfui/core";

import styles from "./style.scss?inline";
import { collectFocusable, trapFocus } from "../../Common/focus/focus-scope";
import {
  computeAnchoredPosition,
  connectAnchoredOverlayLifecycle,
  readOverlayViewport,
} from "../../Common/overlay/anchored-overlay";
import { useDismissibleOverlay } from "../../../composables/useDismissibleOverlay";
import type {
  PopConfirmPlacement,
  PopConfirmProps,
  PopConfirmSlots,
  PopConfirmTrigger,
} from "./types";
import { useLocaleProvider } from "../../Providers/context";

export type {
  PopConfirmBeforeConfirm,
  PopConfirmElement,
  PopConfirmExpose,
  PopConfirmPlacement,
  PopConfirmProps,
  PopConfirmSlots,
  PopConfirmTrigger,
} from "./types";

const props = defineProps<PopConfirmProps>({
  title: { type: String, default: "" },
  content: { type: String, default: "" },
  confirmText: { type: String, default: "" },
  cancelText: { type: String, default: "" },
  placement: { type: String, default: "top" },
  trigger: { type: String, default: "click" },
  visible: { type: Boolean, default: undefined },
  width: { type: String, default: "260px" },
  disabled: { type: Boolean, default: false },
  closeOnEscape: { type: Boolean, default: true },
  closeOnClickOutside: { type: Boolean, default: true },
  teleported: { type: Boolean, default: true },
  beforeConfirm: { type: Function, default: undefined },
  loadingText: { type: String, default: "" },
});

const locale = useLocaleProvider();

const emit = defineEmits<{
  confirm: [];
  cancel: [];
  open: [];
  close: [];
  "confirm-error": [error: unknown];
  "update:visible": [visible: boolean];
}>();

const host = useHost();
const panelRef = useTemplateRef<HTMLElement>("panel");
const openState = useRef(false);
const rendered = useRef(false);
const confirming = useRef(false);
const overlayStyle = useRef<Record<string, string>>({});
const resolvedPlacement = useRef<PopConfirmPlacement>("top");

let previousActive: HTMLElement | null = null;
let activePanel: HTMLElement | null = null;
let cleanupAnchoredOverlay = (): void => {};
let overlayFrame = 0;
let mounted = false;

const isControlled = (): boolean => props.visible !== undefined;
const isOpen = (): boolean => (isControlled() ? Boolean(props.visible) : openState.value);
const trigger = (): PopConfirmTrigger =>
  props.trigger === "hover" || props.trigger === "focus" || props.trigger === "manual"
    ? props.trigger
    : "click";
const placement = (): PopConfirmPlacement =>
  props.placement === "bottom" || props.placement === "left" || props.placement === "right"
    ? props.placement
    : "top";

const getPanelEl = (): HTMLElement | null =>
  activePanel ||
  panelRef.peek() ||
  host.shadowRoot?.querySelector<HTMLElement>(".pop-confirm-popover") ||
  null;

const getTriggerEl = (): HTMLElement | null =>
  host.shadowRoot?.querySelector<HTMLElement>(".pop-confirm-trigger") || null;

const panelStyle = (): Record<string, string> => ({
  width: props.width,
  ...(props.teleported ? overlayStyle.value : {}),
});

const queryPanelFocusables = (panel = getPanelEl()): HTMLElement[] => {
  return panel ? collectFocusable(panel) : [];
};

const focusPanel = (panel: HTMLElement): void => {
  const first = queryPanelFocusables(panel)[0];
  (first || panel).focus();
};

/** Extends the Core host trap for a dynamic panel with slotted nested Shadow DOM actions. */
const onPanelKeydown = (event: KeyboardEvent): void => {
  const panel = getPanelEl();
  if (!panel || event.key !== "Tab") return;
  event.stopPropagation();
  trapFocus(event, panel);
};

const restoreFocus = (): void => {
  if (previousActive && typeof previousActive.focus === "function") {
    previousActive.focus();
  }
  previousActive = null;
};

const setOpen = (next: boolean): void => {
  if (props.disabled && next) return;
  if (isOpen() === next) return;
  if (!isControlled()) openState.set(next);
  emit("update:visible", next);
};

const show = (): void => setOpen(true);
const hide = (): void => {
  if (confirming.value) return;
  setOpen(false);
};
const toggle = (): void => setOpen(!isOpen());

const confirm = async (): Promise<void> => {
  if (confirming.peek()) return;
  if (props.beforeConfirm) {
    confirming.set(true);
    try {
      const result = await props.beforeConfirm();
      if (result === false) return;
    } catch (error) {
      emit("confirm-error", error);
      return;
    } finally {
      confirming.set(false);
    }
  }
  emit("confirm");
  hide();
};

const cancel = (): void => {
  if (confirming.value) return;
  emit("cancel");
  hide();
};

const dismissibleOverlay = useDismissibleOverlay({
  kind: "pop-confirm",
  containers: () => [host, getPanelEl()],
  closeOnEscape: () => props.closeOnEscape && trigger() !== "manual",
  closeOnOutside: () => props.closeOnClickOutside && trigger() !== "manual",
  onRequestClose: () => hide(),
});

const onClick = (event?: Event): void => {
  if (trigger() !== "click") return;
  event?.stopPropagation();
  toggle();
};

const onMouseEnter = (): void => {
  if (trigger() !== "hover") return;
  show();
};

const onMouseLeave = (): void => {
  if (trigger() !== "hover") return;
  hide();
};

const onFocusIn = (): void => {
  if (trigger() !== "focus") return;
  show();
};

const onFocusOut = (event: Event): void => {
  if (trigger() !== "focus") return;
  const next = (event as FocusEvent).relatedTarget as Node | null;
  if (next && (host.contains(next) || host.shadowRoot?.contains(next))) return;
  hide();
};

/** Limits delegated host events to trigger content and excludes named panel slots. */
const isTriggerEvent = (event: Event): boolean => {
  const target = event.target;
  if (!(target instanceof Node)) return false;
  return Array.from(host.children).some(
    (child) => !child.hasAttribute("slot") && (child === target || child.contains(target)),
  );
};

useEventListener(host, "click", (event) => {
  if (isTriggerEvent(event)) onClick(event);
});
useEventListener(host, "focusin", (event) => {
  if (isTriggerEvent(event)) onFocusIn();
});
useEventListener(host, "focusout", (event) => {
  if (isTriggerEvent(event)) onFocusOut(event);
});

const updateOverlayPosition = (): void => {
  if (!props.teleported || typeof window === "undefined") {
    overlayStyle.set({});
    resolvedPlacement.set(placement());
    return;
  }
  const triggerElement = getTriggerEl();
  const panel = getPanelEl();
  if (!triggerElement || !panel) return;
  const anchorRect = triggerElement.getBoundingClientRect();
  if (anchorRect.width === 0 && anchorRect.height === 0) return;
  const panelRect = panel.getBoundingClientRect();
  const next = computeAnchoredPosition(
    anchorRect,
    {
      width: panelRect.width || panel.offsetWidth || 260,
      height: panelRect.height || panel.offsetHeight || 120,
    },
    readOverlayViewport(),
    { placement: placement(), offset: [0, 12], padding: 8, flip: true },
  );
  resolvedPlacement.set(next.placement);
  overlayStyle.set({
    position: "fixed",
    left: `${Math.round(next.left * 100) / 100}px`,
    top: `${Math.round(next.top * 100) / 100}px`,
    right: "auto",
    bottom: "auto",
    margin: "0",
  });
};

const requestOverlayUpdate = (): void => {
  if (typeof window === "undefined") return;
  if (overlayFrame) cancelAnimationFrame(overlayFrame);
  overlayFrame = requestAnimationFrame(() => {
    overlayFrame = 0;
    updateOverlayPosition();
  });
};

const syncTopLayer = (element = getPanelEl()): void => {
  const panel = element as
    | (HTMLElement & {
        showPopover?: () => void;
        hidePopover?: () => void;
      })
    | null;
  if (!panel) return;
  try {
    if (props.teleported && rendered.peek()) panel.showPopover?.();
    else panel.hidePopover?.();
  } catch {
    // A conditional panel can disconnect while its top-layer state is settling.
  }
  if (rendered.peek()) requestOverlayUpdate();
};

const hideTopLayer = (element: Element): void => {
  try {
    (element as HTMLElement & { hidePopover?: () => void }).hidePopover?.();
  } catch {
    // Removing a disconnected popover is already equivalent to hiding it.
  }
};

const connectAnchoredOverlay = (panel = getPanelEl()): void => {
  cleanupAnchoredOverlay();
  if (!panel || !props.teleported || !rendered.peek() || typeof window === "undefined") return;
  const triggerElement = getTriggerEl();
  // A fixed top-layer panel must be re-anchored when an ancestor or the page
  // scrolls. Closing or leaving the old coordinates behind makes the panel
  // appear to drift with the document.
  cleanupAnchoredOverlay = connectAnchoredOverlayLifecycle({
    resizeTargets: [triggerElement, panel],
    motionContainers: () => [host, panel],
    onResize: requestOverlayUpdate,
    onExternalMotion: requestOverlayUpdate,
  });
  syncTopLayer(panel);
  requestOverlayUpdate();
};

useFocusTrap(host);

useEffect(() => {
  void props.teleported;
  void props.placement;
  void props.width;
  if (mounted && activePanel) connectAnchoredOverlay(activePanel);
});

/** Starts one popover transaction after Transition inserts the active panel. */
const onBeforeEnter = (element: Element): void => {
  const panel = element as HTMLElement;
  activePanel = panel;
  rendered.set(true);
  if (!previousActive) previousActive = document.activeElement as HTMLElement | null;
  if (!dismissibleOverlay.isActive()) dismissibleOverlay.activate();
  connectAnchoredOverlay(panel);
  focusPanel(panel);
  emit("open");
};

const onAfterEnter = (element: Element): void => {
  if (activePanel === element && isOpen()) requestOverlayUpdate();
};

const onBeforeLeave = (element: Element): void => {
  if (activePanel !== element) return;
  dismissibleOverlay.beginClose();
  emit("close");
};

/** Releases overlay, positioning, keyboard, and focus owners after the final leave. */
const onAfterLeave = (element: Element): void => {
  hideTopLayer(element);
  if (activePanel !== element || isOpen()) return;
  if (!dismissibleOverlay.completeClose()) dismissibleOverlay.deactivate();
  cleanupAnchoredOverlay();
  activePanel = null;
  rendered.set(false);
  restoreFocus();
};

onMounted(() => {
  mounted = true;
  connectAnchoredOverlay();
});

onBeforeUnmount(() => {
  mounted = false;
  if (activePanel) hideTopLayer(activePanel);
  activePanel = null;
  rendered.set(false);
  dismissibleOverlay.deactivate();
  cleanupAnchoredOverlay();
  if (overlayFrame) cancelAnimationFrame(overlayFrame);
  restoreFocus();
});

const popoverClass = (): string =>
  [
    "pop-confirm-popover",
    `placement-${props.teleported ? resolvedPlacement.value : placement()}`,
    props.teleported ? "is-teleported" : "",
  ]
    .filter(Boolean)
    .join(" ");

useHostFlag("data-open", () => isOpen());
useHostFlag("data-confirming", () => confirming.value);
useHostFlag("disabled", () => props.disabled);

defineExpose({ show, hide, toggle, confirm, cancel, isVisible: () => isOpen() });
defineStyle(styles);

const PopConfirm = defineHtml<PopConfirmProps, Record<string, never>, PopConfirmSlots>(`
    <div
        class="pop-confirm"
    >
        <span
            class="pop-confirm-trigger"
            part="trigger"
            @mouseenter=${onMouseEnter}
            @mouseleave=${onMouseLeave}
        >
            <slot></slot>
        </span>
        <Transition
            name="pop-confirm"
            appear
            @before-enter=${onBeforeEnter}
            @after-enter=${onAfterEnter}
            @before-leave=${onBeforeLeave}
            @after-leave=${onAfterLeave}
        >
            <section
                v-if=${isOpen()}
                ref="panel"
                :class=${popoverClass()}
                role="alertdialog"
                aria-modal="false"
                :aria-busy=${confirming}
                tabindex="-1"
                :style=${panelStyle()}
                :popover=${props.teleported ? "manual" : undefined}
                part="popover"
                @click.stop
                @keydown=${onPanelKeydown}
            >
                <span class="pop-confirm-arrow" part="arrow"></span>
                <div class="pop-confirm-body">
                    <slot name="content">
                        <strong class="pop-confirm-title" v-if=${props.title}>${props.title}</strong>
                        <span class="pop-confirm-content" v-if=${props.content}>${props.content}</span>
                    </slot>
                </div>
                <div class="pop-confirm-actions">
                    <slot name="actions" :confirm=${confirm} :cancel=${cancel} :loading=${confirming}>
                        <button
                            class="pop-confirm-action ghost"
                            type="button"
                            :disabled=${confirming}
                            @click=${cancel}
                        >
                            ${props.cancelText || locale.t("common.cancel")}
                        </button>
                        <button
                            class="pop-confirm-action primary"
                            type="button"
                            :disabled=${confirming}
                            @click=${confirm}
                        >
                            <span v-if=${confirming} class="pop-confirm-spinner" aria-hidden="true"></span>
                            ${confirming ? props.loadingText || locale.t("table.loading") : props.confirmText || locale.t("common.confirm")}
                        </button>
                    </slot>
                </div>
            </section>
        </Transition>
    </div>
`);

export { PopConfirm };
