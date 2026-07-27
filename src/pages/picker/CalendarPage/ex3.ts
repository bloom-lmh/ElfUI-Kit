import { defineHtml, useRef } from "@elfui/core";

const selectedRange = useRef<[string, string]>(["2026-07-08", "2026-07-12"]);

const onRangeUpdate = (event: CustomEvent): void => {
  if (Array.isArray(event.detail) && event.detail.length === 2) selectedRange.set([String(event.detail[0]), String(event.detail[1])]);
};

const rangeLabel = (): string => selectedRange.value.join(" 至 ");

const rangeCode = `<elf-calendar range :modelValue.prop="selectedRange" @update:modelValue="onRangeUpdate" />`;

const rangeScript = `const selectedRange = useRef(["2026-07-08", "2026-07-12"]);

const onRangeUpdate = (event) => {
    if (Array.isArray(event.detail) && event.detail.length === 2)
        selectedRange.set([String(event.detail[0]), String(event.detail[1])]);
};`;

const PageCalendarEx3 = defineHtml(`
<elf-playground title="范围选择" :code=${rangeCode} :script=${rangeScript}>
      <elf-calendar range :modelValue.prop="selectedRange" @update:modelValue="onRangeUpdate"></elf-calendar>
      <span slot="status" class="demo-state">范围：${rangeLabel()}</span>
    </elf-playground>
`);

export { PageCalendarEx3 };
