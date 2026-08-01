import { defineHtml, useComponents } from "@elfui/core";
import { createDocsTranslator } from "../../docsLocale";
import { PageInputNumberProps } from "./props";
import { PageInputNumberEx1 } from "./ex1";
import { PageInputNumberEx2 } from "./ex2";
import { PageInputNumberEx3 } from "./ex3";

useComponents({
  "page-input-number-ex1": PageInputNumberEx1,
  "page-input-number-ex2": PageInputNumberEx2,
  "page-input-number-ex3": PageInputNumberEx3,
  "page-input-number-props": PageInputNumberProps,
});

const t = createDocsTranslator({
  title: { zh: "InputNumber 数字输入框", en: "InputNumber" },
  description: {
    zh: "统一的 Material 数字字段，支持精度、范围以及 default、stacked、split、hidden 四种控制器布局。",
    en: "A Material number field with precision, range constraints, and default, stacked, split, and hidden controls.",
  },
});

const PageInputNumber = defineHtml(`
  <elf-container>
    <elf-docs-hero category="form" :title=${t("title")} :description=${t("description")}></elf-docs-hero>
    <page-input-number-ex2 />
    <page-input-number-ex1 />
    <page-input-number-ex3 />
    <page-input-number-props />
  </elf-container>
`);

export { PageInputNumber };
