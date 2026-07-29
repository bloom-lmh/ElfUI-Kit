import { defineHtml } from "@elfui/core";

const columns = [
  { prop: "module", label: "模块", minWidth: 150 },
  { prop: "owner", label: "负责人", width: 120 },
  { prop: "issues", label: "问题数", width: 100, align: "right" }
];

const data = [
  { id: "1", module: "Data", owner: "林舟", issues: 3 },
  { id: "2", module: "Form", owner: "周然", issues: 1 },
  { id: "3", module: "Navigation", owner: "许宁", issues: 2 }
];

const code = `<elf-table :data.prop="data" :columns.prop="columns" border />`;

const script = `const columns = [
    { prop: "module", label: "模块", minWidth: 150 },
    { prop: "owner", label: "负责人", width: 120 },
    { prop: "issues", label: "问题数", width: 100, align: "right" }
];
const data = [
    { id: "1", module: "Data", owner: "林舟", issues: 3 },
    { id: "2", module: "Form", owner: "周然", issues: 1 },
    { id: "3", module: "Navigation", owner: "许宁", issues: 2 }
];`;

const PageTableEx5 = defineHtml(`
  <h2>边框表格</h2>
  <elf-playground title="边框表格" :code="code" :script=${script}>
    <div style="width: 100%">
      <elf-table :data.prop="data" :columns.prop="columns" border></elf-table>
    </div>
  </elf-playground>
`);

export { PageTableEx5 };
