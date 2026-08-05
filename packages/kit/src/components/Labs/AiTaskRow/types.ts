/** Lifecycle state of an agent task. */
export type AiTaskStatus = "running" | "completed" | "failed";

/** Per-step state inside a task row. */
export type AiTaskStepState = "pending" | "running" | "done" | "failed";

/** One sub-step rendered inside an expanded task. */
export interface AiTaskStep {
  label: string;
  detail?: string;
  state?: AiTaskStepState;
}

/** A single agent task with optional sub-steps. */
export interface AiTaskItem {
  id?: string | number;
  title: string;
  subtitle?: string;
  status: AiTaskStatus;
  steps?: AiTaskStep[];
}

/** User-facing labels for `elf-ai-task-row`. */
export interface AiTaskRowLabels {
  running: string;
  completed: string;
  failed: string;
  retry: string;
  expand: string;
  collapse: string;
  task: string;
}

/** Public properties for `elf-ai-task-row`. */
export interface AiTaskRowProps {
  task: AiTaskItem;
  variant: "list" | "capsule";
  collapsible: boolean;
  defaultExpanded: boolean;
  showRetry: boolean;
  labels: Partial<AiTaskRowLabels>;
  ariaLabel: string;
}

/** Semantic events emitted by `elf-ai-task-row`. */
export interface AiTaskRowEmits {
  toggle: [expanded: boolean];
  retry: [];
  select: [];
}

/** Imperative methods exposed by `elf-ai-task-row`. */
export interface AiTaskRowExpose {
  expand(): void;
  collapse(): void;
  toggle(): void;
  isExpanded(): boolean;
}

export type AiTaskRowElement = HTMLElement & Partial<AiTaskRowProps> & AiTaskRowExpose;
