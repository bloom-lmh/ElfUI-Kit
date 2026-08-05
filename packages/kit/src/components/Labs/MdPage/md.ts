// cspell:ignore markdownit
import MarkdownIt from "markdown-it";

import { getCodeCardHighlighter } from "../CodeCard/model";
import { container, footnote, taskLists, type ContainerToken } from "./plugins";
import type { MdPageCodeTheme, MdPageExtend, MdPageTocEntry, MdRenderResult } from "./types";

export interface MdRenderOptions {
  allowHtml: boolean;
  baseHeadingLevel: number;
  toc: boolean;
  anchors: boolean;
  taskLists: boolean;
  containers: string[];
  codeGroups: boolean;
  footnotes: boolean;
  codeTools: boolean;
}

export interface MdPipeline {
  render(source: string, options: MdRenderOptions): MdRenderResult;
}

interface MdInstanceState {
  toc: MdPageTocEntry[];
  index: number;
  base: number;
  tocEnabled: boolean;
  anchors: boolean;
  slugCounts: Map<string, number>;
}

export const DEFAULT_MD_CONTAINERS = ["tip", "warning", "danger", "info"] as const;
export const MD_THEMES = ["default", "minimal", "paper", "midnight"] as const;
export const MD_CODE_THEMES = ["auto", "github", "material", "vitesse"] as const;
export const MD_DENSITIES = ["default", "comfortable", "compact"] as const;

const clampHeading = (level: number): number => Math.min(6, Math.max(1, level));

const slugify = (text: string): string =>
  String(text || "")
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

const uniqueSlug = (state: MdInstanceState, text: string): string => {
  const base = slugify(text) || `section-${state.index}`;
  const count = state.slugCounts.get(base) ?? 0;
  state.slugCounts.set(base, count + 1);
  return count === 0 ? base : `${base}-${count + 1}`;
};

const headingLevel = (state: MdInstanceState, tag: string): number =>
  clampHeading(Number(tag.slice(1)) + state.base - 1);

const installHeadingAnchors = (md: MarkdownIt, state: MdInstanceState): void => {
  md.renderer.rules.heading_open = (tokens, index) => {
    const token = tokens[index]!;
    const level = headingLevel(state, token.tag);
    let text = "";
    for (let i = index + 1; i < tokens.length; i += 1) {
      const next = tokens[i]!;
      if (next.type === "heading_close") break;
      text += next.content || "";
    }
    text = text.trim();
    state.index += 1;
    const id = uniqueSlug(state, text);
    if (state.tocEnabled) {
      state.toc.push({ id, text, depth: level });
    }
    const anchor = state.anchors
      ? `<a class="md-anchor" href="#${id}" aria-label="Anchor"></a>`
      : "";
    return `<h${level} id="${id}">${anchor}`;
  };

  md.renderer.rules.heading_close = (tokens, index) => {
    const level = headingLevel(state, tokens[index]!.tag);
    return `</h${level}>`;
  };
};

const resolveHighlightLines = (raw: string): Set<number> => {
  const resolved = new Set<number>();
  if (!raw) return resolved;
  for (const part of String(raw).split(",")) {
    const range = part.trim().match(/^(\d+)(?:-(\d+))?$/);
    if (!range) continue;
    const start = Number(range[1]);
    const end = range[2] ? Number(range[2]) : start;
    for (let line = start; line <= Math.max(start, end); line += 1) resolved.add(line);
  }
  return resolved;
};

const installFence = (md: MarkdownIt): void => {
  md.renderer.rules.fence = (tokens, index) => {
    const token = tokens[index]!;
    const info = token.info ? md.utils.unescapeAll(token.info).trim() : "";
    const parts = info.split(/\s+/);
    const lang = parts[0] ?? "";
    const rest = info.slice(lang.length).trim();
    const title = rest.match(/title="([^"]*)"/)?.[1] ?? "";
    const lines = rest.match(/\{([^}]*)\}/)?.[1] ?? "";
    const code = token.content.replace(/\n$/, "");
    const langClass = lang ? ` language-${md.utils.escapeHtml(lang)}` : "";
    const escaped = md.utils.escapeHtml(code);
    return (
      `<pre class="md-fence" data-lang="${md.utils.escapeHtml(lang)}" ` +
      `data-title="${md.utils.escapeHtml(title)}" data-lines="${md.utils.escapeHtml(lines)}">` +
      `<code class="md-fence-code${langClass}">${escaped}</code></pre>\n`
    );
  };
};

