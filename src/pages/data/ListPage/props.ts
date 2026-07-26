import { defineHtml } from "@elfui/core";

import { createDocsTranslator } from "../../docsLocale";

const t = createDocsTranslator({
  api: { zh: "API", en: "API" },
  props: { zh: "List 属性", en: "List props" },
  itemProps: { zh: "ListItem 属性", en: "ListItem props" },
  events: { zh: "ListItem 事件", en: "ListItem events" },
  slots: { zh: "插槽", en: "Slots" },
  exposes: { zh: "公开方法", en: "Exposes" },
  items: { zh: "数据驱动的列表项。", en: "Data-driven list entries." },
  itemKey: { zh: "稳定键字段或取值函数。", en: "Stable key field or resolver." },
  renderItem: { zh: "将数据项渲染为文本或 Node。", en: "Render an entry as text or a Node." },
  bordered: { zh: "显示外边框。", en: "Show an outer border." },
  divided: { zh: "显示项目分隔线。", en: "Show item dividers." },
  emptyText: { zh: "无数据且没有默认插槽时的提示。", en: "Fallback shown without data or default content." },
  loading: { zh: "显示加载状态并隐藏陈旧内容。", en: "Show loading state and hide stale content." },
  loadingText: { zh: "加载状态提示。", en: "Loading-state message." },
  ariaLabel: { zh: "列表的无障碍名称。", en: "Accessible list name." },
  title: { zh: "主标题文本。", en: "Primary title text." },
  subtitle: { zh: "辅助说明文本。", en: "Secondary description." },
  value: { zh: "select 事件携带的值。", en: "Value carried by the select event." },
  active: { zh: "受控选中状态。", en: "Controlled selected state." },
  disabled: { zh: "禁用交互并退出键盘导航。", en: "Disable interaction and keyboard navigation." },
  clickable: { zh: "使用原生按钮交互表面。", en: "Use a native button interaction surface." },
  lines: { zh: "一、二或三行内容密度。", en: "One-, two-, or three-line content density." },
  click: { zh: "激活时派发兼容点击事件。", en: "Compatibility click event emitted on activation." },
  select: { zh: "选择时携带 value。", en: "Emitted with value on selection." },
  defaultSlot: { zh: "声明式 ListItem，或 ListItem 的正文。", en: "Declarative ListItems or ListItem body content." },
  emptySlot: { zh: "自定义空状态。", en: "Custom empty state." },
  loadingSlot: { zh: "自定义加载状态。", en: "Custom loading state." },
  leading: { zh: "列表项前置内容。", en: "Leading item content." },
  trailing: { zh: "列表项尾部内容或操作。", en: "Trailing item content or action." },
  focusFirst: { zh: "聚焦第一个可用的可点击项目。", en: "Focus the first enabled clickable item." },
  focusItem: { zh: "聚焦当前项目的按钮表面。", en: "Focus this item's button surface." }
});

const listProps = () => [
  { name: "items", type: "T[]", default: "[]", desc: t("items") },
  { name: "item-key", type: "string | ((item, index) => string | number)", default: "id", desc: t("itemKey") },
  { name: "render-item", type: "(item, index) => Node | primitive", default: "—", desc: t("renderItem") },
  { name: "bordered", type: "boolean", default: "false", desc: t("bordered") },
  { name: "divided", type: "boolean", default: "true", desc: t("divided") },
  { name: "empty-text", type: "string", default: "LocaleProvider", desc: t("emptyText") },
  { name: "loading", type: "boolean", default: "false", desc: t("loading") },
  { name: "loading-text", type: "string", default: "LocaleProvider", desc: t("loadingText") },
  { name: "aria-label", type: "string", default: "''", desc: t("ariaLabel") }
];
const itemProps = () => [
  { name: "title", type: "string", default: "''", desc: t("title") },
  { name: "subtitle", type: "string", default: "''", desc: t("subtitle") },
  { name: "value", type: "string | number", default: "''", desc: t("value") },
  { name: "active", type: "boolean", default: "false", desc: t("active") },
  { name: "disabled", type: "boolean", default: "false", desc: t("disabled") },
  { name: "clickable", type: "boolean", default: "false", desc: t("clickable") },
  { name: "lines", type: "'one' | 'two' | 'three'", default: "two", desc: t("lines") }
];
const eventRows = () => [
  { name: "click", type: "MouseEvent", desc: t("click") },
  { name: "select", type: "string | number", desc: t("select") }
];
const slotRows = () => [
  { name: "default", desc: t("defaultSlot") },
  { name: "empty", desc: t("emptySlot") },
  { name: "loading", desc: t("loadingSlot") },
  { name: "leading", desc: t("leading") },
  { name: "trailing", desc: t("trailing") }
];
const exposeRows = () => [
  { name: "List.focusFirst()", type: "() => void", desc: t("focusFirst") },
  { name: "ListItem.focusItem()", type: "() => void", desc: t("focusItem") }
];

const PageListProps = defineHtml(`
  <h2>${t("api")}</h2>
  <elf-props-table :title=${t("props")} :rows.prop=${listProps()} />
  <elf-props-table :title=${t("itemProps")} :rows.prop=${itemProps()} />
  <elf-props-table :title=${t("events")} :rows.prop=${eventRows()} />
  <elf-props-table :title=${t("slots")} :rows.prop=${slotRows()} />
  <elf-props-table :title=${t("exposes")} :rows.prop=${exposeRows()} />
`);

export { PageListProps };
