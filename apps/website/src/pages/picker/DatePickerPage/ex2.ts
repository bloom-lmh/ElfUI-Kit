import { defineHtml, defineStyle, useRef } from "@elfui/core";

import { createDocsPicker, createDocsTranslator } from "../../docsLocale";
import demoStyles from "./demo.scss?inline";

const start = useRef("2026-06-01");
const end = useRef("2026-06-30");
const t = createDocsTranslator({
  title: { zh: "范围与快捷项", en: "Range and shortcuts" },
  today: { zh: "今天", en: "Today" },
  thisMonth: { zh: "本月", en: "This month" },
  nextMonday: { zh: "下周一", en: "Next Monday" },
  start: { zh: "开始日期", en: "Start date" },
  end: { zh: "结束日期", en: "End date" },
  to: { zh: "至", en: "to" },
  selected: { zh: "已选范围", en: "Selected range" },
});
const pick = createDocsPicker();

const shortcutItems = () => [
  { label: t("today"), value: "2026-06-17" },
  { label: t("thisMonth"), value: "2026-06-01", endValue: "2026-06-30" },
  { label: t("nextMonday"), value: "2026-06-22" },
];

const updateStart = (event: CustomEvent<string>): void => start.set(String(event.detail || ""));
const updateEnd = (event: CustomEvent<string>): void => end.set(String(event.detail || ""));

const code = () =>
  pick(
    `<elf-date-picker
  :modelValue.prop="start"
  :endValue.prop="end"
  range
  clearable
  start-placeholder="开始日期"
  end-placeholder="结束日期"
  :shortcuts.prop="shortcuts"
  @update:modelValue="updateStart"
  @update:endValue="updateEnd"
/>`,
    `<elf-date-picker
  :modelValue.prop="start"
  :endValue.prop="end"
  range
  clearable
  start-placeholder="Start date"
  end-placeholder="End date"
  :shortcuts.prop="shortcuts"
  @update:modelValue="updateStart"
  @update:endValue="updateEnd"
/>`,
  );

const script = () =>
  pick(
    `const start = useRef("2026-06-01");
const end = useRef("2026-06-30");
const shortcuts = [
  { label: "今天", value: "2026-06-17" },
  { label: "本月", value: "2026-06-01", endValue: "2026-06-30" },
  { label: "下周一", value: "2026-06-22" },
];`,
    `const start = useRef("2026-06-01");
const end = useRef("2026-06-30");
const shortcuts = [
  { label: "Today", value: "2026-06-17" },
  { label: "This month", value: "2026-06-01", endValue: "2026-06-30" },
  { label: "Next Monday", value: "2026-06-22" },
];`,
  );

defineStyle(demoStyles);

const PageDatePickerEx2 = defineHtml(`
  <elf-playground :title=${t("title")} :code=${code()} :script=${script()}>
    <div class="date-picker-demo-stage">
      <elf-date-picker
        class="date-picker-demo-control date-picker-demo-control--range"
        :modelValue.prop=${start}
        :endValue.prop=${end}
        range
        clearable
        :startPlaceholder=${t("start")}
        :endPlaceholder=${t("end")}
        :rangeSeparator=${t("to")}
        :shortcuts.prop=${shortcutItems()}
        @update:modelValue=${updateStart}
        @update:endValue=${updateEnd}
      ></elf-date-picker>
    </div>
    <span slot="status" class="demo-state" role="status" aria-live="polite">
      ${t("selected")} · ${start} ${t("to")} ${end}
    </span>
  </elf-playground>
`);

export { PageDatePickerEx2 };
