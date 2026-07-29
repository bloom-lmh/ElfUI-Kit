import { defineHtml, useRef } from "@elfui/core";
import type { TableColumn, TableLoad, TableRow } from "../../../components/Data/Table";

const treeState = useRef("默认折叠 · 支持键盘与按需加载");

const data: TableRow[] = [
  {
    id: "product",
    name: "产品研发中心",
    owner: "林舟",
    headcount: 32,
    children: [
      { id: "design", name: "体验设计组", owner: "周然", headcount: 8 },
      { id: "frontend", name: "前端平台组", owner: "许宁", headcount: 14 }
    ]
  },
  { id: "operations", name: "业务运营中心", owner: "陈立", headcount: 26, hasChildren: true }
];

const columns = [
  { type: "selection", width: 48 },
  { prop: "name", label: "组织单元", width: 240 },
  { prop: "owner", label: "负责人", width: 130 },
  { prop: "headcount", label: "人数", width: 100, align: "right" }
] satisfies TableColumn[];

const load: TableLoad = (_row, _treeNode, resolve) => {
  window.setTimeout(() => {
    resolve([
      { id: "growth", name: "增长运营组", owner: "苏晴", headcount: 11 },
      { id: "content", name: "内容运营组", owner: "顾言", headcount: 9 }
    ]);
  }, 420);
};

const onExpandChange = (event: Event): void => {
  const [row, expanded] = (event as CustomEvent).detail as [TableRow, boolean];
  treeState.set(`${row.name} · ${expanded ? "已展开" : "已收起"}`);
};

const code = `<elf-table
  :data.prop="data"
  :columns.prop="columns"
  row-key="id"
  lazy
  :load.prop="load"
  :indent="20"
  border
/>`;

const script = `const data = [
    {
        id: "product",
        name: "产品研发中心",
        owner: "林舟",
        headcount: 32,
        children: [
            { id: "design", name: "体验设计组", owner: "周然", headcount: 8 },
            { id: "frontend", name: "前端平台组", owner: "许宁", headcount: 14 }
        ]
    },
    { id: "operations", name: "业务运营中心", owner: "陈立", headcount: 26, hasChildren: true }
];
const columns = [
    { type: "selection", width: 48 },
    { prop: "name", label: "组织单元", width: 240 },
    { prop: "owner", label: "负责人", width: 130 },
    { prop: "headcount", label: "人数", width: 100, align: "right" }
];
const load = (_row, _treeNode, resolve) => {
    window.setTimeout(() => {
        resolve([
            { id: "growth", name: "增长运营组", owner: "苏晴", headcount: 11 },
            { id: "content", name: "内容运营组", owner: "顾言", headcount: 9 }
        ]);
    }, 420);
};`;

const PageTableEx18 = defineHtml(`
  <h2>树形数据</h2>
  <elf-playground title="树形数据" :code="code" :script=${script}>
    <span slot="status" class="demo-state">{{ treeState }}</span>
    <div style="width: 100%; max-width: 760px">
      <elf-table
        :data.prop="data"
        :columns.prop="columns"
        row-key="id"
        lazy
        :load.prop="load"
        :indent="20"
        border
        @expand-change=${onExpandChange}
      ></elf-table>
    </div>
  </elf-playground>
`);

export { PageTableEx18 };
