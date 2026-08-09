import { defineHtml, defineStyle, useRef } from "@elfui/core";

import type { TreeNode } from "@elfui/kit";
import { createDocsTranslator } from "../../docsLocale";
import demoStyles from "./demo.scss?inline";

const linked = useRef<string[]>(["web"]);
const strict = useRef<string[]>(["platform", "web"]);
const t = createDocsTranslator({
  title: {
    zh: "多选与勾选策略",
    en: "Multiple selection and check strategies",
  },
  linked: { zh: "父子联动", en: "Parent-child cascade" },
  linkedHint: {
    zh: "勾选父节点会选择所有可用后代。",
    en: "Checking a parent selects every enabled descendant.",
  },
  strict: { zh: "严格勾选", en: "Strict checking" },
  strictHint: {
    zh: "父节点与子节点保持独立。",
    en: "Parent and child nodes remain independent.",
  },
  platform: { zh: "平台研发", en: "Platform engineering" },
  web: { zh: "前端平台", en: "Web platform" },
  api: { zh: "服务端平台", en: "API platform" },
  design: { zh: "设计系统", en: "Design system" },
  tokens: { zh: "设计令牌", en: "Design tokens" },
  components: { zh: "组件规范", en: "Component standards" },
  count: { zh: "已选节点", en: "Selected nodes" },
});

const nodes = (): TreeNode[] => [
  {
    key: "platform",
    label: t("platform"),
    children: [
      { key: "web", label: t("web") },
      { key: "api", label: t("api") },
    ],
  },
  {
    key: "design",
    label: t("design"),
    children: [
      { key: "tokens", label: t("tokens") },
      { key: "components", label: t("components") },
    ],
  },
];

const updateLinked = (event: CustomEvent<string[]>): void => linked.set(event.detail);
const updateStrict = (event: CustomEvent<string[]>): void => strict.set(event.detail);

const code = `<elf-tree-select
  :data.prop="nodes"
  :modelValue.prop="selected"
  multiple
  collapse-tags
  :maxCollapseTags="1"
  default-expand-all
  @update:modelValue="onUpdate"
/>

<elf-tree-select
  :data.prop="nodes"
  :modelValue.prop="strictSelected"
  multiple
  check-strictly
/>`;

const script = `const selected = useRef(["web"]);
const strictSelected = useRef(["platform", "web"]);
const onUpdate = (event) => selected.set(event.detail);`;

defineStyle(demoStyles);

const PageTreeSelectEx2 = defineHtml(`
  <elf-playground :title=${t("title")} :code=${code} :script=${script}>
    <div class="demo-grid">
      <div class="demo-column">
        <strong>${t("linked")}</strong>
        <small>${t("linkedHint")}</small>
        <elf-tree-select :data.prop=${nodes()} :modelValue.prop=${linked} multiple collapse-tags
          :maxCollapseTags=${1} default-expand-all @update:modelValue=${updateLinked}></elf-tree-select>
      </div>
      <div class="demo-column">
        <strong>${t("strict")}</strong>
        <small>${t("strictHint")}</small>
        <elf-tree-select :data.prop=${nodes()} :modelValue.prop=${strict} multiple check-strictly
          collapse-tags :maxCollapseTags=${1} default-expand-all @update:modelValue=${updateStrict}></elf-tree-select>
      </div>
    </div>
    <span slot="status" class="demo-state">${t("count")} · ${linked.value.length} / ${strict.value.length}</span>
  </elf-playground>
`);

export { PageTreeSelectEx2 };
