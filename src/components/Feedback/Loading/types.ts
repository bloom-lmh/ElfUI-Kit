export type LoadingVariant = "spinner" | "dots" | "pulse" | "bars";

export interface LoadingProps {
  loading: boolean;
  text: string;
  fullscreen: boolean;
  background: string;
  closable: boolean;
  /** Removes the indicator card surface while retaining the overlay. */
  plain: boolean;
  variant: LoadingVariant;
  svg: string;
  svgViewBox: string;
  lock: boolean;
}

export type LoadingTarget = HTMLElement | string;

export interface LoadingOptions {
  target?: LoadingTarget;
  body?: boolean;
  fullscreen?: boolean;
  closable?: boolean;
  /** Removes the indicator card surface while retaining the overlay. */
  plain?: boolean;
  lock?: boolean;
  text?: string;
  background?: string;
  variant?: LoadingVariant;
  svg?: string;
  svgViewBox?: string;
  customClass?: string;
  onClose?: () => void;
}

export interface LoadingInstance {
  close: () => void;
  setText: (text: string) => void;
}

export interface LoadingApi {
  (options?: LoadingOptions): LoadingInstance;
}

export type LoadingDirectiveValue = boolean | (LoadingOptions & { loading?: boolean });

export interface LoadingEmits {
  "update:loading": [loading: boolean];
  /** Requests that the controlled loading state be disabled. */
  close: [];
  /** Fires after the structural leave transaction has released its resources. */
  closed: [];
}

export interface LoadingSlots {
  default?: () => unknown;
  /** Custom loading icon or animation. */
  indicator?: () => unknown;
}
