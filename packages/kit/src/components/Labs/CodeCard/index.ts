import {
  defineEmits,
  defineExpose,
  defineHtml,
  defineModel,
  defineProps,
  defineStyle,
  onMounted,
  onUnmounted,
  registerComponents,
  useEffect,
  useHost,
  useRef,
} from "@elfui/core";
import {
  mdiAutoFix,
  mdiCheck,
  mdiChevronDown,
  mdiChevronUp,
  mdiContentCopy,
  mdiFileCodeOutline,
  mdiFormatListNumbered,
} from "@mdi/js";

import { createMutateController } from "../../../directives/observers";
import { Select } from "../../Form/Select";
import type { SelectOption } from "../../Form/Select";
import styles from "./style.scss?inline";
import {
  CODE_CARD_LANGUAGES,
  codeCardLanguageOption,
  formatCodeCardSource,
  highlightCodeCardSource,
  normalizeCodeCardLanguage,
  normalizeCodeCardSource,
  resolveCodeCardLines,
  resolveCodeCardTheme,
  type CodeCardToken,
} from "./model";
import type {
  CodeCardDiffKind,
  CodeCardElement,
  CodeCardEmits,
  CodeCardExpose,
  CodeCardFormatDetail,
  CodeCardItem,
  CodeCardItemDetail,
  CodeCardIcons,
  CodeCardLabels,
  CodeCardLanguage,
  CodeCardLineSelection,
  CodeCardProps,
  CodeCardSlots,
} from "./types";

registerComponents(Select);

export {
  CODE_CARD_LANGUAGES,
  codeCardLanguageOption,
  formatCodeCardSource,
  highlightCodeCardSource,
  normalizeCodeCardLanguage,
  normalizeCodeCardSource,
  resolveCodeCardLines,
  resolveCodeCardTheme,
} from "./model";
export type {
  CodeCardCodeTheme,
  CodeCardDiffKind,
  CodeCardDiffLine,
  CodeCardElement,
  CodeCardEmits,
  CodeCardExpose,
  CodeCardFormatDetail,
  CodeCardIcons,
  CodeCardItem,
  CodeCardItemDetail,
  CodeCardLabels,
  CodeCardLanguage,
  CodeCardLineRange,
  CodeCardLineSelection,
  CodeCardProps,
  CodeCardSlots,
  CodeCardTheme,
  CodeCardVariant,
} from "./types";

const props = defineProps<CodeCardProps>({
  code: { type: String, default: "" },
  items: { type: Array, default: () => [] },
  title: { type: String, default: "" },
  filename: { type: String, default: "" },
  language: { type: String, default: "javascript" },
  availableLanguages: {
    type: Array,
    default: () => CODE_CARD_LANGUAGES.map((entry) => entry.value),
  },
  variant: { type: String, default: "workbench" },
  theme: { type: String, default: "auto" },
  codeTheme: { type: String, default: "github" },
  icons: { type: Object, default: () => ({}) },
  collapsible: { type: Boolean, default: true },
  copyable: { type: Boolean, default: true },
  formattable: { type: Boolean, default: true },
  highlightLines: { type: Array, default: () => [] },
  focusLines: { type: Array, default: () => [] },
  focusRevealOnHover: { type: Boolean, default: true },
  errorLines: { type: Array, default: () => [] },
  warningLines: { type: Array, default: () => [] },
  diffLines: { type: Array, default: () => [] },
  labels: { type: Object, default: () => ({}) },
  ariaLabel: { type: String, default: "Code" },
});

const expanded = defineModel<boolean>("expanded", { default: true });
const lineNumbers = defineModel<boolean>("lineNumbers", { default: true });
const activeKey = defineModel<string>("activeKey", { default: "" });
const emit = defineEmits<CodeCardEmits>([
  "copy",
  "copy-error",
  "format",
  "format-error",
  "toggle",
  "line-numbers-change",
  "update:language",
  "language-change",
  "tab-change",
]);

