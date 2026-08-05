import {
  defineEmits,
  defineExpose,
  defineHtml,
  defineProps,
  defineStyle,
  onUnmounted,
  useEffect,
  useComponents,
  useHostAttr,
  useHostCssVar,
  useHostFlag,
  useTemplateRef,
} from "@elfui/core";

import { ChatComposer, type ChatComposerElement } from "../ChatComposer";
import { ChatMessage, type ChatMessageElement } from "../ChatMessage";
import { ChatToolCall, type ChatToolCallElement } from "../ChatToolCall";
import styles from "./style.scss?inline";
import type {
  AIChatEmits,
  AIChatExpose,
  AIChatLabels,
  AIChatMessageItem,
  AIChatProps,
  AIChatToolCallItem,
} from "./types";
import type { ChatMessageRole, ChatMessageStatus } from "../ChatMessage/types";

export type {
  AIChatElement,
  AIChatEmits,
  AIChatExpose,
  AIChatLabels,
  AIChatMessageItem,
  AIChatProps,
  AIChatToolCallItem,
} from "./types";

const DEFAULT_LABELS: AIChatLabels = {
  clear: "Clear conversation",
  empty: "No messages yet",
  typing: "Assistant is typing",
};

const ROLES: readonly ChatMessageRole[] = ["user", "assistant", "system", "tool"];
const STATUSES: readonly ChatMessageStatus[] = ["complete", "streaming", "error"];

const props = defineProps<AIChatProps>({
  items: { type: Array, default: () => [] },
  loading: { type: Boolean, default: false },
  title: { type: String, default: "AI Assistant" },
  subtitle: { type: String, default: "" },
  placeholder: { type: String, default: "Type a message..." },
  disabled: { type: Boolean, default: false },
  height: { type: String, default: "560px" },
  emptyText: { type: String, default: "" },
  showHeader: { type: Boolean, default: true },
  autofocus: { type: Boolean, default: false },
  labels: { type: Object, default: () => ({}) },
  ariaLabel: { type: String, default: "" },
});

const emit = defineEmits<AIChatEmits>(["send", "stop", "clear", "message-copy", "retry"]);
const list = useTemplateRef<HTMLElement>("list");
const composer = useTemplateRef<ChatComposerElement>("composer");
let scrollFrame: number | null = null;

useComponents({
  "chat-message": ChatMessage,
  "chat-tool-call": ChatToolCall,
  "chat-composer": ChatComposer,
});

const label = (key: keyof AIChatLabels): string =>
  props.labels?.[key] || DEFAULT_LABELS[key] || key;
const emptyText = (): string => props.emptyText || label("empty");
const subtitle = (): string => props.subtitle;
const items = (): readonly AIChatMessageItem[] => props.items;
const hasItems = (): boolean => props.items.length > 0;
const isEmpty = (): boolean => props.items.length === 0;

const normalizeRole = (value: string): ChatMessageRole =>
  ROLES.includes(value as ChatMessageRole) ? (value as ChatMessageRole) : "assistant";
const normalizeStatus = (value: string): ChatMessageStatus =>
  STATUSES.includes(value as ChatMessageStatus) ? (value as ChatMessageStatus) : "complete";
const itemRole = (item: AIChatMessageItem): ChatMessageRole => normalizeRole(item.role);
const itemContent = (item: AIChatMessageItem): string => item.content || "";
const itemStatus = (item: AIChatMessageItem): ChatMessageStatus =>
  normalizeStatus(item.status || "complete");
const itemToolCalls = (item: AIChatMessageItem): readonly AIChatToolCallItem[] =>
  item.toolCalls || [];
const itemKey = (item: AIChatMessageItem, index: number): string | number =>
  item.id ?? `chat-item-${index}`;
const callKey = (call: AIChatToolCallItem, index: number): string | number =>
  call.id ?? `chat-call-${index}`;

const scrollToBottom = (): void => {
  const target = list.value;
  if (!target) return;
  target.scrollTop = target.scrollHeight;
};

const scheduleScroll = (): void => {
  if (scrollFrame !== null) cancelAnimationFrame(scrollFrame);
  scrollFrame = requestAnimationFrame(() => {
    scrollFrame = requestAnimationFrame(scrollToBottom);
  });
};

