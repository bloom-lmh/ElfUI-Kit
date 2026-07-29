import { defineHtml, defineStyle, useRef } from "@elfui/core";

import type { TreeNode } from "../../../components/Data/Tree/types";
import { createDocsTranslator } from "../../docsLocale";
import demoStyles from "./demo.scss?inline";

const selected = useRef("");
const t = createDocsTranslator({
  title: { zh: "搜索与自定义匹配", en: "Search and custom matching" },
  label: { zh: "能力目录", en: "Capability catalog" },
  placeholder: { zh: "搜索名称或编号", en: "Search by name or code" },
  product: { zh: "产品研发", en: "Product development" },
  frontend: { zh: "前端工程（FE-12）", en: "Frontend engineering (FE-12)" },
  backend: { zh: "服务端工程（BE-08）", en: "Backend engineering (BE-08)" },
  operations: { zh: "运营支持", en: "Operations" },
  analytics: { zh: "数据分析（DA-03）", en: "Analytics (DA-03)" },
  hint: {
    zh: "过滤由 Tree 公共 filter 协议执行，匹配项会保留祖先路径。",
    en: "Filtering uses Tree's public filter protocol and keeps ancestor paths visible.",
  },
});

const nodes = (): TreeNode[] => [
  {
    key: "product",
    code: "PD-01",
    label: t("product"),
    children: [
      { key: "frontend", code: "FE-12", label: t("frontend") },
      { key: "backend", code: "BE-08", label: t("backend") },
    ],
  },
  {
    key: "operations",
    code: "OP-02",
    label: t("operations"),
    children: [{ key: "analytics", code: "DA-03", label: t("analytics") }],
  },
];

const filterNode = (keyword: string, node: TreeNode): boolean => {
  const search = keyword.trim().toLowerCase();
  return (
    String(node.label || "")
      .toLowerCase()
      .includes(search) ||
    String(node.code || "")
      .toLowerCase()
      .includes(search)
  );
};
const onUpdate = (event: CustomEvent<string>): void =>
  selected.set(event.detail);

const code = `<elf-tree-select
  :data.prop="nodes"
  :modelValue="selected"
  filterable
  :filterNodeMethod.prop="filterNode"
  filter-placeholder="Search by name or code"
/>`;

const script = `const selected = useRef("");
const filterNode = (keyword, node) => {
  const search = keyword.trim().toLowerCase();
  return node.label.toLowerCase().includes(search)
    || node.code.toLowerCase().includes(search);
};`;

defineStyle(demoStyles);

const PageTreeSelectEx3 = defineHtml(`
  <elf-playground :title=${t("title")} :code=${code} :script=${script}>
    <div class="demo-field demo-column">
      <elf-tree-select :data.prop=${nodes()} :modelValue=${selected} :label=${t("label")} filterable
        :filterNodeMethod.prop=${filterNode} :filterPlaceholder=${t("placeholder")} default-expand-all
        @update:modelValue=${onUpdate}></elf-tree-select>
      <small>${t("hint")}</small>
    </div>
  </elf-playground>
`);

export { PageTreeSelectEx3 };
