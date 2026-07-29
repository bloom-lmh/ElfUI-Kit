import { defineHtml } from "@elfui/core";
import { createDocsPicker } from "../../docsLocale";

const pick = createDocsPicker();

const propsRows = [
  { name: "items", type: "BreadcrumbItem[]", default: "[]", desc: pick("面包屑数据", "Breadcrumb data.") },
  { name: "separator", type: "string", default: "'/'", desc: pick("分隔符文本", "Separator text.") },
  { name: "separatorIcon", type: "string", default: "''", desc: pick("分隔图标文本，优先级高于 separator", "Separator icon text; takes priority over separator.") },
  { name: "router", type: "boolean", default: "false", desc: pick("点击时同步 location.hash", "Synchronize location.hash after clicking.") },
  { name: "currentPath", type: "string", default: "''", desc: pick("受控当前路径，匹配 to 后激活", "Controlled current path; activates the matching to value.") },
  { name: "maxItems", type: "number", default: "0", desc: pick("最大展示数量，0 表示不折叠", "Maximum visible items; 0 disables collapsing.") },
  { name: "props", type: "BreadcrumbFieldNames", default: "built-in", desc: pick("字段别名映射", "Field alias mapping.") }
];

const eventsRows = [{ name: "click", type: "(item, to) => void", desc: pick("点击非当前项时触发", "Emitted after clicking a non-current item.") }];
const itemRows = [
  { name: "to", type: "string | BreadcrumbRouteLocation", default: "''", desc: pick("目标路由", "Target route.") },
  { name: "replace", type: "boolean", default: "false", desc: pick("替换当前历史记录", "Replace the current history entry.") }
];
const slotsRows = [{ name: "default", desc: pick("组合式 elf-breadcrumb-item 内容", "Compositional elf-breadcrumb-item content.") }];

const PageBreadcrumbProps = defineHtml(`
  <h2>API</h2>
  <elf-props-table title="Props" :rows=${propsRows}></elf-props-table>
  <elf-props-table title="Events" :rows=${eventsRows}></elf-props-table>
  <elf-props-table title="BreadcrumbItem Props" :rows=${itemRows}></elf-props-table>
  <elf-props-table title="Slots" :rows=${slotsRows}></elf-props-table>
`);

export { PageBreadcrumbProps };
