import { defineHtml, useRef } from "@elfui/core";


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
  <h2>非等距节点</h2>
  <elf-playground title="自定义温度节点 0 / 30 / 100 ℃" :code=${code} :script=${script}>
    <div style="display:grid;gap:14px;width:100%;max-width:720px">
      <elf-slider
        segmented
        :marks.prop=${marks}
        :modelValue.prop=${value.value}
        @update:modelValue=${onChange}
      ></elf-slider>
      <p slot="status" class="demo-state">温度：{{ value }} ℃</p>
    </div>
  </elf-playground>
`);

export { PageSliderEx6 };
