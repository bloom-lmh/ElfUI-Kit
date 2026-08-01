import { defineHtml } from "@elfui/core";

import { createDocsPicker } from "../../docsLocale";

const pick = createDocsPicker();

const propsRows = () => [
  {
    name: "items",
    type: "TabsItem[]",
    default: "[]",
    desc: pick(
      "数据驱动标签；支持标题、值、图标、徽标、内容、禁用、关闭与懒加载。",
      "Data-driven tabs with labels, values, icons, badges, content, disabled, closable, and lazy states.",
    ),
  },
  {
    name: "modelValue / defaultValue",
    type: "TabPaneName | ''",
    default: "'' / ''",
    desc: pick(
      "受控激活值与非受控初始值；空值时回退到首个可用标签。",
      "Controlled active value and uncontrolled initial value; empty values fall back to the first enabled tab.",
    ),
  },
  {
    name: "alignTabs / grow / stretch",
    type: "TabsAlign / boolean / boolean",
    default: "start / false / false",
    desc: pick(
      "控制导航整体对齐、等分铺满和 Element Plus 兼容的拉伸布局。",
      "Control navigation alignment, equal-width growth, and Element Plus-compatible stretching.",
    ),
  },
  {
    name: "density / stacked",
    type: "TabsDensity / boolean",
    default: "default / false",
    desc: pick(
      "调整标签密度，并可将图标与标题垂直排列。",
      "Adjust tab density and optionally stack icons above labels.",
    ),
  },
  {
    name: "direction / tabPosition",
    type: "TabsDirection / TabsPosition",
    default: "horizontal / auto",
    desc: pick(
      "设置方向或显式位置；自动位置在水平模式为 top，在垂直模式为 left。",
      "Set the direction or explicit position; auto resolves to top horizontally and left vertically.",
    ),
  },
  {
    name: "type",
    type: "line | card | border-card",
    default: "line",
    desc: pick("选择线型、卡片或带边框卡片表面。", "Choose line, card, or bordered-card surfaces."),
  },
  {
    name: "closable / addable / editable",
    type: "boolean",
    default: "false / false / false",
    desc: pick(
      "分别启用关闭、新增，或同时启用两种编辑命令。",
      "Enable close, add, or both editing commands respectively.",
    ),
  },
  {
    name: "beforeLeave",
    type: "TabsBeforeLeave",
    default: "-",
    desc: pick(
      "在切换前同步或异步放行；返回 false、抛错或拒绝 Promise 会阻止切换。",
      "Allow navigation synchronously or asynchronously; false, thrown errors, and rejected promises block it.",
    ),
  },
  {
    name: "tabindex",
    type: "number",
    default: "0",
    desc: pick(
      "设置当前 roving tab 的键盘顺序；非激活项始终为 -1。",
      "Set the active roving tab order; inactive tabs remain at -1.",
    ),
  },
  {
    name: "color / backgroundColor / sliderColor",
    type: "string",
    default: "'' / '' / ''",
    desc: pick(
      "覆盖激活色、导航表面色与指示条色；空值使用语义主题 token。",
      "Override active, navigation-surface, and indicator colors; empty values use semantic theme tokens.",
    ),
  },
  {
    name: "fixedTabs / centerActive / showArrows",
    type: "boolean",
    default: "false / false / false",
    desc: pick(
      "启用固定标签宽度、激活项居中滚动和前后翻页控制。",
      "Enable fixed tab widths, centered active scrolling, and previous/next controls.",
    ),
  },
  {
    name: "draggable",
    type: "boolean",
    default: "false",
    desc: pick(
      "允许拖动数据驱动标签，并通过事件提交新的完整顺序。",
      "Allow dragging data-driven tabs and emit the complete reordered collection.",
    ),
  },
  {
    name: "showPanels / hideSlider",
    type: "boolean",
    default: "false / false",
    desc: pick(
      "显示数据驱动内容面板，或隐藏持久化激活指示条。",
      "Show data-driven content panels or hide the persistent active indicator.",
    ),
  },
  {
    name: "transition / transitionDuration",
    type: "TabsTransition / number",
    default: "fade / 180",
    desc: pick(
      "选择面板进入动效并设置毫秒时长；custom 使用宿主 CSS 变量。",
      "Choose the panel enter motion and duration in milliseconds; custom uses host CSS variables.",
    ),
  },
  {
    name: "props",
    type: "TabsFieldNames",
    default: "built-in field map",
    desc: pick(
      "把自定义数据字段归一化为 label、value、icon、disabled、closable、lazy、badge 与 content。",
      "Normalize custom data fields to label, value, icon, disabled, closable, lazy, badge, and content.",
    ),
  },
];

