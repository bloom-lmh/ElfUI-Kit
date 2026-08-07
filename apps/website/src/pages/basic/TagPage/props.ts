import { defineHtml } from "@elfui/core";

import { createDocsTranslator } from "../../docsLocale";

const t = createDocsTranslator({
  props: { zh: "标签属性", en: "Tag props" },
  events: { zh: "标签事件", en: "Tag events" },
  slots: { zh: "标签插槽", en: "Tag slots" },
  type: {
    zh: "Element Plus 兼容语义色，优先于 color",
    en: "Element Plus-compatible semantic color; takes precedence over color",
  },
  color: { zh: "语义色名称或任意 CSS 颜色", en: "Semantic name or any CSS color" },
  effect: { zh: "兼容别名：dark/light/plain", en: "Compatibility aliases: dark/light/plain" },
  variant: { zh: "视觉强调层级", en: "Visual emphasis level" },
  size: { zh: "标签尺寸", en: "Tag size" },
  closable: { zh: "显示原生 button 关闭控件", en: "Shows a native button close control" },
  round: { zh: "使用胶囊圆角", en: "Uses a pill radius" },
  hit: { zh: "显示语义色边框", en: "Shows a semantic-color border" },
  checked: {
    zh: "启用可选择模式并控制选中状态",
    en: "Enables selectable mode and controls pressed state",
  },
  transitions: { zh: "关闭颜色过渡", en: "Disables color transitions" },
  disabled: { zh: "禁用选择与关闭操作", en: "Disables selection and close actions" },
  click: { zh: "可用标签被点击时触发", en: "Emitted when an enabled tag is clicked" },
  close: {
    zh: "关闭按钮激活时触发；组件不会自行删除",
    en: "Emitted when the close button activates; the component does not remove itself",
  },
  change: {
    zh: "可选择状态变化时触发，detail 为 boolean",
    en: "Emitted when selectable state changes; detail is boolean",
  },
  update: { zh: "checked 双向绑定事件", en: "Two-way binding event for checked" },
  content: {
    zh: "标签内容；超长内容在受限宽度内省略",
    en: "Tag content; long content truncates in constrained widths",
  },
});

const propsRows = () => [
  {
    name: "type",
    type: "primary | secondary | success | warning | danger | info",
    default: "''",
    desc: t("type"),
  },
  { name: "color", type: "string", default: "primary", desc: t("color") },
  { name: "effect", type: "dark | light | plain", default: "''", desc: t("effect") },
  { name: "variant", type: "filled | light | outlined", default: "light", desc: t("variant") },
  { name: "size", type: "sm | md | lg", default: "md", desc: t("size") },
  { name: "closable", type: "boolean", default: "false", desc: t("closable") },
  { name: "round", type: "boolean", default: "false", desc: t("round") },
  { name: "hit", type: "boolean", default: "false", desc: t("hit") },
  { name: "checked", type: "boolean", default: "undefined", desc: t("checked") },
  { name: "disable-transitions", type: "boolean", default: "false", desc: t("transitions") },
  { name: "disabled", type: "boolean", default: "false", desc: t("disabled") },
];

const eventsRows = () => [
  { name: "click", type: "MouseEvent", desc: t("click") },
  { name: "close", type: "Event", desc: t("close") },
  { name: "change", type: "boolean", desc: t("change") },
  { name: "update:checked", type: "boolean", desc: t("update") },
];

const slotsRows = () => [{ name: "default", desc: t("content") }];

const PageTagProps = defineHtml(`
  <elf-api-builder component="elf-tag" title="API">
  <elf-props-table role="props" :title=${t("props")} :rows=${propsRows()} />
  <elf-props-table role="events" :title=${t("events")} :rows=${eventsRows()} />
  <elf-props-table role="slots" :title=${t("slots")} :rows=${slotsRows()} />
  </elf-api-builder>
`);

export { PageTagProps };
