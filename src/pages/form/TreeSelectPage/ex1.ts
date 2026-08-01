import { defineHtml, defineStyle, useRef } from "@elfui/core";

import type { TreeNode } from "../../../components/Data/Tree/types";
import { createDocsTranslator } from "../../docsLocale";
import demoStyles from "./demo.scss?inline";

const selected = useRef("");
const variant = useRef("filled");
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
  controls: { zh: "树选择器配置", en: "Tree select controls" },
  appearance: { zh: "外观", en: "Appearance" },
});

const variantOptions = [
  { label: "Filled", value: "filled" },
  { label: "Outlined", value: "outlined" },
  { label: "Underlined", value: "underlined" },
  { label: "Solo", value: "solo" },
  { label: "Solo filled", value: "solo-filled" },
  { label: "Solo inverted", value: "solo-inverted" },
];

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

const onUpdate = (event: CustomEvent<string>): void => selected.set(event.detail);
const onVariant = (event: CustomEvent): void =>
  variant.set(String(Array.isArray(event.detail) ? event.detail[0] : event.detail || "filled"));

const code = (): string => `<elf-tree-select
  :data.prop="teams"
  :modelValue="team"
  variant="${variant.value}"
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
  <elf-playground :title=${t("title")} :code=${code()} :script=${script}>
    <div class="demo-field">
      <elf-tree-select
        :data.prop=${nodes()}
        :modelValue=${selected}
        :variant.prop=${variant.value}
        :label=${t("label")}
        :placeholder=${t("placeholder")}
        :defaultExpandedKeys.prop=${["platform"]}
        clearable
        @update:modelValue=${onUpdate}
      ></elf-tree-select>
    </div>
    <span slot="status" class="demo-state">${t("selected")} · ${selected.value || t("none")}</span>
    <aside slot="controls" class="demo-controls" :aria-label=${t("controls")}>
      <strong>${t("controls")}</strong>
      <label><span>${t("appearance")}</span><elf-select variant="underlined"
        :options.prop=${variantOptions} :modelValue.prop=${variant.value}
        @update:modelValue=${onVariant}></elf-select></label>
    </aside>
  </elf-playground>
`);

export { PageTreeSelectEx1 };
