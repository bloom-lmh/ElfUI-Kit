import { defineHtml, useComponents } from "@elfui/core";

import { createDocsTranslator } from "../../docsLocale";
import { PageDescriptionsEx1 } from "./ex1";
import { PageDescriptionsEx2 } from "./ex2";
import { PageDescriptionsEx3 } from "./ex3";
import { PageDescriptionsProps } from "./props";

useComponents({
  "page-descriptions-ex1": PageDescriptionsEx1,
  "page-descriptions-ex2": PageDescriptionsEx2,
  "page-descriptions-ex3": PageDescriptionsEx3,
  "page-descriptions-props": PageDescriptionsProps,
});

const t = createDocsTranslator({
  title: { zh: "Descriptions 描述列表", en: "Descriptions" },
  description: {
    zh: "成组呈现结构化键值信息，支持容器响应式列、长内容与空值边界、具名插槽、丰富子项和可切换密度。",
    en: "Present structured key-value information with container-responsive columns, long-content and empty-value boundaries, named slots, rich items, and adjustable density.",
  },
});

const PageDescriptions = defineHtml(`
  <elf-container>
    <elf-docs-hero category="data" :title=${t("title")} :description=${t("description")}></elf-docs-hero>
    <page-descriptions-ex1 />
    <page-descriptions-ex2 />
    <page-descriptions-ex3 />
    <page-descriptions-props />
  </elf-container>
`);

export { PageDescriptions };
