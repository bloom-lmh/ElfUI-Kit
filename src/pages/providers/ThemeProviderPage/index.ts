import { defineHtml, useComponents } from "@elfui/core";

import { PageThemeProviderEx1 } from "./ex1";
import { PageThemeProviderEx2 } from "./ex2";
import { PageThemeProviderEx3 } from "./ex3";
import { PageThemeProviderEx4 } from "./ex4";

const propsRows = [
  {
    name: "theme",
    type: "light | dark | custom",
    default: "light",
    desc: "内置主题或自定义主题"
  },
  {
    name: "primary / secondary / surface",
    type: "string",
    default: "",
    desc: "常用 token 快捷覆盖"
  },
  { name: "tokens", type: "ThemeTokens", default: "{}", desc: "完整局部 CSS 变量覆盖" },
  { name: "inherit", type: "boolean", default: "true", desc: "custom 主题是否继承外层 token 与暗色语义" }
];

const contextRows = [
  { name: "theme / isDark / tokens", type: "readonly", default: "-", desc: "当前合并后的主题上下文" },
  { name: "applyTo", type: "(target: HTMLElement) => void", default: "-", desc: "把主题转发给 document 级服务浮层" }
];

useComponents({
  "page-theme-provider-ex1": PageThemeProviderEx1,
  "page-theme-provider-ex2": PageThemeProviderEx2,
  "page-theme-provider-ex3": PageThemeProviderEx3,
  "page-theme-provider-ex4": PageThemeProviderEx4
});

const PageThemeProvider = defineHtml(`
  <elf-container>
    <h1>Theme & customization 主题与个性化</h1>
    <p>ThemeProvider 通过局部 CSS variables 覆盖一段子树的设计 token，不会意外修改全站主题。</p>

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
