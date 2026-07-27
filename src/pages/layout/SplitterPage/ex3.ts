import { defineHtml } from "@elfui/core";

const code = `<elf-splitter disabled :modelValue.prop=\${40}>
  <div slot="first">禁用拖拽</div>
  <div slot="second">固定区域</div>
</elf-splitter>`;

const script = `// disabled 会禁用拖拽和键盘调整。`;

const PageSplitterEx3 = defineHtml(`
  <h2>禁用状态</h2>
  <elf-playground title="disabled" :code=${code} :script=${script}>
    <elf-splitter disabled :modelValue.prop=${40}>
      <div slot="first" style="padding:16px">禁用拖拽</div>
      <div slot="second" style="padding:16px">固定区域</div>
    </elf-splitter>
  </elf-playground>
`);

export { PageSplitterEx3 };
