import { defineHtml, useRef } from "@elfui/core";
import { createDocsTranslator } from "../../docsLocale";

const t = createDocsTranslator({
  title: { zh: "自定义温度节点 0 / 30 / 100 ℃", en: "Custom temperature marks at 0 / 30 / 100 °C" },
  temperature: { zh: "温度", en: "Temperature" }
});
const value = useRef(30);

const marks = {
  0: "0 ℃",
  30: "30 ℃",
  100: "100 ℃"
};

const onChange = (event: CustomEvent): void => {
  value.set(Number(event.detail));
};

const code = `<elf-slider
  segmented
  :marks.prop=\${marks}
  :modelValue.prop=\${value.value}
  @update:modelValue=\${onChange}
/>`;

const script = `const value = useRef(30);
const marks = { 0: "0 ℃", 30: "30 ℃", 100: "100 ℃" };

const onChange = (event: CustomEvent<number>): void => {
  value.set(Number(event.detail));
};`;

const PageSliderEx6 = defineHtml(`
  <h2>${t("title")}</h2>
  <elf-playground :title=${t("title")} :code=${code} :script=${script}>
    <div style="display:grid;gap:14px;width:100%;max-width:720px">
      <elf-slider
        segmented
        :marks.prop=${marks}
        :modelValue.prop=${value.value}
        @update:modelValue=${onChange}
      ></elf-slider>
      <p slot="status" class="demo-state">${t("temperature")}: {{ value }} ℃</p>
    </div>
  </elf-playground>
`);

export { PageSliderEx6 };
