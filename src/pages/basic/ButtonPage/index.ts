import { defineHtml, useComponents } from "@elfui/core";

import { createDocsTranslator } from "../../docsLocale";
import { PageButtonEx1 } from "./ex1";
import { PageButtonEx2 } from "./ex2";
import { PageButtonEx3 } from "./ex3";
import { PageButtonProps } from "./props";

useComponents({
  "page-button-ex1": PageButtonEx1,
  "page-button-ex2": PageButtonEx2,
  "page-button-ex3": PageButtonEx3,
  "page-button-props": PageButtonProps
});

const t = createDocsTranslator({
  title: { zh: "Button 按钮", en: "Button" },
  description: {
    zh: "触发即时或异步操作，支持语义层级、图标、加载状态、键盘和原生表单提交。",
    en: "Triggers immediate or async actions with semantic hierarchy, icons, loading states, keyboard access, and native form submission."
  }
});

const PageButton = defineHtml(`
  <elf-container
    ><h1>${t("title")}</h1>
    <p>${t("description")}</p>
    <page-button-ex1 /><page-button-ex2 /><page-button-ex3 /><page-button-props
  /></elf-container>
`);

export { PageButton };
