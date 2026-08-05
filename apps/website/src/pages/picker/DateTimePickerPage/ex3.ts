import { defineHtml, defineStyle, useRef } from "@elfui/core";

import { createDocsPicker, createDocsTranslator } from "../../docsLocale";
import demoStyles from "./demo.scss?inline";

const value = useRef("");
const t = createDocsTranslator({
  title: { zh: "预约会议室", en: "Book a meeting room" },
  meta: { zh: "A-201 · 可容纳 6 人", en: "A-201 · Up to 6 people" },
  label: { zh: "开始时间", en: "Start time" },
  today: { zh: "今天下午", en: "This afternoon" },
  morning: { zh: "明早评审", en: "Tomorrow review" },
  release: { zh: "周五发布", en: "Friday release" },
  booked: { zh: "已预约", en: "Booked" },
  empty: { zh: "未预约", en: "Not booked" },
});
const pick = createDocsPicker();

const shortcuts = () => [
  { label: t("today"), value: "2026-07-29 16:00:00" },
  { label: t("morning"), value: "2026-07-30 09:30:00" },
  { label: t("release"), value: "2026-07-31 16:00:00" },
];
const disabledHours = (): number[] => [0, 1, 2, 3, 4, 5, 6, 22, 23];
const onUpdate = (event: CustomEvent<string>): void => value.set(event.detail);
const code = () =>
  pick(
    `<elf-date-time-picker
  :modelValue.prop="startAt"
  :shortcuts.prop="shortcuts"
  :disabledHours.prop="disabledHours"
  label="开始时间"
  @update:modelValue="onUpdate"
/>`,
    `<elf-date-time-picker
  :modelValue.prop="startAt"
  :shortcuts.prop="shortcuts"
  :disabledHours.prop="disabledHours"
  label="Start time"
  @update:modelValue="onUpdate"
/>`,
  );
const script = `const startAt = useRef("");
const shortcuts = [
  { label: "This afternoon", value: "2026-07-29 16:00:00" },
  { label: "Tomorrow review", value: "2026-07-30 09:30:00" },
  { label: "Friday release", value: "2026-07-31 16:00:00" }
];
const disabledHours = () => [0, 1, 2, 3, 4, 5, 6, 22, 23];
const onUpdate = (event) => startAt.set(event.detail);`;

defineStyle(demoStyles);

const PageDateTimePickerEx3 = defineHtml(`
  <elf-playground :title=${t("title")} :code=${code()} :script=${script}>
    <div class="dtp-card">
      <div class="dtp-card-head">
        <strong class="dtp-card-title">${t("title")}</strong>
        <span class="dtp-card-meta">${t("meta")}</span>
      </div>
      <elf-date-time-picker
        :modelValue.prop=${value}
        :shortcuts.prop=${shortcuts()}
        :disabledHours.prop=${disabledHours}
        :label=${t("label")}
        @update:modelValue=${onUpdate}
      ></elf-date-time-picker>
    </div>
    <span slot="status" class="demo-state" role="status" aria-live="polite">
      ${value.value ? `${t("booked")} · ${value.value}` : t("empty")}
    </span>
  </elf-playground>
`);

export { PageDateTimePickerEx3 };
