import { defineHtml, defineStyle, useRef } from "@elfui/core";

import { createDocsPicker, createDocsTranslator } from "../../docsLocale";
import demoStyles from "./demo.scss?inline";

const time = useRef("09:30");
const t = createDocsTranslator({
  title: { zh: "单个时间", en: "Single time" },
  label: { zh: "开始时间", en: "Start time" },
  current: { zh: "当前值", en: "Current value" },
  empty: { zh: "空值", en: "Empty" },
});
const pick = createDocsPicker();

const updateTime = (event: CustomEvent): void => {
  time.set(String(event.detail));
};

const code = () =>
  pick(
    `<elf-time-picker
  :modelValue.prop="time"
  label="开始时间"
  :step="300"
  clearable
  @update:modelValue="updateTime"
/>`,
    `<elf-time-picker
  :modelValue.prop="time"
  label="Start time"
  :step="300"
  clearable
  @update:modelValue="updateTime"
/>`,
  );

const script = `const time = useRef("09:30");

const updateTime = (event) => {
  time.set(event.detail);
};`;

defineStyle(demoStyles);

const PageTimePickerEx1 = defineHtml(`
  <elf-playground :title=${t("title")} :code=${code()} :script=${script}>
    <div class="time-picker-demo-stage time-picker-demo-stage--compact">
      <elf-time-picker
        :modelValue.prop=${time}
        :label=${t("label")}
        :step=${300}
        clearable
        @update:modelValue=${updateTime}
      ></elf-time-picker>
    </div>
    <span slot="status" class="demo-state" role="status" aria-live="polite">
      ${t("current")} · ${time.value || t("empty")}
    </span>
  </elf-playground>
`);

export { PageTimePickerEx1 };
