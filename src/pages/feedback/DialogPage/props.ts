import { defineHtml } from "@elfui/core";

const propsRows = [
    { name: "open", type: "boolean", desc: "v-model:open 可见状态" },
    { name: "title", type: "string" },
    { name: "size", type: "sm|md|lg|fullscreen", default: "md" },
    { name: "close-on-mask", type: "boolean", default: "true" },
    { name: "close-on-escape", type: "boolean", default: "true" },
    { name: "closable", type: "boolean", default: "true" },
    { name: "lock-scroll", type: "boolean", default: "true" },
    { name: "before-close", type: "()=>boolean|Promise" },
];

const eventsRows = [
    { name: "update:open", type: "(open:boolean)=>void" },
    { name: "close", type: "()=>void" },
    { name: "closed", type: "()=>void" },
    { name: "opened", type: "()=>void" },
    { name: "open-auto-focus", type: "()=>void", desc: "初始焦点进入对话框后触发" },
    { name: "close-auto-focus", type: "()=>void", desc: "焦点恢复到打开元素后触发" },
];

const slotsRows = [
    { name: "default", desc: "对话框主体" },
    { name: "header", desc: "自定义标题区域" },
    { name: "footer", desc: "底部操作区" }
];

const methodsRows = [
    { name: "close() / handleClose()", type: "() => void", desc: "执行 before-close 后请求关闭" }
];

const PageDialogProps = defineHtml(`
    <h2>API</h2>
    <elf-props-table title="Props" :rows=${propsRows} />
    <elf-props-table title="Events" :rows=${eventsRows} />
    <elf-props-table title="Slots" :rows=${slotsRows} />
    <elf-props-table title="Methods" :rows=${methodsRows} />
`);

export { PageDialogProps };
