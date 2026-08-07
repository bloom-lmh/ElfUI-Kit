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
  /** 置于 elf-api-builder 内时声明本表角色（props/events/slots/methods/exposes）。缺省为纯文档表。 */
  role?: string;
  /** 本表所属组件标签；缺省使用 elf-api-builder 的 component。 */
  component?: string;
}

export interface PropsTableSlots {
  empty?: unknown;
}
