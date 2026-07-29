import {
  defineEmits,
  defineExpose,
  defineHtml,
  defineProps,
  defineStyle,
  useComputed,
  useHost
} from "@elfui/core";

import styles from "./style.scss?inline";
import type {
  HeatmapAxisItem,
  HeatmapCellDetail,
  HeatmapElement,
  HeatmapEmits,
  HeatmapExpose,
  HeatmapItem,
  HeatmapProps,
  HeatmapThreshold
} from "./types";

export type {
  HeatmapAxisItem,
  HeatmapCellDetail,
  HeatmapElement,
  HeatmapEmits,
  HeatmapExpose,
  HeatmapItem,
  HeatmapProps,
  HeatmapThreshold
} from "./types";

const props = defineProps<HeatmapProps>({
  items: { type: Array, default: () => [] },
  rows: { type: Array, default: () => [] },
  columns: { type: Array, default: () => [] },
  thresholds: { type: Array, default: () => [] },
  min: { type: Number, default: undefined },
  max: { type: Number, default: undefined },
  cellSize: { type: Number, default: 32 },
  gap: { type: Number, default: 4 },
  rounded: { type: Number, default: 4 },
  showRowHeaders: { type: Boolean, default: true },
  showColumnHeaders: { type: Boolean, default: true },
  legend: { type: Boolean, default: true },
  hover: { type: Boolean, default: true },
  emptyColor: { type: String, default: "var(--elf-fill-color-light, #f2f6fc)" },
  ariaLabel: { type: String, default: "Heatmap" }
});

const emit = defineEmits<HeatmapEmits>();
const host = useHost();
const sortedThresholds = useComputed(() =>
  [...(props.thresholds as HeatmapThreshold[])].sort((a, b) => a.max - b.max)
);
const rows = (): HeatmapAxisItem[] => props.rows;
const columns = (): HeatmapAxisItem[] => props.columns;
const thresholds = (): HeatmapThreshold[] => sortedThresholds.value;
const showLegend = (): boolean => props.legend && thresholds().length > 0;
const itemMap = useComputed(() => {
  const map = new Map<string, HeatmapItem>();
  for (const item of props.items) map.set(`${item.row}\u0000${item.column}`, item);
  return map;
});

const findItem = (row: string, column: string): HeatmapItem =>
  itemMap.value.get(`${row}\u0000${column}`) ?? { row, column, value: null };

const valueColor = (value: number | null): string => {
  if (value === null || !Number.isFinite(value)) return props.emptyColor;
  const threshold = sortedThresholds.value.find((entry) => value <= entry.max);
  if (threshold) return threshold.color;
  const last = sortedThresholds.value.at(-1);
  return last?.color ?? "var(--elf-primary, #409eff)";
};

const detail = (rowKey: string, columnKey: string): HeatmapCellDetail => ({
  item: findItem(rowKey, columnKey),
  row: rows().find((entry) => entry.key === rowKey) ?? { key: rowKey, label: rowKey },
  column: columns().find((entry) => entry.key === columnKey) ?? { key: columnKey, label: columnKey }
});

const cellLabel = (rowKey: string, columnKey: string): string => {
  const cell = detail(rowKey, columnKey);
  return `${cell.row.label}, ${cell.column.label}: ${cell.item.label ?? cell.item.value ?? "empty"}`;
};

const cellClass = (rowKey: string, columnKey: string): Record<string, boolean> => ({
  cell: true,
  empty: findItem(rowKey, columnKey).value === null,
  hoverable: props.hover
});

const cellStyle = (rowKey: string, columnKey: string): Record<string, string> => ({
  background: valueColor(findItem(rowKey, columnKey).value),
  width: `${Math.max(20, props.cellSize)}px`,
  height: `${Math.max(20, props.cellSize)}px`,
  borderRadius: `${Math.max(0, props.rounded)}px`
});

const gridStyle = (): Record<string, string> => {
  const cellSize = `${Math.max(20, props.cellSize)}px`;
  const labelColumn = props.showRowHeaders ? "88px " : "";
  return {
    gridTemplateColumns: `${labelColumn}repeat(${Math.max(1, columns().length)}, ${cellSize})`,
    gap: `${Math.max(0, props.gap)}px`
  };
};

const getCell = (row: string, column: string): HTMLButtonElement | null =>
  [...(host.shadowRoot?.querySelectorAll<HTMLButtonElement>(".cell") ?? [])].find(
    (element) => element.dataset.row === row && element.dataset.column === column
  ) ?? null;

const focusCell = (row: string, column: string): void => getCell(row, column)?.focus();

const moveFocus = (event: KeyboardEvent): void => {
  const target = event.currentTarget as HTMLButtonElement;
  const rowIndex = rows().findIndex((row) => row.key === target.dataset.row);
  const columnIndex = columns().findIndex((column) => column.key === target.dataset.column);
  let nextRow = rowIndex;
  let nextColumn = columnIndex;
  if (event.key === "ArrowUp") nextRow -= 1;
  if (event.key === "ArrowDown") nextRow += 1;
  if (event.key === "ArrowLeft") nextColumn -= 1;
  if (event.key === "ArrowRight") nextColumn += 1;
  if (nextRow === rowIndex && nextColumn === columnIndex) return;
  event.preventDefault();
  const row = rows()[nextRow];
  const column = columns()[nextColumn];
  if (row && column) focusCell(row.key, column.key);
};

defineExpose<HeatmapExpose>({ focusCell, getCell });
defineStyle(styles);

const Heatmap = defineHtml<HeatmapProps>(`
  <section class="heatmap" role="region" :aria-label=${props.ariaLabel}>
    <div
      class="grid"
      :style=${gridStyle()}
      role="grid"
      :aria-rowcount=${rows().length + (props.showColumnHeaders ? 1 : 0)}
      :aria-colcount=${columns().length + (props.showRowHeaders ? 1 : 0)}
    >
      <span v-if=${props.showColumnHeaders && props.showRowHeaders} class="corner" aria-hidden="true"></span>
      <span v-for="column in columns()" class="axis" role="columnheader">{{ column.label }}</span>
      <template v-for="row in rows()">
        <span v-if=${props.showRowHeaders} class="axis row-label" role="rowheader">{{ row.label }}</span>
        <button
          v-for="column in columns()"
          :class="cellClass(row.key, column.key)"
          type="button"
          role="gridcell"
          :data-row="row.key"
          :data-column="column.key"
          :disabled="findItem(row.key, column.key).disabled"
          :style="cellStyle(row.key, column.key)"
          :aria-label="cellLabel(row.key, column.key)"
          @click=${(event: Event) => emit("cell-click", detail((event.currentTarget as HTMLElement).dataset.row ?? "", (event.currentTarget as HTMLElement).dataset.column ?? ""))}
          @focus=${(event: Event) => emit("cell-focus", detail((event.currentTarget as HTMLElement).dataset.row ?? "", (event.currentTarget as HTMLElement).dataset.column ?? ""))}
          @keydown=${moveFocus}
        >{{ findItem(row.key, column.key).value ?? "—" }}</button>
      </template>
    </div>
    <div v-if=${showLegend()} class="legend" aria-hidden="true">
      <span>Less</span>
      <span class="legend-scale">
        <span v-for="threshold in thresholds()" class="legend-cell" :style="{ background: threshold.color }"></span>
      </span>
      <span>More</span>
    </div>
  </section>
`);

export { Heatmap };
