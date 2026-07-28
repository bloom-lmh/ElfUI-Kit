import { defineHtml, useComputed, useRef } from "@elfui/core";
import type { TreeNode } from "../../../components/Data/Tree";
import { createDocsTranslator } from "../../docsLocale";

const expanded = useRef<string[]>(["design", "engineering", "archive"]);

const t = createDocsTranslator({
  title: { zh: "目录拖拽", en: "Folder drag and drop" },
  hint: { zh: "拖动文件，将它放入另一个目录", en: "Drag a file into another folder" },
  moved: { zh: "已移动", en: "Moved" },
  file: { zh: "文件", en: "File" },
  folder: { zh: "目录", en: "Folder" },
  design: { zh: "设计交付", en: "Design delivery" },
  logo: { zh: "品牌标志.fig", en: "Brand logo.fig" },
  tokens: { zh: "设计变量.json", en: "Design tokens.json" },
  engineering: { zh: "工程资源", en: "Engineering resources" },
  readme: { zh: "README.md", en: "README.md" },
  archive: { zh: "归档", en: "Archive" },
  legacy: { zh: "旧版归档.zip", en: "legacy.zip" },
  aria: { zh: "可拖拽资源目录", en: "Draggable resource directory" }
});

const data = useComputed<TreeNode[]>(() => [
  {
    key: "design",
    label: t("design"),
    icon: "📁",
    children: [
      { key: "logo", label: t("logo"), icon: "◆", isLeaf: true },
      { key: "tokens", label: t("tokens"), icon: "{}", isLeaf: true },
    ],
  },
  {
    key: "engineering",
    label: t("engineering"),
    icon: "📁",
    children: [
      { key: "readme", label: t("readme"), icon: "#", isLeaf: true },
    ],
  },
  {
    key: "archive",
    label: t("archive"),
    icon: "📦",
    children: [
      { key: "legacy", label: t("legacy"), icon: "↓", isLeaf: true },
    ],
  },
]);

const movement = useRef<{ source: string; target: string } | null>(null);
const nodeLabel = (key: string, fallback: string): string => {
  const known = ["design", "logo", "tokens", "engineering", "readme", "archive", "legacy"] as const;
  return known.includes(key as typeof known[number])
    ? t(key as typeof known[number])
    : fallback;
};
const activityText = (): string => movement.value
  ? `${t("moved")} · ${nodeLabel(movement.value.source, t("file"))} → ${nodeLabel(movement.value.target, t("folder"))}`
  : t("hint");

const allowDrag = (node: TreeNode): boolean => node.isLeaf === true;
const allowDrop = (_dragging: TreeNode, target: TreeNode): boolean => target.isLeaf !== true;

const onExpanded = (event: CustomEvent<string[]>): void => {
  expanded.set(Array.isArray(event.detail) ? event.detail : []);
};

const onDrop = (event: CustomEvent<unknown[]>): void => {
  const [dragging, target] = Array.isArray(event.detail) ? event.detail : [];
  movement.set({
    source: String((dragging as TreeNode | undefined)?.key || ""),
    target: String((target as TreeNode | undefined)?.key || "")
  });
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
  <elf-playground :title=${t("title")} :code=${code} :script=${script}>
    <span slot="status" class="demo-state">${activityText()}</span>
    <elf-card variant="outlined" density="compact" style="width:100%;max-width:560px">
      <elf-tree
        :data.prop=${data}
        :expandedKeys.prop=${expanded}
        :allowDrag.prop=${allowDrag}
        :allowDrop.prop=${allowDrop}
        draggable
        bordered
        :ariaLabel.prop=${t("aria")}
        @update:expandedKeys=${onExpanded}
        @node-drop=${onDrop}
      ></elf-tree>
    </elf-card>
  </elf-playground>
`);

export { PageTreeEx6 };
