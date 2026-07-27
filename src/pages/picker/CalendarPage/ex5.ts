import { defineHtml, useRef } from "@elfui/core";
import type { CalendarDateCell } from "../../../components/Picker/Calendar";

const selected = useRef("2026-07-15");
const releaseDays = new Set(["2026-07-08", "2026-07-15", "2026-07-24"]);

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

const code = `<elf-calendar
  :model-value.prop="selected"
  :render-date-cell.prop="renderDateCell"
  @update:modelValue="onUpdate"
/>`;
const script = `const releaseDays = new Set(["2026-07-08", "2026-07-15", "2026-07-24"]);

const renderDateCell = (cell) => {
  const content = document.createElement("span");
  content.textContent = String(cell.label);
  if (releaseDays.has(cell.iso)) {
    const marker = document.createElement("i");
    marker.className = "calendar-release-marker";
    content.appendChild(marker);
  }
  return content;
};`;

const PageCalendarEx5 = defineHtml(`
  <elf-playground title="自定义日期内容" :code=${code} :script=${script}>
    <span slot="status" class="demo-state">已选择：${selected}</span>
    <div style="width:100%;max-width:420px">
      <elf-calendar
        :modelValue.prop=${selected}
        :renderDateCell.prop=${renderDateCell}
        @update:modelValue=${onUpdate}
      ></elf-calendar>
    </div>
  </elf-playground>
`);

export { PageCalendarEx5 };
