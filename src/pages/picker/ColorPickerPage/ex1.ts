import { defineHtml, useRef } from "@elfui/core";


const color = useRef("#6750a4");

const presets = [
  { label: "Primary", value: "#6750a4" },
  { label: "Teal", value: "#006a6a" },
  { label: "Amber", value: "#f9a825" },
  { label: "Danger", value: "#d32f2f" }
];

const updateColor = (event: CustomEvent): void => {
  color.set(String(event.detail));
};

const basicCode = `<elf-color-picker
  :modelValue="color"
  :presets.prop="presets"
  clearable
  @update:modelValue="updateColor"
/>`;

const basicScript = `const color = useRef("#6750a4");
const presets = [
  { label: "Primary", value: "#6750a4" },
  { label: "Teal", value: "#006a6a" }
];
const updateColor = (event) => color.set(event.detail);`;

const PageColorPickerEx1 = defineHtml(`
<elf-playground title="基础选择与预设色" :code=${basicCode} :script=${basicScript}>
      <div style="display:flex;justify-content:center;gap:12px;align-items:center;flex-wrap:wrap;width:100%;max-width:760px;margin-inline:auto">
        <elf-color-picker label="品牌色" :modelValue=${color} :presets.prop=${presets} clearable @update:modelValue=${updateColor}></elf-color-picker>
        <span slot="status" class="demo-state">{{ color }}</span>
      </div>
    </elf-playground>
`);

export { PageColorPickerEx1 };
