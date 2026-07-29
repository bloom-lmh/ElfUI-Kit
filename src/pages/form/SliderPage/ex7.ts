import { defineHtml, useRef } from "@elfui/core";
import { createDocsTranslator } from "../../docsLocale";

const t = createDocsTranslator({
  title: { zh: "输入按钮、输入尺寸与标签", en: "Input controls, size, and label" },
  volume: { zh: "音量", en: "Volume" },
  currentVolume: { zh: "当前音量", en: "Current volume" }
});
const value = useRef(36);

const onChange = (event: CustomEvent): void => {
  value.set(Number(event.detail));
};

const code = `<elf-slider
  show-input
  :showInputControls.prop=\${false}
  input-size="large"
  label="${t("volume")}"
  placement="right"
  tooltip-class="volume-tooltip"
  :modelValue.prop=\${value.value}
  @update:modelValue=\${onChange}
/>`;

const script = `const value = useRef(36);

const onChange = (event: CustomEvent<number>): void => {
  value.set(Number(event.detail));
};`;

const PageSliderEx7 = defineHtml(`
  <h2>${t("title")}</h2>
  <elf-playground :title=${t("title")} :code=${code} :script=${script}>
    <div style="display:grid;gap:14px;width:100%;max-width:720px">
      <elf-slider
        show-input
        :showInputControls.prop=${false}
        input-size="large"
        :label=${t("volume")}
        placement="right"
        tooltip-class="volume-tooltip"
        :modelValue.prop=${value.value}
        @update:modelValue=${onChange}
      ></elf-slider>
      <p slot="status" class="demo-state">${t("currentVolume")}: {{ value }}</p>
    </div>
  </elf-playground>
`);

export { PageSliderEx7 };
