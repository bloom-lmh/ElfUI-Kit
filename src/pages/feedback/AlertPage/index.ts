import { defineHtml, useComponents } from "@elfui/core";
import { createDocsTranslator } from "../../docsLocale";
import { PageAlertEx1 } from "./ex1";
import { PageAlertEx2 } from "./ex2";
import { PageAlertEx3 } from "./ex3";
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
  "page-alert-props": PageAlertProps
});

const PageAlert = defineHtml(`
  <elf-container
    ><h1>${t("title")}</h1>
    <p>${t("description")}</p>
    <page-alert-ex1 /><page-alert-ex2 /><page-alert-ex3 /><page-alert-props
  /></elf-container>
`);

export { PageAlert };
