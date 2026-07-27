import { defineHtml, useRef } from "@elfui/core";


const half = useRef(3.5);

const halfCode = `<elf-rate
  :modelValue.prop=\${half.value}
  allow-half
  show-score
  score-template="{value} 分"
  @update:modelValue=\${onHalf}
></elf-rate>`;

const halfScript = `const half = useRef(3.5);
const onHalf = (event) => half.set(Number(event.detail));`;

const onHalf = (event: CustomEvent): void => {
  half.set(Number(event.detail));
};

const PageRateEx2 = defineHtml(`
<elf-playground title="半星与分数" :code=${halfCode} :script=${halfScript}>
      <div style="display:grid;gap:12px">
        <elf-rate
          :modelValue.prop=${half.value}
          allow-half
          show-score
          score-template="{value} 分"
          @update:modelValue=${onHalf}
        ></elf-rate>
        <span slot="status" class="demo-state">半星评分：{{ half }}</span>
      </div>
    </elf-playground>
`);

export { PageRateEx2 };
