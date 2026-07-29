import { defineHtml } from "@elfui/core";
import { createDocsPicker } from "../../docsLocale";

const pick = createDocsPicker();
const propsRows = [
    { name: "type", type: "info | success | warning | danger", default: "info", desc: pick("类型", "Alert type.") },
    { name: "variant", type: "tonal | elevated | outlined | filled | plain", default: "tonal", desc: pick("变体风格", "Visual variant.") },
    { name: "title", type: "string", default: "", desc: pick("标题", "Alert title.") },
    { name: "description", type: "string", default: "", desc: pick("描述文本", "Description text.") },
    { name: "closable", type: "boolean", default: "false", desc: pick("显示关闭按钮", "Show the close button.") },
    { name: "close-text", type: "string", default: "", desc: pick("关闭按钮文字（替代 × 图标）", "Close-button text that replaces the × icon.") },
    { name: "show-icon", type: "boolean", default: "true", desc: pick("显示图标", "Show the status icon.") },
    { name: "center", type: "boolean", default: "false", desc: pick("内容居中", "Center the content.") },
    { name: "density", type: "default | compact", default: "default", desc: pick("紧凑模式", "Content density.") },
    { name: "prominent", type: "boolean", default: "false", desc: pick("加粗左侧色条（8px）", "Use an 8px accent bar.") },
];

const eventsRows = [
    { name: "close", type: "() => void", desc: pick("点击关闭按钮触发", "Emitted when the close button is clicked.") },
];

const slotsRows = [
    { name: "default", desc: pick("描述内容（替换 description 属性）", "Description content that replaces the description prop.") },
    { name: "title", desc: pick("自定义标题内容", "Custom title content.") },
    { name: "icon", desc: pick("自定义图标", "Custom icon.") },
];

const PageAlertProps = defineHtml(`
    <h2>API</h2>
    <elf-props-table title="Props" :rows=${propsRows}></elf-props-table>
    <elf-props-table title="Events" :rows=${eventsRows}></elf-props-table>
    <elf-props-table title="Slots" :rows=${slotsRows}></elf-props-table>
`);

export { PageAlertProps };
