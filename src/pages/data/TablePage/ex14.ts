import { defineHtml, defineStyle } from "@elfui/core";
import { createDocsPicker, createDocsTranslator } from "../../docsLocale";
import demoStyles from "./demo.scss?inline";

const t = createDocsTranslator({ title: { zh: "合并单元格", en: "Merged cells" } });
const pick = createDocsPicker();
const columns = () => [
  { prop: "date", label: pick("日期", "Date"), width: 120 },
  { prop: "shift", label: pick("班次", "Shift"), width: 100 },
  { prop: "member", label: pick("值班人", "On call"), width: 120 },
  { prop: "task", label: pick("重点任务", "Priority task"), minWidth: 240 },
];
const data = () => [
  {
    id: "1",
    date: pick("7 月 15 日", "July 15"),
    shift: pick("白班", "Day"),
    member: pick("林舟", "Lin Zhou"),
    task: pick("组件发布与变更审计", "Component release and change audit"),
  },
  {
    id: "2",
    date: pick("7 月 15 日", "July 15"),
    shift: pick("白班", "Day"),
    member: pick("周然", "Zhou Ran"),
    task: pick("文档案例与视觉回归", "Documentation and visual regression"),
  },
  {
    id: "3",
    date: pick("7 月 16 日", "July 16"),
    shift: pick("夜班", "Night"),
    member: pick("许宁", "Xu Ning"),
    task: pick("告警处理与版本监控", "Alert handling and release monitoring"),
  },
  {
    id: "4",
    date: pick("7 月 16 日", "July 16"),
    shift: pick("夜班", "Night"),
    member: pick("陈立", "Chen Li"),
    task: pick("依赖升级与构建巡检", "Dependency upgrades and build checks"),
  },
];
const spanMethod = ({
  rowIndex,
  columnIndex,
}: {
  rowIndex: number;
  columnIndex: number;
}): [number, number] | undefined => {
  if (columnIndex > 1) return undefined;
  return rowIndex % 2 === 0 ? [2, 1] : [0, 0];
};

const code = `<elf-table :data.prop="data" :columns.prop="columns" :spanMethod.prop="spanMethod" border />`;
const script = (): string => `const columns = ${JSON.stringify(columns(), null, 2)};
const data = ${JSON.stringify(data(), null, 2)};
const spanMethod = ({ rowIndex, columnIndex }) => {
  if (columnIndex > 1) return undefined;
  return rowIndex % 2 === 0 ? [2, 1] : [0, 0];
};`;

defineStyle(demoStyles);

const PageTableEx14 = defineHtml(`
  <h2>${t("title")}</h2>
  <elf-playground :title=${t("title")} :code=${code} :script=${script()}>
    <div class="table-demo-stage">
      <elf-table class="table-demo-surface" :data.prop=${data()} :columns.prop=${columns()} :spanMethod.prop=${spanMethod} border></elf-table>
    </div>
  </elf-playground>
`);

export { PageTableEx14 };
