import { defineHtml, useComponents } from "@elfui/core";
import { createDocsTranslator } from "../../docsLocale";
import { PageScrollbarEx1 } from "./ex1";
import { PageScrollbarEx2 } from "./ex2";
import { PageScrollbarEx3 } from "./ex3";
import { PageScrollbarProps } from "./props";

const t = createDocsTranslator({
  title: { zh: "滚动条", en: "Scrollbar" },
  description: {
    zh: "包装滚动内容并提供滚动事件，支持固定高度、最大高度、常显轨道和命令式滚动控制。",
    en: "Wrap scrollable content with scroll events, fixed or maximum heights, persistent tracks, and imperative scrolling controls.",
  },
});

useComponents({
  "page-scrollbar-ex1": PageScrollbarEx1,
  "page-scrollbar-ex2": PageScrollbarEx2,
  "page-scrollbar-ex3": PageScrollbarEx3,
  "page-scrollbar-props": PageScrollbarProps,
});

const PageScrollbar = defineHtml(`
  <elf-container>
    <elf-docs-hero category="layout" :title=${t("title")} :description=${t("description")}></elf-docs-hero>
    <page-scrollbar-ex1></page-scrollbar-ex1>
    <page-scrollbar-ex2></page-scrollbar-ex2>
    <page-scrollbar-ex3></page-scrollbar-ex3>
    <page-scrollbar-props></page-scrollbar-props>
  </elf-container>
`);

export { PageScrollbar };
