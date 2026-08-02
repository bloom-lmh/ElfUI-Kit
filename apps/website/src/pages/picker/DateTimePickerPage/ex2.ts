import { defineHtml, defineStyle, useRef } from "@elfui/core";

import { createDocsPicker, createDocsTranslator } from "../../docsLocale";
import demoStyles from "./demo.scss?inline";

const value = useRef<[string, string]>(["2026-07-29 09:00:00", "2026-07-31 18:00:00"]);
const t = createDocsTranslator({
  title: { zh: "范围与边界联动", en: "Range and linked boundaries" },
  dateLabel: { zh: "项目周期", en: "Project window" },
  timeLabel: { zh: "每日时段", en: "Daily hours" },
  current: { zh: "已选范围", en: "Selected range" },
});
const pick = createDocsPicker();

const onUpdate = (event: CustomEvent<[string, string]>): void => value.set(event.detail);
const code = () =>
  pick(
    `<elf-date-time-picker
  range
  :modelValue.prop="window"
  min="2026-07-28 08:00:00"
  max="2026-08-05 20:00:00"
  :defaultTime.prop="['09:00:00', '18:00:00']"
  label="项目周期"
  @update:modelValue="onUpdate"
/>`,
    `<elf-date-time-picker
  range
  :modelValue.prop="window"
  min="2026-07-28 08:00:00"
  max="2026-08-05 20:00:00"
  :defaultTime.prop="['09:00:00', '18:00:00']"
  label="Project window"
  @update:modelValue="onUpdate"
/>`,
  );
const script = `const window = useRef([
  "2026-07-29 09:00:00",
  "2026-07-31 18:00:00"
]);
const onUpdate = (event) => window.set(event.detail);`;

defineStyle(demoStyles);

const PageDateTimePickerEx2 = defineHtml(`
  <elf-playground :title=${t("title")} :code=${code()} :script=${script}>
    <div class="demo-field">
      <elf-date-time-picker
        range
        :modelValue.prop=${value}
        min="2026-07-28 08:00:00"
        max="2026-08-05 20:00:00"
        :defaultTime.prop=${["09:00:00", "18:00:00"]}
        :label=${t("dateLabel")}
        :timeLabel=${t("timeLabel")}
        @update:modelValue=${onUpdate}
      ></elf-date-time-picker>
    </div>
    <span slot="status" class="demo-state">${t("current")} · ${value.value.join(" → ")}</span>
  </elf-playground>
`);

export { PageDateTimePickerEx2 };
