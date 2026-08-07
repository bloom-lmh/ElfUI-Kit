import { defineHtml } from "@elfui/core";

import { createDocsPicker } from "../../docsLocale";

const pick = createDocsPicker();
const row = (name: string, type: string, fallback: string, zh: string, en: string) => ({
  name,
  type,
  default: fallback,
  desc: pick(zh, en),
});
const event = (name: string, type: string, zh: string, en: string) => ({
  name,
  type,
  desc: pick(zh, en),
});

const propsRows = () => [
  row("data", "TreeNode[]", "[]", "树形数据源。", "Hierarchical data source."),
  row(
    "node-key",
    "string",
    "''",
    "节点唯一键字段，优先于 props.key。",
    "Unique node-key field; takes precedence over props.key.",
  ),
  row("model-value", "string", "''", "当前选中节点键。", "Currently selected node key."),
  row("current-node-key", "string", "''", "当前高亮节点键。", "Currently highlighted node key."),
  row(
    "default-selected-key",
    "string",
    "''",
    "非受控初始选中节点。",
    "Initial uncontrolled selection.",
  ),
  row(
    "expanded-keys",
    "string[]",
    "undefined",
    "受控展开节点键。",
    "Controlled expanded node keys.",
  ),
  row("checked-keys", "string[]", "undefined", "受控勾选节点键。", "Controlled checked node keys."),
  row(
    "default-expanded-keys",
    "string[]",
    "[]",
    "非受控初始展开节点。",
    "Initial uncontrolled expanded keys.",
  ),
  row(
    "default-checked-keys",
    "string[]",
    "[]",
    "非受控初始勾选节点。",
    "Initial uncontrolled checked keys.",
  ),
  row(
    "props",
    "TreeFieldNames",
    "{}",
    "字段别名：key、label、children、disabled、isLeaf、icon、class。",
    "Field aliases for key, label, children, disabled, isLeaf, icon, and class.",
  ),
  row("show-checkbox", "boolean", "false", "显示复选框。", "Show checkboxes."),
  row(
    "check-strictly",
    "boolean",
    "false",
    "父子节点勾选互不关联。",
    "Keep parent and child checks independent.",
  ),
  row("highlight-current", "boolean", "true", "高亮当前节点。", "Highlight the current node."),
  row(
    "accordion",
    "boolean",
    "false",
    "同级只展开一个分支。",
    "Expand one sibling branch at a time.",
  ),
  row(
    "default-expand-all",
    "boolean",
    "false",
    "初始展开全部分支。",
    "Expand every branch initially.",
  ),
  row(
    "auto-expand-parent",
    "boolean",
    "true",
    "展开深层节点时同步展开祖先。",
    "Expand ancestors of a deep key.",
  ),
  row(
    "expand-on-click-node",
    "boolean",
    "true",
    "点击节点内容时切换展开。",
    "Toggle expansion when node content is clicked.",
  ),
  row(
    "check-on-click-node",
    "boolean",
    "false",
    "点击节点内容时同步勾选。",
    "Toggle checks when node content is clicked.",
  ),
  row(
    "check-on-click-leaf",
    "boolean",
    "true",
    "点击叶子内容时同步勾选。",
    "Toggle a leaf check when its content is clicked.",
  ),
  row("filterable", "boolean", "false", "显示过滤输入框。", "Show the filter field."),
  row(
    "filter-placeholder",
    "string",
    "LocaleProvider",
    "过滤输入框占位文本。",
    "Filter-field placeholder.",
  ),
  row("empty-text", "string", "LocaleProvider", "空状态文本。", "Empty-state text."),
  row("indent", "number", "20", "每层缩进像素。", "Indent in pixels per level."),
  row("bordered", "boolean", "false", "显示树容器边框。", "Show a tree-container border."),
  row(
    "lazy / load",
    "boolean / Function",
    "false / —",
    "按需异步加载子节点。",
    "Load child nodes asynchronously on demand.",
  ),
  row(
    "filter-node-method / filter-method",
    "Function",
    "—",
    "普通树与虚拟树共用的过滤规则。",
    "Filter predicate shared by standard and virtual trees.",
  ),
  row(
    "render-content",
    "(node, context) => Node | string",
    "—",
    "自定义节点内容。",
    "Custom node content renderer.",
  ),
  row("icon", "string", "''", "自定义展开指示图标。", "Custom expansion indicator."),
  row(
    "draggable / allow-drag / allow-drop",
    "boolean / Function",
    "false / —",
    "启用拖拽并约束源和目标。",
    "Enable drag and constrain sources and targets.",
  ),
  row("virtual", "boolean", "false", "启用固定行高虚拟化。", "Enable fixed-row virtualization."),
  row(
    "height / item-size / overscan",
    "number",
    "420 / 40 / 6",
    "配置虚拟视口、行高和缓存。",
    "Configure virtual viewport, row size, and overscan.",
  ),
  row(
    "scrollbar-always-on",
    "boolean",
    "false",
    "始终显示纵向滚动条。",
    "Keep the vertical scrollbar visible.",
  ),
  row("aria-label", "string", "''", "树区域的无障碍名称。", "Accessible name for the tree."),
];

