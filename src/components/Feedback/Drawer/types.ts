// elf-drawer 类型定义

export type DrawerDirection = "rtl" | "ltr" | "ttb" | "btt";

export interface DrawerResizeDetail {
  direction: DrawerDirection;
  /** 调整后的像素尺寸 */
  size: number;
}

export interface DrawerProps {
  /** v-model:open — 是否打开 */
  open?: boolean;
  /** 标题 */
  title?: string;
  /** 弹出方向，默认 rtl */
  direction?: DrawerDirection;
  /** 抽屉大小，水平方向为宽，垂直方向为高，如 "30%" 或 "300px" */
  size?: string;
  /** 是否允许拖动抽屉内侧边缘调整尺寸 */
  resizable?: boolean;
  /** 可调整的最小尺寸 */
  minSize?: number | string;
  /** 可调整的最大尺寸 */
  maxSize?: number | string;
  /** 是否显示半透明遮罩 */
  modal?: boolean;
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

export interface DrawerExpose {
  close: () => void;
  handleClose: () => void;
  /** 清除用户调整结果并恢复 size */
  resetSize: () => void;
}

export interface DrawerEmits {
  open: [];
  opened: [];
  close: [];
  closed: [];
  "open-auto-focus": [];
  "close-auto-focus": [];
  "resize-start": [detail: DrawerResizeDetail];
  resize: [detail: DrawerResizeDetail];
  "resize-end": [detail: DrawerResizeDetail];
}

export interface DrawerSlots {
  default?: unknown;
  header?: unknown;
  footer?: unknown;
}

export type DrawerElement = HTMLElement & DrawerProps & DrawerExpose;
