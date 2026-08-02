import { defineHtml, defineStyle, useRef } from "@elfui/core";

import { createDocsPicker, createDocsTranslator } from "../../docsLocale";
import demoStyles from "./demo.scss?inline";

const time = useRef("");
const updateTime = (event: CustomEvent<string>): void => time.set(String(event.detail || ""));
const t = createDocsTranslator({
  title: { zh: "默认时刻与浮层策略", en: "Default time and overlay strategy" },
  label: { zh: "会议时间", en: "Meeting time" },
  draft: { zh: "空值从 09:30 开始编辑", en: "Empty value starts editing at 09:30" },
  selected: { zh: "已选时间", en: "Selected time" },
  flip: { zh: "自动翻转", en: "automatic flip" },
});
const pick = createDocsPicker();

const code = () =>
  pick(
    `<elf-time-picker
  :modelValue="time"
  label="会议时间"
  default-value="09:30"
  placement="bottom-end"
  :fallbackPlacements.prop="['top-end', 'bottom-start']"
  :popperOptions.prop="{ offset: [0, 12], padding: 12 }"
  @update:modelValue="updateTime"
/>`,
    `<elf-time-picker
  :modelValue="time"
  label="Meeting time"
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
    <span slot="status" class="demo-state" role="status" aria-live="polite">
      ${statusText()}
    </span>
  </elf-playground>
`);

export { PageTimePickerEx6 };