const installContainer = (md: MarkdownIt, name: string): void => {
  md.use(container, name, {
    validate: (params: string) => params.trim().split(/\s+/, 1)[0] === name,
    render: (tokens: Array<{ nesting: number; info: string }>, index: number) => {
      const token = tokens[index]!;
      if (token.nesting === 1) {
        const title = token.info.trim().slice(name.length).trim();
        const titleHtml = title
          ? `<p class="md-container-title">${md.renderInline(title)}</p>`
          : "";
        return `<div class="md-container is-${md.utils.escapeHtml(name)}" role="note">${titleHtml}`;
      }
      return "</div>";
    },
  });
};

const findContainerEnd = (tokens: Array<{ type: string }>, index: number): number => {
  let depth = 0;
  for (let i = index; i < tokens.length; i += 1) {
    const type = tokens[i]!.type;
    if (type.endsWith("_open")) depth += 1;
    else if (type.endsWith("_close")) {
      depth -= 1;
      if (depth === 0) return i;
    }
  }
  return tokens.length;
};

/** VitePress-style tabbed code blocks:
 *  ::: code-group
 *  ```ts [config.ts]
 *  ...
 *  ```
 *  :::
 */
const installCodeGroup = (md: MarkdownIt): void => {
  md.use(container, "code-group", {
    validate: (params: string) => params.trim() === "code-group",
    render: (
      tokens: ContainerToken[],
      index: number,
      options: unknown,
      env: unknown,
      self: unknown,
    ) => {
      const token = tokens[index]!;
      if (token.nesting === 1) {
        const end = findContainerEnd(tokens, index);
        const fences = tokens.slice(index + 1, end).filter((entry) => entry.type === "fence");
        if (fences.length === 0) return "";
        const fenceRule = md.renderer.rules.fence as (
          fenceTokens: ContainerToken[],
          fenceIndex: number,
          renderOptions: unknown,
          renderEnv: unknown,
          renderSelf: unknown,
        ) => string;
        const tabs = fences
          .map((fence, panelIndex) => {
            const info = fence.info ? md.utils.unescapeAll(fence.info).trim() : "";
            const language = info.split(/\s+/)[0] ?? "";
            const tabName =
              info.match(/\[([^\]]+)\]/)?.[1] ?? (language || `Tab ${panelIndex + 1}`);
            return (
              `<button type="button" class="md-code-group-tab" role="tab" ` +
              `data-panel="${panelIndex}" ` +
              `tabindex="${panelIndex === 0 ? 0 : -1}" ` +
              `aria-selected="${panelIndex === 0 ? "true" : "false"}">` +
              `${md.utils.escapeHtml(tabName)}</button>`
            );
          })
          .join("");
        const panels = fences
          .map((fence, panelIndex) => {
            const fenceIndex = tokens.indexOf(fence);
            const fenceHtml =
              fenceIndex >= 0 ? fenceRule(tokens, fenceIndex, options, env, self) : "";
            return (
              `<div class="md-code-group-panel${panelIndex === 0 ? " is-active" : ""}" ` +
              `data-tab="${panelIndex}">${fenceHtml}</div>`
            );
          })
          .join("");
        return (
          `<div class="md-code-group" role="tablist">` +
          `<div class="md-code-group-head">${tabs}</div>` +
          `<div class="md-code-group-panels">${panels}</div></div>`
        );
      }
      return "";
    },
  });
};

