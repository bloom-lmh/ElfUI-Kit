export type ChatMessageRole = "user" | "assistant" | "system" | "tool";
export type ChatMessageStatus = "complete" | "streaming" | "error";
export type ChatMessageShape = "rounded" | "sharp" | "glass" | "terminal" | "outline";

export interface ChatMessageLabels {
  copy: string;
  copied: string;
  copyFailed: string;
  error: string;
  user: string;
  assistant: string;
  system: string;
  tool: string;
}

export interface ChatMessageProps {
  role: ChatMessageRole;
  shape: ChatMessageShape;
  content: string;
  name: string;
  time: string;
  status: ChatMessageStatus;
  error: string;
  copyable: boolean;
  avatar: string;
  labels: Partial<ChatMessageLabels>;
  ariaLabel: string;
}

export interface ChatMessageEmits {
  copy: [detail: { content: string }];
  "copy-error": [detail: unknown];
}

export interface ChatMessageExpose {
  copy(): Promise<boolean>;
}

export type ChatMessageElement = HTMLElement & Partial<ChatMessageProps> & ChatMessageExpose;
