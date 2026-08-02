// cspell:ignore shiki vitesse palenight

import type {
  CodeCardCodeTheme,
  CodeCardLanguage,
  CodeCardLineRange,
  CodeCardLineSelection,
  CodeCardTheme,
} from "./types";
import type { CodeCardHighlighter } from "./highlighter";

export interface CodeCardToken {
  content: string;
  color: string;
  fontStyle: number;
}

export interface CodeCardHighlightResult {
  lines: CodeCardToken[][];
  foreground: string;
  background: string;
}

export interface CodeCardLanguageOption {
  value: CodeCardLanguage;
  label: string;
  shortLabel: string;
}

export const CODE_CARD_LANGUAGES: readonly CodeCardLanguageOption[] = [
  { value: "javascript", label: "JavaScript", shortLabel: "JS" },
  { value: "typescript", label: "TypeScript", shortLabel: "TS" },
  { value: "html", label: "HTML", shortLabel: "HTML" },
  { value: "vue", label: "Vue", shortLabel: "VUE" },
  { value: "css", label: "CSS", shortLabel: "CSS" },
  { value: "scss", label: "SCSS", shortLabel: "SCSS" },
  { value: "json", label: "JSON", shortLabel: "JSON" },
  { value: "markdown", label: "Markdown", shortLabel: "MD" },
  { value: "bash", label: "Bash", shortLabel: "SH" },
  { value: "plaintext", label: "Plain text", shortLabel: "TXT" },
];

const languageAliases = new Map<string, CodeCardLanguage>([
  ["js", "javascript"],
  ["jsx", "javascript"],
  ["ts", "typescript"],
  ["tsx", "typescript"],
  ["htm", "html"],
  ["md", "markdown"],
  ["mdx", "markdown"],
  ["shell", "bash"],
  ["sh", "bash"],
  ["text", "plaintext"],
  ["txt", "plaintext"],
]);

/** Normalizes common language aliases to CodeCard's public language names. */
export const normalizeCodeCardLanguage = (value: string): CodeCardLanguage => {
  const normalized = String(value || "")
    .trim()
    .toLowerCase();
  const direct = CODE_CARD_LANGUAGES.find((entry) => entry.value === normalized)?.value;
  return direct ?? languageAliases.get(normalized) ?? "plaintext";
};

/**
 * Normalizes pasted and template-literal source while preserving relative indentation.
 *
 * Leading/trailing blank lines and the common indentation introduced by an enclosing
 * template are removed so rendered code starts at the expected editor column.
 */
export const normalizeCodeCardSource = (value: string): string => {
  const lines = String(value || "")
    .replace(/\r\n?/g, "\n")
    .split("\n");
  while (lines[0]?.trim() === "") lines.shift();
  while (lines.at(-1)?.trim() === "") lines.pop();
  const indents = lines
    .filter((line) => line.trim())
    .map((line) => line.match(/^[\t ]*/u)?.[0].length ?? 0);
  const commonIndent = indents.reduce((minimum, indent) => Math.min(minimum, indent), Infinity);
  const margin = Number.isFinite(commonIndent) ? commonIndent : 0;
  return lines.map((line) => line.slice(margin)).join("\n");
};

const positiveInteger = (value: unknown): number | undefined => {
  const number = Number(value);
  return Number.isInteger(number) && number > 0 ? number : undefined;
};

/**
 * Expands mixed single-line and inclusive-range selections into a bounded line set.
 * Reversed ranges are accepted and normalized; invalid or out-of-bounds values are ignored.
 */
export const resolveCodeCardLines = (
  selections: readonly CodeCardLineSelection[],
  lineCount: number,
): Set<number> => {
  const resolved = new Set<number>();
  const upperBound = Math.max(0, Math.floor(lineCount));
  if (upperBound === 0) return resolved;

  selections.forEach((selection) => {
    if (typeof selection === "number") {
      const line = positiveInteger(selection);
      if (line && line <= upperBound) resolved.add(line);
      return;
    }

    const tuple = isCodeCardLineTuple(selection);
    const rawStart = tuple ? selection[0] : selection.start;
    const rawEnd = tuple ? selection[1] : selection.end;
    const start = positiveInteger(rawStart);
    const end = positiveInteger(rawEnd);
    if (!start || !end) return;

    const from = Math.max(1, Math.min(start, end));
    const to = Math.min(upperBound, Math.max(start, end));
    for (let line = from; line <= to; line += 1) resolved.add(line);
  });

  return resolved;
};

const isCodeCardLineTuple = (
  selection: readonly [number, number] | CodeCardLineRange,
): selection is readonly [number, number] => Array.isArray(selection);

