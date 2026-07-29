import { defineHtml } from "@elfui/core";

const columns = [
  { prop: "id", label: "编号", width: 90, fixed: "left" },
  { prop: "name", label: "项目", width: 180, fixed: "left" },
  { prop: "owner", label: "负责人", width: 120 },
  { prop: "stage", label: "阶段", width: 140 },
  { prop: "risk", label: "风险", width: 120 },
  { prop: "progress", label: "进度", width: 120, align: "right" },
  { prop: "budget", label: "预算", width: 140, align: "right" },
  { prop: "updatedAt", label: "更新时间", width: 160 },
  { prop: "status", label: "状态", width: 120, fixed: "right" }
];

const data = Array.from({ length: 18 }, (_, index) => ({
  id: `P-${String(index + 1).padStart(3, "0")}`,
  name: ["组件官网改造", "权限树梳理", "表格性能审计", "主题变量迁移"][index % 4],
  owner: ["林舟", "周然", "许宁", "陈立"][index % 4],
  stage: ["设计", "开发", "联调", "验收"][index % 4],
  risk: ["低", "中", "高"][index % 3],
  progress: `${35 + index * 3}%`,
  budget: `¥${(12 + index * 1.4).toFixed(1)}k`,
  updatedAt: `2026-06-${String(10 + (index % 18)).padStart(2, "0")}`,
  status: index % 3 === 0 ? "进行中" : index % 3 === 1 ? "待确认" : "已完成"
}));

const code = `<elf-table
  :data.prop="data"
  :columns.prop="columns"
  height="320px"
  border
/>`;

const script = `const columns = [
    { prop: "id", label: "编号", width: 90, fixed: "left" },
    { prop: "name", label: "项目", width: 180, fixed: "left" },
    { prop: "owner", label: "负责人", width: 120 },
    { prop: "stage", label: "阶段", width: 140 },
    { prop: "risk", label: "风险", width: 120 },
    { prop: "progress", label: "进度", width: 120, align: "right" },
    { prop: "budget", label: "预算", width: 140, align: "right" },
    { prop: "updatedAt", label: "更新时间", width: 160 },
    { prop: "status", label: "状态", width: 120, fixed: "right" }
];
const data = Array.from({ length: 18 }, (_, index) => ({
    id: \`P-\${String(index + 1).padStart(3, "0")}\`,
    name: ["组件官网改造", "权限树梳理", "表格性能审计", "主题变量迁移"][index % 4],
    owner: ["林舟", "周然", "许宁", "陈立"][index % 4],
    stage: ["设计", "开发", "联调", "验收"][index % 4],
    risk: ["低", "中", "高"][index % 3],
    progress: \`\${35 + index * 3}%\`,
    budget: \`¥\${(12 + index * 1.4).toFixed(1)}k\`,
    updatedAt: \`2026-06-\${String(10 + (index % 18)).padStart(2, "0")}\`,
    status: index % 3 === 0 ? "进行中" : index % 3 === 1 ? "待确认" : "已完成"
}));`;

const PageTableEx12 = defineHtml(`
  <h2>固定列</h2>
  <elf-playground title="固定列" :code="code" :script=${script}>
    <div style="width:100%;max-width:860px">
      <elf-table :data.prop="data" :columns.prop="columns" height="320px" border></elf-table>
    </div>
  </elf-playground>
`);

export { PageTableEx12 };
