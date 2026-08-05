import {
  defineEmits,
  defineExpose,
  defineHtml,
  defineProps,
  defineStyle,
  onMounted,
  onUnmounted,
  useEffect,
  useHost,
  useHostAttr,
  useHostFlag,
  useRef,
  useTemplateRef,
} from "@elfui/core";

import { createMutateController } from "../../../directives/observers";
import {
  highlightCodeCardSource,
  normalizeCodeCardLanguage,
  normalizeCodeCardSource,
  resolveCodeCardTheme,
  type CodeCardToken,
} from "../CodeCard/model";
import styles from "./style.scss?inline";
import type {
  AiCodeBlockCodeTheme,
  AiCodeBlockCopyDetail,
  AiCodeBlockElement,
  AiCodeBlockEmits,
  AiCodeBlockExpose,
  AiCodeBlockLabels,
  AiCodeBlockProps,
  AiCodeBlockStatus,
} from "./types";

export type {
  AiCodeBlockCodeTheme,
  AiCodeBlockCopyDetail,
  AiCodeBlockElement,
  AiCodeBlockEmits,
  AiCodeBlockExpose,
  AiCodeBlockLabels,
  AiCodeBlockProps,
  AiCodeBlockStatus,
  AiCodeBlockTheme,
} from "./types";

const DEFAULT_LABELS: AiCodeBlockLabels = {
  copy: "Copy code",
  copied: "Copied",
  copyFailed: "Copy failed",
  streaming: "Streaming",
  idle: "Idle",
  complete: "Complete",
  error: "Error",
  language: "Language",
  lines: "lines",
};

const STATUSES: readonly AiCodeBlockStatus[] = ["idle", "streaming", "complete", "error"];
const CODE_THEMES: readonly AiCodeBlockCodeTheme[] = ["github", "vitesse", "material"];

const props = defineProps<AiCodeBlockProps>({
  code: { type: String, default: "" },
  filename: { type: String, default: "" },
  language: { type: String, default: "typescript" },
  status: { type: String, default: "idle" },
  streamSpeed: { type: Number, default: 45 },
  theme: { type: String, default: "auto" },
  codeTheme: { type: String, default: "github" },
  showLineNumbers: { type: Boolean, default: true },
  copyable: { type: Boolean, default: true },
  labels: { type: Object, default: () => ({}) },
  ariaLabel: { type: String, default: "Code" },
});

const emit = defineEmits<AiCodeBlockEmits>(["complete", "copy", "copy-error"]);
const host = useHost<AiCodeBlockElement>();
const revealed = useRef(0);
const streamingActive = useRef(false);
const completed = useRef(false);
const copied = useRef(false);
const lastSource = useRef("");
const lastHighlightKey = useRef("");
const documentScheme = useRef<"light" | "dark">("light");
const renderedLines = useRef<CodeCardToken[][]>([]);
const codeForeground = useRef("currentColor");
const codeBackground = useRef("transparent");
const scroll = useTemplateRef<HTMLElement>("scroll");
let copiedTimer: ReturnType<typeof setTimeout> | undefined;
let streamTimer: ReturnType<typeof setInterval> | undefined;
let highlightRequest = 0;
let themeObserver: ReturnType<typeof createMutateController> | undefined;

const label = (key: keyof AiCodeBlockLabels): string =>
  props.labels?.[key] || DEFAULT_LABELS[key] || key;
const resolvedStatus = (): AiCodeBlockStatus =>
  STATUSES.includes(props.status as AiCodeBlockStatus)
    ? (props.status as AiCodeBlockStatus)
    : "idle";
const statusLabel = (): string => label(resolvedStatus());
const streamingProgress = (): string => `${revealed.value}/${totalLines()}`;
const statusChipText = (): string =>
  resolvedStatus() === "streaming"
    ? `${label("streaming")} · ${streamingProgress()}`
    : statusLabel();
