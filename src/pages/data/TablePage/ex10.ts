import { defineHtml } from "@elfui/core";

const columns = [
  { type: "expand", width: 48 },
  { prop: "name", label: "项目", minWidth: 160 },
  { prop: "owner", label: "负责人", width: 120 },
  {
    prop: "progress",
    label: "进度",
    width: 100,
    align: "right",
    formatter: (row: Record<string, unknown>) => `${row.progress}%`
  }
];

const data = [
  {
    id: "1",
    name: "数据展示增强",
    owner: "林舟",
    progress: 72,
    desc: "补齐 Table / Pagination 的真实交互和页面级回归。"
  },
  {
    id: "2",
    name: "权限树接入",
    owner: "周然",
    progress: 88,
    desc: "用于角色管理场景，支持回显、半选和禁用危险权限。"
  }
];

const expandFormatter = (row: Record<string, unknown>): string =>
  `说明：${row.desc}\n当前负责人：${row.owner}\n交付进度：${row.progress}%`;

const code = `<elf-table
  :data.prop="data"
  :columns.prop="columns"
  :expandFormatter.prop="expandFormatter"
  :defaultExpandedRowKeys.prop="['1']"
/>`;

const script = `const columns = [
    { type: "expand", width: 48 },
    { prop: "name", label: "项目", minWidth: 160 },
    { prop: "owner", label: "负责人", width: 120 },
    {
        prop: "progress",
        label: "进度",
        width: 100,
        align: "right",
        formatter: (row) => \`\${row.progress}%\`
    }
];
const data = [
    {
        id: "1",
        name: "数据展示增强",
        owner: "林舟",
        progress: 72,
        desc: "补齐 Table / Pagination 的真实交互和页面级回归。"
    },
    {
        id: "2",
        name: "权限树接入",
        owner: "周然",
        progress: 88,
        desc: "用于角色管理场景，支持回显、半选和禁用危险权限。"
    }
];
const expandFormatter = (row) => \`说明：\${row.desc}\\n当前负责人：\${row.owner}\\n交付进度：\${row.progress}%\`;`;

const PageTableEx10 = defineHtml(`
  <h2>expand 列可展开当前行详情，适合订单、任务和日志详情</h2>
  <elf-playground title="expand 列可展开当前行详情，适合订单、任务和日志详情" :code="code" :script=${script}>
    <div style="width: 100%">
      <elf-table
        :data.prop="data"
        :columns.prop="columns"
        :expandFormatter.prop="expandFormatter"
        :defaultExpandedRowKeys.prop="['1']"
        border
      ></elf-table>
    </div>
  </elf-playground>
`);

export { PageTableEx10 };
