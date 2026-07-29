import { defineHtml } from "@elfui/core";

const columns = [
  { prop: "name", label: "名称", minWidth: 160 },
  { prop: "type", label: "类型", width: 100 },
  { prop: "count", label: "数量", width: 90, align: "right" }
];

const data = [
  { id: "1", name: "Material token", type: "设计", count: 32 },
  { id: "2", name: "表单规则", type: "工程", count: 18 },
  { id: "3", name: "可访问性清单", type: "质量", count: 12 }
];

const code = `<elf-table :data.prop="data" :columns.prop="columns" size="small" />`;

const script = `const columns = [
    { prop: "name", label: "名称", minWidth: 160 },
    { prop: "type", label: "类型", width: 100 },
    { prop: "count", label: "数量", width: 90, align: "right" }
];
const data = [
    { id: "1", name: "Material token", type: "设计", count: 32 },
    { id: "2", name: "表单规则", type: "工程", count: 18 },
    { id: "3", name: "可访问性清单", type: "质量", count: 12 }
];`;

const PageTableEx3 = defineHtml(`
  <h2>紧凑表格</h2>
  <elf-playground title="紧凑表格" :code="code" :script=${script}>
    <div style="width: 100%">
      <elf-table :data.prop="data" :columns.prop="columns" size="small"></elf-table>
    </div>
  </elf-playground>
`);

export { PageTableEx3 };