const defaultLabels: CodeCardLabels = {
  copy: "Copy code",
  copied: "Copied",
  copyError: "Copy failed",
  expand: "Expand code",
  collapse: "Collapse code",
  format: "Format code",
  formatting: "Formatting code",
  formatError: "Format failed",
  showLineNumbers: "Show line numbers",
  hideLineNumbers: "Hide line numbers",
  language: "Language",
  codeGroup: "Code group",
  errorLine: "Error line",
  warningLine: "Warning line",
};

interface FormattedOverride {
  signature: string;
  code: string;
}

interface CodeCardTokenView extends CodeCardToken {
  style: Record<string, string>;
}

interface CodeCardLineView {
  number: number;
  tokens: CodeCardTokenView[];
  highlighted: boolean;
  focused: boolean;
  dimmed: boolean;
  diff: CodeCardDiffKind | "";
  diagnostic: "error" | "warning" | "";
}

const nextPanelId = (): string => {
  const store = globalThis as typeof globalThis & { __elfCodeCardIdSeed?: number };
  store.__elfCodeCardIdSeed = (store.__elfCodeCardIdSeed ?? 0) + 1;
  return `elf-code-card-panel-${store.__elfCodeCardIdSeed}`;
};

const panelId = nextPanelId();
const host = useHost<CodeCardElement>();
const copied = useRef(false);
const formatting = useRef(false);
const documentScheme = useRef<"light" | "dark">("light");
const renderedLines = useRef<CodeCardLineView[]>([]);
const codeForeground = useRef("currentColor");
const codeBackground = useRef("transparent");
const formattedOverride = useRef<FormattedOverride | null>(null);
const language = useRef<CodeCardLanguage>(normalizeCodeCardLanguage(props.language));
const hasFooterSlot = useRef(false);
let highlightRequest = 0;
let copiedTimer: ReturnType<typeof setTimeout> | undefined;
let themeObserver: ReturnType<typeof createMutateController> | undefined;

const label = (key: keyof CodeCardLabels): string => props.labels[key] || defaultLabels[key];
const standaloneLanguage = (): CodeCardLanguage => language.value;
const defaultIcons: Required<CodeCardIcons> = {
  file: mdiFileCodeOutline,
  lineNumbers: mdiFormatListNumbered,
  format: mdiAutoFix,
  copy: mdiContentCopy,
  copied: mdiCheck,
  expand: mdiChevronDown,
  collapse: mdiChevronUp,
};
const iconPath = (key: keyof CodeCardIcons): string =>
  typeof props.icons?.[key] === "string" && props.icons[key]
    ? (props.icons[key] as string)
    : defaultIcons[key];

const singleItem = (): CodeCardItem => ({
  key: "code",
  label: props.title || props.filename || codeCardLanguageOption(standaloneLanguage()).label,
  filename: props.filename,
  language: standaloneLanguage(),
  code: props.code,
  highlightLines: props.highlightLines,
  focusLines: props.focusLines,
  errorLines: props.errorLines,
  warningLines: props.warningLines,
  diffLines: props.diffLines,
});

const codeItems = (): CodeCardItem[] => (props.items.length > 0 ? props.items : [singleItem()]);

const currentItem = (): CodeCardItem =>
  codeItems().find((item) => item.key === activeKey.value) ?? codeItems()[0]!;

const currentLanguage = (): CodeCardLanguage =>
  props.items.length > 0
    ? normalizeCodeCardLanguage(currentItem().language || standaloneLanguage())
    : standaloneLanguage();

const currentSource = (): string => normalizeCodeCardSource(currentItem().code);

const sourceSignature = (): string =>
  `${currentItem().key}\u0000${currentLanguage()}\u0000${currentSource()}`;

const visibleCode = (): string => {
  const override = formattedOverride.value;
  return override?.signature === sourceSignature() ? override.code : currentSource();
};

const currentFilename = (): string => currentItem().filename || props.filename || "";

const currentTitle = (): string =>
  currentFilename() ||
  currentItem().label ||
  props.title ||
  codeCardLanguageOption(currentLanguage()).label;

const detailFor = (item: CodeCardItem, code = visibleCode()): CodeCardItemDetail => ({
  key: item.key,
  label: item.label,
  filename: item.filename || props.filename || "",
  language: normalizeCodeCardLanguage(item.language || language.value),
  code,
});

