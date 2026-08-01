import { defineHtml, useComponents } from "@elfui/core";

import { createDocsTranslator } from "../../docsLocale";
import { PageCollapseEx1 } from "./ex1";
import { PageCollapseEx2 } from "./ex2";
import { PageCollapseEx3 } from "./ex3";
import { PageCollapseProps } from "./props";

useComponents({
  "page-collapse-ex1": PageCollapseEx1,
  "page-collapse-ex2": PageCollapseEx2,
  "page-collapse-ex3": PageCollapseEx3,
  "page-collapse-props": PageCollapseProps,
});

const t = createDocsTranslator({
  title: { zh: "Collapse 折叠面板", en: "Collapse" },
  description: {
    zh: "分层组织需要按需查看的内容，支持受控多开、手风琴、动态数据、组合式插槽、嵌套与完整键盘导航。",
    en: "Organize content for progressive disclosure with controlled multi-open and accordion modes, dynamic data, composition slots, nesting, and complete keyboard navigation.",
  },
});

const PageCollapse = defineHtml(`
  <elf-container>
    <elf-docs-hero category="data" :title=${t("title")} :description=${t("description")}></elf-docs-hero>
    <page-collapse-ex1></page-collapse-ex1>
    <page-collapse-ex2></page-collapse-ex2>
    <page-collapse-ex3></page-collapse-ex3>
    <page-collapse-props></page-collapse-props>
  </elf-container>
`);

export { PageCollapse };
