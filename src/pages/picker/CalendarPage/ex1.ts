import { defineHtml, useRef } from "@elfui/core";

const day = useRef("2026-07-07");

const onDayUpdate = (event: CustomEvent): void => day.set(String(event.detail || ""));

const basicCode = `<elf-calendar :modelValue.prop="day" @update:modelValue="onDayUpdate" />`;

const basicScript = `const day = useRef("2026-07-07");

const onDayUpdate = (event) => day.set(String(event.detail || ""));`;

const PageCalendarEx1 = defineHtml(`
<elf-playground title="受控日期" :code=${basicCode} :script=${basicScript}>
      <elf-calendar :modelValue.prop="day" @update:modelValue="onDayUpdate"></elf-calendar>
      <span slot="status" class="demo-state">选中：{{ day.value }}</span>
    </elf-playground>
`);

export { PageCalendarEx1 };
