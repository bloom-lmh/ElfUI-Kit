import { defineHtml } from "@elfui/core";

const propsRows = [
  { name: "items", type: "BreadcrumbItem[]", default: "[]", desc: "面包屑数据" },
  { name: "separator", type: "string", default: "'/'", desc: "分隔符文本" },
  { name: "separatorIcon", type: "string", default: "''", desc: "分隔图标文本，优先级高于 separator" },
  { name: "router", type: "boolean", default: "false", desc: "点击时同步 location.hash" },
  { name: "currentPath", type: "string", default: "''", desc: "受控当前路径，匹配 to 后激活" },
  { name: "maxItems", type: "number", default: "0", desc: "最大展示数量，0 表示不折叠" },
  { name: "props", type: "BreadcrumbFieldNames", default: "内置", desc: "字段别名映射" }
];

const eventsRows = [{ name: "click", type: "(item, to) => void", desc: "点击非当前项时触发" }];
const itemRows = [
  { name: "to", type: "string | BreadcrumbRouteLocation", default: "''", desc: "目标路由" },
  { name: "replace", type: "boolean", default: "false", desc: "替换当前历史记录" }
];
const slotsRows = [{ name: "default", desc: "组合式 elf-breadcrumb-item 内容" }];

const PageBreadcrumbProps = defineHtml(`
  <h2>API</h2>
  <elf-props-table title="Props" :rows=${propsRows}></elf-props-table>
  <elf-props-table title="Events" :rows=${eventsRows}></elf-props-table>
  <elf-props-table title="BreadcrumbItem Props" :rows=${itemRows}></elf-props-table>
  <elf-props-table title="Slots" :rows=${slotsRows}></elf-props-table>
`);

export { PageBreadcrumbProps };
