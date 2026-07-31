import { defineHtml, defineStyle, useRef } from "@elfui/core";
import type { TableColumn, TableLoad, TableRow } from "../../../components/Data/Table";
import { createDocsPicker, createDocsTranslator } from "../../docsLocale";
import demoStyles from "./demo.scss?inline";

const t = createDocsTranslator({
  title: { zh: "树形数据", en: "Tree data" },
  idle: {
    zh: "默认折叠 · 支持键盘与按需加载",
    en: "Collapsed by default · Keyboard and lazy loading enabled",
  },
  expanded: { zh: "已展开", en: "Expanded" },
  collapsed: { zh: "已收起", en: "Collapsed" },
});
const pick = createDocsPicker();
const treeState = useRef(t("idle"));
const data = (): TableRow[] => [
  {
    id: "product",
    name: pick("产品研发中心", "Product development"),
    owner: pick("林舟", "Lin Zhou"),
    headcount: 32,
    children: [
      {
        id: "design",
        name: pick("体验设计组", "Experience design"),
        owner: pick("周然", "Zhou Ran"),
        headcount: 8,
      },
      {
        id: "frontend",
        name: pick("前端平台组", "Frontend platform"),
        owner: pick("许宁", "Xu Ning"),
        headcount: 14,
      },
    ],
  },
  {
    id: "operations",
    name: pick("业务运营中心", "Business operations"),
    owner: pick("陈立", "Chen Li"),
    headcount: 26,
    hasChildren: true,
  },
];
const columns = () =>
  [
    { type: "selection", width: 48 },
    { prop: "name", label: pick("组织单元", "Organization"), width: 240 },
    { prop: "owner", label: pick("负责人", "Owner"), width: 130 },
    { prop: "headcount", label: pick("人数", "People"), width: 100, align: "right" },
  ] satisfies TableColumn[];
const lazyChildren = (): TableRow[] => [
  {
    id: "growth",
    name: pick("增长运营组", "Growth operations"),
    owner: pick("苏晴", "Sue Quinn"),
    headcount: 11,
  },
  {
    id: "content",
    name: pick("内容运营组", "Content operations"),
    owner: pick("顾言", "Gu Yan"),
    headcount: 9,
  },
];
const load: TableLoad = (_row, _treeNode, resolve) => {
  void Promise.resolve().then(() => resolve(lazyChildren()));
};
const onExpandChange = (event: Event): void => {
  const [row, expanded] = (event as CustomEvent).detail as [TableRow, boolean];
  treeState.set(`${row.name} · ${expanded ? t("expanded") : t("collapsed")}`);
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
const script = (): string => `const data = ${JSON.stringify(data(), null, 2)};
const columns = ${JSON.stringify(columns(), null, 2)};
const load = (_row, _treeNode, resolve) => {
  Promise.resolve().then(() => resolve(${JSON.stringify(lazyChildren(), null, 2)}));
};`;

defineStyle(demoStyles);

const PageTableEx18 = defineHtml(`
  <h2>${t("title")}</h2>
  <elf-playground :title=${t("title")} :code=${code} :script=${script()}>
    <span slot="status" role="status" aria-live="polite">${treeState}</span>
    <div class="table-demo-stage">
      <elf-table
        class="table-demo-surface is-medium"
        :data.prop=${data()}
        :columns.prop=${columns()}
        row-key="id"
        lazy
        :load.prop=${load}
        :indent=${20}
        border
        @expand-change=${onExpandChange}
      ></elf-table>
    </div>
  </elf-playground>
`);

export { PageTableEx18 };
