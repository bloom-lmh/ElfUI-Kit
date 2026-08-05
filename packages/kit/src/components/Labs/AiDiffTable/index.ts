import {
  defineEmits,
  defineHtml,
  defineProps,
  defineStyle,
  useHostAttr,
  useHostFlag,
} from "@elfui/core";

import styles from "./style.scss?inline";
import type {
  AiDiffCell,
  AiDiffRow,
  AiDiffStatus,
  AiDiffTableEmits,
  AiDiffTableLabels,
  AiDiffTableProps,
  AiTableColumn,
} from "./types";

export type {
  AiDiffCell,
  AiDiffRow,
  AiDiffStatus,
  AiDiffTableElement,
  AiDiffTableEmits,
  AiDiffTableLabels,
  AiDiffTableProps,
  AiTableColumn,
} from "./types";

const DEFAULT_LABELS: AiDiffTableLabels = {
  table: "Proposed edits",
  summary: "Summary",
  add: "Added",
  remove: "Removed",
  change: "Changed",
};

const STATUSES: readonly AiDiffStatus[] = ["same", "add", "remove", "change"];

const props = defineProps<AiDiffTableProps>({
  title: { type: String, default: "" },
  columns: { type: Array, default: () => [] },
  rows: { type: Array, default: () => [] },
  summary: { type: String, default: "" },
  labels: { type: Object, default: () => ({}) },
  ariaLabel: { type: String, default: "" },
});

const emit = defineEmits<AiDiffTableEmits>(["row-click"]);

const label = (key: keyof AiDiffTableLabels): string =>
  props.labels?.[key] || DEFAULT_LABELS[key] || key;
const columns = (): AiTableColumn[] => props.columns;
const rows = (): AiDiffRow[] => props.rows;
const hasRows = (): boolean => rows().length > 0;
const rowKey = (row: AiDiffRow, index: number): string | number => row.id ?? `diff-row-${index}`;
const cellFor = (row: AiDiffRow, column: AiTableColumn): AiDiffCell => ({
  value: "—",
  status: "same",
  ...(row.cells[column.key] || {}),
});
const resolvedStatus = (cell: AiDiffCell): AiDiffStatus =>
  cell.status && STATUSES.includes(cell.status) ? cell.status : "same";
const cellClass = (cell: AiDiffCell): Record<string, boolean> => ({
  cell: true,
  "is-same": resolvedStatus(cell) === "same",
  "is-add": resolvedStatus(cell) === "add",
  "is-remove": resolvedStatus(cell) === "remove",
  "is-change": resolvedStatus(cell) === "change",
});
const marker = (cell: AiDiffCell): string =>
  resolvedStatus(cell) === "add"
    ? "+"
    : resolvedStatus(cell) === "remove"
      ? "−"
      : resolvedStatus(cell) === "change"
        ? "~"
        : "";
const hasOriginal = (cell: AiDiffCell): boolean =>
  (resolvedStatus(cell) === "remove" || resolvedStatus(cell) === "change") &&
  Boolean(cell.original);
const hostLabel = (): string => props.ariaLabel || `${label("table")}: ${props.title}`;

const onRowClick = (event: Event): void => {
  const index = Number((event.currentTarget as HTMLElement).dataset.index);
  const row = rows()[index];
  if (row) emit("row-click", row);
};

useHostAttr("aria-label", hostLabel);
useHostFlag("data-empty", () => !hasRows());

defineStyle(styles);

const AiDiffTable = defineHtml(`
  <article class="diff-table" role="group">
    <header class="head">
      <h3 class="title">${props.title}</h3>
      <span v-if="props.summary" class="summary">{{ props.summary }}</span>
      <slot name="header"></slot>
    </header>
    <div class="scroll">
      <table :aria-label=${props.ariaLabel || label("table")}>
        <thead>
          <tr>
            <th v-for="column in columns()" :key="column.key" scope="col">{{ column.label }}</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(row, index) in rows()"
            :key="rowKey(row, index)"
            class="row"
            :data-index="index"
            @click=${onRowClick}
          >
            <td v-for="column in columns()" :key="column.key" :class="cellClass(cellFor(row, column))">
              <span v-if="marker(cellFor(row, column))" class="marker" aria-hidden="true">{{ marker(cellFor(row, column)) }}</span>
              <span v-if="hasOriginal(cellFor(row, column))" class="original">{{ cellFor(row, column).original }}</span>
              <span class="value">{{ cellFor(row, column).value }}</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <footer class="foot"><slot name="footer"></slot></footer>
  </article>
`);

export { AiDiffTable };
