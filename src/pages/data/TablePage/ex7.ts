import { defineHtml } from "@elfui/core";

const columns = [
  { prop: "name", label: "名称", minWidth: 160 },
  { prop: "state", label: "状态", width: 120 }
];

const data = [
  { id: "1", name: "远程配置", state: "同步中" },
  { id: "2", name: "权限清单", state: "同步中" }
];

const code = `<elf-table :data.prop="data" :columns.prop="columns" loading />`;

const script = `const columns = [
    { prop: "name", label: "名称", minWidth: 160 },
    { prop: "state", label: "状态", width: 120 }
];
const data = [
    { id: "1", name: "远程配置", state: "同步中" },
    { id: "2", name: "权限清单", state: "同步中" }
];`;

const PageTableEx7 = defineHtml(`
  <h2>加载状态</h2>
  <elf-playground title="loading 会覆盖当前表格，保留已有数据上下文" :code="code" :script=${script}>
    <div style="width: 100%">
      <elf-table :data.prop="data" :columns.prop="columns" loading></elf-table>
    </div>
  </elf-playground>
`);

export { PageTableEx7 };