const sourceText = (): string => normalizeCodeCardSource(props.code);
const sourceLines = (): string[] => (sourceText() ? sourceText().split("\n") : []);
const totalLines = (): number => sourceLines().length;
const copyLabel = (): string => (copied.value ? label("copied") : label("copy"));
const copyDetail = (): AiCodeBlockCopyDetail => ({
  filename: props.filename,
  language: props.language,
  code: sourceText(),
});
const lineNumber = (index: number): number => index + 1;
const visibleLineViews = (): CodeCardToken[][] => renderedLines.value.slice(0, revealed.value);
const hasVisibleLines = (): boolean => visibleLineViews().length > 0;
const showPlaceholder = (): boolean => streamingActive.value && !hasVisibleLines();
const isLastLine = (index: number): boolean =>
  resolvedStatus() === "streaming" && index === visibleLineViews().length - 1;
const isCurrentLine = (index: number): boolean =>
  resolvedStatus() === "streaming" && index === visibleLineViews().length - 1;
const codeLiveRegion = (): string => (resolvedStatus() === "streaming" ? "polite" : "off");
const hostLabel = (): string =>
  props.ariaLabel || `${props.filename || label("language")} · ${props.language}`;
const resolvedScheme = (): "light" | "dark" => {
  if (props.theme === "light" || props.theme === "dark") return props.theme;
  return documentScheme.value;
};
const resolvedCodeTheme = (): AiCodeBlockCodeTheme =>
  CODE_THEMES.includes(props.codeTheme as AiCodeBlockCodeTheme)
    ? (props.codeTheme as AiCodeBlockCodeTheme)
    : "github";
const tokenStyle = (token: CodeCardToken): Record<string, string> => ({
  color: token.color,
  fontStyle: token.fontStyle & 1 ? "italic" : "normal",
  fontWeight: token.fontStyle & 2 ? "700" : "400",
  textDecoration: token.fontStyle & 4 ? "underline" : "none",
});
const codeStyle = (): Record<string, string> => ({
  "--ai-code-foreground": codeForeground.value,
  "--ai-code-background": codeBackground.value,
});

const refreshHighlight = async (): Promise<void> => {
  const request = ++highlightRequest;
  const source = sourceText();
  const language = normalizeCodeCardLanguage(props.language);
  const theme = resolveCodeCardTheme(resolvedCodeTheme(), resolvedScheme());
  renderedLines.set(
    source
      ? source
          .split("\n")
          .map((line) => [{ content: line || " ", color: "currentColor", fontStyle: 0 }])
      : [],
  );
  codeForeground.set("currentColor");
  codeBackground.set("transparent");
  try {
    const result = await highlightCodeCardSource(source, language, theme);
    if (request !== highlightRequest) return;
    codeForeground.set(result.foreground);
    codeBackground.set(result.background);
    renderedLines.set(result.lines);
  } catch {
    if (request !== highlightRequest) return;
    codeForeground.set("currentColor");
    codeBackground.set("transparent");
  }
};

const stopStream = (): void => {
  if (streamTimer) {
    clearInterval(streamTimer);
    streamTimer = undefined;
  }
  streamingActive.set(false);
};

const advanceStream = (): void => {
  const next = revealed.value + 1;
  revealed.set(next);
  const target = scroll.value;
  if (target) target.scrollTop = target.scrollHeight;
  if (next >= totalLines()) {
    stopStream();
    if (!completed.value) {
      completed.set(true);
      emit("complete");
    }
  }
};

const startStream = (): void => {
  if (streamingActive.value || revealed.value >= totalLines()) return;
  streamingActive.set(true);
  streamTimer = setInterval(advanceStream, Math.max(8, Number(props.streamSpeed) || 45));
};

useEffect(() => {
  const sourceChanged = props.code !== lastSource.value;
  if (sourceChanged) {
    lastSource.set(props.code);
    revealed.set(0);
    completed.set(false);
  }
  const key = `${props.code}\u0000${normalizeCodeCardLanguage(props.language)}\u0000${resolvedCodeTheme()}\u0000${resolvedScheme()}`;
  if (key !== lastHighlightKey.value) {
    lastHighlightKey.set(key);
    void refreshHighlight();
  }
});

useEffect(() => {
  const status = resolvedStatus();
  if (status === "streaming") {
    startStream();
    return undefined;
  }
  stopStream();
  if (status !== "idle") revealed.set(totalLines());
  return undefined;
});

