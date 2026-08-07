import { defineHtml } from "@elfui/core";

import { createDocsPicker } from "../../docsLocale";

const pick = createDocsPicker();

const row = (name: string, type: string, defaultValue: string, zh: string, en: string) => ({
  name,
  type,
  default: defaultValue,
  desc: pick(zh, en),
});

const propsRows = () => [
  row(
    "items",
    "MenuItem[]",
    "[]",
    "菜单数据，支持 children、divider、group 和 badge。",
    "Menu data with children, dividers, groups, and badges.",
  ),
  row(
    "modelValue",
    "string",
    "''",
    "当前激活项，支持受控绑定。",
    "Current active item for controlled binding.",
  ),
  row(
    "defaultActive",
    "string",
    "''",
    "非受控初始激活项。",
    "Initial active item in uncontrolled mode.",
  ),
  row(
    "defaultOpeneds",
    "string[]",
    "[]",
    "默认展开的子菜单索引。",
    "Submenu indexes opened initially.",
  ),
  row("mode", "vertical | horizontal", "vertical", "菜单布局模式。", "Menu layout mode."),
  row("theme", "light | dark", "light", "菜单主题配色。", "Menu color theme."),
  row(
    "collapse",
    "boolean",
    "false",
    "折叠垂直菜单为图标栏。",
    "Collapse a vertical menu into an icon rail.",
  ),
  row("uniqueOpened", "boolean", "false", "只保持一个展开分支。", "Keep only one branch open."),
  row(
    "router",
    "boolean",
    "false",
    "将路径索引同步到 location.hash。",
    "Sync path indexes to location.hash.",
  ),
  row(
    "props",
    "MenuFieldNames",
    "built-in",
    "自定义数据字段映射。",
    "Customize item field mappings.",
  ),
  row("backgroundColor", "string", "''", "自定义菜单背景色。", "Custom menu background."),
  row("textColor", "string", "''", "自定义文字颜色。", "Custom text color."),
  row("activeTextColor", "string", "''", "激活项文字颜色。", "Active item text color."),
  row("activeBackground", "string", "''", "激活项背景颜色。", "Active item background."),
  row("width", "string", "'260px'", "展开菜单宽度。", "Expanded menu width."),
  row("collapseWidth", "string", "'64px'", "折叠菜单宽度。", "Collapsed menu width."),
  row(
    "indent",
    "number",
    "20",
    "每级子菜单的缩进像素。",
    "Indent in pixels for each submenu level.",
  ),
  row("rounded", "boolean", "false", "启用菜单外圆角。", "Enable the outer menu radius."),
  row("elevation", "boolean", "false", "启用菜单阴影。", "Enable menu elevation."),
  row("bordered", "boolean", "false", "显示菜单外边框。", "Show the outer menu border."),
  row("showToggle", "boolean", "false", "显示折叠切换按钮。", "Show the collapse control."),
  row(
    "togglePlacement",
    "footer | header",
    "header",
    "折叠按钮所在区域。",
    "Region containing the collapse control.",
  ),
  row("searchable", "boolean", "false", "显示菜单搜索框。", "Show the menu search field."),
  row(
    "searchPlaceholder",
    "string",
    "localized",
    "搜索输入占位文本。",
    "Search input placeholder.",
  ),
  row(
    "ellipsis",
    "boolean",
    "false",
    "在水平菜单中显示更多入口。",
    "Show a more entry in horizontal mode.",
  ),
  row("ellipsisIcon", "string", "'...'", "更多入口图标文本。", "Icon text for the more entry."),
  row("menuTrigger", "click | hover", "click", "子菜单触发方式。", "Submenu trigger mode."),
  row(
    "showTimeout / hideTimeout",
    "number",
    "0 / 300",
    "悬停展开与关闭延迟。",
    "Hover open and close delays.",
  ),
  row("popperOffset", "number", "4", "子菜单浮层偏移距离。", "Submenu overlay offset."),
  row(
    "popperClass / popperStyle",
    "string / object",
    "-",
    "扩展浮层类名与行内样式。",
    "Extend overlay classes and inline styles.",
  ),
  row("popperEffect", "string", "light", "浮层明暗效果。", "Overlay color effect."),
  row("collapseTransition", "boolean", "true", "启用折叠过渡。", "Enable collapse transitions."),
  row(
    "closeOnClickOutside",
    "boolean",
    "true",
    "点击水平浮层外部时关闭。",
    "Close a horizontal overlay on outside click.",
  ),
  row("persistent", "boolean", "true", "关闭后保留浮层 DOM。", "Keep overlay DOM after closing."),
];

