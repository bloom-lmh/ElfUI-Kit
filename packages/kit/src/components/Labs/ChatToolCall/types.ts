export type ChatToolCallStatus = "pending" | "running" | "success" | "error";

export interface ChatToolCallLabels {
  tool: string;
  pending: string;
  running: string;
  success: string;
  error: string;
  arguments: string;
  result: string;
  expand: string;
  collapse: string;
  retry: string;
  duration: string;
}

export interface ChatToolCallProps {
  name: string;
  status: ChatToolCallStatus;
  duration: string;
  arguments: string;
  result: string;
  error: string;
  collapsible: boolean;
  defaultExpanded: boolean;
  labels: Partial<ChatToolCallLabels>;
  ariaLabel: string;
}

export interface ChatToolCallEmits {
  toggle: [detail: boolean];
  retry: [];
}

export interface ChatToolCallExpose {
  expand(): void;
  collapse(): void;
  toggle(): void;
  isExpanded(): boolean;
}

export type ChatToolCallElement = HTMLElement & Partial<ChatToolCallProps> & ChatToolCallExpose;
