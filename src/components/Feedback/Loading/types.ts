export type LoadingVariant = "spinner" | "dots" | "pulse" | "bars";

export interface LoadingProps {
  loading: boolean;
  text: string;
  fullscreen: boolean;
  background: string;
  closable: boolean;
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
  close: [];
}

export interface LoadingSlots {
  default?: () => unknown;
}
