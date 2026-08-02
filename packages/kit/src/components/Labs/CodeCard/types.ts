// cspell:ignore shiki vitesse

/** Visual shell used by the code card. */
export type CodeCardVariant = "workbench" | "window" | "minimal";

/** Surface color scheme. `auto` follows the document theme. */
export type CodeCardTheme = "auto" | "light" | "dark";

/** Syntax palette family. The light or dark member follows `theme`. */
export type CodeCardCodeTheme = "github" | "vitesse" | "material";

/** Languages with dedicated Shiki grammars and formatter strategies. */
export type CodeCardLanguage =
  | "javascript"
  | "typescript"
  | "html"
  | "css"
  | "scss"
  | "json"
  | "markdown"
  | "bash"
  | "vue"
  | "plaintext";

/** Diff treatment applied to one rendered line. */
export type CodeCardDiffKind = "add" | "remove";

/** Inclusive one-based source range used by line annotations. */
export interface CodeCardLineRange {
  start: number;
  end: number;
}

/**
 * Selects one source line or an inclusive source range.
 *
 * @example
 * `[1, [3, 5], { start: 8, end: 10 }]`
 */
export type CodeCardLineSelection = number | readonly [number, number] | CodeCardLineRange;

/** Associates one or more one-based source lines with a diff treatment. */
export interface CodeCardDiffLine {
  line: CodeCardLineSelection;
  kind: CodeCardDiffKind;
}

/** One tab in a grouped code card. */
export interface CodeCardItem {
  key: string;
  label: string;
  code: string;
  language?: CodeCardLanguage;
  filename?: string;
  highlightLines?: CodeCardLineSelection[];
  focusLines?: CodeCardLineSelection[];
  errorLines?: CodeCardLineSelection[];
  warningLines?: CodeCardLineSelection[];
  diffLines?: CodeCardDiffLine[];
}

/** Optional SVG path overrides for file, toolbar, and copy-state icons. */
export interface CodeCardIcons {
  file?: string;
  lineNumbers?: string;
  format?: string;
  copy?: string;
  copied?: string;
  expand?: string;
  collapse?: string;
}

/** User-facing labels for toolbar actions and accessible names. */
export interface CodeCardLabels {
  copy: string;
  copied: string;
  copyError: string;
  expand: string;
  collapse: string;
  format: string;
  formatting: string;
  formatError: string;
  showLineNumbers: string;
  hideLineNumbers: string;
  language: string;
  codeGroup: string;
  errorLine: string;
  warningLine: string;
}

/** Public properties for `elf-code-card`. */
export interface CodeCardProps {
  code: string;
  items: CodeCardItem[];
  title: string;
  filename: string;
  language: CodeCardLanguage;
  availableLanguages: CodeCardLanguage[];
  variant: CodeCardVariant;
  theme: CodeCardTheme;
  codeTheme: CodeCardCodeTheme;
  icons: Partial<CodeCardIcons>;
  lineNumbers: boolean;
  collapsible: boolean;
  expanded: boolean;
  activeKey: string;
  copyable: boolean;
  formattable: boolean;
  highlightLines: CodeCardLineSelection[];
  focusLines: CodeCardLineSelection[];
  /** Reveals dimmed focus context while the card is hovered or contains keyboard focus. */
  focusRevealOnHover: boolean;
  errorLines: CodeCardLineSelection[];
  warningLines: CodeCardLineSelection[];
  diffLines: CodeCardDiffLine[];
  labels: Partial<CodeCardLabels>;
  ariaLabel: string;
}

/** Named content regions exposed by `elf-code-card`. */
export interface CodeCardSlots {
  /** Optional metadata below the code, such as notes, attribution, or author information. */
  footer?: unknown;
}

/** Snapshot emitted for the active code tab. */
export interface CodeCardItemDetail {
  key: string;
  label: string;
  filename: string;
  language: CodeCardLanguage;
  code: string;
}

/** Payload emitted after a format request completes. */
export interface CodeCardFormatDetail extends CodeCardItemDetail {
  originalCode: string;
}

/** Semantic events emitted by `elf-code-card`. */
export interface CodeCardEmits {
  copy: [detail: CodeCardItemDetail];
  "copy-error": [error: unknown];
  format: [detail: CodeCardFormatDetail];
  "format-error": [error: unknown];
  toggle: [expanded: boolean];
  "line-numbers-change": [visible: boolean];
  "update:language": [language: CodeCardLanguage];
  "language-change": [language: CodeCardLanguage];
  "tab-change": [detail: CodeCardItemDetail];
}

/** Imperative methods exposed by `elf-code-card`. */
export interface CodeCardExpose {
  copy(): Promise<boolean>;
  format(): Promise<string>;
  expand(): void;
  collapse(): void;
  toggle(): void;
  select(key: string): void;
}

export type CodeCardElement = HTMLElement & CodeCardProps & CodeCardExpose;
