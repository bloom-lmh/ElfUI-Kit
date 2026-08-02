import {
  defineHtml,
  defineProps,
  defineStyle,
  onMounted,
  onUnmounted,
  useComponents,
  useHost,
  useRef,
} from "@elfui/core";
import { Table } from "@elfui/kit-src/components/Data/Table";
import type { TableColumn } from "@elfui/kit-src/components/Data/Table/types";
import { useLocaleProvider } from "@elfui/kit-src/components/Providers/context";
import styles from "./style.scss?inline";
import type { PropsTableProps, PropsTableSlots, TableRow } from "./types";

export type { PropsTableProps, PropsTableSlots, TableCellValue, TableRow } from "./types";

useComponents({ "props-table-data": Table });

const props = defineProps<PropsTableProps>({
  title: { type: String, default: "Props" },
  rows: { type: Array, default: () => [] as TableRow[] },
  emptyText: { type: String, default: "" },
});

const locale = useLocaleProvider();
const host = useHost();
const sectionTitle = useRef("");
let adjacentHeading: HTMLHeadingElement | null = null;
let titleObserver: MutationObserver | null = null;

const syncSectionTitle = (): void => {
  sectionTitle.set(adjacentHeading?.textContent?.trim() || "");
};

onMounted(() => {
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
const columns = (): TableColumn[] => [
  { prop: "name", label: locale.t("playground.name"), minWidth: 190 },
  { prop: "type", label: locale.t("playground.type"), minWidth: 210 },
  { prop: "default", label: locale.t("playground.default"), minWidth: 120 },
  { prop: "desc", label: locale.t("playground.description"), minWidth: 320 },
];

defineStyle(styles);

const PropsTable = defineHtml<PropsTableProps, Record<string, never>, PropsTableSlots>(`
  <h2 v-if=${sectionTitle.value} class="section-title">${sectionTitle.value}</h2>
  <props-table-data
    :title=${props.title}
    title-variant="muted"
    :data.prop=${rows()}
    :columns.prop=${columns()}
    row-key="name"
    table-layout="auto"
    border
    :empty-text=${props.emptyText || locale.t("table.empty")}
  >
    <slot slot="empty" name="empty">${props.emptyText || locale.t("table.empty")}</slot>
  </props-table-data>
`);

export { PropsTable };
