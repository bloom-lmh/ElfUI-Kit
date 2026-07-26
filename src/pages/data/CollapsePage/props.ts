import { defineHtml } from "@elfui/core";

import { createDocsTranslator } from "../../docsLocale";

const t = createDocsTranslator({
  collapseProps: { zh: "Collapse 属性", en: "Collapse props" },
  collapseEvents: { zh: "Collapse 事件", en: "Collapse events" },
  itemProps: { zh: "CollapseItem 属性", en: "CollapseItem props" },
  itemSlots: { zh: "CollapseItem 插槽", en: "CollapseItem slots" },
  itemExposes: { zh: "CollapseItem 方法", en: "CollapseItem exposes" },
  modelValue: {
    zh: "当前展开名称；手风琴模式为单个名称",
    en: "Open names; a single name in accordion mode"
  },
  accordion: { zh: "一次只展开一个面板", en: "Allows only one open panel" },
  items: { zh: "数据驱动的面板集合", en: "Data-driven panel collection" },
  fieldMap: {
    zh: "映射 name、title、content、disabled 字段",
    en: "Maps the name, title, content, and disabled fields"
  },
  update: { zh: "请求父级更新受控展开值", en: "Requests a controlled model update" },
  change: { zh: "展开集合发生真实变化后触发", en: "Emitted after the open set changes" },
  name: { zh: "面板唯一名称", en: "Unique panel name" },
  title: { zh: "标题；可由 title 插槽替换", en: "Title, replaceable by the title slot" },
  disabled: { zh: "禁止展开和键盘激活", en: "Prevents expansion and keyboard activation" },
  active: { zh: "由父 Collapse 控制的内部状态", en: "Internal state controlled by the parent Collapse" },
  defaultSlot: { zh: "面板正文，可包含嵌套 Collapse", en: "Panel body, including nested Collapse content" },
  titleSlot: { zh: "自定义标题内容", en: "Custom title content" },
  iconSlot: { zh: "自定义展开图标", en: "Custom expansion icon" },
  toggle: { zh: "请求切换当前面板", en: "Requests a toggle for the current panel" },
  focusHeader: { zh: "将焦点移动到标题按钮", en: "Moves focus to the header button" }
});

const propsRows = () => [
  { name: "model-value", type: "string | string[]", default: "''", desc: t("modelValue") },
  { name: "accordion", type: "boolean", default: "false", desc: t("accordion") },
  { name: "items", type: "CollapseItem[]", default: "[]", desc: t("items") },
  { name: "props", type: "CollapseFieldNames", default: "default fields", desc: t("fieldMap") }
];

const eventsRows = () => [
  { name: "update:modelValue", type: "(value) => void", desc: t("update") },
  { name: "change", type: "(value) => void", desc: t("change") }
];

const itemRows = () => [
  { name: "name", type: "string | number", default: "''", desc: t("name") },
  { name: "title", type: "string", default: "''", desc: t("title") },
  { name: "disabled", type: "boolean", default: "false", desc: t("disabled") },
  { name: "active", type: "boolean", default: "false", desc: t("active") }
];

const slotsRows = () => [
  { name: "default", desc: t("defaultSlot") },
  { name: "title", desc: t("titleSlot") },
  { name: "icon", desc: t("iconSlot") }
];

const exposesRows = () => [
  { name: "toggle", type: "() => void", desc: t("toggle") },
  { name: "focusHeader", type: "() => void", desc: t("focusHeader") }
];

const PageCollapseProps = defineHtml(`
  <h2>API</h2>
  <elf-props-table :title=${t("collapseProps")} :rows=${propsRows()} />
  <elf-props-table :title=${t("collapseEvents")} :rows=${eventsRows()} />
  <elf-props-table :title=${t("itemProps")} :rows=${itemRows()} />
  <elf-props-table :title=${t("itemSlots")} :rows=${slotsRows()} />
  <elf-props-table :title=${t("itemExposes")} :rows=${exposesRows()} />
`);

export { PageCollapseProps };
