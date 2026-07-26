import { defineHtml } from "@elfui/core";

const code = `<elf-splitter>
  <elf-splitter-panel slot="first" :size=\${40} :resizable.prop=\${false}>
    固定宽度导航
  </elf-splitter-panel>
  <elf-splitter-panel slot="second">内容区域</elf-splitter-panel>
</elf-splitter>`;

const script = `// resizable=false 会同时禁用指针和键盘调整，
// separator 会暴露 aria-disabled="true"。`;

const PageSplitterEx5 = defineHtml(`
  <h2>不可调整的 Panel</h2>
  <elf-playground title="panel resizable=false" :code=${code} :script=${script}>
    <elf-splitter>
      <elf-splitter-panel slot="first" :size=${40} :resizable.prop=${false}>
        <strong>固定宽度导航</strong>
      </elf-splitter-panel>
      <elf-splitter-panel slot="second">内容区域</elf-splitter-panel>
    </elf-splitter>
  </elf-playground>
`);

export { PageSplitterEx5 };
