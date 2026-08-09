import { defineHtml, defineStyle, useRef } from "@elfui/core";

import type { TreeNode } from "@elfui/kit";
import { createDocsTranslator } from "../../docsLocale";
import demoStyles from "./demo.scss?inline";

const lazyValue = useRef("");
const virtualValue = useRef("node-2048");
const t = createDocsTranslator({
  title: { zh: "懒加载与虚拟树", en: "Lazy loading and virtual tree" },
  lazy: { zh: "按需加载组织", en: "Load organization on demand" },
  lazyHint: {
    zh: "展开节点时异步获取下一级。",
    en: "Fetch the next level when a node expands.",
  },
  virtual: { zh: "10,000 个节点", en: "10,000 nodes" },
  virtualHint: {
    zh: "只渲染视口附近的树节点。",
    en: "Only nodes near the viewport are rendered.",
  },
  engineering: { zh: "研发中心", en: "Engineering" },
  design: { zh: "设计中心", en: "Design" },
  team: { zh: "团队", en: "team" },
  selected: { zh: "虚拟树选中", en: "Virtual selection" },
});

const lazyNodes = (): TreeNode[] => [
  { key: "engineering", label: t("engineering"), isLeaf: false },
  { key: "design", label: t("design"), isLeaf: false },
];
const virtualNodes = (): TreeNode[] =>
  Array.from({ length: 10_000 }, (_, index) => ({
    key: `node-${index}`,
    label: `${t("team")} ${String(index + 1).padStart(5, "0")}`,
  }));

const load = async (node: TreeNode): Promise<TreeNode[]> => {
  await new Promise((resolve) => setTimeout(resolve, 240));
  return Array.from({ length: 4 }, (_, index) => ({
    key: `${String(node.key)}-${index + 1}`,
    label: `${String(node.label)} / ${t("team")} ${index + 1}`,
    isLeaf: true,
  }));
};
const updateLazy = (event: CustomEvent<string>): void => lazyValue.set(event.detail);
const updateVirtual = (event: CustomEvent<string>): void => virtualValue.set(event.detail);

const code = `<elf-tree-select
  :data.prop="roots"
  :modelValue="selected"
  lazy
  :load.prop="load"
/>

<elf-tree-select
  :data.prop="largeTree"
  :modelValue="virtualSelected"
  virtual
  :height="240"
  :itemSize="40"
/>`;

const script = `const load = async (node) => {
  const children = await fetchChildren(node.key);
  return children;
};

const largeTree = Array.from({ length: 10_000 }, (_, index) => ({
  key: \`node-\${index}\`,
  label: \`Team \${index + 1}\`,
}));`;

defineStyle(demoStyles);

const PageTreeSelectEx4 = defineHtml(`
  <elf-playground :title=${t("title")} :code=${code} :script=${script}>
    <div class="demo-grid">
      <div class="demo-column">
        <strong>${t("lazy")}</strong>
        <small>${t("lazyHint")}</small>
        <elf-tree-select :data.prop=${lazyNodes()} :modelValue=${lazyValue} lazy :load.prop=${load}
          @update:modelValue=${updateLazy}></elf-tree-select>
      </div>
      <div class="demo-column">
        <strong>${t("virtual")}</strong>
        <small>${t("virtualHint")}</small>
        <elf-tree-select :data.prop=${virtualNodes()} :modelValue=${virtualValue} virtual
          :height=${240} :itemSize=${40} :overscan=${6} @update:modelValue=${updateVirtual}></elf-tree-select>
      </div>
    </div>
    <span slot="status" class="demo-state">${t("selected")} · ${virtualValue.value}</span>
  </elf-playground>
`);

export { PageTreeSelectEx4 };
