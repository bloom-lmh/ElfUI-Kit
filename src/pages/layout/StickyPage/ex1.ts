import { defineHtml, useRef } from "@elfui/core";


const stuck = useRef("未吸附");

const onChange = (event: CustomEvent): void => {
  stuck.set(event.detail ? "已吸附" : "未吸附");
};

const rows = Array.from({ length: 12 }, (_, index) => `内容行 ${index + 1}`);

const code = `<elf-sticky top="0" @change="onChange">
  <div class="toolbar">Toolbar</div>
</elf-sticky>`;

const script = `const stuck = useRef("未吸附");
const onChange = (event) => stuck.set(event.detail ? "已吸附" : "未吸附");`;

const PageStickyEx1 = defineHtml(`
  <h2>顶部吸附</h2>
  <elf-playground title="顶部吸附与状态变化" :code=${code} :script=${script}>
    <div
      style="width:100%;max-width:720px;height:260px;overflow:auto;border:1px solid var(--elf-border);border-radius:8px;background:var(--elf-bg-paper)"
    >
      <div style="height:112px;display:grid;place-items:center;padding:0 16px;background:linear-gradient(135deg,color-mix(in srgb,var(--elf-primary) 10%,var(--elf-bg-paper)),var(--elf-bg-paper));color:var(--elf-text-secondary);font-size:13px">
        先向下滚动，工具栏抵达容器顶部时会吸附并显示阴影
      </div>
      <elf-sticky
        top="0"
        @change=${onChange}
        style="--sticky-shadow:0 10px 24px -16px rgba(0,0,0,.42)"
      >
        <div
          style="display:flex;align-items:center;gap:12px;height:48px;padding:0 16px;background:var(--elf-bg-paper);border-bottom:1px solid var(--elf-divider)"
        >
          <strong>筛选工具栏</strong>
          <span style="color:var(--elf-primary);font-size:13px;font-weight:600">{{ stuck }}</span>
        </div>
      </elf-sticky>
      <div style="display:grid;gap:8px;padding:16px">
        <div
          v-for="row in rows"
          :key="row"
          style="height:36px;padding:0 12px;display:flex;align-items:center;border-radius:6px;background:var(--elf-bg-overlay)"
        >
          {{ row }}
        </div>
      </div>
    </div>
  </elf-playground>
`);

export { PageStickyEx1 };
