import { defineHtml, defineStyle, useRef } from "@elfui/core";

import type { CalendarDateCell } from "@elfui/kit-src/components/Picker/Calendar";
import { createDocsPicker, createDocsTranslator } from "../../docsLocale";
import demoStyles from "./demo.scss?inline";

const selected = useRef("2026-07-15");
const releaseDays = new Set(["2026-07-08", "2026-07-15", "2026-07-24"]);
const t = createDocsTranslator({
  title: { zh: "自定义日期内容", en: "Custom date content" },
  selected: { zh: "已选择", en: "Selected" },
  ariaLabel: { zh: "发布日历", en: "Release calendar" },
});
const pick = createDocsPicker();

const renderDateCell = (cell: CalendarDateCell): HTMLElement => {
  const content = document.createElement("span");
  content.className = "calendar-date-content";
  content.textContent = String(cell.label);
  if (releaseDays.has(cell.iso)) {
    const marker = document.createElement("i");
    marker.className = "calendar-release-marker";
    marker.setAttribute("aria-hidden", "true");
    content.appendChild(marker);
  }
  return content;
};
const onUpdate = (event: CustomEvent<string>): void => selected.set(String(event.detail || ""));

const code = () =>
  pick(
    `<elf-calendar
  :modelValue.prop="selected"
  :renderDateCell.prop="renderDateCell"
  aria-label="发布日历"
  @update:modelValue="onUpdate"
/>`,
    `<elf-calendar
  :modelValue.prop="selected"
  :renderDateCell.prop="renderDateCell"
  aria-label="Release calendar"
  @update:modelValue="onUpdate"
/>`,
  );
const script = `const releaseDays = new Set(["2026-07-08", "2026-07-15", "2026-07-24"]);

const renderDateCell = (cell) => {
  const content = document.createElement("span");
  content.textContent = String(cell.label);
  if (releaseDays.has(cell.iso)) {
    const marker = document.createElement("i");
    marker.className = "calendar-release-marker";
    marker.setAttribute("aria-hidden", "true");
    content.appendChild(marker);
  }
  return content;
};`;

defineStyle(demoStyles);

const PageCalendarEx5 = defineHtml(`
  <elf-playground :title=${t("title")} :code=${code()} :script=${script}>
    <span slot="status" class="demo-state">${t("selected")} · ${selected}</span>
    <div class="demo-calendar">
      <elf-calendar
        :modelValue.prop=${selected}
        :renderDateCell.prop=${renderDateCell}
        :ariaLabel.prop=${t("ariaLabel")}
        @update:modelValue=${onUpdate}
      ></elf-calendar>
    </div>
  </elf-playground>
`);

export { PageCalendarEx5 };
