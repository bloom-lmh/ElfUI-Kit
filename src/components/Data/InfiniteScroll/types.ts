export type InfiniteScrollContainer = string | HTMLElement | Window | null;

export interface InfiniteScrollProps {
  disabled: boolean;
  distance: number;
  delay: number;
  immediate: boolean;
  loading: boolean;
  finished: boolean;
  /** Scroll viewport height. Use `auto` only with an external container. */
  height: string | number;
  /** A selector, HTMLElement, Window, or the literal `window`. */
  container: InfiniteScrollContainer;
  ariaLabel: string;
}

export type InfiniteScrollEmits = {
  load: [];
};

export interface InfiniteScrollSlots {
  default?: unknown;
}

export interface InfiniteScrollExposes {
  /** Re-evaluate the current scroll target immediately. */
  check(): void;
}

export type InfiniteScrollDirectiveHandler = () => void;

export interface InfiniteScrollDirectiveOptions {
  handler: InfiniteScrollDirectiveHandler;
  disabled?: boolean;
  distance?: number;
  delay?: number;
  immediate?: boolean;
}

export type InfiniteScrollDirectiveValue = InfiniteScrollDirectiveHandler | InfiniteScrollDirectiveOptions;
