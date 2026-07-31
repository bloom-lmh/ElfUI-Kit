import { defineHtml, defineStyle, useRef } from "@elfui/core";
import { createDocsPicker, createDocsTranslator } from "../../docsLocale";
import demoStyles from "./demo.scss?inline";

type Row = { id: string; task: string; priority: string; owner: string; updatedAt: string };

const t = createDocsTranslator({
  title: { zh: "自定义排序", en: "Custom sorting" },
  idle: { zh: "点击列标题切换排序", en: "Choose a column header to change sorting" },
  ascending: { zh: "升序", en: "Ascending" },
  descending: { zh: "降序", en: "Descending" },
  defaultOrder: { zh: "默认顺序", en: "Default order" },
});
const pick = createDocsPicker();
const priorityRank = (): Record<string, number> => ({
  [pick("紧急", "Urgent")]: 3,
  [pick("高", "High")]: 2,
  [pick("普通", "Normal")]: 1,
});
const sourceData = (): Row[] => [
  {
    id: "1",
    task: pick("发布组件版本", "Release component version"),
    priority: pick("高", "High"),
    owner: pick("林舟", "Lin Zhou"),
    updatedAt: "2026-07-13",
  },
  {
    id: "2",
    task: pick("修复生产告警", "Resolve production alert"),
    priority: pick("紧急", "Urgent"),
    owner: pick("周然", "Zhou Ran"),
    updatedAt: "2026-07-15",
  },
  {
    id: "3",
    task: pick("整理迁移文档", "Organize migration guide"),
    priority: pick("普通", "Normal"),
    owner: pick("许宁", "Xu Ning"),
    updatedAt: "2026-07-12",
  },
  {
    id: "4",
    task: pick("完成视觉回归", "Complete visual regression"),
    priority: pick("高", "High"),
    owner: pick("陈立", "Chen Li"),
    updatedAt: "2026-07-14",
  },
];
const data = useRef<Row[]>(sourceData());
const sortState = useRef(t("idle"));
const columns = () => [
  { prop: "task", label: pick("任务", "Task"), minWidth: 210 },
  {
    prop: "priority",
    label: pick("优先级", "Priority"),
    width: 110,
    sortable: true,
    sortMethod: (left: Row, right: Row) =>
      (priorityRank()[left.priority] ?? 0) - (priorityRank()[right.priority] ?? 0),
    sortOrders: ["descending", "ascending"],
  },
  {
    prop: "owner",
    label: pick("负责人", "Owner"),
    width: 110,
    sortable: true,
    sortBy: ["owner", "task"],
  },
  {
    prop: "updatedAt",
    label: pick("更新时间", "Updated"),
    width: 140,
    sortable: "custom",
    sortOrders: ["descending", "ascending", null],
  },
];
const onSortChange = (event: Event): void => {
  const detail = (event as CustomEvent).detail as {
    prop: string;
    order: "" | "ascending" | "descending";
  };
  const label = columns().find((column) => column.prop === detail.prop)?.label || detail.prop;
  const orderText =
    detail.order === "ascending"
      ? t("ascending")
      : detail.order === "descending"
        ? t("descending")
        : t("defaultOrder");
  sortState.set(`${label} · ${orderText}`);
  if (detail.prop !== "updatedAt") return;
  if (!detail.order) {
    data.set(sourceData());
    return;
  }
  const direction = detail.order === "ascending" ? 1 : -1;
  data.set(
    [...sourceData()].sort(
      (left, right) => left.updatedAt.localeCompare(right.updatedAt) * direction,
    ),
  );
};

const code = `<elf-table :data.prop="data" :columns.prop="columns" border @sort-change="onSortChange" />`;
const script = (): string => `const priorityRank = ${JSON.stringify(priorityRank(), null, 2)};
const sourceData = ${JSON.stringify(sourceData(), null, 2)};
const data = useRef([...sourceData]);
const columns = [
  { prop: "task", label: "${pick("任务", "Task")}", minWidth: 210 },
  { prop: "priority", label: "${pick("优先级", "Priority")}", sortable: true,
    sortMethod: (left, right) => priorityRank[left.priority] - priorityRank[right.priority] },
  { prop: "updatedAt", label: "${pick("更新时间", "Updated")}", sortable: "custom" }
];`;

defineStyle(demoStyles);

const PageTableEx15 = defineHtml(`
  <h2>${t("title")}</h2>
  <elf-playground :title=${t("title")} :code=${code} :script=${script()}>
    <span slot="status" role="status" aria-live="polite">${sortState}</span>
    <div class="table-demo-stage">
      <elf-table class="table-demo-surface" :data.prop=${data} :columns.prop=${columns()} border @sort-change=${onSortChange}></elf-table>
    </div>
  </elf-playground>
`);

export { PageTableEx15 };
