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
  ChatToolCallEmits,
  ChatToolCallExpose,
  ChatToolCallLabels,
  ChatToolCallProps,
  ChatToolCallStatus,
} from "./types";

export type {
  ChatToolCallElement,
  ChatToolCallEmits,
  ChatToolCallExpose,
  ChatToolCallLabels,
  ChatToolCallProps,
  ChatToolCallStatus,
} from "./types";

const DEFAULT_LABELS: ChatToolCallLabels = {
  tool: "Tool",
  pending: "Queued",
  running: "Running",
  success: "Done",
  error: "Failed",
  arguments: "Arguments",
  result: "Result",
  expand: "Expand",
  collapse: "Collapse",
  retry: "Retry",
  duration: "Duration",
};

const STATUSES: readonly ChatToolCallStatus[] = ["pending", "running", "success", "error"];

const props = defineProps<ChatToolCallProps>({
  name: { type: String, default: "" },
  status: { type: String, default: "running" },
  duration: { type: String, default: "" },
  arguments: { type: String, default: "" },
  result: { type: String, default: "" },
  error: { type: String, default: "" },
  collapsible: { type: Boolean, default: true },
  defaultExpanded: { type: Boolean, default: false },
  labels: { type: Object, default: () => ({}) },
  ariaLabel: { type: String, default: "" },
});

const emit = defineEmits<ChatToolCallEmits>(["toggle", "retry"]);
const expanded = useRef(Boolean(props.defaultExpanded));

const resolvedStatus = (): ChatToolCallStatus =>
  STATUSES.includes(props.status as ChatToolCallStatus)
    ? (props.status as ChatToolCallStatus)
    : "running";
const label = (key: keyof ChatToolCallLabels): string =>
  props.labels?.[key] || DEFAULT_LABELS[key] || key;
const statusLabel = (): string => label(resolvedStatus());
const hasDuration = (): boolean => Boolean(props.duration);
const hasArguments = (): boolean => Boolean(props.arguments);
const hasResult = (): boolean => Boolean(props.result);
const hasError = (): boolean => resolvedStatus() === "error" && Boolean(props.error);
const isExpanded = (): boolean => !props.collapsible || expanded.value;
const showDetails = (): boolean => isExpanded();
const ariaExpanded = (): string => (isExpanded() ? "true" : "false");
const summaryLabel = (): string =>
  props.ariaLabel || `${label("tool")}: ${props.name || ""} · ${statusLabel()}`;

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

const onRetry = (): void => {
  emit("retry");
};

useHostAttr("data-status", resolvedStatus);
useHostFlag("data-expanded", isExpanded);
useHostAttr("aria-label", summaryLabel);

defineExpose<ChatToolCallExpose>({ expand, collapse, toggle, isExpanded });

defineStyle(styles);

const ChatToolCall = defineHtml(`
  <div class="tool-call" role="group">
    <button
      class="summary"
      type="button"
      :aria-expanded=${ariaExpanded()}
      :aria-label=${summaryLabel()}
      :disabled=${!props.collapsible}
      @click=${toggle}
    >
      <span class="icon" aria-hidden="true"></span>
      <span class="name">${props.name}</span>
      <span class="status">${statusLabel()}</span>
      <span v-if=${hasDuration()} class="duration">${props.duration}</span>
      <span v-if=${props.collapsible} class="chevron" aria-hidden="true"></span>
    </button>
    <div v-if=${showDetails()} class="details">
      <div v-if=${hasArguments()} class="block">
        <span class="block-title">${label("arguments")}</span>
        <pre class="code">${props.arguments}</pre>
      </div>
      <div v-if=${hasResult()} class="block">
        <span class="block-title">${label("result")}</span>
        <pre class="code">${props.result}</pre>
      </div>
      <div v-if=${hasError()} class="block is-error">
        <span class="block-title">${label("error")}</span>
        <pre class="code">${props.error}</pre>
      </div>
      <div v-if=${resolvedStatus() === "error"} class="footer-actions">
        <button class="retry" type="button" @click=${onRetry}>${label("retry")}</button>
      </div>
    </div>
  </div>
`);

export { ChatToolCall };
