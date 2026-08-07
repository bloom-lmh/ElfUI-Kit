import {
  defineHtml,
  defineProps,
  defineStyle,
  inject,
  onMounted,
  onUnmounted,
  useComponents,
  useHost,
  useRef,
} from "@elfui/core";
import { Table } from "@elfui/kit-src/components/Data/Table";
import type { TableColumn } from "@elfui/kit-src/components/Data/Table/types";
import { useLocaleProvider } from "@elfui/kit-src/components/Providers/context";
import { API_BUILDER_KEY, type ApiBuilderContext } from "../ApiBuilder/context";
import type { ApiBuilderRole } from "../ApiBuilder/types";
import styles from "./style.scss?inline";
import type { PropsTableProps, PropsTableSlots, TableRow } from "./types";

export type { PropsTableProps, PropsTableSlots, TableCellValue, TableRow } from "./types";

useComponents({ "props-table-data": Table });

const props = defineProps<PropsTableProps>({
  title: { type: String, default: "Props" },
  rows: { type: Array, default: () => [] as TableRow[] },
  emptyText: { type: String, default: "" },
  role: { type: String, default: "" },
  component: { type: String, default: "" },
});

const locale = useLocaleProvider();
const host = useHost();
const sectionTitle = useRef("");
const builderCtx = inject<ApiBuilderContext | null>(API_BUILDER_KEY, null);
let adjacentHeading: HTMLHeadingElement | null = null;
let titleObserver: MutationObserver | null = null;

const active = (): boolean => Boolean(builderCtx && props.role);
const tableComponent = (): string => props.component || builderCtx?.component || "";

const syncSectionTitle = (): void => {
  sectionTitle.set(adjacentHeading?.textContent?.trim() || "");
};

onMounted(() => {
  if (builderCtx && props.role) builderCtx.registerTable(props.role, props.rows, tableComponent());
  // 构建器模式下标题由 elf-api-builder 接管，不再提升
  if (active()) return;
  const previous = host.previousElementSibling;
  if (!(previous instanceof HTMLHeadingElement) || previous.localName !== "h2") return;
  adjacentHeading = previous;
  adjacentHeading.hidden = true;
  adjacentHeading.setAttribute("data-promoted-to-props-table", "");
  syncSectionTitle();
  titleObserver = new MutationObserver(syncSectionTitle);
  titleObserver.observe(adjacentHeading, {
    childList: true,
    subtree: true,
    characterData: true,
  });
});

onUnmounted(() => {
  titleObserver?.disconnect();
  titleObserver = null;
  if (adjacentHeading) {
    adjacentHeading.hidden = false;
    adjacentHeading.removeAttribute("data-promoted-to-props-table");
  }
  adjacentHeading = null;
});

const rows = (): TableRow[] => (Array.isArray(props.rows) ? props.rows : []);
const columns = (): TableColumn[] => {
  const base: TableColumn[] = [
    { prop: "name", label: locale.t("playground.name"), minWidth: 190 },
    { prop: "type", label: locale.t("playground.type"), minWidth: 210 },
    { prop: "default", label: locale.t("playground.default"), minWidth: 120 },
    { prop: "desc", label: locale.t("playground.description"), minWidth: 320 },
  ];
  if (!active()) return base;
  // Table 内置 selection 列（多选 + 表头全选）
  return [{ type: "selection", width: 48, align: "center" }, ...base];
};

const selectedKeys = (): string[] => {
  if (!builderCtx || !props.role) return [];
  return Object.keys(builderCtx.selections[props.role]?.[tableComponent()] ?? {});
};

/** Table 内置 selection 变更时，把选中行同步给构建器（载荷在 event.detail）。 */
const onSelectionChange = (event: Event): void => {
  if (!builderCtx || !props.role) return;
  const selected = (event as CustomEvent).detail as TableRow[] | undefined;
  if (!Array.isArray(selected)) return;
  const role = props.role as ApiBuilderRole;
  builderCtx.setSelected(
    role,
    selected.map((row) => row.name),
    tableComponent(),
  );
};

defineStyle(styles);

const PropsTable = defineHtml<PropsTableProps, Record<string, never>, PropsTableSlots>(`
  <h2 v-if=${sectionTitle.value} class="section-title">${sectionTitle.value}</h2>
  <props-table-data
    :title=${props.title}
    title-variant="muted"
    :data.prop=${rows()}
    :columns.prop=${columns()}
    :selectedKeys.prop=${selectedKeys()}
    @selection-change=${onSelectionChange}
    row-key="name"
    table-layout="auto"
    border
    :empty-text=${props.emptyText || locale.t("table.empty")}
  >
    <slot slot="empty" name="empty">${props.emptyText || locale.t("table.empty")}</slot>
  </props-table-data>
`);

export { PropsTable };
