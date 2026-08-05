/** Source file category rendered as a small chip. */
export type AiContextSourceKind = "pdf" | "csv" | "web" | "doc";

/** User-facing labels for `elf-ai-context-card`. */
export interface AiContextCardLabels {
  characters: string;
  source: string;
  select: string;
}

/** Public properties for `elf-ai-context-card`. */
export interface AiContextCardProps {
  title: string;
  content: string;
  characters: number;
  sourceKind: AiContextSourceKind;
  sourceName: string;
  selectable: boolean;
  labels: Partial<AiContextCardLabels>;
  ariaLabel: string;
}

/** Semantic events emitted by `elf-ai-context-card`. */
export interface AiContextCardEmits {
  select: [];
}

export type AiContextCardElement = HTMLElement & Partial<AiContextCardProps>;
