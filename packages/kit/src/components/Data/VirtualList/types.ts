import type { ListItemKey, ListItemRenderer } from "../List/types";

export interface VirtualListProps<T = unknown> {
  items: T[];
  itemKey: ListItemKey<T>;
  renderItem?: ListItemRenderer<T>;
  height: string | number;
  itemHeight: number;
  overscan: number;
  bordered: boolean;
  divided: boolean;
  emptyText: string;
  /** Class applied to every recycled row. */
  listItemClass: string;
  /** Inline style applied to every recycled row. */
  listItemStyle: string | Record<string, string | number>;
  /** Measure rendered rows and virtualize variable-height content. */
  dynamic: boolean;
  /** Initial row-height estimate used before a dynamic row is measured. */
  estimatedItemHeight: number;
  /** Display a non-blocking loading layer while data is appended. */
  loading: boolean;
  loadingText: string;
}

export type VirtualListAlign = "start" | "center" | "end" | "auto";

export interface VirtualListExpose {
  scrollToIndex(index: number, behavior?: ScrollBehavior, align?: VirtualListAlign): void;
  scrollToOffset(offset: number, behavior?: ScrollBehavior): void;
  scrollToKey(key: string | number, behavior?: ScrollBehavior, align?: VirtualListAlign): void;
  getVisibleRange(): { start: number; end: number };
}
