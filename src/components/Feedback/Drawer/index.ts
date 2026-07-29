// elf-drawer

import {
  defineEmits,
  defineExpose,
  defineModel,
  defineProps,
  defineStyle,
  globalStyle,
  onBeforeUnmount,
  projectLightDom,
  useEffect,
  useHost,
  useHostAttr,
  useRef,
  defineHtml
} from "@elfui/core";

import styles from "./style.scss?inline";
import { useLocaleProvider } from "../../Providers/context";
import { useModalOverlay } from "../../../composables/useModalOverlay";
import type { OverlayCloseReason } from "../../Common/overlay/overlay-protocol";
import type { DrawerDirection, DrawerEmits, DrawerExpose, DrawerProps, DrawerResizeDetail, DrawerSlots } from "./types";

export type { DrawerDirection, DrawerElement, DrawerEmits, DrawerExpose, DrawerProps, DrawerResizeDetail, DrawerSlots } from "./types";

globalStyle(styles);

const props = defineProps<DrawerProps>({
    title: { type: String, default: "" },
    direction: { type: String, default: "rtl" },
    size: { type: String, default: "30%" },
    resizable: { type: Boolean, default: false },
    minSize: { type: null, default: 160 },
    maxSize: { type: null, default: "90%" },
    modal: { type: Boolean, default: true },
    closeOnMask: { type: Boolean, default: true },
    closeOnEscape: { type: Boolean, default: true },
    closable: { type: Boolean, default: true },
    lockScroll: { type: Boolean, default: true },
    beforeClose: { type: Function, default: null },
});

const emit = defineEmits<DrawerEmits>();
const model = defineModel<boolean>("open", { default: false });
const locale = useLocaleProvider();

const nextId = (): string => {
    const store = globalThis as typeof globalThis & {
        __elfDrawerIdSeed?: number;
    };
    store.__elfDrawerIdSeed = (store.__elfDrawerIdSeed ?? 0) + 1;
    return `elf-drawer-${store.__elfDrawerIdSeed}`;
};

const host = useHost();
const id = nextId();
const titleId = `${id}-title`;
const rendered = useRef(false);
const closing = useRef(false);
const maskClosing = useRef(false);
const resizedSize = useRef<number | null>(null);
let panelTimer: number | null = null;
let resizeStartCoordinate = 0;
let resizeStartSize = 0;
let previousBodyCursor = "";
let previousBodyUserSelect = "";
let resizing = false;
let suppressMaskClick = false;
let suppressMaskClickTimer: number | null = null;
const PANEL_LEAVE_MS = 240;

const rootSelector = `[data-elf-drawer="${id}"]`;
const projection = projectLightDom(host, {
    defaultTarget: () => document.querySelector(rootSelector)?.querySelector(".elf-drawer-body"),
    slots: {
        header: () => document.querySelector(rootSelector)?.querySelector(".elf-drawer-header-content"),
        footer: () => document.querySelector(rootSelector)?.querySelector(".elf-drawer-footer")
    }
});

const panelClass = (): string => {
    const direction = String(props.direction || "rtl");
    return `elf-drawer-panel drawer ${direction}`;
};

const maskClass = (): Record<string, boolean> => ({
    closing: closing.value,
    "mask-closing": maskClosing.value,
    "no-modal": !props.modal,
});

const panelStyle = (): Record<string, string> => {
    const direction = String(props.direction || "rtl");
    const key = direction === "ltr" || direction === "rtl" ? "width" : "height";
    return { [key]: resizedSize.value === null ? String(props.size || "30%") : `${resizedSize.value}px` };
};

const isHorizontal = (): boolean => props.direction === "ltr" || props.direction === "rtl";

const constraintPixels = (value: number | string | undefined, fallback: number): number => {
    if (typeof value === "number" && Number.isFinite(value)) return value;
    const text = String(value ?? "").trim();
    const numeric = Number.parseFloat(text);
    if (!Number.isFinite(numeric)) return fallback;
    const viewport = isHorizontal() ? window.innerWidth : window.innerHeight;
    if (text.endsWith("%")) return (viewport * numeric) / 100;
    if (text.endsWith("vw")) return (window.innerWidth * numeric) / 100;
    if (text.endsWith("vh")) return (window.innerHeight * numeric) / 100;
    return numeric;
};

const resizeBounds = (): { min: number; max: number } => {
    const viewport = isHorizontal() ? window.innerWidth : window.innerHeight;
    const min = Math.max(80, constraintPixels(props.minSize, 160));
    const max = Math.max(min, constraintPixels(props.maxSize, viewport * 0.9));
    return { min, max };
};

const clampSize = (size: number): number => {
    const { min, max } = resizeBounds();
    return Math.round(Math.min(max, Math.max(min, size)));
};