const lineSelections = (
  kind: "highlight" | "focus" | "error" | "warning",
): CodeCardLineSelection[] => {
  const item = currentItem();
  if (kind === "highlight") return item.highlightLines ?? props.highlightLines;
  if (kind === "focus") return item.focusLines ?? props.focusLines;
  if (kind === "error") return item.errorLines ?? props.errorLines;
  return item.warningLines ?? props.warningLines;
};

const selectedLines = (
  kind: "highlight" | "focus" | "error" | "warning",
  lineCount: number,
): Set<number> => resolveCodeCardLines(lineSelections(kind), lineCount);

const diffEntries = () => currentItem().diffLines ?? props.diffLines;

const diffLineMap = (lineCount: number): Map<number, CodeCardDiffKind> => {
  const result = new Map<number, CodeCardDiffKind>();
  diffEntries().forEach((entry) => {
    resolveCodeCardLines([entry.line], lineCount).forEach((line) => result.set(line, entry.kind));
  });
  return result;
};

const tokenStyle = (token: CodeCardToken): Record<string, string> => ({
  color: token.color,
  fontStyle: token.fontStyle & 1 ? "italic" : "normal",
  fontWeight: token.fontStyle & 2 ? "700" : "400",
  textDecoration: token.fontStyle & 4 ? "underline" : "none",
});

const makeLineViews = (lines: CodeCardToken[][]): CodeCardLineView[] => {
  const lineCount = lines.length;
  const highlighted = selectedLines("highlight", lineCount);
  const focused = selectedLines("focus", lineCount);
  const errors = selectedLines("error", lineCount);
  const warnings = selectedLines("warning", lineCount);
  const diff = diffLineMap(lineCount);
  return lines.map((tokens, index) => {
    const number = index + 1;
    return {
      number,
      tokens: tokens.map((token) => ({ ...token, style: tokenStyle(token) })),
      highlighted: highlighted.has(number),
      focused: focused.has(number),
      dimmed: focused.size > 0 && !focused.has(number),
      diff: diff.get(number) ?? "",
      diagnostic: errors.has(number) ? "error" : warnings.has(number) ? "warning" : "",
    };
  });
};

const fallbackLines = (): CodeCardToken[][] =>
  visibleCode()
    .split("\n")
    .map((content) => [{ content: content || " ", color: "currentColor", fontStyle: 0 }]);

const resolvedScheme = (): "light" | "dark" => {
  if (props.theme === "light" || props.theme === "dark") return props.theme;
  return documentScheme.value;
};

const refreshHighlight = async (): Promise<void> => {
  const request = ++highlightRequest;
  const source = visibleCode();
  const activeLanguage = currentLanguage();
  const theme = resolveCodeCardTheme(props.codeTheme, resolvedScheme());
  renderedLines.set(makeLineViews(fallbackLines()));
  try {
    const result = await highlightCodeCardSource(source, activeLanguage, theme);
    if (request !== highlightRequest) return;
    codeForeground.set(result.foreground);
    codeBackground.set(result.background);
    renderedLines.set(makeLineViews(result.lines));
  } catch {
    if (request !== highlightRequest) return;
    codeForeground.set("currentColor");
    codeBackground.set("transparent");
  }
};

useEffect(() => {
  const propLanguage = normalizeCodeCardLanguage(props.language);
  if (propLanguage !== language.peek()) {
    language.set(propLanguage);
    formattedOverride.set(null);
  }
});

useEffect(() => {
  visibleCode();
  currentLanguage();
  resolvedScheme();
  lineSelections("highlight");
  lineSelections("focus");
  lineSelections("error");
  lineSelections("warning");
  diffEntries();
  void refreshHighlight();
});

const codeStyle = (): Record<string, string> => ({
  "--code-card-foreground": codeForeground.value,
  "--code-card-background": codeBackground.value,
});

