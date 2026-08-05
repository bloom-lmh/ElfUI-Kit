import { defineHtml, defineStyle, useRef } from "@elfui/core";

import { createDocsPicker, createDocsTranslator } from "../../docsLocale";
import demoStyles from "./demo.scss?inline";

const value = useRef<[string, string]>(["2026-07-29 09:00:00", "2026-07-31 18:00:00"]);
const t = createDocsTranslator({
  title: { zh: "迭代排期", en: "Iteration window" },
  meta: { zh: "迭代 2.6 · 按起止日期与时刻排期", en: "Iteration 2.6 · Start and end date-time" },
  dateLabel: { zh: "迭代日期", en: "Iteration dates" },
  timeLabel: { zh: "起止时刻", en: "Start & end time" },
  window: { zh: "迭代窗口", en: "Iteration window" },
  days: { zh: "共 {n} 天", en: "{n} days total" },
});
const pick = createDocsPicker();

const onUpdate = (event: CustomEvent<[string, string]>): void => value.set(event.detail);
const daysText = (): string => {
  const [start, end] = value.value;
  if (!start || !end) return "";
  const diff =
    (new Date(end.replace(" ", "T")).getTime() - new Date(start.replace(" ", "T")).getTime()) /
    86_400_000;
  return t("days").replace("{n}", String(Math.max(1, Math.ceil(diff))));
};
const code = () =>
  pick(
    `<elf-date-time-picker
  range
  :modelValue.prop="window"
  min="2026-07-28 08:00:00"
  max="2026-08-05 20:00:00"
  :defaultTime.prop="['09:00:00', '18:00:00']"
  label="迭代日期"
  timeLabel="起止时刻"
  @update:modelValue="onUpdate"
/>`,
    `<elf-date-time-picker
  range
  :modelValue.prop="window"
  min="2026-07-28 08:00:00"
  max="2026-08-05 20:00:00"
  :defaultTime.prop="['09:00:00', '18:00:00']"
  label="Iteration dates"
  timeLabel="Start & end time"
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
    <div class="dtp-card">
      <div class="dtp-card-head">
        <strong class="dtp-card-title">${t("title")}</strong>
        <span class="dtp-card-meta">${t("meta")}</span>
      </div>
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
    <span slot="status" class="demo-state" role="status" aria-live="polite">
      ${t("window")} · ${value.value.join(" → ")}（${daysText()}）
    </span>
  </elf-playground>
`);

export { PageDateTimePickerEx2 };
