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
    name: "data",
    type: "TableRow[]",
    default: "[]",
    desc: pick("虚拟正文数据与类型化列配置", "Virtual body data and typed column definitions"),
  },
  {
    name: "columns",
    type: "TableV2Column[]",
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
    name: "header-height",
    type: "number",
    default: "44",
    desc: pick("表头与页脚占用高度", "Reserved header and footer heights"),
  },
  {
    name: "footer-height",
    type: "number",
    default: "0",
    desc: pick("表头与页脚占用高度", "Reserved header and footer heights"),
  },
  {
    name: "height",
    type: "string | number",
    default: "400",
    desc: pick("表格总高度与窗口缓冲行数", "Total table height and virtual overscan"),
  },
  {
    name: "overscan",
    type: "number",
    default: "6",
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
    name: "loading",
    type: "boolean",
    default: "false",
    desc: pick("遮罩状态与空状态文案", "Overlay state and empty-state copy"),
  },
  {
    name: "empty-text",
    type: "string",
    default: "''",
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
    name: "column-sort",
    type: "events",
    desc: pick(
      "排序、虚拟窗口和触底通知",
      "Sorting, virtual-window, and end-reached notifications",
    ),
  },
  {
    name: "rows-rendered",
    type: "events",
    desc: pick(
      "排序、虚拟窗口和触底通知",
      "Sorting, virtual-window, and end-reached notifications",
    ),
  },
  {
    name: "end-reached",
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
  <elf-api-builder component="elf-table-v2" title="API">
  <elf-props-table role="props" :title=${t("props")} :rows.prop=${propsRows()}></elf-props-table>
  <elf-props-table role="events" :title=${t("events")} :rows.prop=${eventsRows()}></elf-props-table>
  <elf-props-table role="slots" :title=${t("slots")} :rows.prop=${slotsRows()}></elf-props-table>
  </elf-api-builder>
`);

export { PageVirtualTableProps };
