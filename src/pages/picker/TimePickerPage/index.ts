import { defineHtml, useComponents } from "@elfui/core";

import { createDocsTranslator } from "../../docsLocale";
import { PageTimePickerEx1 } from "./ex1";
import { PageTimePickerEx2 } from "./ex2";
import { PageTimePickerEx3 } from "./ex3";
import { PageTimePickerEx4 } from "./ex4";
import { PageTimePickerEx5 } from "./ex5";
import { PageTimePickerEx6 } from "./ex6";
import { PageTimePickerProps } from "./props";

useComponents({
  "page-time-picker-ex1": PageTimePickerEx1,
  "page-time-picker-ex2": PageTimePickerEx2,
  "page-time-picker-ex3": PageTimePickerEx3,
  "page-time-picker-ex4": PageTimePickerEx4,
  "page-time-picker-ex5": PageTimePickerEx5,
  "page-time-picker-ex6": PageTimePickerEx6,
  "page-time-picker-props": PageTimePickerProps,
});

const t = createDocsTranslator({
  title: { zh: "TimePicker 时间选择器", en: "TimePicker" },
  description: {
    zh: "使用 Material 钟面输入单个时间或时间范围，并支持格式、步进、禁用规则、快捷项和表单联动。",
    en: "Enter a time or time range with a Material clock face, including formats, steps, disabled rules, shortcuts, and form integration.",
  },
});

const PageTimePicker = defineHtml(`
  <elf-container>
    <elf-docs-hero category="picker" :title=${t("title")} :description=${t("description")}></elf-docs-hero>
    <page-time-picker-ex1 />
    <page-time-picker-ex2 />
    <page-time-picker-ex3 />
    <page-time-picker-ex4 />
    <page-time-picker-ex5 />
    <page-time-picker-ex6 />
    <page-time-picker-props />
  </elf-container>
`);

export { PageTimePicker };
