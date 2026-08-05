import { defineHtml, defineStyle, useRef } from "@elfui/core";

import { createDocsPicker, createDocsTranslator } from "../../docsLocale";
import demoStyles from "./demo.scss?inline";

const value = useRef("");
const t = createDocsTranslator({
  title: { zh: "到店预约", en: "In-store booking" },
  meta: { zh: "门店服务 · 每 15 分钟一个时段", en: "In-store service · 15-minute slots" },
  label: { zh: "预约时间", en: "Appointment time" },
  placeholder: { zh: "选择预约时间", en: "Choose a time" },
  booked: { zh: "已预约", en: "Booked" },
  empty: { zh: "未预约", en: "Not booked" },
});
const pick = createDocsPicker();

const onUpdate = (event: CustomEvent<string>): void => value.set(event.detail);

const code = () =>
  pick(
    `<elf-time-select
  :modelValue.prop="time"
  start="08:30"
  end="18:30"
  step="00:15"
  label="预约时间"
  placeholder="选择预约时间"
  @update:modelValue="onUpdate"
/>`,
    `<elf-time-select
  :modelValue.prop="time"
  start="08:30"
  end="18:30"
  step="00:15"
  label="Appointment time"
  placeholder="Choose a time"
  @update:modelValue="onUpdate"
/>`,
  );
const script = `const time = useRef("");
const onUpdate = (event) => time.set(event.detail);`;

defineStyle(demoStyles);

const PageTimeSelectEx1 = defineHtml(`
  <elf-playground :title=${t("title")} :code=${code()} :script=${script}>
    <section class="demo-card" style="width:min(100%,480px);margin-inline:auto">
      <strong>${t("title")}</strong>
      <span class="demo-meta">${t("meta")}</span>
      <elf-time-select
        :modelValue.prop=${value}
        start="08:30"
        end="18:30"
        step="00:15"
        :label=${t("label")}
        :placeholder=${t("placeholder")}
        clearable
        @update:modelValue=${onUpdate}
      ></elf-time-select>
    </section>
    <span slot="status" class="demo-state" role="status" aria-live="polite">
      ${value.value ? `${t("booked")} · ${value.value}` : t("empty")}
    </span>
  </elf-playground>
`);

export { PageTimeSelectEx1 };
