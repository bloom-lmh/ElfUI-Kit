import { defineHtml, useRef } from "@elfui/core";


const selected = useRef("install");

const expanded = useRef<string[]>(["guide"]);

const data = [
  {
    key: "guide",
    label: "指南",
    icon: "📘",
    children: [
      { key: "install", label: "安装" },
      { key: "quick-start", label: "快速开始" }
    ]
  },
  {
    key: "components",
    label: "组件",
    icon: "🧩",
    children: [
      { key: "button", label: "Button 按钮" },
      { key: "tree", label: "Tree 树" },
      { key: "menu", label: "Menu 菜单" }
    ]
  }
];

const onSelect = (event: Event): void => {
  const detail = (event as CustomEvent).detail;
  if (detail) selected.set(detail);
};

const onExpanded = (event: Event): void => {
  const detail = (event as CustomEvent).detail;
  if (Array.isArray(detail)) expanded.set(detail);
};

const selectedText = (): string => selected.value || "未选择";

const expandedText = (): string => expanded.value.join(", ") || "无";

const code = `const selected = useRef("install")
const expanded = useRef(["guide"])

<elf-tree
  :data.prop="data"
  :modelValue.prop="selected"
  :expandedKeys.prop="expanded"
  @update:modelValue="onSelect"
  @update:expandedKeys="onExpanded"
/>`;

const script = `const selected = useRef("install");
const expanded = useRef(["guide"]);
const data = [
    {
        key: "guide",
        label: "指南",
        icon: "📘",
        children: [
            { key: "install", label: "安装" },
            { key: "quick-start", label: "快速开始" }
        ]
    },
    {
        key: "components",
        label: "组件",
        icon: "🧩",
        children: [
            { key: "button", label: "Button 按钮" },
            { key: "tree", label: "Tree 树" },
            { key: "menu", label: "Menu 菜单" }
        ]
    }
];
const onSelect = (event) => {
    const detail = event.detail;
    if (detail)
        selected.set(detail);
};
const onExpanded = (event) => {
    const detail = event.detail;
    if (Array.isArray(detail))
        expanded.set(detail);
};`;

const PageTreeEx1 = defineHtml(`
  <h2>基础用法</h2>
  <elf-playground title="点击节点选择，点击箭头展开或收起" :code="code" :script=${script}>
    <elf-card variant="outlined" density="compact" style="width:100%;max-width:560px">
      <elf-tree
      :data.prop="data"
      :modelValue.prop="selected"
      :expandedKeys.prop="expanded"
      @update:modelValue="onSelect"
      @update:expandedKeys="onExpanded"
      ></elf-tree>
    </elf-card>
    <p slot="status" class="demo-state">当前选中：{{ selectedText() }}；展开节点：{{ expandedText() }}</p>
  </elf-playground>
`);

export { PageTreeEx1 };
