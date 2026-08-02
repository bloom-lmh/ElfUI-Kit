import { defineHtml, useComponents } from "@elfui/core";

import { createDocsTranslator } from "../../docsLocale";
import { PageHeadingEx1 } from "./ex1";
import { PageHeadingEx2 } from "./ex2";
import { PageHeadingEx3 } from "./ex3";
import { PageHeadingProps } from "./props";

useComponents({
  "page-heading-ex1": PageHeadingEx1,
  "page-heading-ex2": PageHeadingEx2,
  "page-heading-ex3": PageHeadingEx3,
  "page-heading-props": PageHeadingProps,
});

const t = createDocsTranslator({
  title: { zh: "Heading 标题", en: "Heading" },
  description: {
    zh: "基于语义层级 h1-h6 的标题组件，提供三套可复用标题族：文档蓝、编辑杂志与开发者终端，覆盖 H1-H6、编号与无编号标题。",
    en: "A semantic h1-h6 heading component with three reusable heading families: documentation blue, editorial serif, and developer terminal, covering H1-H6, numbered, and unnumbered headings.",
  },
});

const PageHeading = defineHtml(`
  <elf-container>
    <elf-docs-hero category="basic" :title=${t("title")} :description=${t("description")}></elf-docs-hero>
    <page-heading-ex1 />
    <page-heading-ex2 />
    <page-heading-ex3 />
    <page-heading-props />
  </elf-container>
`);

export { PageHeading };
