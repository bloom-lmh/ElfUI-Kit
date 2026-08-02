import { defineHtml, defineStyle } from "@elfui/core";
import { createDocsPicker, createDocsTranslator } from "../../docsLocale";
import demoStyles from "./demo.scss?inline";

const t = createDocsTranslator({ title: { zh: "固定列", en: "Fixed columns" } });
const pick = createDocsPicker();
const columns = () => [
  { prop: "id", label: pick("编号", "ID"), width: 90, fixed: "left" },
  { prop: "name", label: pick("项目", "Project"), width: 180, fixed: "left" },
  { prop: "owner", label: pick("负责人", "Owner"), width: 120 },
  { prop: "stage", label: pick("阶段", "Stage"), width: 140 },
  { prop: "risk", label: pick("风险", "Risk"), width: 120 },
  { prop: "progress", label: pick("进度", "Progress"), width: 120, align: "right" },
  { prop: "budget", label: pick("预算", "Budget"), width: 140, align: "right" },
  { prop: "updatedAt", label: pick("更新时间", "Updated"), width: 160 },
  { prop: "status", label: pick("状态", "Status"), width: 120, fixed: "right" },
];
const projectNames = () => [
  pick("组件官网改造", "Component site redesign"),
  pick("权限树梳理", "Permission tree review"),
  pick("表格性能审计", "Table performance audit"),
  pick("主题变量迁移", "Theme token migration"),
];
const owners = () => [
  pick("林舟", "Lin Zhou"),
  pick("周然", "Zhou Ran"),
  pick("许宁", "Xu Ning"),
  pick("陈立", "Chen Li"),
];
const stages = () => [
  pick("设计", "Design"),
  pick("开发", "Development"),
  pick("联调", "Integration"),
  pick("验收", "Review"),
];
const risks = () => [pick("低", "Low"), pick("中", "Medium"), pick("高", "High")];
const statuses = () => [
  pick("进行中", "In progress"),
  pick("待确认", "Pending"),
  pick("已完成", "Completed"),
];
const data = () =>
  Array.from({ length: 18 }, (_, index) => ({
    id: `P-${String(index + 1).padStart(3, "0")}`,
    name: projectNames()[index % 4],
    owner: owners()[index % 4],
    stage: stages()[index % 4],
    risk: risks()[index % 3],
    progress: `${35 + index * 3}%`,
    budget: `$${(12 + index * 1.4).toFixed(1)}k`,
    updatedAt: `2026-06-${String(10 + (index % 18)).padStart(2, "0")}`,
    status: statuses()[index % 3],
  }));

const code = `<elf-table :data.prop="data" :columns.prop="columns" height="320px" border />`;
const script = (): string => `const columns = ${JSON.stringify(columns(), null, 2)};
const data = ${JSON.stringify(data(), null, 2)};`;

defineStyle(demoStyles);

const PageTableEx12 = defineHtml(`
  <h2>${t("title")}</h2>
  <elf-playground :title=${t("title")} :code=${code} :script=${script()}>
    <div class="table-demo-stage is-tall">
      <elf-table class="table-demo-surface" :data.prop=${data()} :columns.prop=${columns()} height="320px" border></elf-table>
    </div>
  </elf-playground>
`);

export { PageTableEx12 };
