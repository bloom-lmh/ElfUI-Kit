import { defineHtml, useComponents } from "@elfui/core";
import { PageLocaleProviderEx1 } from "./ex1";
import { PageLocaleProviderEx2 } from "./ex2";
import { PageLocaleProviderEx3 } from "./ex3";

const propsRows = [
  { name: "name", type: "string", default: "zh-CN", desc: "语言名称，同时反射为 lang" },
  { name: "dir", type: "ltr | rtl", default: "ltr", desc: "文本方向" },
  { name: "rtl", type: "boolean", default: "false", desc: "快捷切换为 rtl" },
  { name: "messages", type: "object", default: "{}", desc: "本地化文案，会与默认文案合并" },
  { name: "time-zone", type: "string", default: "''", desc: "日期格式化默认时区" }
];

const contextRows = [
  { name: "t", type: "(path, params?) => string", default: "-", desc: "翻译并插入命名参数" },
  { name: "formatNumber", type: "(value, options?) => string", default: "-", desc: "按当前 locale 格式化数字" },
  { name: "formatDate", type: "(value, options?) => string", default: "-", desc: "按当前 locale 与时区格式化日期" }
];

useComponents({
  "page-locale-provider-ex1": PageLocaleProviderEx1,
  "page-locale-provider-ex2": PageLocaleProviderEx2,
  "page-locale-provider-ex3": PageLocaleProviderEx3
});

const PageLocaleProvider = defineHtml(`
  <elf-container>
    <h1>Internationalization 国际化</h1>
    <p>LocaleProvider 通过 provide/inject 为子树提供语言名称、方向和翻译函数，统一组件文案与 RTL 行为。</p>

    <page-locale-provider-ex1 />
    <page-locale-provider-ex2 />
    <page-locale-provider-ex3 />
    <h2>API</h2>
    <elf-props-table title="LocaleProvider Props" :rows="propsRows"></elf-props-table>
    <elf-props-table title="Locale Context" :rows="contextRows"></elf-props-table>
  </elf-container>
`);

export { PageLocaleProvider };
