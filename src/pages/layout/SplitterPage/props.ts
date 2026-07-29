import { defineHtml } from "@elfui/core";
import { createDocsTranslator } from "../../docsLocale";

const t = createDocsTranslator({
  model: { zh: "第一个面板所占百分比", en: "Percentage occupied by the first panel." },
  min: { zh: "第一个面板的最小百分比", en: "Minimum percentage for the first panel." },
  max: { zh: "第一个面板的最大百分比", en: "Maximum percentage for the first panel." },
  vertical: { zh: "使用上下排列的垂直分割", en: "Use a vertical split with panels arranged top to bottom." },
  disabled: { zh: "禁用拖动和键盘调整", en: "Disable pointer and keyboard resizing." },
  collapsible: { zh: "允许折叠第一个面板", en: "Allow the first panel to collapse." },
  resizable: { zh: "允许使用指针和键盘调整", en: "Allow pointer and keyboard resizing." },
  storage: { zh: "用于持久化首个面板尺寸的本地存储键", en: "Local storage key used to persist the first panel size." },
  panelSize: { zh: "未显式绑定 modelValue 时的初始百分比", en: "Initial percentage when modelValue is not bound explicitly." },
  panelRange: { zh: "面板尺寸边界", en: "Panel size boundaries." },
  panelCollapse: { zh: "显示折叠控制并支持 Home 和 End 键", en: "Show collapse controls and support the Home and End keys." },
  panelResize: { zh: "是否允许调整当前面板", en: "Whether the current panel can be resized." },
  lazy: { zh: "首次展开前不渲染默认插槽", en: "Do not render the default slot before the first expansion." },
  collapsed: { zh: "当前面板是否已折叠", en: "Whether the panel is currently collapsed." },
  first: { zh: "第一个面板的内容", en: "Content of the first panel." },
  second: { zh: "第二个面板的内容", en: "Content of the second panel." },
  panelDefault: { zh: "面板内容", en: "Panel content." },
  update: { zh: "尺寸更新时触发", en: "Emitted when the size changes." },
  lifecycle: { zh: "指针调整开始和结束时触发", en: "Emitted when pointer resizing starts and ends." },
  collapse: { zh: "折叠状态变化时触发", en: "Emitted when the collapsed state changes." }
});

const splitterRows = () => [
  { name: "modelValue", type: "number", default: "50", desc: t("model") },
  { name: "min", type: "number", default: "10", desc: t("min") },
  { name: "max", type: "number", default: "90", desc: t("max") },
  { name: "vertical", type: "boolean", default: "false", desc: t("vertical") },
  { name: "disabled", type: "boolean", default: "false", desc: t("disabled") },
  { name: "collapsible", type: "boolean", default: "false", desc: t("collapsible") },
  { name: "resizable", type: "boolean", default: "true", desc: t("resizable") },
  { name: "storage-key", type: "string", default: "''", desc: t("storage") }
];

const panelRows = () => [
  { name: "size", type: "number", default: "50", desc: t("panelSize") },
  { name: "min / max", type: "number", default: "0 / 100", desc: t("panelRange") },
  { name: "collapsible", type: "boolean", default: "false", desc: t("panelCollapse") },
  { name: "resizable", type: "boolean", default: "true", desc: t("panelResize") },
  { name: "lazy", type: "boolean", default: "false", desc: t("lazy") },
  { name: "collapsed", type: "boolean", default: "false", desc: t("collapsed") }
];

const slotRows = () => [
  { name: "first", type: "—", default: "—", desc: t("first") },
  { name: "second", type: "—", default: "—", desc: t("second") }
];

const panelSlotRows = () => [
  { name: "default", type: "—", default: "—", desc: t("panelDefault") }
];

const eventRows = () => [
  { name: "update:modelValue / change", type: "CustomEvent<number>", desc: t("update") },
  { name: "resize-start / resize-end", type: "CustomEvent<number>", desc: t("lifecycle") },
  { name: "collapse", type: "CustomEvent<boolean>", desc: t("collapse") }
];

const PageSplitterProps = defineHtml(`
  <h2>API</h2>
  <elf-props-table title="elf-splitter Props" :rows=${splitterRows()} />
  <elf-props-table title="elf-splitter-panel Props" :rows=${panelRows()} />
  <elf-props-table title="elf-splitter Slots" :rows=${slotRows()} />
  <elf-props-table title="elf-splitter-panel Slots" :rows=${panelSlotRows()} />
  <elf-props-table title="Events" :rows=${eventRows()} />
`);

export { PageSplitterProps };
