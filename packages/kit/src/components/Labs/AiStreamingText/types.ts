/** One inline source attached to a streamed answer. */
export interface AiStreamSource {
  label: string;
  url?: string;
  domain?: string;
}

/** One action chip rendered below the answer. */
export interface AiStreamAction {
  label: string;
  value?: string;
  tone?: "default" | "primary" | "ghost";
}

/** User-facing labels for `elf-ai-streaming-text`. */
export interface AiStreamingTextLabels {
  sources: string;
  actions: string;
  followUps: string;
  streaming: string;
  complete: string;
}

/** Public properties for `elf-ai-streaming-text`. */
export interface AiStreamingTextProps {
  content: string;
  sources: AiStreamSource[];
  actions: AiStreamAction[];
  followUps: string[];
  streaming: boolean;
  /** Milliseconds between revealed words while streaming. */
  streamSpeed: number;
  showSources: boolean;
  showActions: boolean;
  showFollowUps: boolean;
  labels: Partial<AiStreamingTextLabels>;
  ariaLabel: string;
}

/** Semantic events emitted by `elf-ai-streaming-text`. */
export interface AiStreamingTextEmits {
  action: [detail: AiStreamAction];
  "follow-up": [value: string];
  complete: [];
}

/** Imperative methods exposed by `elf-ai-streaming-text`. */
export interface AiStreamingTextExpose {
  revealAll(): void;
  reset(): void;
}

export type AiStreamingTextElement = HTMLElement &
  Partial<AiStreamingTextProps> &
  AiStreamingTextExpose;
