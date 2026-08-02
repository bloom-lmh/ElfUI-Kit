import { defineHtml, defineStyle, useComponents } from "@elfui/core";

import { createDocsTranslator } from "../../docsLocale";
import articleStyles from "../../shared/article.scss?inline";
import { PageIconEx1 } from "./ex1";
import { PageIconEx2 } from "./ex2";
import { PageIconEx3 } from "./ex3";

useComponents({
  "page-icon-ex1": PageIconEx1,
  "page-icon-ex2": PageIconEx2,
  "page-icon-ex3": PageIconEx3,
});

const t = createDocsTranslator({
  kicker: { zh: "基础组件", en: "Basic" },
  title: { zh: "Icon 图标", en: "Icon" },
  description: {
    zh: "零依赖图标容器，支持文本、按需 SVG、CSS class 图标集、局部 Provider、未知回退与无障碍语义。",
    en: "A zero-dependency icon container for text, on-demand SVG, CSS class sets, local providers, missing-icon fallback, and accessible semantics.",
  },
  iconProps: { zh: "图标属性", en: "Icon props" },
  providerProps: { zh: "图标 Provider 属性", en: "Icon provider props" },
  slots: { zh: "图标插槽", en: "Icon slots" },
  name: { zh: "图标名称、set:name 或 $alias", en: "Icon name, set:name, or $alias" },
  set: { zh: "显式选择已配置图标集", en: "Explicit configured icon set" },
  fallback: {
    zh: "已知图标集中找不到名称时的回退内容",
    en: "Fallback when a name is missing from a known set",
  },
  size: {
    zh: "数字按 px 处理，也支持任意 CSS 尺寸",
    en: "Numbers use px; any CSS size is also accepted",
  },
  color: {
    zh: "图标颜色，默认继承 currentColor",
    en: "Icon color; inherits currentColor by default",
  },
  aria: {
    zh: "图标自身承载语义时的无障碍名称",
    en: "Accessible name when the icon itself carries meaning",
  },
  loading: {
    zh: "启用旋转；遵循减少动态效果偏好",
    en: "Enables rotation and respects reduced-motion preferences",
  },
  options: {
    zh: "defaultSet、aliases 与 sets 的组合配置",
    en: "Combined defaultSet, aliases, and sets configuration",
  },
  defaultSet: { zh: "当前子树的默认图标集", en: "Default icon set for the current subtree" },
  aliases: { zh: "以 $name 使用的语义别名", en: "Semantic aliases consumed as $name" },
  sets: {
    zh: "通过 createSvgIconSet/createClassIconSet 创建的图标集",
    en: "Sets created with createSvgIconSet/createClassIconSet",
  },
  inherit: {
    zh: "继承父 Provider 或全局 configureIcons 配置",
    en: "Inherits the parent provider or global configureIcons configuration",
  },
  content: { zh: "自定义文本、SVG 或图标组件", en: "Custom text, SVG, or icon component" },
  fallbackSlot: { zh: "自定义未知图标回退", en: "Custom missing-icon fallback" },
});

defineStyle(
  articleStyles,
  `
  page-icon-ex1,
  page-icon-ex2,
  page-icon-ex3 { display: block; width: 100%; }
`,
);

const iconPropsRows = () => [
  { name: "name", type: "string", default: "''", desc: t("name") },
  { name: "set", type: "string", default: "''", desc: t("set") },
  { name: "fallback", type: "string", default: "'?'", desc: t("fallback") },
  { name: "size", type: "number | string", default: "1em", desc: t("size") },
  { name: "color", type: "string", default: "currentColor", desc: t("color") },
  { name: "aria-label", type: "string", default: "''", desc: t("aria") },
  { name: "loading", type: "boolean", default: "false", desc: t("loading") },
];

const providerPropsRows = () => [
  { name: "options", type: "IconOptions", default: "{}", desc: t("options") },
  { name: "default-set", type: "string", default: "''", desc: t("defaultSet") },
  { name: "aliases", type: "Record<string, string>", default: "{}", desc: t("aliases") },
  { name: "sets", type: "Record<string, IconSet>", default: "{}", desc: t("sets") },
  { name: "inherit", type: "boolean", default: "true", desc: t("inherit") },
];

const slotsRows = () => [
  { name: "default", desc: t("content") },
  { name: "fallback", desc: t("fallbackSlot") },
];

const PageIcon = defineHtml(`
  <elf-container class="docs-article">
    <elf-docs-hero category="basic" tag="Icon" :title=${t("title")} :description=${t("description")}></elf-docs-hero>
    <page-icon-ex1 />
    <page-icon-ex2 />
    <page-icon-ex3 />
    <h2>API</h2>
    <elf-props-table :title=${t("iconProps")} :rows=${iconPropsRows()} />
    <elf-props-table :title=${t("providerProps")} :rows=${providerPropsRows()} />
    <elf-props-table :title=${t("slots")} :rows=${slotsRows()} />
  </elf-container>
`);

export { PageIcon };
