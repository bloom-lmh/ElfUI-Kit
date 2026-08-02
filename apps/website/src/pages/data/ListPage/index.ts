import { defineHtml, useComponents } from "@elfui/core";

import { createDocsTranslator } from "../../docsLocale";
import { PageListEx1 } from "./ex1";
import { PageListEx2 } from "./ex2";
import { PageListEx3 } from "./ex3";
import { PageListEx4 } from "./ex4";
import { PageListProps } from "./props";

useComponents({
  "page-list-ex1": PageListEx1,
  "page-list-ex2": PageListEx2,
  "page-list-ex3": PageListEx3,
  "page-list-ex4": PageListEx4,
  "page-list-props": PageListProps,
});

const t = createDocsTranslator({
  title: { zh: "List 列表", en: "List" },
  description: {
    zh: "组织连续且结构一致的信息，覆盖分组操作、受控选择、键盘导航、异步状态，以及普通列表与虚拟列表的使用边界。",
    en: "Organize consistent sequences with grouped actions, controlled selection, keyboard navigation, async states, and a clear boundary between standard and virtual lists.",
  },
});

const PageList = defineHtml(`
  <elf-container>
    <elf-docs-hero category="data" :title=${t("title")} :description=${t("description")}></elf-docs-hero>
    <page-list-ex1 />
    <page-list-ex2 />
    <page-list-ex3 />
    <page-list-ex4 />
    <page-list-props />
  </elf-container>
`);

export { PageList };
