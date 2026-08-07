import { defineHtml } from "@elfui/core";
import { createDocsPicker } from "../../docsLocale";

const pick = createDocsPicker();

const propsRows = [
  {
    name: "loading",
    type: "boolean",
    default: "false",
    desc: pick("是否显示加载遮罩", "Whether the loading overlay is visible."),
  },
  {
    name: "text",
    type: "string",
    default: "''",
    desc: pick("加载状态说明", "Accessible loading status text."),
  },
  {
    name: "fullscreen",
    type: "boolean",
    default: "false",
    desc: pick("使用固定定位覆盖视口", "Cover the viewport with a fixed overlay."),
  },
  {
    name: "background",
    type: "string",
    default: "rgba(255,255,255,0.72)",
    desc: pick("遮罩背景色", "Overlay background color."),
  },
  {
    name: "closable",
    type: "boolean",
    default: "false",
    desc: pick("全屏模式是否显示退出按钮", "Show an exit button in fullscreen mode."),
  },
  {
    name: "plain",
    type: "boolean",
    default: "false",
    desc: pick("移除加载图标外层卡片表面", "Remove the indicator card surface."),
  },
  {
    name: "variant",
    type: "spinner | dots | pulse | bars",
    default: "spinner",
    desc: pick("内置加载动效", "Built-in loading animation."),
  },
  {
    name: "svg",
    type: "string",
    default: "''",
    desc: pick("自定义 SVG path 数据", "Custom SVG path data."),
  },
  {
    name: "svg-view-box",
    type: "string",
    default: "0 0 50 50",
    desc: pick("自定义 SVG 的 viewBox", "View box for the custom SVG."),
  },
  {
    name: "lock",
    type: "boolean",
    default: "false",
    desc: pick("加载期间锁定页面滚动", "Lock page scrolling while loading is active."),
  },
];

const eventsRows = [
  {
    name: "update:loading",
    type: "(loading: boolean) => void",
    desc: pick(
      "可关闭全屏遮罩请求更新受控值",
      "Requests a controlled loading-state update when the overlay closes.",
    ),
  },
  {
    name: "close",
    type: "() => void",
    desc: pick("点击全屏退出按钮时触发", "Emitted when the fullscreen exit button is clicked."),
  },
  {
    name: "closed",
    type: "() => void",
    desc: pick(
      "遮罩退场并释放资源后触发",
      "Emitted after the overlay leaves and releases its resources.",
    ),
  },
];

const slotsRows = [
  {
    name: "default",
    desc: pick("被加载遮罩覆盖的内容", "Content covered by the loading overlay."),
  },
  {
    name: "indicator",
    desc: pick("自定义加载图标或 CSS 动画", "Custom loading icon or CSS animation."),
  },
];

const serviceRows = [
  {
    name: "target",
    type: "HTMLElement | string",
    default: "document.body",
    desc: pick("局部遮罩目标", "Target for a local overlay."),
  },
  {
    name: "body",
    type: "boolean",
    default: "false",
    desc: pick(
      "将局部遮罩挂载到 body 并同步目标几何信息",
      "Mount a local overlay to body and track the target geometry.",
    ),
  },
  {
    name: "fullscreen",
    type: "boolean",
    default: pick("未提供 target 时为 true", "true without target"),
    desc: pick("创建全屏遮罩", "Create a fullscreen overlay."),
  },
  {
    name: "closable",
    type: "boolean",
    default: pick("全屏时为 true", "true when fullscreen"),
    desc: pick(
      "显示退出按钮；关闭后恢复触发元素焦点",
      "Show an exit button and restore trigger focus after closing.",
    ),
  },
  {
    name: "lock",
    type: "boolean",
    default: "false",
    desc: pick(
      "锁定 body 滚动，支持多实例计数",
      "Lock body scrolling with concurrent-instance accounting.",
    ),
  },
  {
    name: "text",
    type: "LoadingOptions",
    desc: pick(
      "配置文案、背景和内置动效",
      "Configure copy, background, and the built-in animation.",
    ),
  },
  {
    name: "background",
    type: "LoadingOptions",
    desc: pick(
      "配置文案、背景和内置动效",
      "Configure copy, background, and the built-in animation.",
    ),
  },
  {
    name: "variant",
    type: "LoadingOptions",
    desc: pick(
      "配置文案、背景和内置动效",
      "Configure copy, background, and the built-in animation.",
    ),
  },
  {
    name: "plain",
    type: "LoadingOptions",
    desc: pick(
      "配置文案、背景和内置动效",
      "Configure copy, background, and the built-in animation.",
    ),
  },
  {
    name: "svg",
    type: "string",
    desc: pick("配置自定义 SVG path", "Configure a custom SVG path."),
  },
  {
    name: "svgViewBox",
    type: "string",
    desc: pick("配置自定义 SVG path", "Configure a custom SVG path."),
  },
  {
    name: "customClass",
    type: "string",
    desc: pick("添加到服务宿主元素的类名", "Class added to the service host element."),
  },
  {
    name: "close()",
    type: "LoadingInstance",
    desc: pick("关闭实例或更新加载文案", "Close the instance or update its loading text."),
  },
  {
    name: "setText()",
    type: "LoadingInstance",
    desc: pick("关闭实例或更新加载文案", "Close the instance or update its loading text."),
  },
];

const directiveRows = [
  {
    name: "v-loading",
    type: "boolean | LoadingDirectiveValue",
    desc: pick(
      "为绑定元素创建并自动销毁局部加载服务",
      "Create and automatically dispose a local loading service for the bound element.",
    ),
  },
];

const PageLoadingProps = defineHtml(`
  <elf-api-builder component="elf-loading" title="API">
  <elf-props-table role="props" title="Props" :rows=${propsRows}></elf-props-table>
  <elf-props-table role="events" title="Events" :rows=${eventsRows}></elf-props-table>
  <elf-props-table role="slots" title="Slots" :rows=${slotsRows}></elf-props-table>
  <elf-props-table title="Service" :rows=${serviceRows}></elf-props-table>
  <elf-props-table title="Directive" :rows=${directiveRows}></elf-props-table>
  </elf-api-builder>
`);

export { PageLoadingProps };
