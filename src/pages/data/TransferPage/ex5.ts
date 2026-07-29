import { defineHtml, useRef } from "@elfui/core";
import type { TransferRenderContext } from "../../../components/Data/Transfer";
import { createDocsTranslator } from "../../docsLocale";

const t = createDocsTranslator({
  title: { zh: "类型化内容渲染", en: "Typed content rendering" },
  status: { zh: "render-content 可读取 item、side、checked 与 disabled", en: "render-content can read item, side, checked, and disabled." },
  lin: { zh: "林舒", en: "Lin Shu" },
  xu: { zh: "许宁", en: "Xu Ning" },
  zhou: { zh: "周然", en: "Zhou Ran" },
  design: { zh: "设计系统", en: "Design system" },
  accessibility: { zh: "可访问性", en: "Accessibility" },
  architecture: { zh: "前端架构", en: "Frontend architecture" },
  assigned: { zh: "已分配", en: "Assigned" },
  source: { zh: "候选成员", en: "Candidates" },
  target: { zh: "项目成员", en: "Project members" }
});

interface Member {
  key: string;
  label: string;
  role: string;
}

const members: Member[] = [
  { key: "lin", label: t("lin"), role: t("design") },
  { key: "xu", label: t("xu"), role: t("accessibility") },
  { key: "zhou", label: t("zhou"), role: t("architecture") },
];
const assigned = useRef<string[]>(["xu"]);
const renderMember = (item: Member, context: TransferRenderContext): HTMLElement => {
  const node = document.createElement("span");
  node.className = "transfer-member";
  node.textContent = `${item.label} · ${item.role}${context.side === "right" ? ` · ${t("assigned")}` : ""}`;
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
  <elf-playground :title=${t("title")} :code=${code} :script=${script}>
    <span slot="status" class="demo-state">${t("status")}</span>
    <elf-transfer
      :data.prop=${members}
      :modelValue.prop=${assigned}
      :renderContent.prop=${renderMember}
      :titles.prop=${[t("source"), t("target")]}
      @update:modelValue=${updateAssigned}
    ></elf-transfer>
  </elf-playground>
`);

export { PageTransferEx5 };
