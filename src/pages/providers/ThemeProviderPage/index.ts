import { defineHtml, useComponents } from "@elfui/core";
import { createDocsPicker, createDocsTranslator } from "../../docsLocale";

import { PageThemeProviderEx1 } from "./ex1";
import { PageThemeProviderEx2 } from "./ex2";
import { PageThemeProviderEx3 } from "./ex3";
import { PageThemeProviderEx4 } from "./ex4";

const pick = createDocsPicker();
const t = createDocsTranslator({
  title: { zh: "主题与个性化", en: "Theme and customization" },
  description: {
    zh: "ThemeProvider 通过局部 CSS 变量覆盖子树设计 token，不会意外修改全站主题。",
    en: "ThemeProvider overrides design tokens for a subtree through local CSS variables without mutating the application theme.",
  },
});

const propsRows = [
  {
    name: "theme",
    type: "light | dark | system | custom | string",
    default: "light",
    desc: pick("内置主题、系统主题或命名主题", "Built-in, system, or named theme.")
  },
  {
    name: "primary / secondary / surface",
    type: "string",
    default: "",
    desc: pick("常用 token 快捷覆盖", "Shorthand overrides for common tokens.")
  },
  { name: "themes", type: "Record<string, ThemeDefinition>", default: "{}", desc: pick("命名主题定义", "Named theme definitions.") },
  { name: "tokens", type: "ThemeTokens", default: "{}", desc: pick("完整局部 CSS 变量覆盖", "Complete local token overrides.") },
  { name: "inherit", type: "boolean", default: "true", desc: pick("自定义主题是否继承外层 token 与暗色语义", "Whether custom themes inherit outer tokens and dark semantics.") }
];

const contextRows = [
  { name: "theme / isDark / tokens", type: "readonly", default: "-", desc: pick("当前合并后的主题上下文", "Current merged theme context.") },
  { name: "applyTo", type: "(target: HTMLElement) => void", default: "-", desc: pick("把主题转发给 document 级服务浮层", "Apply the theme to document-level service overlays.") }
];

useComponents({
  "page-theme-provider-ex1": PageThemeProviderEx1,
  "page-theme-provider-ex2": PageThemeProviderEx2,
  "page-theme-provider-ex3": PageThemeProviderEx3,
  "page-theme-provider-ex4": PageThemeProviderEx4
});

const PageThemeProvider = defineHtml(`
  <elf-container>
    <h1>${t("title")}</h1>
    <p>${t("description")}</p>

    <page-theme-provider-ex1 />

    <page-theme-provider-ex2 />

    <page-theme-provider-ex3 />

    <page-theme-provider-ex4 />

    <h2>API</h2>
    <elf-props-table title="ThemeProvider Props" :rows="propsRows"></elf-props-table>
    <elf-props-table title="Theme Context" :rows="contextRows"></elf-props-table>
  </elf-container>
`);

export { PageThemeProvider };
