import { defineHtml, useRef } from "@elfui/core";


const value = useRef(36);

const onChange = (event: CustomEvent): void => {
  value.set(Number(event.detail));
};

const code = `<elf-slider
  :modelValue.prop=\${value.value}
  @update:modelValue=\${onChange}
></elf-slider>`;

const script = `const value = useRef(36);

const onChange = (event: CustomEvent<number>): void => {
  value.set(Number(event.detail));
};`;

const PageSliderEx1 = defineHtml(`
  <h2>基础滑块</h2>
  <elf-playground title="单值、提示与受控值" :code=${code} :script=${script}>
    <div style="display:grid;gap:14px;width:100%;max-width:680px">
      <elf-slider :modelValue.prop=${value.value} @update:modelValue=${onChange}></elf-slider>
      <p slot="status" class="demo-state">当前值：{{ value }}</p>
    </div>
  </elf-playground>
`);

export { PageSliderEx1 };