const rootClass = (): Record<string, boolean> => ({
  card: true,
  [`variant-${props.variant}`]: true,
  [`scheme-${resolvedScheme()}`]: true,
  "is-expanded": expanded.value,
  "is-collapsed": !expanded.value,
  "has-tabs": codeItems().length > 1,
  "has-footer": hasFooterSlot.value,
  "has-line-markers":
    diffEntries().length > 0 ||
    lineSelections("error").length > 0 ||
    lineSelections("warning").length > 0,
  "focus-reveal-on-hover": props.focusRevealOnHover && lineSelections("focus").length > 0,
});

const lineClass = (line: CodeCardLineView): Record<string, boolean> => ({
  "code-line": true,
  "has-line-numbers": lineNumbers.value,
  "is-highlighted": line.highlighted,
  "is-focused": line.focused,
  "is-dimmed": line.dimmed,
  "is-added": line.diff === "add",
  "is-removed": line.diff === "remove",
  "is-error": line.diagnostic === "error",
  "is-warning": line.diagnostic === "warning",
});

const lineMarker = (line: CodeCardLineView): string =>
  line.diff === "add"
    ? "+"
    : line.diff === "remove"
      ? "-"
      : line.diagnostic === "error"
        ? "×"
        : line.diagnostic === "warning"
          ? "!"
          : "";

const lineStateLabel = (line: CodeCardLineView): string =>
  line.diagnostic === "error"
    ? label("errorLine")
    : line.diagnostic === "warning"
      ? label("warningLine")
      : "";

const languageStamp = (): string => codeCardLanguageOption(currentLanguage()).shortLabel;
const isGrouped = (): boolean => codeItems().length > 1;

const availableLanguageOptions = () => {
  const requested = new Set(props.availableLanguages.map(normalizeCodeCardLanguage));
  const options = CODE_CARD_LANGUAGES.filter((entry) => requested.has(entry.value));
  const available = options.length > 0 ? options : [...CODE_CARD_LANGUAGES];
  const current = currentLanguage();
  return [
    ...available.filter((entry) => entry.value === current),
    ...available.filter((entry) => entry.value !== current),
  ];
};

const languageSelectOptions = (): SelectOption[] =>
  availableLanguageOptions().map((option) => ({
    value: option.value,
    label: option.label,
  }));

const languageMenuStyle = (): Record<string, string> => ({ minWidth: "176px" });

const slotHasContent = (slot: HTMLSlotElement): boolean =>
  slot
    .assignedNodes({ flatten: true })
    .some((node) => node.nodeType === Node.ELEMENT_NODE || Boolean(node.textContent?.trim()));

const syncFooterSlot = (slot: HTMLSlotElement): void => hasFooterSlot.set(slotHasContent(slot));

const onFooterSlotChange = (event: Event): void => syncFooterSlot(event.target as HTMLSlotElement);

const syncRenderedFooterSlot = (): void => {
  const slot = host.shadowRoot?.querySelector<HTMLSlotElement>('slot[name="footer"]');
  if (slot) syncFooterSlot(slot);
};

const select = (key: string): void => {
  const item = codeItems().find((entry) => entry.key === key);
  if (!item || item.key === currentItem().key) return;
  activeKey.set(item.key);
  copied.set(false);
  emit("tab-change", detailFor(item, normalizeCodeCardSource(item.code)));
};

const onTabClick = (event: Event): void =>
  select((event.currentTarget as HTMLElement).dataset.key || "");

const onTabKeydown = (event: KeyboardEvent): void => {
  const tabs = codeItems();
  const currentIndex = tabs.findIndex((item) => item.key === currentItem().key);
  let nextIndex = currentIndex;
  if (event.key === "ArrowRight") nextIndex = (currentIndex + 1) % tabs.length;
  else if (event.key === "ArrowLeft") nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
  else if (event.key === "Home") nextIndex = 0;
  else if (event.key === "End") nextIndex = tabs.length - 1;
  else return;

  event.preventDefault();
  select(tabs[nextIndex]!.key);
  const currentTarget = event.currentTarget as HTMLElement | null;
  const buttons = currentTarget?.parentElement?.querySelectorAll<HTMLButtonElement>("[role='tab']");
  buttons?.[nextIndex]?.focus();
};

