import { defineHtml, useComponents } from "@elfui/core";

import { PagePageHeaderEx1 } from "./ex1";
import { PagePageHeaderEx2 } from "./ex2";

const propsRows = [
  { name: "title", type: "string", default: "Back", desc: "返回区域文本" },
  { name: "content", type: "string", default: "''", desc: "标题内容" },
  { name: "icon", type: "string", default: "‹", desc: "默认返回图标文本" }
];

const eventsRows = [{ name: "back", type: "() => void", desc: "点击返回按钮时触发" }];

const slotsRows = [
  { name: "breadcrumb", desc: "面包屑区域" },
  { name: "icon", desc: "返回图标" },
  { name: "title", desc: "返回文本" },
  { name: "content", desc: "标题内容" },
  { name: "extra", desc: "右侧扩展操作" }
];

useComponents({
  "page-page-header-ex1": PagePageHeaderEx1,
  "page-page-header-ex2": PagePageHeaderEx2
});

const PagePageHeader = defineHtml(`
  <elf-container>
    <h1>PageHeader 页头</h1>
    <p>用于详情页顶部返回区域，支持 back 事件和 breadcrumb/icon/title/content/extra 插槽。</p>

    <page-page-header-ex1 />

    <page-page-header-ex2 />

    <h2>API</h2>
    <elf-props-table title="Props" :rows=${propsRows}></elf-props-table>
    <elf-props-table title="Events" :rows=${eventsRows}></elf-props-table>
    <elf-props-table title="Slots" :rows=${slotsRows}></elf-props-table>
  </elf-container>
`);

export { PagePageHeader };
