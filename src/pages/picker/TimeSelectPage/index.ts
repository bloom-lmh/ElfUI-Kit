import { defineHtml, useComponents } from "@elfui/core";

import { createDocsTranslator } from "../../docsLocale";
import { PageTimeSelectEx1 } from "./ex1";
import { PageTimeSelectEx2 } from "./ex2";
import { PageTimeSelectEx3 } from "./ex3";
import { PageTimeSelectEx4 } from "./ex4";
import { PageTimeSelectProps } from "./props";

useComponents({
  "page-time-select-ex1": PageTimeSelectEx1,
  "page-time-select-ex2": PageTimeSelectEx2,
  "page-time-select-ex3": PageTimeSelectEx3,
  "page-time-select-ex4": PageTimeSelectEx4,
  "page-time-select-props": PageTimeSelectProps,
});

const t = createDocsTranslator({
  title: { zh: "TimeSelect 时间选择", en: "TimeSelect" },
  description: {
    zh: "从固定步长的时间列表中快速选择，支持格式化、边界联动，并复用 Select 的键盘、表单与字段表面协议。",
    en: "Choose from fixed time steps with formatting and linked boundaries while reusing Select keyboard, form, and field-surface protocols.",
  },
});

const PageTimeSelect = defineHtml(`
  <elf-container>
    <h1>${t("title")}</h1>
    <p>${t("description")}</p>
    <page-time-select-ex1 />
    <page-time-select-ex2 />
    <page-time-select-ex3 />
    <page-time-select-ex4 />
    <page-time-select-props />
  </elf-container>
`);

export { PageTimeSelect };
