import { defineHtml, useComponents } from "@elfui/core";
import { createDocsTranslator } from "../../docsLocale";
import { PageAlertEx1 } from "./ex1";
import { PageAlertEx2 } from "./ex2";
import { PageAlertEx3 } from "./ex3";
import { PageAlertEx4 } from "./ex4";
import { PageAlertProps } from "./props";

const t = createDocsTranslator({
  title: { zh: "Alert 警告提示", en: "Alert" },
  description: {
    zh: "用于展示需要用户关注的重要状态、结果和操作反馈。",
    en: "Highlights important states, results, and action feedback.",
  },
});

useComponents({
  "page-alert-ex1": PageAlertEx1,
  "page-alert-ex2": PageAlertEx2,
  "page-alert-ex3": PageAlertEx3,
  "page-alert-ex4": PageAlertEx4,
  "page-alert-props": PageAlertProps,
});

const PageAlert = defineHtml(`
  <elf-container
    ><elf-docs-hero category="feedback" tag="Alert" :title=${t("title")} :description=${t("description")}></elf-docs-hero>
    <page-alert-ex1 /><page-alert-ex2 /><page-alert-ex3 /><page-alert-ex4 /><page-alert-props
  /></elf-container>
`);

export { PageAlert };
