import { defineHtml, useRef } from "@elfui/core";
import type { TransferRenderContext } from "../../../components/Data/Transfer";

interface Member {
  key: string;
  label: string;
  role: string;
}

const members: Member[] = [
  { key: "lin", label: "林舒", role: "设计系统" },
  { key: "xu", label: "许宁", role: "可访问性" },
  { key: "zhou", label: "周然", role: "前端架构" },
];
const assigned = useRef<string[]>(["xu"]);
const renderMember = (item: Member, context: TransferRenderContext): HTMLElement => {
  const node = document.createElement("span");
  node.className = "transfer-member";
  node.textContent = `${item.label} · ${item.role}${context.side === "right" ? " · 已分配" : ""}`;
  return node;
};
const updateAssigned = (event: CustomEvent<string[]>): void => assigned.set(event.detail || []);

const code = `<elf-transfer
  :data.prop="members"
  :model-value.prop="assigned"
  :render-content.prop="renderMember"
  @update:modelValue="updateAssigned"
/>`;
const script = `const renderMember = (item, context) => {
  const node = document.createElement("span");
  node.textContent = item.label + " · " + item.role + " · " + context.side;
  return node;
};`;

const PageTransferEx5 = defineHtml(`
  <elf-playground title="类型化内容渲染" :code=${code} :script=${script}>
    <span slot="status" class="demo-state">render-content 可读取 item、side、checked 与 disabled</span>
    <elf-transfer
      :data.prop=${members}
      :modelValue.prop=${assigned}
      :renderContent.prop=${renderMember}
      :titles.prop=${["候选成员", "项目成员"]}
      @update:modelValue=${updateAssigned}
    ></elf-transfer>
  </elf-playground>
`);

export { PageTransferEx5 };
