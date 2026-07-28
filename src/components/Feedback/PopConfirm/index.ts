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
  useFocusTrap,
  useHost,
  useHostFlag,
  useRef,
  useTemplateRef
} from "@elfui/core";

import styles from "./style.scss?inline";
import { computeAnchoredPosition, listenForExternalOverlayMotion } from "../../Common/anchored-overlay";
import { useDismissibleOverlay } from "../../../composables/useDismissibleOverlay";
import type { PopConfirmPlacement, PopConfirmProps, PopConfirmSlots, PopConfirmTrigger } from "./types";
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
const closing = useRef(false);
const confirming = useRef(false);
const overlayStyle = useRef<Record<string, string>>({});
const resolvedPlacement = useRef<PopConfirmPlacement>("top");

let hideTimer: ReturnType<typeof setTimeout> | null = null;
let previousActive: HTMLElement | null = null;
let cleanupPanelKeydown = (): void => {};
let cleanupAnchoredOverlay = (): void => {};
let overlayFrame = 0;
let mounted = false;
const triggerElements = new Set<HTMLElement>();

const isControlled = (): boolean => props.visible !== undefined;
const isOpen = (): boolean => (isControlled() ? Boolean(props.visible) : openState.value);
const trigger = (): PopConfirmTrigger =>
    props.trigger === "hover" || props.trigger === "focus" || props.trigger === "manual" ? props.trigger : "click";
const placement = (): PopConfirmPlacement =>
    props.placement === "bottom" || props.placement === "left" || props.placement === "right" ? props.placement : "top";

const getPanelEl = (): HTMLElement | null =>
    panelRef.peek() || host.shadowRoot?.querySelector<HTMLElement>(".pop-confirm-popover") || null;

const getTriggerEl = (): HTMLElement | null => host.shadowRoot?.querySelector<HTMLElement>(".pop-confirm-trigger") || null;

const panelStyle = (): Record<string, string> => ({
    width: props.width,
    ...(props.teleported ? overlayStyle.value : {}),
});

const clearTimers = (): void => {
    if (hideTimer) clearTimeout(hideTimer);
    hideTimer = null;
};

const focusPanel = (): void => {
    let attempts = 0;
    const focusWhenReady = (): void => {
        const panel = panelRef.peek() || host.shadowRoot?.querySelector<HTMLElement>(".pop-confirm-popover") || null;
        if (!panel) {
            attempts += 1;
            if (attempts < 5) queueMicrotask(focusWhenReady);
            return;
        }
        bindPanelKeydown(panel);
        const first = queryPanelFocusables()[0];
        (first || panel).focus();
    };
    queueMicrotask(focusWhenReady);
};

const queryPanelFocusables = (): HTMLElement[] => {
    const panel = panelRef.peek() || host.shadowRoot?.querySelector<HTMLElement>(".pop-confirm-popover") || null;
    if (!panel) return [];
    const selector = "button:not([disabled]), [href], input:not([disabled]), [tabindex]:not([tabindex='-1'])";
    const actionSlot = panel.querySelector<HTMLSlotElement>('slot[name="actions"]');
    const assignedActions = actionSlot?.assignedElements({ flatten: true }) || [];
    const internal = Array.from(
        panel.querySelectorAll<HTMLElement>(
            selector,
        ),
    ).filter((element) => assignedActions.length === 0 || !element.closest('slot[name="actions"]'));
    const slotted = assignedActions.flatMap((element) => [
        ...(element.matches(selector) ? [element as HTMLElement] : []),
        ...Array.from(element.querySelectorAll<HTMLElement>(selector)),
    ]);
    return [...internal, ...slotted];
};

const onPanelKeydown = (event: KeyboardEvent): void => {
    if (event.key !== "Tab") return;
    const items = queryPanelFocusables();
    if (items.length === 0) return;
    const first = items[0]!;
    const last = items[items.length - 1]!;
    const active = host.shadowRoot?.activeElement || document.activeElement;
    if (event.shiftKey && active === first) {
        event.preventDefault();
        last.focus();
    } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
    }
};

