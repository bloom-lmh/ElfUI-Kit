import { defineHtml, defineProps, defineStyle, useComponents } from "@elfui/core";
import { Table } from "../../Data/Table";
import type { TableColumn } from "../../Data/Table/types";
import { useLocaleProvider } from "../../Providers/context";
import styles from "./style.scss?inline";
import type { PropsTableProps, PropsTableSlots, TableRow } from "./types";

export type { PropsTableProps, PropsTableSlots, TableCellValue, TableRow } from "./types";

useComponents({ "props-table-data": Table });

const props = defineProps<PropsTableProps>({
  title: { type: String, default: "Props" },
  rows: { type: Array, default: () => [] as TableRow[] },
  emptyText: { type: String, default: "" }
});

const locale = useLocaleProvider();
const rows = (): TableRow[] => Array.isArray(props.rows) ? props.rows : [];
const columns = (): TableColumn[] => [
  { prop: "name", label: locale.t("playground.name"), minWidth: 150 },
  { prop: "type", label: locale.t("playground.type"), minWidth: 210 },
  { prop: "default", label: locale.t("playground.default"), minWidth: 120 },
  { prop: "desc", label: locale.t("playground.description"), minWidth: 320 }
];

defineStyle(styles);

const PropsTable = defineHtml<PropsTableProps, Record<string, never>, PropsTableSlots>(`
  <props-table-data
    :title=${props.title}
    title-variant="muted"
    :data.prop=${rows()}
    :columns.prop=${columns()}
    row-key="name"
    table-layout="auto"
    size="small"
    border
    :empty-text=${props.emptyText || locale.t("table.empty")}
  >
    <slot slot="empty" name="empty">${props.emptyText || locale.t("table.empty")}</slot>
  </props-table-data>
`);

export { PropsTable };
