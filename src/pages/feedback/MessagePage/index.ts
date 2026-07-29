import { defineHtml, useComponents } from "@elfui/core";
import { createDocsTranslator } from "../../docsLocale";
import { PageMessageEx1 } from "./ex1";
import { PageMessageEx2 } from "./ex2";
import { PageMessageEx3 } from "./ex3";
import { PageMessageEx4 } from "./ex4";
import { PageMessageProps } from "./props";

const t = createDocsTranslator({
  title: { zh: "Message 全局提示", en: "Message" },
  description: {
    zh: "用于反馈操作结果，支持操作按钮、关闭、堆叠和上下位置。",
    en: "Reports operation results with actions, manual closing, stacking, and top or bottom placement.",
  },
});

useComponents({
  "page-message-ex1": PageMessageEx1,
  "page-message-ex2": PageMessageEx2,
  "page-message-ex3": PageMessageEx3,
  "page-message-ex4": PageMessageEx4,
  "page-message-props": PageMessageProps
});

const PageMessage = defineHtml(`
  <elf-container>
    <h1>${t("title")}</h1>
    <p>${t("description")}</p>
    <page-message-ex1></page-message-ex1>
    <page-message-ex2></page-message-ex2>
    <page-message-ex3></page-message-ex3>
    <page-message-ex4></page-message-ex4>
    <page-message-props></page-message-props>
  </elf-container>
`);

export { PageMessage };
