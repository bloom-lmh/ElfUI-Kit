import { defineHtml } from "@elfui/core";

const propsRows = [
  { name: "open", type: "boolean", desc: "v-model:open" },
  { name: "title", type: "string" },
  { name: "direction", type: "rtl|ltr|ttb|btt", default: "rtl" },
  { name: "size", type: "string", default: "'30%'" },
  { name: "resizable", type: "boolean", default: "false", desc: "拖动内侧边缘调整尺寸" },
  { name: "min-size", type: "number | string", default: "160", desc: "可调整的最小尺寸" },
  { name: "max-size", type: "number | string", default: "'90%'", desc: "可调整的最大尺寸" },
  { name: "modal", type: "boolean", default: "true" },
  { name: "close-on-mask", type: "boolean", default: "true" },
  { name: "close-on-escape", type: "boolean", default: "true" },
  { name: "closable", type: "boolean", default: "true" },
  { name: "lock-scroll", type: "boolean", default: "true" },
  { name: "before-close", type: "()=>boolean|Promise" }
];

const eventsRows = [
  { name: "update:open", type: "(open:boolean)=>void" },
  { name: "close" },
  { name: "closed" },
  { name: "opened" },
  { name: "open-auto-focus", type: "()=>void", desc: "初始焦点进入抽屉后触发" },
  { name: "close-auto-focus", type: "()=>void", desc: "焦点恢复到打开元素后触发" },
  { name: "resize-start", type: "(detail: DrawerResizeDetail)=>void" },
  { name: "resize", type: "(detail: DrawerResizeDetail)=>void" },
  { name: "resize-end", type: "(detail: DrawerResizeDetail)=>void" }
];

const slotsRows = [
  { name: "default", desc: "抽屉主体" },
  { name: "header", desc: "自定义标题区域" },
  { name: "footer", desc: "底部操作区" }
];

const methodsRows = [
  { name: "close() / handleClose()", type: "() => void", desc: "执行 before-close 后请求关闭" },
  { name: "resetSize()", type: "() => void", desc: "清除拖动结果并恢复 size" }
];

const PageDrawerProps = defineHtml(`
  <h2>API</h2>
  <elf-props-table title="Props" :rows=${propsRows} />
  <elf-props-table title="Events" :rows=${eventsRows} />
  <elf-props-table title="Slots" :rows=${slotsRows} />
  <elf-props-table title="Methods" :rows=${methodsRows} />
`);

export { PageDrawerProps };
