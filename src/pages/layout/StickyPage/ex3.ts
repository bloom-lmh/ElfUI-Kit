import { defineHtml } from "@elfui/core";

const code = `<elf-sticky top="16" disabled>
  <div>普通内容块</div>
</elf-sticky>`;

const script = `// disabled 是 ElfUI 扩展能力，组件回到普通文档流。`;

const PageStickyEx3 = defineHtml(`
  <h2>禁用吸附</h2>
  <elf-playground title="disabled" :code=${code} :script=${script}>
    <div
      style="width:100%;max-width:720px;height:180px;overflow:auto;border:1px solid var(--elf-border);border-radius:8px;background:var(--elf-bg-paper);padding:16px"
    >
      <elf-sticky top="16" disabled>
        <div
          style="padding:12px 16px;border-radius:8px;background:var(--elf-bg-overlay);color:var(--elf-text-secondary)"
        >
          disabled 后保持普通文档流，不参与 sticky。
        </div>
      </elf-sticky>
      <div style="height:260px"></div>
    </div>
  </elf-playground>
`);

export { PageStickyEx3 };
