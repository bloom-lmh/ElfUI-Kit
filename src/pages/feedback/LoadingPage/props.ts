import { defineHtml } from "@elfui/core";

const propsRows = [
  { name: "loading", type: "boolean", default: "false", desc: "是否显示加载遮罩" },
  { name: "text", type: "string", default: "''", desc: "加载状态说明" },
  { name: "fullscreen", type: "boolean", default: "false", desc: "使用固定定位覆盖视口" },
  { name: "background", type: "string", default: "rgba(255,255,255,0.72)", desc: "遮罩背景色" },
  { name: "closable", type: "boolean", default: "false", desc: "全屏模式是否显示退出按钮" },
  { name: "variant", type: "spinner | dots | pulse | bars", default: "spinner", desc: "内置加载动效" },
  { name: "svg", type: "string", default: "''", desc: "自定义 SVG path 数据" },
  { name: "svg-view-box", type: "string", default: "0 0 50 50", desc: "自定义 SVG 的 viewBox" },
  { name: "lock", type: "boolean", default: "false", desc: "全屏加载时锁定页面滚动" }
];

const eventsRows = [
  { name: "update:loading", type: "(loading: boolean) => void", desc: "可关闭全屏遮罩请求更新受控值" },
  { name: "close", type: "() => void", desc: "点击全屏退出按钮时触发" }
];

const serviceRows = [
  { name: "target", type: "HTMLElement | string", default: "document.body", desc: "局部遮罩目标" },
  { name: "body", type: "boolean", default: "false", desc: "将局部遮罩挂载到 body 并同步目标几何信息" },
  { name: "fullscreen", type: "boolean", default: "未提供 target 时为 true", desc: "创建全屏遮罩" },
  { name: "closable", type: "boolean", default: "全屏时为 true", desc: "显示退出按钮；关闭后恢复触发元素焦点" },
  { name: "lock", type: "boolean", default: "false", desc: "锁定 body 滚动，支持多实例计数" },
  { name: "text / background / variant", type: "LoadingOptions", desc: "配置文案、背景和内置动效" },
  { name: "svg / svgViewBox", type: "string", desc: "配置自定义 SVG path" },
  { name: "customClass", type: "string", desc: "添加到 service 宿主元素的类名" },
  { name: "close() / setText()", type: "LoadingInstance", desc: "关闭实例或更新加载文案" }
];

const directiveRows = [
  { name: "v-loading", type: "boolean | LoadingDirectiveValue", desc: "为绑定元素创建并自动销毁局部 Loading service" }
];

const PageLoadingProps = defineHtml(`
  <h2>API</h2>
  <elf-props-table title="Props" :rows=${propsRows}></elf-props-table>
  <elf-props-table title="Events" :rows=${eventsRows}></elf-props-table>
  <elf-props-table title="Service" :rows=${serviceRows}></elf-props-table>
  <elf-props-table title="Directive" :rows=${directiveRows}></elf-props-table>
`);

export { PageLoadingProps };
