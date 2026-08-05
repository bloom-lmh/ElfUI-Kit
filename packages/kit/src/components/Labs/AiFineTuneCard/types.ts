/** Inspector control kind. */
export type AiFineTunePropertyKind = "number" | "select" | "text";

/** One selectable option for `select` properties. */
export interface AiFineTuneOption {
  label: string;
  value: string;
}

/** One adjustable design property. */
export interface AiFineTuneProperty {
  key: string;
  label: string;
  kind: AiFineTunePropertyKind;
  value: number | string;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  options?: AiFineTuneOption[];
}

/** User-facing labels for `elf-ai-fine-tune-card`. */
export interface AiFineTuneLabels {
  adjust: string;
  type: string;
}

/** Public properties for `elf-ai-fine-tune-card`. */
export interface AiFineTuneCardProps {
  title: string;
  adjustLabel: string;
  properties: AiFineTuneProperty[];
  labels: Partial<AiFineTuneLabels>;
  ariaLabel: string;
}

/** Payload emitted when a property changes. */
export interface AiFineTuneChangeDetail {
  key: string;
  value: number | string;
  property: AiFineTuneProperty;
}

/** Semantic events emitted by `elf-ai-fine-tune-card`. */
export interface AiFineTuneCardEmits {
  change: [detail: AiFineTuneChangeDetail];
}

/** Imperative methods exposed by `elf-ai-fine-tune-card`. */
export interface AiFineTuneCardExpose {
  getValues(): Record<string, number | string>;
  setValue(key: string, value: number | string): void;
}

export type AiFineTuneCardElement = HTMLElement &
  Partial<AiFineTuneCardProps> &
  AiFineTuneCardExpose;
