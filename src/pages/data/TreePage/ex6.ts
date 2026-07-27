import { defineHtml, useRef } from "@elfui/core";
import type { TreeNode } from "../../../components/Data/Tree";

const activity = useRef("拖动文件卡片，将它放入另一个目录");
const expanded = useRef<string[]>(["design", "engineering", "archive"]);

const data: TreeNode[] = [
  {
    key: "design",
    label: "设计交付",
    icon: "📁",
    children: [
      { key: "logo", label: "品牌标志.fig", icon: "◆", isLeaf: true },
      { key: "tokens", label: "设计变量.json", icon: "{}", isLeaf: true },
    ],
  },
  {
    key: "engineering",
    label: "工程资源",
    icon: "📁",
    children: [
      { key: "readme", label: "README.md", icon: "#", isLeaf: true },
    ],
  },
  {
    key: "archive",
    label: "归档",
    icon: "📦",
    children: [
      { key: "legacy", label: "legacy.zip", icon: "↓", isLeaf: true },
    ],
  },
];

const allowDrag = (node: TreeNode): boolean => node.isLeaf === true;
const allowDrop = (_dragging: TreeNode, target: TreeNode): boolean => target.isLeaf !== true;

const onExpanded = (event: CustomEvent<string[]>): void => {
  expanded.set(Array.isArray(event.detail) ? event.detail : []);
};

const onDrop = (event: CustomEvent<unknown[]>): void => {
  const [dragging, target] = Array.isArray(event.detail) ? event.detail : [];
  activity.set(`已移动：${(dragging as TreeNode | undefined)?.label || "文件"} → ${(target as TreeNode | undefined)?.label || "目录"}`);
};

const code = `<elf-tree
  :data.prop="data"
  :expandedKeys.prop="expanded"
  :allowDrag.prop="allowDrag"
  :allowDrop.prop="allowDrop"
  draggable
  @node-drop="onDrop"
/>`;

const script = `const allowDrag = (node) => node.isLeaf === true;
const allowDrop = (_dragging, target) => target.isLeaf !== true;

const onDrop = (event) => {
  const [dragging, target] = event.detail;
  console.log(\`Moved \${dragging.label} to \${target.label}\`);
};`;

const PageTreeEx6 = defineHtml(`
  <h2>目录拖拽</h2>
  <elf-playground title="文件只能拖入目录" :code=${code} :script=${script}>
    <span slot="status" class="demo-state">${activity}</span>
    <elf-card variant="outlined" density="compact" style="width:100%;max-width:560px">
      <elf-tree
        :data.prop=${data}
        :expandedKeys.prop=${expanded}
        :allowDrag.prop=${allowDrag}
        :allowDrop.prop=${allowDrop}
        draggable
        bordered
        aria-label="可拖拽资源目录"
        @update:expandedKeys=${onExpanded}
        @node-drop=${onDrop}
      ></elf-tree>
    </elf-card>
  </elf-playground>
`);

export { PageTreeEx6 };
