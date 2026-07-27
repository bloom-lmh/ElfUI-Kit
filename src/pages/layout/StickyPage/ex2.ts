import { defineHtml } from "@elfui/core";

const rows = Array.from({ length: 10 }, (_, index) => `审批记录 ${index + 1}`);

const code = `<elf-sticky position="bottom" offset="0" z-index="20">
  <div class="actions">保存 / 提交</div>
</elf-sticky>`;

const script = `// position="bottom" 与 offset 对齐 Element Plus Affix API。`;

const PageStickyEx2 = defineHtml(`
  <h2>底部吸附</h2>
  <elf-playground title="bottom action bar" :code=${code} :script=${script}>
    <div
      style="width:100%;max-width:720px;height:260px;overflow:auto;border:1px solid var(--elf-border);border-radius:8px;background:var(--elf-bg-paper)"
    >
      <div style="display:grid;gap:8px;padding:16px 16px 72px">
        <div
          v-for="row in rows"
          :key="row"
          style="height:40px;padding:0 12px;display:flex;align-items:center;border-radius:6px;background:var(--elf-bg-overlay)"
        >
          {{ row }}
        </div>
      </div>
      <elf-sticky position="bottom" offset="0" z-index="20">
        <div
          style="display:flex;justify-content:flex-end;gap:8px;padding:12px 16px;background:var(--elf-bg-paper);border-top:1px solid var(--elf-divider)"
        >
          <elf-button size="sm" variant="outlined">保存草稿</elf-button>
          <elf-button size="sm">提交</elf-button>
        </div>
      </elf-sticky>
    </div>
  </elf-playground>
`);

export { PageStickyEx2 };
