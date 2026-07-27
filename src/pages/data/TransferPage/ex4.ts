import { defineHtml, useRef } from "@elfui/core";

const data = Array.from({ length: 1200 }, (_, index) => ({
  key: `member-${index + 1}`,
  label: `成员 ${String(index + 1).padStart(4, "0")} · ${index % 3 === 0 ? "跨区域设计系统与前端基础设施协作组" : "产品研发交付组"}`,
  disabled: (index + 1) % 97 === 0
}));

const selected = useRef<string[]>(["member-7", "member-18", "member-29"]);
const activity = useRef("已选 3 / 1,200");

const onTransfer = (event: CustomEvent<string[]>): void => {
  const next = Array.isArray(event.detail) ? event.detail : [];
  selected.set(next);
  activity.set(`已选 ${next.length} / 1,200`);
};

const reset = (): void => {
  selected.set(["member-7", "member-18", "member-29"]);
  activity.set("已恢复默认选择");
};

const code = `<elf-transfer
  :data.prop="data"
  :modelValue.prop="selected"
  :height="260"
  :itemSize="38"
  :overscan="4"
  filterable
  virtual
  empty-text="没有匹配成员"
  @update:modelValue="onTransfer"
/>`;

const script = `const data = Array.from({ length: 1200 }, (_, index) => ({
  key: \`member-\${index + 1}\`,
  label: \`成员 \${String(index + 1).padStart(4, "0")} · 产品研发交付组\`,
  disabled: (index + 1) % 97 === 0
}));

const selected = useRef(["member-7", "member-18", "member-29"]);
const onTransfer = (event) => selected.set(event.detail);`;

const PageTransferEx4 = defineHtml(`
  <h2>虚拟化与键盘操作</h2>
  <elf-playground title="1,200 名成员分配" :code=${code} :script=${script}>
    <div slot="status" style="display:inline-flex;align-items:center;gap:8px">
      <span class="demo-state">{{ activity }} · Space 勾选 · ←/→ 移动</span>
      <elf-button size="small" variant="text" @click=${reset}>恢复</elf-button>
    </div>
    <div style="width:100%;max-width:980px">
      <elf-transfer
        :data.prop=${data}
        :modelValue.prop=${selected}
        :titles.prop=${["候选成员", "发布成员"]}
        :height=${260}
        :itemSize=${38}
        :overscan=${4}
        filter-placeholder="搜索成员"
        empty-text="没有匹配成员"
        filterable
        virtual
        @update:modelValue=${onTransfer}
      ></elf-transfer>
    </div>
  </elf-playground>
`);

export { PageTransferEx4 };
