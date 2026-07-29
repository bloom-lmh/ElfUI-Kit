import { defineHtml, defineStyle, useRef } from "@elfui/core";

import type { TreeNode } from "../../../components/Data/Tree/types";
import { createDocsTranslator } from "../../docsLocale";
import demoStyles from "./demo.scss?inline";

const selected = useRef("");
const t = createDocsTranslator({
  title: { zh: "基础单选", en: "Basic selection" },
  label: { zh: "负责团队", en: "Owning team" },
  placeholder: { zh: "选择团队", en: "Choose a team" },
  platform: { zh: "平台研发", en: "Platform engineering" },
  web: { zh: "前端平台", en: "Web platform" },
  api: { zh: "服务端平台", en: "API platform" },
  quality: { zh: "质量保障", en: "Quality assurance" },
  unit: { zh: "单元测试", en: "Unit testing" },
  e2e: { zh: "端到端测试（禁用）", en: "End-to-end testing (disabled)" },
  selected: { zh: "当前选择", en: "Selected" },
  none: { zh: "未选择", en: "None" },
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
    key: "quality",
    label: t("quality"),
    children: [
      { key: "unit", label: t("unit") },
      { key: "e2e", label: t("e2e"), disabled: true },
    ],
  },
];

const onUpdate = (event: CustomEvent<string>): void =>
  selected.set(event.detail);

const code = `<elf-tree-select
  :data.prop="teams"
  :modelValue="team"
  label="Owning team"
  placeholder="Choose a team"
  :defaultExpandedKeys.prop="['platform']"
  clearable
  @update:modelValue="onUpdate"
/>`;

const script = `const team = useRef("");
const teams = [
  {
    key: "platform",
    label: "Platform engineering",
    children: [
      { key: "web", label: "Web platform" },
      { key: "api", label: "API platform" },
    ],
  },
];
const onUpdate = (event) => team.set(event.detail);`;

defineStyle(demoStyles);

const PageTreeSelectEx1 = defineHtml(`
  <elf-playground :title=${t("title")} :code=${code} :script=${script}>
    <div class="demo-field">
      <elf-tree-select
        :data.prop=${nodes()}
        :modelValue=${selected}
        :label=${t("label")}
        :placeholder=${t("placeholder")}
        :defaultExpandedKeys.prop=${["platform"]}
        clearable
        @update:modelValue=${onUpdate}
      ></elf-tree-select>
    </div>
    <span slot="status" class="demo-state">${t("selected")} · ${selected.value || t("none")}</span>
  </elf-playground>
`);

export { PageTreeSelectEx1 };
