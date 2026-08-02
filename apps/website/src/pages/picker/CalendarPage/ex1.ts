import { defineHtml, defineStyle, useRef } from "@elfui/core";

import { createDocsPicker, createDocsTranslator } from "../../docsLocale";
import demoStyles from "./demo.scss?inline";

const day = useRef("2026-07-07");
const t = createDocsTranslator({
  title: { zh: "受控日期", en: "Controlled date" },
  selected: { zh: "已选择", en: "Selected" },
  ariaLabel: { zh: "发布日期", en: "Publish date" },
});
const pick = createDocsPicker();

const onDayUpdate = (event: CustomEvent<string>): void => day.set(String(event.detail || ""));

const code = () =>
  pick(
    `<elf-calendar
  :modelValue.prop="day"
  aria-label="发布日期"
  @update:modelValue="onDayUpdate"
/>`,
    `<elf-calendar
  :modelValue.prop="day"
  aria-label="Publish date"
  @update:modelValue="onDayUpdate"
/>`,
  );
const script = `const day = useRef("2026-07-07");

const onDayUpdate = (event) => day.set(String(event.detail || ""));`;

defineStyle(demoStyles);

const PageCalendarEx1 = defineHtml(`
  <elf-playground :title=${t("title")} :code=${code()} :script=${script}>
    <div class="demo-calendar">
      <elf-calendar
        :modelValue.prop=${day}
        :ariaLabel.prop=${t("ariaLabel")}
        @update:modelValue=${onDayUpdate}
      ></elf-calendar>
    </div>
    <span slot="status" class="demo-state">${t("selected")} · ${day}</span>
  </elf-playground>
`);

export { PageCalendarEx1 };
