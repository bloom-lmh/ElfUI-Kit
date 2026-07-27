import { defineHtml } from "@elfui/core";

const code = `<elf-splitter storage-key="workspace-splitter">
  <elf-splitter-panel
    slot="first"
    :size=\${34}
    :min=\${18}
    :max=\${70}
    collapsible
    lazy
  >
    项目导航
  </elf-splitter-panel>
  <elf-splitter-panel slot="second">编辑工作区</elf-splitter-panel>
</elf-splitter>`;

const script = `// 双击分隔条或点击折叠按钮可收起第一个面板。
// storage-key 会在 localStorage 中保存最近一次尺寸。`;

const PageSplitterEx4 = defineHtml(`
  <h2>Panel 子组件、折叠与持久化</h2>
  <elf-playground
    title="collapsible / lazy / storage-key"
    :code=${code}
    :script=${script}
  >
    <div style="height:280px">
      <elf-splitter storage-key="elfui-demo-workspace-splitter">
        <elf-splitter-panel
          slot="first"
          :size=${34}
          :min=${18}
          :max=${70}
          collapsible
          lazy
        >
          <div style="display:grid;gap:10px">
            <strong>项目导航</strong>
            <span>src/components</span>
            <span>src/pages</span>
            <span>tests</span>
          </div>
        </elf-splitter-panel>
        <elf-splitter-panel slot="second">
          <div style="display:grid;place-items:center;height:100%;color:var(--elf-text-secondary)">
            编辑工作区
          </div>
        </elf-splitter-panel>
      </elf-splitter>
    </div>
  </elf-playground>
`);

export { PageSplitterEx4 };
