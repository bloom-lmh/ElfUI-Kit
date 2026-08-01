import { defineHtml, defineStyle, useRef } from "@elfui/core";

import { createDocsTranslator } from "../../docsLocale";
import demoStyles from "./demo.scss?inline";

const dates = useRef<string[]>(["2026-06-10", "2026-06-14"]);
const t = createDocsTranslator({
  title: { zh: "多日期选择", en: "Multiple dates" },
  selected: { zh: "已选日期", en: "Selected dates" },
  empty: { zh: "暂无", en: "None" },
});

const updateDates = (event: CustomEvent<unknown>): void => {
  dates.set(Array.isArray(event.detail) ? event.detail.map(String) : []);
};

const code = `<elf-date-picker
  multiple
  clearable
  :modelValue.prop="dates"
  @update:modelValue="updateDates"
/>`;

const script = `const dates = useRef(["2026-06-10", "2026-06-14"]);

const updateDates = (event) => {
  dates.set(Array.isArray(event.detail) ? event.detail : []);
};`;

const selectedDates = (): string => dates.value.join(", ") || t("empty");

defineStyle(demoStyles);

const PageDatePickerEx4 = defineHtml(`
  <elf-playground :title=${t("title")} :code=${code} :script=${script}>
    <div class="date-picker-demo-stage">
      <elf-date-picker
        class="date-picker-demo-control"
        multiple
        clearable
        :modelValue.prop=${dates}
        @update:modelValue=${updateDates}
      ></elf-date-picker>
    </div>
    <span slot="status" class="demo-state" role="status" aria-live="polite">
      ${t("selected")} · ${selectedDates()}
    </span>
  </elf-playground>
`);

export { PageDatePickerEx4 };
