/** Semantic kind rendered as a compact chip icon. */
export type AiToolChipKind = "tool" | "edit" | "think" | "shell" | "image";

/** Lifecycle state of a compact tool chip. */
export type AiToolChipStatus = "idle" | "running" | "success" | "error";

/** One compact chip with optional expandable details. */
export interface AiToolChipItem {
  id?: string | number;
  kind: AiToolChipKind;
  title: string;
  detail?: string;
  meta?: string;
  status?: AiToolChipStatus;
}

/** A file-change summary rendered below expanded chips. */
export interface AiToolChipFile {
  name: string;
  additions: number;
  deletions: number;
}

/** User-facing labels for `elf-ai-tool-chips`. */
export interface AiToolChipsLabels {
  toolCalls: string;
  messages: string;
  files: string;
  expand: string;
  collapse: string;
  tool: string;
  edit: string;
  think: string;
  shell: string;
  image: string;
  idle: string;
  running: string;
  success: string;
  error: string;
}

/** Public properties for `elf-ai-tool-chips`. */
export interface AiToolChipsProps {
  summary: string;
  items: AiToolChipItem[];
  files: AiToolChipFile[];
  collapsible: boolean;
  defaultExpanded: boolean;
  labels: Partial<AiToolChipsLabels>;
  ariaLabel: string;
}

/** Semantic events emitted by `elf-ai-tool-chips`. */
export interface AiToolChipsEmits {
  toggle: [expanded: boolean];
  "item-click": [detail: AiToolChipItem];
}

/** Imperative methods exposed by `elf-ai-tool-chips`. */
export interface AiToolChipsExpose {
  expand(): void;
  collapse(): void;
  toggle(): void;
  isExpanded(): boolean;
}

export type AiToolChipsElement = HTMLElement & Partial<AiToolChipsProps> & AiToolChipsExpose;
