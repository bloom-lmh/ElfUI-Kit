/** Pixel-grid loader variants. */
export type AiLoadingVariant = "drive" | "dots" | "orbit";

/** User-facing labels for the loader. */
export interface AiLoadingLabels {
  /** Accessible name when no `ariaLabel` is provided. */
  loading: string;
}

/** Public properties for `elf-ai-loading`. */
export interface AiLoadingProps {
  label: string;
  variant: AiLoadingVariant;
  showTimer: boolean;
  labels: Partial<AiLoadingLabels>;
  ariaLabel: string;
}

/** Imperative methods exposed by `elf-ai-loading`. */
export interface AiLoadingExpose {
  /** Restarts the elapsed timer from zero. */
  resetTimer(): void;
}

export type AiLoadingElement = HTMLElement & Partial<AiLoadingProps> & AiLoadingExpose;
