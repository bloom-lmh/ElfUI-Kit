import { defineHtml, useComponents } from "@elfui/core";

import { createDocsTranslator } from "../../docsLocale";
import { PageTextEx1 } from "./ex1";
import { PageTextEx2 } from "./ex2";
import { PageTextEx3 } from "./ex3";
import { PageTextProps } from "./props";

useComponents({
  "page-text-ex1": PageTextEx1,
  "page-text-ex2": PageTextEx2,
  "page-text-ex3": PageTextEx3,
  "page-text-props": PageTextProps,
});

const t = createDocsTranslator({
  title: { zh: "Text 文本", en: "Text" },
  description: {
    zh: "用于正文、状态和语义排版，支持语义色、原生标签、文本装饰以及可靠的单行与多行截断。",
    en: "Body copy, status, and semantic typography with semantic colors, native tags, text decoration, and reliable single- or multi-line truncation.",
  },
});

const PageText = defineHtml(`
  <elf-container>
    <elf-docs-hero category="basic" :title=${t("title")} :description=${t("description")}></elf-docs-hero>
    <page-text-ex1 />
    <page-text-ex2 />
    <page-text-ex3 />
    <page-text-props />
  </elf-container>
`);

export { PageText };
