import { defineHtml, useComponents } from "@elfui/core";
import { createDocsTranslator } from "../../docsLocale";
import { PagePaginationEx1 } from "./ex1";
import { PagePaginationEx2 } from "./ex2";
import { PagePaginationEx3 } from "./ex3";
import { PagePaginationEx4 } from "./ex4";
import { PagePaginationProps } from "./props";

const t = createDocsTranslator({
  title: { zh: "分页", en: "Pagination" },
  description: {
    zh: "用于大数据列表的分页导航，支持页码、每页条数、跳转和布局组合。",
    en: "Navigate large data sets with page numbers, page sizes, jump controls, and configurable layouts."
  }
});

useComponents({
  "page-pagination-ex1": PagePaginationEx1,
  "page-pagination-ex2": PagePaginationEx2,
  "page-pagination-ex3": PagePaginationEx3,
  "page-pagination-ex4": PagePaginationEx4,
  "page-pagination-props": PagePaginationProps
});

const PagePagination = defineHtml(`
  <elf-container>
    <h1>${t("title")}</h1>
    <p>${t("description")}</p>
    <page-pagination-ex1></page-pagination-ex1>
    <page-pagination-ex2></page-pagination-ex2>
    <page-pagination-ex3></page-pagination-ex3>
    <page-pagination-ex4></page-pagination-ex4>
    <page-pagination-props></page-pagination-props>
  </elf-container>
`);

export { PagePagination };
