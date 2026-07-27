import { defineHtml, useRef } from "@elfui/core";


const value = useRef(64);

const format = (next: number): string => `${next}%`;

const onChange = (event: CustomEvent): void => {
  value.set(Number(event.detail));
};

const code = `<elf-slider
  show-input
  color="#006a6a"
  :formatTooltip.prop=\${format}
  :modelValue.prop=\${value.value}
  @update:modelValue=\${onChange}
/>`;

const script = `const value = useRef(64);
const format = (next: number): string => \`\${next}%\`;

const onChange = (event: CustomEvent<number>): void => {
  value.set(Number(event.detail));
};`;

const PageSliderEx3 = defineHtml(`
  <h2>输入框联动</h2>
  <elf-playground title="数字输入、颜色与提示格式" :code=${code} :script=${script}>
    <div style="display:grid;gap:14px;width:100%;max-width:720px">
      <elf-slider
        show-input
        color="#006a6a"
        :formatTooltip.prop=${format}
        :modelValue.prop=${value.value}
        @update:modelValue=${onChange}
      ></elf-slider>
      <p slot="status" class="demo-state">比例：{{ value }}%</p>
    </div>
  </elf-playground>
`);

export { PageSliderEx3 };
