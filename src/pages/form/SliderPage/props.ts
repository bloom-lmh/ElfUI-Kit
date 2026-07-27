import { defineHtml } from "@elfui/core";

const propsRows = [
  { name: "modelValue", type: "number | [number, number]", default: "0", desc: "当前值" },
  { name: "min", type: "number", default: "0", desc: "最小值" },
  { name: "max", type: "number", default: "100", desc: "最大值" },
  { name: "step", type: "number", default: "1", desc: "步长" },
  { name: "range", type: "boolean", default: "false", desc: "范围选择" },
  { name: "vertical", type: "boolean", default: "false", desc: "垂直滑块" },
  { name: "height", type: "string | number", default: "240", desc: "垂直滑块高度" },
  { name: "disabled", type: "boolean", default: "false", desc: "禁用状态" },
  { name: "readonly", type: "boolean", default: "false", desc: "只读状态" },
  { name: "showTooltip", type: "boolean", default: "true", desc: "显示数值提示" },
  { name: "tooltipClass", type: "string", default: "''", desc: "数值提示的附加 CSS 类" },
  { name: "placement", type: "top | bottom | left | right", default: "top", desc: "数值提示的位置" },
  { name: "persistent", type: "boolean", default: "true", desc: "保留提示节点渲染的兼容属性" },
  { name: "showStops", type: "boolean", default: "false", desc: "显示步进点" },
  { name: "segmented", type: "boolean", default: "false", desc: "按 step 或 marks 分段展示轨道" },
  { name: "showInput", type: "boolean", default: "false", desc: "显示数字输入框；范围模式下无效" },
  { name: "showInputControls", type: "boolean", default: "true", desc: "显示数字输入框的原生调节按钮" },
  { name: "inputSize", type: "sm | md | lg | small | default | large", default: "''", desc: "数字输入框尺寸" },
  { name: "marks", type: "SliderMark[] | Record<string, string | number>", default: "[]", desc: "刻度标记" },
  { name: "formatTooltip", type: "(value) => string", default: "undefined", desc: "格式化提示文案" },
  { name: "formatValueText", type: "(value) => string", default: "undefined", desc: "辅助技术读取的值文本" },
  { name: "ariaLabel", type: "string", default: "''", desc: "滑块的无障碍标签" },
  { name: "rangeStartLabel", type: "string", default: "''", desc: "范围起点的无障碍标签" },
  { name: "rangeEndLabel", type: "string", default: "''", desc: "范围终点的无障碍标签" },
  { name: "label", type: "string", default: "''", desc: "滑块及数字输入框的无障碍标签" },
  { name: "validateEvent", type: "boolean", default: "true", desc: "变更时是否触发表单校验" },
  { name: "color", type: "string", default: "''", desc: "激活轨道颜色" },
  { name: "size", type: "sm | md | lg", default: "md", desc: "滑块尺寸" }
];

const eventsRows = [
  { name: "update:modelValue", type: "(value) => void", desc: "值变化时触发" },
  { name: "input", type: "(value) => void", desc: "拖动或输入时触发" },
  { name: "change", type: "(value) => void", desc: "提交变化时触发" }
];

const methodsRows = [
  { name: "setValue(value)", desc: "主动设置值并触发 change" },
  { name: "clear()", desc: "单值清空为最小值；范围清空为 [min, min]" }
];

const PageSliderProps = defineHtml(`
  <h2>API</h2>
  <elf-props-table title="属性" :rows.prop=${propsRows}></elf-props-table>
  <elf-props-table title="事件" :rows.prop=${eventsRows}></elf-props-table>
  <elf-props-table title="方法" :rows.prop=${methodsRows}></elf-props-table>
`);

export { PageSliderProps };
