import { defineHtml, defineStyle, useRef } from "@elfui/core";

import { createDocsPicker, createDocsTranslator } from "../../docsLocale";
import demoStyles from "./demo.scss?inline";

const rangeValue = useRef<[string, string]>(["09:00", "18:00"]);
const t = createDocsTranslator({
  title: { zh: "范围、快捷时间与清空", en: "Range, shortcuts, and clear" },
  morning: { zh: "上午", en: "Morning" },
  workday: { zh: "工作日", en: "Workday" },
  evening: { zh: "晚上", en: "Evening" },
  start: { zh: "开始时间", en: "Start time" },
  end: { zh: "结束时间", en: "End time" },
  selected: { zh: "已选范围", en: "Selected range" },
  separator: { zh: "到", en: "to" },
});
const pick = createDocsPicker();

const shortcuts = () => [
  { label: t("morning"), value: "09:00", endValue: "12:00" },
  { label: t("workday"), value: "09:00", endValue: "18:00" },
  { label: t("evening"), value: "19:00", endValue: "22:00" },
];

const updateRange = (event: CustomEvent): void => {
  rangeValue.set((event.detail ?? ["", ""]) as [string, string]);
};

const rangeText = (): string =>
  `${rangeValue.value[0] || "--:--"} ${t("separator")} ${rangeValue.value[1] || "--:--"}`;

const code = () =>
  pick(
    `<elf-time-picker
  :modelValue.prop="rangeValue"
  is-range
  start-placeholder="开始时间"
  end-placeholder="结束时间"
  range-separator="到"
  :shortcuts.prop="shortcuts"
  @update:modelValue="updateRange"
/>`,
    `<elf-time-picker
  :modelValue.prop="rangeValue"
  is-range
  start-placeholder="Start time"
  end-placeholder="End time"
  range-separator="to"
  :shortcuts.prop="shortcuts"
  @update:modelValue="updateRange"
/>`,
  );

const script = () =>
  pick(
    `const rangeValue = useRef(["09:00", "18:00"]);

const shortcuts = [
  { label: "上午", value: "09:00", endValue: "12:00" },
  { label: "工作日", value: "09:00", endValue: "18:00" },
  { label: "晚上", value: "19:00", endValue: "22:00" }
];

const updateRange = (event) => {
  rangeValue.set(event.detail);
};`,
    `const rangeValue = useRef(["09:00", "18:00"]);

const shortcuts = [
  { label: "Morning", value: "09:00", endValue: "12:00" },
  { label: "Workday", value: "09:00", endValue: "18:00" },
  { label: "Evening", value: "19:00", endValue: "22:00" }
];

const updateRange = (event) => {
  rangeValue.set(event.detail);
};`,
  );

defineStyle(demoStyles);

const PageTimePickerEx2 = defineHtml(`
  <elf-playground :title=${t("title")} :code=${code()} :script=${script()}>
    <div class="time-picker-demo-stage">
      <elf-time-picker
        :modelValue.prop=${rangeValue}
        is-range
        :start-placeholder=${t("start")}
        :end-placeholder=${t("end")}
        :range-separator=${t("separator")}
        :shortcuts.prop=${shortcuts()}
        clearable
        @update:modelValue=${updateRange}
      ></elf-time-picker>
    </div>
    <span slot="status" class="demo-state" role="status" aria-live="polite">
      ${t("selected")} · ${rangeText()}
    </span>
  </elf-playground>
`);

export { PageTimePickerEx2 };
