import { defineHtml } from "@elfui/core";

const columns = [
  { prop: "name", label: "名称", minWidth: 160 },
  { prop: "state", label: "状态", width: 120 }
];

const code = `<elf-table :data.prop="[]" :columns.prop="columns" empty-text="没有匹配记录" />`;

const script = `const columns = [
    { prop: "name", label: "名称", minWidth: 160 },
    { prop: "state", label: "状态", width: 120 }
];`;

const PageTableEx8 = defineHtml(`
  <h2>无数据时展示 empty-text</h2>
  <elf-playground title="无数据时展示 empty-text" :code="code" :script=${script}>
    <div style="width: 100%">
      <elf-table :data.prop="[]" :columns.prop="columns" empty-text="没有匹配记录"></elf-table>
    </div>
  </elf-playground>
`);

export { PageTableEx8 };
