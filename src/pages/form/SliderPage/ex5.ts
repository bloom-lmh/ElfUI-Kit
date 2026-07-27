import { defineHtml } from "@elfui/core";

const code = `<elf-slider disabled model-value="70"></elf-slider>`;

const script = `// 禁用状态由 disabled prop 声明。`;

const PageSliderEx5 = defineHtml(`
  <h2>禁用状态</h2>
  <elf-playground title="禁用状态" :code=${code} :script=${script}>
    <div style="width:100%;max-width:680px">
      <elf-slider disabled model-value="70"></elf-slider>
    </div>
  </elf-playground>
`);

export { PageSliderEx5 };
