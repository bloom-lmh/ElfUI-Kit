import { defineHtml, useRef } from "@elfui/core";


const lastClick = useRef("尚未点击");

const items = [
  { label: "首页", to: "/" },
  { label: "数据展示", to: "/data/list" },
  { label: "Table 表格", to: "/data/table" }
];

const onClick = (event: CustomEvent): void => {
  lastClick.set(String(event.detail[1] || ""));
};

const code = `<elf-breadcrumb :items="items" @click="onClick"></elf-breadcrumb>`;

const script = `const items = [
  { label: "首页", to: "/" },
  { label: "数据展示", to: "/data/list" },
  { label: "Table 表格", to: "/data/table" }
];

const lastClick = useRef("尚未点击");
const onClick = (event) => {
    lastClick.set(String(event.detail[1] || ""));
};`;

const PageBreadcrumbEx1 = defineHtml(`
  <elf-playground title="路径与点击" :code=${code} :script=${script}>
    <span slot="status" class="demo-state">最近点击：<strong>{{ lastClick }}</strong></span>
    <div style="display:grid;place-items:center;width:100%;min-height:160px">
      <elf-breadcrumb :items=${items} @click=${onClick}></elf-breadcrumb>
    </div>
  </elf-playground>
`);

export { PageBreadcrumbEx1 };
