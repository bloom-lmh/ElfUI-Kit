import { defineHtml, useRef } from "@elfui/core";
import { createDocsTranslator } from "../../docsLocale";

const t = createDocsTranslator({
  title: { zh: "路径与点击", en: "Path and click events" },
  idle: { zh: "尚未点击", en: "Not clicked yet" },
  latest: { zh: "最近点击", en: "Last clicked" },
  home: { zh: "首页", en: "Home" },
  data: { zh: "数据展示", en: "Data" },
  table: { zh: "表格", en: "Table" },
});

const lastClick = useRef(t("idle"));

const items = [
  { label: t("home"), to: "/" },
  { label: t("data"), to: "/data/list" },
  { label: t("table"), to: "/data/table" },
];

const onClick = (event: CustomEvent): void => {
  lastClick.set(String(event.detail[1] || ""));
};

const code = `<elf-breadcrumb :items="items" @click="onClick"></elf-breadcrumb>`;

const script = `const items = [
  { label: "${t("home")}", to: "/" },
  { label: "${t("data")}", to: "/data/list" },
  { label: "${t("table")}", to: "/data/table" }
];

const lastClick = useRef("${t("idle")}");
const onClick = (event) => {
    lastClick.set(String(event.detail[1] || ""));
};`;

const PageBreadcrumbEx1 = defineHtml(`
  <elf-playground :title=${t("title")} :code=${code} :script=${script}>
    <span slot="status" class="demo-state">${t("latest")}：<strong>{{ lastClick }}</strong></span>
    <div style="display:grid;place-items:center;width:100%;min-height:160px">
      <elf-breadcrumb :items=${items} @click=${onClick}></elf-breadcrumb>
    </div>
  </elf-playground>
`);

export { PageBreadcrumbEx1 };
