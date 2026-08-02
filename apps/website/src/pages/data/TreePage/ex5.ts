import { defineHtml, useComputed, useRef } from "@elfui/core";
import type { TreeNode } from "@elfui/kit-src/components/Data/Tree";
import { createDocsTranslator } from "../../docsLocale";

const folderKeys = Array.from({ length: 334 }, (_, index) => `folder-${index + 1}`);
const expanded = useRef<string[]>(folderKeys);
const selected = useRef("asset-1");

const t = createDocsTranslator({
  title: { zh: "虚拟树", en: "Virtual tree" },
  folder: { zh: "项目目录", en: "Project folder" },
  asset: { zh: "设计资源", en: "Design asset" },
  total: { zh: "总节点", en: "Total nodes" },
  selected: { zh: "当前选中", en: "Selected" },
  search: { zh: "搜索 2,004 个节点", en: "Search 2,004 nodes" },
  aria: { zh: "项目资产目录", en: "Project asset directory" },
});

const data = useComputed<TreeNode[]>(() =>
  folderKeys.map((key, folderIndex) => ({
    key,
    label: `${t("folder")} ${String(folderIndex + 1).padStart(3, "0")}`,
    icon: "📁",
    children: Array.from({ length: 5 }, (_, itemIndex) => {
      const assetIndex = folderIndex * 5 + itemIndex + 1;
      return {
        key: `asset-${assetIndex}`,
        label: `${t("asset")} ${String(assetIndex).padStart(4, "0")}`,
        icon: "◻",
        isLeaf: true,
      };
    }),
  })),
);

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
  <elf-playground :title=${t("title")} :code=${code} :script=${script}>
    <span slot="status" class="demo-state">
      ${t("total")} · 2,004 · ${t("selected")} · ${selected}
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
        :filterPlaceholder.prop=${t("search")}
        scrollbar-always-on
        :ariaLabel.prop=${t("aria")}
        @update:expandedKeys=${onExpanded}
        @update:modelValue=${onSelect}
      ></elf-tree>
    </elf-card>
  </elf-playground>
`);

export { PageTreeEx5 };
