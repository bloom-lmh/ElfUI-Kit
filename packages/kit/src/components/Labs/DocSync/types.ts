// cspell:words syncchange editstart

/** How a pane renders the shared block model. */
export type DocSyncMode = "source" | "preview";

/** Custom parser: turns any source content into the shared block model. */
export type DocSyncParser = (source: unknown) => DocSyncBlock[];

/** Custom renderer: renders one block for a pane. Strings are trusted HTML. */
export type DocSyncRenderer = (block: DocSyncBlock, index: number) => unknown;

/** One block in the shared sync model (ElfUI Sync Document Protocol). */
export interface DocSyncBlock {
  /** Stable sync id. Generated deterministically when omitted. */
  id?: string;
  type: string;
  level?: number;
  /** 1-based start line in the source content (used by the line-number gutter). */
  line?: number;
  text?: string;
  items?: string[];
  rows?: string[][];
  refs?: string[];
  meta?: Record<string, unknown>;
}

export interface DocSyncProps {
  blocks: DocSyncBlock[];
  source: unknown;
  parse: DocSyncParser | null;
  renderLeft: DocSyncRenderer | null;
  renderRight: DocSyncRenderer | null;
  editable: boolean;
  lineNumbers: boolean;
  ruler: boolean;
  leftMode: DocSyncMode;
  rightMode: DocSyncMode;
  leftLabel: string;
  rightLabel: string;
  lockScroll: boolean;
  overscan: number;
  estimatedHeight: number;
  split: number;
  height: string | number;
  ariaLabel: string;
}

export interface DocSyncEmits {
  activate: [id: string | null];
  syncchange: [detail: { side: "left" | "right"; id: string | null }];
  editstart: [detail: { id: string; side: "left" | "right" }];
  edit: [detail: { id: string; side: "left" | "right"; block: DocSyncBlock }];
  swap: [];
}

export interface DocSyncExpose {
  activate(id: string): void;
  clearActive(): void;
  scrollTo(id: string, side?: "left" | "right"): void;
}

export type DocSyncElement = HTMLElement & Partial<DocSyncProps> & DocSyncExpose;
