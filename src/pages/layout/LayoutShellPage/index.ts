import { defineHtml, useComponents } from "@elfui/core";
import { createDocsTranslator } from "../../docsLocale";
import { PageLayoutShellEx1 } from "./ex1";
import { PageLayoutShellEx2 } from "./ex2";
import { PageLayoutShellEx3 } from "./ex3";
import { PageLayoutShellEx4 } from "./ex4";
import { PageLayoutShellProps } from "./props";

const t = createDocsTranslator({
  title: { zh: "Layout 应用骨架", en: "Application layout" },
  description: {
    zh: "八种不重复的应用结构使用统一语义区域图展示，目录保持单层平铺。",
    en: "Eight distinct application structures use one semantic diagram style and a flat table of contents.",
  },
});

useComponents({
  "page-layout-shell-ex1": PageLayoutShellEx1,
  "page-layout-shell-ex2": PageLayoutShellEx2,
  "page-layout-shell-ex3": PageLayoutShellEx3,
  "page-layout-shell-ex4": PageLayoutShellEx4,
  "page-layout-shell-props": PageLayoutShellProps,
});

const PageLayoutShell = defineHtml(`
  <elf-container>
    <elf-docs-hero category="layout" :title=${t("title")} :description=${t("description")}></elf-docs-hero>
    <page-layout-shell-ex1 />
    <page-layout-shell-ex2 />
    <page-layout-shell-ex3 />
    <page-layout-shell-ex4 />
    <page-layout-shell-props />
  </elf-container>
`);

export { PageLayoutShell };
