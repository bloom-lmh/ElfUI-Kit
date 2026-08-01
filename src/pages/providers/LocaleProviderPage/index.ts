import { defineHtml, useComponents } from "@elfui/core";
import { createDocsPicker, createDocsTranslator } from "../../docsLocale";
import { PageLocaleProviderEx1 } from "./ex1";
import { PageLocaleProviderEx2 } from "./ex2";
import { PageLocaleProviderEx3 } from "./ex3";
import { PageLocaleProviderEx4 } from "./ex4";

const pick = createDocsPicker();
const t = createDocsTranslator({
  title: { zh: "国际化", en: "Internationalization" },
  description: {
    zh: "LocaleProvider 通过上下文为子树提供语言、文字方向、翻译和格式化能力，统一组件文案与 RTL 行为。",
    en: "LocaleProvider supplies locale, text direction, translation, and formatting through context, keeping component copy and RTL behavior consistent.",
  },
});

const propsRows = [
  {
    name: "name",
    type: "string",
    default: "zh-CN",
    desc: pick("语言名称，同时反射为 lang", "Locale name, also reflected to lang."),
  },
  { name: "dir", type: "ltr | rtl", default: "ltr", desc: pick("文本方向", "Text direction.") },
  {
    name: "rtl",
    type: "boolean",
    default: "false",
    desc: pick("快捷切换为 rtl", "Shortcut for RTL direction."),
  },
  {
    name: "messages",
    type: "object",
    default: "{}",
    desc: pick("与默认文案合并的本地化消息", "Localized messages merged with the defaults."),
  },
  {
    name: "time-zone",
    type: "string",
    default: "''",
    desc: pick("日期格式化默认时区", "Default time zone for date formatting."),
  },
  {
    name: "adapter",
    type: "LocaleAdapter",
    default: "—",
    desc: pick(
      "接入外部翻译与数字、日期格式化策略",
      "Connect external translation, number, and date formatting strategies.",
    ),
  },
];

const contextRows = [
  {
    name: "t",
    type: "(path, params?) => string",
    default: "-",
    desc: pick("翻译并插入命名参数", "Translate a path and interpolate named parameters."),
  },
  {
    name: "formatNumber",
    type: "(value, options?) => string",
    default: "-",
    desc: pick("按当前语言格式化数字", "Format numbers with the active locale."),
  },
  {
    name: "formatDate",
    type: "(value, options?) => string",
    default: "-",
    desc: pick("按当前语言与时区格式化日期", "Format dates with the active locale and time zone."),
  },
];

useComponents({
  "page-locale-provider-ex1": PageLocaleProviderEx1,
  "page-locale-provider-ex2": PageLocaleProviderEx2,
  "page-locale-provider-ex3": PageLocaleProviderEx3,
  "page-locale-provider-ex4": PageLocaleProviderEx4,
});

const PageLocaleProvider = defineHtml(`
  <elf-container>
    <elf-docs-hero category="providers" :title=${t("title")} :description=${t("description")}></elf-docs-hero>

    <page-locale-provider-ex1 />
    <page-locale-provider-ex2 />
    <page-locale-provider-ex3 />
    <page-locale-provider-ex4 />
    <h2>API</h2>
    <elf-props-table title="LocaleProvider Props" :rows="propsRows"></elf-props-table>
    <elf-props-table title="Locale Context" :rows="contextRows"></elf-props-table>
  </elf-container>
`);

export { PageLocaleProvider };
