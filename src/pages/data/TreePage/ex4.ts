import { defineHtml, useRef, useTemplateRef } from "@elfui/core";
import type { TreeExpose, TreeNode } from "../../../components/Data/Tree";

const selected = useRef("services");
const activity = useRef("展开节点以异步加载");
const sequence = useRef(1);
const treeRef = useTemplateRef<HTMLElement & TreeExpose>("tree");

const data: TreeNode[] = [
  { key: "services", label: "Services", isLeaf: false },
  { key: "workers", label: "Workers", isLeaf: false }
];

const load = async (node: TreeNode): Promise<TreeNode[]> => {
  activity.set(`正在加载 ${node.label}…`);
  await new Promise((resolve) => setTimeout(resolve, 240));
  const children = [
    { key: `${node.key}-api`, label: "API gateway", isLeaf: true },
    { key: `${node.key}-jobs`, label: "Background jobs", isLeaf: true }
  ];
  activity.set(`${node.label} 已加载 ${children.length} 项`);
  return children;
};

const onSelect = (event: CustomEvent<string>): void => {
  selected.set(String(event.detail || ""));
};

const appendChild = (): void => {
  const parent = selected.value || "services";
  const id = sequence.value;
  sequence.set(id + 1);
  treeRef.value?.appendNode({ key: `manual-${id}`, label: `Manual node ${id}`, isLeaf: true }, parent);
  activity.set(`已追加到 ${parent}`);
};

const removeSelected = (): void => {
  if (!selected.value || selected.value === "services" || selected.value === "workers") return;
  const removed = treeRef.value?.removeNode(selected.value);
  if (removed) activity.set(`已移除 ${removed.label}`);
  selected.set("");
};

const code = `<elf-tree
  ref="tree"
  :data.prop="data"
  :load.prop="load"
  :modelValue.prop="selected"
  lazy
  bordered
  @update:modelValue="onSelect"
/>`;

const script = `const treeRef = useTemplateRef("tree");
const selected = useRef("services");
const data = [
  { key: "services", label: "Services", isLeaf: false },
  { key: "workers", label: "Workers", isLeaf: false }
];

const load = async (node) => {
  await fetchChildren(node.key);
  return [
    { key: \`\${node.key}-api\`, label: "API gateway", isLeaf: true },
    { key: \`\${node.key}-jobs\`, label: "Background jobs", isLeaf: true }
  ];
};

const appendChild = () => treeRef.value?.appendNode(
  { key: crypto.randomUUID(), label: "Manual node", isLeaf: true },
  selected.value
);

const removeSelected = () => treeRef.value?.removeNode(selected.value);`;

const PageTreeEx4 = defineHtml(`
  <h2>懒加载与节点维护</h2>
  <elf-playground title="异步资源目录" :code=${code} :script=${script}>
    <div slot="status" class="demo-actions" style="display:inline-flex;align-items:center;gap:6px">
      <span class="demo-state">{{ activity }}</span>
      <elf-button size="small" variant="text" @click=${appendChild}>追加子节点</elf-button>
      <elf-button size="small" variant="text" @click=${removeSelected}>移除选中</elf-button>
    </div>
    <elf-card variant="outlined" density="compact" style="width:100%;max-width:560px">
      <elf-tree
        ref="tree"
        :data.prop=${data}
        :load.prop=${load}
        :modelValue.prop=${selected}
        lazy
        bordered
        @update:modelValue=${onSelect}
      ></elf-tree>
    </elf-card>
  </elf-playground>
`);

export { PageTreeEx4 };
