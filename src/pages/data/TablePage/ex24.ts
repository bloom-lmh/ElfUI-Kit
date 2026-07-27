import { defineHtml, useRef } from "@elfui/core";
import type { TableRow } from "../../../components/Data/Table";
import type { TableV2Column } from "../../../components/Data/TableV2";

const fixedData: TableRow[] = [
  { id: "summary", service: "固定汇总", description: "今日 320 个服务检查项", owner: "Platform" },
];
const data: TableRow[] = Array.from({ length: 320 }, (_, index) => ({
  id: index + 1,
  service: `service-${String(index + 1).padStart(3, "0")}`,
  description:
    index % 4 === 0
      ? "跨区域依赖较多，本行使用更高的动态行高展示完整说明。"
      : "常规健康检查与版本状态。",
  owner: ["Lin", "Xu", "Zhou"][index % 3],
}));
const columns: TableV2Column[] = [
  { key: "service", title: "服务", width: 180, fixed: "left" },
  { key: "description", title: "运行说明", width: 460 },
  { key: "owner", title: "负责人", width: 120, fixed: "right" },
];
const loading = useRef(false);
const rowHeight = (_row: TableRow, index: number): number => (index % 4 === 0 ? 64 : 42);
const toggleLoading = (): void => loading.set(!loading.peek());

const code = `<elf-table-v2
  :fixed-data.prop="fixedData"
  :data.prop="data"
  :columns.prop="columns"
  :row-height.prop="rowHeight"
  :footer-height="48"
  :loading="loading"
>
  <span slot="overlay">正在刷新服务指标…</span>
  <span slot="footer">共 320 条 · 汇总行固定在顶部</span>
</elf-table-v2>`;
const script = `const rowHeight = (_row, index) => (index % 4 === 0 ? 64 : 42);

const fixedData = [{ id: "summary", service: "固定汇总", description: "今日 320 个服务检查项" }];`;

const PageTableEx24 = defineHtml(`
  <elf-playground title="固定数据 · 动态行高 · 状态插槽" :code=${code} :script=${script}>
    <button slot="status" type="button" @click=${toggleLoading}>${loading.value ? "结束刷新" : "模拟刷新"}</button>
    <div style="width:100%;max-width:880px">
      <elf-table-v2
        :fixedData.prop=${fixedData}
        :data.prop=${data}
        :columns.prop=${columns}
        :rowHeight.prop=${rowHeight}
        :footerHeight=${48}
        :loading=${loading}
        height="420"
        border
      >
        <span slot="overlay">正在刷新服务指标…</span>
        <span slot="footer">共 320 条 · 汇总行固定在顶部</span>
      </elf-table-v2>
    </div>
  </elf-playground>
`);

export { PageTableEx24 };