const onLanguageChange = (event: CustomEvent): void => {
  const next = normalizeCodeCardLanguage(String(event.detail || ""));
  if (next === currentLanguage()) return;
  formattedOverride.set(null);
  language.set(next);
  emit("update:language", next);
  emit("language-change", next);
};

const toggle = (): void => {
  if (!props.collapsible) return;
  const next = !expanded.value;
  expanded.set(next);
  emit("toggle", next);
};

const expand = (): void => {
  if (expanded.value) return;
  expanded.set(true);
  emit("toggle", true);
};

const collapse = (): void => {
  if (!expanded.value || !props.collapsible) return;
  expanded.set(false);
  emit("toggle", false);
};

const toggleLineNumbers = (): void => {
  const next = !lineNumbers.value;
  lineNumbers.set(next);
  emit("line-numbers-change", next);
};

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
  const code = visibleCode();
  if (!code || !props.copyable) return false;
  try {
    await writeClipboard(code);
    copied.set(true);
    emit("copy", detailFor(currentItem(), code));
    if (copiedTimer) clearTimeout(copiedTimer);
    copiedTimer = setTimeout(() => copied.set(false), 1600);
    return true;
  } catch (error) {
    copied.set(false);
    emit("copy-error", error);
    return false;
  }
};

const format = async (): Promise<string> => {
  const originalCode = visibleCode();
  if (!props.formattable || formatting.value) return originalCode;
  formatting.set(true);
  try {
    const code = await formatCodeCardSource(originalCode, currentLanguage());
    formattedOverride.set({ signature: sourceSignature(), code });
    const detail: CodeCardFormatDetail = {
      ...detailFor(currentItem(), code),
      originalCode,
    };
    emit("format", detail);
    return code;
  } catch (error) {
    emit("format-error", error);
    return originalCode;
  } finally {
    formatting.set(false);
  }
};

const onFormatClick = (): void => {
  void format();
};

const onCopyClick = (): void => {
  void copy();
};

const copyLabel = (): string => (copied.value ? label("copied") : label("copy"));
const expandLabel = (): string => (expanded.value ? label("collapse") : label("expand"));
const formatLabel = (): string => (formatting.value ? label("formatting") : label("format"));
const lineNumbersLabel = (): string =>
  lineNumbers.value ? label("hideLineNumbers") : label("showLineNumbers");

const syncDocumentScheme = (): void => {
  const theme = document.documentElement.getAttribute("data-theme");
  const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)").matches ?? false;
  documentScheme.set(theme === "dark" || (theme !== "light" && prefersDark) ? "dark" : "light");
};

