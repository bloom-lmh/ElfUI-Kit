import { defineHtml, useRef } from "@elfui/core";
import type { TableV2Column, TableV2RowsRenderedDetail } from "@elfui/kit";
import { createDocsPicker, createDocsTranslator } from "../../docsLocale";

const pick = createDocsPicker();
const t = createDocsTranslator({
  title: { zh: "5,000 行服务指标", en: "5,000 service metric rows" },
  preparing: { zh: "准备窗口", en: "Preparing window" },
  visible: { zh: "可见", en: "Visible" },
  defaultOrder: { zh: "默认顺序", en: "Default order" },
  degraded: { zh: "性能下降", en: "Degraded" },
  healthy: { zh: "健康", en: "Healthy" },
});

const data = Array.from({ length: 5000 }, (_, index) => ({
  id: index + 1,
  service: `service-${String(index + 1).padStart(4, "0")}`,
  region: ["ap-east", "eu-west", "us-central"][index % 3],
  owner: ["Lin", "Xu", "Zhou"][index % 3],
  requests: 1200 + ((index * 37) % 9800),
  latency: 18 + (index % 96),
  status: index % 11 === 0 ? t("degraded") : t("healthy"),
}));

const columns: TableV2Column[] = [
  { key: "id", title: "ID", width: 78, fixed: "left" },
  { key: "service", title: pick("服务", "Service"), width: 220, fixed: "left" },
  { key: "region", title: pick("区域", "Region"), width: 140 },
  { key: "owner", title: pick("负责人", "Owner"), width: 120 },
  {
    key: "requests",
    title: pick("请求数", "Requests"),
    width: 140,
    align: "right",
    sortable: true,
  },
  {
    key: "latency",
    title: pick("延迟（毫秒）", "Latency (ms)"),
    width: 150,
    align: "right",
    sortable: true,
  },
  { key: "status", title: pick("状态", "Status"), width: 130, fixed: "right" },
];

const renderedState = useRef(t("preparing"));
const sortState = useRef(t("defaultOrder"));

const onRowsRendered = (event: CustomEvent<TableV2RowsRenderedDetail>): void => {
  const detail = event.detail;
  renderedState.set(`${t("visible")} ${detail.rowVisibleStart + 1}–${detail.rowVisibleEnd + 1}`);
};

const onColumnSort = (event: CustomEvent<{ key: string; order: string }>): void => {
  sortState.set(`${event.detail.key} · ${event.detail.order || t("defaultOrder")}`);
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

const PageVirtualTableEx1 = defineHtml(`
  <elf-playground :title=${t("title")} :code=${code} :script=${script}>
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

export { PageVirtualTableEx1 };
