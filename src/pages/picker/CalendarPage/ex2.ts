import { defineHtml, defineStyle, useRef } from "@elfui/core";

import { createDocsPicker, createDocsTranslator } from "../../docsLocale";
import demoStyles from "./demo.scss?inline";

const workday = useRef("2026-07-07");
const config = { date: { firstDayOfWeek: 0 } };
const t = createDocsTranslator({
  title: { zh: "本地化与全局周起始", en: "Locale and global week start" },
  status: {
    zh: "ConfigProvider 设置周日为首日 · 周末禁用",
    en: "ConfigProvider starts weeks on Sunday · Weekends disabled",
  },
  ariaLabel: { zh: "工作日历", en: "Work calendar" },
});
const pick = createDocsPicker();

const weekendDisabled = (date: Date): boolean =>
  date.getDay() === 0 || date.getDay() === 6;
const onWorkdayUpdate = (event: CustomEvent<string>): void =>
  workday.set(String(event.detail || ""));

const code = () =>
  pick(
    `<elf-config-provider :config.prop="config">
  <elf-calendar
    :modelValue.prop="workday"
    :disabledDate.prop="weekendDisabled"
    show-week-number
    aria-label="工作日历"
    @update:modelValue="onWorkdayUpdate"
  />
</elf-config-provider>`,
    `<elf-config-provider :config.prop="config">
  <elf-calendar
    :modelValue.prop="workday"
    :disabledDate.prop="weekendDisabled"
    show-week-number
    aria-label="Work calendar"
    @update:modelValue="onWorkdayUpdate"
  />
</elf-config-provider>`,
  );
const script = `const workday = useRef("2026-07-07");
const config = { date: { firstDayOfWeek: 0 } };
const weekendDisabled = (date) => date.getDay() === 0 || date.getDay() === 6;

const onWorkdayUpdate = (event) => workday.set(String(event.detail || ""));`;

defineStyle(demoStyles);

const PageCalendarEx2 = defineHtml(`
  <elf-playground :title=${t("title")} :code=${code()} :script=${script}>
    <elf-config-provider :config.prop=${config}>
      <div class="demo-calendar">
        <elf-calendar
          :modelValue.prop=${workday}
          :disabledDate.prop=${weekendDisabled}
          :showWeekNumber.prop=${true}
          :ariaLabel.prop=${t("ariaLabel")}
          @update:modelValue=${onWorkdayUpdate}
        ></elf-calendar>
      </div>
    </elf-config-provider>
    <span slot="status" class="demo-state">${t("status")}</span>
  </elf-playground>
`);

export { PageCalendarEx2 };
