/** A table column definition shared by AI table primitives. */
export interface AiTableColumn {
  key: string;
  label: string;
  sortable?: boolean;
  align?: "left" | "center" | "right";
  width?: string;
}

/** One CRM-style record row. */
export interface AiRecordRow {
  id?: string | number;
  avatar?: string;
  cells: Record<string, unknown>;
  tags?: string[];
  href?: string;
  meta?: string;
}

/** User-facing labels for `elf-ai-records-table`. */
export interface AiRecordsTableLabels {
  table: string;
  selectAll: string;
  selectRow: string;
  sortAscending: string;
  sortDescending: string;
  noResults: string;
}

/** Public properties for `elf-ai-records-table`. */
export interface AiRecordsTableProps {
  columns: AiTableColumn[];
  rows: AiRecordRow[];
  selectable: boolean;
  sortBy: string;
  sortOrder: "asc" | "desc";
  showFooter: boolean;
  footerText: string;
  /** Optional value formatter; receives the raw cell value, row, and column key. */
  formatCell?: (value: unknown, row: AiRecordRow, key: string) => string;
  labels: Partial<AiRecordsTableLabels>;
  ariaLabel: string;
}

/** Payload emitted when sorting changes. */
export interface AiRecordsSortDetail {
  key: string;
  order: "asc" | "desc";
}

/** Semantic events emitted by `elf-ai-records-table`. */
export interface AiRecordsTableEmits {
  "sort-change": [detail: AiRecordsSortDetail];
  "selection-change": [ids: (string | number)[]];
  "row-click": [detail: AiRecordRow];
}

/** Imperative methods exposed by `elf-ai-records-table`. */
export interface AiRecordsTableExpose {
  getSelectedIds(): (string | number)[];
  clearSelection(): void;
  toggleRow(id: string | number): void;
}

export type AiRecordsTableElement = HTMLElement &
  Partial<AiRecordsTableProps> &
  AiRecordsTableExpose;
