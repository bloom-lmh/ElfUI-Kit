import { defineHtml, defineStyle, useRef } from "@elfui/core";

import { createDocsPicker, createDocsTranslator } from "../../docsLocale";
import demoStyles from "./demo.scss?inline";

const focusedDay = useRef("2026-07-03");
const t = createDocsTranslator({
  title: { zh: "键盘月历", en: "Keyboard calendar" },
  instructions: {
    zh: "方向键移动 · Home/End 定位周 · PageUp/PageDown 切月 · Enter/Space 选择",
    en: "Arrow keys move · Home/End locate a week · PageUp/PageDown change month · Enter/Space select",
  },
  ariaLabel: { zh: "排班日期", en: "Shift date" },
});
const pick = createDocsPicker();

const disableWeekend = (date: Date): boolean => date.getDay() === 0 || date.getDay() === 6;
const updateFocusedDay = (event: CustomEvent<string>): void =>
  focusedDay.set(String(event.detail || ""));

const code = () =>
  pick(
    `<elf-calendar
  :modelValue.prop="focusedDay"
  :disabledDate.prop="disableWeekend"
  aria-label="排班日期"
  @update:modelValue="updateFocusedDay"
/>`,
    `<elf-calendar
  :modelValue.prop="focusedDay"
  :disabledDate.prop="disableWeekend"
  aria-label="Shift date"
  @update:modelValue="updateFocusedDay"
/>`,
  );
const script = `const focusedDay = useRef("2026-07-03");
const disableWeekend = (date) => date.getDay() === 0 || date.getDay() === 6;

const updateFocusedDay = (event) => focusedDay.set(String(event.detail || ""));`;

defineStyle(demoStyles);

const PageCalendarEx4 = defineHtml(`
  <elf-playground :title=${t("title")} :code=${code()} :script=${script}>
    <span slot="status" class="demo-state">${t("instructions")}</span>
    <div class="demo-calendar is-compact">
      <elf-calendar
        :modelValue.prop=${focusedDay}
        :disabledDate.prop=${disableWeekend}
        :ariaLabel.prop=${t("ariaLabel")}
        @update:modelValue=${updateFocusedDay}
      ></elf-calendar>
    </div>
  </elf-playground>
`);

export { PageCalendarEx4 };