const buildInstance = (options: MdRenderOptions, extend?: MdPageExtend): MarkdownIt => {
  const state: MdInstanceState = {
    toc: [],
    index: 0,
    base: clampHeading(Number(options.baseHeadingLevel) || 2),
    tocEnabled: options.toc,
    anchors: options.anchors,
    slugCounts: new Map(),
  };
  const md = new MarkdownIt({
    html: false,
    linkify: true,
    breaks: false,
    typographer: false,
  });
  (md as MarkdownIt & { __mdState?: MdInstanceState }).__mdState = state;
  installHeadingAnchors(md, state);
  installFence(md);
  if (options.codeGroups) installCodeGroup(md);
  if (options.taskLists) {
    md.use(taskLists, { enabled: true, label: true, labelAfter: false });
  }
  if (options.footnotes) md.use(footnote);
  for (const name of options.containers) {
    if (name.trim()) installContainer(md, name.trim());
  }
  extend?.(md, {
    source: "",
    allowHtml: options.allowHtml,
    baseHeadingLevel: options.baseHeadingLevel,
    toc: options.toc,
    anchors: options.anchors,
    taskLists: options.taskLists,
    containers: options.containers,
    codeGroups: options.codeGroups,
    footnotes: options.footnotes,
    codeTools: options.codeTools,
  });
  md.set({ html: options.allowHtml });
  return md;
};

/** Creates a markdown-it pipeline; `extend` can add or override any rule. */
export const createMdPipeline = (extend?: MdPageExtend): MdPipeline => ({
  render(source, options) {
    const md = buildInstance(options, extend);
    const html = md.render(source);
    const state = (md as MarkdownIt & { __mdState?: MdInstanceState }).__mdState;
    return { html, toc: state?.toc ?? [] };
  },
});

/** Renders one Markdown source with the default pipeline and options. */
export const renderMarkdown = (
  source: string,
  options?: Partial<MdRenderOptions>,
): MdRenderResult =>
  createMdPipeline().render(source, {
    allowHtml: true,
    baseHeadingLevel: 1,
    toc: true,
    anchors: true,
    taskLists: true,
    codeGroups: true,
    containers: ["note", "tip", "warning"],
    footnotes: true,
    codeTools: true,
    ...options,
  });

const FRONTMATTER_RE = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/;

/** Strips the common template-literal indentation while preserving relative nesting. */
export const normalizeMarkdownSource = (value: string): string => {
  let lines = String(value || "")
    .replace(/\r\n?/g, "\n")
    .split("\n");
  while (lines.length > 0 && !lines[0]!.trim()) lines.shift();
  while (lines.length > 0 && !lines.at(-1)!.trim()) lines.pop();
  if (lines.length === 0) return "";
  const indentOf = (line: string): number => line.match(/^[\t ]*/u)?.[0].length ?? 0;
  // Macro templates add one two-space continuation offset after the first line.
  if (indentOf(lines[0]!) === 0) {
    const continuationIndents = lines
      .slice(1)
      .filter((line) => line.trim())
      .map(indentOf);
    if (continuationIndents.length > 0 && Math.min(...continuationIndents) >= 2) {
      lines = [lines[0]!, ...lines.slice(1).map((line) => (line.trim() ? line.slice(2) : ""))];
    }
  }
  const indents = lines.filter((line) => line.trim()).map(indentOf);
  const common = indents.reduce((minimum, indent) => Math.min(minimum, indent), Infinity);
  const margin = Number.isFinite(common) ? common : 0;
  return lines.map((line) => (line.trim() ? line.slice(margin) : "")).join("\n");
};

