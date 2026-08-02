import { defineHtml, useRef } from "@elfui/core";

import type { TableRow } from "@elfui/kit-src/components/Data/Table";
import type { TableV2Column, TableV2RowExpandDetail } from "@elfui/kit-src/components/Data/TableV2";
import { createDocsPicker, createDocsTranslator } from "../../docsLocale";

const pick = createDocsPicker();
const t = createDocsTranslator({
  title: { zh: "虚拟树行 · 受控展开", en: "Virtual tree rows · Controlled expansion" },
  initial: { zh: "等待展开操作", en: "Waiting for an expansion action" },
  expanded: { zh: "已展开", en: "expanded" },
  collapsed: { zh: "已收起", en: "collapsed" },
});

const data: TableRow[] = [
  {
    id: "runtime",
    module: pick("运行时", "Runtime"),
    owner: "Lin",
    status: pick("稳定", "Stable"),
    children: Array.from({ length: 80 }, (_, index) => ({
      id: `runtime-${index + 1}`,
      module: `runtime-task-${String(index + 1).padStart(2, "0")}`,
      owner: ["Lin", "Xu", "Zhou"][index % 3],
      status: index % 9 === 0 ? pick("复核中", "Review") : pick("正常", "Healthy"),
    })),
  },
  {
    id: "compiler",
    module: pick("编译器", "Compiler"),
    owner: "Xu",
    status: pick("稳定", "Stable"),
    children: Array.from({ length: 60 }, (_, index) => ({
      id: `compiler-${index + 1}`,
      module: `compiler-task-${String(index + 1).padStart(2, "0")}`,
      owner: ["Xu", "Zhou"][index % 2],
      status: pick("正常", "Healthy"),
    })),
  },
];

const columns: TableV2Column[] = [
  { key: "module", title: pick("模块", "Module"), width: 360, fixed: "left" },
  { key: "owner", title: pick("负责人", "Owner"), width: 140 },
  { key: "status", title: pick("状态", "Status"), width: 140 },
];

const expandedRowKeys = useRef<string[]>(["runtime"]);
const state = useRef(t("initial"));

const onExpandedRowsChange = (event: CustomEvent<string[]>): void => {
  expandedRowKeys.set(event.detail);
};

const onRowExpand = (event: CustomEvent<TableV2RowExpandDetail>): void => {
  const [row, expanded] = event.detail;
  state.set(`${String(row.module)} · ${t(expanded ? "expanded" : "collapsed")}`);
};

const code = `<elf-table-v2
  :data.prop="data"
  :columns.prop="columns"
  expand-column-key="module"
  :expanded-row-keys.prop="expandedRowKeys"
  :indent-size="16"
  @expanded-rows-change="onExpandedRowsChange"
  @row-expand="onRowExpand"
/>`;

const script = `const expandedRowKeys = useRef(["runtime"]);

const onExpandedRowsChange = (event) => {
  expandedRowKeys.set(event.detail);
};`;

const PageVirtualTableEx3 = defineHtml(`
  <elf-playground :title=${t("title")} :code=${code} :script=${script}>
    <span slot="status" class="demo-state">${state}</span>
    <div style="width:100%;max-width:880px">
      <elf-table-v2
        :data.prop=${data}
        :columns.prop=${columns}
        expand-column-key="module"
        :expandedRowKeys.prop=${expandedRowKeys}
        :indentSize=${16}
        height="396"
        :rowHeight=${44}
        :overscan=${6}
        border
        @expanded-rows-change=${onExpandedRowsChange}
        @row-expand=${onRowExpand}
      ></elf-table-v2>
    </div>
  </elf-playground>
`);

export { PageVirtualTableEx3 };
