import { defineHtml, useRef } from "@elfui/core";

const color = useRef("#2563eb");
const updateColor = (event: CustomEvent<string>): void => color.set(String(event.detail || ""));

const code = `<div id="brand-color-overlays"></div>
<elf-color-picker
  :modelValue="color"
  append-to="#brand-color-overlays"
  hue-slider-class="brand-hue"
  :hueSliderStyle.prop="{ inlineSize: '56px' }"
  @update:modelValue="updateColor"
/>`;

const script = `const color = useRef("#2563eb");
const updateColor = (event) => color.set(event.detail);`;

const PageColorPickerEx4 = defineHtml(`
  <elf-playground title="外部挂载与色板定制" :code=${code} :script=${script}>
    <span slot="status" class="demo-state">面板挂载到页面级 overlay 容器</span>
    <div id="brand-color-overlays"></div>
    <elf-color-picker
      :modelValue=${color}
      append-to="#brand-color-overlays"
      hue-slider-class="brand-hue"
      :hueSliderStyle.prop=${{ inlineSize: "56px" }}
      label="品牌色"
      clearable
      @update:modelValue=${updateColor}
    ></elf-color-picker>
  </elf-playground>
`);

export { PageColorPickerEx4 };
