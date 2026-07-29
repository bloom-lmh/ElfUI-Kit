import { defineHtml, defineStyle, useRef } from "@elfui/core";

import { createDocsPicker, createDocsTranslator } from "../../docsLocale";
import demoStyles from "./demo.scss?inline";

const value = useRef("");
const t = createDocsTranslator({
  title: { zh: "固定步长", en: "Fixed steps" },
  label: { zh: "预约时间", en: "Appointment time" },
  placeholder: { zh: "选择预约时间", en: "Choose a time" },
  current: { zh: "当前时间", en: "Current time" },
  empty: { zh: "未选择", en: "Not selected" },
});
const pick = createDocsPicker();

const onUpdate = (event: CustomEvent<string>): void =>
  value.set(event.detail);

const code = () => pick(
  `<elf-time-select
  :modelValue.prop="time"
  start="08:30"
  end="18:30"
  step="00:15"
  label="预约时间"
  placeholder="选择预约时间"
  @update:modelValue="onUpdate"
/>`,
  `<elf-time-select
  :modelValue.prop="time"
  start="08:30"
  end="18:30"
  step="00:15"
  label="Appointment time"
  placeholder="Choose a time"
  @update:modelValue="onUpdate"
/>`,
);
const script = `const time = useRef("");
const onUpdate = (event) => time.set(event.detail);`;

defineStyle(demoStyles);

const PageTimeSelectEx1 = defineHtml(`
  <elf-playground :title=${t("title")} :code=${code()} :script=${script}>
    <div class="demo-field">
      <elf-time-select
        :modelValue.prop=${value}
        start="08:30"
        end="18:30"
        step="00:15"
        :label=${t("label")}
        :placeholder=${t("placeholder")}
        clearable
        @update:modelValue=${onUpdate}
      ></elf-time-select>
    </div>
    <span slot="status" class="demo-state">${t("current")} · ${value.value || t("empty")}</span>
  </elf-playground>
`);

export { PageTimeSelectEx1 };
