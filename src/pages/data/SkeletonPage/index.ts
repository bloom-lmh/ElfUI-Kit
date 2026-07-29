import { defineHtml, useComponents } from "@elfui/core";
import { createDocsTranslator } from "../../docsLocale";
import { PageSkeletonEx1 } from "./ex1";
import { PageSkeletonEx2 } from "./ex2";
import { PageSkeletonProps } from "./props";

const t = createDocsTranslator({
  title: { zh: "骨架屏", en: "Skeleton" },
  description: {
    zh: "Material Design 风格骨架屏，支持文本、圆形和矩形变体以及 shimmer 扫光动画。",
    en: "Material Design skeletons with text, circle, and rectangle variants plus a shimmer animation."
  }
});

useComponents({
  "page-skeleton-ex1": PageSkeletonEx1,
  "page-skeleton-ex2": PageSkeletonEx2,
  "page-skeleton-props": PageSkeletonProps
});

const PageSkeleton = defineHtml(`
  <elf-container
    ><h1>${t("title")}</h1>
    <p>${t("description")}</p>
    <page-skeleton-ex1 /><page-skeleton-ex2 /><page-skeleton-props
  /></elf-container>
`);

export { PageSkeleton };
