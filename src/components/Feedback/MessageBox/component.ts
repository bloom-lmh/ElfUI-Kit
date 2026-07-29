import {
  defineEmits,
  defineExpose,
  defineHtml,
  defineProps,
  defineStyle,
  onBeforeUnmount,
  onMounted,
  useHostAttr,
  useHostFlag,
  useRef,
  useTemplateRef,
} from "@elfui/core";

import { useLocaleProvider } from "../../Providers/context";
import { useModalOverlay } from "../../../composables/useModalOverlay";
import styles from "./style.scss?inline";
import type {
  MessageBoxAction,
  MessageBoxActionDetail,
  MessageBoxEmits,
  MessageBoxExpose,
  MessageBoxProps,
  MessageBoxSlots,
  MessageBoxType,
} from "./types";

const TYPE_ICONS: Record<MessageBoxType, string> = {
  info: "i",
  success: "✓",
  warning: "!",
  error: "×",
};

const props = defineProps<MessageBoxProps>({
  title: { type: String, default: "" },
  message: { type: String, default: "" },
  type: { type: String, default: "info" },
  icon: { type: String, default: "" },
  autofocus: { type: Boolean, default: true },
  center: { type: Boolean, default: false },
  modal: { type: Boolean, default: true },
  showClose: { type: Boolean, default: true },
  showCancelButton: { type: Boolean, default: false },
  showConfirmButton: { type: Boolean, default: true },
  cancelButtonText: { type: String, default: "" },
  confirmButtonText: { type: String, default: "" },
  closeOnClickModal: { type: Boolean, default: true },
  closeOnPressEscape: { type: Boolean, default: true },
  lockScroll: { type: Boolean, default: true },
  showInput: { type: Boolean, default: false },
  inputValue: { type: String, default: "" },
  inputType: { type: String, default: "text" },
  inputPlaceholder: { type: String, default: "" },
});

const emit = defineEmits<MessageBoxEmits>();
const locale = useLocaleProvider();
const panelRef = useTemplateRef<HTMLElement>("panelEl");
const inputRef = useTemplateRef<HTMLInputElement>("inputEl");

const closing = useRef(false);
const value = useRef("");
const inputError = useRef("");
const confirmPending = useRef(false);
const cancelPending = useRef(false);
let closeTimer: number | null = null;

const normalizedType = (): MessageBoxType =>
  ["success", "warning", "error"].includes(String(props.type))
    ? (props.type as MessageBoxType)
    : "info";
const icon = (): string => props.icon || TYPE_ICONS[normalizedType()];
const confirmText = (): string =>
  props.confirmButtonText || locale.t("common.confirm");
const cancelText = (): string =>
  props.cancelButtonText || locale.t("common.cancel");
const panelClasses = (): Record<string, boolean> => ({
  panel: true,
  "is-center": props.center,
  "is-closing": closing.value,
});
const maskClasses = (): Record<string, boolean> => ({
  mask: true,
  "has-backdrop": props.modal,
  "is-closing": closing.value,
});
const pending = (): boolean => confirmPending.value || cancelPending.value;

const requestAction = (action: MessageBoxAction): void => {
  if (pending() || closing.peek()) return;
  const detail: MessageBoxActionDetail = { action, value: value.value };
  emit("action", detail);
};

const onConfirm = (): void => requestAction("confirm");
const onCancel = (): void => requestAction("cancel");
const onClose = (): void => requestAction("close");

const onMaskClick = (event: MouseEvent): void => {
  if (
    event.target === event.currentTarget &&
    props.closeOnClickModal &&
    overlay.claim(event)
  ) {
    onClose();
  }
};

const onInput = (event: Event): void => {
  value.set((event.currentTarget as HTMLInputElement).value);
  inputError.set("");
};

const onInputKeydown = (event: KeyboardEvent): void => {
  if (event.key !== "Enter" || event.isComposing) return;
  event.preventDefault();
  onConfirm();
};

const cleanupTimer = (): void => {
  if (closeTimer === null) return;
  window.clearTimeout(closeTimer);
  closeTimer = null;
};

