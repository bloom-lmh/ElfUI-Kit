import { defineHtml, useComponents } from "@elfui/core";
import { createDocsTranslator } from "../../docsLocale";
import { PageInputEx1 } from "./ex1";
import { PageInputEx2 } from "./ex2";
import { PageInputEx3 } from "./ex3";
import { PageInputProps } from "./props";

useComponents({
  "page-input-ex1": PageInputEx1,
  "page-input-ex2": PageInputEx2,
  "page-input-ex3": PageInputEx3,
  "page-input-props": PageInputProps,
});

const t = createDocsTranslator({
  title: { zh: "Input 输入框", en: "Input" },
  description: {
    zh: "单行文本输入，支持 Material 外观、浮动标签、内外图标、格式化与表单校验。",
    en: "Single-line input with Material variants, floating labels, inner and outer icons, formatting, and form validation.",
  },
});

const PageInput = defineHtml(`
  <elf-container>
    <elf-docs-hero category="form" :title=${t("title")} :description=${t("description")}></elf-docs-hero>
    <page-input-ex1 />
    <page-input-ex2 />
    <page-input-ex3 />
    <page-input-props />
  </elf-container>
`);

export { PageInput };
