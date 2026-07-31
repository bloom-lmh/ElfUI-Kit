import { defineHtml, defineStyle } from "@elfui/core";
import { createDocsPicker, createDocsTranslator } from "../../docsLocale";
import demoStyles from "./demo.scss?inline";

const t = createDocsTranslator({ title: { zh: "斑马纹", en: "Striped rows" } });
const pick = createDocsPicker();

const columns = () => [
  { prop: "name", label: pick("任务", "Task"), minWidth: 160 },
  { prop: "owner", label: pick("负责人", "Owner"), width: 120 },
  { prop: "state", label: pick("状态", "Status"), width: 120 },
];

const data = () => [
  {
    id: "1",
    name: pick("文档结构整理", "Organize documentation"),
    owner: pick("林舟", "Lin Zhou"),
    state: pick("进行中", "In progress"),
  },
  {
    id: "2",
    name: pick("表格交互回归", "Table interaction regression"),
    owner: pick("周然", "Zhou Ran"),
    state: pick("待验证", "Pending verification"),
  },
  {
    id: "3",
    name: pick("主题变量审计", "Theme token audit"),
    owner: pick("许宁", "Xu Ning"),
    state: pick("已完成", "Completed"),
  },
  {
    id: "4",
    name: pick("组件 API 梳理", "Review component APIs"),
    owner: pick("陈立", "Chen Li"),
    state: pick("进行中", "In progress"),
  },
];

const code = `<elf-table :data.prop="data" :columns.prop="columns" stripe />`;
const script = (): string => `const columns = ${JSON.stringify(columns(), null, 2)};
const data = ${JSON.stringify(data(), null, 2)};`;

defineStyle(demoStyles);

const PageTableEx4 = defineHtml(`
  <h2>${t("title")}</h2>
  <elf-playground :title=${t("title")} :code=${code} :script=${script()}>
    <div class="table-demo-stage">
      <elf-table class="table-demo-surface" :data.prop=${data()} :columns.prop=${columns()} stripe></elf-table>
    </div>
  </elf-playground>
`);

export { PageTableEx4 };
