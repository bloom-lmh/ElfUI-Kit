// elf-scrollbar 类型定义

export interface ScrollbarProps {
  height: number | string;
  maxHeight: number | string;
  always: boolean;
  native: boolean;
  noresize: boolean;
  wrapClass: string;
  viewClass: string;
}

export interface ScrollbarScrollDetail {
  scrollTop: number;
  scrollLeft: number;
}

export interface ScrollbarExpose {
  setScrollTop: (value: number) => void;
  setScrollLeft: (value: number) => void;
  update: () => void;
  wrapRef: HTMLElement | null;
}
