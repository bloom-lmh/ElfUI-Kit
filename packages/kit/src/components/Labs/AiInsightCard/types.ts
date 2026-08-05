/** One text, mention, or code fragment of an insight. */
export interface AiInsightSegment {
  text: string;
  code?: boolean;
  mention?: boolean;
}

/** One mini metric row rendered below an insight. */
export interface AiInsightSpark {
  label: string;
  change: string;
  amount?: string;
  tone?: "good" | "bad" | "neutral";
}

/** One paged agent insight. */
export interface AiInsight {
  id?: string | number;
  segments: AiInsightSegment[];
  sparks?: AiInsightSpark[];
  cta?: string;
}

/** User-facing labels for `elf-ai-insight-card`. */
export interface AiInsightCardLabels {
  insights: string;
  previous: string;
  next: string;
  cta: string;
}

/** Public properties for `elf-ai-insight-card`. */
export interface AiInsightCardProps {
  insights: AiInsight[];
  defaultIndex: number;
  title: string;
  showPager: boolean;
  labels: Partial<AiInsightCardLabels>;
  ariaLabel: string;
}

/** Payload emitted when an insight CTA fires. */
export interface AiInsightCtaDetail {
  index: number;
  cta: string;
}

/** Semantic events emitted by `elf-ai-insight-card`. */
export interface AiInsightCardEmits {
  change: [index: number];
  cta: [detail: AiInsightCtaDetail];
}

/** Imperative methods exposed by `elf-ai-insight-card`. */
export interface AiInsightCardExpose {
  next(): boolean;
  previous(): boolean;
  goTo(index: number): boolean;
}

export type AiInsightCardElement = HTMLElement & Partial<AiInsightCardProps> & AiInsightCardExpose;
