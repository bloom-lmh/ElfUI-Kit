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
  AiTaskRowEmits,
  AiTaskRowExpose,
  AiTaskRowLabels,
  AiTaskRowProps,
  AiTaskStatus,
  AiTaskStep,
  AiTaskStepState,
} from "./types";

export type {
  AiTaskItem,
  AiTaskRowElement,
  AiTaskRowEmits,
  AiTaskRowExpose,
  AiTaskRowLabels,
  AiTaskRowProps,
  AiTaskStatus,
  AiTaskStep,
  AiTaskStepState,
} from "./types";

const DEFAULT_LABELS: AiTaskRowLabels = {
  running: "Running",
  completed: "Completed",
  failed: "Failed",
  retry: "Retry",
  expand: "Expand task",
  collapse: "Collapse task",
  task: "Task",
};

const STATUSES: readonly AiTaskStatus[] = ["running", "completed", "failed"];
const STEP_STATES: readonly AiTaskStepState[] = ["pending", "running", "done", "failed"];

const props = defineProps<AiTaskRowProps>({
  task: { type: Object, default: () => ({ title: "", status: "running" }) },
  variant: { type: String, default: "list" },
  collapsible: { type: Boolean, default: true },
  defaultExpanded: { type: Boolean, default: false },
  showRetry: { type: Boolean, default: true },
  labels: { type: Object, default: () => ({}) },
  ariaLabel: { type: String, default: "" },
});

const emit = defineEmits<AiTaskRowEmits>(["toggle", "retry", "select"]);
const expanded = useRef(Boolean(props.defaultExpanded));

const label = (key: keyof AiTaskRowLabels): string =>
  props.labels?.[key] || DEFAULT_LABELS[key] || key;
const resolvedStatus = (): AiTaskStatus =>
  STATUSES.includes(props.task?.status as AiTaskStatus)
    ? (props.task.status as AiTaskStatus)
    : "running";
const statusLabel = (): string => label(resolvedStatus());
const taskTitle = (): string => props.task?.title || "";
const taskSubtitle = (): string => props.task?.subtitle || "";
const taskSteps = (): AiTaskStep[] => props.task?.steps || [];
const hasSteps = (): boolean => taskSteps().length > 0;
const isExpanded = (): boolean => !props.collapsible || expanded.value;
const hasSubtitle = (): boolean => Boolean(taskSubtitle());
const isFailed = (): boolean => resolvedStatus() === "failed";
const isRunning = (): boolean => resolvedStatus() === "running";
const hostLabel = (): string =>
  props.ariaLabel || `${label("task")}: ${taskTitle()} · ${statusLabel()}`;
const ariaExpanded = (): string => (isExpanded() ? "true" : "false");

const normalizedStepState = (step: AiTaskStep, index: number): AiTaskStepState => {
  if (step.state && STEP_STATES.includes(step.state)) return step.state;
  if (isFailed() && index === taskSteps().length - 1) return "failed";
  if (isRunning()) {
    return index === taskSteps().length - 1 ? "running" : "done";
  }
  return "done";
};
const stepState = (step: AiTaskStep, index: number): AiTaskStepState =>
  normalizedStepState(step, index);
const stepClass = (state: AiTaskStepState): Record<string, boolean> => ({
  "is-pending": state === "pending",
  "is-running": state === "running",
  "is-done": state === "done",
  "is-failed": state === "failed",
});

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
const onRetry = (): void => {
  emit("retry");
};

useHostAttr("data-status", resolvedStatus);
useHostAttr("data-variant", () => (props.variant === "capsule" ? "capsule" : "list"));
useHostFlag("data-expanded", isExpanded);
useHostAttr("aria-label", hostLabel);

defineExpose<AiTaskRowExpose>({ expand, collapse, toggle, isExpanded });

defineStyle(styles);

const AiTaskRow = defineHtml(`
  <div class="task-row" role="group">
    <div class="summary">
      <button class="task-button" type="button" :aria-expanded=${ariaExpanded()} @click=${onToggle}>
        <span class="status-icon" aria-hidden="true"></span>
        <span class="titles">
          <span class="title">${taskTitle()}</span>
          <span v-if=${hasSubtitle()} class="subtitle">${taskSubtitle()}</span>
        </span>
        <span class="status-chip">${statusLabel()}</span>
        <span v-if=${props.collapsible} class="chevron" aria-hidden="true"></span>
      </button>
      <button v-if=${isFailed() && props.showRetry} class="retry" type="button" @click=${onRetry}>${label("retry")}</button>
    </div>
    <div v-if=${isExpanded() && hasSteps()} class="steps">
      <div
        v-for="(step, index) in taskSteps()"
        :key="step.label + index"
        class="step"
        :class="stepClass(stepState(step, index))"
      >
        <span class="step-icon" aria-hidden="true"></span>
        <span class="step-label">{{ step.label }}</span>
        <span v-if="step.detail" class="step-detail">{{ step.detail }}</span>
      </div>
    </div>
  </div>
`);

export { AiTaskRow };
