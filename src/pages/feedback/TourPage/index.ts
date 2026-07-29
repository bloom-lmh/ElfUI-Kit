import { defineHtml, useComponents } from "@elfui/core";
import { createDocsTranslator } from "../../docsLocale";
import { PageTourEx1 } from "./ex1";
import { PageTourEx2 } from "./ex2";
import { PageTourEx3 } from "./ex3";
import { PageTourProps } from "./props";

const t = createDocsTranslator({
  title: { zh: "漫游式引导", en: "Tour" },
  description: {
    zh: "分步骤介绍页面功能，支持目标高亮、面板定位、键盘导航与焦点管理。",
    en: "Introduce page features step by step with target highlighting, panel placement, keyboard navigation, and focus management.",
  },
});

useComponents({
  "page-tour-ex1": PageTourEx1,
  "page-tour-ex2": PageTourEx2,
  "page-tour-ex3": PageTourEx3,
  "page-tour-props": PageTourProps
});

const PageTour = defineHtml(`
  <elf-container>
    <h1>${t("title")}</h1>
    <p>${t("description")}</p>
    <page-tour-ex1 />
    <page-tour-ex2 />
    <page-tour-ex3 />
    <page-tour-props />
  </elf-container>
`);

export { PageTour };
