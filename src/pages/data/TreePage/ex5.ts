import { defineHtml, useRef } from "@elfui/core";
import type { TreeNode } from "../../../components/Data/Tree";

const folderKeys = Array.from({ length: 334 }, (_, index) => `folder-${index + 1}`);
const expanded = useRef<string[]>(folderKeys);
const selected = useRef("asset-1");

const data: TreeNode[] = folderKeys.map((key, folderIndex) => ({
  key,
  label: `项目目录 ${String(folderIndex + 1).padStart(3, "0")}`,
  icon: "📁",
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

const onExpanded = (event: CustomEvent<string[]>): void => {
  expanded.set(Array.isArray(event.detail) ? event.detail : []);
};

const onSelect = (event: CustomEvent<string>): void => {
  selected.set(String(event.detail || ""));
};

const code = `<elf-tree
  :data.prop="data"
  :expandedKeys.prop="expanded"
  :modelValue.prop="selected"
  :height="320"
  :item-size="40"
  virtual
  filterable
/>`;

const script = `const expanded = useRef(folderKeys);
const selected = useRef("asset-1");

const onExpanded = (event) => expanded.set(event.detail);
const onSelect = (event) => selected.set(event.detail);`;

const PageTreeEx5 = defineHtml(`
  <h2>虚拟树</h2>
  <elf-playground title="2,004 个节点的可视窗口" :code=${code} :script=${script}>
    <span slot="status" class="demo-state">
      总节点 2,004 · 当前选中：${selected}
    </span>
    <elf-card variant="outlined" density="compact" style="width:100%;max-width:560px">
      <elf-tree
        :data.prop=${data}
        :height=${320}
        :itemSize=${40}
        :overscan=${6}
        :expandedKeys.prop=${expanded}
        :modelValue.prop=${selected}
        virtual
        filterable
        scrollbar-always-on
        aria-label="项目资产目录"
        @update:expandedKeys=${onExpanded}
        @update:modelValue=${onSelect}
      ></elf-tree>
    </elf-card>
  </elf-playground>
`);

export { PageTreeEx5 };
