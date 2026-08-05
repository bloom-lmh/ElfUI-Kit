import type MarkdownIt from "markdown-it";

export type MdPageCodeTheme = "auto" | "github" | "material" | "vitesse";
export type MdPageDensity = "default" | "comfortable" | "compact";
export type MdPageTheme = "default" | "minimal" | "paper" | "midnight";

export interface MdPageTocEntry {
  id: string;
  text: string;
  depth: number;
}

/** Result contract shared by the built-in parser and custom parsers. */
export interface MdRenderResult {
  html: string;
  toc?: MdPageTocEntry[];
  title?: string;
}

export interface MdPageLabels {
  copy: string;
  copied: string;
  loading: string;
}

export interface MdParseContext {
  source: string;
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

/** Full parser override. When provided, it replaces the built-in markdown-it pipeline. */
export type MdPageParser = (source: string, context: MdParseContext) => MdRenderResult;

/** Rule-level extension: mutate the markdown-it instance after the default plugins. */
export type MdPageExtend = (md: MarkdownIt, context: MdParseContext) => void;

/** Final HTML transformation before DOM injection. */
export type MdPageRenderHook = (html: string, context: MdParseContext) => string;

export interface MdPageProps {
  /** Markdown source passed as a property. The default slot takes precedence. */
  content: string;
  /** Optional markdown file URL fetched on demand. Lowest priority source. */
  src: string;
  /** Content column width. */
  maxWidth: string;
  /** Base heading level applied to the markdown h1..h6 hierarchy. */
  baseHeadingLevel: number;
  /** Syntax theme family for fenced code blocks. */
  codeTheme: MdPageCodeTheme;
  /** Named typography/surface preset. */
  theme: MdPageTheme;
  /** Individual `--elf-md-*` variable overrides, applied on the host. */
  tokens: Record<string, string>;
  /** Generates heading anchors and emits the outline through `toc-change`. */
  toc: boolean;
  /** Allows raw HTML inside the markdown, like VitePress. */
  allowHtml: boolean;
  /** Content density preset. */
  density: MdPageDensity;
  /** Enables GFM task lists. */
  taskLists: boolean;
  /** Custom container names rendered as callouts (tip, warning, danger, info...). */
  containers: string[];
  /** Enables VitePress-style tabbed code groups. */
  codeGroups: boolean;
  /** Enables footnotes. */
  footnotes: boolean;
  /** Enables code language labels, copy buttons, and `{1,3-5}` line highlighting. */
  codeTools: boolean;
  /** Base URL used to resolve relative links and images from fetched markdown. */
  base: string;
  /** Selector for the scroll container used by scroll spy and lazy highlighting. */
  scrollRoot: string;
  /** Renders hoverable heading anchor links. */
  anchors: boolean;
  /** Full parser override. */
  parser?: MdPageParser;
  /** Rule-level markdown-it extension. */
  extend?: MdPageExtend;
  /** Final HTML render hook. */
  render?: MdPageRenderHook;
  /** Sanitizes the rendered HTML with DOMPurify before code enhancement. */
  sanitize: boolean;
  /** Overrides for copy/loading labels. */
  labels: Partial<MdPageLabels>;
}

export interface MdPageEmits {
  "toc-change": [entries: MdPageTocEntry[]];
  "title-change": [title: string];
  load: [source: string];
  error: [message: string];
  "link-click": [detail: { href: string; target: string; text: string }];
  "active-change": [id: string];
}

export interface MdPageExpose {
  /** Re-parses the current markdown source. */
  render(): void;
  /** Returns the latest heading outline. */
  outline(): MdPageTocEntry[];
  /** Returns the latest rendered HTML string. */
  getHtml(): string;
  /** Returns the heading id currently active in the scroll spy. */
  active(): string;
}

export interface MdPageSlots {
  default?: unknown;
  loading?: unknown;
  error?: unknown;
}

export type MdPageElement = HTMLElement & MdPageExpose;
