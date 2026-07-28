import { defineHtml } from "@elfui/core";

import { createDocsPicker, createDocsTranslator } from "../../docsLocale";

interface ApiRow {
  name: string;
  type?: string;
  default?: string;
  desc: string;
}

const pick = createDocsPicker();
const t = createDocsTranslator({
  api: { zh: "API", en: "API" },
  props: { zh: "级联选择器属性", en: "Cascader props" },
  events: { zh: "级联选择器事件", en: "Cascader events" },
  methods: { zh: "级联选择器方法", en: "Cascader methods" },
  slots: { zh: "级联选择器插槽", en: "Cascader slots" },
  panel: { zh: "独立面板属性", en: "Standalone panel props" },
});
const row = (name: string, type: string, defaultValue: string, zh: string, en: string): ApiRow => ({
  name,
  type,
  default: defaultValue,
  desc: pick(zh, en),
});
const item = (name: string, zh: string, en: string): ApiRow => ({ name, desc: pick(zh, en) });

const propsRows = (): ApiRow[] => [
  row("modelValue", "CascaderModelValue", "[]", "当前选中路径", "Selected path or paths"),
  row("options", "CascaderOption[]", "[]", "级联选项树", "Hierarchical options"),
  row("props", "CascaderFieldNames", "-", "字段名、懒加载和勾选行为", "Field names, lazy loading, and checking behavior"),
  row("variant / label", "FieldVariant / string", "filled / ''", "字段表面与浮动标签", "Field surface and floating label"),
  row("backgroundColor", "string", "''", "自定义字段背景", "Custom field background"),
  row("size", "sm | md | lg", "md", "组件尺寸", "Control size"),
  row("placeholder / disabled", "string / boolean", "- / false", "占位文本和禁用状态", "Placeholder and disabled state"),
  row("clearable / clearIcon", "boolean / string", "false / ×", "清空能力与图标", "Clear action and icon"),
  row("emptyValues / valueOnClear", "unknown[] / value | function", "built-in / -", "空值和清空值策略", "Empty-value and clear-value policy"),
  row("multiple / checkable", "boolean", "false", "多选和联动复选框", "Multiple selection and linked checkboxes"),
  row("panelMode / treeThreshold", "auto | columns | tree / number", "auto / 3", "深层路径自动使用紧凑树", "Automatically use a compact tree for deep paths"),
  row("checkStrictly / emitPath", "boolean", "false / true", "父子独立选择与路径返回", "Independent checking and emitted path"),
  row("showAllLevels / separator", "boolean / string", "true / ' / '", "路径回显方式", "Displayed path format"),
  row("collapseTags / maxCollapseTags", "boolean / number", "false / 1", "折叠多选标签", "Collapse multiple tags"),
  row("collapseTagsTooltip", "boolean", "false", "显示折叠标签提示", "Show collapsed-tag tooltip"),
  row("showCheckedStrategy", "child | parent", "child", "多选回显策略", "Checked-label strategy"),
  row("expandTrigger", "click | hover", "click", "展开子级的方式", "Child expansion trigger"),
  row("checkOnClickNode / checkOnClickLeaf", "boolean", "false / true", "节点和叶子的点击选择策略", "Node and leaf click-selection policy"),
  row("showPrefix", "boolean", "true", "显示选项前缀", "Show option prefixes"),
  row("filterable / debounce", "boolean / number", "false / 300", "路径搜索与防抖", "Path search and debounce"),
  row("filterMethod / beforeFilter", "function", "-", "自定义匹配和搜索前置守卫", "Custom matcher and pre-filter guard"),
  row("teleported / appendTo", "boolean / selector | HTMLElement", "true / body", "Top Layer 与挂载目标", "Top Layer and mount target"),
  row("persistent", "boolean", "true", "关闭后保留面板 DOM", "Keep panel DOM after closing"),
  row("placement / fallbackPlacements", "CascaderPlacement / CascaderPlacement[]", "bottom-start / built-in", "首选和碰撞候选方向", "Preferred and collision fallback placements"),
  row("fitInputWidth", "boolean", "false", "面板匹配输入宽度", "Fit the trigger width"),
  row("popperClass / popperStyle", "string / object", "'' / {}", "面板类名和行内样式", "Panel class and inline style"),
  row("popperOptions", "CascaderPopperOptions", "{}", "偏移、翻转和溢出修饰器", "Offset, flip, and overflow modifiers"),
  row("effect / tagType / tagEffect", "string", "light / info / light", "面板和标签外观", "Panel and tag appearance"),
  row("validateEvent", "boolean", "true", "触发表单 change/blur 校验", "Trigger form change/blur validation"),
  row("virtualScroll / itemSize / height", "boolean / number / number", "false / 34 / 204", "长列表虚拟窗口", "Virtual window for long lists"),
];

const eventRows = (): ApiRow[] => [
  item("update:modelValue", "选中路径变化", "Selected value changed"),
  item("change", "选择完成后的结构化详情", "Structured selection detail"),
  item("visible-change", "面板展开状态变化", "Panel visibility changed"),
  item("expand-change", "活动层级变化", "Expanded path changed"),
  item("clear / remove-tag", "清空或移除标签", "Clear or remove a tag"),
  item("focus / blur", "触发器焦点变化", "Trigger focus changed"),
];
const methodRows = (): ApiRow[] => [
  item("clearSelection()", "清空当前选择", "Clear the selection"),
  item("openPanel() / closePanel()", "打开或关闭面板", "Open or close the panel"),
  item("togglePopperVisible(visible?)", "切换面板状态", "Toggle panel visibility"),
  item("getCheckedNodes(leafOnly?)", "读取选中节点快照", "Read selected node snapshots"),
  item("presentText()", "读取回显文本", "Read display text"),
  item("getContentElement()", "读取面板元素", "Read the panel element"),
];
const slotRows = (): ApiRow[] => [
  item("default", "自定义节点，接收 node 和 data", "Custom node with node and data"),
  item("suggestion-item", "自定义搜索结果", "Custom search result"),
  item("tag", "自定义多选标签", "Custom multiple tag"),
  item("prefix / header / footer / empty", "字段与面板内容区域", "Field and panel content regions"),
];
const panelRows = (): ApiRow[] => [
  row("modelValue / options", "CascaderModelValue / CascaderOption[]", "[] / []", "选择值和选项树", "Value and option tree"),
  row("multiple / checkable", "boolean", "false", "多选或联动复选框", "Multiple selection or linked checkboxes"),
  row("checkStrictly / emitPath / showPrefix", "boolean", "-", "勾选与返回值控制", "Checking and emitted-value control"),
  row("virtualScroll / itemSize / height", "boolean / number / number", "false / 34 / 204", "虚拟滚动视口", "Virtual scrolling viewport"),
  row("props", "CascaderFieldNames", "-", "字段与勾选配置", "Field and checking configuration"),
];

const PageCascaderProps = defineHtml(`
  <h2>${t("api")}</h2>
  <elf-props-table :title=${t("props")} :rows=${propsRows()}></elf-props-table>
  <elf-props-table :title=${t("events")} :rows=${eventRows()}></elf-props-table>
  <elf-props-table :title=${t("methods")} :rows=${methodRows()}></elf-props-table>
  <elf-props-table :title=${t("slots")} :rows=${slotRows()}></elf-props-table>
  <elf-props-table :title=${t("panel")} :rows=${panelRows()}></elf-props-table>
`);

export { PageCascaderProps };
