import { defineHtml, useEffect, useRef, useTemplateRef } from "@elfui/core";
import type { TreeExpose, TreeNode } from "@elfui/kit-src/components/Data/Tree";
import { createDocsTranslator } from "../../docsLocale";

const selected = useRef("services");
const sequence = useRef(1);
const treeRef = useTemplateRef<HTMLElement & TreeExpose>("tree");

const t = createDocsTranslator({
  title: { zh: "异步维护", en: "Lazy editing" },
  hint: { zh: "展开节点以异步加载", en: "Expand a node to load its children" },
  loading: { zh: "正在加载", en: "Loading" },
  loaded: { zh: "已加载", en: "loaded" },
  items: { zh: "项", en: "items" },
  appended: { zh: "已追加到", en: "Appended to" },
  removed: { zh: "已移除", en: "Removed" },
  append: { zh: "追加子节点", en: "Append child" },
  remove: { zh: "移除选中", en: "Remove selected" },
  services: { zh: "服务", en: "Services" },
  workers: { zh: "任务进程", en: "Workers" },
  api: { zh: "API 网关", en: "API gateway" },
  jobs: { zh: "后台任务", en: "Background jobs" },
  manual: { zh: "手动节点", en: "Manual node" },
  aria: { zh: "异步资源目录", en: "Lazy resource directory" },
});

type Activity =
  | { type: "hint" }
  | { type: "loading"; subject: string }
  | { type: "loaded"; subject: string; count: number }
  | { type: "appended"; subject: string }
  | { type: "removed"; subject: string };

const activity = useRef<Activity>({ type: "hint" });
const data = useRef<TreeNode[]>([
  { key: "services", label: t("services"), isLeaf: false },
  { key: "workers", label: t("workers"), isLeaf: false },
]);

const labelForKey = (key: unknown, fallback = ""): string => {
  const value = String(key || "");
  if (value === "services") return t("services");
  if (value === "workers") return t("workers");
  if (value.endsWith("-api")) return t("api");
  if (value.endsWith("-jobs")) return t("jobs");
  if (value.startsWith("manual-")) return `${t("manual")} ${value.slice(7)}`;
  return fallback;
};

useEffect(() => {
  data.set(
    data.peek().map((node) => {
      const translatedNode: TreeNode = {
        ...node,
        label: labelForKey(node.key, String(node.label || "")),
      };
      if (node.children) {
        translatedNode.children = node.children.map((child) => ({
          ...child,
          label: labelForKey(child.key, String(child.label || "")),
        }));
      }
      return translatedNode;
    }),
  );
});

const activityText = (): string => {
  const current = activity.value;
  if (current.type === "hint") return t("hint");
  if (current.type === "loading") return `${t("loading")} ${current.subject}…`;
  if (current.type === "loaded") {
    return `${current.subject} ${t("loaded")} ${current.count} ${t("items")}`;
  }
  return `${t(current.type)} ${current.subject}`;
};

const load = async (node: TreeNode): Promise<TreeNode[]> => {
  activity.set({ type: "loading", subject: String(node.label || "") });
  await new Promise((resolve) => setTimeout(resolve, 240));
  const children = [
    { key: `${node.key}-api`, label: t("api"), isLeaf: true },
    { key: `${node.key}-jobs`, label: t("jobs"), isLeaf: true },
  ];
  activity.set({ type: "loaded", subject: String(node.label || ""), count: children.length });
  return children;
};

const onSelect = (event: CustomEvent<string>): void => {
  selected.set(String(event.detail || ""));
};

const appendChild = (): void => {
  const parent = selected.value || "services";
  const id = sequence.value;
  sequence.set(id + 1);
  treeRef.value?.appendNode(
    {
      key: `manual-${id}`,
      label: `${t("manual")} ${id}`,
      isLeaf: true,
    },
    parent,
  );
  activity.set({ type: "appended", subject: labelForKey(parent, parent) });
};

const removeSelected = (): void => {
  if (!selected.value || selected.value === "services" || selected.value === "workers") return;
  const removed = treeRef.value?.removeNode(selected.value);
  if (removed) activity.set({ type: "removed", subject: String(removed.label || "") });
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
  <elf-playground :title=${t("title")} :code=${code} :script=${script}>
    <div slot="status" class="demo-actions" style="display:inline-flex;align-items:center;gap:6px">
      <span class="demo-state">${activityText()}</span>
      <elf-button size="small" variant="text" @click=${appendChild}>${t("append")}</elf-button>
      <elf-button size="small" variant="text" @click=${removeSelected}>${t("remove")}</elf-button>
    </div>
    <elf-card variant="outlined" density="compact" style="width:100%;max-width:560px">
      <elf-tree
        ref="tree"
        :data.prop=${data}
        :load.prop=${load}
        :modelValue.prop=${selected}
        :ariaLabel.prop=${t("aria")}
        lazy
        bordered
        @update:modelValue=${onSelect}
      ></elf-tree>
    </elf-card>
  </elf-playground>
`);

export { PageTreeEx4 };
