import type { ListRenderValue } from "../list-content";

export type ListItemKey<T = unknown> = string | ((item: T, index: number) => string | number);
export type ListItemRenderer<T = unknown> = (item: T, index: number) => ListRenderValue;

export interface ListProps<T = unknown> {
  items: T[];
  itemKey: ListItemKey<T>;
  renderItem?: ListItemRenderer<T>;
  bordered: boolean;
  divided: boolean;
  emptyText: string;
  loading: boolean;
  loadingText: string;
  ariaLabel: string;
}

export interface ListSlots {
  default?: unknown;
  empty?: unknown;
  loading?: unknown;
}

export interface ListExposes {
  /** Focus the first enabled, clickable declarative list item. */
  focusFirst(): void;
}
