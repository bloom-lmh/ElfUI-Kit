import { defineHtml, defineStyle, useRef } from "@elfui/core";

interface MemberOption {
  label: string;
  value: string;
}

const keyword = useRef("");
const status = useRef("500 位成员 · 当前仅渲染可见候选");
const members: MemberOption[] = Array.from({ length: 500 }, (_, index) => ({
  label: `成员 ${String(index + 1).padStart(3, "0")} · ${index % 2 === 0 ? "设计团队" : "工程团队"}`,
  value: `member-${index + 1}`
}));

const onUpdate = (event: CustomEvent<string>): void => {
  keyword.set(String(event.detail || ""));
};

const onSelect = (event: CustomEvent<MemberOption>): void => {
  status.set(`已选择：${event.detail.label}`);
};

const onCreate = (event: CustomEvent<MemberOption>): void => {
  status.set(`已创建候选：${event.detail.value}`);
};

const code = `<elf-autocomplete
  :modelValue="keyword"
  :options.prop="members"
  allow-create
  create-text="创建"
  virtual
  :item-height="40"
  :max-height="240"
  :overscan="3"
  highlight-first-item
  @update:modelValue="onUpdate"
  @select="onSelect"
  @create="onCreate"
/>`;

const script = `const keyword = useRef("");
const status = useRef("500 位成员 · 当前仅渲染可见候选");
const members = Array.from({ length: 500 }, (_, index) => ({
  label: \`成员 \${String(index + 1).padStart(3, "0")} · \${index % 2 === 0 ? "设计团队" : "工程团队"}\`,
  value: \`member-\${index + 1}\`
}));

const onUpdate = (event) => keyword.set(String(event.detail || ""));
const onSelect = (event) => status.set(\`已选择：\${event.detail.label}\`);
const onCreate = (event) => status.set(\`已创建候选：\${event.detail.value}\`);`;

defineStyle(`
  .autocomplete-scale-stage {
    display: grid;
    grid-template-columns: minmax(260px, 360px) minmax(0, 1fr);
    align-items: center;
    gap: 28px;
    width: min(760px, 100%);
    min-height: 180px;
    margin: 0 auto;
    padding: 28px;
    box-sizing: border-box;
    border: 1px solid var(--elf-border);
    border-radius: var(--elf-radius-md);
    background: color-mix(in srgb, var(--elf-bg-paper) 95%, var(--elf-primary) 5%);
  }
  .autocomplete-scale-stage elf-autocomplete { width: 100%; }
  .autocomplete-scale-notes { display: grid; gap: 10px; }
  .autocomplete-scale-notes strong { color: var(--elf-text-primary); font-size: 16px; }
  .autocomplete-scale-notes span { color: var(--elf-text-secondary); line-height: 1.6; }
  .autocomplete-scale-notes code { color: var(--elf-primary); }
  @media (max-width: 680px) {
    .autocomplete-scale-stage { grid-template-columns: 1fr; padding: 20px; }
  }
`);

const PageAutocompleteEx6 = defineHtml(`
  <h2>创建项与长列表</h2>
  <elf-playground title="自由输入与虚拟建议" :code=${code} :script=${script}>
    <span slot="status">{{ status }}</span>
    <section class="autocomplete-scale-stage">
      <elf-autocomplete
        :modelValue=${keyword}
        :options.prop=${members}
        allow-create
        create-text="创建"
        virtual
        :item-height=${40}
        :max-height=${240}
        :overscan=${3}
        highlight-first-item
        fit-input-width
        clearable
        label="创建或邀请成员"
        placeholder="搜索或创建成员"
        @update:modelValue=${onUpdate}
        @select=${onSelect}
        @create=${onCreate}
      ></elf-autocomplete>
      <div class="autocomplete-scale-notes">
        <strong>两种输入路径</strong>
        <span>输入 <code>成员 320</code> 检索长列表；输入不存在的姓名后按 Enter 创建候选。</span>
        <span>方向键会跨越未渲染项，并自动保持当前项可见。</span>
      </div>
    </section>
  </elf-playground>
`);

export { PageAutocompleteEx6 };
