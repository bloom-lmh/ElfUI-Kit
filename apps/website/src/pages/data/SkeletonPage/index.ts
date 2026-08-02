import { defineHtml, useComponents } from "@elfui/core";
import { createDocsTranslator } from "../../docsLocale";
import { PageSkeletonEx1 } from "./ex1";
import { PageSkeletonEx2 } from "./ex2";
import { PageSkeletonProps } from "./props";

const t = createDocsTranslator({
  title: { zh: "骨架屏", en: "Skeleton" },
  description: {
    zh: "Material Design 风格骨架屏，支持文本、圆形和矩形变体以及轻量脉冲动画。",
    en: "Material Design skeletons with text, circle, and rectangle variants plus a subtle pulse animation.",
  },
});

useComponents({
  "page-skeleton-ex1": PageSkeletonEx1,
  "page-skeleton-ex2": PageSkeletonEx2,
  "page-skeleton-props": PageSkeletonProps,
});

const PageSkeleton = defineHtml(`
  <elf-container
    ><elf-docs-hero category="data" tag="Skeleton" :title=${t("title")} :description=${t("description")}></elf-docs-hero>
    <page-skeleton-ex1 /><page-skeleton-ex2 /><page-skeleton-props
  /></elf-container>
`);

export { PageSkeleton };
