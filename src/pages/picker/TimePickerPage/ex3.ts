import { defineHtml, defineStyle, useRef } from "@elfui/core";

import { createDocsPicker, createDocsTranslator } from "../../docsLocale";
import demoStyles from "./demo.scss?inline";

const fallbackTime = useRef("12:30");
const t = createDocsTranslator({
  title: {
    zh: "限制范围、只读输入与清空回退",
    en: "Limits, non-editable input, and clear fallback",
  },
  label: { zh: "值班开始", en: "Shift start" },
  waiting: { zh: "等待打开", en: "Waiting to open" },
  opened: { zh: "钟面已打开", en: "Clock opened" },
  closed: { zh: "钟面已关闭", en: "Clock closed" },
  current: { zh: "当前值", en: "Current value" },
});
const pick = createDocsPicker();

const visibleLog = useRef(t("waiting"));

const updateFallback = (event: CustomEvent): void => {
  fallbackTime.set(String(event.detail || ""));
};

const clearFallback = (): string => "09:00";

const onVisibleChange = (event: CustomEvent): void => {
  visibleLog.set(event.detail ? t("opened") : t("closed"));
};

const code = () =>
  pick(
    `<elf-time-picker
  :modelValue.prop="fallbackTime"
  label="值班开始"
  min="09:00"
  max="18:00"
  size="lg"
  :editable="false"
  :valueOnClear.prop="clearFallback"
  @update:modelValue="updateFallback"
  @visible-change="onVisibleChange"
/>`,
    `<elf-time-picker
  :modelValue.prop="fallbackTime"
  label="Shift start"
  min="09:00"
  max="18:00"
  size="lg"
  :editable="false"
  :valueOnClear.prop="clearFallback"
  @update:modelValue="updateFallback"
  @visible-change="onVisibleChange"
/>`,
  );

const script = () =>
  pick(
    `const fallbackTime = useRef("12:30");
const visibleLog = useRef("等待打开");

const clearFallback = () => "09:00";

const updateFallback = (event) => {
  fallbackTime.set(event.detail || "");
};

const onVisibleChange = (event) => {
  visibleLog.set(event.detail ? "钟面已打开" : "钟面已关闭");
};`,
    `const fallbackTime = useRef("12:30");
const visibleLog = useRef("Waiting to open");

const clearFallback = () => "09:00";

const updateFallback = (event) => {
  fallbackTime.set(event.detail || "");
};

const onVisibleChange = (event) => {
  visibleLog.set(event.detail ? "Clock opened" : "Clock closed");
};`,
  );

defineStyle(demoStyles);

const PageTimePickerEx3 = defineHtml(`
  <elf-playground :title=${t("title")} :code=${code()} :script=${script()}>
    <div class="time-picker-demo-stage time-picker-demo-stage--compact">
      <elf-time-picker
        :modelValue.prop=${fallbackTime}
        :label=${t("label")}
        min="09:00"
        max="18:00"
        size="lg"
        :editable=${false}
        :valueOnClear.prop=${clearFallback}
        @update:modelValue=${updateFallback}
        @visible-change=${onVisibleChange}
      ></elf-time-picker>
    </div>
    <span slot="status" class="demo-state" role="status" aria-live="polite">
      ${t("current")} · ${fallbackTime} · ${visibleLog}
    </span>
  </elf-playground>
`);

export { PageTimePickerEx3 };
