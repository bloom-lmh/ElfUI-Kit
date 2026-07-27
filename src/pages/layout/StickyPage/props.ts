import { defineHtml } from "@elfui/core";

const propsRows = [
  { name: "offset", type: "string | number", default: "0", desc: "吸附偏移距离" },
  { name: "position", type: "top | bottom", default: "top", desc: "吸附位置" },
  { name: "target", type: "string", default: "''", desc: "限制吸附范围的 CSS 选择器" },
  { name: "teleported", type: "boolean", default: "false", desc: "将吸附内容投影到 append-to" },
  { name: "append-to", type: "string | HTMLElement", default: "body", desc: "Teleport 目标" },
  { name: "top", type: "string | number", default: "0", desc: "顶部吸附偏移" },
  {
    name: "bottom",
    type: "string | number",
    default: "''",
    desc: "底部吸附偏移；设置后启用 bottom 模式"
  },
  { name: "zIndex", type: "string | number", default: "100", desc: "吸附层级" },
  { name: "disabled", type: "boolean", default: "false", desc: "禁用吸附" }
];

const eventsRows = [
  { name: "change", type: "(fixed: boolean) => void", desc: "吸附状态变化时触发" },
  { name: "scroll", type: "({ scrollTop, fixed }) => void", desc: "滚动更新时触发" }
];

const exposesRows = [
  { name: "update", type: "() => void", desc: "立即更新吸附状态" },
  { name: "updateRoot", type: "() => void", desc: "重新解析目标容器" }
];

const slotsRows = [{ name: "default", desc: "需要吸附的内容" }];

const PageStickyProps = defineHtml(`
  <h2>API</h2>
  <elf-props-table title="Props" :rows=${propsRows}></elf-props-table>
  <elf-props-table title="Events" :rows=${eventsRows}></elf-props-table>
  <elf-props-table title="Exposes" :rows=${exposesRows}></elf-props-table>
  <elf-props-table title="Slots" :rows=${slotsRows}></elf-props-table>
`);

export { PageStickyProps };
