import { defineHtml, defineStyle, useRef } from "@elfui/core";

import { createDocsPicker, createDocsTranslator } from "../../docsLocale";
import demoStyles from "./demo.scss?inline";

const actionValue = useRef("2026-06-12");
const t = createDocsTranslator({
  title: { zh: "动作栏确认", en: "Action-bar confirmation" },
  header: { zh: "带确认的日期选择", en: "Date selection with confirmation" },
  committed: { zh: "已提交", en: "Committed" },
});
const pick = createDocsPicker();

const updateAction = (event: CustomEvent<string>): void => {
  actionValue.set(String(event.detail || ""));
};

const code = () =>
  pick(
    `<elf-date-picker
  :modelValue.prop="actionValue"
  actions
  clearable
  show-header
  header="带确认的日期选择"
  @update:modelValue="updateAction"
/>`,
    `<elf-date-picker
  :modelValue.prop="actionValue"
  actions
  clearable
  show-header
  header="Date selection with confirmation"
  @update:modelValue="updateAction"
/>`,
  );

const script = `const actionValue = useRef("2026-06-12");

const updateAction = (event) => {
  actionValue.set(event.detail || "");
};`;

defineStyle(demoStyles);

const PageDatePickerEx5 = defineHtml(`
  <elf-playground :title=${t("title")} :code=${code()} :script=${script}>
    <div class="date-picker-demo-stage">
      <elf-date-picker
        class="date-picker-demo-control"
        :modelValue.prop=${actionValue}
        actions
        clearable
        show-header
        :header=${t("header")}
        @update:modelValue=${updateAction}
      ></elf-date-picker>
    </div>
    <span slot="status" class="demo-state" role="status" aria-live="polite">
      ${t("committed")} · ${actionValue}
    </span>
  </elf-playground>
`);

export { PageDatePickerEx5 };
