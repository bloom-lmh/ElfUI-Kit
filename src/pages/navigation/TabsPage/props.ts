import { defineHtml } from "@elfui/core";

const propsRows = [
  {
    name: "items",
    type: "TabsItem[]",
    default: "[]",
    desc: "tab 数据，支持 label/value/icon/badge/content"
  },
  { name: "modelValue", type: "string | number", default: "''", desc: "当前激活值，支持 v-model" },
  { name: "defaultValue", type: "string | number", default: "''", desc: "非受控初始激活值" },
  {
    name: "alignTabs",
    type: "start | center | end | title",
    default: "start",
    desc: "水平对齐方式"
  },
  { name: "density", type: "compact | default | comfortable", default: "default", desc: "密度" },
  { name: "direction", type: "horizontal | vertical", default: "horizontal", desc: "方向" },
  { name: "type", type: "line | card | border-card", default: "line", desc: "Element Plus 风格类型" },
  { name: "closable", type: "boolean", default: "false", desc: "标签是否可关闭" },
  { name: "addable", type: "boolean", default: "false", desc: "是否显示新增按钮" },
  { name: "editable", type: "boolean", default: "false", desc: "同时启用新增和关闭交互" },
  { name: "tabPosition", type: "top | right | bottom | left", default: "top", desc: "标签位置" },
  { name: "stretch", type: "boolean", default: "false", desc: "标签是否撑满宽度" },
  { name: "beforeLeave", type: "(newName, oldName) => boolean | Promise", default: "-", desc: "切换前拦截" },
  { name: "tabindex", type: "number", default: "0", desc: "tab 按钮 tabindex" },
  { name: "color", type: "string", default: "''", desc: "激活色" },
  { name: "backgroundColor", type: "string", default: "''", desc: "标签导航背景色" },
  { name: "sliderColor", type: "string", default: "''", desc: "激活指示条颜色" },
  { name: "grow", type: "boolean", default: "false", desc: "等分铺满" },
  { name: "fixedTabs", type: "boolean", default: "false", desc: "标签使用固定宽度并居中分布" },
  { name: "centerActive", type: "boolean", default: "false", desc: "切换时将激活项滚动到中央" },
  { name: "showArrows", type: "boolean", default: "false", desc: "显示标签滚动翻页按钮" },
  { name: "draggable", type: "boolean", default: "false", desc: "允许拖动数据驱动标签并重新排序" },
  { name: "stacked", type: "boolean", default: "false", desc: "图标和文字上下排列" },
  { name: "showPanels", type: "boolean", default: "false", desc: "显示内置内容面板" },
  { name: "hideSlider", type: "boolean", default: "false", desc: "隐藏激活指示条" },
  {
    name: "transition",
    type: "fade | slide | scale | none | custom",
    default: "fade",
    desc: "内置面板切换过渡；custom 可通过 CSS 变量自定义"
  },
  {
    name: "transitionDuration",
    type: "number",
    default: "180",
    desc: "面板过渡时长，单位 ms"
  },
  { name: "props", type: "TabsFieldNames", default: "内置", desc: "字段别名映射" }
];

const eventsRows = [
  { name: "update:modelValue", type: "(value: string | number) => void", desc: "激活项变化时触发" },
  { name: "change", type: "(value, item) => void", desc: "激活项变化时触发" },
  { name: "tab-click", type: "({ name, item, event }) => void", desc: "点击标签时触发" },
  { name: "tab-change", type: "(name: string | number) => void", desc: "激活标签变化时触发" },
  { name: "tab-remove", type: "(name: string | number) => void", desc: "关闭标签时触发" },
  { name: "tab-add", type: "() => void", desc: "点击新增按钮时触发" },
  { name: "edit", type: "(name, action) => void", desc: "新增或移除时触发" },
  { name: "update:items", type: "(items: TabsItem[]) => void", desc: "拖动排序后的完整标签列表" },
  { name: "tab-reorder", type: "({ from, to, value, items }) => void", desc: "拖动排序完成时触发" }
];

const methodsRows = [
  { name: "select(value)", desc: "选择指定 tab" },
  { name: "setActive(value)", desc: "选择指定 tab" },
  { name: "removeTab(value)", desc: "触发关闭指定 tab" },
  { name: "add()", desc: "触发新增 tab" },
  { name: "currentName()", desc: "读取当前激活名称" },
  { name: "scrollToActiveTab()", desc: "将当前标签滚动到可视区域" },
  { name: "removeFocus()", desc: "移除标签导航焦点" },
  { name: "update()", desc: "重新读取激活指示条位置" },
  { name: "tabListRef / tabBarRef", desc: "标签列表和激活指示条元素引用" }
];

const paneRows = [
  { name: "label", type: "string", default: "''", desc: "标签标题，可由 label 插槽覆盖" },
  { name: "name", type: "string | number", default: "索引", desc: "标签唯一名称" },
  { name: "disabled", type: "boolean", default: "false", desc: "禁用标签" },
  { name: "closable", type: "boolean", default: "false", desc: "允许关闭当前标签" },
  { name: "lazy", type: "boolean", default: "false", desc: "首次激活时才创建面板内容" }
];

const slotsRows = [
  { name: "default", type: "elf-tab-pane[]", desc: "组合式标签面板" },
  { name: "add-icon", type: "unknown", desc: "自定义新增按钮内容" },
  { name: "addIcon", type: "unknown", desc: "旧版新增按钮插槽别名" },
  { name: "prev-control / next-control", type: "unknown", desc: "完整替换前后翻页控制；点击仍驱动相对切换" },
  { name: "prev-icon / next-icon", type: "unknown", desc: "自定义标签滚动翻页图标" }
];

const paneSlotsRows = [
  { name: "default", type: "unknown", desc: "面板内容" },
  { name: "label", type: "unknown", desc: "富标签内容" }
];

const PageTabsProps = defineHtml(`
  <h2>API</h2>
  <elf-props-table title="Props" :rows=${propsRows}></elf-props-table>
  <elf-props-table title="Events" :rows=${eventsRows}></elf-props-table>
  <elf-props-table title="TabPane Props" :rows=${paneRows}></elf-props-table>
  <elf-props-table title="Tabs Slots" :rows=${slotsRows}></elf-props-table>
  <elf-props-table title="TabPane Slots" :rows=${paneSlotsRows}></elf-props-table>
  <elf-props-table title="Methods" :rows=${methodsRows}></elf-props-table>
`);

export { PageTabsProps };
