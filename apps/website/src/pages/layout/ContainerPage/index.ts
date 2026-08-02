import { defineHtml, useComponents } from "@elfui/core";
import { createDocsTranslator } from "../../docsLocale";
import { PageContainerEx1 } from "./ex1";
import { PageContainerEx2 } from "./ex2";
import { PageContainerProps } from "./props";

const t = createDocsTranslator({
  title: { zh: "容器", en: "Container" },
  description: {
    zh: "使用预设最大宽度和响应式内边距构建居中页面骨架，也可通过全宽模式组合背景区与正文区。",
    en: "Build centered page shells with maximum-width presets and responsive padding, or combine full-width backgrounds with constrained content.",
  },
});

useComponents({
  "page-container-ex1": PageContainerEx1,
  "page-container-ex2": PageContainerEx2,
  "page-container-props": PageContainerProps,
});

const PageContainer = defineHtml(`
  <elf-container>
    <elf-docs-hero category="layout" :title=${t("title")} :description=${t("description")}></elf-docs-hero>
    <page-container-ex1 />
    <page-container-ex2 />
    <page-container-props />
  </elf-container>
`);

export { PageContainer };
