import { defineHtml } from "@elfui/core";

const propsRows = [
    { name: "type", type: "info | success | warning | danger", default: "info", desc: "类型" },
    { name: "variant", type: "tonal | elevated | outlined | filled | plain", default: "tonal", desc: "变体风格" },
    { name: "title", type: "string", default: "", desc: "标题" },
    { name: "description", type: "string", default: "", desc: "描述文本" },
    { name: "closable", type: "boolean", default: "false", desc: "显示关闭按钮" },
    { name: "close-text", type: "string", default: "", desc: "关闭按钮文字（替代 × 图标）" },
    { name: "show-icon", type: "boolean", default: "true", desc: "显示图标" },
    { name: "center", type: "boolean", default: "false", desc: "内容居中" },
    { name: "density", type: "default | compact", default: "default", desc: "紧凑模式" },
    { name: "prominent", type: "boolean", default: "false", desc: "加粗左侧色条（8px）" },
];

const eventsRows = [
    { name: "close", type: "() => void", desc: "点击关闭按钮触发" },
];

const slotsRows = [
    { name: "default", desc: "描述内容（替换 description 属性）" },
    { name: "title", desc: "自定义标题内容" },
    { name: "icon", desc: "自定义图标" },
];

const PageAlertProps = defineHtml(`
    <h2>API</h2>
    <elf-props-table title="Props" :rows=${propsRows}></elf-props-table>
    <elf-props-table title="Events" :rows=${eventsRows}></elf-props-table>
    <elf-props-table title="Slots" :rows=${slotsRows}></elf-props-table>
`);

export { PageAlertProps };
