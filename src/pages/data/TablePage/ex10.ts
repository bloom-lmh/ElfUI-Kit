import { defineHtml, defineStyle } from "@elfui/core";
import { createDocsPicker, createDocsTranslator } from "../../docsLocale";
import demoStyles from "./demo.scss?inline";

type Row = Record<string, unknown>;

const t = createDocsTranslator({ title: { zh: "展开行", en: "Expandable rows" } });
const pick = createDocsPicker();
const columns = () => [
  { type: "expand", width: 48 },
  { prop: "name", label: pick("项目", "Project"), minWidth: 160 },
  { prop: "owner", label: pick("负责人", "Owner"), width: 120 },
  {
    prop: "progress",
    label: pick("进度", "Progress"),
    width: 100,
    align: "right",
    formatter: (row: Row) => `${row.progress}%`,
  },
];
const data = () => [
  {
    id: "1",
    name: pick("数据展示增强", "Data display enhancements"),
    owner: pick("林舟", "Lin Zhou"),
    progress: 72,
    desc: pick(
      "补齐 Table / Pagination 的真实交互和页面级回归。",
      "Complete real Table and Pagination interactions with page-level regression coverage.",
    ),
  },
  {
    id: "2",
    name: pick("权限树接入", "Permission tree integration"),
    owner: pick("周然", "Zhou Ran"),
    progress: 88,
    desc: pick(
      "用于角色管理场景，支持回显、半选和禁用危险权限。",
      "Support role management with restored values, partial selection, and disabled sensitive permissions.",
    ),
  },
];
const expandFormatter = (row: Row): string =>
  `${pick("说明", "Summary")}: ${row.desc}\n${pick("当前负责人", "Owner")}: ${row.owner}\n${pick("交付进度", "Delivery progress")}: ${row.progress}%`;

const code = `<elf-table
  :data.prop="data"
  :columns.prop="columns"
  :expandFormatter.prop="expandFormatter"
  :defaultExpandedRowKeys.prop="['1']"
/>`;
const script = (): string => `const columns = ${JSON.stringify(
  columns().map(({ formatter: _formatter, ...column }) => column),
  null,
  2,
)};
const data = ${JSON.stringify(data(), null, 2)};
const expandFormatter = (row) => \`${pick("说明", "Summary")}: \${row.desc}\\n${pick("当前负责人", "Owner")}: \${row.owner}\\n${pick("交付进度", "Delivery progress")}: \${row.progress}%\`;`;

defineStyle(demoStyles);

const PageTableEx10 = defineHtml(`
  <h2>${t("title")}</h2>
  <elf-playground :title=${t("title")} :code=${code} :script=${script()}>
    <div class="table-demo-stage">
      <elf-table
        class="table-demo-surface"
        :data.prop=${data()}
        :columns.prop=${columns()}
        :expandFormatter.prop=${expandFormatter}
        :defaultExpandedRowKeys.prop=${["1"]}
        border
      ></elf-table>
    </div>
  </elf-playground>
`);

export { PageTableEx10 };
