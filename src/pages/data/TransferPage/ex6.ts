import { defineHtml, useRef } from "@elfui/core";
import type { TransferRenderContext } from "../../../components/Data/Transfer";

interface Asset {
  key: string;
  label: string;
  kind: string;
}

const assets: Asset[] = [
  { key: "figma", label: "Figma", kind: "设计" },
  { key: "storybook", label: "Storybook", kind: "文档" },
  { key: "ci", label: "CI Pipeline", kind: "工程" },
];
const selected = useRef<string[]>([]);
const renderAsset = (item: Asset, context: TransferRenderContext): HTMLElement => {
  const row = document.createElement("span");
  row.className = "transfer-asset";
  const label = document.createElement("strong");
  label.textContent = item.label;
  const meta = document.createElement("small");
  meta.textContent = `${item.kind} · ${context.side === "left" ? "候选" : "已选"}`;
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
  <elf-playground title="按面板状态定制选项" :code=${code} :script=${script}>
    <span slot="status" class="demo-state">同一渲染器根据 source / target 呈现不同状态</span>
    <elf-transfer
      :data.prop=${assets}
      :modelValue.prop=${selected}
      :renderContent.prop=${renderAsset}
      :titles.prop=${["可用工具", "项目工具"]}
      @update:modelValue=${onUpdate}
    ></elf-transfer>
  </elf-playground>
`);

export { PageTransferEx6 };
