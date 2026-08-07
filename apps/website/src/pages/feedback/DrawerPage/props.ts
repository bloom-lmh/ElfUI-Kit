import { defineHtml } from "@elfui/core";
import { createDocsPicker, createDocsTranslator } from "../../docsLocale";

const pick = createDocsPicker();
const t = createDocsTranslator({
  props: { zh: "属性", en: "Props" },
  events: { zh: "事件", en: "Events" },
  slots: { zh: "插槽", en: "Slots" },
  methods: { zh: "方法", en: "Methods" },
});

const propsRows = [
  {
    name: "open",
    type: "boolean",
    default: "false",
    desc: pick("v-model:open 控制可见状态。", "Visible state controlled by v-model:open."),
  },
  { name: "title", type: "string", default: "''", desc: pick("抽屉标题。", "Drawer title.") },
  {
    name: "direction",
    type: "rtl | ltr | ttb | btt",
    default: "rtl",
    desc: pick("面板滑入方向。", "Panel slide-in direction."),
  },
  {
    name: "size",
    type: "string",
    default: "'30%'",
    desc: pick(
      "水平抽屉的宽度或垂直抽屉的高度。",
      "Width for horizontal drawers or height for vertical drawers.",
    ),
  },
  {
    name: "resizable",
    type: "boolean",
    default: "false",
    desc: pick(
      "允许通过内侧边缘或键盘调整尺寸。",
      "Allow resizing from the inner edge or keyboard.",
    ),
  },
  {
    name: "min-size",
    type: "number | string",
    default: "160",
    desc: pick("可调整的最小尺寸。", "Minimum resizable size."),
  },
  {
    name: "max-size",
    type: "number | string",
    default: "'90%'",
    desc: pick("可调整的最大尺寸。", "Maximum resizable size."),
  },
  {
    name: "modal",
    type: "boolean",
    default: "true",
    desc: pick("显示遮罩并声明模态语义。", "Show the backdrop and expose modal semantics."),
  },
  {
    name: "close-on-mask",
    type: "boolean",
    default: "true",
    desc: pick("点击遮罩时请求关闭。", "Request closing when the backdrop is clicked."),
  },
  {
    name: "close-on-escape",
    type: "boolean",
    default: "true",
    desc: pick("按 Escape 时请求关闭最上层抽屉。", "Request closing the topmost drawer on Escape."),
  },
  {
    name: "closable",
    type: "boolean",
    default: "true",
    desc: pick("显示标题栏关闭按钮。", "Show the header close button."),
  },
  {
    name: "lock-scroll",
    type: "boolean",
    default: "true",
    desc: pick("打开时锁定页面滚动。", "Lock page scrolling while open."),
  },
  {
    name: "before-close",
    type: "() => boolean | Promise<boolean>",
    default: "undefined",
    desc: pick("返回 false 或拒绝时阻止关闭。", "Prevent closing by returning false or rejecting."),
  },
];

const eventsRows = [
  {
    name: "update:open",
    type: "(open: boolean) => void",
    desc: pick("可见状态变化。", "Visible-state update."),
  },
  {
    name: "open",
    type: "() => void",
    desc: pick("开始显示时触发。", "Emitted when opening starts."),
  },
  {
    name: "opened",
    type: "() => void",
    desc: pick("已进入打开状态时触发。", "Emitted after entering the open state."),
  },
  {
    name: "close",
    type: "() => void",
    desc: pick("关闭请求通过后触发。", "Emitted after the close request is accepted."),
  },
  {
    name: "closed",
    type: "() => void",
    desc: pick(
      "关闭动画及清理完成后触发。",
      "Emitted after the closing transition and cleanup complete.",
    ),
  },
  {
    name: "open-auto-focus",
    type: "() => void",
    desc: pick("初始焦点进入抽屉后触发。", "Emitted after initial focus enters the drawer."),
  },
  {
    name: "close-auto-focus",
    type: "() => void",
    desc: pick("焦点恢复到触发元素后触发。", "Emitted after focus returns to the trigger."),
  },
  {
    name: "resize-start",
    type: "(detail: DrawerResizeDetail) => void",
    desc: pick("开始拖动或键盘调整时触发。", "Emitted when pointer or keyboard resizing starts."),
  },
  {
    name: "resize",
    type: "(detail: DrawerResizeDetail) => void",
    desc: pick("尺寸变化时触发。", "Emitted while the size changes."),
  },
  {
    name: "resize-end",
    type: "(detail: DrawerResizeDetail) => void",
    desc: pick("尺寸调整结束时触发。", "Emitted when resizing ends."),
  },
];

const slotsRows = [
  { name: "default", desc: pick("抽屉主体内容。", "Drawer body content.") },
  { name: "header", desc: pick("自定义标题区域。", "Custom header content.") },
  { name: "footer", desc: pick("底部操作区域。", "Footer actions.") },
];

const methodsRows = [
  {
    name: "close()",
    type: "() => void",
    desc: pick("执行 before-close 后请求关闭。", "Run before-close and request closing."),
  },
  {
    name: "handleClose()",
    type: "() => void",
    desc: pick("执行 before-close 后请求关闭。", "Run before-close and request closing."),
  },
  {
    name: "resetSize()",
    type: "() => void",
    desc: pick("清除用户调整结果并恢复 size。", "Clear the user-resized value and restore size."),
  },
];

const PageDrawerProps = defineHtml(`
  <elf-api-builder component="elf-drawer" title="API">
  <elf-props-table role="props" :title=${t("props")} :rows=${propsRows}></elf-props-table>
  <elf-props-table role="events" :title=${t("events")} :rows=${eventsRows}></elf-props-table>
  <elf-props-table role="slots" :title=${t("slots")} :rows=${slotsRows}></elf-props-table>
  <elf-props-table role="methods" :title=${t("methods")} :rows=${methodsRows}></elf-props-table>
  </elf-api-builder>
`);

export { PageDrawerProps };
