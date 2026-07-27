import { defineHtml, useRef } from "@elfui/core";


const value = useRef(3);

const basicCode = `<elf-rate
  :modelValue.prop=\${value.value}
  show-text
  @update:modelValue=\${onValue}
></elf-rate>`;

const basicScript = `const value = useRef(3);
const onValue = (event) => value.set(Number(event.detail));`;

const onValue = (event: CustomEvent): void => {
  value.set(Number(event.detail));
};

const PageRateEx1 = defineHtml(`
<elf-playground title="基础评分与文本" :code=${basicCode} :script=${basicScript}>
      <div style="display:grid;gap:12px">
        <elf-rate :modelValue.prop=${value.value} show-text @update:modelValue=${onValue}></elf-rate>
        <span slot="status" class="demo-state">当前评分：{{ value }}</span>
      </div>
    </elf-playground>
`);

export { PageRateEx1 };
