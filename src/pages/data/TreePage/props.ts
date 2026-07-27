import { defineHtml } from "@elfui/core";

const propsRows = [
  { name: "data", type: "TreeNode[]", default: "[]", desc: "树形数据源" },
  {
    name: "node-key",
    type: "string",
    default: "''",
    desc: "节点唯一标识字段，优先级高于 props.key"
  },
  { name: "model-value", type: "string", default: "''", desc: "当前选中节点 key" },
  {
    name: "current-node-key",
    type: "string",
    default: "''",
    desc: "Element Plus 风格的当前高亮节点 key"
  },
  { name: "default-selected-key", type: "string", default: "''", desc: "非受控初始选中节点" },
  {
    name: "expanded-keys",
    type: "string[]",
    default: "undefined",
    desc: "受控展开节点 key 数组"
  },
  { name: "checked-keys", type: "string[]", default: "undefined", desc: "受控勾选节点 key 数组" },
  { name: "default-expanded-keys", type: "string[]", default: "[]", desc: "非受控初始展开节点" },
  { name: "default-checked-keys", type: "string[]", default: "[]", desc: "非受控初始勾选节点" },
  {
    name: "props",
    type: "TreeFieldNames",
    default: "{}",
    desc: "字段别名，支持 key/label/children/disabled/isLeaf/icon/class"
  },
  { name: "show-checkbox", type: "boolean", default: "false", desc: "显示复选框" },
  { name: "check-strictly", type: "boolean", default: "false", desc: "父子节点勾选互不关联" },
  { name: "highlight-current", type: "boolean", default: "true", desc: "是否高亮当前选中节点" },
  { name: "accordion", type: "boolean", default: "false", desc: "同级只保留一个展开分支" },
  {
    name: "default-expand-all",
    type: "boolean",
    default: "false",
    desc: "初始展开全部可展开节点"
  },
  {
    name: "auto-expand-parent",
    type: "boolean",
    default: "true",
    desc: "展开深层节点时同步展开其祖先"
  },
  {
    name: "expand-on-click-node",
    type: "boolean",
    default: "true",
    desc: "点击节点内容时展开或收起"
  },
  {
    name: "check-on-click-node",
    type: "boolean",
    default: "false",
    desc: "点击节点内容时同步勾选"
  },
  {
    name: "check-on-click-leaf",
    type: "boolean",
    default: "true",
    desc: "显示复选框时点击叶子内容同步勾选"
  },
  { name: "filterable", type: "boolean", default: "false", desc: "显示过滤输入框" },
  {
    name: "filter-placeholder",
    type: "string",
    default: "'搜索节点'",
    desc: "过滤输入框占位文本"
  },
  { name: "empty-text", type: "string", default: "'暂无数据'", desc: "空状态文本" },
  { name: "indent", type: "number", default: "20", desc: "层级缩进像素" },
  { name: "lazy / load", type: "boolean / Function", default: "false / -", desc: "异步加载子节点" },
  { name: "filter-node-method / filter-method", type: "Function", default: "-", desc: "普通树与虚拟树共用的过滤规则" },
  { name: "render-content", type: "(node, context) => Node | string", default: "-", desc: "自定义节点内容渲染" },
  { name: "icon", type: "string", default: "''", desc: "自定义展开指示图标" },
  { name: "draggable / allow-drag / allow-drop", type: "boolean / Function", default: "false / -", desc: "节点拖拽约束" },
  { name: "virtual", type: "boolean", default: "false", desc: "启用固定高度窗口化" },
  { name: "height / item-size / overscan", type: "number", default: "420 / 40 / 6", desc: "虚拟树视口和缓存" },
  { name: "scrollbar-always-on", type: "boolean", default: "false", desc: "始终预留纵向滚动条" },
  { name: "aria-label", type: "string", default: "''", desc: "树区域的无障碍名称" }
];

const eventsRows = [
  { name: "update:modelValue", type: "(key: string) => void", desc: "选中节点变化时触发" },
  { name: "update:expandedKeys", type: "(keys: string[]) => void", desc: "展开节点变化时触发" },
  { name: "update:checkedKeys", type: "(keys: string[]) => void", desc: "勾选节点变化时触发" },
  { name: "node-click", type: "(node, key, viewNode) => void", desc: "点击可用节点时触发" },
  { name: "node-expand", type: "(node, key, expandedKeys) => void", desc: "节点展开时触发" },
  { name: "node-collapse", type: "(node, key, expandedKeys) => void", desc: "节点收起时触发" },
  { name: "check", type: "(node, checkedKeys) => void", desc: "勾选状态变化时触发" },
  {
    name: "check-change",
    type: "(node, checked, checkedKeys) => void",
    desc: "单个节点勾选变化时触发"
  },
  { name: "node-load", type: "(node, children) => void", desc: "懒加载完成" },
  { name: "node-drop", type: "(dragging, target, type, event) => void", desc: "拖拽放置完成" },
  { name: "node-drag-start / node-drag-end", type: "(node, event) => void", desc: "拖拽生命周期起止" },
  { name: "node-drag-enter / node-drag-over / node-drag-leave", type: "(dragging, target, event) => void", desc: "拖拽经过目标节点" },
  { name: "current-change", type: "(node, key) => void", desc: "当前节点变化" },
  { name: "node-contextmenu", type: "(event, node, key) => void", desc: "节点上下文菜单" }
];

