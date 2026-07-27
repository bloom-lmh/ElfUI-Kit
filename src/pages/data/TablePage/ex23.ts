import { defineHtml, useRef } from "@elfui/core";
import type { TableV2Column, TableV2RowsRenderedDetail } from "../../../components/Data/TableV2";

const data = Array.from({ length: 5000 }, (_, index) => ({
  id: index + 1,
  service: `service-${String(index + 1).padStart(4, "0")}`,
  region: ["ap-east", "eu-west", "us-central"][index % 3],
  owner: ["Lin", "Xu", "Zhou"][index % 3],
  requests: 1200 + ((index * 37) % 9800),
  latency: 18 + (index % 96),
  status: index % 11 === 0 ? "Degraded" : "Healthy"
}));

const columns: TableV2Column[] = [
  { key: "id", title: "ID", width: 78, fixed: "left" },
  { key: "service", title: "Service", width: 220, fixed: "left" },
  { key: "region", title: "Region", width: 140 },
  { key: "owner", title: "Owner", width: 120 },
  { key: "requests", title: "Requests", width: 140, align: "right", sortable: true },
  { key: "latency", title: "Latency (ms)", width: 150, align: "right", sortable: true },
  { key: "status", title: "Status", width: 130, fixed: "right" }
];

const renderedState = useRef("准备窗口");
const sortState = useRef("默认顺序");

const onRowsRendered = (event: CustomEvent<TableV2RowsRenderedDetail>): void => {
  const detail = event.detail;
  renderedState.set(`可见 ${detail.rowVisibleStart + 1}–${detail.rowVisibleEnd + 1}`);
};

const onColumnSort = (event: CustomEvent<{ key: string; order: string }>): void => {
  sortState.set(`${event.detail.key} · ${event.detail.order || "默认顺序"}`);
};

const code = `<elf-table-v2
  :data.prop="data"
  :columns.prop="columns"
  height="396"
  :row-height="44"
  :overscan="6"
  stripe
  border
  @rows-rendered="onRowsRendered"
  @column-sort="onColumnSort"
/>`;

const script = `const data = Array.from({ length: 5000 }, (_, index) => ({
  id: index + 1,
  service: \`service-\${String(index + 1).padStart(4, "0")}\`,
  region: ["ap-east", "eu-west", "us-central"][index % 3],
  requests: 1200 + ((index * 37) % 9800),
  latency: 18 + (index % 96),
  status: index % 11 === 0 ? "Degraded" : "Healthy"
}));

const columns = [
  { key: "id", title: "ID", width: 78, fixed: "left" },
  { key: "service", title: "Service", width: 220, fixed: "left" },
  { key: "region", title: "Region", width: 140 },
  { key: "requests", title: "Requests", width: 140, sortable: true },
  { key: "latency", title: "Latency (ms)", width: 150, sortable: true },
  { key: "status", title: "Status", width: 130, fixed: "right" }
];`;

const PageTableEx23 = defineHtml(`
  <h2>TableV2 虚拟表格</h2>
  <elf-playground title="5,000 行服务指标" :code=${code} :script=${script}>
    <span slot="status" class="demo-state">{{ renderedState }} · {{ sortState }}</span>
    <div style="width:100%;max-width:880px">
      <elf-table-v2
        :data.prop=${data}
        :columns.prop=${columns}
        height="396"
        :rowHeight=${44}
        :overscan=${6}
        stripe
        border
        @rows-rendered=${onRowsRendered}
        @column-sort=${onColumnSort}
      ></elf-table-v2>
    </div>
  </elf-playground>
`);

export { PageTableEx23 };
