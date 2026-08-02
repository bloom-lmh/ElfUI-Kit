import { defineHtml, defineStyle } from "@elfui/core";
import { createDocsPicker, createDocsTranslator } from "../../docsLocale";
import demoStyles from "./demo.scss?inline";

const t = createDocsTranslator({ title: { zh: "加载状态", en: "Loading state" } });
const pick = createDocsPicker();

const columns = () => [
  { prop: "name", label: pick("名称", "Name"), minWidth: 160 },
  { prop: "state", label: pick("状态", "Status"), width: 120 },
];

const data = () => [
  { id: "1", name: pick("远程配置", "Remote configuration"), state: pick("同步中", "Syncing") },
  { id: "2", name: pick("权限清单", "Permission inventory"), state: pick("同步中", "Syncing") },
];

const code = `<elf-table :data.prop="data" :columns.prop="columns" loading />`;
const script = (): string => `const columns = ${JSON.stringify(columns(), null, 2)};
const data = ${JSON.stringify(data(), null, 2)};`;

defineStyle(demoStyles);

const PageTableEx7 = defineHtml(`
  <h2>${t("title")}</h2>
  <elf-playground :title=${t("title")} :code=${code} :script=${script()}>
    <div class="table-demo-stage">
      <elf-table class="table-demo-surface" :data.prop=${data()} :columns.prop=${columns()} loading></elf-table>
    </div>
  </elf-playground>
`);

export { PageTableEx7 };
