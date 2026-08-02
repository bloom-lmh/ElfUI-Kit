import { defineHtml, useComponents } from "@elfui/core";
import { createDocsTranslator } from "../../docsLocale";
import { PageSelectEx1 } from "./ex1";
import { PageSelectEx2 } from "./ex2";
import { PageSelectEx3 } from "./ex3";
import { PageSelectEx4 } from "./ex4";
import { PageSelectEx5 } from "./ex5";
import { PageSelectEx6 } from "./ex6";
import { PageSelectProps } from "./props";

useComponents({
  "page-select-ex1": PageSelectEx1,
  "page-select-ex2": PageSelectEx2,
  "page-select-ex3": PageSelectEx3,
  "page-select-ex4": PageSelectEx4,
  "page-select-ex5": PageSelectEx5,
  "page-select-ex6": PageSelectEx6,
  "page-select-props": PageSelectProps,
});

const t = createDocsTranslator({
  title: { zh: "Select 选择器", en: "Select" },
  description: {
    zh: "从候选项中选择一个或多个值，支持搜索、远程数据和大数据虚拟化。",
    en: "Choose one or more values with filtering, remote data, and large-data virtualization.",
  },
});

const PageSelect = defineHtml(`
  <elf-container>
    <elf-docs-hero category="form" :title=${t("title")} :description=${t("description")}></elf-docs-hero>
    <page-select-ex1 />
    <page-select-ex2 />
    <page-select-ex3 />
    <page-select-ex4 />
    <page-select-ex5 />
    <page-select-ex6 />
    <page-select-props />
  </elf-container>
`);

export { PageSelect };
