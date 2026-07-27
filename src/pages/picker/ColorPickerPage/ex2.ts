import { defineHtml, useRef } from "@elfui/core";


const color = useRef("#6750a4");

const rgba = useRef("rgba(0, 106, 106, 0.8)");

const updateRgba = (event: CustomEvent): void => {
  rgba.set(String(event.detail));
};

const alphaCode = `<elf-color-picker
  :modelValue="rgba"
  format="rgb"
  show-alpha
  clearable
  @update:modelValue="updateRgba"
/>`;

const alphaScript = `const rgba = useRef("rgba(0, 106, 106, 0.8)");
const updateRgba = (event) => rgba.set(event.detail);`;

const PageColorPickerEx2 = defineHtml(`
<elf-playground title="RGB 与透明度" :code=${alphaCode} :script=${alphaScript}>
      <div style="display:flex;justify-content:center;gap:12px;align-items:center;flex-wrap:wrap;width:100%;max-width:760px;margin-inline:auto">
        <elf-color-picker :modelValue=${rgba} format="rgb" show-alpha clearable @update:modelValue=${updateRgba}></elf-color-picker>
        <span slot="status" class="demo-state">{{ rgba }}</span>
      </div>
    </elf-playground>
`);

export { PageColorPickerEx2 };
