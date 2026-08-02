import { defineHtml, useComponents } from "@elfui/core";
import { createDocsTranslator } from "../../docsLocale";
import { PageProgressEx1 } from "./ex1";
import { PageProgressEx2 } from "./ex2";
import { PageProgressProps } from "./props";

useComponents({
  "page-progress-ex1": PageProgressEx1,
  "page-progress-ex2": PageProgressEx2,
  "page-progress-props": PageProgressProps,
});
const t = createDocsTranslator({
  title: { zh: "Progress 进度条", en: "Progress" },
  description: {
    zh: "清晰表达任务完成度，支持线性、环形、仪表盘、标签、格式化、插槽与不确定状态。",
    en: "Communicate completion clearly with linear, circular, dashboard, label, formatting, slot, and indeterminate states.",
  },
});
const PageProgress = defineHtml(`
  <elf-container><elf-docs-hero category="data" tag="Progress" :title=${t("title")} :description=${t("description")}></elf-docs-hero><page-progress-ex1></page-progress-ex1><page-progress-ex2></page-progress-ex2><page-progress-props></page-progress-props></elf-container>
`);
export { PageProgress };
