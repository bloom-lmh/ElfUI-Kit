import { defineHtml, useComponents } from "@elfui/core";
import { createDocsTranslator } from "../../docsLocale";
import { PageBadgeEx1 } from "./ex1";
import { PageBadgeEx2 } from "./ex2";
import { PageBadgeProps } from "./props";

useComponents({
  "page-badge-ex1": PageBadgeEx1,
  "page-badge-ex2": PageBadgeEx2,
  "page-badge-props": PageBadgeProps,
});

const t = createDocsTranslator({
  title: { zh: "Badge 徽章", en: "Badge" },
  description: {
    zh: "为内容附加计数或状态，支持动态值、逻辑方向、长文本和自定义内容。",
    en: "Adds counts or status to content with dynamic values, logical direction, long text, and custom content.",
  },
});

const PageBadge = defineHtml(`
  <elf-container
    ><elf-docs-hero category="basic" tag="Badge" :title=${t("title")} :description=${t("description")}></elf-docs-hero>
    <page-badge-ex1 /><page-badge-ex2 /><page-badge-props
  /></elf-container>
`);

export { PageBadge };
