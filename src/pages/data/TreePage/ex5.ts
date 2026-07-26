import { defineHtml, useRef } from "@elfui/core";
import type { TreeNode } from "../../../components/Data/Tree";

const activity = useRef("2,004 节点 · 按住整行即可将资源拖到另一个目录");
const folderKeys = Array.from({ length: 334 }, (_, index) => `folder-${index + 1}`);
const expanded = useRef<string[]>(folderKeys);

const data: TreeNode[] = folderKeys.map((key, folderIndex) => ({
  key,
  label: `项目目录 ${String(folderIndex + 1).padStart(2, "0")}`,
  icon: "📁",
  isLeaf: false,
  children: Array.from({ length: 5 }, (_, itemIndex) => {
    const assetIndex = folderIndex * 5 + itemIndex + 1;
    return {
      key: `asset-${assetIndex}`,
      label: `设计资源 ${String(assetIndex).padStart(4, "0")}`,
      icon: "◻",
      isLeaf: true,
    };
  }),
}));

const allowDrag = (node: TreeNode): boolean => node.isLeaf === true;
const allowDrop = (_dragging: TreeNode, target: TreeNode): boolean => target.isLeaf !== true;
const updateExpanded = (event: CustomEvent<string[]>): void => {
  expanded.set(Array.isArray(event.detail) ? event.detail : []);
};

const onDrop = (event: CustomEvent<unknown>): void => {
  const detail = Array.isArray(event.detail) ? event.detail : [];
  const dragging = detail[0] as TreeNode | undefined;
  const target = detail[1] as TreeNode | undefined;
  activity.set(`已移动：${dragging?.label || "节点"} → ${target?.label || "目录"}`);
};

const code = `<elf-tree
  :data.prop="data"
  :height="320"
  :item-size="40"
  :overscan="6"
  :expandedKeys.prop="expanded"
  :allowDrag.prop="allowDrag"
  :allowDrop.prop="allowDrop"
  virtual
  draggable
  filterable
/>`;

const script = `const expanded = useRef(["folder-1", "folder-2"]);
const data = [
  {
    key: "folder-1",
    label: "Project folder 01",
    isLeaf: false,
    children: [
      { key: "asset-1", label: "Design asset 0001", isLeaf: true }
    ]
  }
];

const allowDrag = (node) => node.isLeaf === true;
const allowDrop = (_dragging, target) => target.isLeaf !== true;`;

const PageTreeEx5 = defineHtml(`
  <h2>虚拟树与拖拽</h2>
  <elf-playground title="2,004 项分层资产目录" :code=${code} :script=${script}>
    <span slot="status" class="demo-state">{{ activity }} · 整行拖拽，目标目录进入时立即高亮</span>
    <elf-card variant="outlined" density="compact" style="width:100%;max-width:560px">
      <elf-tree
        :data.prop=${data}
        :height=${320}
        :itemSize=${40}
        :overscan=${6}
        :expandedKeys.prop=${expanded.value}
        :allowDrag.prop=${allowDrag}
        :allowDrop.prop=${allowDrop}
        virtual
        draggable
        filterable
        @update:expandedKeys=${updateExpanded}
        @node-drop=${onDrop}
      ></elf-tree>
    </elf-card>
  </elf-playground>
`);

export { PageTreeEx5 };