const resizeDetail = (size: number): DrawerResizeDetail => ({
    direction: (props.direction || "rtl") as DrawerDirection,
    size
});

const coordinateFromEvent = (event: PointerEvent): number =>
    isHorizontal() ? event.clientX : event.clientY;

const resizeDelta = (coordinate: number): number => {
    const delta = coordinate - resizeStartCoordinate;
    return props.direction === "rtl" || props.direction === "btt" ? -delta : delta;
};

const stopResize = (event?: PointerEvent): void => {
    const wasResizing = resizing;
    resizing = false;
    document.removeEventListener("pointermove", onResizeMove);
    document.removeEventListener("pointerup", stopResize);
    document.removeEventListener("pointercancel", stopResize);
    document.body.style.cursor = previousBodyCursor;
    document.body.style.userSelect = previousBodyUserSelect;
    if (resizedSize.peek() !== null) emit("resize-end", resizeDetail(resizedSize.peek()!));
    if (wasResizing) {
        suppressMaskClick = true;
        if (suppressMaskClickTimer !== null) window.clearTimeout(suppressMaskClickTimer);
        suppressMaskClickTimer = window.setTimeout(() => {
            suppressMaskClick = false;
            suppressMaskClickTimer = null;
        }, 0);
    }
    event?.preventDefault();
};

const onResizeMove = (event: PointerEvent): void => {
    const size = clampSize(resizeStartSize + resizeDelta(coordinateFromEvent(event)));
    resizedSize.set(size);
    emit("resize", resizeDetail(size));
    event.preventDefault();
};

const onResizeStart = (event: PointerEvent): void => {
    if (!props.resizable || event.button !== 0) return;
    const panel = panelElement();
    if (!panel) return;
    resizeStartCoordinate = coordinateFromEvent(event);
    resizeStartSize = isHorizontal() ? panel.getBoundingClientRect().width : panel.getBoundingClientRect().height;
    const size = clampSize(resizeStartSize);
    resizing = true;
    resizedSize.set(size);
    previousBodyCursor = document.body.style.cursor;
    previousBodyUserSelect = document.body.style.userSelect;
    document.body.style.cursor = isHorizontal() ? "col-resize" : "row-resize";
    document.body.style.userSelect = "none";
    document.addEventListener("pointermove", onResizeMove);
    document.addEventListener("pointerup", stopResize);
    document.addEventListener("pointercancel", stopResize);
    emit("resize-start", resizeDetail(size));
    event.preventDefault();
    event.stopPropagation();
};

const changeSizeByKeyboard = (event: KeyboardEvent): void => {
    if (!props.resizable) return;
    const panel = panelElement();
    if (!panel) return;
    const current = resizedSize.peek() ?? (isHorizontal() ? panel.getBoundingClientRect().width : panel.getBoundingClientRect().height);
    const { min, max } = resizeBounds();
    let next = current;
    if (event.key === "Home") next = min;
    else if (event.key === "End") next = max;
    else if (isHorizontal() && (event.key === "ArrowLeft" || event.key === "ArrowRight")) {
        const physicalDelta = event.key === "ArrowRight" ? 10 : -10;
        next += props.direction === "rtl" ? -physicalDelta : physicalDelta;
    } else if (!isHorizontal() && (event.key === "ArrowUp" || event.key === "ArrowDown")) {
        const physicalDelta = event.key === "ArrowDown" ? 10 : -10;
        next += props.direction === "btt" ? -physicalDelta : physicalDelta;
    } else return;
    const size = clampSize(next);
    resizedSize.set(size);
    emit("resize-start", resizeDetail(current));
    emit("resize", resizeDetail(size));
    emit("resize-end", resizeDetail(size));
    event.preventDefault();
};

const resetSize = (): void => resizedSize.set(null);
const currentResizedSize = (): number | null => resizedSize.value;

const cleanupTimer = (): void => {
    if (panelTimer !== null) {
        window.clearTimeout(panelTimer);
        panelTimer = null;
    }
};

const projectContent = (): boolean => {
    return projection.project();
};

const scheduleProject = (): void => {
    queueMicrotask(() => {
        if (!projectContent()) queueMicrotask(projectContent);
    });
};

const restoreContent = (): void => {
    projection.restore();
};

const removeTeleportedRoot = (): void => {
    document.querySelector(rootSelector)?.remove();
};

const rootElement = (): HTMLElement | null => document.querySelector(rootSelector);

const panelElement = (): HTMLElement | null => rootElement()?.querySelector(".elf-drawer-panel") ?? null;

let pendingCloseReason: OverlayCloseReason = "programmatic";

