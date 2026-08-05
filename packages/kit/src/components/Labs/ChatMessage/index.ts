import {
  defineEmits,
  defineExpose,
  defineHtml,
  defineProps,
  defineStyle,
  useHostAttr,
  useHostFlag,
  useRef,
} from "@elfui/core";

import styles from "./style.scss?inline";
import type {
  ChatMessageEmits,
  ChatMessageExpose,
  ChatMessageLabels,
  ChatMessageProps,
  ChatMessageRole,
  ChatMessageShape,
  ChatMessageStatus,
} from "./types";

export type {
  ChatMessageElement,
  ChatMessageEmits,
  ChatMessageExpose,
  ChatMessageLabels,
  ChatMessageProps,
  ChatMessageRole,
  ChatMessageShape,
  ChatMessageStatus,
} from "./types";

const DEFAULT_LABELS: ChatMessageLabels = {
  copy: "Copy",
  copied: "Copied",
  copyFailed: "Copy failed",
  error: "Error",
  user: "You",
  assistant: "Assistant",
  system: "System",
  tool: "Tool",
};

const ROLES: readonly ChatMessageRole[] = ["user", "assistant", "system", "tool"];
const STATUSES: readonly ChatMessageStatus[] = ["complete", "streaming", "error"];
const SHAPES: readonly ChatMessageShape[] = ["rounded", "sharp", "glass", "terminal", "outline"];

const props = defineProps<ChatMessageProps>({
  role: { type: String, default: "assistant" },
  shape: { type: String, default: "rounded" },
  content: { type: String, default: "" },
  name: { type: String, default: "" },
  time: { type: String, default: "" },
  status: { type: String, default: "complete" },
  error: { type: String, default: "" },
  copyable: { type: Boolean, default: true },
  avatar: { type: String, default: "" },
  labels: { type: Object, default: () => ({}) },
  ariaLabel: { type: String, default: "" },
});

const emit = defineEmits<ChatMessageEmits>(["copy", "copy-error"]);
const copied = useRef(false);
let copiedTimer: ReturnType<typeof setTimeout> | null = null;

const resolvedRole = (): ChatMessageRole =>
  ROLES.includes(props.role as ChatMessageRole) ? (props.role as ChatMessageRole) : "assistant";
const resolvedShape = (): ChatMessageShape =>
  SHAPES.includes(props.shape as ChatMessageShape) ? (props.shape as ChatMessageShape) : "rounded";
const resolvedStatus = (): ChatMessageStatus =>
  STATUSES.includes(props.status as ChatMessageStatus)
    ? (props.status as ChatMessageStatus)
    : "complete";
const label = (key: keyof ChatMessageLabels): string =>
  props.labels?.[key] || DEFAULT_LABELS[key] || key;
const roleLabel = (): string => label(resolvedRole());
const displayName = (): string => props.name || roleLabel();
const avatarText = (): string => props.avatar || displayName().slice(0, 1).toUpperCase();
const hasTime = (): boolean => Boolean(props.time);
const isStreaming = (): boolean => resolvedStatus() === "streaming";
const hasError = (): boolean => resolvedStatus() === "error" && Boolean(props.error);
const isCopied = (): boolean => copied.value;
const showCopyAction = (): boolean => props.copyable && Boolean(props.content);
const copyLabel = (): string => label(isCopied() ? "copied" : "copy");
const hostLabel = (): string =>
  props.ariaLabel || `${displayName()}${props.content ? `: ${props.content.slice(0, 80)}` : ""}`;

const writeClipboard = async (text: string): Promise<void> => {
  let clipboardError: unknown;
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return;
    } catch (error) {
      clipboardError = error;
    }
  }
  const input = document.createElement("textarea");
  input.value = text;
  input.setAttribute("readonly", "");
  input.style.position = "fixed";
  input.style.opacity = "0";
  document.body.appendChild(input);
  try {
    input.select();
    const succeeded = document.execCommand?.("copy") ?? false;
    if (!succeeded) throw clipboardError ?? new Error("Clipboard API is unavailable");
  } finally {
    input.remove();
  }
};

const copy = async (): Promise<boolean> => {
  if (!props.content) return false;
  try {
    await writeClipboard(props.content);
    copied.set(true);
    emit("copy", { content: props.content });
    if (copiedTimer) clearTimeout(copiedTimer);
    copiedTimer = setTimeout(() => copied.set(false), 1600);
    return true;
  } catch (error) {
    copied.set(false);
    emit("copy-error", error);
    return false;
  }
};

useHostAttr("data-role", resolvedRole);
useHostAttr("data-shape", resolvedShape);
useHostAttr("data-status", resolvedStatus);
useHostFlag("streaming", isStreaming);
useHostFlag("data-error", hasError);
useHostAttr("aria-label", hostLabel);

defineExpose<ChatMessageExpose>({ copy });

defineStyle(styles);

const ChatMessage = defineHtml(`
  <div class="message" role="listitem">
    <span class="avatar" aria-hidden="true">${avatarText()}</span>
    <div class="column">
      <div class="meta">
        <span class="name">${displayName()}</span>
        <span class="role-tag">${roleLabel()}</span>
        <span v-if=${hasTime()} class="time">${props.time}</span>
      </div>
      <div class="bubble">
        <div class="content"><slot>${props.content}</slot></div>
        <span v-if=${isStreaming()} class="caret" aria-hidden="true"></span>
      </div>
      <div v-if=${hasError()} class="error" role="alert">${props.error}</div>
      <div class="actions">
        <button
          v-if=${showCopyAction()}
          class="copy"
          type="button"
          :aria-label=${copyLabel()}
          :title=${copyLabel()}
          @click=${copy}
        >
          <span class="copy-icon" :class="{ copied: isCopied() }" aria-hidden="true"></span>
        </button>
        <slot name="actions"></slot>
      </div>
      <div class="footer"><slot name="footer"></slot></div>
    </div>
  </div>
`);

export { ChatMessage };
