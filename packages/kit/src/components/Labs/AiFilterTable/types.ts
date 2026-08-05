/** A table column definition shared by AI table primitives. */
export interface AiTableColumn {
  key: string;
  label: string;
}

/** One status filter chip. */
export interface AiFilterChip {
  key: string;
  label: string;
  value?: string;
}

/** One filterable table row. */
export interface AiFilterRow {
  id?: string | number;
  cells: Record<string, unknown>;
}

/** User-facing labels for `elf-ai-filter-table`. */
export interface AiFilterTableLabels {
  table: string;
  all: string;
  noResults: string;
}

/** Public properties for `elf-ai-filter-table`. */
export interface AiFilterTableProps {
  columns: AiTableColumn[];
  rows: AiFilterRow[];
  filters: AiFilterChip[];
  defaultFilter: string;
  /** Cell key compared against the active filter value. */
  matchKey: string;
  showCounts: boolean;
  labels: Partial<AiFilterTableLabels>;
  ariaLabel: string;
}

/** Semantic events emitted by `elf-ai-filter-table`. */
export interface AiFilterTableEmits {
  "filter-change": [key: string];
  "row-click": [detail: AiFilterRow];
}

/** Imperative methods exposed by `elf-ai-filter-table`. */
export interface AiFilterTableExpose {
  setFilter(key: string): void;
  clearFilter(): void;
  getFilter(): string;
}

export type AiFilterTableElement = HTMLElement & Partial<AiFilterTableProps> & AiFilterTableExpose;
