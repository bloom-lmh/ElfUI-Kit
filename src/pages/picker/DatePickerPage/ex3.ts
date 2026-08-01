import { defineHtml, defineStyle, useRef } from "@elfui/core";

import { createDocsPicker, createDocsTranslator } from "../../docsLocale";
import demoStyles from "./demo.scss?inline";

const month = useRef("2026-06");
const t = createDocsTranslator({
  title: { zh: "月份与头部", en: "Month and header" },
  header: { zh: "选择账期", en: "Select billing month" },
  current: { zh: "当前账期", en: "Current billing month" },
});
const pick = createDocsPicker();

const updateMonth = (event: CustomEvent<string>): void => {
  month.set(String(event.detail || ""));
};

const code = () =>
  pick(
    `<elf-date-picker
  :modelValue.prop="month"
  type="month"
  show-header
  header="选择账期"
  @update:modelValue="updateMonth"
/>`,
    `<elf-date-picker
  :modelValue.prop="month"
  type="month"
  show-header
  header="Select billing month"
  @update:modelValue="updateMonth"
/>`,
  );

const script = `const month = useRef("2026-06");

const updateMonth = (event) => {
  month.set(event.detail || "");
};`;

defineStyle(demoStyles);

const PageDatePickerEx3 = defineHtml(`
  <elf-playground :title=${t("title")} :code=${code()} :script=${script}>
    <div class="date-picker-demo-stage">
      <elf-date-picker
        class="date-picker-demo-control"
        :modelValue.prop=${month}
        type="month"
        show-header
        :header=${t("header")}
        @update:modelValue=${updateMonth}
      ></elf-date-picker>
    </div>
    <span slot="status" class="demo-state" role="status" aria-live="polite">
      ${t("current")} · ${month}
    </span>
  </elf-playground>
`);

export { PageDatePickerEx3 };
