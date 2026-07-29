import { defineHtml, useComponents } from "@elfui/core";

import { createDocsTranslator } from "../../docsLocale";
import { PageCalendarEx1 } from "./ex1";
import { PageCalendarEx2 } from "./ex2";
import { PageCalendarEx3 } from "./ex3";
import { PageCalendarEx4 } from "./ex4";
import { PageCalendarEx5 } from "./ex5";
import { PageCalendarProps } from "./props";

useComponents({
  "page-calendar-ex1": PageCalendarEx1,
  "page-calendar-ex2": PageCalendarEx2,
  "page-calendar-ex3": PageCalendarEx3,
  "page-calendar-ex4": PageCalendarEx4,
  "page-calendar-ex5": PageCalendarEx5,
  "page-calendar-props": PageCalendarProps,
});

const t = createDocsTranslator({
  title: { zh: "Calendar 日历", en: "Calendar" },
  description: {
    zh: "展示月视图日期选择，支持范围、周序号、键盘导航、自定义日期内容和全局日期适配器。",
    en: "Display a month-view date selector with ranges, week numbers, keyboard navigation, custom cells, and the global date adapter.",
  },
});

const PageCalendar = defineHtml(`
  <elf-container>
    <h1>${t("title")}</h1>
    <p>${t("description")}</p>
    <page-calendar-ex1 />
    <page-calendar-ex2 />
    <page-calendar-ex3 />
    <page-calendar-ex4 />
    <page-calendar-ex5 />
    <page-calendar-props />
  </elf-container>
`);

export { PageCalendar };
