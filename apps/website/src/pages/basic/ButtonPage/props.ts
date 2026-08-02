import { defineHtml } from "@elfui/core";

import { createDocsTranslator } from "../../docsLocale";

const t = createDocsTranslator({
  props: { zh: "按钮属性", en: "Button props" },
  events: { zh: "按钮事件", en: "Button events" },
  slots: { zh: "按钮插槽", en: "Button slots" },
  type: { zh: "语义色别名或原生按钮类型", en: "Semantic color alias or native button type" },
  nativeType: { zh: "内部原生按钮类型", en: "Native type of the internal button" },
  variant: { zh: "视觉强调层级", en: "Visual emphasis level" },
  color: { zh: "操作语义色", en: "Semantic action color" },
  size: { zh: "按钮尺寸，兼容 Element Plus 别名", en: "Button size with Element Plus aliases" },
  shape: { zh: "按钮形状", en: "Button shape" },
  styleAlias: { zh: "兼容外观快捷属性", en: "Compatible appearance shorthand" },
  icon: {
    zh: "前置图标文本；复杂图标请使用插槽",
    en: "Prefix icon text; use the slot for complex icons",
  },
  loadingIcon: { zh: "替换默认加载指示器", en: "Replaces the default loading indicator" },
  ariaLabel: { zh: "纯图标按钮的无障碍名称", en: "Accessible name for an icon-only button" },
  disabled: { zh: "禁用交互", en: "Disables interaction" },
  loading: {
    zh: "展示加载状态并阻止重复触发",
    en: "Shows loading and prevents duplicate activation",
  },
  block: { zh: "占满父容器可用宽度", en: "Fills the available parent width" },
  autofocus: { zh: "初次挂载时请求焦点", en: "Requests focus on initial mount" },
  form: { zh: "显式关联外层表单 ID", en: "Explicit outer form ID" },
  noHover: { zh: "关闭悬停视觉反馈", en: "Disables hover visual feedback" },
  direction: { zh: "图标与文字排列方向", en: "Icon and label direction" },
  click: { zh: "可用状态下的原生组合点击事件", en: "Native composed click event while enabled" },
  content: { zh: "按钮文本内容", en: "Button label content" },
  iconSlot: { zh: "前置图标", en: "Prefix icon" },
  suffix: { zh: "后置图标", en: "Suffix icon" },
  loadingSlot: { zh: "自定义加载指示器", en: "Custom loading indicator" },
});

const propsRows = () => [
  { name: "type", type: "ButtonColor | button | submit | reset", default: "''", desc: t("type") },
  {
    name: "native-type",
    type: "button | submit | reset",
    default: "button",
    desc: t("nativeType"),
  },
  {
    name: "variant",
    type: "contained | outlined | text",
    default: "contained",
    desc: t("variant"),
  },
  {
    name: "color",
    type: "primary | secondary | success | warning | danger | info",
    default: "primary",
    desc: t("color"),
  },
  { name: "size", type: "sm | md | lg | small | default | large", default: "md", desc: t("size") },
  {
    name: "shape",
    type: "default | round | circle | square",
    default: "default",
    desc: t("shape"),
  },
  {
    name: "text / bg / link / round / circle / plain / dashed",
    type: "boolean",
    default: "false",
    desc: t("styleAlias"),
  },
  { name: "icon", type: "string", default: "''", desc: t("icon") },
  { name: "loading-icon", type: "string", default: "''", desc: t("loadingIcon") },
  { name: "aria-label", type: "string", default: "''", desc: t("ariaLabel") },
  { name: "disabled", type: "boolean", default: "false", desc: t("disabled") },
  { name: "loading", type: "boolean", default: "false", desc: t("loading") },
  { name: "block", type: "boolean", default: "false", desc: t("block") },
  { name: "autofocus", type: "boolean", default: "false", desc: t("autofocus") },
  { name: "form", type: "string", default: "''", desc: t("form") },
  { name: "no-hover", type: "boolean", default: "false", desc: t("noHover") },
  { name: "direction", type: "horizontal | vertical", default: "horizontal", desc: t("direction") },
];

const eventsRows = () => [{ name: "click", type: "(event: MouseEvent) => void", desc: t("click") }];

const slotsRows = () => [
  { name: "default", desc: t("content") },
  { name: "icon", desc: t("iconSlot") },
  { name: "suffix-icon", desc: t("suffix") },
  { name: "loading", desc: t("loadingSlot") },
];

const PageButtonProps = defineHtml(`
  <h2>API</h2>
  <elf-props-table :title=${t("props")} :rows=${propsRows()} />
  <elf-props-table :title=${t("events")} :rows=${eventsRows()} />
  <elf-props-table :title=${t("slots")} :rows=${slotsRows()} />
`);

export { PageButtonProps };
