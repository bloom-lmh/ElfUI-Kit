import { defineHtml, useRef } from "@elfui/core";
import type { TableColumn, TableRow } from "../../../components/Data/Table";

const data: TableRow[] = Array.from({ length: 10000 }, (_, index) => ({ id: index + 1, task: `流水线任务 #${String(index + 1).padStart(5, "0")}`, owner: ["林舒", "许宁", "周然"][index % 3], duration: 18 + (index % 73), status: index % 4 === 0 ? "运行中" : "已完成" }));
const columns: TableColumn[] = [
  { type: "index", width: 72, fixed: "left" },
  { prop: "task", label: "任务", minWidth: 220 },
  { prop: "owner", label: "负责人", width: 110 },
  { prop: "duration", label: "耗时（秒）", width: 120, sortable: true },
  { prop: "status", label: "状态", width: 100, fixed: "right" }
];

const sortState = useRef("尚未排序");

const onSortChange = (event: CustomEvent<{ prop: string; order: string }>): void => {
  const { prop, order } = event.detail;
  sortState.set(`${prop} · ${order || "默认顺序"}`);
};

const code = `<elf-table
  :data.prop="data"
  :columns.prop="columns"
  height="396"
  row-height="44"
  :overscan="6"
  virtual
  border
  stripe
  @sort-change="onSortChange"
/>`;

const script = `const data = Array.from({ length: 10000 }, (_, index) => ({
  id: index + 1,
  task: \`流水线任务 #\${String(index + 1).padStart(5, "0")}\`,
  owner: ["林舒", "许宁", "周然"][index % 3],
  duration: 18 + (index % 73),
  status: index % 4 === 0 ? "运行中" : "已完成"
}));

const columns = [
  { type: "index", width: 72, fixed: "left" },
  { prop: "task", label: "任务", minWidth: 220 },
  { prop: "owner", label: "负责人", width: 110 },
  { prop: "duration", label: "耗时（秒）", width: 120, sortable: true },
  { prop: "status", label: "状态", width: 100, fixed: "right" }
];`;

const PageTableEx21 = defineHtml(`
  <h2>虚拟滚动</h2>
  <elf-playground title="虚拟滚动" :code=${code} :script=${script}>
    <span slot="status" class="demo-state">10,000 行 · 44px 行高 · {{ sortState }}</span>
    <div style="width:100%;max-width:850px">
      <elf-table
        :data.prop=${data}
        :columns.prop=${columns}
        height="396"
        row-height="44"
        overscan="6"
        virtual
        border
        stripe
        @sort-change=${onSortChange}
      ></elf-table>
    </div>
  </elf-playground>
`);
export { PageTableEx21 };
