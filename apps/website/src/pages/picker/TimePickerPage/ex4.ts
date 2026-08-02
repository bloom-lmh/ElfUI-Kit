import { defineHtml, defineStyle, useRef } from "@elfui/core";

import { createDocsPicker, createDocsTranslator } from "../../docsLocale";
import demoStyles from "./demo.scss?inline";

const preciseTime = useRef("09-30-15");
const t = createDocsTranslator({
  title: { zh: "格式、秒级步进与禁用项", en: "Formats, second steps, and disabled values" },
  label: { zh: "精确时间", en: "Precise time" },
  output: { zh: "输出值", en: "Output value" },
});
const pick = createDocsPicker();

const disabledHours = (): number[] => [0, 1, 2, 3, 4, 5, 22, 23];
const disabledMinutes = (hour: number): number[] => (hour === 9 ? [0, 15, 45] : []);
const disabledSeconds = (_hour: number, minute: number): number[] =>
  minute === 30 ? [0, 30, 45] : [];

const updatePreciseTime = (event: CustomEvent<string>): void => {
  preciseTime.set(String(event.detail || ""));
};

const code = () =>
  pick(
    `<elf-time-picker
  :modelValue.prop="preciseTime"
  label="精确时间"
  format="HH:mm:ss"
  value-format="HH-mm-ss"
  :step="15"
  :disabledHours.prop="disabledHours"
  :disabledMinutes.prop="disabledMinutes"
  :disabledSeconds.prop="disabledSeconds"
  placement="bottom-start"
  popper-class="precision-clock"
  @update:modelValue="updatePreciseTime"
/>`,
    `<elf-time-picker
  :modelValue.prop="preciseTime"
  label="Precise time"
  format="HH:mm:ss"
  value-format="HH-mm-ss"
  :step="15"
  :disabledHours.prop="disabledHours"
  :disabledMinutes.prop="disabledMinutes"
  :disabledSeconds.prop="disabledSeconds"
  placement="bottom-start"
  popper-class="precision-clock"
  @update:modelValue="updatePreciseTime"
/>`,
  );

const script = `const preciseTime = useRef("09-30-15");

const disabledHours = () => [0, 1, 2, 3, 4, 5, 22, 23];
const disabledMinutes = (hour) => hour === 9 ? [0, 15, 45] : [];
const disabledSeconds = (_hour, minute) => minute === 30 ? [0, 30, 45] : [];

const updatePreciseTime = (event) => {
  preciseTime.set(event.detail);
};`;

defineStyle(demoStyles);

const PageTimePickerEx4 = defineHtml(`
  <elf-playground :title=${t("title")} :code=${code()} :script=${script}>
    <div class="time-picker-demo-stage time-picker-demo-stage--compact">
      <elf-time-picker
        :modelValue.prop=${preciseTime}
        :label=${t("label")}
        format="HH:mm:ss"
        value-format="HH-mm-ss"
        :step=${15}
        :disabledHours.prop=${disabledHours}
        :disabledMinutes.prop=${disabledMinutes}
        :disabledSeconds.prop=${disabledSeconds}
        placement="bottom-start"
        popper-class="precision-clock"
        @update:modelValue=${updatePreciseTime}
      ></elf-time-picker>
    </div>
    <span slot="status" class="demo-state" role="status" aria-live="polite">
      ${t("output")} · ${preciseTime}
    </span>
  </elf-playground>
`);

export { PageTimePickerEx4 };
