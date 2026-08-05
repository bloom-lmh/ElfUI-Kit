import {
  defineEmits,
  defineExpose,
  defineHtml,
  defineModel,
  defineProps,
  defineStyle,
  useEffect,
  useHostAttr,
  useHostFlag,
  useRef,
} from "@elfui/core";

import styles from "./style.scss?inline";
import type {
  AiRecordRow,
  AiRecordsSortDetail,
  AiRecordsTableEmits,
  AiRecordsTableExpose,
  AiRecordsTableLabels,
  AiRecordsTableProps,
  AiTableColumn,
} from "./types";

export type {
  AiRecordRow,
  AiRecordsSortDetail,
  AiRecordsTableElement,
  AiRecordsTableEmits,
  AiRecordsTableExpose,
  AiRecordsTableLabels,
  AiRecordsTableProps,
  AiTableColumn,
} from "./types";

const DEFAULT_LABELS: AiRecordsTableLabels = {
  table: "Records",
  selectAll: "Select all rows",
  selectRow: "Select row",
  sortAscending: "Sorted ascending",
  sortDescending: "Sorted descending",
  noResults: "No records",
};

const props = defineProps<AiRecordsTableProps>({
  columns: { type: Array, default: () => [] },
  rows: { type: Array, default: () => [] },
  selectable: { type: Boolean, default: true },
  sortBy: { type: String, default: "" },
  sortOrder: { type: String, default: "asc" },
  showFooter: { type: Boolean, default: true },
  footerText: { type: String, default: "" },
  formatCell: { type: Function, default: null },
  labels: { type: Object, default: () => ({}) },
  ariaLabel: { type: String, default: "" },
});

const emit = defineEmits<AiRecordsTableEmits>(["sort-change", "selection-change", "row-click"]);
const sortBy = defineModel<string>("sortBy", { default: "" });
const sortOrder = defineModel<"asc" | "desc">("sortOrder", { default: "asc" });
const selected = useRef<Set<string | number>>(new Set<string | number>());

const label = (key: keyof AiRecordsTableLabels): string =>
  props.labels?.[key] || DEFAULT_LABELS[key] || key;
const columns = (): AiTableColumn[] => props.columns;
const rows = (): AiRecordRow[] => props.rows;
const hasRows = (): boolean => rows().length > 0;
const rowKey = (row: AiRecordRow, index: number): string | number =>
  row.id ?? `record-row-${index}`;
const cellValue = (row: AiRecordRow, column: AiTableColumn): string => {
  const value = row.cells[column.key];
  if (typeof props.formatCell === "function") return props.formatCell(value, row, column.key);
  if (value === undefined || value === null) return "—";
  return String(value);
};
const rowTags = (row: AiRecordRow): string[] => row.tags || [];
const hasTags = (row: AiRecordRow): boolean => rowTags(row).length > 0;
const rowHref = (row: AiRecordRow): string => row.href || "#";
const rowAvatar = (row: AiRecordRow): string =>
  row.avatar ||
  String(row.cells[columns()[0]?.key || ""] || "")
    .slice(0, 1)
    .toUpperCase() ||
  "?";
const isSelected = (row: AiRecordRow): boolean => selected.value.has(rowKey(row, 0));
const allSelected = (): boolean =>
  hasRows() && rows().every((row) => selected.value.has(rowKey(row, 0)));
const sortDirection = (column: AiTableColumn): string =>
  sortBy.value === column.key ? sortOrder.value : "";
const sortLabel = (column: AiTableColumn): string =>
  sortDirection(column) === "asc" ? label("sortAscending") : label("sortDescending");
const hostLabel = (): string => props.ariaLabel || label("table");

const stringifySelection = (): (string | number)[] => [...selected.value];
const emitSelectionChange = (): void => {
  emit("selection-change", stringifySelection());
};

const toggleRow = (id: string | number): void => {
  const next = new Set(selected.value);
  if (next.has(id)) next.delete(id);
  else next.add(id);
  selected.set(next);
  emitSelectionChange();
};
const toggleAll = (): void => {
  const next = new Set(selected.value);
  if (allSelected()) {
    rows().forEach((row) => next.delete(rowKey(row, 0)));
  } else {
    rows().forEach((row) => next.add(rowKey(row, 0)));
  }
  selected.set(next);
  emitSelectionChange();
};
const clearSelection = (): void => {
  selected.set(new Set());
  emitSelectionChange();
};
const getSelectedIds = (): (string | number)[] => stringifySelection();

