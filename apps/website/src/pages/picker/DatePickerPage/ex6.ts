import { defineHtml, defineStyle, useRef } from "@elfui/core";

import { createDocsPicker, createDocsTranslator } from "../../docsLocale";
import demoStyles from "./demo.scss?inline";

const publishDate = useRef("2026/06/17");
const t = createDocsTranslator({
  title: {
    zh: "格式化、禁用日期与键盘",
    en: "Formatting, disabled dates, and keyboard",
  },
  initial: {
    zh: "工作日可选 · 值格式 YYYY/MM/DD",
    en: "Weekdays enabled · value format YYYY/MM/DD",
  },
  selected: { zh: "已选择", en: "Selected" },
  label: { zh: "工作日发布日期", en: "Weekday release date" },
  workingDays: { zh: "六月工作日", en: "June weekdays" },
  note: {
    zh: "界面显示中文日期，业务值保持斜杠格式；周末与范围外日期不可选。",
    en: "The display and business value use separate formats; weekends and out-of-range dates are disabled.",
  },
  keyboard: {
    zh: "按向下方向键打开并进入月历，方向键移动，Escape 关闭。",
    en: "Press Arrow Down to open the calendar, use arrow keys to move, and Escape to close.",
  },
});
const pick = createDocsPicker();
const status = useRef(t("initial"));
const popperStyle = { width: "360px" };

const disableWeekend = (date: Date): boolean => date.getDay() === 0 || date.getDay() === 6;

const onUpdate = (event: CustomEvent<string>): void => {
  publishDate.set(String(event.detail || ""));
  status.set(`${t("selected")} · ${event.detail || ""}`);
};

const code = () =>
  pick(
    `<elf-date-picker
  :modelValue.prop="publishDate"
  label="工作日发布日期"
  format="YYYY年MM月DD日"
  value-format="YYYY/MM/DD"
  min="2026-06-01"
  max="2026-06-30"
  :disabled-date.prop="disableWeekend"
  teleported
  popper-class="release-calendar"
  :popper-style.prop="{ width: '360px' }"
  @update:modelValue="onUpdate"
/>`,
    `<elf-date-picker
  :modelValue.prop="publishDate"
  label="Weekday release date"
  format="YYYY-MM-DD"
  value-format="YYYY/MM/DD"
  min="2026-06-01"
  max="2026-06-30"
  :disabled-date.prop="disableWeekend"
  teleported
  popper-class="release-calendar"
  :popper-style.prop="{ width: '360px' }"
  @update:modelValue="onUpdate"
/>`,
  );

const script = () =>
  pick(
    `const publishDate = useRef("2026/06/17");
const status = useRef("工作日可选 · 值格式 YYYY/MM/DD");

const disableWeekend = (date) => date.getDay() === 0 || date.getDay() === 6;

const onUpdate = (event) => {
  publishDate.set(event.detail || "");
  status.set(\`已选择 · \${event.detail || ""}\`);
};`,
    `const publishDate = useRef("2026/06/17");
const status = useRef("Weekdays enabled · value format YYYY/MM/DD");

const disableWeekend = (date) => date.getDay() === 0 || date.getDay() === 6;

const onUpdate = (event) => {
  publishDate.set(event.detail || "");
  status.set(\`Selected · \${event.detail || ""}\`);
};`,
  );

defineStyle(demoStyles);

const PageDatePickerEx6 = defineHtml(`
  <elf-playground :title=${t("title")} :code=${code()} :script=${script()}>
    <section class="date-picker-demo-stage">
      <div class="date-picker-demo-boundary">
        <elf-date-picker
          :modelValue.prop=${publishDate}
          :format=${pick("YYYY年MM月DD日", "YYYY-MM-DD")}
          value-format="YYYY/MM/DD"
          min="2026-06-01"
          max="2026-06-30"
          :disabled-date.prop=${disableWeekend}
          teleported
          popper-class="release-calendar"
          :popper-style.prop=${popperStyle}
          :label=${t("label")}
          clearable
          @update:modelValue=${onUpdate}
        ></elf-date-picker>
        <div class="date-picker-demo-notes">
          <strong>${t("workingDays")}</strong>
          <span>${t("note")}</span>
          <span><kbd>↓</kbd> ${t("keyboard")}</span>
        </div>
      </div>
    </section>
    <span slot="status" class="demo-state" role="status" aria-live="polite">
      ${status}
    </span>
  </elf-playground>
`);

export { PageDatePickerEx6 };
