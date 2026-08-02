import { defineHtml, useComponents } from "@elfui/core";
import { createDocsTranslator } from "../../docsLocale";
import { PageTextareaEx1 } from "./ex1";
import { PageTextareaEx2 } from "./ex2";
import { PageTextareaEx3 } from "./ex3";
import { PageTextareaProps } from "./props";

const t = createDocsTranslator({
  title: { zh: "多行文本", en: "Textarea" },
  description: {
    zh: "输入和编辑多行文本，支持字符计数、自动高度、格式化与组合插槽。",
    en: "Enter and edit multiline text with character counting, autosizing, formatting, and compound slots.",
  },
});

useComponents({
  "page-textarea-ex1": PageTextareaEx1,
  "page-textarea-ex2": PageTextareaEx2,
  "page-textarea-ex3": PageTextareaEx3,
  "page-textarea-props": PageTextareaProps,
});

const PageTextarea = defineHtml(`
  <elf-container>
    <elf-docs-hero category="form" :title=${t("title")} :description=${t("description")}></elf-docs-hero>
    <page-textarea-ex1 />
    <page-textarea-ex2 />
    <page-textarea-ex3 />
    <page-textarea-props />
  </elf-container>
`);

export { PageTextarea };