useEffect(() => {
  const valid = new Set(rows().map((row) => rowKey(row, 0)));
  const next = new Set([...selected.value].filter((id) => valid.has(id)));
  if (next.size !== selected.value.size) selected.set(next);
});

const onSort = (column: AiTableColumn): void => {
  if (!column.sortable) return;
  const nextOrder: "asc" | "desc" =
    sortBy.value === column.key && sortOrder.value === "asc" ? "desc" : "asc";
  sortBy.set(column.key);
  sortOrder.set(nextOrder);
  const detail: AiRecordsSortDetail = { key: column.key, order: nextOrder };
  emit("sort-change", detail);
};
const onSortClick = (event: Event): void => {
  const key = (event.currentTarget as HTMLElement).dataset.key || "";
  const column = columns().find((entry) => entry.key === key);
  if (column) onSort(column);
};
const onLinkClick = (event: Event): void => {
  event.stopPropagation();
};
const onRowClick = (event: Event): void => {
  const index = Number((event.currentTarget as HTMLElement).dataset.index);
  const row = rows()[index];
  if (row) emit("row-click", row);
};
const onSelectRow = (event: Event): void => {
  event.stopPropagation();
  const index = Number((event.currentTarget as HTMLElement).dataset.index);
  const row = rows()[index];
  if (row) toggleRow(rowKey(row, 0));
};
const onSelectAll = (): void => toggleAll();

useHostFlag("data-selectable", () => props.selectable);
useHostFlag("data-empty", () => !hasRows());
useHostAttr("aria-label", hostLabel);

defineExpose<AiRecordsTableExpose>({ getSelectedIds, clearSelection, toggleRow });

defineStyle(styles);

const AiRecordsTable = defineHtml(`
  <div class="records-table" role="group">
    <div class="toolbar"><slot name="toolbar"></slot></div>
    <div class="scroll">
      <table :aria-label=${props.ariaLabel || label("table")}>
        <thead>
          <tr>
            <th v-if=${props.selectable} class="checkbox-col" scope="col">
              <label class="checkbox">
                <input type="checkbox" :checked=${allSelected()} :aria-label=${label("selectAll")} @change=${onSelectAll}>
                <span aria-hidden="true"></span>
              </label>
            </th>
            <th
              v-for="column in columns()"
              :key="column.key"
              scope="col"
              :class="{ sortable: column.sortable }"
              :style="column.width ? { width: column.width } : {}"
              :data-key="column.key"
              @click=${onSortClick}
            >
              <span class="th-inner">{{ column.label }}</span>
              <span v-if="sortDirection(column)" class="sort-arrow" :class="'is-' + sortDirection(column)" :aria-label="sortLabel(column)" aria-hidden="true"></span>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(row, index) in rows()"
            :key="rowKey(row, index)"
            :class="{ selected: isSelected(row) }"
            :data-index="index"
            @click=${onRowClick}
          >
            <td v-if=${props.selectable} class="checkbox-col" :data-index="index" @click=${onSelectRow}>
              <label class="checkbox">
                <input type="checkbox" :checked="isSelected(row)" :aria-label=${label("selectRow")}>
                <span aria-hidden="true"></span>
              </label>
            </td>
            <td v-for="(column, columnIndex) in columns()" :key="column.key" :class="{ 'has-avatar': columnIndex === 0 }">
              <span v-if="columnIndex === 0" class="avatar" aria-hidden="true">{{ rowAvatar(row) }}</span>
              <a
                v-if="columnIndex === 0 && row.href"
                class="record-link"
                :href="rowHref(row)"
                target="_blank"
                rel="noopener noreferrer"
                @click=${onLinkClick}
              >{{ cellValue(row, column) }}</a>
              <span v-else>{{ cellValue(row, column) }}</span>
              <span v-if="columnIndex === 0 && hasTags(row)" class="tags">
                <span v-for="tag in rowTags(row)" :key="tag" class="tag">{{ tag }}</span>
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <footer v-if=${props.showFooter} class="foot">
      <slot name="footer"><span>${props.footerText}</span></slot>
    </footer>
  </div>
`);

export { AiRecordsTable };
