import { defineHtml, useComponents } from "@elfui/core";
import { createDocsPicker, createDocsTranslator } from "../../docsLocale";

import { PagePageHeaderEx1 } from "./ex1";
import { PagePageHeaderEx2 } from "./ex2";

const t = createDocsTranslator({
  title: { zh: "页头", en: "Page header" },
  description: {
    zh: "用于详情页顶部返回区域，支持返回事件以及 breadcrumb、icon、title、content、extra 插槽。",
    en: "Build a return region for detail pages with a back event and breadcrumb, icon, title, content, and extra slots.",
  },
});
const pick = createDocsPicker();

const propsRows = [
  { name: "title", type: "string", default: "Back", desc: pick("返回区域文本", "Return-region text.") },
  { name: "content", type: "string", default: "''", desc: pick("标题内容", "Heading content.") },
  { name: "icon", type: "string", default: "‹", desc: pick("默认返回图标文本", "Default return-icon text.") }
];

const eventsRows = [{ name: "back", type: "() => void", desc: pick("点击返回按钮时触发", "Emitted after clicking the return button.") }];

const slotsRows = [
  { name: "breadcrumb", desc: pick("面包屑区域", "Breadcrumb region.") },
  { name: "icon", desc: pick("返回图标", "Return icon.") },
  { name: "title", desc: pick("返回文本", "Return text.") },
  { name: "content", desc: pick("标题内容", "Heading content.") },
  { name: "extra", desc: pick("右侧扩展操作", "Trailing actions.") }
];

useComponents({
  "page-page-header-ex1": PagePageHeaderEx1,
  "page-page-header-ex2": PagePageHeaderEx2
});

const PagePageHeader = defineHtml(`
  <elf-container>
    <h1>${t("title")}</h1>
    <p>${t("description")}</p>

    <page-page-header-ex1 />

    <page-page-header-ex2 />

    <h2>API</h2>
    <elf-props-table title="Props" :rows=${propsRows}></elf-props-table>
    <elf-props-table title="Events" :rows=${eventsRows}></elf-props-table>
    <elf-props-table title="Slots" :rows=${slotsRows}></elf-props-table>
  </elf-container>
`);

export { PagePageHeader };
