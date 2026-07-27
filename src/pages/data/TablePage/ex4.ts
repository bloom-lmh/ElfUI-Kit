import { defineHtml } from "@elfui/core";

const columns = [
  { prop: "name", label: "任务", minWidth: 160 },
  { prop: "owner", label: "负责人", width: 120 },
  { prop: "state", label: "状态", width: 120 }
];

const data = [
  { id: "1", name: "文档结构整理", owner: "林舟", state: "进行中" },
  { id: "2", name: "表格交互回归", owner: "周然", state: "待验证" },
  { id: "3", name: "主题变量审计", owner: "许宁", state: "已完成" },
  { id: "4", name: "组件 API 梳理", owner: "陈立", state: "进行中" }
];

const code = `<elf-table :data.prop="data" :columns.prop="columns" stripe />`;

const script = `const columns = [
    { prop: "name", label: "任务", minWidth: 160 },
    { prop: "owner", label: "负责人", width: 120 },
    { prop: "state", label: "状态", width: 120 }
];
const data = [
    { id: "1", name: "文档结构整理", owner: "林舟", state: "进行中" },
    { id: "2", name: "表格交互回归", owner: "周然", state: "待验证" },
    { id: "3", name: "主题变量审计", owner: "许宁", state: "已完成" },
    { id: "4", name: "组件 API 梳理", owner: "陈立", state: "进行中" }
];`;

const PageTableEx4 = defineHtml(`
  <h2>斑马纹</h2>
  <elf-playground title="stripe 用于提升横向扫描可读性" :code="code" :script=${script}>
    <div style="width: 100%">
      <elf-table :data.prop="data" :columns.prop="columns" stripe></elf-table>
    </div>
  </elf-playground>
`);

export { PageTableEx4 };
