// Notification 类型定义

export type NotificationType = "info" | "success" | "warning" | "error";
export type NotificationPosition = "top-right" | "top-left" | "bottom-right" | "bottom-left";
export type NotificationAppendTarget = string | Element;
export type NotificationContent = string | Node | (() => Node);

export interface NotificationOptions {
  title?: string;
  /** Plain text, an already-created DOM node, or a trusted DOM-node factory. HTML strings are never parsed. */
  message: NotificationContent;
  type?: NotificationType;
  position?: NotificationPosition;
  duration?: number;
  closable?: boolean;
  offset?: number;
  /** Render into this element or a selector matching one. Falls back to document.body. */
  appendTo?: NotificationAppendTarget;
  /** Additional host class names. */
  customClass?: string;
  /** Host stacking context. */
  zIndex?: number;
  /** Element Plus-compatible alias for closable. */
  showClose?: boolean;
  /** Text glyph used for a custom notification icon. */
  icon?: string;
  /** Text glyph used by the close button. */
  closeIcon?: string;
  /** Invoked after the notification starts closing. */
  onClose?: () => void;
  onClick?: () => void;
}

export interface NotificationHandle {
  close(): void;
}

export interface NotificationApi {
  (options: NotificationOptions | string): NotificationHandle;
  info(options: NotificationOptions | string): NotificationHandle;
  success(options: NotificationOptions | string): NotificationHandle;
  warning(options: NotificationOptions | string): NotificationHandle;
  error(options: NotificationOptions | string): NotificationHandle;
  closeAll(): void;
}