const eventsRows = () => [
  {
    name: "update:modelValue",
    type: "(value: TabPaneName) => void",
    desc: pick("请求提交新的激活值。", "Request a new controlled active value."),
  },
  {
    name: "change",
    type: "(value: TabPaneName, item: object) => void",
    desc: pick(
      "激活值提交后携带原始数据项触发。",
      "Emitted with the original item after the active value commits.",
    ),
  },
  {
    name: "tab-click",
    type: "(context: TabsPaneContext & { item; event }) => void",
    desc: pick(
      "标签被点击时报告面板上下文和原始事件。",
      "Report pane context and the original event when a tab is clicked.",
    ),
  },
  {
    name: "tab-change",
    type: "(value: TabPaneName) => void",
    desc: pick(
      "激活标签完成一次语义切换后触发。",
      "Emitted after the active tab completes a semantic change.",
    ),
  },
  {
    name: "tab-remove / tab-add / edit",
    type: "(value?) => void",
    desc: pick("报告关闭、新增及统一编辑命令。", "Report close, add, and unified edit commands."),
  },
  {
    name: "update:items / tab-reorder",
    type: "(items) / (TabsReorderDetail)",
    desc: pick(
      "拖动完成后分别提交完整顺序与起点、终点、值和数据详情。",
      "After dragging, emit the complete order and the source, target, value, and item details.",
    ),
  },
];

const methodsRows = () => [
  {
    name: "currentName()",
    type: "() => TabPaneName | ''",
    desc: pick("读取当前激活名称。", "Read the current active name."),
  },
  {
    name: "select(value) / setActive(value)",
    type: "(value: TabPaneName) => void",
    desc: pick(
      "通过完整守卫流程选择指定标签。",
      "Select a tab through the complete guard pipeline.",
    ),
  },
  {
    name: "removeTab(value) / add()",
    type: "Function",
    desc: pick(
      "触发关闭或新增命令，不直接改写外部集合。",
      "Emit close or add commands without mutating the external collection.",
    ),
  },
  {
    name: "scrollToActiveTab() / removeFocus()",
    type: "Function",
    desc: pick(
      "滚动到激活项或移除导航焦点。",
      "Scroll to the active tab or remove navigation focus.",
    ),
  },
  {
    name: "update()",
    type: "() => DOMRect | null",
    desc: pick("重新测量指示条并返回其边界。", "Remeasure the indicator and return its bounds."),
  },
  {
    name: "tabListRef / tabBarRef",
    type: "HTMLElement | null",
    desc: pick(
      "只读访问标签列表与激活指示条元素。",
      "Read-only access to the tab list and active indicator elements.",
    ),
  },
];

const paneRows = () => [
  {
    name: "label / name",
    type: "string / TabPaneName",
    default: "'' / index",
    desc: pick("组合面板的标题与稳定名称。", "The composed pane label and stable name."),
  },
  {
    name: "disabled / closable / lazy",
    type: "boolean",
    default: "false / false / false",
    desc: pick(
      "控制禁用、单项关闭，以及首次激活后才创建内容。",
      "Control disabled, per-pane close, and first-activation lazy rendering.",
    ),
  },
];

const slotsRows = () => [
  {
    name: "default",
    type: "elf-tab-pane[]",
    desc: pick(
      "通过公开 TabPane 契约组合内容面板。",
      "Compose content panels through the public TabPane contract.",
    ),
  },
  {
    name: "add-icon / addIcon",
    type: "unknown",
    desc: pick(
      "自定义新增命令内容；addIcon 是兼容别名。",
      "Customize add-command content; addIcon is a compatibility alias.",
    ),
  },
  {
    name: "prev-control / next-control",
    type: "unknown",
    desc: pick(
      "替换完整翻页控制，同时保留相对切换命令。",
      "Replace complete pagination controls while retaining relative navigation commands.",
    ),
  },
  {
    name: "prev-icon / next-icon",
    type: "unknown",
    desc: pick("仅替换内置翻页按钮图标。", "Replace only the built-in pagination icons."),
  },
];

const paneSlotsRows = () => [
  {
    name: "default",
    type: "unknown",
    desc: pick("面板内容。", "Pane content."),
  },
  {
    name: "label",
    type: "unknown",
    desc: pick(
      "覆盖纯文本标题的富标签内容。",
      "Rich label content that replaces the plain-text label.",
    ),
  },
];

const PageTabsProps = defineHtml(`
  <h2>API</h2>
  <elf-props-table title="elf-tabs Props" :rows=${propsRows()}></elf-props-table>
  <elf-props-table title="elf-tabs Events" :rows=${eventsRows()}></elf-props-table>
  <elf-props-table title="elf-tabs Methods" :rows=${methodsRows()}></elf-props-table>
  <elf-props-table title="elf-tabs Slots" :rows=${slotsRows()}></elf-props-table>
  <elf-props-table title="elf-tab-pane Props" :rows=${paneRows()}></elf-props-table>
  <elf-props-table title="elf-tab-pane Slots" :rows=${paneSlotsRows()}></elf-props-table>
`);

export { PageTabsProps };
