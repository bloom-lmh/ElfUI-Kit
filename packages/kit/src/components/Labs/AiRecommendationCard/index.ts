import {
  defineEmits,
  defineHtml,
  defineProps,
  defineStyle,
  useHostAttr,
  useHostFlag,
} from "@elfui/core";

import styles from "./style.scss?inline";
import type {
  AiRecommendationAlternative,
  AiRecommendationCardEmits,
  AiRecommendationCardProps,
  AiRecommendationConfidence,
  AiRecommendationLabels,
  AiRecommendationSegment,
} from "./types";

export type {
  AiRecommendationAlternative,
  AiRecommendationCardElement,
  AiRecommendationCardEmits,
  AiRecommendationCardProps,
  AiRecommendationConfidence,
  AiRecommendationLabels,
  AiRecommendationSegment,
} from "./types";

const DEFAULT_LABELS: AiRecommendationLabels = {
  recommendation: "Recommendation",
  confidence: "Confidence",
  otherOptions: "Other options",
  alternatives: "Alternatives",
  accept: "Accept",
};

const CONFIDENCES: readonly AiRecommendationConfidence[] = ["high", "medium", "low"];

const props = defineProps<AiRecommendationCardProps>({
  title: { type: String, default: "" },
  segments: { type: Array, default: () => [] },
  confidence: { type: String, default: "high" },
  alternatives: { type: Array, default: () => [] },
  acceptLabel: { type: String, default: "" },
  alternativesLabel: { type: String, default: "" },
  showConfidence: { type: Boolean, default: true },
  labels: { type: Object, default: () => ({}) },
  ariaLabel: { type: String, default: "" },
});

const emit = defineEmits<AiRecommendationCardEmits>([
  "accept",
  "alternatives",
  "alternative-select",
]);

const label = (key: keyof AiRecommendationLabels): string =>
  props.labels?.[key] || DEFAULT_LABELS[key] || key;
const resolvedConfidence = (): AiRecommendationConfidence =>
  CONFIDENCES.includes(props.confidence as AiRecommendationConfidence)
    ? (props.confidence as AiRecommendationConfidence)
    : "high";
const segments = (): AiRecommendationSegment[] => props.segments;
const alternatives = (): AiRecommendationAlternative[] => props.alternatives;
const hasAlternatives = (): boolean => alternatives().length > 0;
const acceptText = (): string => props.acceptLabel || label("accept");
const alternativesText = (): string => props.alternativesLabel || label("alternatives");
const confidenceLabel = (): string => label("confidence");
const confidenceText = (): string => resolvedConfidence();
const signalKind = (alternative: AiRecommendationAlternative): string =>
  alternative.signalKind || (alternative.signal === "Needs review" ? "review" : "none");
const hostLabel = (): string => props.ariaLabel || `${label("recommendation")}: ${props.title}`;

const onAccept = (): void => {
  emit("accept");
};
const onAlternatives = (): void => {
  emit("alternatives");
};
const onAlternativeSelect = (event: Event): void => {
  const index = Number((event.currentTarget as HTMLElement).dataset.index);
  const alternative = alternatives()[index];
  if (alternative) emit("alternative-select", alternative);
};

useHostAttr("data-confidence", resolvedConfidence);
useHostFlag("data-has-alternatives", hasAlternatives);
useHostAttr("aria-label", hostLabel);

defineStyle(styles);

const AiRecommendationCard = defineHtml(`
  <article class="recommendation" role="group">
    <h3 class="title">${props.title}</h3>
    <p class="body">
      <span v-for="(segment, index) in segments()" :key="index">
        <code v-if="segment.code" class="inline-code">{{ segment.text }}</code>
        <span v-else>{{ segment.text }}</span>
      </span>
    </p>
    <div v-if=${hasAlternatives()} class="alternatives">
      <span class="alternatives-label">${label("otherOptions")}</span>
      <button
        v-for="(alternative, index) in alternatives()"
        :key="alternative.label + index"
        class="alternative"
        type="button"
        :data-index="index"
        @click=${onAlternativeSelect}
      >
        <span class="alternative-label">{{ alternative.label }}</span>
        <span class="signal" :class="'signal-' + signalKind(alternative)">{{ alternative.signal }}</span>
      </button>
    </div>
    <footer class="foot">
      <span v-if=${props.showConfidence} class="confidence">
        <span class="confidence-label">${confidenceLabel()}</span>
        <span class="meter" :class="'meter-' + confidenceText()" aria-hidden="true"></span>
        <span class="confidence-text">${confidenceText()}</span>
      </span>
      <span class="spacer"></span>
      <button v-if=${hasAlternatives()} class="secondary" type="button" @click=${onAlternatives}>${alternativesText()}</button>
      <button class="primary" type="button" @click=${onAccept}>${acceptText()}</button>
    </footer>
  </article>
`);

export { AiRecommendationCard };
