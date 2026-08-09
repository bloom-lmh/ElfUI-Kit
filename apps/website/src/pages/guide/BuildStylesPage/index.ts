import { defineHtml, defineStyle, useComponents } from "@elfui/core";

import { createDocsPicker, createDocsTranslator } from "../../docsLocale";
import { PageBuildStylesEx1 } from "./ex1";
import { PageBuildStylesEx2 } from "./ex2";
import pageStyles from "./style.scss?inline";

const t = createDocsTranslator({
  title: { zh: "构建与样式", en: "Build and styles" },
  description: {
    zh: "本页只说明构建入口、全局样式边界和层级策略。主题 token 归入主题与定制，具体工具类归入工具类页面，避免同一能力在多个章节重复维护。",
    en: "This page documents the single package entry, Shadow DOM style boundary, tree-shaking contract, and framework-native customization APIs.",
  },
  contractHeading: { zh: "公开契约", en: "Public contract" },
  contract: { zh: "构建契约", en: "Build contract" },
});
const pick = createDocsPicker();

const buildRows = [
  {
    name: "@elfui/kit",
    type: "JavaScript + types",
    default: "required",
    desc: pick(
      "组件、Provider 和公开类型的稳定入口",
      "Stable entry for components, Providers, and public types.",
    ),
  },
  {
    name: "Component styles",
    type: "Shadow DOM / defineStyle()",
    default: "embedded",
    desc: pick(
      "结构样式随组件定义进入 Shadow DOM，不要求额外 CSS 入口",
      "Structural styles travel with the component definition; no extra CSS entry is required.",
    ),
  },
  {
    name: "CSS reset",
    type: "application concern",
    default: "not bundled",
    desc: pick(
      "由应用控制，避免全局重置意外影响宿主页面",
      "Owned by the application to avoid an unexpected global reset affecting the host page.",
    ),
  },
  {
    name: "Theme tokens",
    type: "ConfigProvider / ThemeProvider",
    default: "inherited",
    desc: pick(
      "颜色、圆角、阴影和动效在主题章节统一配置",
      "Configure color, radius, elevation, and motion centrally in the theme guide.",
    ),
  },
];

useComponents({
  "page-build-styles-ex1": PageBuildStylesEx1,
  "page-build-styles-ex2": PageBuildStylesEx2,
});

defineStyle(pageStyles);

const PageBuildStyles = defineHtml(`
  <elf-container class="build-styles-page">
    <elf-docs-hero
      category="guide"
      tag="Guide"
      :title=${t("title")}
      :description=${t("description")}
    ></elf-docs-hero>

    <page-build-styles-ex1 />
    <page-build-styles-ex2 />

    <h2>${t("contractHeading")}</h2>
    <elf-props-table :title=${t("contract")} :rows=${buildRows} />
  </elf-container>
`);

export { PageBuildStyles };
