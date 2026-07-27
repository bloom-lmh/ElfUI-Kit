import { defineHtml, useRef } from "@elfui/core";

const day = useRef("2026-07-07");

const workday = useRef("2026-07-07");

const weekendDisabled = (date: Date): boolean => date.getDay() === 0 || date.getDay() === 6;

const onWorkdayUpdate = (event: CustomEvent): void => workday.set(String(event.detail || ""));

const localeCode = `<elf-calendar
  :modelValue.prop="workday"
  locale="zh-CN"
  :first-day-of-week="1"
  :disabled-date.prop="weekendDisabled"
  aria-label="工作日历"
  @update:modelValue="onWorkdayUpdate"
/>`;

const localeScript = `const workday = useRef("2026-07-07");
const weekendDisabled = (date: Date): boolean => date.getDay() === 0 || date.getDay() === 6;

const onWorkdayUpdate = (event) => workday.set(String(event.detail || ""));`;

const PageCalendarEx2 = defineHtml(`
<elf-playground title="本地化、翻月与禁用日期" :code=${localeCode} :script=${localeScript}>
      <elf-calendar
        :modelValue.prop="workday"
        locale="zh-CN"
        :firstDayOfWeek.prop="1"
        :disabledDate.prop="weekendDisabled"
        aria-label="工作日历"
        @update:modelValue="onWorkdayUpdate"
      ></elf-calendar>
      <span slot="status" class="demo-state">周末不可选；点击标题中的年份或月份可快速切换层级。</span>
    </elf-playground>
`);

export { PageCalendarEx2 };
