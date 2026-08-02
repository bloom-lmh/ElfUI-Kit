export type StickyPosition = "top" | "bottom";
export type StickyAppendTarget = string | HTMLElement;

export interface StickyProps {
  /** Element Plus compatible offset. Legacy top/bottom remain supported. */
  offset?: string | number;
  position: StickyPosition;
  target: string;
  zIndex: string | number;
  teleported: boolean;
  appendTo: StickyAppendTarget;
  top: string | number;
  bottom: string | number;
  disabled: boolean;
}

export interface StickyScrollDetail {
  scrollTop: number;
  fixed: boolean;
}

export interface StickyExpose {
  update(): void;
  updateRoot(): void;
}

export interface StickySlots {
  default?: unknown;
}
