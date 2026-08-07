import { defineHtml } from "@elfui/core";

import { createDocsPicker } from "../../docsLocale";

const pick = createDocsPicker();

const propsRows = () => [
  {
    name: "modelValue",
    type: "SelectValue | SelectValue[]",
    default: "''",
    desc: pick("当前选中值。", "Current selected value."),
  },
  {
    name: "options",
    type: "SelectOption[]",
    default: "[]",
    desc: pick("候选项数据。", "Option data."),
  },
  {
    name: "props",
    type: "SelectFieldNames",
    default: "-",
    desc: pick(
      "映射 value、label、disabled 和 options 字段。",
      "Map value, label, disabled, and options fields.",
    ),
  },
  {
    name: "valueKey",
    type: "string",
    default: "value",
    desc: pick("对象值的唯一标识字段。", "Identity field for object values."),
  },
  {
    name: "variant",
    type: "FieldVariant",
    default: "filled",
    desc: pick("字段表面样式与浮动标签。", "Field surface and floating label."),
  },
  {
    name: "label",
    type: "string",
    default: "''",
    desc: pick("字段表面样式与浮动标签。", "Field surface and floating label."),
  },
  {
    name: "backgroundColor",
    type: "string",
    default: "''",
    desc: pick("自定义字段背景色。", "Custom field background."),
  },
  { name: "size", type: "sm | md | lg", default: "md", desc: pick("控件尺寸。", "Control size.") },
  {
    name: "placeholder",
    type: "string",
    default: "本地化",
    desc: pick("无值时的提示文本。", "Placeholder shown without a value."),
  },
  {
    name: "disabled",
    type: "boolean",
    default: "false",
    desc: pick("禁用交互。", "Disable interaction."),
  },
  {
    name: "clearable",
    type: "boolean",
    default: "false",
    desc: pick("允许清空并配置清空后的值。", "Allow clearing and configure the cleared value."),
  },
  {
    name: "valueOnClear",
    type: "SelectValue",
    default: "-",
    desc: pick("允许清空并配置清空后的值。", "Allow clearing and configure the cleared value."),
  },
  {
    name: "emptyValues",
    type: "unknown[]",
    default: "[undefined, null, '']",
    desc: pick("判空值集合。", "Values treated as empty."),
  },
  {
    name: "multiple",
    type: "boolean",
    default: "false",
    desc: pick("启用多选。", "Enable multiple selection."),
  },
  {
    name: "collapseTags",
    type: "boolean",
    default: "false",
    desc: pick("折叠多选标签并限制可见数量。", "Collapse multiple tags and limit visible tags."),
  },
  {
    name: "maxCollapseTags",
    type: "number",
    default: "1",
    desc: pick("折叠多选标签并限制可见数量。", "Collapse multiple tags and limit visible tags."),
  },
  {
    name: "collapseTagsTooltip",
    type: "boolean",
    default: "false",
    desc: pick("为折叠项或单个标签提供提示。", "Show tooltips for collapsed or individual tags."),
  },
  {
    name: "tagTooltip",
    type: "boolean",
    default: "false",
    desc: pick("为折叠项或单个标签提供提示。", "Show tooltips for collapsed or individual tags."),
  },
  {
    name: "tagType",
    type: "string",
    default: "info",
    desc: pick("标签视觉语义。", "Tag visual semantics."),
  },
  {
    name: "tagEffect",
    type: "string",
    default: "light",
    desc: pick("标签视觉语义。", "Tag visual semantics."),
  },
  {
    name: "multipleLimit",
    type: "number",
    default: "0",
    desc: pick("多选数量上限，0 表示不限。", "Multiple selection limit; 0 means unlimited."),
  },
  {
    name: "filterable",
    type: "boolean",
    default: "false",
    desc: pick("启用过滤并可替换匹配策略。", "Enable filtering with a custom matching strategy."),
  },
  {
    name: "filterMethod",
    type: "Function",
    default: "-",
    desc: pick("启用过滤并可替换匹配策略。", "Enable filtering with a custom matching strategy."),
  },
  {
    name: "allowCreate",
    type: "boolean",
    default: "false",
    desc: pick(
      "允许创建选项并支持回车选择首项。",
      "Allow option creation and Enter selection of the first option.",
    ),
  },
  {
    name: "defaultFirstOption",
    type: "boolean",
    default: "false",
    desc: pick(
      "允许创建选项并支持回车选择首项。",
      "Allow option creation and Enter selection of the first option.",
    ),
  },
  {
    name: "remote",
    type: "boolean",
    default: "false",
    desc: pick("远程搜索及其防抖调用。", "Remote search and debounced invocation."),
  },
  {
    name: "remoteMethod",
    type: "Function",
    default: "-",
    desc: pick("远程搜索及其防抖调用。", "Remote search and debounced invocation."),
  },
  {
    name: "debounce",
    type: "number",
    default: "300",
    desc: pick("远程搜索及其防抖调用。", "Remote search and debounced invocation."),
  },
  {
    name: "remoteShowSuffix",
    type: "boolean",
    default: "false",
    desc: pick("远程搜索后缀与关键字保留策略。", "Remote suffix and keyword retention behavior."),
  },
  {
    name: "reserveKeyword",
    type: "boolean",
    default: "true",
    desc: pick("远程搜索后缀与关键字保留策略。", "Remote suffix and keyword retention behavior."),
  },
  {
    name: "loading",
    type: "boolean",
    default: "false",
    desc: pick("远程加载状态与文案。", "Remote loading state and copy."),
  },
  {
    name: "loadingText",
    type: "string",
    default: "本地化",
    desc: pick("远程加载状态与文案。", "Remote loading state and copy."),
  },
  {
    name: "noDataText",
    type: "string",
    default: "本地化",
    desc: pick("空数据和无匹配状态文案。", "Empty-data and no-match copy."),
  },
  {
    name: "noMatchText",
    type: "string",
    default: "本地化",
    desc: pick("空数据和无匹配状态文案。", "Empty-data and no-match copy."),
  },
  {
    name: "height",
    type: "number",
    default: "240",
    desc: pick("下拉面板最大高度。", "Maximum dropdown height."),
  },
  {
    name: "virtual",
    type: "boolean",
    default: "false",
    desc: pick("启用虚拟化及其最小数据量。", "Enable virtualization and its minimum item count."),
  },
  {
    name: "virtualThreshold",
    type: "number",
    default: "100",
    desc: pick("启用虚拟化及其最小数据量。", "Enable virtualization and its minimum item count."),
  },
  {
    name: "itemHeight",
    type: "number",
    default: "40",
    desc: pick("虚拟项高度与视口缓冲项数。", "Virtual item height and viewport overscan."),
  },
  {
    name: "overscan",
    type: "number",
    default: "4",
    desc: pick("虚拟项高度与视口缓冲项数。", "Virtual item height and viewport overscan."),
  },
  {
    name: "fitInputWidth",
    type: "boolean",
    default: "false",
    desc: pick("下拉面板宽度跟随输入框。", "Match dropdown width to the field."),
  },
  {
    name: "effect",
    type: "string",
    default: "light",
    desc: pick("面板主题和自定义样式。", "Dropdown theme and custom styling."),
  },
  {
    name: "popperClass",
    type: "string",
    default: "-",
    desc: pick("面板主题和自定义样式。", "Dropdown theme and custom styling."),
  },
  {
    name: "popperStyle",
    type: "object",
    default: "-",
    desc: pick("面板主题和自定义样式。", "Dropdown theme and custom styling."),
  },
  {
    name: "persistent",
    type: "boolean",
    default: "false",
    desc: pick(
      "关闭后保留面板 DOM 及垂直间距。",
      "Keep dropdown DOM after close and set vertical offset.",
    ),
  },
  {
    name: "offset",
    type: "number",
    default: "0",
    desc: pick(
      "关闭后保留面板 DOM 及垂直间距。",
      "Keep dropdown DOM after close and set vertical offset.",
    ),
  },
  {
    name: "automaticDropdown",
    type: "boolean",
    default: "false",
    desc: pick("聚焦时自动打开。", "Open automatically on focus."),
  },
  {
    name: "validateEvent",
    type: "boolean",
    default: "true",
    desc: pick("变化和失焦时触发表单校验。", "Trigger form validation on change and blur."),
  },
  {
    name: "tabindex",
    type: "string | number",
    default: "-",
    desc: pick("原生控件与表单属性。", "Native control and form attributes."),
  },
  {
    name: "id",
    type: "string | number",
    default: "-",
    desc: pick("原生控件与表单属性。", "Native control and form attributes."),
  },
  {
    name: "name",
    type: "string | number",
    default: "-",
    desc: pick("原生控件与表单属性。", "Native control and form attributes."),
  },
  {
    name: "autocomplete",
    type: "string | number",
    default: "-",
    desc: pick("原生控件与表单属性。", "Native control and form attributes."),
  },
];

