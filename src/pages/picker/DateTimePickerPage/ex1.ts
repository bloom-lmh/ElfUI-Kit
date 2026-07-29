import { defineHtml, defineStyle, useRef } from "@elfui/core";

import { createDocsPicker, createDocsTranslator } from "../../docsLocale";
import demoStyles from "./demo.scss?inline";

const value = useRef("2026-07-29 09:30:00");
const t = createDocsTranslator({
  title: { zh: "基础日期时间", en: "Basic date and time" },
  dateLabel: { zh: "发布日期", en: "Publish date" },
  timeLabel: { zh: "发布时间", en: "Publish time" },
  current: { zh: "当前值", en: "Current value" },
});
const pick = createDocsPicker();

const onUpdate = (event: CustomEvent<string>): void => value.set(event.detail);
const code = () =>
  pick(
    `<elf-date-time-picker
  :modelValue.prop="publishedAt"
  label="发布日期"
  timeLabel="发布时间"
  format="YYYY/MM/DD HH:mm"
  valueFormat="YYYY-MM-DD HH:mm:ss"
  @update:modelValue="onUpdate"
/>`,
    `<elf-date-time-picker
  :modelValue.prop="publishedAt"
  label="Publish date"
  timeLabel="Publish time"
  format="YYYY/MM/DD HH:mm"
  valueFormat="YYYY-MM-DD HH:mm:ss"
  @update:modelValue="onUpdate"
/>`,
  );
const script = `const publishedAt = useRef("2026-07-29 09:30:00");
const onUpdate = (event) => publishedAt.set(event.detail);`;

defineStyle(demoStyles);

const PageDateTimePickerEx1 = defineHtml(`
  <elf-playground :title=${t("title")} :code=${code()} :script=${script}>
    <div class="demo-field">
      <elf-date-time-picker
        :modelValue.prop=${value}
        :label=${t("dateLabel")}
        :timeLabel=${t("timeLabel")}
        format="YYYY/MM/DD HH:mm"
        valueFormat="YYYY-MM-DD HH:mm:ss"
        clearable
        @update:modelValue=${onUpdate}
      ></elf-date-time-picker>
    </div>
    <span slot="status" class="demo-state">${t("current")} · ${value}</span>
  </elf-playground>
`);

export { PageDateTimePickerEx1 };
