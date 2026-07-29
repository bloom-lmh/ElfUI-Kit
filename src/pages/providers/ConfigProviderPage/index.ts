import { defineHtml, defineStyle, useComponents } from "@elfui/core";
import { createDocsPicker, createDocsTranslator } from "../../docsLocale";

import { PageConfigProviderEx1 } from "./ex1";
import { PageConfigProviderEx2 } from "./ex2";
import { PageConfigProviderEx3 } from "./ex3";
import { PageConfigProviderEx4 } from "./ex4";
import { PageConfigProviderEx5 } from "./ex5";
import { PageConfigProviderEx6 } from "./ex6";
import pageStyles from "./style.scss?inline";

const pick = createDocsPicker();
const t = createDocsTranslator({
  title: { zh: "全局配置", en: "Global configuration" },
  description: {
    zh: "ConfigProvider 是应用级统一入口，用于下发默认属性、服务行为、主题 token、语言、日期适配器、图标、响应式断点和动效偏好；细粒度 Provider 作为进阶能力保留。",
    en: "ConfigProvider is the application-level entry point for component defaults, service behavior, theme tokens, locale and i18n adapters, date adapters, icons, responsive breakpoints, and motion preferences. Focused providers remain available for advanced composition.",
  },
});

const propsRows = [
  { name: "config", type: "ElfUIConfig", default: "{}", desc: pick("统一配置 defaults、services、theme、locale、date、icons、display、motion 和 goTo", "Configure defaults, services, theme, locale and i18n adapters, date adapters, icons, display, motion, and goTo together.") },
  { name: "blueprint", type: "ElfUIConfig", default: "{}", desc: pick("作为基础预设，在 config 之前合并", "Base preset merged before config.") },
  { name: "inherit", type: "boolean", default: "true", desc: pick("是否继承外层 ConfigProvider", "Inherit the outer ConfigProvider.") },
  { name: "theme", type: "string", default: "—", desc: pick("config.theme.theme 的快捷写法", "Shortcut for config.theme.theme.") },
  { name: "locale", type: "string", default: "—", desc: pick("config.locale.name 的快捷写法", "Shortcut for config.locale.name.") },
  { name: "motion", type: "system | full | reduced", default: "system", desc: pick("统一动效偏好", "Shared motion preference.") },
];

const configRows = [
  { name: "defaults / defaultsOptions", type: "ProviderDefaults", default: "{}", desc: pick("按组件下发默认属性及合并策略", "Component defaults and merge strategy.") },
  { name: "theme", type: "ElfUIThemeOptions", default: "{}", desc: pick("主题、命名皮肤与设计 token", "Theme, named skins, and design tokens.") },
  { name: "locale", type: "ElfUILocaleOptions", default: "{}", desc: pick("语言、RTL、外部 i18n Adapter 与格式化", "Locale, RTL, external i18n adapter, and formatting.") },
  { name: "icons", type: "ElfUIIconOptions", default: "{}", desc: pick("默认图标集、别名和自定义图标集", "Default icon set, aliases, and custom icon sets.") },
  { name: "display", type: "DisplayProviderOptions", default: "{}", desc: pick("响应式断点、移动端阈值与 SSR 初始尺寸", "Breakpoints, mobile threshold, and SSR initial size.") },
  { name: "motion", type: "system | full | reduced", default: "system", desc: pick("应用级动效偏好", "Application-level motion preference.") },
  { name: "goTo", type: "GoToDefaults", default: "{}", desc: pick("程序化滚动的时长、偏移与缓动", "Duration, offset, and easing for programmatic scrolling.") },
  { name: "field", type: "FieldValueDefaults", default: "{}", desc: pick("跨字段共享 emptyValues 与 valueOnClear 语义", "Shared emptyValues and valueOnClear semantics across fields.") },
  { name: "date", type: "DateOptions", default: "{}", desc: pick("日期 Adapter、语言、时区与周起始日", "Date adapter, locale, time zone, and first day of week.") },
  { name: "services", type: "ElfUIServiceDefaults", default: "{}", desc: pick("Message、Notification、Loading 与 MessageBox 默认行为", "Default behavior for Message, Notification, Loading, and MessageBox.") },
];

useComponents({
  "page-config-provider-ex1": PageConfigProviderEx1,
  "page-config-provider-ex2": PageConfigProviderEx2,
  "page-config-provider-ex3": PageConfigProviderEx3,
  "page-config-provider-ex4": PageConfigProviderEx4,
  "page-config-provider-ex5": PageConfigProviderEx5,
  "page-config-provider-ex6": PageConfigProviderEx6,
});

defineStyle(pageStyles);

const PageConfigProvider = defineHtml(`
  <elf-container>
    <h1>${t("title")}</h1>
    <p>${t("description")}</p>

    <page-config-provider-ex1 />
    <page-config-provider-ex2 />
    <page-config-provider-ex3 />
    <page-config-provider-ex4 />
    <page-config-provider-ex5 />
    <page-config-provider-ex6 />

    <h2>API</h2>
    <elf-props-table title="ConfigProvider Props" :rows="propsRows"></elf-props-table>
    <elf-props-table title="ElfUIConfig" :rows="configRows"></elf-props-table>
  </elf-container>
`);

export { PageConfigProvider };