const eventsRows = () => [
  {
    name: "update:modelValue",
    type: "(value) => void",
    desc: pick("提交受控值。", "Commit the controlled value."),
  },
  { name: "change", type: "(value) => void", desc: pick("选择值变化。", "Selection changed.") },
  {
    name: "clear",
    type: "() => void",
    desc: pick("清空或移除多选标签。", "Clear or remove a multiple tag."),
  },
  {
    name: "remove-tag",
    type: "(value) => void",
    desc: pick("清空或移除多选标签。", "Clear or remove a multiple tag."),
  },
  {
    name: "visible-change",
    type: "(visible) => void",
    desc: pick("面板打开状态变化。", "Dropdown visibility changed."),
  },
  {
    name: "focus",
    type: "(event) => void",
    desc: pick("组合框焦点事件。", "Combobox focus events."),
  },
  {
    name: "blur",
    type: "(event) => void",
    desc: pick("组合框焦点事件。", "Combobox focus events."),
  },
  {
    name: "popup-scroll",
    type: "({ scrollTop, scrollLeft }) => void",
    desc: pick("下拉面板滚动。", "Dropdown scrolled."),
  },
  {
    name: "end-reached",
    type: "('top' | 'bottom') => void",
    desc: pick("到达滚动边界。", "A scroll boundary was reached."),
  },
  {
    name: "search",
    type: "(query) => void",
    desc: pick("远程搜索关键字变化。", "Remote search query changed."),
  },
];

