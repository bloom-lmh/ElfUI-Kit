/** Diff treatment applied to one table cell. */
export type AiDiffStatus = "same" | "add" | "remove" | "change";

/** One cell value with optional diff metadata. */
export interface AiDiffCell {
  value: string;
  status?: AiDiffStatus;
  /** Previous value shown struck through for change/remove cells. */
  original?: string;
}

/** A table column definition shared by AI table primitives. */
export interface AiTableColumn {
  key: string;
  label: string;
}

/** One proposed table row. */
export interface AiDiffRow {
  id?: string | number;
  cells: Record<string, AiDiffCell>;
}

/** User-facing labels for `elf-ai-diff-table`. */
export interface AiDiffTableLabels {
  table: string;
  summary: string;
  add: string;
  remove: string;
  change: string;
}

/** Public properties for `elf-ai-diff-table`. */
export interface AiDiffTableProps {
  title: string;
  columns: AiTableColumn[];
  rows: AiDiffRow[];
  summary?: string;
  labels: Partial<AiDiffTableLabels>;
  ariaLabel: string;
}

/** Semantic events emitted by `elf-ai-diff-table`. */
export interface AiDiffTableEmits {
  "row-click": [detail: AiDiffRow];
}

export type AiDiffTableElement = HTMLElement & Partial<AiDiffTableProps>;
