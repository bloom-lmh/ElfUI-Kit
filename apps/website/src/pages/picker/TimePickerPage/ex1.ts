import { defineHtml, defineStyle, useRef } from "@elfui/core";

import { createDocsPicker, createDocsTranslator } from "../../docsLocale";
import demoStyles from "./demo.scss?inline";

const time = useRef("09:30");
const t = createDocsTranslator({
  title: { zh: "直播开播", en: "Stream kickoff" },
  meta: { zh: "晚间技术分享 · 频道 A", en: "Evening tech talk · Channel A" },
  label: { zh: "开播时间", en: "Stream time" },
  scheduled: { zh: "已安排开播", en: "Stream scheduled" },
  empty: { zh: "尚未安排开播", en: "No stream scheduled" },
});
const pick = createDocsPicker();

const updateTime = (event: CustomEvent): void => {
  time.set(String(event.detail));
};

const code = () =>
  pick(
    `<elf-time-picker
  :modelValue.prop="time"
  label="开播时间"
  :step="300"
  clearable
  @update:modelValue="updateTime"
/>`,
    `<elf-time-picker
  :modelValue.prop="time"
  label="Stream time"
  :step="300"
  clearable
  @update:modelValue="updateTime"
/>`,
  );

const script = `const time = useRef("09:30");

const updateTime = (event) => {
  time.set(event.detail);
};`;

defineStyle(demoStyles);

const PageTimePickerEx1 = defineHtml(`
  <elf-playground :title=${t("title")} :code=${code()} :script=${script}>
    <div class="time-picker-demo-stage time-picker-demo-stage--compact">
      <div class="time-picker-demo-card">
        <div class="time-picker-demo-card-head">
          <strong class="time-picker-demo-card-title">${t("title")}</strong>
          <span class="time-picker-demo-card-meta">${t("meta")}</span>
        </div>
        <elf-time-picker
          :modelValue.prop=${time}
          :label=${t("label")}
          :step=${300}
          clearable
          @update:modelValue=${updateTime}
        ></elf-time-picker>
      </div>
    </div>
    <span slot="status" class="demo-state" role="status" aria-live="polite">
      ${time.value ? `${t("scheduled")} · ${time.value}` : t("empty")}
    </span>
  </elf-playground>
`);

export { PageTimePickerEx1 };
