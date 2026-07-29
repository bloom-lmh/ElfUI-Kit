import { defineHtml, useRef } from "@elfui/core";
import type { TransferRenderContext } from "../../../components/Data/Transfer";
import { createDocsTranslator } from "../../docsLocale";

const t = createDocsTranslator({
  title: { zh: "按面板状态定制选项", en: "Customize options by panel state" },
  status: { zh: "同一渲染器根据来源与目标面板呈现不同状态", en: "One renderer presents different states for source and target panels." },
  design: { zh: "设计", en: "Design" },
  docs: { zh: "文档", en: "Documentation" },
  engineering: { zh: "工程", en: "Engineering" },
  candidate: { zh: "候选", en: "Candidate" },
  selected: { zh: "已选", en: "Selected" },
  source: { zh: "可用工具", en: "Available tools" },
  target: { zh: "项目工具", en: "Project tools" }
});

interface Asset {
  key: string;
  label: string;
  kind: string;
}

const assets: Asset[] = [
  { key: "figma", label: "Figma", kind: t("design") },
  { key: "storybook", label: "Storybook", kind: t("docs") },
  { key: "ci", label: "CI Pipeline", kind: t("engineering") },
];
const selected = useRef<string[]>([]);
const renderAsset = (item: Asset, context: TransferRenderContext): HTMLElement => {
  const row = document.createElement("span");
  row.className = "transfer-asset";
  const label = document.createElement("strong");
  label.textContent = item.label;
  const meta = document.createElement("small");
  meta.textContent = `${item.kind} · ${context.side === "left" ? t("candidate") : t("selected")}`;
  row.append(label, meta);
  return row;
};
const onUpdate = (event: CustomEvent<string[]>): void => selected.set(event.detail || []);

const code = `<elf-transfer
  :data.prop="assets"
  :model-value.prop="selected"
  :render-content.prop="renderAsset"
/>`;
const script = `const renderAsset = (item, context) => {
  const row = document.createElement("span");
  row.className = "transfer-asset";
  row.textContent = item.label + " · " + item.kind + " · " + context.side;
  return row;
};`;

const PageTransferEx6 = defineHtml(`
  <elf-playground :title=${t("title")} :code=${code} :script=${script}>
    <span slot="status" class="demo-state">${t("status")}</span>
    <elf-transfer
      :data.prop=${assets}
      :modelValue.prop=${selected}
      :renderContent.prop=${renderAsset}
      :titles.prop=${[t("source"), t("target")]}
      @update:modelValue=${onUpdate}
    ></elf-transfer>
  </elf-playground>
`);

export { PageTransferEx6 };
