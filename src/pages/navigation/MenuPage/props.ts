import { defineHtml } from "@elfui/core";

const propsRows = [
  {
    name: "items",
    type: "MenuItem[]",
    default: "[]",
    desc: "菜单数据，支持 children / divider / group / badge"
  },
  { name: "modelValue", type: "string", default: "''", desc: "当前激活项，支持 v-model" },
  { name: "defaultActive", type: "string", default: "''", desc: "非受控初始激活项" },
  { name: "defaultOpeneds", type: "string[]", default: "[]", desc: "默认展开的子菜单 index" },
  { name: "mode", type: "vertical | horizontal", default: "vertical", desc: "菜单模式" },
  { name: "theme", type: "light | dark", default: "light", desc: "主题配色" },
  { name: "collapse", type: "boolean", default: "false", desc: "初始折叠（仅图标）" },
  { name: "uniqueOpened", type: "boolean", default: "false", desc: "只保持一个展开分支" },
  { name: "router", type: "boolean", default: "false", desc: "index=/path 时同步 location.hash" },
  { name: "props", type: "MenuFieldNames", default: "内置", desc: "字段别名映射" },
  { name: "backgroundColor", type: "string", default: "''", desc: "自定义背景色" },
  { name: "textColor", type: "string", default: "''", desc: "文字颜色" },
  { name: "activeTextColor", type: "string", default: "''", desc: "激活文字色" },
  { name: "activeBackground", type: "string", default: "''", desc: "激活背景色" },
  { name: "width", type: "string", default: "'260px'", desc: "菜单宽度" },
  { name: "collapseWidth", type: "string", default: "'64px'", desc: "折叠宽度" },
  { name: "indent", type: "number", default: "20", desc: "子级缩进 px" },
  { name: "rounded", type: "boolean", default: "false", desc: "外圆角" },
  { name: "elevation", type: "boolean", default: "false", desc: "外阴影" },
  { name: "bordered", type: "boolean", default: "false", desc: "是否显示菜单外边框" },
  { name: "showToggle", type: "boolean", default: "false", desc: "显示折叠切换按钮" },
  {
    name: "togglePlacement",
    type: "footer | header",
    default: "header",
    desc: "折叠按钮位置"
  },
  { name: "searchable", type: "boolean", default: "false", desc: "显示搜索框" },
  { name: "searchPlaceholder", type: "string", default: "'搜索...'", desc: "搜索占位文本" },
  { name: "ellipsis", type: "boolean", default: "false", desc: "水平菜单是否显示更多入口" },
  { name: "ellipsisIcon", type: "string", default: "'...'", desc: "更多入口图标文本" },
  { name: "menuTrigger", type: "click | hover", default: "click", desc: "子菜单触发方式" },
  { name: "showTimeout / hideTimeout", type: "number", default: "0 / 300", desc: "hover 展开和关闭延迟" },
  { name: "popperOffset", type: "number", default: "4", desc: "浮层偏移距离" },
  { name: "popperClass / popperStyle", type: "string / object", default: "-", desc: "浮层样式扩展" },
  { name: "popperEffect", type: "string", default: "light", desc: "浮层主题" },
  { name: "collapseTransition", type: "boolean", default: "true", desc: "是否启用折叠过渡" },
  { name: "closeOnClickOutside", type: "boolean", default: "true", desc: "水平浮层点击外部是否关闭" },
  { name: "persistent", type: "boolean", default: "true", desc: "保留浮层渲染的兼容属性" }
];

const eventsRows = [
  { name: "update:modelValue", type: "(index: string) => void", desc: "选中时触发" },
  { name: "select", type: "(index, indexPath, item) => void", desc: "选中叶子项时触发" },
  { name: "open", type: "(index, indexPath, item) => void", desc: "展开时触发" },
  { name: "close", type: "(index, indexPath, item) => void", desc: "关闭时触发" },
  { name: "collapse-change", type: "(collapsed: boolean) => void", desc: "折叠切换时触发" }
];

const methodsRows = [
  { name: "open(index)", desc: "展开" },
  { name: "close(index)", desc: "关闭" },
  { name: "select(index)", desc: "选中" },
  { name: "handleResize()", desc: "重新对齐水平浮层" },
  { name: "updateActiveIndex(index)", desc: "同步当前激活 index" }
];

const subMenuRows = [
  { name: "index", type: "string", default: "-", desc: "子菜单唯一标识（必填）" },
  { name: "title / icon / badge", type: "string", default: "-", desc: "标题、图标和徽章" },
  { name: "disabled", type: "boolean", default: "false", desc: "禁用整个子菜单" },
  { name: "popperClass / popperStyle", type: "string / object", default: "-", desc: "当前子菜单浮层样式" },
  { name: "showTimeout / hideTimeout", type: "number", default: "继承 Menu", desc: "当前子菜单展开与关闭延迟" },
  { name: "popperOffset", type: "number", default: "继承 Menu", desc: "当前子菜单浮层偏移" },
  { name: "teleported", type: "boolean", default: "按层级", desc: "浮层传送语义兼容属性" },
  { name: "expand*Icon / collapse*Icon", type: "string", default: "-", desc: "展开、折叠状态图标" },
  { name: "title", type: "slot", default: "-", desc: "自定义子菜单标题内容" }
];

const menuItemRows = [
  { name: "index", type: "string", default: "-", desc: "菜单项唯一标识（必填）" },
  { name: "title / icon / badge", type: "string", default: "-", desc: "标题、图标和徽章" },
  { name: "route", type: "string / object", default: "-", desc: "router 模式的目标地址" },
  { name: "disabled", type: "boolean", default: "false", desc: "禁用菜单项" },
  { name: "click", type: "(detail) => void", default: "-", desc: "点击菜单项时触发" },
  { name: "default / title", type: "slot", default: "-", desc: "自定义菜单项标题内容" }
];

const menuItemGroupRows = [
  { name: "title", type: "string", default: "-", desc: "分组标题，也可通过 title 插槽提供" },
  { name: "default", type: "slot", default: "-", desc: "分组内的 MenuItem" }
];

const slotsRows = [
  { name: "default", desc: "组合式 MenuItem / SubMenu / MenuItemGroup" },
  { name: "header", desc: "顶部区域（头像/logo）" },
  { name: "search", desc: "自定义搜索区域，覆盖默认搜索输入" },
  { name: "footer", desc: "底部区域（退出按钮）" },
  { name: "toggle", desc: "自定义折叠按钮" }
];

const PageMenuProps = defineHtml(`
  <h2>API</h2>
  <elf-props-table title="Props" :rows=${propsRows}></elf-props-table>
  <elf-props-table title="Events" :rows=${eventsRows}></elf-props-table>
  <elf-props-table title="Methods" :rows=${methodsRows}></elf-props-table>
  <elf-props-table title="Slots" :rows=${slotsRows}></elf-props-table>
  <elf-props-table title="SubMenu Props" :rows=${subMenuRows}></elf-props-table>
  <elf-props-table title="MenuItem Props / Events" :rows=${menuItemRows}></elf-props-table>
  <elf-props-table title="MenuItemGroup API" :rows=${menuItemGroupRows}></elf-props-table>
`);

export { PageMenuProps };