const startClose = (action: MessageBoxAction = "close"): void => {
  if (closing.peek()) return;
  closing.set(true);
  overlay.beginClose(
    action === "confirm" ? "action" : action === "cancel" ? "action" : "programmatic",
  );
  cleanupTimer();
  closeTimer = window.setTimeout(() => {
    closeTimer = null;
    emit("closed");
    overlay.completeClose();
  }, 200);
};

const setInputError = (message: string): void => {
  inputError.set(message);
  queueMicrotask(() => inputRef.value?.focus());
};

const setPending = (action: MessageBoxAction, active: boolean): void => {
  if (action === "confirm") confirmPending.set(active);
  if (action === "cancel") cancelPending.set(active);
};

const overlay = useModalOverlay({
  kind: "message-box",
  panel: () => panelRef.value,
  rendered: () => true,
  closing: () => closing.value,
  closeOnEscape: () => Boolean(props.closeOnPressEscape),
  lockScroll: () => Boolean(props.lockScroll),
  onRequestClose: onClose,
});

useHostAttr("type", normalizedType);
useHostFlag("data-closing", () => closing.value);
useHostFlag("data-modal", () => props.modal);

onMounted(() => {
  value.set(props.inputValue || "");
  overlay.activate();
  if (props.autofocus) overlay.scheduleInitialFocus();
});

onBeforeUnmount(cleanupTimer);

defineExpose<MessageBoxExpose>({
  close: onClose,
  setInputError,
  setPending,
  startClose,
});
defineStyle(styles);

const MessageBox = defineHtml<MessageBoxProps, MessageBoxEmits, MessageBoxSlots>(`
  <div :class=${maskClasses()} part="mask" @click=${onMaskClick}>
    <section
      ref="panelEl"
      class="panel"
      :class=${panelClasses()}
      part="panel"
      role="alertdialog"
      :aria-modal=${props.modal ? "true" : "false"}
      :aria-labelledby=${props.title ? "message-box-title" : null}
      :aria-label=${props.title ? null : locale.t("a11y.messageBoxTitle")}
      aria-describedby="message-box-content"
      tabindex="-1"
    >
      <header class="header">
        <span id="message-box-title" class="title">${props.title}</span>
        <button
          v-if=${props.showClose}
          class="close"
          type="button"
          :aria-label=${locale.t("a11y.closeMessageBox")}
          @click=${onClose}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M6 6l12 12M18 6L6 18"></path>
          </svg>
        </button>
      </header>

      <div class="body">
        <span class="type-icon" aria-hidden="true">${icon()}</span>
        <div class="content-wrap">
          <div id="message-box-content" class="content"><slot>${props.message}</slot></div>
          <div v-if=${props.showInput} class="input-wrap">
            <input
              ref="inputEl"
              class="input"
              :type=${props.inputType || "text"}
              :value=${value}
              :placeholder=${props.inputPlaceholder}
              :data-autofocus=${props.autofocus ? "" : null}
              :aria-invalid=${inputError ? "true" : "false"}
              :aria-describedby=${inputError ? "message-box-input-error" : null}
              @input=${onInput}
              @keydown=${onInputKeydown}
            />
            <span v-if=${inputError} id="message-box-input-error" class="input-error" role="alert">
              ${inputError}
            </span>
          </div>
        </div>
      </div>

      <footer class="footer">
        <button
          v-if=${props.showCancelButton}
          class="button cancel"
          type="button"
          :disabled=${pending()}
          @click=${onCancel}
        >
          <span v-if=${cancelPending} class="spinner" aria-hidden="true"></span>
          ${cancelText()}
        </button>
        <button
          v-if=${props.showConfirmButton}
          class="button confirm"
          type="button"
          :data-autofocus=${props.autofocus && !props.showInput ? "" : null}
          :disabled=${pending()}
          @click=${onConfirm}
        >
          <span v-if=${confirmPending} class="spinner" aria-hidden="true"></span>
          ${confirmText()}
        </button>
      </footer>
    </section>
  </div>
`);

export { MessageBox };
