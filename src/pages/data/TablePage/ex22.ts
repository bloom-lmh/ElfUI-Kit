import { defineHtml } from "@elfui/core";
import type { TableColumn, TableRow } from "../../../components/Data/Table";
import { createDocsTranslator } from "../../docsLocale";

const t = createDocsTranslator({
  section: { zh: "标题栏", en: "Header" },
  demo: { zh: "带标题的表格", en: "Table with header" },
  title: { zh: "服务运行状态", en: "Service status" },
  service: { zh: "服务", en: "Service" },
  owner: { zh: "负责人", en: "Owner" },
  status: { zh: "状态", en: "Status" },
  latency: { zh: "响应时间", en: "Latency" },
  docs: { zh: "组件文档站", en: "Component docs" },
  tokens: { zh: "设计令牌服务", en: "Design token service" },
  pipeline: { zh: "发布流水线", en: "Release pipeline" },
  running: { zh: "运行中", en: "Running" },
  pending: { zh: "待发布", en: "Pending" }
});

const columns = (): TableColumn[] => [
  { prop: "service", label: t("service"), minWidth: 180 },
  { prop: "owner", label: t("owner"), width: 120 },
  { prop: "status", label: t("status"), width: 120 },
  { prop: "latency", label: t("latency"), width: 120, align: "right" }
];

const data = (): TableRow[] => [
  { id: 1, service: t("docs"), owner: "Lin Zhou", status: t("running"), latency: "38 ms" },
  { id: 2, service: t("tokens"), owner: "Zhou Ran", status: t("running"), latency: "24 ms" },
  { id: 3, service: t("pipeline"), owner: "Xu Ning", status: t("pending"), latency: "--" }
];

const code = (): string => `<elf-table
  title="${t("title")}"
  title-variant="primary"
  :data.prop="data"
  :columns.prop="columns"
  border
/>`;

const PageTableEx22 = defineHtml(`
  <h2>${t("demo")}</h2>
  <elf-playground :title=${t("demo")} :code=${code()}>
    <div style="width:100%;max-width:820px">
      <elf-table
        :title=${t("title")}
        title-variant="primary"
        :data.prop=${data()}
        :columns.prop=${columns()}
        border
      ></elf-table>
    </div>
  </elf-playground>
`);

export { PageTableEx22 };
