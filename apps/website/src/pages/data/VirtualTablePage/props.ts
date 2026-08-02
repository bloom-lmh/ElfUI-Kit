import { defineHtml } from "@elfui/core";

import { createDocsPicker, createDocsTranslator } from "../../docsLocale";

const pick = createDocsPicker();
const t = createDocsTranslator({
  api: { zh: "组件 API", en: "Component API" },
  props: { zh: "属性", en: "Props" },
  events: { zh: "事件", en: "Events" },
  slots: { zh: "插槽", en: "Slots" },
});

const propsRows = () => [
  {
    name: "data / columns",
    type: "TableRow[] / TableV2Column[]",
    default: "[]",
    desc: pick("虚拟正文数据与类型化列配置", "Virtual body data and typed column definitions"),
  },
  {
    name: "fixed-data",
    type: "TableRow[]",
    default: "[]",
    desc: pick(
      "固定在表头下方并与正文同步横向滚动的数据",
      "Rows pinned below the header with synchronized horizontal scrolling",
    ),
  },
  {
    name: "row-height",
    type: "number | (row, index) => number",
    default: "44",
    desc: pick("固定或逐行计算的虚拟行高", "Fixed or per-row virtual height"),
  },
  {
    name: "header-height / footer-height",
    type: "number",
    default: "44 / 0",
    desc: pick("表头与页脚占用高度", "Reserved header and footer heights"),
  },
  {
    name: "height / overscan",
    type: "string | number / number",
    default: "400 / 6",
    desc: pick("表格总高度与窗口缓冲行数", "Total table height and virtual overscan"),
  },
  {
    name: "expand-column-key",
    type: "string",
    default: "''",
    desc: pick(
      "在指定列渲染层级展开控件并启用虚拟树投影",
      "Render hierarchy controls in the named column and enable virtual tree projection",
    ),
  },
  {
    name: "expanded-row-keys",
    type: "string[]",
    default: "undefined",
    desc: pick("父级拥有的受控展开键", "Parent-owned controlled expansion keys"),
  },
  {
    name: "default-expanded-row-keys",
    type: "string[]",
    default: "[]",
    desc: pick("非受控初始展开键", "Initial uncontrolled expansion keys"),
  },
  {
    name: "indent-size",
    type: "number",
    default: "12",
    desc: pick("每个层级的缩进像素", "Indent in pixels per hierarchy level"),
  },
  {
    name: "loading / empty-text",
    type: "boolean / string",
    default: "false / ''",
    desc: pick("遮罩状态与空状态文案", "Overlay state and empty-state copy"),
  },
];

const eventsRows = () => [
  {
    name: "expanded-rows-change",
    type: "(keys: string[]) => void",
    desc: pick(
      "用户展开或收起后提交下一组键",
      "Proposes the next key set after user expansion or collapse",
    ),
  },
  {
    name: "row-expand",
    type: "(row: TableRow, expanded: boolean) => void",
    desc: pick("单行展开状态变化", "One row changed expansion state"),
  },
  {
    name: "column-sort / rows-rendered / end-reached",
    type: "events",
    desc: pick(
      "排序、虚拟窗口和触底通知",
      "Sorting, virtual-window, and end-reached notifications",
    ),
  },
];

const slotsRows = () => [
  {
    name: "empty",
    desc: pick(
      "无固定数据和正文数据时的空状态",
      "Empty state when pinned and body data are absent",
    ),
  },
  {
    name: "overlay",
    desc: pick("loading 时覆盖表格的状态内容", "Status content covering the table while loading"),
  },
  {
    name: "footer",
    desc: pick("由 footer-height 约束的固定页脚", "Pinned footer constrained by footer-height"),
  },
];

const PageVirtualTableProps = defineHtml(`
  <h2>${t("api")}</h2>
  <elf-props-table :title=${t("props")} :rows.prop=${propsRows()}></elf-props-table>
  <elf-props-table :title=${t("events")} :rows.prop=${eventsRows()}></elf-props-table>
  <elf-props-table :title=${t("slots")} :rows.prop=${slotsRows()}></elf-props-table>
`);

export { PageVirtualTableProps };
