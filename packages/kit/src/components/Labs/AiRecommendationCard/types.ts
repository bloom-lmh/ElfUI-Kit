/** Confidence level shown by the recommendation meter. */
export type AiRecommendationConfidence = "high" | "medium" | "low";

/** One text or code fragment of the recommendation body. */
export interface AiRecommendationSegment {
  text: string;
  code?: boolean;
}

/** An alternative action with a supporting signal label. */
export interface AiRecommendationAlternative {
  label: string;
  signal: string;
  signalKind?: "review" | "none" | "good";
}

/** User-facing labels for `elf-ai-recommendation-card`. */
export interface AiRecommendationLabels {
  recommendation: string;
  confidence: string;
  otherOptions: string;
  alternatives: string;
  accept: string;
}

/** Public properties for `elf-ai-recommendation-card`. */
export interface AiRecommendationCardProps {
  title: string;
  segments: AiRecommendationSegment[];
  confidence: AiRecommendationConfidence;
  alternatives: AiRecommendationAlternative[];
  acceptLabel: string;
  alternativesLabel: string;
  showConfidence: boolean;
  labels: Partial<AiRecommendationLabels>;
  ariaLabel: string;
}

/** Semantic events emitted by `elf-ai-recommendation-card`. */
export interface AiRecommendationCardEmits {
  accept: [];
  alternatives: [];
  "alternative-select": [detail: AiRecommendationAlternative];
}

export type AiRecommendationCardElement = HTMLElement & Partial<AiRecommendationCardProps>;
