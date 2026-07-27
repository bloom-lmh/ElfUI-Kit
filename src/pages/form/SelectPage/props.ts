import { defineHtml } from "@elfui/core";

const propsRows = [
  { name: "background-color", type: "string", default: "''", desc: "自定义字段表面背景" },
  { name: "variant / label", type: "FieldVariant / string", default: "filled / ''", desc: "六种字段表面与浮动标签；filled 兼容旧用法" },
  { name: "modelValue", type: "SelectValue | SelectValue[]", default: "''", desc: "当前选中值" },
  { name: "options", type: "SelectOption[]", default: "[]", desc: "选项数据" },
  {
    name: "props",
    type: "SelectFieldNames",
    default: "-",
    desc: "自定义 value/label/disabled/options 字段名"
  },
  { name: "valueKey", type: "string", default: "value", desc: "对象值唯一键" },
  { name: "size", type: "sm | md | lg", default: "md", desc: "尺寸" },
  { name: "placeholder", type: "string", default: "请选择", desc: "占位文本" },
  { name: "disabled", type: "boolean", default: "false", desc: "禁用" },
  { name: "clearable", type: "boolean", default: "false", desc: "可清空" },
  {
    name: "valueOnClear",
    type: "SelectValue | SelectValue[] | Function",
    default: "-",
    desc: "清空后的值"
  },
  { name: "emptyValues", type: "unknown[]", default: "[undefined, null, '']", desc: "判空值集合" },
  { name: "multiple", type: "boolean", default: "false", desc: "多选" },
  { name: "collapseTags", type: "boolean", default: "false", desc: "折叠多选标签" },
  { name: "maxCollapseTags", type: "number", default: "1", desc: "最多展示的折叠标签数" },
  { name: "collapseTagsTooltip", type: "boolean", default: "false", desc: "悬停折叠标签时显示剩余选项名称" },
  { name: "tagTooltip / tagType / tagEffect", type: "boolean / string", default: "false / info / light", desc: "单个标签提示与视觉语义" },
  { name: "multipleLimit", type: "number", default: "0", desc: "多选数量上限，0 不限制" },
  { name: "filterable", type: "boolean", default: "false", desc: "可过滤" },
  { name: "allowCreate", type: "boolean", default: "false", desc: "允许创建新选项" },
  { name: "defaultFirstOption", type: "boolean", default: "false", desc: "回车默认选择第一项" },
  { name: "remote", type: "boolean", default: "false", desc: "远程搜索" },
  { name: "remoteShowSuffix", type: "boolean", default: "false", desc: "远程搜索时保留后缀图标" },
  { name: "remoteMethod", type: "(query) => void", default: "-", desc: "远程搜索方法" },
  { name: "debounce", type: "number", default: "300", desc: "远程搜索防抖毫秒" },
  { name: "loading", type: "boolean", default: "false", desc: "加载状态" },
  { name: "height", type: "number", default: "240", desc: "下拉面板最大高度" },
  { name: "fitInputWidth", type: "boolean", default: "false", desc: "下拉面板宽度跟随输入框" },
  { name: "effect / popperClass / popperStyle", type: "string / object", default: "light / - / -", desc: "下拉面板主题与自定义样式" },
  { name: "persistent / offset", type: "boolean / number", default: "false / 0", desc: "关闭后保留面板 DOM 与垂直间距" },
  { name: "autocomplete", type: "string", default: "off", desc: "过滤输入框的原生 autocomplete" },
  { name: "clearIcon / suffixIcon", type: "string", default: "× / ▼", desc: "清空与下拉后缀图标" },
  { name: "validateEvent", type: "boolean", default: "true", desc: "值变化与失焦时触发表单校验" },
  { name: "tabindex / id / name", type: "string | number", default: "-", desc: "原生表单属性" }
];

const eventsRows = [
  { name: "update:modelValue", type: "(value) => void", desc: "值变化" },
  { name: "change", type: "(value) => void", desc: "选择变化" },
  { name: "clear", type: "() => void", desc: "清空" },
  { name: "remove-tag", type: "(value) => void", desc: "移除多选标签" },
  { name: "visible-change", type: "(visible) => void", desc: "展开/收起" },
  { name: "popup-scroll / end-reached", type: "(event) => void", desc: "下拉滚动与触底" }
];

const slotsRows = [
  { name: "default", type: "HTMLElement", default: "-", desc: "可选的自定义轻 DOM 内容" },
  { name: "header", type: "HTMLElement", default: "-", desc: "下拉面板头部，加载、空态和选项始终位于其后" },
  { name: "footer", type: "HTMLElement", default: "-", desc: "下拉面板底部，可放置提示或次要操作" },
  { name: "loading", type: "HTMLElement", default: "本地化加载文案", desc: "远程请求加载状态" },
  { name: "empty", type: "HTMLElement", default: "本地化空数据文案", desc: "无数据、无匹配或请求错误反馈" },
  { name: "prefix", type: "HTMLElement", default: "-", desc: "输入区域前缀" },
  { name: "tag", type: "{ option, index, value, label, remove }", default: "内置标签", desc: "多选标签内容与移除能力" },
  { name: "clear-icon / suffix-icon", type: "HTMLElement", default: "× / ▼", desc: "清空与后缀图标内容" },
  { name: "label", type: "{ option, index, value, label }", default: "option.label", desc: "选项标签内容与 scoped 数据" }
];

const methodsRows = [
  { name: "open() / close() / toggle()", type: "Function", default: "-", desc: "控制下拉面板" },
  { name: "focus() / blur()", type: "Function", default: "-", desc: "控制组合框焦点" },
  { name: "selectedLabel()", type: "() => string | string[]", default: "-", desc: "读取当前选项文案" }
];

const PageSelectProps = defineHtml(`
  <h2>API</h2>
  <elf-props-table title="elf-select Props" :rows=${propsRows}></elf-props-table>
  <elf-props-table title="elf-select Events" :rows=${eventsRows}></elf-props-table>
  <elf-props-table title="elf-select Slots" :rows=${slotsRows}></elf-props-table>
  <elf-props-table title="elf-select Methods" :rows=${methodsRows}></elf-props-table>
`);

export { PageSelectProps };
