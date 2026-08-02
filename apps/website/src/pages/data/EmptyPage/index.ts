import { defineHtml, useComponents } from "@elfui/core";

import { createDocsTranslator } from "../../docsLocale";
import { PageEmptyEx1 } from "./ex1";
import { PageEmptyEx2 } from "./ex2";
import { PageEmptyEx3 } from "./ex3";
import { PageEmptyProps } from "./props";

useComponents({
  "page-empty-ex1": PageEmptyEx1,
  "page-empty-ex2": PageEmptyEx2,
  "page-empty-ex3": PageEmptyEx3,
  "page-empty-props": PageEmptyProps,
});

const t = createDocsTranslator({
  title: { zh: "Empty 空状态", en: "Empty" },
  description: {
    zh: "用于无数据、无搜索结果和首次使用场景，支持默认或紧凑密度、自定义插画、清晰说明与就地操作。",
    en: "Represent no-data, no-result, and first-use states with default or compact density, custom artwork, clear guidance, and contextual actions.",
  },
});

const PageEmpty = defineHtml(`
  <elf-container>
    <elf-docs-hero category="data" :title=${t("title")} :description=${t("description")}></elf-docs-hero>
    <page-empty-ex1 />
    <page-empty-ex2 />
    <page-empty-ex3 />
    <page-empty-props />
  </elf-container>
`);

export { PageEmpty };
