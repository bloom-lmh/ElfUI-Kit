import {
  defineEmits,
  defineExpose,
  defineHtml,
  defineProps,
  defineStyle,
  useEffect,
  useHostAttr,
  useHostFlag,
  useRef,
} from "@elfui/core";

import styles from "./style.scss?inline";
import type {
  AiFilterChip,
  AiFilterRow,
  AiFilterTableEmits,
  AiFilterTableExpose,
  AiFilterTableLabels,
  AiFilterTableProps,
  AiTableColumn,
} from "./types";

export type {
  AiFilterChip,
  AiFilterRow,
  AiFilterTableElement,
  AiFilterTableEmits,
  AiFilterTableExpose,
  AiFilterTableLabels,
  AiFilterTableProps,
  AiTableColumn,
} from "./types";

const DEFAULT_LABELS: AiFilterTableLabels = {
  table: "Filter table",
  all: "All",
  noResults: "No matching rows",
};

const props = defineProps<AiFilterTableProps>({
  columns: { type: Array, default: () => [] },
  rows: { type: Array, default: () => [] },
  filters: { type: Array, default: () => [] },
  defaultFilter: { type: String, default: "" },
  matchKey: { type: String, default: "status" },
  showCounts: { type: Boolean, default: true },
  labels: { type: Object, default: () => ({}) },
  ariaLabel: { type: String, default: "" },
});

const emit = defineEmits<AiFilterTableEmits>(["filter-change", "row-click"]);
const activeFilter = useRef("");
let lastDefault = "";

const label = (key: keyof AiFilterTableLabels): string =>
  props.labels?.[key] || DEFAULT_LABELS[key] || key;
const columns = (): AiTableColumn[] => props.columns;
const rows = (): AiFilterRow[] => props.rows;
const filters = (): AiFilterChip[] => props.filters;
const rowKey = (row: AiFilterRow, index: number): string | number =>
  row.id ?? `filter-row-${index}`;
const matchValue = (row: AiFilterRow): string => String(row.cells[props.matchKey] ?? "");
const filteredRows = (): AiFilterRow[] => {
  if (!activeFilter.value) return rows();
  return rows().filter((row) => matchValue(row) === activeFilter.value);
};
const countFor = (value: string): number =>
  rows().filter((row) => matchValue(row) === value).length;
const totalCount = (): number => rows().length;
const hasRows = (): boolean => filteredRows().length > 0;
const isActive = (chip: AiFilterChip): boolean => activeFilter.value === chip.value;
const chipCount = (chip: AiFilterChip): number =>
  chip.value === undefined ? totalCount() : countFor(chip.value);
const cellValue = (row: AiFilterRow, column: AiTableColumn): string =>
  String(row.cells[column.key] ?? "—");
const hostLabel = (): string => props.ariaLabel || label("table");

useEffect(() => {
  if (props.defaultFilter !== lastDefault) {
    lastDefault = props.defaultFilter;
    activeFilter.set(props.defaultFilter);
  }
});

const setFilter = (key: string): void => {
  if (activeFilter.value === key) return;
  activeFilter.set(key);
  emit("filter-change", key);
};
const clearFilter = (): void => setFilter("");
const getFilter = (): string => activeFilter.value;
const onFilterClick = (event: Event): void => {
  const key = (event.currentTarget as HTMLElement).dataset.key || "";
  setFilter(key);
};
const onRowClick = (event: Event): void => {
  const index = Number((event.currentTarget as HTMLElement).dataset.index);
  const row = filteredRows()[index];
  if (row) emit("row-click", row);
};

useHostFlag("data-empty", () => !hasRows());
useHostAttr("data-filter", () => activeFilter.value);
useHostAttr("aria-label", hostLabel);

defineExpose<AiFilterTableExpose>({ setFilter, clearFilter, getFilter });

defineStyle(styles);

const AiFilterTable = defineHtml(`
  <div class="filter-table" role="group">
    <div class="chips" role="toolbar" :aria-label=${label("table")}>
      <button
        v-for="chip in filters()"
        :key="chip.key"
        class="chip"
        :class="{ active: isActive(chip) }"
        type="button"
        :data-key="chip.value ?? ''"
        :aria-pressed="String(isActive(chip))"
        @click=${onFilterClick}
      >
        <span>{{ chip.label }}</span>
        <span v-if=${props.showCounts} class="count">{{ chipCount(chip) }}</span>
      </button>
    </div>
    <div class="scroll">
      <table>
        <thead>
          <tr>
            <th v-for="column in columns()" :key="column.key" scope="col">{{ column.label }}</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(row, index) in filteredRows()"
            :key="rowKey(row, index)"
            :data-index="index"
            @click=${onRowClick}
          >
            <td v-for="column in columns()" :key="column.key">{{ cellValue(row, column) }}</td>
          </tr>
        </tbody>
      </table>
      <p v-if=${!hasRows()} class="empty">${label("noResults")}</p>
    </div>
    <footer class="foot"><slot name="footer"></slot></footer>
  </div>
`);

export { AiFilterTable };
