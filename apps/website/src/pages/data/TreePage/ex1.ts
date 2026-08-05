import { defineHtml, useRef } from "@elfui/core";

import { createDocsTranslator } from "../../docsLocale";

const selected = useRef("install");
const expanded = useRef<string[]>(["guide"]);

const t = createDocsTranslator({
  title: { zh: "Tree 基础选择", en: "Tree basic selection" },
  statusSelected: { zh: "当前选中", en: "Selected" },
  statusExpanded: { zh: "展开节点", en: "Expanded" },
  none: { zh: "无", en: "None" },
  guide: { zh: "指南", en: "Guide" },
  install: { zh: "安装", en: "Installation" },
  quickStart: { zh: "快速开始", en: "Quick start" },
  components: { zh: "组件", en: "Components" },
  button: { zh: "Button 按钮", en: "Button" },
  tree: { zh: "Tree 树", en: "Tree" },
  menu: { zh: "Menu 菜单", en: "Menu" },
  aria: { zh: "文档导航树", en: "Documentation navigation tree" },
});

const data = () => [
  {
    key: "guide",
    label: t("guide"),
    icon: "📘",
    children: [
      { key: "install", label: t("install") },
      { key: "quick-start", label: t("quickStart") },
    ],
  },
  {
    key: "components",
    label: t("components"),
    icon: "🧩",
    children: [
      { key: "button", label: t("button") },
      { key: "tree", label: t("tree") },
      { key: "menu", label: t("menu") },
    ],
  },
];

const onSelect = (event: Event): void => {
  const detail = (event as CustomEvent).detail;
  if (detail) selected.set(detail);
};

const onExpanded = (event: Event): void => {
  const detail = (event as CustomEvent).detail;
  if (Array.isArray(detail)) expanded.set(detail);
};

const selectedText = (): string => selected.value || t("none");
const expandedText = (): string => expanded.value.join(", ") || t("none");

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
  <elf-playground :title=${t("title")} :code=${code} :script=${script}>
    <elf-card variant="outlined" density="compact" style="width:100%;max-width:560px">
      <elf-tree
        :data.prop=${data()}
        :modelValue.prop=${selected}
        :expandedKeys.prop=${expanded}
        :ariaLabel.prop=${t("aria")}
        @update:modelValue=${onSelect}
        @update:expandedKeys=${onExpanded}
      />
    </elf-card>
    <p slot="status" class="demo-state">
      ${t("statusSelected")} · ${selectedText()} · ${t("statusExpanded")} · ${expandedText()}
    </p>
  </elf-playground>
`);

export { PageTreeEx1 };