export const parseFrontmatter = (source: string): { title: string; body: string } => {
  const text = String(source || "");
  const match = text.match(FRONTMATTER_RE);
  if (!match) return { title: "", body: text };
  let title = "";
  for (const line of String(match[1] || "").split(/\r?\n/)) {
    const pair = line.match(/^\s*title\s*:\s*(.*?)\s*$/i);
    if (pair) title = String(pair[1] || "").replace(/^["']|["']$/g, "");
  }
  return { title, body: text.slice(match[0].length) };
};

const languageAliases = new Map<string, string>([
  ["js", "javascript"],
  ["jsx", "javascript"],
  ["ts", "typescript"],
  ["tsx", "typescript"],
  ["htm", "html"],
  ["md", "markdown"],
  ["mdx", "markdown"],
  ["shell", "bash"],
  ["sh", "bash"],
  ["text", "text"],
  ["txt", "text"],
]);

const languageFromClass = (className: string): string => {
  const match = String(className || "").match(/language-([\w+-]+)/);
  const raw = match?.[1] ?? "text";
  return languageAliases.get(raw) ?? raw;
};

export const resolveMdPageTheme = (
  codeTheme: MdPageCodeTheme,
  scheme: "light" | "dark",
): string => {
  if (codeTheme === "vitesse") return scheme === "dark" ? "vitesse-dark" : "vitesse-light";
  if (codeTheme === "material") {
    return scheme === "dark" ? "material-theme-palenight" : "material-theme-lighter";
  }
  return scheme === "dark" ? "github-dark" : "github-light";
};

export interface MdCodeToolbarLabels {
  copy: string;
  copied: string;
}

const escapeHtml = (value: string): string =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const isRelativeUrl = (value: string): boolean =>
  !/^(?:[a-z][a-z0-9+.-]*:|\/|#|data:)/i.test(String(value || ""));

const resolveBaseUrl = (base: string): string => {
  try {
    return new URL(base, typeof document !== "undefined" ? document.baseURI : undefined).href;
  } catch {
    return base;
  }
};

/** Rewrites relative links and images against `base` for fetched markdown. */
export const rewriteRelativeUrls = (root: HTMLElement, base: string): void => {
  const resolvedBase = resolveBaseUrl(base);
  const apply = (element: HTMLElement, attribute: string): void => {
    const value = element.getAttribute(attribute);
    if (value && isRelativeUrl(value)) {
      try {
        element.setAttribute(attribute, new URL(value, resolvedBase).href);
      } catch {
        // Keep the original value when the base cannot be resolved.
      }
    }
  };
  root.querySelectorAll<HTMLElement>("a[href]").forEach((anchor) => apply(anchor, "href"));
  root.querySelectorAll<HTMLElement>("img[src]").forEach((image) => apply(image, "src"));
};

/**
 * Upgrades every fenced code block to a highlighted block with a toolbar.
 * Keeps the escaped fallback when the language or theme cannot be resolved.
 */
export const highlightCodeBlocks = async (
  root: HTMLElement,
  theme: string,
  labels: MdCodeToolbarLabels,
): Promise<number> => {
  const fences =
    root instanceof HTMLElement && root.matches("pre.md-fence")
      ? [root]
      : Array.from(root.querySelectorAll<HTMLElement>("pre.md-fence"));
  if (fences.length === 0) return 0;
  const highlighter = await getCodeCardHighlighter();
  let updated = 0;

  for (const fence of fences) {
    const code = fence.querySelector<HTMLElement>("code");
    if (!code) continue;
    const language = languageFromClass(code.className);
    const rawLanguage = fence.dataset.lang || language;
    const title = fence.dataset.title || "";
    const highlightedLines = resolveHighlightLines(fence.dataset.lines || "");
    const source = code.textContent ?? "";

    try {
      const result = highlighter.codeToTokens(source, { lang: language, theme });
      const foreground = result.fg ?? "currentColor";
      const background = result.bg ?? "transparent";
      const lineCount = result.tokens.length;
      const lines = result.tokens
        .map((tokens, index) => {
          const number = index + 1;
          const className = ["md-code-line", highlightedLines.has(number) ? "is-highlighted" : ""]
            .filter(Boolean)
            .join(" ");
          const content =
            tokens.length > 0
              ? tokens
                  .map(
                    (token) =>
                      `<span style="color:${token.color ?? foreground}">${escapeHtml(token.content)}</span>`,
                  )
                  .join("")
              : " ";
          return `<span class="${className}" data-line="${number}">${content}</span>${
            number < lineCount ? "\n" : ""
          }`;
        })
        .join("");
      const languageLabel = rawLanguage === "text" ? "" : rawLanguage;
      const titleHtml = title ? `<span class="md-code-title">${escapeHtml(title)}</span>` : "";
      const langHtml =
        languageLabel || title
          ? `<span class="md-code-lang">${escapeHtml(languageLabel || "text")}</span>`
          : "";
      fence.outerHTML =
        `<div class="md-code-block">` +
        `<div class="md-code-head">${langHtml}${titleHtml}` +
        `<button type="button" class="md-code-copy" aria-live="polite">${labels.copy}</button></div>` +
        `<pre class="shiki md-code-pre" style="--md-code-fg:${foreground};--md-code-bg:${background}">` +
        `<code>${lines}</code></pre></div>`;
      updated += 1;
    } catch {
      // Keep the escaped default block.
    }
  }
  return updated;
};