const focus = (): void => composer.value?.focus();
const getItemCount = (): number => props.items.length;
const clear = (): void => {
  emit("clear");
};

const onSend = (event: Event): void => {
  emit("send", (event as CustomEvent<string>).detail);
};
const onStop = (): void => {
  emit("stop");
};
const onClear = (): void => {
  emit("clear");
};
const onMessageCopy = (event: Event): void => {
  const index = Number((event.currentTarget as ChatMessageElement).dataset.index);
  const item = props.items[index];
  if (!item) return;
  const content = (event as CustomEvent<{ content: string }>).detail?.content || "";
  emit("message-copy", { item, content });
};
const onRetry = (event: Event): void => {
  const target = event.currentTarget as ChatToolCallElement;
  const messageIndex = Number(target.dataset.messageIndex);
  const callIndex = Number(target.dataset.callIndex);
  const call = props.items[messageIndex]?.toolCalls?.[callIndex];
  if (call) emit("retry", call);
};

useHostCssVar("--_chat-height", () => props.height);
useHostFlag("data-loading", () => props.loading);
useHostFlag("data-empty", isEmpty);
useHostAttr("aria-label", () => props.ariaLabel || props.title);

useEffect(() => {
  void items().length;
  void props.loading;
  scheduleScroll();
});
onUnmounted(() => {
  if (scrollFrame !== null) cancelAnimationFrame(scrollFrame);
  scrollFrame = null;
});

defineExpose<AIChatExpose>(
  { clear, scrollToBottom, focus, getItemCount },
  { overrideNative: ["focus"] },
);

defineStyle(styles);

const AiChat = defineHtml(`
  <div class="chat">
    <header v-if=${props.showHeader} class="header">
      <div class="identity">
        <span class="status-dot" :class="{ active: props.loading }" aria-hidden="true"></span>
        <div class="titles">
          <strong class="title">${props.title}</strong>
          <span v-if=${subtitle()} class="subtitle">${subtitle()}</span>
        </div>
      </div>
      <div class="header-actions">
        <button
          v-if=${hasItems() && !props.loading}
          class="clear"
          type="button"
          :aria-label=${label("clear")}
          :title=${label("clear")}
          @click=${onClear}
        >
          <span class="clear-icon" aria-hidden="true"></span>
        </button>
        <slot name="header-extra"></slot>
      </div>
    </header>

    <div ref="list" class="list" role="log" :aria-label=${props.ariaLabel || props.title}>
      <div v-if=${isEmpty()} class="empty">
        <slot name="welcome">
          <span class="empty-icon" aria-hidden="true"></span>
          <p>${emptyText()}</p>
        </slot>
      </div>
      <div v-else class="items">
        <div
          v-for="(item, index) in items()"
          :key="itemKey(item, index)"
          class="entry"
          :class="{ 'is-user': itemRole(item) === 'user' }"
        >
          <chat-message
            :data-index="index"
            :role="itemRole(item)"
            :content="itemContent(item)"
            :name="item.name || ''"
            :time="item.time || ''"
            :status="itemStatus(item)"
            :error="item.error || ''"
            @copy=${onMessageCopy}
          ></chat-message>
          <div class="tool-calls">
            <chat-tool-call
              v-for="(call, callIndex) in itemToolCalls(item)"
              :key="callKey(call, callIndex)"
              :data-message-index="index"
              :data-call-index="callIndex"
              :name="call.name"
              :status="call.status || 'running'"
              :duration="call.duration || ''"
              :arguments="call.arguments || ''"
              :result="call.result || ''"
              :error="call.error || ''"
              @retry=${onRetry}
            ></chat-tool-call>
          </div>
        </div>
      </div>
      <div v-if=${props.loading} class="typing" role="status" aria-live="polite">
        <span class="dots" aria-hidden="true"><i></i><i></i><i></i></span>
        <span class="typing-text">${label("typing")}</span>
      </div>
    </div>

    <div class="composer-area">
      <slot name="composer">
        <chat-composer
          ref="composer"
          :placeholder.prop=${props.placeholder}
          :disabled.prop=${props.disabled}
          :loading.prop=${props.loading}
          :autofocus.prop=${props.autofocus}
          @send=${onSend}
          @stop=${onStop}
        ></chat-composer>
      </slot>
    </div>
  </div>
`);

export { AiChat };
