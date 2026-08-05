/** Lifecycle state of agent-written code. */
export type AiCodeBlockStatus = "idle" | "streaming" | "complete" | "error";

/** Surface scheme for syntax colors. `auto` follows the document theme. */
export type AiCodeBlockTheme = "auto" | "light" | "dark";

/** Syntax palette family. */
export type AiCodeBlockCodeTheme = "github" | "vitesse" | "material";

/** User-facing labels for `elf-ai-code-block`. */
export interface AiCodeBlockLabels {
  copy: string;
  copied: string;
  copyFailed: string;
  streaming: string;
  idle: string;
  complete: string;
  error: string;
  language: string;
  lines: string;
}

/** Public properties for `elf-ai-code-block`. */
export interface AiCodeBlockProps {
  code: string;
  filename: string;
  language: string;
  status: AiCodeBlockStatus;
  /** Milliseconds between revealed lines while streaming. */
  streamSpeed: number;
  theme: AiCodeBlockTheme;
  codeTheme: AiCodeBlockCodeTheme;
  showLineNumbers: boolean;
  copyable: boolean;
  labels: Partial<AiCodeBlockLabels>;
  ariaLabel: string;
}

/** Snapshot emitted when the code block is copied. */
export interface AiCodeBlockCopyDetail {
  filename: string;
  language: string;
  code: string;
}

/** Semantic events emitted by `elf-ai-code-block`. */
export interface AiCodeBlockEmits {
  complete: [];
  copy: [detail: AiCodeBlockCopyDetail];
  "copy-error": [error: unknown];
}

/** Imperative methods exposed by `elf-ai-code-block`. */
export interface AiCodeBlockExpose {
  copy(): Promise<boolean>;
  revealAll(): void;
  reset(): void;
}

export type AiCodeBlockElement = HTMLElement & Partial<AiCodeBlockProps> & AiCodeBlockExpose;
