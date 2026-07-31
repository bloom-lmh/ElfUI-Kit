// elf-dialog

import {
  defineEmits,
  defineExpose,
  defineHtml,
  defineModel,
  defineProps,
  defineStyle,
  globalStyle,
  onBeforeUnmount,
  projectLightDom,
  useHost,
  useRef,
} from "@elfui/core";

import styles from "./style.scss?inline";
import { useLocaleProvider } from "../../Providers/context";
import { useModalOverlay } from "../../../composables/useModalOverlay";
import type { OverlayCloseReason } from "../../Common/overlay/overlay-protocol";
import type { DialogEmits, DialogExpose, DialogProps, DialogSlots } from "./types";

export type {
  DialogElement,
  DialogEmits,
  DialogExpose,
  DialogProps,
  DialogSize,
  DialogSlots,
} from "./types";

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
let activeRoot: HTMLElement | null = null;
let emitOpenedAfterEnter = false;

const rootElement = (): HTMLElement | null => activeRoot;
const panelElement = (): HTMLElement | null =>
  rootElement()?.querySelector(".elf-dialog-panel") ?? null;

const projection = projectLightDom(host, {
  defaultTarget: () => rootElement()?.querySelector(".elf-dialog-body") ?? null,
  slots: {
    header: () => rootElement()?.querySelector(".elf-dialog-header-content") ?? null,
    footer: () => rootElement()?.querySelector(".elf-dialog-footer") ?? null,
  },
});

const panelClass = (): string => {
  const size = props.size || "md";
  return `elf-dialog-panel dialog size-${size} ${size}`;
};

const projectContent = (): boolean => projection.project();

const restoreContent = (): void => {
  projection.restore();
};

let pendingCloseReason: OverlayCloseReason = "programmatic";

const requestClose = async (reason: OverlayCloseReason = "programmatic"): Promise<void> => {
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
  kind: "dialog",
  panel: panelElement,
  rendered: () => rendered.value,
  closing: () => closing.value,
  closeOnEscape: () => Boolean(props.closeOnEscape),
  lockScroll: () => Boolean(props.lockScroll),
  onRequestClose: (reason) => void requestClose(reason),
  onInitialFocus: () => emit("open-auto-focus"),
  onRestoreFocus: () => emit("close-auto-focus"),
});

/**
 * Starts one structural enter transaction after Teleport has inserted its root.
 *
 * @remarks The active root is explicit because beta.20 keeps a leaving root while a rapid
 * reopen inserts its replacement. Projection and focus must always target the replacement.
 */
const onBeforeEnter = (element: Element): void => {
  activeRoot = element as HTMLElement;
  const isFreshOpen = !rendered.peek();

  closing.set(false);
  if (!overlay.isActive()) overlay.activate();
  if (isFreshOpen) {
    rendered.set(true);
    emitOpenedAfterEnter = true;
    emit("open");
  }

  projectContent();
  overlay.scheduleInitialFocus();
};

const onAfterEnter = (element: Element): void => {
  if (!emitOpenedAfterEnter || !model.value || activeRoot !== element) return;
  emitOpenedAfterEnter = false;
  emit("opened");
};

const onBeforeLeave = (): void => {
  if (!rendered.peek() || closing.peek()) return;
  overlay.beginClose(pendingCloseReason);
  pendingCloseReason = "programmatic";
  emitOpenedAfterEnter = false;
  closing.set(true);
};

/** Completes projection, scroll-lock, stack, and focus cleanup after the framework leave. */
const onAfterLeave = (element: Element): void => {
  if (model.value || activeRoot !== element) return;
  restoreContent();
  activeRoot = null;
  rendered.set(false);
  closing.set(false);
  emitOpenedAfterEnter = false;
  emit("closed");
  overlay.completeClose();
};

const onCloseClick = (event: Event): void => {
  event.preventDefault();
  event.stopPropagation();
  void requestClose("action");
};

const onMaskClick = (event: MouseEvent): void => {
  if (event.target === event.currentTarget && props.closeOnMask && overlay.claim(event)) {
    void requestClose("backdrop");
  }
};

onBeforeUnmount(() => {
  restoreContent();
  activeRoot = null;
});

const handleClose = (): void => void requestClose();
defineExpose<DialogExpose>({ close: handleClose, handleClose });
defineStyle(styles);

const Dialog = defineHtml<DialogProps, DialogEmits, DialogSlots>(`
  <Teleport to="body">
    <Transition
      name="elf-dialog"
      appear
      @before-enter=${onBeforeEnter}
      @after-enter=${onAfterEnter}
      @before-leave=${onBeforeLeave}
      @after-leave=${onAfterLeave}
    >
        <div
          v-if=${model.value}
          class="elf-dialog-mask mask"
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
    </Transition>
  </Teleport>
`);

export { Dialog };
