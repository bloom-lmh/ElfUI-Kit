export type PaginationLayoutPart =
  "total" | "sizes" | "prev" | "pager" | "next" | "jumper" | "slot" | "->";
export type PaginationSize = "" | "small" | "default" | "large";
export type PaginationPopperStyle = string | Record<string, string | number>;

export interface PaginationProps {
  total: number;
  currentPage?: number;
  defaultCurrentPage: number;
  pageSize?: number;
  defaultPageSize: number;
  pageCount: number;
  pageSizes: number[];
  pagerCount: number;
  layout: string;
  background: boolean;
  size: PaginationSize;
  small: boolean;
  prevText: string;
  nextText: string;
  prevIcon: string;
  nextIcon: string;
  teleported: boolean;
  appendSizeTo: string | HTMLElement;
  popperClass: string;
  popperStyle: PaginationPopperStyle;
  disabled: boolean;
  hideOnSinglePage: boolean;
  ariaLabel: string;
}

export type PaginationEmits = {
  "update:currentPage": [page: number];
  "update:pageSize": [size: number];
  "current-change": [page: number];
  "size-change": [size: number];
  change: [page: number, size: number];
  "prev-click": [targetPage: number];
  "next-click": [targetPage: number];
};

export interface PaginationSlots {
  default?: unknown;
  "prev-icon"?: unknown;
  "next-icon"?: unknown;
}

export interface PaginationExpose {
  openSizeMenu: () => void;
  closeSizeMenu: () => void;
}

export type PaginationElement = HTMLElement & PaginationProps & PaginationExpose;