const bindPanelKeydown = (panel: HTMLElement): void => {
    cleanupPanelKeydown();
    panel.addEventListener("keydown", onPanelKeydown);
    panel.onkeydown = onPanelKeydown;
    cleanupPanelKeydown = () => {
        panel.removeEventListener("keydown", onPanelKeydown);
        panel.onkeydown = null;
        cleanupPanelKeydown = (): void => {};
    };
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
    if (next) previousActive = document.activeElement as HTMLElement | null;
    if (!isControlled()) openState.set(next);
    emit("update:visible", next);
    emit(next ? "open" : "close");
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

const onClick = (event?: MouseEvent): void => {
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

const disconnectTriggerEvents = (): void => {
    for (const element of triggerElements) {
        element.removeEventListener("click", onClick);
        element.removeEventListener("mouseenter", onMouseEnter);
        element.removeEventListener("mouseleave", onMouseLeave);
        element.removeEventListener("focusin", onFocusIn);
        element.removeEventListener("focusout", onFocusOut);
    }
    triggerElements.clear();
};

const connectTriggerEvents = (): void => {
    disconnectTriggerEvents();
    for (const child of Array.from(host.children)) {
        if (!(child instanceof HTMLElement) || child.hasAttribute("slot")) continue;
        child.addEventListener("click", onClick);
        child.addEventListener("mouseenter", onMouseEnter);
        child.addEventListener("mouseleave", onMouseLeave);
        child.addEventListener("focusin", onFocusIn);
        child.addEventListener("focusout", onFocusOut);
        triggerElements.add(child);
    }
};

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
    const visualViewport = window.visualViewport;
    const next = computeAnchoredPosition(
        anchorRect,
        { width: panelRect.width || panel.offsetWidth || 260, height: panelRect.height || panel.offsetHeight || 120 },
        {
            width: visualViewport?.width || window.innerWidth,
            height: visualViewport?.height || window.innerHeight,
            offsetLeft: visualViewport?.offsetLeft || 0,
            offsetTop: visualViewport?.offsetTop || 0,
        },
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

const syncTopLayer = (): void => {
    const panel = getPanelEl() as (HTMLElement & {
        showPopover?: () => void;
        hidePopover?: () => void;
    }) | null;
    if (!panel) return;
    try {
        if (props.teleported && rendered.peek()) panel.showPopover?.();
        else panel.hidePopover?.();
    } catch {
        // A conditional panel can disconnect while its top-layer state is settling.
    }
    if (rendered.peek()) requestOverlayUpdate();
};

const connectAnchoredOverlay = (): void => {
    cleanupAnchoredOverlay();
    if (!props.teleported || !rendered.peek() || typeof window === "undefined") return;
    const triggerElement = getTriggerEl();
    const panel = getPanelEl();
    const observer = typeof ResizeObserver !== "undefined" ? new ResizeObserver(requestOverlayUpdate) : undefined;
    if (triggerElement) observer?.observe(triggerElement);
    if (panel) observer?.observe(panel);
    // A fixed top-layer panel must be re-anchored when an ancestor or the page
    // scrolls. Closing or leaving the old coordinates behind makes the panel
    // appear to drift with the document.
    const cleanupMotion = listenForExternalOverlayMotion(
        () => [host, panel],
        requestOverlayUpdate,
    );
    window.addEventListener("resize", requestOverlayUpdate, { passive: true });
    window.visualViewport?.addEventListener("resize", requestOverlayUpdate, { passive: true });
    cleanupAnchoredOverlay = () => {
        observer?.disconnect();
        cleanupMotion();
        window.removeEventListener("resize", requestOverlayUpdate);
        window.visualViewport?.removeEventListener("resize", requestOverlayUpdate);
    };
    syncTopLayer();
    requestOverlayUpdate();
};

useFocusTrap(host);

useEffect(() => {
    if (isOpen()) {
        if (!dismissibleOverlay.isActive()) dismissibleOverlay.activate();
        clearTimers();
        if (!rendered.peek()) rendered.set(true);
        closing.set(false);
        focusPanel();
        return;
    }

    dismissibleOverlay.deactivate();
    if (!rendered.peek() || closing.peek()) return;
    closing.set(true);
    hideTimer = setTimeout(() => {
        rendered.set(false);
        closing.set(false);
        cleanupPanelKeydown();
        clearTimers();
        restoreFocus();
    }, 140);
});

useEffect(() => {
    void rendered.value;
    void props.teleported;
    void props.placement;
    void props.width;
    if (mounted) queueMicrotask(() => {
        syncTopLayer();
        connectAnchoredOverlay();
    });
});

onMounted(() => {
    mounted = true;
    connectTriggerEvents();
    connectAnchoredOverlay();
});

onBeforeUnmount(() => {
    mounted = false;
    disconnectTriggerEvents();
    clearTimers();
    cleanupPanelKeydown();
    cleanupAnchoredOverlay();
    if (overlayFrame) cancelAnimationFrame(overlayFrame);
    restoreFocus();
});

const popoverClass = (): string =>
    [
        "pop-confirm-popover",
        `placement-${props.teleported ? resolvedPlacement.value : placement()}`,
        props.teleported ? "is-teleported" : "",
        closing.value ? "is-closing" : "is-open",
    ].filter(Boolean).join(" ");

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
            @click.stop=${onClick}
            @mouseenter=${onMouseEnter}
            @mouseleave=${onMouseLeave}
            @focusin=${onFocusIn}
            @focusout=${onFocusOut}
        >
            <slot @slotchange=${connectTriggerEvents}></slot>
        </span>
        <section
            v-if=${rendered}
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
                        @keydown=${onPanelKeydown}
                    >
                        ${props.cancelText || locale.t("common.cancel")}
                    </button>
                    <button
                        class="pop-confirm-action primary"
                        type="button"
                        :disabled=${confirming}
                        @click=${confirm}
                        @keydown=${onPanelKeydown}
                    >
                        <span v-if=${confirming} class="pop-confirm-spinner" aria-hidden="true"></span>
                        ${confirming ? (props.loadingText || locale.t("table.loading")) : (props.confirmText || locale.t("common.confirm"))}
                    </button>
                </slot>
            </div>
        </section>
    </div>
`);

export { PopConfirm };
