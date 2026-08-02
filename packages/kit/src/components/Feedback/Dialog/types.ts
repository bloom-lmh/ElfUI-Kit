// elf-dialog 类型

export type DialogSize = "sm" | "md" | "lg" | "fullscreen";

export interface DialogProps {
  /** v-model:open — 是否打开 */
  open?: boolean;
  /** 标题 */
  title?: string;
  /** 尺寸 */
  size?: DialogSize;
  /** 点击遮罩是否关闭 */
  closeOnMask?: boolean;
  /** ESC 是否关闭 */
  closeOnEscape?: boolean;
  /** 是否显示右上角关闭按钮 */
  closable?: boolean;
  /** 是否锁定 body 滚动 */
  lockScroll?: boolean;
  /** 关闭前钩子，返回 false 阻止关闭 */
  beforeClose?: () => boolean | Promise<boolean>;
}

export interface DialogEmits {
  open: [];
  opened: [];
  close: [];
  closed: [];
  "open-auto-focus": [];
  "close-auto-focus": [];
}

export interface DialogSlots {
  default?: unknown;
  header?: unknown;
  footer?: unknown;
}

export interface DialogExpose {
  close: () => void;
  handleClose: () => void;
}

export type DialogElement = HTMLElement & DialogExpose & Partial<DialogProps>;