export const codeCardLanguageOption = (language: CodeCardLanguage): CodeCardLanguageOption =>
  CODE_CARD_LANGUAGES.find((entry) => entry.value === language) ?? CODE_CARD_LANGUAGES.at(-1)!;

let highlighterPromise: Promise<CodeCardHighlighter> | undefined;

const createCodeCardHighlighter = async (): Promise<CodeCardHighlighter> => {
  const highlighter = await import("./highlighter");
  return highlighter.createCodeCardHighlighter();
};

const getCodeCardHighlighter = (): Promise<CodeCardHighlighter> => {
  highlighterPromise ??= createCodeCardHighlighter();
  return highlighterPromise;
};

const shikiLanguage = (language: CodeCardLanguage): string =>
  language === "plaintext" ? "text" : language;

/** Maps the public palette family and surface scheme to a loaded Shiki theme. */
export const resolveCodeCardTheme = (
  codeTheme: CodeCardCodeTheme,
  scheme: Exclude<CodeCardTheme, "auto">,
): string => {
  if (codeTheme === "vitesse") return scheme === "dark" ? "vitesse-light" : "vitesse-dark";
  if (codeTheme === "material") {
    return scheme === "dark" ? "material-theme-lighter" : "material-theme-palenight";
  }
  return scheme === "dark" ? "github-light" : "github-dark";
};

/** Produces line-preserving Shiki tokens for syntax rendering and line decoration. */
export const highlightCodeCardSource = async (
  source: string,
  language: CodeCardLanguage,
  theme: string,
): Promise<CodeCardHighlightResult> => {
  const normalized = normalizeCodeCardSource(source);
  if (language === "plaintext") {
    return {
      lines: normalized
        .split("\n")
        .map((line) => [{ content: line || " ", color: "currentColor", fontStyle: 0 }]),
      foreground: "currentColor",
      background: "transparent",
    };
  }

  const highlighter = await getCodeCardHighlighter();
  const result = highlighter.codeToTokens(normalized, {
    lang: shikiLanguage(language),
    theme,
  });
  const foreground = result.fg ?? "currentColor";
  const background = result.bg ?? "transparent";
  return {
    lines: result.tokens.map((line) =>
      line.length > 0
        ? line.map((token) => ({
            content: token.content,
            color: token.color ?? foreground,
            fontStyle: token.fontStyle ?? 0,
          }))
        : [{ content: " ", color: foreground, fontStyle: 0 }],
    ),
    foreground,
    background,
  };
};

const normalizeLooseSource = (source: string): string =>
  normalizeCodeCardSource(source)
    .split("\n")
    .map((line) => line.replace(/[\t ]+$/u, ""))
    .join("\n")
    .replace(/\n*$/u, "\n");

/** Formats source with the language-specific Prettier parser when available. */
export const formatCodeCardSource = async (
  source: string,
  language: CodeCardLanguage,
): Promise<string> => {
  const normalized = normalizeCodeCardSource(source);
  if (language === "bash" || language === "plaintext") return normalizeLooseSource(normalized);

  const { format } = await import("prettier/standalone");
  const options = {
    printWidth: 88,
    tabWidth: 2,
    useTabs: false,
    semi: true,
    singleQuote: false,
  } as const;

  if (language === "javascript") {
    const [{ default: babel }, { default: estree }] = await Promise.all([
      import("prettier/plugins/babel"),
      import("prettier/plugins/estree"),
    ]);
    return format(normalized, { ...options, parser: "babel", plugins: [babel, estree] });
  }
  if (language === "typescript") {
    const [{ default: typescriptPlugin }, { default: estree }] = await Promise.all([
      import("prettier/plugins/typescript"),
      import("prettier/plugins/estree"),
    ]);
    return format(normalized, {
      ...options,
      parser: "typescript",
      plugins: [typescriptPlugin, estree],
    });
  }
  if (language === "html" || language === "vue") {
    const { default: htmlPlugin } = await import("prettier/plugins/html");
    return format(normalized, {
      ...options,
      parser: language === "vue" ? "vue" : "html",
      plugins: [htmlPlugin],
    });
  }
  if (language === "css" || language === "scss") {
    const { default: postcss } = await import("prettier/plugins/postcss");
    return format(normalized, { ...options, parser: language, plugins: [postcss] });
  }
  if (language === "json") {
    const [{ default: babel }, { default: estree }] = await Promise.all([
      import("prettier/plugins/babel"),
      import("prettier/plugins/estree"),
    ]);
    return format(normalized, { ...options, parser: "json", plugins: [babel, estree] });
  }

  const { default: markdownPlugin } = await import("prettier/plugins/markdown");
  return format(normalized, { ...options, parser: "markdown", plugins: [markdownPlugin] });
};