const writeClipboard = async (text: string): Promise<void> => {
  let clipboardError: unknown;
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return;
    } catch (error) {
      clipboardError = error;
    }
  }
  const input = document.createElement("textarea");
  input.value = text;
  input.setAttribute("readonly", "");
  input.style.position = "fixed";
  input.style.opacity = "0";
  document.body.appendChild(input);
  try {
    input.select();
    const succeeded = document.execCommand?.("copy") ?? false;
    if (!succeeded) throw clipboardError ?? new Error("Clipboard API is unavailable");
  } finally {
    input.remove();
  }
};

const copy = async (): Promise<boolean> => {
  if (!sourceText() || !props.copyable) return false;
  try {
    await writeClipboard(sourceText());
    copied.set(true);
    emit("copy", copyDetail());
    if (copiedTimer) clearTimeout(copiedTimer);
    copiedTimer = setTimeout(() => copied.set(false), 1600);
    return true;
  } catch (error) {
    copied.set(false);
    emit("copy-error", error);
    return false;
  }
};

const revealAll = (): void => {
  revealed.set(totalLines());
  const target = scroll.value;
  if (target) target.scrollTop = target.scrollHeight;
  stopStream();
  if (!completed.value && totalLines() > 0) {
    completed.set(true);
    emit("complete");
  }
};

const reset = (): void => {
  stopStream();
  revealed.set(0);
  completed.set(false);
};

const syncDocumentScheme = (): void => {
  const local = host.closest?.("[data-theme]")?.getAttribute("data-theme");
  if (local === "light" || local === "dark") {
    documentScheme.set(local);
    return;
  }
  const theme = document.documentElement.getAttribute("data-theme");
  const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)").matches ?? false;
  documentScheme.set(theme === "dark" || (theme !== "light" && prefersDark) ? "dark" : "light");
};

onMounted(() => {
  syncDocumentScheme();
  themeObserver = createMutateController(document.documentElement, {
    handler: syncDocumentScheme,
    observer: {
      attributes: true,
      attributeFilter: ["data-theme"],
    },
  });
  const media = window.matchMedia?.("(prefers-color-scheme: dark)");
  media?.addEventListener?.("change", syncDocumentScheme);
  return () => {
    themeObserver?.dispose();
    themeObserver = undefined;
    media?.removeEventListener?.("change", syncDocumentScheme);
  };
});

onUnmounted(stopStream);

useHostAttr("data-status", resolvedStatus);
useHostFlag("data-streaming", () => streamingActive.value);
useHostAttr("aria-label", hostLabel);

defineExpose<AiCodeBlockExpose>({ copy, revealAll, reset });

defineStyle(styles);

const AiCodeBlock = defineHtml(`
  <article class="ai-code-block" :aria-label=${props.ariaLabel}>
    <header class="header">
      <span class="file-mark" aria-hidden="true"></span>
      <span class="filename">${props.filename || label("language")}</span>
      <span class="language">${props.language}</span>
      <span class="status-chip" :class="{ error: resolvedStatus() === 'error' }">${statusChipText()}</span>
      <button
        v-if=${props.copyable}
        class="copy"
        type="button"
        :aria-label=${copyLabel()}
        :title=${copyLabel()}
        @click=${copy}
      >
        <span class="copy-icon" :class="{ copied: copied }" aria-hidden="true"></span>
      </button>
    </header>
    <pre ref="scroll" class="code" tabindex="0" :style=${codeStyle()} :aria-live=${codeLiveRegion()}>
      <code>
        <span
          v-for="(line, index) in visibleLineViews()"
          :key="index"
          class="line"
          :class="{ 'no-numbers': !props.showLineNumbers, 'is-current': isCurrentLine(index) }"
        ><span v-if=${props.showLineNumbers} class="line-number" aria-hidden="true">{{ lineNumber(index) }}</span><span class="line-content"><span v-for="(token, tokenIndex) in line" :key="tokenIndex" :style="tokenStyle(token)">{{ token.content }}</span><span v-if="isLastLine(index)" class="caret" aria-hidden="true"></span></span></span>
        <span v-if=${showPlaceholder()} class="line placeholder"><span v-if=${props.showLineNumbers} class="line-number" aria-hidden="true">1</span><span class="line-content"><span class="caret" aria-hidden="true"></span></span></span>
      </code>
    </pre>
  </article>
`);

export { AiCodeBlock };
