import {
  defineEmits,
  defineExpose,
  defineHtml,
  defineProps,
  defineStyle,
  useEffect,
  useHostAttr,
  useRef,
} from "@elfui/core";

import styles from "./style.scss?inline";
import type {
  AiInsight,
  AiInsightCardEmits,
  AiInsightCardExpose,
  AiInsightCardLabels,
  AiInsightCardProps,
  AiInsightCtaDetail,
  AiInsightSegment,
  AiInsightSpark,
} from "./types";

export type {
  AiInsight,
  AiInsightCardElement,
  AiInsightCardEmits,
  AiInsightCardExpose,
  AiInsightCardLabels,
  AiInsightCardProps,
  AiInsightCtaDetail,
  AiInsightSegment,
  AiInsightSpark,
} from "./types";

const DEFAULT_LABELS: AiInsightCardLabels = {
  insights: "Insights",
  previous: "Previous insight",
  next: "Next insight",
  cta: "Ask agent",
};

const props = defineProps<AiInsightCardProps>({
  insights: { type: Array, default: () => [] },
  defaultIndex: { type: Number, default: 0 },
  title: { type: String, default: "" },
  showPager: { type: Boolean, default: true },
  labels: { type: Object, default: () => ({}) },
  ariaLabel: { type: String, default: "" },
});

const emit = defineEmits<AiInsightCardEmits>(["change", "cta"]);
const currentIndex = useRef(0);
let lastKey = "";

const label = (key: keyof AiInsightCardLabels): string =>
  props.labels?.[key] || DEFAULT_LABELS[key] || key;
const clampIndex = (value: number): number =>
  Math.min(Math.max(0, Number(value) || 0), Math.max(0, props.insights.length - 1));
const insightsKey = (): string =>
  props.insights
    .map((insight) => String(insight.id ?? insight.cta ?? insight.segments[0]?.text ?? ""))
    .join("\u0000");
const currentInsight = (): AiInsight =>
  props.insights[clampIndex(currentIndex.value)] || { segments: [] };
const segments = (): AiInsightSegment[] => currentInsight().segments || [];
const sparks = (): AiInsightSpark[] => currentInsight().sparks || [];
const hasSparks = (): boolean => sparks().length > 0;
const cta = (): string => currentInsight().cta || "";
const hasCta = (): boolean => Boolean(cta());
const isFirst = (): boolean => clampIndex(currentIndex.value) === 0;
const isLast = (): boolean => clampIndex(currentIndex.value) >= props.insights.length - 1;
const count = (): number => props.insights.length;
const counter = (): string => `${clampIndex(currentIndex.value) + 1} / ${Math.max(count(), 1)}`;
const title = (): string => props.title || label("insights");
const sparkTone = (spark: AiInsightSpark): string =>
  spark.tone ||
  (spark.change.startsWith("-") ? "bad" : spark.change.startsWith("+") ? "good" : "neutral");
const hostLabel = (): string => props.ariaLabel || `${title()} · ${counter()}`;

useEffect(() => {
  const key = insightsKey();
  if (key !== lastKey) {
    lastKey = key;
    currentIndex.set(clampIndex(props.defaultIndex));
  }
});

const goTo = (index: number): boolean => {
  const nextIndex = clampIndex(index);
  if (nextIndex === clampIndex(currentIndex.value)) return false;
  currentIndex.set(nextIndex);
  emit("change", nextIndex);
  return true;
};
const next = (): boolean => goTo(clampIndex(currentIndex.value) + 1);
const previous = (): boolean => goTo(clampIndex(currentIndex.value) - 1);
const onNext = (): void => void next();
const onPrevious = (): void => void previous();
const onCta = (): void => {
  const value = cta();
  if (!value) return;
  const detail: AiInsightCtaDetail = { index: clampIndex(currentIndex.value), cta: value };
  emit("cta", detail);
};

useHostAttr("data-index", () => String(clampIndex(currentIndex.value)));
useHostAttr("aria-label", hostLabel);

defineExpose<AiInsightCardExpose>({ next, previous, goTo });

defineStyle(styles);

const AiInsightCard = defineHtml(`
  <article class="insight-card" role="group">
    <header class="head">
      <span class="title">${title()}</span>
      <span class="count">${count()}</span>
      <span class="spacer"></span>
      <slot name="header-extra"></slot>
      <button
        v-if=${props.showPager}
        class="nav-button"
        type="button"
        :disabled=${isFirst()}
        :aria-label=${label("previous")}
        :title=${label("previous")}
        @click=${onPrevious}
      >
        <span class="prev-icon" aria-hidden="true"></span>
      </button>
      <button
        v-if=${props.showPager}
        class="nav-button"
        type="button"
        :disabled=${isLast()}
        :aria-label=${label("next")}
        :title=${label("next")}
        @click=${onNext}
      >
        <span class="next-icon" aria-hidden="true"></span>
      </button>
    </header>
    <div class="body">
      <p class="text">
        <span v-for="(segment, index) in segments()" :key="index">
          <span v-if="segment.mention" class="mention">{{ segment.text }}</span>
          <code v-else-if="segment.code" class="inline-code">{{ segment.text }}</code>
          <span v-else>{{ segment.text }}</span>
        </span>
      </p>
      <div v-if=${hasSparks()} class="sparks">
        <slot name="chart">
          <div v-for="(spark, index) in sparks()" :key="spark.label + index" class="spark">
            <span class="spark-label">{{ spark.label }}</span>
            <span class="spark-change" :class="'tone-' + sparkTone(spark)">{{ spark.change }}</span>
            <code v-if="spark.amount" class="spark-amount">{{ spark.amount }}</code>
          </div>
        </slot>
      </div>
      <button v-if=${hasCta()} class="cta" type="button" @click=${onCta}>${cta()}</button>
    </div>
    <footer class="foot"><slot name="footer"></slot></footer>
  </article>
`);

export { AiInsightCard };
