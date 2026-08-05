/** One selectable answer for an approval question. */
export interface AiApprovalOption {
  label: string;
  value: string;
}

/** A human-in-the-loop question the agent asks before acting. */
export interface AiApprovalQuestion {
  id?: string | number;
  title: string;
  description?: string;
  options: AiApprovalOption[];
  customPlaceholder?: string;
}

/** Payload emitted when an answer is confirmed. */
export interface AiApprovalAnswerDetail {
  index: number;
  question: AiApprovalQuestion;
  value: string;
  custom: boolean;
}

/** User-facing labels for `elf-ai-approval-card`. */
export interface AiApprovalLabels {
  question: string;
  of: string;
  dismiss: string;
  custom: string;
  previous: string;
  next: string;
  confirm: string;
}

/** Public properties for `elf-ai-approval-card`. */
export interface AiApprovalCardProps {
  questions: AiApprovalQuestion[];
  defaultIndex: number;
  confirmLabel: string;
  dismissLabel: string;
  required: boolean;
  showProgress: boolean;
  labels: Partial<AiApprovalLabels>;
  ariaLabel: string;
}

/** Semantic events emitted by `elf-ai-approval-card`. */
export interface AiApprovalCardEmits {
  confirm: [detail: AiApprovalAnswerDetail];
  dismiss: [detail: { index: number }];
  change: [detail: { index: number; value: string }];
  "question-change": [index: number];
}

/** Imperative methods exposed by `elf-ai-approval-card`. */
export interface AiApprovalCardExpose {
  next(): boolean;
  previous(): boolean;
  confirm(): boolean;
  reset(): void;
}

export type AiApprovalCardElement = HTMLElement &
  Partial<AiApprovalCardProps> &
  AiApprovalCardExpose;