const eventsRows = () => [
  event("update:modelValue", "(key: string) => void", "选中节点变化。", "Selected node changed."),
  event(
    "update:expandedKeys",
    "(keys: string[]) => void",
    "展开节点变化。",
    "Expanded keys changed.",
  ),
  event(
    "update:checkedKeys",
    "(keys: string[]) => void",
    "勾选节点变化。",
    "Checked keys changed.",
  ),
  event(
    "node-click",
    "(node, key, viewNode) => void",
    "点击可用节点。",
    "An enabled node was clicked.",
  ),
  event(
    "node-expand / node-collapse",
    "(node, key, expandedKeys) => void",
    "节点展开或收起。",
    "A node expanded or collapsed.",
  ),
  event(
    "check",
    "(node, checkedKeys) => void",
    "勾选集合变化。",
    "The checked collection changed.",
  ),
  event(
    "check-change",
    "(node, checked, checkedKeys) => void",
    "单个节点勾选变化。",
    "One node's checked state changed.",
  ),
  event("node-load", "(node, children) => void", "懒加载完成。", "Lazy loading completed."),
  event(
    "node-drop",
    "(dragging, target, type, event) => void",
    "拖拽放置完成。",
    "A drag operation was dropped.",
  ),
  event(
    "node-drag-start / node-drag-end",
    "(node, event) => void",
    "拖拽生命周期起止。",
    "Drag lifecycle start and end.",
  ),
  event(
    "node-drag-enter / over / leave",
    "(dragging, target, event) => void",
    "拖拽经过目标节点。",
    "Drag interaction crossed a target.",
  ),
  event("current-change", "(node, key) => void", "当前节点变化。", "Current node changed."),
  event(
    "node-contextmenu",
    "(event, node, key) => void",
    "打开节点上下文菜单。",
    "A node context menu was requested.",
  ),
];

const methodsRows = () => [
  event(
    "expand / collapse / toggle",
    "(key: string) => void",
    "控制节点展开状态。",
    "Control node expansion.",
  ),
  event("select(key)", "(key: string) => void", "选中节点。", "Select a node."),
  event("check / uncheck", "(key: string) => void", "勾选或取消节点。", "Check or uncheck a node."),
  event(
    "setChecked(key, checked, deep)",
    "(string, boolean, boolean?) => void",
    "设置节点勾选并可级联后代。",
    "Set a node check and optionally cascade.",
  ),
  event(
    "setCheckedKeys(keys, leafOnly)",
    "(string[], boolean?) => void",
    "批量设置勾选键。",
    "Set checked keys in bulk.",
  ),
  event(
    "setCheckedNodes(nodes, leafOnly)",
    "(TreeNode[], boolean?) => void",
    "按节点数据批量勾选。",
    "Check nodes in bulk by data.",
  ),
  event(
    "getCheckedKeys(leafOnly)",
    "(boolean?) => string[]",
    "获取勾选键，可只取叶子。",
    "Get checked keys, optionally leaves only.",
  ),
  event(
    "getCheckedNodes(leafOnly, includeHalfChecked)",
    "(boolean?, boolean?) => TreeNode[]",
    "获取勾选节点，可包含半选。",
    "Get checked nodes, optionally including half-checked nodes.",
  ),
  event(
    "getHalfCheckedKeys / getHalfCheckedNodes",
    "() => string[] | TreeNode[]",
    "获取半选键或节点。",
    "Get half-checked keys or nodes.",
  ),
  event(
    "setCurrentKey / setCurrentNode",
    "(key | TreeNode | null) => void",
    "设置当前高亮节点。",
    "Set the current highlighted node.",
  ),
  event(
    "getCurrentKey / getCurrentNode",
    "() => string | TreeNode",
    "获取当前高亮节点。",
    "Get the current highlighted node.",
  ),
  event(
    "getNode(key)",
    "(key | TreeNode) => TreeNode | undefined",
    "按键或节点获取数据。",
    "Resolve node data by key or node.",
  ),
  event(
    "filter(keyword)",
    "(keyword: string) => void",
    "命令式过滤节点。",
    "Filter nodes imperatively.",
  ),
  event(
    "updateKeyChildren(key, children)",
    "(key, TreeNode[]) => void",
    "替换指定节点的子节点。",
    "Replace a node's children.",
  ),
  event(
    "setData(data)",
    "(TreeNode[]) => void",
    "命令式替换数据。",
    "Replace tree data imperatively.",
  ),
  event(
    "appendNode / removeNode",
    "(data, parent?) => void",
    "追加或移除节点。",
    "Append or remove a node.",
  ),
  event(
    "insertBeforeNode / insertAfterNode",
    "(data, reference) => void",
    "相对插入节点。",
    "Insert relative to another node.",
  ),
  event(
    "scrollTreeTo(offset)",
    "(number | ScrollToOptions) => void",
    "控制树体滚动位置。",
    "Control the tree scroll position.",
  ),
  event(
    "scrollToNode(key)",
    "(key) => void",
    "虚拟树滚动到节点。",
    "Scroll a virtual tree to a node.",
  ),
];

const slotsRows = () => [
  event("empty", "slot", "替换默认空状态。", "Replace the default empty state."),
];

const PageTreeProps = defineHtml(`
  <elf-api-builder component="elf-tree" title="API">
  <elf-props-table role="props" title="Props" :rows.prop=${propsRows()} />
  <elf-props-table role="events" title="Events" :rows.prop=${eventsRows()} />
  <elf-props-table role="slots" title="Slots" :rows.prop=${slotsRows()} />
  <elf-props-table role="methods" title="Methods" :rows.prop=${methodsRows()} />
  </elf-api-builder>
`);

export { PageTreeProps };
