import { defineHtml, defineStyle, useRef } from "@elfui/core";

import { createDocsPicker, createDocsTranslator } from "../../docsLocale";
import demoStyles from "./demo.scss?inline";

const value = useRef("2026-07-29 09:30:00");
const t = createDocsTranslator({
  title: { zh: "定时发布", en: "Scheduled publish" },
  meta: { zh: "发布内容 · 版本说明 v1.4", en: "Content · Release notes v1.4" },
  dateLabel: { zh: "定时发布时间", en: "Publish at" },
  statusLabel: { zh: "发布安排", en: "Publish scheduled" },
  empty: { zh: "尚未设置发布时间", en: "No publish time set" },
});
const pick = createDocsPicker();

const onUpdate = (event: CustomEvent<string>): void => value.set(event.detail);
const code = () =>
  pick(
    `<elf-date-time-picker
  :modelValue.prop="publishAt"
  label="定时发布时间"
  format="YYYY/MM/DD HH:mm"
  valueFormat="YYYY-MM-DD HH:mm:ss"
  clearable
  @update:modelValue="onUpdate"
/>`,
    `<elf-date-time-picker
  :modelValue.prop="publishAt"
  label="Publish at"
  format="YYYY/MM/DD HH:mm"
  valueFormat="YYYY-MM-DD HH:mm:ss"
  clearable
  @update:modelValue="onUpdate"
/>`,
  );
const script = `const publishAt = useRef("2026-07-29 09:30:00");
const onUpdate = (event) => publishAt.set(event.detail);`;

defineStyle(demoStyles);

const PageDateTimePickerEx1 = defineHtml(`
  <elf-playground :title=${t("title")} :code=${code()} :script=${script}>
    <div class="dtp-card">
      <div class="dtp-card-head">
        <strong class="dtp-card-title">${t("title")}</strong>
        <span class="dtp-card-meta">${t("meta")}</span>
      </div>
      <elf-date-time-picker
        :modelValue.prop=${value}
        :label=${t("dateLabel")}
        format="YYYY/MM/DD HH:mm"
        valueFormat="YYYY-MM-DD HH:mm:ss"
        clearable
        @update:modelValue=${onUpdate}
      ></elf-date-time-picker>
    </div>
    <span slot="status" class="demo-state" role="status" aria-live="polite">
      ${value.value ? `${t("statusLabel")} · ${value.value}` : t("empty")}
    </span>
  </elf-playground>
`);

export { PageDateTimePickerEx1 };
