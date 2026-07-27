import { defineHtml, useComponents } from "@elfui/core";
import { createDocsTranslator } from "../../docsLocale";
import { PageProgressEx1 } from "./ex1";
import { PageProgressEx2 } from "./ex2";
import { PageProgressProps } from "./props";

useComponents({ "page-progress-ex1": PageProgressEx1, "page-progress-ex2": PageProgressEx2, "page-progress-props": PageProgressProps });
const t = createDocsTranslator({
  title: { zh: "Progress 进度条", en: "Progress" },
  description: { zh: "展示任务完成度，支持条形、环形、状态色、条纹和不确定进度。", en: "Display task completion with linear, circular, status, striped, and indeterminate progress." }
});
const PageProgress = defineHtml(`
  <elf-container><h1>${t("title")}</h1><p>${t("description")}</p><page-progress-ex1></page-progress-ex1><page-progress-ex2></page-progress-ex2><page-progress-props></page-progress-props></elf-container>
`);
export { PageProgress };
