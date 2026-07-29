import { defineHtml, useComponents } from "@elfui/core";
import { createDocsTranslator } from "../../docsLocale";
import { PagePopConfirmEx1 } from "./ex1";
import { PagePopConfirmEx2 } from "./ex2";
import { PagePopConfirmEx3 } from "./ex3";
import { PagePopConfirmProps } from "./props";

const t = createDocsTranslator({
  title: { zh: "气泡确认", en: "PopConfirm" },
  description: {
    zh: "在触发元素附近显示轻量确认浮层，适合需要二次确认但不必打断页面流程的操作。",
    en: "Show a lightweight confirmation overlay beside its trigger for actions that need confirmation without interrupting the page flow.",
  },
});

useComponents({
  "page-pop-confirm-ex1": PagePopConfirmEx1,
  "page-pop-confirm-ex2": PagePopConfirmEx2,
  "page-pop-confirm-ex3": PagePopConfirmEx3,
  "page-pop-confirm-props": PagePopConfirmProps
});

const PagePopConfirm = defineHtml(`
  <elf-container>
    <h1>${t("title")}</h1>
    <p>${t("description")}</p>
    <page-pop-confirm-ex1 />
    <page-pop-confirm-ex2 />
    <page-pop-confirm-ex3 />
    <page-pop-confirm-props />
  </elf-container>
`);

export { PagePopConfirm };
