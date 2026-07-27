import { defineHtml } from "@elfui/core";
import { createDocsTranslator } from "../../docsLocale";

const t = createDocsTranslator({
  current: { zh: "当前激活步骤索引，从 0 开始", en: "Zero-based active step index" },
  direction: { zh: "步骤条方向", en: "Stepper direction" },
  items: { zh: "步骤数据", en: "Step data" },
  space: { zh: "步骤间距；数字会转换为 px", en: "Step spacing; numbers are converted to px" },
  process: { zh: "当前步骤状态", en: "Status of the current step" },
  finish: { zh: "已完成步骤状态", en: "Status of completed steps" },
  align: { zh: "水平步骤居中对齐", en: "Center horizontal step labels" },
  simple: { zh: "简洁模式", en: "Simple mode" },
  size: { zh: "步骤图标尺寸", en: "Step indicator size" },
  clickable: { zh: "允许点击相邻或已完成步骤", en: "Allow clicking adjacent or completed steps" },
  alternative: { zh: "替代标签布局", en: "Alternative label layout" },
  editable: { zh: "允许直接选择任意可用步骤", en: "Allow selecting any enabled step" },
  linear: { zh: "限制用户沿既定路径前进", en: "Restrict navigation to the defined path" },
  panels: { zh: "显示集成内容面板与操作栏", en: "Show the integrated content panel and actions" },
  hide: { zh: "隐藏上一步和下一步操作", en: "Hide previous and next actions" },
  previous: { zh: "上一步按钮文字", en: "Previous action label" },
  next: { zh: "下一步按钮文字", en: "Next action label" },
  title: { zh: "步骤标题", en: "Step title" },
  description: { zh: "步骤说明", en: "Step description" },
  content: { zh: "集成步骤面板内容", en: "Integrated panel content" },
  icon: { zh: "自定义图标文字", en: "Custom indicator content" },
  status: { zh: "显式步骤状态", en: "Explicit step status" },
  disabled: { zh: "禁用该步骤", en: "Disable this step" },
  value: { zh: "稳定业务值", en: "Stable business value" },
  defaultSlot: { zh: "组合式 elf-step 子元素", en: "Composed elf-step children" },
  panelSlot: { zh: "覆盖集成步骤面板内容", en: "Override integrated panel content" },
  eventUpdate: { zh: "请求更新当前步骤", en: "Requests an active-step update" },
  eventChange: { zh: "步骤切换后触发", en: "Emitted after the step changes" },
  methodNext: { zh: "切换到下一可用步骤", en: "Move to the next enabled step" },
  methodPrev: { zh: "切换到上一可用步骤", en: "Move to the previous enabled step" },
  methodSet: { zh: "切换到指定步骤", en: "Move to a specific step" }
});

const propsRows = () => [
  { name: "active", type: "number", default: "0", desc: t("current") },
  { name: "direction", type: "horizontal | vertical", default: "horizontal", desc: t("direction") },
  { name: "items", type: "StepItem[]", default: "[]", desc: t("items") },
  { name: "space", type: "string | number", default: "-", desc: t("space") },
  { name: "processStatus", type: "StepStatus", default: "process", desc: t("process") },
  { name: "finishStatus", type: "StepStatus", default: "finish", desc: t("finish") },
  { name: "alignCenter", type: "boolean", default: "false", desc: t("align") },
  { name: "simple", type: "boolean", default: "false", desc: t("simple") },
  { name: "size", type: "sm | md | lg", default: "md", desc: t("size") },
  { name: "clickable", type: "boolean", default: "true", desc: t("clickable") },
  { name: "alternativeLabel / altLabels", type: "boolean", default: "false", desc: t("alternative") },
  { name: "editable", type: "boolean", default: "false", desc: t("editable") },
  { name: "linear", type: "boolean", default: "true", desc: t("linear") },
  { name: "showPanels", type: "boolean", default: "false", desc: t("panels") },
  { name: "hideActions", type: "boolean", default: "false", desc: t("hide") },
  { name: "previousText", type: "string", default: "locale", desc: t("previous") },
  { name: "nextText", type: "string", default: "locale", desc: t("next") }
];

const itemRows = () => [
  { name: "title", type: "string", default: "-", desc: t("title") },
  { name: "description", type: "string", default: "-", desc: t("description") },
  { name: "content", type: "string", default: "-", desc: t("content") },
  { name: "icon", type: "string", default: "-", desc: t("icon") },
  { name: "status", type: "wait | process | finish | error", default: "-", desc: t("status") },
  { name: "disabled", type: "boolean", default: "false", desc: t("disabled") },
  { name: "value", type: "string | number", default: "-", desc: t("value") }
];

const slotsRows = () => [
  { name: "default", type: "elf-step[]", desc: t("defaultSlot") },
  { name: "panel", type: "unknown", desc: t("panelSlot") }
];

const eventsRows = () => [
  { name: "update:active", type: "(active: number) => void", desc: t("eventUpdate") },
  { name: "change", type: "(detail: StepsChangeDetail) => void", desc: t("eventChange") }
];

const methodsRows = () => [
  { name: "next()", type: "() => void", desc: t("methodNext") },
  { name: "prev()", type: "() => void", desc: t("methodPrev") },
  { name: "setActive(index)", type: "(index: number) => void", desc: t("methodSet") }
];

const PageStepsProps = defineHtml(`
  <h2>API</h2>
  <elf-props-table title="Props" :rows=${propsRows()}></elf-props-table>
  <elf-props-table title="StepItem / Step Props" :rows=${itemRows()}></elf-props-table>
  <elf-props-table title="Slots" :rows=${slotsRows()}></elf-props-table>
  <elf-props-table title="Events" :rows=${eventsRows()}></elf-props-table>
  <elf-props-table title="Methods" :rows=${methodsRows()}></elf-props-table>
`);

export { PageStepsProps };
