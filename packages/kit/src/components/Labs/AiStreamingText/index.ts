import {
  defineEmits,
  defineExpose,
  defineHtml,
  defineProps,
  defineStyle,
  onUnmounted,
  useEffect,
  useHostAttr,
  useHostFlag,
  useRef,
} from "@elfui/core";

import styles from "./style.scss?inline";
import type {
  AiStreamAction,
  AiStreamingTextEmits,
  AiStreamingTextExpose,
  AiStreamingTextLabels,
  AiStreamingTextProps,
  AiStreamSource,
} from "./types";

export type {
  AiStreamAction,
  AiStreamingTextElement,
  AiStreamingTextEmits,
  AiStreamingTextExpose,
  AiStreamingTextLabels,
  AiStreamingTextProps,
  AiStreamSource,
} from "./types";

const DEFAULT_LABELS: AiStreamingTextLabels = {
  sources: "Sources",
  actions: "Actions",
  followUps: "Follow-ups",
  streaming: "Streaming",
  complete: "Complete",
};

const props = defineProps<AiStreamingTextProps>({
  content: { type: String, default: "" },
  sources: { type: Array, default: () => [] },
  actions: { type: Array, default: () => [] },
  followUps: { type: Array, default: () => [] },
  streaming: { type: Boolean, default: false },
  streamSpeed: { type: Number, default: 40 },
  showSources: { type: Boolean, default: true },
  showActions: { type: Boolean, default: true },
  showFollowUps: { type: Boolean, default: true },
  labels: { type: Object, default: () => ({}) },
  ariaLabel: { type: String, default: "" },
});

const emit = defineEmits<AiStreamingTextEmits>(["action", "follow-up", "complete"]);
const revealed = useRef(0);
const streamingActive = useRef(false);
const completed = useRef(false);
const lastSource = useRef("");
let streamTimer: ReturnType<typeof setInterval> | undefined;

const label = (key: keyof AiStreamingTextLabels): string =>
  props.labels?.[key] || DEFAULT_LABELS[key] || key;
const sourceWords = (): string[] => props.content.split(/\s+/u).filter(Boolean);
const totalWords = (): number => sourceWords().length;
const visibleText = (): string => sourceWords().slice(0, revealed.value).join(" ");
const sources = (): AiStreamSource[] => props.sources;
const actions = (): AiStreamAction[] => props.actions;
const followUps = (): string[] => props.followUps;
const hasSources = (): boolean => props.showSources && sources().length > 0;
const hasActions = (): boolean => props.showActions && actions().length > 0;
const hasFollowUps = (): boolean => props.showFollowUps && followUps().length > 0;
const actionValue = (action: AiStreamAction): string => action.value || action.label;
const sourceDomain = (source: AiStreamSource): string =>
  source.domain ||
  (source.url ? new URL(source.url).hostname.replace(/^www\./u, "") : source.label);
const hostLabel = (): string => props.ariaLabel || props.content.slice(0, 120);

const stopStream = (): void => {
  if (streamTimer) {
    clearInterval(streamTimer);
    streamTimer = undefined;
  }
  streamingActive.set(false);
};

const advanceStream = (): void => {
  const next = revealed.value + 1;
  revealed.set(next);
  if (next >= totalWords()) {
    stopStream();
    if (!completed.value) {
      completed.set(true);
      emit("complete");
    }
  }
};

const startStream = (): void => {
  if (streamingActive.value || revealed.value >= totalWords()) return;
  streamingActive.set(true);
  streamTimer = setInterval(advanceStream, Math.max(10, Number(props.streamSpeed) || 40));
};

useEffect(() => {
  if (props.content !== lastSource.value) {
    lastSource.set(props.content);
    revealed.set(0);
    completed.set(false);
  }
});

useEffect(() => {
  if (props.streaming) {
    startStream();
    return undefined;
  }
  stopStream();
  revealed.set(totalWords());
  return undefined;
});

const revealAll = (): void => {
  revealed.set(totalWords());
  stopStream();
  if (!completed.value && totalWords() > 0) {
    completed.set(true);
    emit("complete");
  }
};

const reset = (): void => {
  stopStream();
  revealed.set(0);
  completed.set(false);
};

const onAction = (event: Event): void => {
  const index = Number((event.currentTarget as HTMLElement).dataset.index);
  const action = actions()[index];
  if (action) emit("action", action);
};

const onFollowUp = (event: Event): void => {
  const index = Number((event.currentTarget as HTMLElement).dataset.index);
  const value = followUps()[index];
  if (value) emit("follow-up", value);
};

onUnmounted(stopStream);

useHostFlag("data-streaming", () => streamingActive.value);
useHostFlag("data-complete", () => completed.value);
useHostAttr("aria-label", hostLabel);

defineExpose<AiStreamingTextExpose>({ revealAll, reset });

defineStyle(styles);

const AiStreamingText = defineHtml(`
  <article class="stream" :aria-label=${props.ariaLabel}>
    <div class="answer">
      <slot>{{ visibleText() }}<span v-if=${streamingActive} class="caret" aria-hidden="true"></span></slot>
    </div>
    <div v-if=${hasActions()} class="actions">
      <slot name="actions">
        <button
          v-for="(action, index) in actions()"
          :key="actionValue(action) + index"
          class="action"
          :class="'tone-' + (action.tone || 'default')"
          type="button"
          :data-index="index"
          @click=${onAction}
        >{{ action.label }}</button>
      </slot>
    </div>
    <div v-if=${hasSources()} class="sources">
      <span class="section-label">${label("sources")}</span>
      <slot name="sources">
        <a
          v-for="(source, index) in sources()"
          :key="source.label + index"
          class="source"
          :href="source.url || '#'"
          target="_blank"
          rel="noopener noreferrer"
        >
          <span class="source-label">{{ source.label }}</span>
          <span class="source-domain">{{ sourceDomain(source) }}</span>
        </a>
      </slot>
    </div>
    <div v-if=${hasFollowUps()} class="follow-ups">
      <span class="section-label">${label("followUps")}</span>
      <slot name="follow-ups">
        <button
          v-for="(value, index) in followUps()"
          :key="value + index"
          class="follow-up"
          type="button"
          :data-index="index"
          @click=${onFollowUp}
        >{{ value }}</button>
      </slot>
    </div>
  </article>
`);

export { AiStreamingText };
