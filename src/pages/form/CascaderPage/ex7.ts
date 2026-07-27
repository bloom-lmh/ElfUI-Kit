import { defineHtml, useRef } from "@elfui/core";

const modelValue = useRef<unknown[]>([
  ["engineering", "frontend"],
  ["engineering", "quality"]
]);

const options = [
  {
    label: "研发中心",
    value: "engineering",
    children: [
      { label: "前端平台", value: "frontend" },
      { label: "质量保障", value: "quality" },
      { label: "基础架构", value: "infrastructure" }
    ]
  },
  {
    label: "产品中心",
    value: "product",
    children: [
      { label: "设计系统", value: "design" },
      { label: "增长产品", value: "growth" }
    ]
  }
];

const popperOptions = {
  modifiers: [
    { name: "offset", options: { offset: [0, 0] } },
    { name: "flip", enabled: true },
    { name: "preventOverflow", options: { padding: 12 } }
  ]
};

const onUpdate = (event: CustomEvent): void => modelValue.set(event.detail as unknown[]);

const code = `<elf-cascader
  :modelValue=\${modelValue}
  :options.prop=\${options}
  :popperOptions.prop=\${popperOptions}
  multiple
  collapse-tags
  collapse-tags-tooltip
  teleported
  fit-input-width
  @update:modelValue=\${onUpdate}
/>`;

const script = `const modelValue = useRef([
    ["engineering", "frontend"],
    ["engineering", "quality"]
]);
const options = [
    {
        label: "研发中心",
        value: "engineering",
        children: [
            { label: "前端平台", value: "frontend" },
            { label: "质量保障", value: "quality" },
            { label: "基础架构", value: "infrastructure" }
        ]
    },
    {
        label: "产品中心",
        value: "product",
        children: [
            { label: "设计系统", value: "design" },
            { label: "增长产品", value: "growth" }
        ]
    }
];
const popperOptions = {
    modifiers: [
        { name: "offset", options: { offset: [0, 0] } },
        { name: "flip", enabled: true },
        { name: "preventOverflow", options: { padding: 12 } }
    ]
};
const onUpdate = (event) => modelValue.set(event.detail);`;

const PageCascaderEx7 = defineHtml(`
  <h2>多选标签与视口浮层</h2>
  <elf-playground title="remove-tag / teleported / collision positioning" :code=${code} :script=${script}>
    <span slot="status" class="demo-state">↑↓ 同列移动 · → 进入子级 · ← 返回父级 · Enter 选择</span>
    <div
      style="width:min(100%,560px);height:126px;overflow:hidden;transform:translateZ(0);border:1px dashed var(--elf-border);border-radius:12px;padding:18px;box-sizing:border-box;display:flex;align-items:flex-end"
    >
      <elf-cascader
        :modelValue=${modelValue}
        :options.prop=${options}
        :popperOptions.prop=${popperOptions}
        multiple
        clearable
        collapse-tags
        collapse-tags-tooltip
        teleported
        fit-input-width
        placeholder="选择负责团队"
        @update:modelValue=${onUpdate}
      >
        <span slot="prefix" aria-hidden="true">⌘</span>
        <strong slot="header" style="display:block;padding:10px 12px;border-bottom:1px solid var(--elf-divider)">选择负责团队</strong>
        <small slot="footer" style="display:block;padding:8px 12px;border-top:1px solid var(--elf-divider);color:var(--elf-text-secondary)">支持键盘方向键浏览</small>
      </elf-cascader>
    </div>
  </elf-playground>
`);

export { PageCascaderEx7 };
