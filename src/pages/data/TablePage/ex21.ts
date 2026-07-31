import { defineHtml, defineStyle, useRef } from "@elfui/core";
import type { TableColumn, TableRow } from "../../../components/Data/Table";
import { createDocsPicker, createDocsTranslator } from "../../docsLocale";
import demoStyles from "./demo.scss?inline";

const t = createDocsTranslator({
  title: { zh: "虚拟滚动", en: "Virtual scrolling" },
  unsorted: { zh: "尚未排序", en: "Not sorted" },
  defaultOrder: { zh: "默认顺序", en: "Default order" },
  status: { zh: "10,000 行 · 44px 行高 · {sort}", en: "10,000 rows · 44px row height · {sort}" },
});
const pick = createDocsPicker();
const data: TableRow[] = Array.from({ length: 10000 }, (_, index) => ({
  id: index + 1,
  task: `${pick("流水线任务", "Pipeline task")} #${String(index + 1).padStart(5, "0")}`,
  owner: [pick("林舒", "Lin Shu"), pick("许宁", "Xu Ning"), pick("周然", "Zhou Ran")][index % 3],
  duration: 18 + (index % 73),
  status: index % 4 === 0 ? pick("运行中", "Running") : pick("已完成", "Completed"),
}));
const columns: TableColumn[] = [
  { type: "index", width: 72, fixed: "left" },
  { prop: "task", label: pick("任务", "Task"), minWidth: 220 },
  { prop: "owner", label: pick("负责人", "Owner"), width: 110 },
  { prop: "duration", label: pick("耗时（秒）", "Duration (seconds)"), width: 120, sortable: true },
  { prop: "status", label: pick("状态", "Status"), width: 100, fixed: "right" },
];
const sortState = useRef(t("unsorted"));
const onSortChange = (event: CustomEvent<{ prop: string; order: string }>): void => {
  const { prop, order } = event.detail;
  sortState.set(`${prop} · ${order || t("defaultOrder")}`);
};
const statusText = (): string => t("status").replace("{sort}", sortState.value);

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
const script = (): string => `const data = Array.from({ length: 10000 }, (_, index) => ({
  id: index + 1,
  task: \`${pick("流水线任务", "Pipeline task")} #\${String(index + 1).padStart(5, "0")}\`,
  owner: ${JSON.stringify([pick("林舒", "Lin Shu"), pick("许宁", "Xu Ning"), pick("周然", "Zhou Ran")])}[index % 3],
  duration: 18 + (index % 73),
  status: index % 4 === 0 ? "${pick("运行中", "Running")}" : "${pick("已完成", "Completed")}"
}));
const columns = ${JSON.stringify(columns, null, 2)};`;

defineStyle(demoStyles);

const PageTableEx21 = defineHtml(`
  <h2>${t("title")}</h2>
  <elf-playground :title=${t("title")} :code=${code} :script=${script()}>
    <span slot="status" role="status" aria-live="polite">${statusText()}</span>
    <div class="table-demo-stage is-tall">
      <elf-table
        class="table-demo-surface"
        :data.prop=${data}
        :columns.prop=${columns}
        height="396"
        row-height="44"
        :overscan=${6}
        virtual
        border
        stripe
        @sort-change=${onSortChange}
      ></elf-table>
    </div>
  </elf-playground>
`);

export { PageTableEx21 };