const requestClose = async (
    reason: OverlayCloseReason = "programmatic"
): Promise<void> => {
    if (closing.peek()) return;
    const before = props.beforeClose as unknown as (() => boolean | Promise<boolean>) | null;
    if (typeof before === "function") {
        try {
            if ((await before()) === false) return;
        } catch {
            return;
        }
    }
    pendingCloseReason = reason;
    model.set(false);
    emit("close");
};

const overlay = useModalOverlay({
    kind: "drawer",
    panel: panelElement,
    rendered: () => rendered.value,
    closing: () => closing.value,
    closeOnEscape: () => Boolean(props.closeOnEscape),
    lockScroll: () => Boolean(props.lockScroll),
    onRequestClose: (reason) => void requestClose(reason),
    onInitialFocus: () => emit("open-auto-focus"),
    onRestoreFocus: () => emit("close-auto-focus")
});

const onCloseClick = (event: Event): void => {
    event.preventDefault();
    event.stopPropagation();
    void requestClose("action");
};

const onMaskClick = (event: MouseEvent): void => {
    if (resizing || suppressMaskClick) {
        event.preventDefault();
        event.stopPropagation();
        return;
    }
    if (
        event.target === event.currentTarget &&
        props.closeOnMask &&
        overlay.claim(event)
    ) {
        void requestClose("backdrop");
    }
};

useHostAttr("direction", () => props.direction || "rtl");

useEffect(() => {
    if (model.value) {
        cleanupTimer();
        if (!overlay.isActive()) overlay.activate();
        if (!rendered.peek()) {
            rendered.set(true);
            emit("open");
            emit("opened");
        }
        closing.set(false);
        maskClosing.set(false);
        scheduleProject();
        overlay.scheduleInitialFocus();
        return;
    }

    if (!rendered.peek() || closing.peek()) return;
    overlay.beginClose(pendingCloseReason);
    pendingCloseReason = "programmatic";
    closing.set(true);
    maskClosing.set(true);
    panelTimer = window.setTimeout(() => {
        restoreContent();
        rendered.set(false);
        closing.set(false);
        maskClosing.set(false);
        panelTimer = null;
        emit("closed");
        overlay.completeClose();
    }, PANEL_LEAVE_MS);
});

onBeforeUnmount(() => {
    cleanupTimer();
    document.removeEventListener("pointermove", onResizeMove);
    document.removeEventListener("pointerup", stopResize);
    document.removeEventListener("pointercancel", stopResize);
    document.body.style.cursor = previousBodyCursor;
    document.body.style.userSelect = previousBodyUserSelect;
    if (suppressMaskClickTimer !== null) window.clearTimeout(suppressMaskClickTimer);
    suppressMaskClickTimer = null;
    suppressMaskClick = false;
    resizing = false;
    restoreContent();
    removeTeleportedRoot();
});

const handleClose = (): void => void requestClose();
defineExpose<DrawerExpose>({ close: handleClose, handleClose, resetSize });
defineStyle(styles);

const Drawer = defineHtml<DrawerProps, DrawerEmits, DrawerSlots>(`
    <Teleport to="body">
        <div
            v-if=${rendered}
            class="elf-drawer-mask mask"
            :class=${maskClass()}
            :data-elf-drawer=${id}
            role="presentation"
            @click=${onMaskClick}
        >
            <aside
                :class=${panelClass()}
                :style=${panelStyle()}
                role="dialog"
                :aria-modal=${props.modal ? "true" : "false"}
                tabindex="-1"
                :aria-labelledby=${props.title ? titleId : null}
            >
                <header class="elf-drawer-header" v-if=${props.title || props.closable}>
                    <span class="elf-drawer-header-content">
                        <span class="elf-drawer-title" :id=${titleId}>${props.title}</span>
                    </span>
                    <button
                        v-if=${props.closable}
                        class="elf-drawer-close close"
                        type="button"
                        :aria-label=${locale.t("a11y.closeDrawer")}
                        @click=${onCloseClick}
                    >
                        <svg viewBox="0 0 24 24" aria-hidden="true">
                            <path d="M6 6l12 12M18 6L6 18"></path>
                        </svg>
                    </button>
                </header>
                <div
                    v-if=${props.resizable}
                    class="elf-drawer-resize-handle"
                    role="separator"
                    tabindex="0"
                    :aria-orientation=${isHorizontal() ? "vertical" : "horizontal"}
                    :aria-valuemin=${Math.round(resizeBounds().min)}
                    :aria-valuemax=${Math.round(resizeBounds().max)}
                    :aria-valuenow=${currentResizedSize()}
                    :aria-label=${locale.t("a11y.resizeDrawer") || "调整抽屉尺寸"}
                    @pointerdown=${onResizeStart}
                    @keydown=${changeSizeByKeyboard}
                ></div>
                <div class="elf-drawer-body"></div>
                <footer class="elf-drawer-footer"></footer>
            </aside>
        </div>
    </Teleport>
`);

export { Drawer };