const eventsRows = () => [
  row(
    "update:modelValue",
    "(index: string) => void",
    "-",
    "提交当前激活项。",
    "Commit the active item.",
  ),
  row(
    "select",
    "(index, indexPath, item) => void",
    "-",
    "选择叶子菜单项。",
    "A leaf menu item was selected.",
  ),
  row(
    "open",
    "(index, indexPath, item) => void",
    "-",
    "展开子菜单分支。",
    "A submenu branch was opened.",
  ),
  row(
    "close",
    "(index, indexPath, item) => void",
    "-",
    "关闭子菜单分支。",
    "A submenu branch was closed.",
  ),
  row(
    "collapse-change",
    "(collapsed: boolean) => void",
    "-",
    "折叠状态变化。",
    "Collapse state changed.",
  ),
];

const methodsRows = () => [
  row("open(index)", "Function", "-", "展开指定分支。", "Open a branch."),
  row("close(index)", "Function", "-", "关闭指定分支。", "Close a branch."),
  row("select(index)", "Function", "-", "选择指定叶子项。", "Select a leaf item."),
  row("handleResize()", "Function", "-", "重新对齐水平浮层。", "Realign the horizontal overlay."),
  row(
    "updateActiveIndex(index)",
    "Function",
    "-",
    "同步当前激活索引。",
    "Synchronize the active index.",
  ),
];

const subMenuRows = () => [
  row("index", "string", "-", "子菜单唯一标识，必填。", "Required unique submenu identifier."),
  row(
    "title / icon / badge",
    "string",
    "-",
    "子菜单标题、图标和徽章。",
    "Submenu title, icon, and badge.",
  ),
  row("disabled", "boolean", "false", "禁用整个子菜单。", "Disable the entire submenu."),
  row(
    "popperClass / popperStyle",
    "string / object",
    "-",
    "当前子菜单的浮层样式。",
    "Overlay styling for this submenu.",
  ),
  row(
    "showTimeout / hideTimeout",
    "number",
    "inherit Menu",
    "当前子菜单的展开与关闭延迟。",
    "Open and close delays for this submenu.",
  ),
  row(
    "popperOffset",
    "number",
    "inherit Menu",
    "当前子菜单的浮层偏移。",
    "Overlay offset for this submenu.",
  ),
  row(
    "teleported",
    "boolean",
    "by level",
    "浮层传送语义兼容属性。",
    "Compatibility flag for overlay teleport semantics.",
  ),
  row(
    "expand*Icon / collapse*Icon",
    "string",
    "-",
    "展开与折叠状态图标。",
    "Expanded and collapsed state icons.",
  ),
  row("title", "slot", "-", "自定义子菜单标题。", "Custom submenu title."),
];

const menuItemRows = () => [
  row("index", "string", "-", "菜单项唯一标识，必填。", "Required unique menu item identifier."),
  row(
    "title / icon / badge",
    "string",
    "-",
    "菜单项标题、图标和徽章。",
    "Menu item title, icon, and badge.",
  ),
  row("route", "string / object", "-", "router 模式的目标地址。", "Target route in router mode."),
  row("disabled", "boolean", "false", "禁用菜单项。", "Disable the menu item."),
  row("click", "(detail) => void", "-", "菜单项点击事件。", "Menu item click event."),
  row("default / title", "slot", "-", "自定义菜单项标题内容。", "Custom menu item title content."),
];

const menuItemGroupRows = () => [
  row(
    "title",
    "string",
    "-",
    "分组标题，也可由 title 插槽提供。",
    "Group title, also available through the title slot.",
  ),
  row("default", "slot", "-", "分组内的 MenuItem。", "MenuItem children in the group."),
];

const slotsRows = () => [
  row(
    "default",
    "slot",
    "-",
    "组合式 MenuItem、SubMenu 和 MenuItemGroup。",
    "Compositional MenuItem, SubMenu, and MenuItemGroup content.",
  ),
  row("header", "slot", "-", "头像或品牌等顶部区域。", "Header region for an avatar or brand."),
  row("search", "slot", "-", "替换默认搜索输入。", "Replace the default search field."),
  row("footer", "slot", "-", "底部操作区域。", "Footer action region."),
  row("toggle", "slot", "-", "替换折叠按钮。", "Replace the collapse control."),
];

const PageMenuProps = defineHtml(`
  <elf-api-builder component="elf-menu" title="API">
  <elf-props-table role="props" title="Props" :rows=${propsRows()}></elf-props-table>
  <elf-props-table role="events" title="Events" :rows=${eventsRows()}></elf-props-table>
  <elf-props-table role="methods" title="Methods" :rows=${methodsRows()}></elf-props-table>
  <elf-props-table role="slots" title="Slots" :rows=${slotsRows()}></elf-props-table>
  <elf-props-table role="props" component="elf-sub-menu" title="SubMenu Props" :rows=${subMenuRows()}></elf-props-table>
  <elf-props-table role="props" component="elf-menu-item" title="MenuItem Props / Events" :rows=${menuItemRows()}></elf-props-table>
  <elf-props-table role="props" component="elf-menu-item-group" title="MenuItemGroup API" :rows=${menuItemGroupRows()}></elf-props-table>
  </elf-api-builder>
`);

export { PageMenuProps };
