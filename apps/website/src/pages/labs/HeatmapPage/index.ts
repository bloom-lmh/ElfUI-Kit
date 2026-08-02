import { defineHtml, defineStyle, useRef } from "@elfui/core";

import "@elfui/kit/labs";
import { createDocsTranslator } from "../../docsLocale";
import articleStyles from "../../shared/article.scss?inline";

const t = createDocsTranslator({
  kicker: { zh: "实验室组件", en: "Labs component" },
  title: { zh: "热力图", en: "Heatmap" },
  description: {
    zh: "用阈值色阶呈现二维表格数据；提供图例、键盘单元格导航和语义化点击事件。",
    en: "Render two-dimensional tabular data with threshold color scales, legends, keyboard cell navigation, and semantic click events.",
  },
  warning: {
    zh: "实验性 API：大数据虚拟化和屏幕阅读器摘要仍在验证中。",
    en: "Experimental API: large-data virtualization and screen-reader summaries are still being validated.",
  },
  demo: { zh: "团队活动", en: "Team activity" },
  selected: { zh: "当前单元格", en: "Active cell" },
  none: { zh: "尚未选择", en: "No cell selected" },
  api: { zh: "API", en: "API" },
  props: { zh: "属性", en: "Props" },
  events: { zh: "事件", en: "Events" },
  less: { zh: "较少", en: "Less" },
  more: { zh: "较多", en: "More" },
  legendFilter: { zh: "按颜色筛选热力图", en: "Filter heatmap by color" },
  items: {
    zh: "二维数据项，按 row / column 定位。",
    en: "Matrix items addressed by row and column.",
  },
  thresholds: { zh: "按 max 升序的颜色阈值。", en: "Color thresholds ordered by max." },
  cellSize: { zh: "单元格边长（px）。", en: "Cell edge size in px." },
  legend: { zh: "显示色阶图例。", en: "Shows the color-scale legend." },
  legendInteractive: {
    zh: "允许点击图例仅查看对应色阶，再次点击取消筛选。",
    en: "Lets users click a legend swatch to isolate its color range and click again to clear.",
  },
  click: {
    zh: "单元格点击时返回行、列和数据项。",
    en: "Returns the row, column, and item when a cell is clicked.",
  },
  legendChange: {
    zh: "图例筛选变化时返回阈值或 null。",
    en: "Returns the selected threshold or null when the legend filter changes.",
  },
});

defineStyle(
  articleStyles,
  `.labs-warning { margin-bottom: var(--elf-space-4); } .labs-heatmap { width: min(760px, 100%); }`,
);

const columns = () =>
  ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((label) => ({
    key: label.toLowerCase(),
    label,
  }));
const rows = () => [1, 2, 3, 4, 5].map((week) => ({ key: `w${week}`, label: `W${week}` }));
const values = [
  0, 2, 5, 9, 3, 0, 1, 4, 10, 18, 27, 8, 5, 1, 2, 6, 14, 34, 22, 12, 7, 0, 3, 8, 17, 11, 4, 0, 1, 5,
  12, 23, 16, 3, 0,
];
const items = () =>
  rows().flatMap((row, rowIndex) =>
    columns().map((column, columnIndex) => ({
      row: row.key,
      column: column.key,
      value: values[rowIndex * columns().length + columnIndex] ?? null,
    })),
  );
const thresholds = () => [
  { max: 0, color: "#edf1f7" },
  { max: 5, color: "#c6dbff" },
  { max: 12, color: "#8bb7ff" },
  { max: 20, color: "#4d83ec" },
  { max: 40, color: "#2251c6" },
];
const cellSize = useRef(32);
const selected = useRef("");
const grow = (): void => cellSize.set(cellSize.value === 32 ? 40 : 32);
const onCellClick = (
  event: CustomEvent<{
    row: { label: string };
    column: { label: string };
    item: { value: number | null };
  }>,
): void =>
  selected.set(
    `${event.detail.row.label} / ${event.detail.column.label}: ${event.detail.item.value ?? 0}`,
  );
const propRows = () => [
  { name: "items", type: "HeatmapItem[]", default: "[]", desc: t("items") },
  { name: "thresholds", type: "HeatmapThreshold[]", default: "[]", desc: t("thresholds") },
  { name: "cell-size", type: "number", default: "32", desc: t("cellSize") },
  { name: "legend", type: "boolean", default: "true", desc: t("legend") },
  { name: "legend-interactive", type: "boolean", default: "true", desc: t("legendInteractive") },
];
const eventRows = () => [
  { name: "cell-click", type: "CustomEvent<HeatmapCellDetail>", default: "—", desc: t("click") },
  {
    name: "legend-change",
    type: "CustomEvent<HeatmapThreshold | null>",
    default: "—",
    desc: t("legendChange"),
  },
];
const code = `<elf-heatmap
  :rows="rows"
  :columns="columns"
  :items="items"
  :thresholds="thresholds"
  legend
  @cell-click="onCellClick"
/>`;
const script = `import "@elfui/kit/labs";

const onCellClick = (event) => {
  const { row, column, item } = event.detail;
};`;

const PageLabsHeatmap = defineHtml(`
  <elf-container class="docs-article"><elf-docs-hero category="labs" tag="Heatmap" :title=${t("title")} :description=${t("description")}></elf-docs-hero>
    <p class="docs-callout is-warning labs-warning">${t("warning")}</p>
    <elf-playground :title=${t("demo")} :code=${code} :script=${script}><span slot="status">${t("selected")}: ${selected || t("none")}</span><div class="labs-heatmap"><div class="docs-link-list"><elf-button @click=${grow}>32 / 40 px</elf-button></div><elf-heatmap :rows=${rows()} :columns=${columns()} :items=${items()} :thresholds=${thresholds()} :cell-size=${cellSize} :less-text=${t("less")} :more-text=${t("more")} :legend-aria-label=${t("legendFilter")} @cell-click=${onCellClick}></elf-heatmap></div></elf-playground>
    <section class="docs-section"><h2>${t("api")}</h2><elf-props-table :title=${t("props")} :rows=${propRows()} /></section>
    <section class="docs-section"><elf-props-table :title=${t("events")} :rows=${eventRows()} /></section>
  </elf-container>
`);
export { PageLabsHeatmap };
