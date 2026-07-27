// elf-tooltip 类型定义

export type TooltipPlacement = "top" | "bottom" | "left" | "right" | "auto";
export type TooltipEffect = "dark" | "light";
export type TooltipTrigger = "hover" | "focus" | "click" | "contextmenu" | "manual";

export interface TooltipProps {
  /** 提示内容 */
  content?: string;
  /** 弹出位置，默认 top */
  placement?: TooltipPlacement;
  /** 是否禁用 */
  disabled?: boolean;
  /** 触发方式，默认 hover */
  trigger?: TooltipTrigger;
  /** 延迟显示，单位毫秒 */
  showAfter?: number;
  /** 延迟隐藏，单位毫秒 */
  hideAfter?: number;
  /** 主题风格，默认 dark */
  effect?: TooltipEffect;
  /** 长内容最大宽度 */
  maxWidth?: number | string;
  /** 是否受控显示（用于 manual 模式） */
  visible?: boolean;
  /** hover/focus 模式下是否启用触屏长按 */
  touchLongPress?: boolean;
  /** 触屏长按触发时间，单位毫秒 */
  longPressDelay?: number;
  /** 长按期间允许的手指移动距离，单位像素 */
  longPressTolerance?: number;
}

export interface TooltipEmits {
  "before-show": [];
  show: [];
  "before-hide": [];
  hide: [];
}

export interface TooltipSlots {
  default?: unknown;
  content?: unknown;
}

export interface TooltipExpose {
  show: () => void;
  hide: () => void;
  isVisible: () => boolean;
  updatePosition: () => void;
}

export type TooltipElement = HTMLElement & TooltipExpose & Partial<TooltipProps>;
