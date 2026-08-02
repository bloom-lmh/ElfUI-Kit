// elf-pop-confirm 类型定义

export type PopConfirmPlacement = "top" | "bottom" | "left" | "right";
export type PopConfirmTrigger = "click" | "hover" | "focus" | "manual";
export type PopConfirmBeforeConfirm = () => boolean | void | Promise<boolean | void>;

export interface PopConfirmProps {
  title: string;
  content: string;
  confirmText: string;
  cancelText: string;
  placement: PopConfirmPlacement;
  trigger: PopConfirmTrigger;
  visible: boolean | undefined;
  width: string;
  disabled: boolean;
  closeOnEscape: boolean;
  closeOnClickOutside: boolean;
  teleported: boolean;
  beforeConfirm?: PopConfirmBeforeConfirm;
  loadingText: string;
}

export interface PopConfirmExpose {
  show: () => void;
  hide: () => void;
  toggle: () => void;
  confirm: () => Promise<void>;
  cancel: () => void;
  isVisible: () => boolean;
}

export interface PopConfirmSlots {
  default?: unknown;
  content?: unknown;
  actions?: unknown;
}

export type PopConfirmElement = HTMLElement & PopConfirmExpose & Partial<PopConfirmProps>;
