import { defineHtml, useComponents } from "@elfui/core";

import { createDocsTranslator } from "../../docsLocale";
import { PageGridEx1 } from "./ex1";
import { PageGridEx2 } from "./ex2";
import { PageGridEx3 } from "./ex3";
import { PageGridEx4 } from "./ex4";
import { PageGridProps } from "./props";

const t = createDocsTranslator({
  title: { zh: "Grid 栅格布局", en: "Grid layout" },
  description: {
    zh: "一个页面覆盖 Container、Grid 与 GridItem，以统一编号结构图展示列宽、偏移和响应式关系。",
    en: "One page covers Container, Grid, and GridItem with consistent numbered diagrams for spans, offsets, and responsive behavior."
  }
});

useComponents({
  "page-grid-ex1": PageGridEx1,
  "page-grid-ex2": PageGridEx2,
  "page-grid-ex3": PageGridEx3,
  "page-grid-ex4": PageGridEx4,
  "page-grid-props": PageGridProps
});

const PageGrid = defineHtml(`
  <elf-container>
    <h1>${t("title")}</h1>
    <p>${t("description")}</p>
    <page-grid-ex1 />
    <page-grid-ex2 />
    <page-grid-ex3 />
    <page-grid-ex4 />
    <page-grid-props />
  </elf-container>
`);

export { PageGrid };
