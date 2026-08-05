import { defineHtml, defineStyle, useRef } from "@elfui/core";

import { createDocsPicker, createDocsTranslator } from "../../docsLocale";
import demoStyles from "./demo.scss?inline";

const startTime = useRef("09:00");
const endTime = useRef("17:30");
const t = createDocsTranslator({
  title: { zh: "场地租用", en: "Venue booking" },
  startMeta: { zh: "多功能厅 · 08:00–20:00", en: "Multi-purpose hall · 08:00–20:00" },
  endMeta: { zh: "同一场地 · 与开始时间联动", en: "Same venue · linked to the start" },
  start: { zh: "开始时间", en: "Start time" },
  end: { zh: "结束时间", en: "End time" },
  startHint: {
    zh: "不能晚于结束时间。",
    en: "Cannot be later than the end time.",
  },
  endHint: {
    zh: "不能早于开始时间。",
    en: "Cannot be earlier than the start time.",
  },
  window: { zh: "租用时段", en: "Booking window" },
});
const pick = createDocsPicker();

const updateStart = (event: CustomEvent<string>): void => startTime.set(event.detail);
const updateEnd = (event: CustomEvent<string>): void => endTime.set(event.detail);

const code = () =>
  pick(
    `<elf-time-select
  :modelValue.prop="startTime"
  :maxTime.prop="endTime"
  label="开始时间"
/>
<elf-time-select
  :modelValue.prop="endTime"
  :minTime.prop="startTime"
  label="结束时间"
/>`,
    `<elf-time-select
  :modelValue.prop="startTime"
  :maxTime.prop="endTime"
  label="Start time"
/>
<elf-time-select
  :modelValue.prop="endTime"
  :minTime.prop="startTime"
  label="End time"
/>`,
  );
const script = `const startTime = useRef("09:00");
const endTime = useRef("17:30");
const updateStart = (event) => startTime.set(event.detail);
const updateEnd = (event) => endTime.set(event.detail);`;

defineStyle(demoStyles);

const PageTimeSelectEx3 = defineHtml(`
  <elf-playground :title=${t("title")} :code=${code()} :script=${script}>
    <div class="demo-grid">
      <section class="demo-card">
        <strong>${t("start")}</strong>
        <span class="demo-meta">${t("startMeta")}</span>
        <elf-time-select
          :modelValue.prop=${startTime}
          :maxTime.prop=${endTime}
          start="08:00"
          end="20:00"
          step="00:30"
          :label=${t("start")}
          @update:modelValue=${updateStart}
        ></elf-time-select>
        <small>${t("startHint")}</small>
      </section>
      <section class="demo-card">
        <strong>${t("end")}</strong>
        <span class="demo-meta">${t("endMeta")}</span>
        <elf-time-select
          :modelValue.prop=${endTime}
          :minTime.prop=${startTime}
          start="08:00"
          end="20:00"
          step="00:30"
          :label=${t("end")}
          @update:modelValue=${updateEnd}
        ></elf-time-select>
        <small>${t("endHint")}</small>
      </section>
    </div>
    <span slot="status" class="demo-state" role="status" aria-live="polite">
      ${t("window")} · ${startTime} — ${endTime}
    </span>
  </elf-playground>
`);

export { PageTimeSelectEx3 };
