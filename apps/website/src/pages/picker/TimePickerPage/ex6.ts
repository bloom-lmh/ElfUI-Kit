import { defineHtml, defineStyle, useRef } from "@elfui/core";

import { createDocsPicker, createDocsTranslator } from "../../docsLocale";
import demoStyles from "./demo.scss?inline";

const time = useRef("");
const updateTime = (event: CustomEvent<string>): void => time.set(String(event.detail || ""));
const t = createDocsTranslator({
  title: { zh: "上门取件", en: "Home pickup" },
  meta: { zh: "快递上门取件 · 默认 09:30", en: "Courier pickup · defaults to 09:30" },
  label: { zh: "取件时间", en: "Pickup time" },
  draft: { zh: "空值从 09:30 开始编辑", en: "Empty value starts editing at 09:30" },
  selected: { zh: "已选时间", en: "Selected time" },
  flip: { zh: "自动翻转", en: "automatic flip" },
});
const pick = createDocsPicker();

const code = () =>
  pick(
    `<elf-time-picker
  :modelValue="time"
  label="取件时间"
  default-value="09:30"
  placement="bottom-end"
  :fallbackPlacements.prop="['top-end', 'bottom-start']"
  :popperOptions.prop="{ offset: [0, 12], padding: 12 }"
  @update:modelValue="updateTime"
/>`,
    `<elf-time-picker
  :modelValue="time"
  label="Pickup time"
  default-value="09:30"
  placement="bottom-end"
  :fallbackPlacements.prop="['top-end', 'bottom-start']"
  :popperOptions.prop="{ offset: [0, 12], padding: 12 }"
  @update:modelValue="updateTime"
/>`,
  );

const script = `const time = useRef("");
const updateTime = (event) => time.set(event.detail);`;

const statusText = (): string =>
  time.value ? `${t("selected")} · ${time.value}` : `${t("draft")} · ${t("flip")}`;

defineStyle(demoStyles);

const PageTimePickerEx6 = defineHtml(`
  <elf-playground :title=${t("title")} :code=${code()} :script=${script}>
    <div class="time-picker-demo-stage time-picker-demo-stage--compact">
      <div class="time-picker-demo-card">
        <div class="time-picker-demo-card-head">
          <strong class="time-picker-demo-card-title">${t("title")}</strong>
          <span class="time-picker-demo-card-meta">${t("meta")}</span>
        </div>
        <elf-time-picker
          :modelValue.prop=${time}
          default-value="09:30"
          placement="bottom-end"
          :fallbackPlacements.prop=${["top-end", "bottom-start"]}
          :popperOptions.prop=${{ offset: [0, 12], padding: 12 }}
          :label=${t("label")}
          @update:modelValue=${updateTime}
        ></elf-time-picker>
      </div>
    </div>
    <span slot="status" class="demo-state" role="status" aria-live="polite">
      ${statusText()}
    </span>
  </elf-playground>
`);

export { PageTimePickerEx6 };
