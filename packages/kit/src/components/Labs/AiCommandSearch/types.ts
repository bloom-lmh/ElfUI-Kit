/** One command shown in the search palette. */
export interface AiCommandItem {
  id?: string | number;
  title: string;
  description?: string;
  hint?: string;
  keywords?: string;
}

/** User-facing labels for `elf-ai-command-search`. */
export interface AiCommandLabels {
  placeholder: string;
  empty: string;
  results: string;
  select: string;
}

/** Public properties for `elf-ai-command-search`. */
export interface AiCommandSearchProps {
  items: AiCommandItem[];
  placeholder: string;
  emptyText: string;
  maxResults: number;
  autofocus: boolean;
  labels: Partial<AiCommandLabels>;
  ariaLabel: string;
}

/** Payload emitted when a command is submitted. */
export interface AiCommandSubmitDetail {
  query: string;
  item: AiCommandItem | null;
}

/** Semantic events emitted by `elf-ai-command-search`. */
export interface AiCommandSearchEmits {
  select: [detail: AiCommandItem];
  "query-change": [query: string];
  submit: [detail: AiCommandSubmitDetail];
}

/** Imperative methods exposed by `elf-ai-command-search`. */
export interface AiCommandSearchExpose {
  focus(): void;
  blur(): void;
  clear(): void;
  getQuery(): string;
}

export type AiCommandSearchElement = HTMLElement &
  Partial<AiCommandSearchProps> &
  AiCommandSearchExpose;
