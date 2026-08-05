import { defineHtml, defineStyle, useRef } from "@elfui/core";

import { createDocsPicker, createDocsTranslator } from "../../docsLocale";
import demoStyles from "./demo.scss?inline";

const value = useRef("13:30");
const t = createDocsTranslator({
  title: { zh: "海外会议", en: "Overseas meeting" },
  meta: { zh: "与柏林团队 · 12 小时制", en: "With the Berlin team · 12-hour" },
  label: { zh: "当地时间", en: "Local time" },
  hint: {
    zh: "格式只影响展示，受控值仍保持 HH:mm。",
    en: "Formatting changes labels only; the controlled value remains HH:mm.",
  },
  output: { zh: "受控值", en: "Controlled value" },
});
const pick = createDocsPicker();
const onUpdate = (event: CustomEvent<string>): void => value.set(event.detail);

const code = () =>
  pick(
    `<elf-time-select
  :modelValue.prop="time"
  start="00:00"
  end="23:59"
  step="00:30"
  format="hh:mm A"
  include-end-time
  label="当地时间"
/>`,
    `<elf-time-select
  :modelValue.prop="time"
  start="00:00"
  end="23:59"
  step="00:30"
  format="hh:mm A"
  include-end-time
  label="Local time"
/>`,
  );
const script = `const time = useRef("13:30");`;

defineStyle(demoStyles);

const PageTimeSelectEx2 = defineHtml(`
  <elf-playground :title=${t("title")} :code=${code()} :script=${script}>
    <section class="demo-card" style="width:min(100%,360px);margin-inline:auto">
      <strong>${t("title")}</strong>
      <span class="demo-meta">${t("meta")}</span>
      <elf-time-select
        :modelValue.prop=${value}
        start="00:00"
        end="23:59"
        step="00:30"
        format="hh:mm A"
        include-end-time
        :label=${t("label")}
        @update:modelValue=${onUpdate}
      ></elf-time-select>
      <small>${t("hint")}</small>
    </section>
    <span slot="status" class="demo-state" role="status" aria-live="polite">
      ${t("output")} · ${value}
    </span>
  </elf-playground>
`);

export { PageTimeSelectEx2 };
