import { defineHtml, useComponents } from "@elfui/core";
import { PageBreadcrumbEx1 } from "./ex1";
import { PageBreadcrumbEx2 } from "./ex2";
import { PageBreadcrumbEx3 } from "./ex3";
import { PageBreadcrumbProps } from "./props";

useComponents({
  "page-breadcrumb-ex1": PageBreadcrumbEx1,
  "page-breadcrumb-ex2": PageBreadcrumbEx2,
  "page-breadcrumb-ex3": PageBreadcrumbEx3,
  "page-breadcrumb-props": PageBreadcrumbProps
});

const PageBreadcrumb = defineHtml(`
  <elf-container>
    <h1>Breadcrumb 面包屑</h1>
    <p>显示当前页面在信息层级中的位置，适合详情页、配置页和多级导航场景。</p>
    <page-breadcrumb-ex1></page-breadcrumb-ex1>
    <page-breadcrumb-ex2></page-breadcrumb-ex2>
    <page-breadcrumb-ex3></page-breadcrumb-ex3>
    <page-breadcrumb-props></page-breadcrumb-props>
  </elf-container>
`);

export { PageBreadcrumb };
