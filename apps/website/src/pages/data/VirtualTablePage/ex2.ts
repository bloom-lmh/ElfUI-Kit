import { defineHtml, useRef } from "@elfui/core";
import type { TableRow } from "@elfui/kit-src/components/Data/Table";
import type { TableV2Column } from "@elfui/kit-src/components/Data/TableV2";
import { createDocsPicker, createDocsTranslator } from "../../docsLocale";

const pick = createDocsPicker();
const t = createDocsTranslator({
  title: { zh: "固定数据 · 状态插槽", en: "Pinned data · Status slots" },
  stopRefresh: { zh: "结束刷新", en: "Stop refresh" },
  simulateRefresh: { zh: "模拟刷新", en: "Simulate refresh" },
  refreshing: { zh: "正在刷新服务指标…", en: "Refreshing service metrics…" },
  footer: { zh: "共 320 条 · 汇总行固定在顶部", en: "320 rows · Summary pinned at the top" },
});
const fixedData: TableRow[] = [
  {
    id: "summary",
    service: pick("固定汇总", "Pinned summary"),
    description: pick("今日 320 个服务检查项", "320 service checks today"),
    owner: "Platform",
  },
];
const data: TableRow[] = Array.from({ length: 320 }, (_, index) => ({
  id: index + 1,
  service: `service-${String(index + 1).padStart(3, "0")}`,
  description: pick("常规健康检查与版本状态。", "Routine health check and version status."),
  owner: ["Lin", "Xu", "Zhou"][index % 3],
}));
const columns: TableV2Column[] = [
  { key: "service", title: pick("服务", "Service"), width: 180, fixed: "left" },
  { key: "description", title: pick("运行说明", "Runtime notes"), width: 460 },
  { key: "owner", title: pick("负责人", "Owner"), width: 120, fixed: "right" },
];
const loading = useRef(false);
const rowHeight = 44;
const toggleLoading = (): void => loading.set(!loading.peek());

const code = pick(
  `<elf-table-v2
  :fixed-data.prop="fixedData"
  :data.prop="data"
  :columns.prop="columns"
  :row-height="44"
  :footer-height="48"
  :loading="loading"
>
  <span slot="overlay">正在刷新服务指标…</span>
  <span slot="footer">共 320 条 · 汇总行固定在顶部</span>
</elf-table-v2>`,
  `<elf-table-v2
  :fixed-data.prop="fixedData"
  :data.prop="data"
  :columns.prop="columns"
  :row-height="44"
  :footer-height="48"
  :loading="loading"
>
  <span slot="overlay">Refreshing service metrics…</span>
  <span slot="footer">320 rows · Summary pinned at the top</span>
</elf-table-v2>`,
);
const script = pick(
  `const fixedData = [{ id: "summary", service: "固定汇总", description: "今日 320 个服务检查项" }];`,
  `const fixedData = [{ id: "summary", service: "Pinned summary", description: "320 service checks today" }];`,
);

const PageVirtualTableEx2 = defineHtml(`
  <elf-playground :title=${t("title")} :code=${code} :script=${script}>
    <button slot="status" type="button" @click=${toggleLoading}>${loading.value ? t("stopRefresh") : t("simulateRefresh")}</button>
    <div style="width:100%;max-width:880px">
      <elf-table-v2
        :fixedData.prop=${fixedData}
        :data.prop=${data}
        :columns.prop=${columns}
        :rowHeight=${rowHeight}
        :footerHeight=${48}
        :loading=${loading}
        height="420"
        border
      >
        <span slot="overlay">${t("refreshing")}</span>
        <span slot="footer">${t("footer")}</span>
      </elf-table-v2>
    </div>
  </elf-playground>
`);

export { PageVirtualTableEx2 };
