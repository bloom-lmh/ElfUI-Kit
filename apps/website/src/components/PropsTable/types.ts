export type TableCellValue = string | number | boolean | null | undefined;

/** @internal Documentation-site infrastructure; not part of the ElfUI public component API. */
export interface TableRow {
  [key: string]: TableCellValue;
  name: string;
  type?: TableCellValue;
  default?: TableCellValue;
  desc?: TableCellValue;
}

export interface PropsTableProps {
  title: string;
  rows: TableRow[];
  emptyText: string;
}

export interface PropsTableSlots {
  empty?: unknown;
}
