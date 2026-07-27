// elf-tour 类型定义

export type TourPlacement = "top" | "bottom" | "left" | "right";

export interface TourStep {
  target: string;
  title: string;
  content: string;
  placement?: TourPlacement;
  nextText?: string;
  prevText?: string;
}

export interface TourProps {
  steps?: TourStep[];
  visible?: boolean;
  current?: number;
  maskClosable?: boolean;
  keyboard?: boolean;
  closeOnPressEscape?: boolean;
  showClose?: boolean;
  mask?: boolean;
  lockScroll?: boolean;
  gap?: number;
  zIndex?: number;
  contentStyle?: Record<string, string>;
}

export interface TourChangeDetail {
  current: number;
  step: TourStep | null;
}

export interface TourEmits {
  "update:current": [current: number];
  change: [detail: TourChangeDetail];
  close: [];
  finish: [];
}

export interface TourSlots {
  header?: unknown;
  indicators?: unknown;
}

export interface TourExpose {
  open: () => void;
  close: () => void;
  prev: () => void;
  next: () => void;
  skip: () => void;
  finish: () => void;
}

export type TourElement = HTMLElement & TourExpose & Partial<TourProps>;
