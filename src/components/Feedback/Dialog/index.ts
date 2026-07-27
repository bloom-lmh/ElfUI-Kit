// elf-dialog

import {
  defineEmits,
  defineExpose,
  defineModel,
  defineProps,
  defineStyle,
  globalStyle,
  onBeforeUnmount,
  onMounted,
  projectLightDom,
  useEffect,
  useEscapeKey,
  useHost,
  useRef,
  useScrollLock,
  defineHtml
} from "@elfui/core";

import styles from "./style.scss?inline";
import { collectFocusable, deepActiveElement } from "../../Common/focus-scope";
import { useLocaleProvider } from "../../Providers/context";
import type { DialogEmits, DialogExpose, DialogProps, DialogSlots } from "./types";

export type { DialogElement, DialogEmits, DialogExpose, DialogProps, DialogSize, DialogSlots } from "./types";

globalStyle(styles);

const props = defineProps<DialogProps>({
    title: { type: String, default: "" },
    size: { type: String, default: "md" },
    closeOnMask: { type: Boolean, default: true },
    closeOnEscape: { type: Boolean, default: true },
    closable: { type: Boolean, default: true },
    lockScroll: { type: Boolean, default: true },
    beforeClose: { type: Function, default: null },
});

const emit = defineEmits<DialogEmits>();
const model = defineModel<boolean>("open", { default: false });
const locale = useLocaleProvider();

const nextId = (): string => {
    const store = globalThis as typeof globalThis & { __elfDialogIdSeed?: number };
    store.__elfDialogIdSeed = (store.__elfDialogIdSeed ?? 0) + 1;
    return `elf-dialog-${store.__elfDialogIdSeed}`;
};

const host = useHost();
const id = nextId();
const titleId = `${id}-title`;
const rendered = useRef(false);
const closing = useRef(false);
let closeTimer: number | null = null;
let previousActiveElement: HTMLElement | null = null;

const rootSelector = `[data-elf-dialog="${id}"]`;
const projection = projectLightDom(host, {
    defaultTarget: () => document.querySelector(rootSelector)?.querySelector(".elf-dialog-body"),
    slots: {
        header: () => document.querySelector(rootSelector)?.querySelector(".elf-dialog-header-content"),
        footer: () => document.querySelector(rootSelector)?.querySelector(".elf-dialog-footer"),
    },
});

const panelClass = (): string => {
    const size = props.size || "md";
    return `elf-dialog-panel dialog size-${size} ${size}`;
};

const maskClass = (): Record<string, boolean> => ({
    "elf-dialog-closing": closing.value,
});

const cleanupTimer = (): void => {
    if (closeTimer !== null) {
        window.clearTimeout(closeTimer);
        closeTimer = null;
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

const panelElement = (): HTMLElement | null => rootElement()?.querySelector(".elf-dialog-panel") ?? null;

const isTopmostDialog = (): boolean => {
    const dialogs = Array.from(document.querySelectorAll<HTMLElement>(".elf-dialog-mask:not(.elf-dialog-closing)"));
    return dialogs.at(-1) === rootElement();
};

const focusInitial = (): void => {
    const panel = panelElement();
    if (!panel || !model.value || !isTopmostDialog()) return;
    const focusable = collectFocusable(panel);
    const autofocus = focusable.find((element) => element.hasAttribute("autofocus"));
    (autofocus ?? focusable[0] ?? panel).focus({ preventScroll: true });
    emit("open-auto-focus");
};

const scheduleInitialFocus = (): void => {
    queueMicrotask(() => queueMicrotask(focusInitial));
};

const restoreFocus = (): void => {
    const target = previousActiveElement;
    previousActiveElement = null;
    if (target?.isConnected) target.focus({ preventScroll: true });
    emit("close-auto-focus");
};

const onDocumentKeydown = (event: KeyboardEvent): void => {
    if (event.key !== "Tab" || !rendered.value || closing.value || !isTopmostDialog()) return;
    const panel = panelElement();
    if (!panel) return;
    const focusable = collectFocusable(panel);
    if (focusable.length === 0) {
        event.preventDefault();
        panel.focus({ preventScroll: true });
        return;
    }
    const active = deepActiveElement();
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (!first || !last) return;
    if (event.shiftKey && (active === first || !panel.contains(document.activeElement))) {
        event.preventDefault();
        last.focus({ preventScroll: true });
    } else if (!event.shiftKey && (active === last || !panel.contains(document.activeElement))) {
        event.preventDefault();
        first.focus({ preventScroll: true });
    }
};

const requestClose = async (): Promise<void> => {
    if (closing.peek()) return;
    const before = props.beforeClose as unknown as (() => boolean | Promise<boolean>) | null;
    if (typeof before === "function") {
        try {
            if ((await before()) === false) return;
        } catch {
            return;
        }
    }
    model.set(false);
    emit("close");
};

const onCloseClick = (event: Event): void => {
    event.preventDefault();
    event.stopPropagation();
    void requestClose();
};

const onMaskClick = (event: MouseEvent): void => {
    if (event.target === event.currentTarget && props.closeOnMask) {
        void requestClose();
    }
};

useScrollLock(() => Boolean(props.lockScroll) && rendered.value);
useEscapeKey(() => {
    if (rendered.value && props.closeOnEscape && isTopmostDialog()) {
        void requestClose();
    }
});

useEffect(() => {
    if (model.value) {
        cleanupTimer();
        if (!rendered.peek()) {
            previousActiveElement = deepActiveElement();
            rendered.set(true);
            emit("open");
            emit("opened");
        }
        closing.set(false);
        scheduleProject();
        scheduleInitialFocus();
        return;
    }

    if (!rendered.peek() || closing.peek()) return;
    closing.set(true);
    closeTimer = window.setTimeout(() => {
        restoreContent();
        rendered.set(false);
        closing.set(false);
        closeTimer = null;
        emit("closed");
        restoreFocus();
    }, 220);
});

onMounted(() => document.addEventListener("keydown", onDocumentKeydown));

onBeforeUnmount(() => {
    document.removeEventListener("keydown", onDocumentKeydown);
    cleanupTimer();
    restoreContent();
    removeTeleportedRoot();
    if (model.value) restoreFocus();
});

const handleClose = (): void => void requestClose();
defineExpose<DialogExpose>({ close: handleClose, handleClose });
defineStyle(styles);

const Dialog = defineHtml<DialogProps, DialogEmits, DialogSlots>(`
    <Teleport to="body">
        <div
            v-if=${rendered}
            class="elf-dialog-mask mask"
            :class=${maskClass()}
            :data-elf-dialog=${id}
            role="presentation"
            @click=${onMaskClick}
        >
            <section
                :class=${panelClass()}
                role="dialog"
                aria-modal="true"
                tabindex="-1"
                :aria-labelledby=${props.title ? titleId : null}
            >
                <header class="elf-dialog-header" v-if=${props.title || props.closable}>
                    <span class="elf-dialog-header-content">
                        <span class="elf-dialog-title" :id=${titleId}>${props.title}</span>
                    </span>
                    <button
                        v-if=${props.closable}
                        class="elf-dialog-close close"
                        type="button"
                        :aria-label=${locale.t("a11y.closeDialog")}
                        @click=${onCloseClick}
                    >
                        <svg viewBox="0 0 24 24" aria-hidden="true">
                            <path d="M6 6l12 12M18 6L6 18"></path>
                        </svg>
                    </button>
                </header>
                <div class="elf-dialog-body"></div>
                <footer class="elf-dialog-footer"></footer>
            </section>
        </div>
    </Teleport>
`);

export { Dialog };
