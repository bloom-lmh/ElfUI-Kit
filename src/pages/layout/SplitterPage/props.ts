import { defineHtml } from "@elfui/core";

const splitterRows = [
  { name: "modelValue", type: "number", default: "50", desc: "第一个面板所占百分比" },
  { name: "min", type: "number", default: "10", desc: "第一个面板最小百分比" },
  { name: "max", type: "number", default: "90", desc: "第一个面板最大百分比" },
  { name: "vertical", type: "boolean", default: "false", desc: "垂直分割（上下布局）" },
  { name: "disabled", type: "boolean", default: "false", desc: "禁用拖拽调整" },
  { name: "collapsible", type: "boolean", default: "false", desc: "允许折叠第一个面板" },
  { name: "resizable", type: "boolean", default: "true", desc: "允许指针和键盘调整" },
  { name: "storage-key", type: "string", default: "''", desc: "持久化首个面板尺寸的 localStorage key" }
];

const panelRows = [
  { name: "size", type: "number", default: "50", desc: "未显式绑定 modelValue 时的初始百分比" },
  { name: "min / max", type: "number", default: "0 / 100", desc: "Panel 尺寸边界" },
  { name: "collapsible", type: "boolean", default: "false", desc: "显示折叠控制并支持 Home/End" },
  { name: "resizable", type: "boolean", default: "true", desc: "是否允许调整当前 Panel" },
  { name: "lazy", type: "boolean", default: "false", desc: "首次展开前不渲染默认插槽" }
];

const slotRows = [
  { name: "first", desc: "第一个面板内容" },
  { name: "second", desc: "第二个面板内容" }
];

const eventRows = [
  { name: "update:modelValue / change", type: "CustomEvent<number>", desc: "尺寸更新时触发" },
  { name: "resize-start / resize-end", type: "CustomEvent<number>", desc: "指针调整生命周期" },
  { name: "collapse", type: "CustomEvent<boolean>", desc: "折叠状态变化" }
];

const PageSplitterProps = defineHtml(`
  <h2>API</h2>
  <elf-props-table title="elf-splitter Props" :rows="splitterRows" />
  <elf-props-table title="elf-splitter-panel Props" :rows="panelRows" />
  <elf-props-table title="elf-splitter Slots" :rows="slotRows" />
  <elf-props-table title="elf-splitter Events" :rows="eventRows" />
`);

export { PageSplitterProps };
