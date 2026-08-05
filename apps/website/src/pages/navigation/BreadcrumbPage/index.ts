import { defineHtml, useComponents } from "@elfui/core";
import { createDocsTranslator } from "../../docsLocale";
import { PageBreadcrumbEx1 } from "./ex1";
import { PageBreadcrumbEx2 } from "./ex2";
import { PageBreadcrumbEx3 } from "./ex3";
import { PageBreadcrumbProps } from "./props";

const t = createDocsTranslator({
  title: { zh: "面包屑导航", en: "Breadcrumb" },
  description: {
    zh: "显示当前页面在信息层级中的位置，适合详情页、配置页和多级导航场景。",
    en: "Show the current page's position in the information hierarchy for detail pages, settings, and multi-level navigation.",
  },
});

useComponents({
  "page-breadcrumb-ex1": PageBreadcrumbEx1,
  "page-breadcrumb-ex2": PageBreadcrumbEx2,
  "page-breadcrumb-ex3": PageBreadcrumbEx3,
  "page-breadcrumb-props": PageBreadcrumbProps,
});

const PageBreadcrumb = defineHtml(`
  <elf-container>
    <elf-docs-hero category="navigation" :title=${t("title")} :description=${t("description")}></elf-docs-hero>
    <page-breadcrumb-ex1></page-breadcrumb-ex1>
    <page-breadcrumb-ex2></page-breadcrumb-ex2>
    <page-breadcrumb-ex3></page-breadcrumb-ex3>
    <page-breadcrumb-props></page-breadcrumb-props>
  </elf-container>
`);

export { PageBreadcrumb };