onMounted(() => {
  syncDocumentScheme();
  // Native slot assignment settles after the component's initial render transaction.
  queueMicrotask(syncRenderedFooterSlot);
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

onUnmounted(() => {
  highlightRequest += 1;
  if (copiedTimer) clearTimeout(copiedTimer);
  copiedTimer = undefined;
});

defineExpose<CodeCardExpose>({ copy, format, expand, collapse, toggle, select });
defineStyle(styles);

const CodeCard = defineHtml<CodeCardProps, CodeCardEmits, CodeCardSlots>(`
  <article
    :class=${rootClass()}
    :aria-label=${props.ariaLabel}
  >
    <header class="card-header" :class="{ 'group-header': isGrouped() }">
      <div
        v-if=${isGrouped()}
        class="code-tabs"
        role="tablist"
        :aria-label=${label("codeGroup")}
      >
        <button
          v-for="item in codeItems()"
          :key="item.key"
          type="button"
          role="tab"
          class="code-tab"
          :class="{ active: item.key === currentItem().key }"
          :data-key="item.key"
          :aria-selected="String(item.key === currentItem().key)"
          :aria-controls=${panelId}
          :tabindex="item.key === currentItem().key ? 0 : -1"
          @click=${onTabClick}
          @keydown=${onTabKeydown}
        >
          <span class="tab-language">{{
            codeCardLanguageOption(normalizeCodeCardLanguage(item.language ||
            currentLanguage())).shortLabel }}</span>
          <span>{{ item.label }}</span>
        </button>
      </div>
      <span
        v-if=${!isGrouped() && props.variant === "window"}
        class="window-lights"
        aria-hidden="true"
      >
        <i></i><i></i><i></i>
      </span>
      <span
        v-if=${!isGrouped() && props.variant === "workbench"}
        class="file-mark"
        aria-hidden="true"
      >
        <svg viewBox="0 0 24 24">
          <path :d=${iconPath("file")}></path>
        </svg>
      </span>
      <span v-if=${!isGrouped()} class="card-title">${currentTitle()}</span>

      <span class="card-actions">
        <label
          v-if=${props.variant === "workbench" && !isGrouped()}
          class="language-select header-language"
        >
          <span class="sr-only">${label("language")}</span>
          <elf-select
            size="sm"
            variant="underlined"
            :height=${360}
            :options.prop=${languageSelectOptions()}
            :modelValue.prop=${currentLanguage()}
            :effect=${resolvedScheme() === "dark" ? "dark" : "light"}
            :popperStyle.prop=${languageMenuStyle()}
            :aria-label=${label("language")}
            @update:modelValue=${onLanguageChange}
          ></elf-select>
        </label>
        <button
          v-if=${props.variant === "workbench"}
          type="button"
          class="icon-button"
          :class=${{ active: lineNumbers.value }}
          :title=${lineNumbersLabel()}
          :aria-label=${lineNumbersLabel()}
          :aria-pressed=${String(lineNumbers.value)}
          @click=${toggleLineNumbers}
        >
          <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path :d=${iconPath("lineNumbers")}></path>
          </svg>
        </button>
        <button
          v-if=${props.variant === "workbench" && props.formattable}
          type="button"
          class="icon-button"
          :title=${formatLabel()}
          :aria-label=${formatLabel()}
          :disabled=${formatting}
          @click=${onFormatClick}
        >
          <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path :d=${iconPath("format")}></path>
          </svg>
        </button>
        <button
          v-if=${props.copyable}
          type="button"
          class="icon-button copy-button"
          :class=${{ success: copied }}
          :title=${copyLabel()}
          :aria-label=${copyLabel()}
          aria-live="polite"
          @click=${onCopyClick}
        >
          <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path :d=${copied ? iconPath("copied") : iconPath("copy")}></path>
          </svg>
        </button>
        <button
          v-if=${props.collapsible}
          type="button"
          class="icon-button collapse-trailing"
          :title=${expandLabel()}
          :aria-label=${expandLabel()}
          :aria-expanded=${String(expanded.value)}
          :aria-controls=${panelId}
          @click=${toggle}
        >
          <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path :d=${expanded.value ? iconPath("collapse") : iconPath("expand")}></path>
          </svg>
        </button>
      </span>
    </header>

    <Transition name="code-card-expand">
      <div
        v-if=${expanded.value}
        :id=${panelId}
        class="card-body"
        role="tabpanel"
        :style=${codeStyle()}
      >
        <span
          v-if=${props.variant === "minimal"}
          class="language-stamp"
          aria-hidden="true"
        >${languageStamp()}</span>
        <pre
          class="code-scroll"
          tabindex="0"
        ><code><span v-for="line in renderedLines" :key="line.number" :class="lineClass(line)"><span class="diff-marker" aria-hidden="true">{{ lineMarker(line) }}</span><span v-if=${lineNumbers.value} class="line-number" aria-hidden="true">{{ line.number }}</span><span v-if="line.diagnostic" class="sr-only">{{ lineStateLabel(line) }}</span><span class="line-content"><span v-for="(token, tokenIndex) in line.tokens" :key="tokenIndex" :style="token.style">{{ token.content }}</span></span></span></code></pre>
      </div>
    </Transition>

    <footer v-show=${hasFooterSlot} class="card-footer" part="footer">
      <slot name="footer" @slotchange=${onFooterSlotChange}></slot>
    </footer>
  </article>
`);

export { CodeCard };

declare global {
  interface HTMLElementTagNameMap {
    "elf-code-card": CodeCardElement;
  }
}
