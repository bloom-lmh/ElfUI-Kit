import { defineHtml, useComponents } from "@elfui/core";
import { createDocsTranslator } from "../../docsLocale";
import { PageSplitterEx1 } from "./ex1";
import { PageSplitterEx2 } from "./ex2";
import { PageSplitterEx3 } from "./ex3";
import { PageSplitterEx4 } from "./ex4";
import { PageSplitterEx5 } from "./ex5";
import { PageSplitterProps } from "./props";

const t = createDocsTranslator({
  title: { zh: "分割面板", en: "Splitter" },
  description: {
    zh: "通过拖动分隔条调整两个区域的比例，并支持面板折叠、延迟渲染、尺寸持久化和键盘操作。",
    en: "Resize two regions by dragging their separator, with panel collapsing, lazy rendering, size persistence, and keyboard controls."
  }
});

useComponents({
  "page-splitter-ex1": PageSplitterEx1,
  "page-splitter-ex2": PageSplitterEx2,
  "page-splitter-ex3": PageSplitterEx3,
  "page-splitter-ex4": PageSplitterEx4,
  "page-splitter-ex5": PageSplitterEx5,
  "page-splitter-props": PageSplitterProps
});

const PageSplitter = defineHtml(`
  <elf-container>
    <h1>${t("title")}</h1>
    <p>${t("description")}</p>
    <page-splitter-ex1></page-splitter-ex1>
    <page-splitter-ex2></page-splitter-ex2>
    <page-splitter-ex3></page-splitter-ex3>
    <page-splitter-ex4></page-splitter-ex4>
    <page-splitter-ex5></page-splitter-ex5>
    <page-splitter-props></page-splitter-props>
  </elf-container>
`);

export { PageSplitter };