const slotsRows = () => [
  {
    name: "header",
    type: "HTMLElement",
    default: "-",
    desc: pick("面板固定头部和底部内容。", "Fixed dropdown header and footer content."),
  },
  {
    name: "footer",
    type: "HTMLElement",
    default: "-",
    desc: pick("面板固定头部和底部内容。", "Fixed dropdown header and footer content."),
  },
  {
    name: "loading",
    type: "HTMLElement",
    default: "本地化",
    desc: pick("加载和空状态。", "Loading and empty states."),
  },
  {
    name: "empty",
    type: "HTMLElement",
    default: "本地化",
    desc: pick("加载和空状态。", "Loading and empty states."),
  },
  { name: "prefix", type: "HTMLElement", default: "-", desc: pick("字段前缀。", "Field prefix.") },
  {
    name: "tag",
    type: "{ option, index, value, label, remove }",
    default: "内置标签",
    desc: pick("多选标签内容。", "Multiple tag content."),
  },
  {
    name: "label",
    type: "{ option, index, value, label }",
    default: "option.label",
    desc: pick("选项标签内容。", "Option label content."),
  },
  {
    name: "clear-icon",
    type: "HTMLElement",
    default: "内置图标",
    desc: pick("清空和后缀图标。", "Clear and suffix icons."),
  },
  {
    name: "suffix-icon",
    type: "HTMLElement",
    default: "内置图标",
    desc: pick("清空和后缀图标。", "Clear and suffix icons."),
  },
];

const methodsRows = () => [
  {
    name: "open()",
    type: "Function",
    default: "-",
    desc: pick("控制下拉面板。", "Control the dropdown."),
  },
  {
    name: "close()",
    type: "Function",
    default: "-",
    desc: pick("控制下拉面板。", "Control the dropdown."),
  },
  {
    name: "toggle()",
    type: "Function",
    default: "-",
    desc: pick("控制下拉面板。", "Control the dropdown."),
  },
  {
    name: "focus()",
    type: "Function",
    default: "-",
    desc: pick("控制组合框焦点。", "Control combobox focus."),
  },
  {
    name: "blur()",
    type: "Function",
    default: "-",
    desc: pick("控制组合框焦点。", "Control combobox focus."),
  },
  {
    name: "selectedLabel()",
    type: "() => string | string[]",
    default: "-",
    desc: pick("读取当前选项文案。", "Read selected labels."),
  },
  {
    name: "scrollToOption(index)",
    type: "(index: number) => void",
    default: "-",
    desc: pick(
      "滚动到指定选项，支持虚拟列表。",
      "Scroll to an option, including virtualized lists.",
    ),
  },
];

const PageSelectProps = defineHtml(`
  <elf-api-builder component="elf-select" title="API">
  <elf-props-table role="props" title="elf-select Props" :rows=${propsRows()}></elf-props-table>
  <elf-props-table role="events" title="elf-select Events" :rows=${eventsRows()}></elf-props-table>
  <elf-props-table role="slots" title="elf-select Slots" :rows=${slotsRows()}></elf-props-table>
  <elf-props-table role="methods" title="elf-select Methods" :rows=${methodsRows()}></elf-props-table>
  </elf-api-builder>
`);

export { PageSelectProps };
