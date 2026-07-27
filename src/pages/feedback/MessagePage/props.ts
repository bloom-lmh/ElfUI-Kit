import { defineHtml } from "@elfui/core";

const apiRows = [
  { name: "ElfMessage(options | string)", type: "Function", desc: "通用入口" },
  { name: "ElfMessage.info(msg)", type: "Function", desc: "普通提示" },
  { name: "ElfMessage.success(msg)", type: "Function", desc: "成功提示" },
  { name: "ElfMessage.warning(msg)", type: "Function", desc: "警告提示" },
  { name: "ElfMessage.danger(msg)", type: "Function", desc: "错误提示" },
  { name: "ElfMessage.error(msg)", type: "Function", desc: "danger 的兼容别名" },
  { name: "ElfMessage.closeAll()", type: "Function", desc: "关闭全部提示" }
];

const optsRows = [
  { name: "message", type: "string", default: "''", desc: "消息内容" },
  { name: "type", type: "info | success | warning | danger | error", default: "info" },
  { name: "duration", type: "number", default: "3000", desc: "持续毫秒数，0 表示不自动关闭" },
  { name: "closable", type: "boolean", default: "false", desc: "显示关闭按钮" },
  { name: "action", type: "string", default: "''", desc: "操作按钮文案" },
  { name: "position", type: "top | bottom", default: "top", desc: "显示位置" },
  { name: "offset", type: "number", default: "20", desc: "距离视口边缘的偏移" },
  { name: "zIndex", type: "number", default: "2000", desc: "自定义层级" },
  { name: "customClass", type: "string", default: "''", desc: "宿主元素类名" },
  { name: "onAction", type: "() => void", default: "-", desc: "点击操作按钮时触发" },
  { name: "onClick", type: "() => void", default: "-", desc: "点击消息时触发" },
  { name: "onClose", type: "() => void", default: "-", desc: "关闭并移除后触发" }
];

const PageMessageProps = defineHtml(`
  <h2>API</h2>
  <elf-props-table title="函数 API" :rows=${apiRows}></elf-props-table>
  <elf-props-table title="MessageOptions" :rows=${optsRows}></elf-props-table>
`);

export { PageMessageProps };
