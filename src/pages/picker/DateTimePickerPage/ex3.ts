import { defineHtml, defineStyle, useRef } from "@elfui/core";

import { createDocsPicker, createDocsTranslator } from "../../docsLocale";
import demoStyles from "./demo.scss?inline";

const value = useRef("");
const t = createDocsTranslator({
  title: { zh: "快捷项与禁用规则", en: "Shortcuts and disabled rules" },
  label: { zh: "会议时间", en: "Meeting time" },
  morning: { zh: "明早评审", en: "Tomorrow review" },
  afternoon: { zh: "周五发布", en: "Friday release" },
  current: { zh: "安排结果", en: "Scheduled value" },
  empty: { zh: "尚未安排", en: "Not scheduled" },
});
const pick = createDocsPicker();

const shortcuts = () => [
  { label: t("morning"), value: "2026-07-30 09:30:00" },
  { label: t("afternoon"), value: "2026-07-31 16:00:00" },
];
const disabledHours = (): number[] => [0, 1, 2, 3, 4, 5, 6, 22, 23];
const onUpdate = (event: CustomEvent<string>): void => value.set(event.detail);
const code = () =>
  pick(
    `<elf-date-time-picker
  :modelValue.prop="meetingAt"
  :shortcuts.prop="shortcuts"
  :disabledHours.prop="disabledHours"
  label="会议时间"
  @update:modelValue="onUpdate"
/>`,
    `<elf-date-time-picker
  :modelValue.prop="meetingAt"
  :shortcuts.prop="shortcuts"
  :disabledHours.prop="disabledHours"
  label="Meeting time"
  @update:modelValue="onUpdate"
/>`,
  );
const script = `const meetingAt = useRef("");
const shortcuts = [
  { label: "Tomorrow review", value: "2026-07-30 09:30:00" },
  { label: "Friday release", value: "2026-07-31 16:00:00" }
];
const disabledHours = () => [0, 1, 2, 3, 4, 5, 6, 22, 23];
const onUpdate = (event) => meetingAt.set(event.detail);`;

defineStyle(demoStyles);

const PageDateTimePickerEx3 = defineHtml(`
  <elf-playground :title=${t("title")} :code=${code()} :script=${script}>
    <div class="demo-field">
      <elf-date-time-picker
        :modelValue.prop=${value}
        :shortcuts.prop=${shortcuts()}
        :disabledHours.prop=${disabledHours}
        :label=${t("label")}
        @update:modelValue=${onUpdate}
      ></elf-date-time-picker>
    </div>
    <span slot="status" class="demo-state">${t("current")} · ${value.value || t("empty")}</span>
  </elf-playground>
`);

export { PageDateTimePickerEx3 };
