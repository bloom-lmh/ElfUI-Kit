import type { ChatMessageRole, ChatMessageStatus } from "../ChatMessage/types";
import type { ChatToolCallStatus } from "../ChatToolCall/types";

export interface AIChatToolCallItem {
  id?: string | number;
  name: string;
  status?: ChatToolCallStatus;
  duration?: string;
  arguments?: string;
  result?: string;
  error?: string;
}

export interface AIChatMessageItem {
  id?: string | number;
  role: ChatMessageRole;
  content?: string;
  name?: string;
  time?: string;
  status?: ChatMessageStatus;
  error?: string;
  toolCalls?: AIChatToolCallItem[];
}

export interface AIChatLabels {
  clear: string;
  empty: string;
  typing: string;
}

export interface AIChatProps {
  items: AIChatMessageItem[];
  loading: boolean;
  title: string;
  subtitle: string;
  placeholder: string;
  disabled: boolean;
  height: string;
  emptyText: string;
  showHeader: boolean;
  autofocus: boolean;
  labels: Partial<AIChatLabels>;
  ariaLabel: string;
}

export interface AIChatEmits {
  send: [content: string];
  stop: [];
  clear: [];
  "message-copy": [detail: { item: AIChatMessageItem; content: string }];
  retry: [detail: AIChatToolCallItem];
}

export interface AIChatExpose {
  clear(): void;
  scrollToBottom(): void;
  focus(): void;
  getItemCount(): number;
}

export type AIChatElement = HTMLElement & Partial<AIChatProps> & AIChatExpose;
