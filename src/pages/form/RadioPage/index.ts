import { defineHtml, useComponents } from "@elfui/core";
import { createDocsTranslator } from "../../docsLocale";
import { PageRadioEx1 } from "./ex1";
import { PageRadioEx2 } from "./ex2";
import { PageRadioEx3 } from "./ex3";
import { PageRadioEx4 } from "./ex4";
import { PageRadioProps } from "./props";

const t = createDocsTranslator({
  title: { zh: "单选框", en: "Radio" },
  description: {
    zh: "在互斥选项中选择一个值，支持默认样式、按钮样式、禁用状态和声明式数据。",
    en: "Choose one value from mutually exclusive options with default, button, disabled, and declarative-data modes.",
  },
});

useComponents({
  "page-radio-ex1": PageRadioEx1,
  "page-radio-ex2": PageRadioEx2,
  "page-radio-ex3": PageRadioEx3,
  "page-radio-ex4": PageRadioEx4,
  "page-radio-props": PageRadioProps
});

const PageRadio = defineHtml(`
  <elf-container>
    <h1>${t("title")}</h1>
    <p>${t("description")}</p>
    <page-radio-ex1 />
    <page-radio-ex2 />
    <page-radio-ex3 />
    <page-radio-ex4 />
    <page-radio-props />
  </elf-container>
`);

export { PageRadio };
