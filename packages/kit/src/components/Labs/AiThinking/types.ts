/** Trace categories rendered as filter tabs. */
export type AiThinkingKind = "steps" | "reasoning" | "search" | "coding";

/** One trace step inside the expandable thinking panel. */
export interface AiThinkingStep {
  id?: string | number;
  title: string;
  kind: AiThinkingKind;
  detail?: string;
  duration?: string;
}

/** Lifecycle state of the trace. */
export type AiThinkingStatus = "running" | "done";

/** User-facing labels for `elf-ai-thinking`. */
export interface AiThinkingLabels {
  thinking: string;
  running: string;
  done: string;
  all: string;
  steps: string;
  reasoning: string;
  search: string;
  coding: string;
  expand: string;
  collapse: string;
}

/** Public properties for `elf-ai-thinking`. */
export interface AiThinkingProps {
  title: string;
  steps: AiThinkingStep[];
  status: AiThinkingStatus;
  collapsible: boolean;
  defaultExpanded: boolean;
  showHeader: boolean;
  labels: Partial<AiThinkingLabels>;
  ariaLabel: string;
}

/** Semantic events emitted by `elf-ai-thinking`. */
export interface AiThinkingEmits {
  toggle: [expanded: boolean];
}

/** Imperative methods exposed by `elf-ai-thinking`. */
export interface AiThinkingExpose {
  expand(): void;
  collapse(): void;
  toggle(): void;
  isExpanded(): boolean;
}

export type AiThinkingElement = HTMLElement & Partial<AiThinkingProps> & AiThinkingExpose;
