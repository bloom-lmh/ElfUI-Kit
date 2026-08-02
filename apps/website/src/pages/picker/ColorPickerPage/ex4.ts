import { defineHtml, useRef } from "@elfui/core";

import { createDocsTranslator } from "../../docsLocale";

const t = createDocsTranslator({
  title: { zh: "外部挂载与色板定制", en: "External mounting and palette customization" },
  status: {
    zh: "面板挂载到页面级浮层容器",
    en: "Panel mounted into a page-level overlay container",
  },
  label: { zh: "品牌色", en: "Brand color" },
});

const color = useRef("#2563eb");
const updateColor = (event: CustomEvent<string>): void => color.set(String(event.detail || ""));

const code = `<div id="brand-color-overlays"></div>
<elf-color-picker
  :modelValue.prop="color"
  append-to="#brand-color-overlays"
  hue-slider-class="brand-hue"
  :hueSliderStyle.prop="{ inlineSize: '56px' }"
  @update:modelValue="updateColor"
/>`;

const script = `const color = useRef("#2563eb");
const updateColor = (event) => color.set(event.detail);`;

const PageColorPickerEx4 = defineHtml(`
  <elf-playground :title=${t("title")} :code=${code} :script=${script}>
    <span slot="status" class="demo-state">${t("status")}</span>
    <div id="brand-color-overlays"></div>
    <elf-color-picker
      :modelValue.prop=${color}
      append-to="#brand-color-overlays"
      hue-slider-class="brand-hue"
      :hueSliderStyle.prop=${{ inlineSize: "56px" }}
      :label=${t("label")}
      clearable
      @update:modelValue=${updateColor}
    ></elf-color-picker>
  </elf-playground>
`);

export { PageColorPickerEx4 };
