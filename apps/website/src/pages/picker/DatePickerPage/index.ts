import { defineHtml, useComponents } from "@elfui/core";

import { createDocsTranslator } from "../../docsLocale";
import { PageDatePickerEx1 } from "./ex1";
import { PageDatePickerEx2 } from "./ex2";
import { PageDatePickerEx3 } from "./ex3";
import { PageDatePickerEx4 } from "./ex4";
import { PageDatePickerEx5 } from "./ex5";
import { PageDatePickerEx6 } from "./ex6";
import { PageDatePickerEx7 } from "./ex7";
import { PageDatePickerEx8 } from "./ex8";
import { PageDatePickerProps } from "./props";

useComponents({
  "page-date-picker-ex1": PageDatePickerEx1,
  "page-date-picker-ex2": PageDatePickerEx2,
  "page-date-picker-ex3": PageDatePickerEx3,
  "page-date-picker-ex4": PageDatePickerEx4,
  "page-date-picker-ex5": PageDatePickerEx5,
  "page-date-picker-ex6": PageDatePickerEx6,
  "page-date-picker-ex7": PageDatePickerEx7,
  "page-date-picker-ex8": PageDatePickerEx8,
  "page-date-picker-props": PageDatePickerProps,
});

const t = createDocsTranslator({
  title: { zh: "DatePicker 日期选择器", en: "DatePicker" },
  description: {
    zh: "使用共享 Calendar 和日期适配器选择单个日期、范围、月份或多个日期，并支持格式、禁用规则、表单联动和 Top Layer 浮层。",
    en: "Select a date, range, month, or multiple dates with the shared Calendar and date adapter, including formats, disabled rules, form integration, and a Top Layer overlay.",
  },
});

const PageDatePicker = defineHtml(`
  <elf-container>
    <elf-docs-hero category="picker" :title=${t("title")} :description=${t("description")}></elf-docs-hero>
    <page-date-picker-ex1 />
    <page-date-picker-ex2 />
    <page-date-picker-ex3 />
    <page-date-picker-ex4 />
    <page-date-picker-ex5 />
    <page-date-picker-ex6 />
    <page-date-picker-ex7 />
    <page-date-picker-ex8 />
    <page-date-picker-props />
  </elf-container>
`);

export { PageDatePicker };
