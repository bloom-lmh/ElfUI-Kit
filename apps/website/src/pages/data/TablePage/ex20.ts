import { defineHtml, defineStyle, useRef } from "@elfui/core";
import type {
  TableColumn,
  TableRow,
  TableTooltipOptions,
} from "@elfui/kit-src/components/Data/Table";
import { createDocsPicker, createDocsTranslator } from "../../docsLocale";
import demoStyles from "./demo.scss?inline";

const t = createDocsTranslator({
  title: { zh: "单元格浮层", en: "Cell tooltip" },
  idle: {
    zh: "悬停或使用 Tab 聚焦被截断的单元格",
    en: "Hover or use Tab to focus a truncated cell",
  },
  current: { zh: "当前单元格：{column} · {owner}", en: "Current cell: {column} · {owner}" },
  fullProject: { zh: "完整项目名：{project}", en: "Full project name: {project}" },
});
const pick = createDocsPicker();
const tooltipState = useRef(t("idle"));
const data = (): TableRow[] => [
  {
    id: "1",
    project: pick(
      "ElfUI 企业级设计系统与多品牌主题基础设施升级",
      "ElfUI enterprise design system and multi-brand theme infrastructure",
    ),
    detail: pick(
      "统一组件语义、可访问性规则与跨产品设计令牌",
      "Unify component semantics, accessibility rules, and cross-product design tokens",
    ),
    owner: pick("林舒", "Lin Shu"),
  },
  {
    id: "2",
    project: pick(
      "复杂表单编排与异步校验工作流重构",
      "Complex form orchestration and asynchronous validation workflow",
    ),
    detail: pick(
      "覆盖动态字段、远程校验、错误聚焦和草稿恢复",
      "Cover dynamic fields, remote validation, error focus, and draft recovery",
    ),
    owner: pick("许宁", "Xu Ning"),
  },
  {
    id: "3",
    project: pick(
      "组件文档交互案例与自动化视觉回归平台",
      "Interactive component docs and automated visual regression platform",
    ),
    detail: pick(
      "让每个公开契约都有可复制案例和稳定浏览器验收",
      "Give every public contract a runnable example and stable browser acceptance",
    ),
    owner: pick("周然", "Zhou Ran"),
  },
];
const tooltipOptions: TableTooltipOptions = {
  placement: "top-start",
  offset: 8,
  showAfter: 120,
  hideAfter: 80,
  maxWidth: 320,
};
const columns = () =>
  [
    {
      prop: "project",
      label: pick("项目", "Project"),
      width: 220,
      tooltipFormatter: (row: TableRow) =>
        t("fullProject").replace("{project}", String(row.project)),
    },
    { prop: "detail", label: pick("工作范围", "Scope"), width: 260 },
    { prop: "owner", label: pick("负责人", "Owner"), width: 110 },
  ] satisfies TableColumn[];
const onCellEnter = (event: Event): void => {
  const [row, column] = (event as CustomEvent).detail as [TableRow, TableColumn];
  tooltipState.set(
    t("current")
      .replace("{column}", String(column.label || column.prop))
      .replace("{owner}", String(row.owner)),
  );
};

const code = `<elf-table
  :data.prop="data"
  :columns.prop="columns"
  show-overflow-tooltip
  :tooltipOptions.prop="tooltipOptions"
/>`;
const script = (): string => `const data = ${JSON.stringify(data(), null, 2)};
const tooltipOptions = ${JSON.stringify(tooltipOptions, null, 2)};
const columns = [
  { prop: "project", label: "${pick("项目", "Project")}", width: 220, tooltipFormatter },
  { prop: "detail", label: "${pick("工作范围", "Scope")}", width: 260 },
  { prop: "owner", label: "${pick("负责人", "Owner")}", width: 110 }
];`;

defineStyle(demoStyles);

const PageTableEx20 = defineHtml(`
  <h2>${t("title")}</h2>
  <elf-playground :title=${t("title")} :code=${code} :script=${script()}>
    <span slot="status" role="status" aria-live="polite">${tooltipState}</span>
    <div class="table-demo-stage">
      <elf-table
        class="table-demo-surface is-compact"
        :data.prop=${data()}
        :columns.prop=${columns()}
        :tooltipOptions.prop=${tooltipOptions}
        show-overflow-tooltip
        border
        @cell-mouse-enter=${onCellEnter}
      ></elf-table>
    </div>
  </elf-playground>
`);

export { PageTableEx20 };
