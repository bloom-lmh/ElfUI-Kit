import {
  defineEmits,
  defineExpose,
  defineHtml,
  defineProps,
  defineStyle,
  useHostAttr,
  useHostFlag,
  useRef,
} from "@elfui/core";

import styles from "./style.scss?inline";
import type {
  AiThinkingEmits,
  AiThinkingExpose,
  AiThinkingKind,
  AiThinkingLabels,
  AiThinkingProps,
  AiThinkingStatus,
  AiThinkingStep,
} from "./types";

export type {
  AiThinkingElement,
  AiThinkingEmits,
  AiThinkingExpose,
  AiThinkingKind,
  AiThinkingLabels,
  AiThinkingProps,
  AiThinkingStatus,
  AiThinkingStep,
} from "./types";

const DEFAULT_LABELS: AiThinkingLabels = {
  thinking: "Thinking",
  running: "Running",
  done: "Done",
  all: "All",
  steps: "Steps",
  reasoning: "Reasoning",
  search: "Search",
  coding: "Coding",
  expand: "Expand trace",
  collapse: "Collapse trace",
};

const KINDS: readonly AiThinkingKind[] = ["steps", "reasoning", "search", "coding"];
const STATUSES: readonly AiThinkingStatus[] = ["running", "done"];

interface AiThinkingTab {
  key: AiThinkingKind | "all";
  label: string;
  count: number;
}

const props = defineProps<AiThinkingProps>({
  title: { type: String, default: "Thought" },
  steps: { type: Array, default: () => [] },
  status: { type: String, default: "running" },
  collapsible: { type: Boolean, default: true },
  defaultExpanded: { type: Boolean, default: false },
  showHeader: { type: Boolean, default: true },
  labels: { type: Object, default: () => ({}) },
  ariaLabel: { type: String, default: "" },
});

const emit = defineEmits<AiThinkingEmits>(["toggle"]);
const expanded = useRef(Boolean(props.defaultExpanded));
const activeKind = useRef<AiThinkingKind | "all">("all");

const resolvedStatus = (): AiThinkingStatus =>
  STATUSES.includes(props.status as AiThinkingStatus)
    ? (props.status as AiThinkingStatus)
    : "running";
const label = (key: keyof AiThinkingLabels): string =>
  props.labels?.[key] || DEFAULT_LABELS[key] || key;
const kindLabel = (kind: AiThinkingKind | "all"): string =>
  kind === "all" ? label("all") : label(kind);
const isExpanded = (): boolean => !props.collapsible || expanded.value;
const statusLabel = (): string => label(resolvedStatus());
const statusText = (): string => `${label("thinking")} · ${props.title || ""} · ${statusLabel()}`;
const hostLabel = (): string => props.ariaLabel || statusText();
const hasSteps = (): boolean => props.steps.length > 0;

const normalizedKind = (value: string): AiThinkingKind | "all" =>
  value === "all" || KINDS.includes(value as AiThinkingKind)
    ? (value as AiThinkingKind | "all")
    : "all";
const stepKind = (step: AiThinkingStep): AiThinkingKind =>
  KINDS.includes(step.kind) ? step.kind : "steps";
const stepKey = (step: AiThinkingStep, index: number): string | number =>
  step.id ?? `thinking-step-${index}`;
const visibleSteps = (): AiThinkingStep[] =>
  activeKind.value === "all"
    ? props.steps
    : props.steps.filter((step) => stepKind(step) === activeKind.value);
const countFor = (kind: AiThinkingKind | "all"): number =>
  kind === "all"
    ? props.steps.length
    : props.steps.filter((step) => stepKind(step) === kind).length;
const kindTabs = (): AiThinkingTab[] =>
  (["all", ...KINDS] as (AiThinkingKind | "all")[]).map((key) => ({
    key,
    label: kindLabel(key),
    count: countFor(key),
  }));
const isActiveKind = (key: AiThinkingKind | "all"): boolean => activeKind.value === key;
const stepClass = (index: number): Record<string, boolean> => ({
  step: true,
  "is-active": resolvedStatus() === "running" && index === visibleSteps().length - 1,
});
const kindClass = (kind: AiThinkingKind): string => `kind-${kind}`;
const ariaExpanded = (): string => (isExpanded() ? "true" : "false");
const traceLabel = (): string => (isExpanded() ? label("collapse") : label("expand"));

const expand = (): void => {
  if (!props.collapsible || expanded.value) return;
  expanded.set(true);
  emit("toggle", true);
};
const collapse = (): void => {
  if (!props.collapsible || !expanded.value) return;
  expanded.set(false);
  emit("toggle", false);
};
const toggle = (): void => {
  if (!props.collapsible) return;
  if (expanded.value) collapse();
  else expand();
};
const onToggle = (): void => toggle();
const onKindClick = (event: Event): void => {
  const key = (event.currentTarget as HTMLElement).dataset.kind || "all";
  activeKind.set(normalizedKind(key));
};

useHostAttr("data-status", resolvedStatus);
useHostFlag("data-expanded", isExpanded);
useHostAttr("aria-label", hostLabel);

defineExpose<AiThinkingExpose>({ expand, collapse, toggle, isExpanded });

defineStyle(styles);

const AiThinking = defineHtml(`
  <div class="ai-thinking" role="group">
    <div v-if=${props.showHeader} class="summary">
      <span class="status-dot" aria-hidden="true"></span>
      <span class="title">${props.title}</span>
      <span class="status">${statusLabel()}</span>
      <button
        v-if=${props.collapsible}
        class="chevron-button"
        type="button"
        :aria-label=${traceLabel()}
        :aria-expanded=${ariaExpanded()}
        @click=${onToggle}
      >
        <span class="chevron" aria-hidden="true"></span>
      </button>
    </div>
    <div v-if=${isExpanded()} class="panel">
      <div v-if=${hasSteps()} class="kind-tabs" role="tablist" :aria-label=${label("thinking")}>
        <button
          v-for="tab in kindTabs()"
          :key="tab.key"
          class="kind-tab"
          :class="{ active: isActiveKind(tab.key) }"
          type="button"
          role="tab"
          :data-kind="tab.key"
          :aria-selected="String(isActiveKind(tab.key))"
          @click=${onKindClick}
        >
          <span>{{ tab.label }}</span>
          <span class="count">{{ tab.count }}</span>
        </button>
      </div>
      <ol v-if=${hasSteps()} class="steps">
        <li
          v-for="(step, index) in visibleSteps()"
          :key="stepKey(step, index)"
          :class="stepClass(index)"
        >
          <span class="step-icon" :class="kindClass(stepKind(step))" aria-hidden="true"></span>
          <div class="step-body">
            <span class="step-title">{{ step.title }}</span>
            <span v-if="step.detail" class="step-detail">{{ step.detail }}</span>
          </div>
          <span v-if="step.duration" class="step-duration">{{ step.duration }}</span>
        </li>
      </ol>
      <p v-else class="empty">${label("thinking")}</p>
    </div>
  </div>
`);

export { AiThinking };
