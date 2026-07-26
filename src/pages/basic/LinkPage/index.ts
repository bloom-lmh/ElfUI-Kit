import { defineHtml, useComponents } from "@elfui/core";

import { createDocsTranslator } from "../../docsLocale";
import { PageLinkEx1 } from "./ex1";
import { PageLinkEx2 } from "./ex2";
import { PageLinkEx3 } from "./ex3";

useComponents({
  "page-link-ex1": PageLinkEx1,
  "page-link-ex2": PageLinkEx2,
  "page-link-ex3": PageLinkEx3
});

const t = createDocsTranslator({
  title: { zh: "Link 链接", en: "Link" },
  description: {
    zh: "用于正文导航与轻量操作，支持语义外观、原生 href、ElfUI Router、外链安全和完整禁用语义。",
    en: "Inline navigation and lightweight actions with semantic appearance, native hrefs, ElfUI Router, external-link safety, and complete disabled semantics."
  },
  props: { zh: "链接属性", en: "Link props" },
  events: { zh: "链接事件", en: "Link events" },
  slots: { zh: "链接插槽", en: "Link slots" },
  type: { zh: "语义颜色", en: "Semantic color" },
  underline: { zh: "默认、悬停与焦点时是否允许下划线", en: "Whether underline is allowed at rest, hover, and focus" },
  disabled: { zh: "禁用导航并退出 Tab 顺序", en: "Disables navigation and removes the link from the Tab order" },
  href: { zh: "原生链接地址；to 存在时作为次要回退", en: "Native URL; secondary fallback when to is present" },
  to: { zh: "ElfUI Router 目标，优先于 href", en: "ElfUI Router destination; takes precedence over href" },
  replace: { zh: "使用 router.replace 而非 router.push", en: "Uses router.replace instead of router.push" },
  target: { zh: "原生浏览上下文；_blank 自动补安全 rel", en: "Native browsing context; _blank adds a safe rel" },
  rel: { zh: "链接关系 token；显式值会与安全默认值合并", en: "Relationship tokens merged with safe defaults" },
  activeClass: { zh: "路由前缀匹配时的内部链接 class", en: "Internal anchor class for an active route" },
  exactActiveClass: { zh: "路由精确匹配时的内部链接 class", en: "Internal anchor class for an exact route" },
  icon: { zh: "简短文本图标；icon 插槽优先", en: "Short text icon; the icon slot takes precedence" },
  navigate: { zh: "客户端路由导航开始时触发，detail 为 to", en: "Emitted when client-side router navigation starts; detail is to" },
  content: { zh: "链接内容", en: "Link content" },
  iconSlot: { zh: "自定义图标，优先于 icon 属性", en: "Custom icon; takes precedence over the icon property" }
});

const propsRows = () => [
  { name: "type", type: "default | primary | success | warning | danger | info", default: "default", desc: t("type") },
  { name: "underline", type: "boolean", default: "true", desc: t("underline") },
  { name: "disabled", type: "boolean", default: "false", desc: t("disabled") },
  { name: "href", type: "string", default: "''", desc: t("href") },
  { name: "to", type: "RouteLocationRaw | string", default: "''", desc: t("to") },
  { name: "replace", type: "boolean", default: "false", desc: t("replace") },
  { name: "target", type: "string", default: "''", desc: t("target") },
  { name: "rel", type: "string", default: "''", desc: t("rel") },
  { name: "active-class", type: "string", default: "router default", desc: t("activeClass") },
  { name: "exact-active-class", type: "string", default: "router default", desc: t("exactActiveClass") },
  { name: "icon", type: "string", default: "''", desc: t("icon") }
];

const eventsRows = () => [
  { name: "navigate", desc: t("navigate") }
];

const slotsRows = () => [
  { name: "default", desc: t("content") },
  { name: "icon", desc: t("iconSlot") }
];

const PageLink = defineHtml(`
  <elf-container>
    <h1>${t("title")}</h1>
    <p>${t("description")}</p>
    <page-link-ex1 />
    <page-link-ex2 />
    <page-link-ex3 />
    <h2>API</h2>
    <elf-props-table :title=${t("props")} :rows=${propsRows()} />
    <elf-props-table :title=${t("events")} :rows=${eventsRows()} />
    <elf-props-table :title=${t("slots")} :rows=${slotsRows()} />
  </elf-container>
`);

export { PageLink };
