import { defineHtml, defineStyle, useRef } from "@elfui/core";

import { createDocsPicker, createDocsTranslator } from "../../docsLocale";
import demoStyles from "./demo.scss?inline";

const selectedRange = useRef<[string, string]>(["2026-07-08", "2026-07-12"]);
const t = createDocsTranslator({
  title: { zh: "日期范围", en: "Date range" },
  range: { zh: "范围", en: "Range" },
  ariaLabel: { zh: "项目周期", en: "Project period" },
});
const pick = createDocsPicker();

const onRangeUpdate = (event: CustomEvent<[string, string]>): void => {
  if (!Array.isArray(event.detail) || event.detail.length !== 2) return;
  selectedRange.set([String(event.detail[0]), String(event.detail[1])]);
};
const rangeLabel = (): string => selectedRange.value.join(" → ");

const code = () =>
  pick(
    `<elf-calendar
  range
  :modelValue.prop="selectedRange"
  aria-label="项目周期"
  @update:modelValue="onRangeUpdate"
/>`,
    `<elf-calendar
  range
  :modelValue.prop="selectedRange"
  aria-label="Project period"
  @update:modelValue="onRangeUpdate"
/>`,
  );
const script = `const selectedRange = useRef(["2026-07-08", "2026-07-12"]);

const onRangeUpdate = (event) => {
  if (Array.isArray(event.detail) && event.detail.length === 2) {
    selectedRange.set([String(event.detail[0]), String(event.detail[1])]);
  }
};`;

defineStyle(demoStyles);

const PageCalendarEx3 = defineHtml(`
  <elf-playground :title=${t("title")} :code=${code()} :script=${script}>
    <div class="demo-calendar">
      <elf-calendar
        range
        :modelValue.prop=${selectedRange}
        :ariaLabel.prop=${t("ariaLabel")}
        @update:modelValue=${onRangeUpdate}
      ></elf-calendar>
    </div>
    <span slot="status" class="demo-state">${t("range")} · ${rangeLabel()}</span>
  </elf-playground>
`);

export { PageCalendarEx3 };