const methodsRows = [
  { name: "expand(key)", type: "(key: string) => void", desc: "展开节点" },
  { name: "collapse(key)", type: "(key: string) => void", desc: "收起节点" },
  { name: "toggle(key)", type: "(key: string) => void", desc: "切换展开状态" },
  { name: "select(key)", type: "(key: string) => void", desc: "选中节点" },
  { name: "check(key)", type: "(key: string) => void", desc: "勾选节点" },
  { name: "uncheck(key)", type: "(key: string) => void", desc: "取消勾选节点" },
  {
    name: "setChecked(key, checked, deep)",
    type: "(string, boolean, boolean?) => void",
    desc: "设置单个节点勾选状态，deep 控制是否级联后代"
  },
  {
    name: "setCheckedKeys(keys, leafOnly)",
    type: "(string[], boolean?) => void",
    desc: "批量设置勾选节点 key，权限树回显常用"
  },
  {
    name: "setCheckedNodes(nodes, leafOnly)",
    type: "(TreeNode[], boolean?) => void",
    desc: "按节点数据批量设置勾选状态"
  },
  {
    name: "getCheckedKeys(leafOnly)",
    type: "(boolean?) => string[]",
    desc: "获取已勾选节点 key，可只取叶子节点"
  },
  {
    name: "getCheckedNodes(leafOnly, includeHalfChecked)",
    type: "(boolean?, boolean?) => TreeNode[]",
    desc: "获取已勾选节点数据，可包含半选节点"
  },
  { name: "getHalfCheckedKeys()", type: "() => string[]", desc: "获取半选节点 key" },
  { name: "getHalfCheckedNodes()", type: "() => TreeNode[]", desc: "获取半选节点数据" },
  { name: "setCurrentKey(key)", type: "(key: string) => void", desc: "设置当前高亮节点" },
  {
    name: "setCurrentNode(node)",
    type: "(node: TreeNode | null) => void",
    desc: "按节点数据设置当前高亮节点"
  },
  { name: "getCurrentKey()", type: "() => string", desc: "获取当前高亮节点 key" },
  { name: "getCurrentNode()", type: "() => TreeNode | undefined", desc: "获取当前高亮节点数据" },
  {
    name: "getNode(key)",
    type: "(keyOrNode: string | TreeNode) => TreeNode | undefined",
    desc: "按 key 或节点数据获取节点数据"
  },
  { name: "filter(keyword)", type: "(keyword: string) => void", desc: "主动过滤节点" },
  { name: "updateKeyChildren(key, children)", type: "(key, TreeNode[]) => void", desc: "替换指定节点的子节点" },
  { name: "setData(data)", type: "(TreeNode[]) => void", desc: "命令式替换当前数据" },
  { name: "expandNode / collapseNode", type: "(key | TreeNode) => void", desc: "按 key 或节点展开、收起" },
  { name: "appendNode(data, parent)", type: "(TreeNode, key?) => void", desc: "追加根节点或子节点" },
  { name: "removeNode(target)", type: "(key | TreeNode) => TreeNode", desc: "移除节点" },
  { name: "insertBeforeNode / insertAfterNode", type: "(data, reference) => void", desc: "相对插入节点" },
  { name: "scrollTreeTo(offset)", type: "(number | ScrollToOptions) => void", desc: "控制树体滚动位置" },
  { name: "scrollToNode(key)", type: "(key) => void", desc: "虚拟树滚动到节点" }
];

const slotsRows = [
  { name: "empty", type: "slot", desc: "没有可见节点时替换默认空状态" }
];

const PageTreeProps = defineHtml(`
  <h2>API</h2>
  <elf-props-table title="Props" :rows="propsRows" />
  <elf-props-table title="Events" :rows="eventsRows" />
  <elf-props-table title="Slots" :rows="slotsRows" />
  <elf-props-table title="Methods" :rows="methodsRows" />
`);

export { PageTreeProps };
