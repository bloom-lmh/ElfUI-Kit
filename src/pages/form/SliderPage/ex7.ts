import { defineHtml, useRef } from "@elfui/core";


const value = useRef(36);

const onChange = (event: CustomEvent): void => {
  value.set(Number(event.detail));
};

const code = `<elf-slider
  show-input
  :showInputControls.prop=\${false}
  input-size="large"
  label="Volume"
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
  <h2>输入控件与辅助标签</h2>
  <elf-playground title="输入按钮、输入尺寸与标签" :code=${code} :script=${script}>
    <div style="display:grid;gap:14px;width:100%;max-width:720px">
      <elf-slider
        show-input
        :showInputControls.prop=${false}
        input-size="large"
        label="Volume"
        placement="right"
        tooltip-class="volume-tooltip"
        :modelValue.prop=${value.value}
        @update:modelValue=${onChange}
      ></elf-slider>
      <p slot="status" class="demo-state">当前音量：{{ value }}</p>
    </div>
  </elf-playground>
`);

export { PageSliderEx7 };
