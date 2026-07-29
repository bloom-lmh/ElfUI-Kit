import { defineHtml, useComponents } from "@elfui/core";

import { createDocsTranslator } from "../../docsLocale";
import { PageMessageBoxEx1 } from "./ex1";
import { PageMessageBoxEx2 } from "./ex2";
import { PageMessageBoxEx3 } from "./ex3";
import { PageMessageBoxEx4 } from "./ex4";
import { PageMessageBoxProps } from "./props";

const t = createDocsTranslator({
  title: { zh: "MessageBox 消息框", en: "MessageBox" },
  description: {
    zh: "用于简短、阻塞式的确认与输入任务；复杂内容请使用 Dialog。",
    en: "Handles short blocking confirmation and input tasks. Use Dialog for complex content.",
  },
});

useComponents({
  "page-message-box-ex1": PageMessageBoxEx1,
  "page-message-box-ex2": PageMessageBoxEx2,
  "page-message-box-ex3": PageMessageBoxEx3,
  "page-message-box-ex4": PageMessageBoxEx4,
  "page-message-box-props": PageMessageBoxProps,
});

const PageMessageBox = defineHtml(`
  <elf-container>
    <h1>${t("title")}</h1>
    <p>${t("description")}</p>
    <page-message-box-ex1 />
    <page-message-box-ex2 />
    <page-message-box-ex3 />
    <page-message-box-ex4 />
    <page-message-box-props />
  </elf-container>
`);

export { PageMessageBox };
