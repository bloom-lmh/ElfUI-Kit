import { defineHtml, useComponents } from "@elfui/core";

import { createDocsTranslator } from "../../docsLocale";
import { PageDateTimePickerEx1 } from "./ex1";
import { PageDateTimePickerEx2 } from "./ex2";
import { PageDateTimePickerEx3 } from "./ex3";
import { PageDateTimePickerEx4 } from "./ex4";
import { PageDateTimePickerProps } from "./props";

useComponents({
  "page-date-time-picker-ex1": PageDateTimePickerEx1,
  "page-date-time-picker-ex2": PageDateTimePickerEx2,
  "page-date-time-picker-ex3": PageDateTimePickerEx3,
  "page-date-time-picker-ex4": PageDateTimePickerEx4,
  "page-date-time-picker-props": PageDateTimePickerProps,
});

const t = createDocsTranslator({
  title: { zh: "DateTimePicker 日期时间选择器", en: "DateTimePicker" },
  description: {
    zh: "组合日期与时间的公开协议，支持单值、范围、边界联动、快捷项和可替换日期适配器。",
    en: "Compose public date and time contracts with single values, ranges, linked boundaries, shortcuts, and a replaceable date adapter.",
  },
});

const PageDateTimePicker = defineHtml(`
  <elf-container>
    <h1>${t("title")}</h1>
    <p>${t("description")}</p>
    <page-date-time-picker-ex1 />
    <page-date-time-picker-ex2 />
    <page-date-time-picker-ex3 />
    <page-date-time-picker-ex4 />
    <page-date-time-picker-props />
  </elf-container>
`);

export { PageDateTimePicker };
