import { defineHtml, useComponents } from "@elfui/core";
import { createDocsTranslator } from "../../docsLocale";
import { PageTooltipEx1 } from "./ex1";
import { PageTooltipEx2 } from "./ex2";
import { PageTooltipEx3 } from "./ex3";
import { PageTooltipEx4 } from "./ex4";
import { PageTooltipEx5 } from "./ex5";
import { PageTooltipProps } from "./props";

const t = createDocsTranslator({
  title: { zh: "文字气泡提示", en: "Tooltip" },
  description: {
    zh: "在鼠标悬浮、点击、右键或聚焦时，于目标元素附近显示轻量文字提示。",
    en: "Show lightweight contextual text beside a target on hover, click, context menu, or focus.",
  },
});

useComponents({
  "page-tooltip-ex1": PageTooltipEx1,
  "page-tooltip-ex2": PageTooltipEx2,
  "page-tooltip-ex3": PageTooltipEx3,
  "page-tooltip-ex4": PageTooltipEx4,
  "page-tooltip-ex5": PageTooltipEx5,
  "page-tooltip-props": PageTooltipProps,
});

const PageTooltip = defineHtml(`
  <elf-container>
    <elf-docs-hero category="feedback" :title=${t("title")} :description=${t("description")}></elf-docs-hero>
    <page-tooltip-ex1 />
    <page-tooltip-ex2 />
    <page-tooltip-ex3 />
    <page-tooltip-ex4 />
    <page-tooltip-ex5 />
    <page-tooltip-props />
  </elf-container>
`);

export { PageTooltip };
