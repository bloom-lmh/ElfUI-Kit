export type MessageType = "info" | "success" | "warning" | "danger" | "error";
export type MessagePosition = "top" | "bottom";

export interface MessageOptions {
  message: string;
  type?: MessageType;
  /** 持续显示的毫秒数，0 表示不自动关闭。 */
  duration?: number;
  /** 是否显示关闭按钮。 */
  closable?: boolean;
  /** 操作按钮文案。 */
  action?: string;
  /** 距离视口边缘的偏移量。 */
  offset?: number;
  position?: MessagePosition;
  zIndex?: number;
  customClass?: string;
  onAction?: () => void;
  onClick?: () => void;
  onClose?: () => void;
  /** ThemeProvider tokens forwarded to the document-level message host. */
  themeTokens?: import("../../Providers/context").ThemeTokens;
}

export interface MessageHandle {
  close(): void;
}

export interface MessageApi {
  (options: MessageOptions | string): MessageHandle;
  info(message: string, options?: Omit<MessageOptions, "message" | "type">): MessageHandle;
  success(message: string, options?: Omit<MessageOptions, "message" | "type">): MessageHandle;
  warning(message: string, options?: Omit<MessageOptions, "message" | "type">): MessageHandle;
  danger(message: string, options?: Omit<MessageOptions, "message" | "type">): MessageHandle;
  error(message: string, options?: Omit<MessageOptions, "message" | "type">): MessageHandle;
  closeAll(): void;
}
