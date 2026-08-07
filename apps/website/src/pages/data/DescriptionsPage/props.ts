import { defineHtml } from "@elfui/core";

import { createDocsTranslator } from "../../docsLocale";

const t = createDocsTranslator({
  props: { zh: "Descriptions 属性", en: "Descriptions props" },
  slots: { zh: "Descriptions 插槽", en: "Descriptions slots" },
  itemProps: { zh: "DescriptionsItem 属性", en: "DescriptionsItem props" },
  itemSlots: { zh: "DescriptionsItem 插槽", en: "DescriptionsItem slots" },
  title: {
    zh: "标题快捷文本，title 插槽优先",
    en: "Title shortcut; the title slot takes precedence",
  },
  extra: {
    zh: "头部尾端快捷文本，extra 插槽优先",
    en: "Trailing header shortcut; the extra slot takes precedence",
  },
  items: { zh: "数据驱动的描述项集合", en: "Data-driven description items" },
  column: { zh: "最大列数，范围 1–8", en: "Maximum column count from 1 to 8" },
  responsive: {
    zh: "根据组件自身宽度在最大列数、2 列和 1 列之间响应",
    en: "Responds to the component width across the maximum, two, and one column",
  },
  border: { zh: "显示单元格边界", en: "Displays cell boundaries" },
  direction: { zh: "标签和值的排列方向", en: "Label and value arrangement" },
  size: { zh: "单元格内容密度", en: "Cell content density" },
  emptyText: {
    zh: "空集合以及 null、undefined、空字符串的占位文本",
    en: "Placeholder for empty collections and nullish or empty-string values",
  },
  fieldProps: {
    zh: "映射 key、label、value、span 字段",
    en: "Maps key, label, value, and span fields",
  },
  defaultSlot: { zh: "声明式 DescriptionsItem 子项", en: "Declarative DescriptionsItem children" },
  titleSlot: {
    zh: "自定义标题，可独立于 title prop 使用",
    en: "Custom title, usable without the title prop",
  },
  extraSlot: {
    zh: "自定义头部操作，可独立于 extra prop 使用",
    en: "Custom header action, usable without the extra prop",
  },
  emptySlot: {
    zh: "没有数据项或声明式子项时的空状态",
    en: "Empty state when no data or declarative items exist",
  },
  label: {
    zh: "标签快捷文本，label 插槽优先",
    en: "Label shortcut; the label slot takes precedence",
  },
  span: {
    zh: "横向跨列数，会按当前响应式列数收敛",
    en: "Column span, clamped to the responsive column count",
  },
  rowspan: { zh: "纵向跨行数", en: "Row span" },
  align: { zh: "内容对齐方式", en: "Content alignment" },
  labelAlign: { zh: "标签对齐方式", en: "Label alignment" },
  labelWidth: { zh: "水平模式标签轨道宽度", en: "Label track width in horizontal mode" },
  className: { zh: "内容容器自定义 class", en: "Custom class for the item container" },
  labelClassName: { zh: "标签自定义 class", en: "Custom class for the label" },
  itemEmptyText: {
    zh: "未提供默认插槽时的占位文本",
    en: "Fallback when the default slot is not provided",
  },
  contentSlot: {
    zh: "支持文本、链接、Tag 等丰富值内容",
    en: "Rich value content such as text, links, or tags",
  },
  labelSlot: { zh: "自定义标签内容", en: "Custom label content" },
});

const propsRows = () => [
  { name: "title", type: "string", default: "''", desc: t("title") },
  { name: "extra", type: "string", default: "''", desc: t("extra") },
  { name: "items", type: "DescriptionSourceItem[]", default: "[]", desc: t("items") },
  { name: "column", type: "number", default: "3", desc: t("column") },
  { name: "responsive", type: "boolean", default: "true", desc: t("responsive") },
  { name: "border", type: "boolean", default: "false", desc: t("border") },
  {
    name: "direction",
    type: "horizontal | vertical",
    default: "horizontal",
    desc: t("direction"),
  },
  { name: "size", type: "sm | md | lg", default: "''", desc: t("size") },
  { name: "empty-text", type: "string", default: "—", desc: t("emptyText") },
  {
    name: "props",
    type: "DescriptionsFieldNames",
    default: "default fields",
    desc: t("fieldProps"),
  },
];

const slotsRows = () => [
  { name: "default", desc: t("defaultSlot") },
  { name: "title", desc: t("titleSlot") },
  { name: "extra", desc: t("extraSlot") },
  { name: "empty", desc: t("emptySlot") },
];

const itemPropsRows = () => [
  { name: "label", type: "string", default: "''", desc: t("label") },
  { name: "span", type: "number", default: "1", desc: t("span") },
  { name: "rowspan", type: "number", default: "1", desc: t("rowspan") },
  { name: "align", type: "left | center | right", default: "''", desc: t("align") },
  {
    name: "label-align",
    type: "left | center | right",
    default: "''",
    desc: t("labelAlign"),
  },
  { name: "label-width", type: "string | number", default: "''", desc: t("labelWidth") },
  { name: "class-name", type: "string", default: "''", desc: t("className") },
  {
    name: "label-class-name",
    type: "string",
    default: "''",
    desc: t("labelClassName"),
  },
  { name: "empty-text", type: "string", default: "—", desc: t("itemEmptyText") },
];

const itemSlotsRows = () => [
  { name: "default", desc: t("contentSlot") },
  { name: "label", desc: t("labelSlot") },
];

const PageDescriptionsProps = defineHtml(`
  <elf-api-builder component="elf-descriptions" title="API">
  <elf-props-table role="props" :title=${t("props")} :rows=${propsRows()} />
  <elf-props-table role="slots" :title=${t("slots")} :rows=${slotsRows()} />
  <elf-props-table role="props" component="elf-descriptions-item" :title=${t("itemProps")} :rows=${itemPropsRows()} />
  <elf-props-table role="slots" component="elf-descriptions-item" :title=${t("itemSlots")} :rows=${itemSlotsRows()} />
  </elf-api-builder>
`);

export { PageDescriptionsProps };
