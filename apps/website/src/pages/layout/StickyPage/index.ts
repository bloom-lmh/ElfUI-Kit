import { defineHtml, useComponents } from "@elfui/core";
import { createDocsTranslator } from "../../docsLocale";
import { PageStickyEx1 } from "./ex1";
import { PageStickyEx2 } from "./ex2";
import { PageStickyEx3 } from "./ex3";
import { PageStickyEx4 } from "./ex4";
import { PageStickyProps } from "./props";

const t = createDocsTranslator({
  title: { zh: "吸附", en: "Sticky" },
  description: {
    zh: "让工具栏、操作栏或分组标题在滚动容器内保持可见，并支持目标边界、内容投放和实时滚动状态。",
    en: "Keep toolbars, action bars, or section headings visible inside scroll containers with target boundaries, teleported content, and live scroll state.",
  },
});

useComponents({
  "page-sticky-ex1": PageStickyEx1,
  "page-sticky-ex2": PageStickyEx2,
  "page-sticky-ex3": PageStickyEx3,
  "page-sticky-ex4": PageStickyEx4,
  "page-sticky-props": PageStickyProps,
});

const PageSticky = defineHtml(`
  <elf-container>
    <elf-docs-hero category="layout" :title=${t("title")} :description=${t("description")}></elf-docs-hero>
    <page-sticky-ex1></page-sticky-ex1>
    <page-sticky-ex2></page-sticky-ex2>
    <page-sticky-ex3></page-sticky-ex3>
    <page-sticky-ex4></page-sticky-ex4>
    <page-sticky-props></page-sticky-props>
  </elf-container>
`);

export { PageSticky };
