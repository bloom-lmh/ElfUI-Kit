import { defineHtml } from "@elfui/core";

const columns = [
  { prop: "date", label: "日期", width: 120 },
  { prop: "shift", label: "班次", width: 100 },
  { prop: "member", label: "值班人", width: 120 },
  { prop: "task", label: "重点任务", minWidth: 240 }
];

const data = [
  { id: "1", date: "7 月 15 日", shift: "白班", member: "林舟", task: "组件发布与变更审计" },
  { id: "2", date: "7 月 15 日", shift: "白班", member: "周然", task: "文档案例与视觉回归" },
  { id: "3", date: "7 月 16 日", shift: "夜班", member: "许宁", task: "告警处理与版本监控" },
  { id: "4", date: "7 月 16 日", shift: "夜班", member: "陈立", task: "依赖升级与构建巡检" }
];

const spanMethod = ({ rowIndex, columnIndex }: {
  rowIndex: number;
  columnIndex: number;
}): [number, number] | undefined => {
  if (columnIndex > 1) return undefined;
  return rowIndex % 2 === 0 ? [2, 1] : [0, 0];
};

const code = `<elf-table
  :data.prop="data"
  :columns.prop="columns"
  :spanMethod.prop="spanMethod"
  border
/>`;

const script = `const columns = [
    { prop: "date", label: "日期", width: 120 },
    { prop: "shift", label: "班次", width: 100 },
    { prop: "member", label: "值班人", width: 120 },
    { prop: "task", label: "重点任务", minWidth: 240 }
];
const data = [
    { id: "1", date: "7 月 15 日", shift: "白班", member: "林舟", task: "组件发布与变更审计" },
    { id: "2", date: "7 月 15 日", shift: "白班", member: "周然", task: "文档案例与视觉回归" },
    { id: "3", date: "7 月 16 日", shift: "夜班", member: "许宁", task: "告警处理与版本监控" },
    { id: "4", date: "7 月 16 日", shift: "夜班", member: "陈立", task: "依赖升级与构建巡检" }
];
const spanMethod = ({ rowIndex, columnIndex }) => {
    if (columnIndex > 1)
        return undefined;
    return rowIndex % 2 === 0 ? [2, 1] : [0, 0];
};`;

const PageTableEx14 = defineHtml(`
  <h2>合并单元格</h2>
  <elf-playground title="值班排期：按日期与班次纵向合并" :code="code" :script=${script}>
    <div style="width: 100%">
      <elf-table
        :data.prop="data"
        :columns.prop="columns"
        :spanMethod.prop="spanMethod"
        border
      ></elf-table>
    </div>
  </elf-playground>
`);

export { PageTableEx14 };
