import { defineHtml, defineStyle, useRef } from "@elfui/core";

import { createDocsPicker, createDocsTranslator } from "../../docsLocale";
import demoStyles from "./demo.scss?inline";

const date = useRef("2026-06-17");
const t = createDocsTranslator({
  title: { zh: "基础日期", en: "Basic date" },
  label: { zh: "发布日期", en: "Release date" },
  current: { zh: "当前日期", en: "Current date" },
});
const pick = createDocsPicker();

const updateDate = (event: CustomEvent<string>): void => {
  date.set(String(event.detail || ""));
};

const code = () =>
  pick(
    `<elf-date-picker
  :modelValue.prop="date"
  label="发布日期"
  clearable
  @update:modelValue="updateDate"
/>`,
    `<elf-date-picker
  :modelValue.prop="date"
  label="Release date"
  clearable
  @update:modelValue="updateDate"
/>`,
  );

const script = `const date = useRef("2026-06-17");

const updateDate = (event) => {
  date.set(event.detail || "");
};`;

defineStyle(demoStyles);

const PageDatePickerEx1 = defineHtml(`
  <elf-playground :title=${t("title")} :code=${code()} :script=${script}>
    <div class="date-picker-demo-stage">
      <elf-date-picker
        class="date-picker-demo-control"
        :modelValue.prop=${date}
        :label=${t("label")}
        clearable
        @update:modelValue=${updateDate}
      ></elf-date-picker>
    </div>
    <span slot="status" class="demo-state" role="status" aria-live="polite">
      ${t("current")} · ${date}
    </span>
  </elf-playground>
`);

export { PageDatePickerEx1 };
