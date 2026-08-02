import { defineHtml, useComponents } from "@elfui/core";

import { createDocsTranslator } from "../../docsLocale";
import { PageCascaderEx1 } from "./ex1";
import { PageCascaderEx2 } from "./ex2";
import { PageCascaderEx3 } from "./ex3";
import { PageCascaderEx4 } from "./ex4";
import { PageCascaderEx5 } from "./ex5";
import { PageCascaderEx6 } from "./ex6";
import { PageCascaderEx7 } from "./ex7";
import { PageCascaderEx8 } from "./ex8";
import { PageCascaderProps } from "./props";

useComponents({
  "page-cascader-ex1": PageCascaderEx1,
  "page-cascader-ex2": PageCascaderEx2,
  "page-cascader-ex3": PageCascaderEx3,
  "page-cascader-ex4": PageCascaderEx4,
  "page-cascader-ex5": PageCascaderEx5,
  "page-cascader-ex6": PageCascaderEx6,
  "page-cascader-ex7": PageCascaderEx7,
  "page-cascader-ex8": PageCascaderEx8,
  "page-cascader-props": PageCascaderProps,
});

const t = createDocsTranslator({
  title: { zh: "Cascader 级联选择器", en: "Cascader" },
  description: {
    zh: "从多级数据中逐级选择，支持搜索、多选、异步数据和深层路径树化。",
    en: "Select hierarchical data with search, multiple selection, lazy loading, and compact deep-path trees.",
  },
});

const PageCascader = defineHtml(`
  <elf-container>
    <elf-docs-hero category="form" :title=${t("title")} :description=${t("description")}></elf-docs-hero>
    <page-cascader-ex1 />
    <page-cascader-ex2 />
    <page-cascader-ex3 />
    <page-cascader-ex4 />
    <page-cascader-ex5 />
    <page-cascader-ex6 />
    <page-cascader-ex7 />
    <page-cascader-ex8 />
    <page-cascader-props />
  </elf-container>
`);

export { PageCascader };
