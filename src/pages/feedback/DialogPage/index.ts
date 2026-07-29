import { defineHtml, useComponents } from "@elfui/core";
import { createDocsTranslator } from "../../docsLocale";
import { PageDialogEx1 } from "./ex1";
import { PageDialogEx2 } from "./ex2";
import { PageDialogEx3 } from "./ex3";
import { PageDialogEx4 } from "./ex4";
import { PageDialogEx5 } from "./ex5";
import { PageDialogProps } from "./props";

const t = createDocsTranslator({
  title: { zh: "Dialog 对话框", en: "Dialog" },
  description: {
    zh: "在保留当前页面状态的情况下，向用户说明重要信息并承载需要聚焦完成的操作。",
    en: "Presents important information and focused tasks while preserving the current page state.",
  },
});

useComponents({
  "page-dialog-ex1": PageDialogEx1,
  "page-dialog-ex2": PageDialogEx2,
  "page-dialog-ex3": PageDialogEx3,
  "page-dialog-ex4": PageDialogEx4,
  "page-dialog-ex5": PageDialogEx5,
  "page-dialog-props": PageDialogProps
});

const PageDialog = defineHtml(`
  <elf-container>
    <h1>${t("title")}</h1>
    <p>${t("description")}</p>
    <page-dialog-ex1></page-dialog-ex1>
    <page-dialog-ex2></page-dialog-ex2>
    <page-dialog-ex3></page-dialog-ex3>
    <page-dialog-ex4></page-dialog-ex4>
    <page-dialog-ex5></page-dialog-ex5>
    <page-dialog-props></page-dialog-props>
  </elf-container>
`);

export { PageDialog };
