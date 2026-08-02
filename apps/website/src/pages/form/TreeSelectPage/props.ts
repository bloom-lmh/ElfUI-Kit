import { defineHtml } from "@elfui/core";

import { createDocsPicker } from "../../docsLocale";

const pick = createDocsPicker();

const propsRows = () => [
  {
    name: "modelValue",
    type: "TreeSelectValue | TreeSelectValue[]",
    default: "''",
    desc: pick("当前选中节点键。", "Current selected node keys."),
  },
  {
    name: "data / props",
    type: "TreeNode[] / TreeFieldNames",
    default: "[] / -",
    desc: pick(
      "树数据与 key、label、children、disabled 等字段映射。",
      "Tree data and mappings for key, label, children, disabled, and related fields.",
    ),
  },
  {
    name: "nodeKey / valueKey",
    type: "string",
    default: "key",
    desc: pick(
      "节点与提交值的唯一标识字段，valueKey 优先。",
      "Unique node and submitted-value field; valueKey takes priority.",
    ),
  },
  {
    name: "multiple / showCheckbox",
    type: "boolean",
    default: "false",
    desc: pick("启用复选树和数组值。", "Enable checkbox-tree selection and array values."),
  },
  {
    name: "checkStrictly",
    type: "boolean",
    default: "false",
    desc: pick("关闭父子勾选联动。", "Disable parent-child check association."),
  },
  {
    name: "defaultExpandAll / defaultExpandedKeys",
    type: "boolean / TreeSelectValue[]",
    default: "false / []",
    desc: pick("初始化展开状态。", "Initialize expanded state."),
  },
  {
    name: "autoExpandParent / accordion",
    type: "boolean",
    default: "true / false",
    desc: pick(
      "自动展开祖先或保持同级单开。",
      "Auto-expand ancestors or keep one sibling branch open.",
    ),
  },
  {
    name: "expandOnClickNode / checkOnClickNode / checkOnClickLeaf",
    type: "boolean",
    default: "true / false / true",
    desc: pick("配置节点内容点击行为。", "Configure node-content click behavior."),
  },
  {
    name: "filterable / filterNodeMethod",
    type: "boolean / Function",
    default: "false / -",
    desc: pick("启用搜索并替换节点匹配策略。", "Enable search with a custom node matcher."),
  },
  {
    name: "lazy / load",
    type: "boolean / Function",
    default: "false / -",
    desc: pick("按展开动作异步加载子节点。", "Load child nodes asynchronously on expansion."),
  },
  {
    name: "virtual / height / itemSize / overscan",
    type: "boolean / number",
    default: "false / 280 / 40 / 6",
    desc: pick("复用 Tree 虚拟窗口处理大数据。", "Reuse Tree's virtual window for large data."),
  },
  {
    name: "renderContent",
    type: "TreeRenderContent",
    default: "-",
    desc: pick("自定义节点内容渲染。", "Customize node content rendering."),
  },
  {
    name: "clearable / valueOnClear / emptyValues",
    type: "boolean / unknown",
    default: "false / -",
    desc: pick(
      "清空行为与判空协议，继承 ConfigProvider 默认值。",
      "Clear and empty-value protocol inherited from ConfigProvider defaults.",
    ),
  },
  {
    name: "collapseTags / maxCollapseTags / multipleLimit",
    type: "boolean / number",
    default: "true / 1 / 0",
    desc: pick("多选标签折叠和数量限制。", "Multiple-tag collapsing and selection limit."),
  },
  {
    name: "variant / size / label / backgroundColor",
    type: "FieldVariant / string",
    default: "filled / md",
    desc: pick(
      "共享字段表面、尺寸、浮动标签和背景配置。",
      "Shared field surface, size, floating label, and background configuration.",
    ),
  },
  {
    name: "disabled / validateEvent",
    type: "boolean",
    default: "false / true",
    desc: pick(
      "继承表单禁用态并控制校验触发。",
      "Inherit form disabled state and control validation triggers.",
    ),
  },
  {
    name: "teleported / placement / fallbackPlacements",
    type: "boolean / TreeSelectPlacement",
    default: "true / bottom-start",
    desc: pick(
      "顶部浮层、首选位置与翻转候选位置。",
      "Top-layer panel, preferred placement, and flip candidates.",
    ),
  },
  {
    name: "fitInputWidth / offset",
    type: "boolean / number",
    default: "true / 0",
    desc: pick(
      "面板默认贴合触发器并对齐宽度，offset 可增加间距。",
      "Align panel width with the trigger; the panel is attached by default and offset can add a gap.",
    ),
  },
  {
    name: "popperClass / popperStyle",
    type: "string / object",
    default: "-",
    desc: pick("面板样式扩展点。", "Panel styling extension points."),
  },
  {
    name: "placeholder / filterPlaceholder / emptyText / ariaLabel",
    type: "string",
    default: pick("本地化", "Localized"),
    desc: pick(
      "字段、搜索、空状态和无障碍文本。",
      "Field, search, empty-state, and accessibility copy.",
    ),
  },
];

const eventsRows = () => [
  {
    name: "update:modelValue / change",
    type: "(value) => void",
    desc: pick(
      "提交受控值并通知语义变化。",
      "Commit the controlled value and report a semantic change.",
    ),
  },
  {
    name: "clear / remove-tag",
    type: "() => void / (value) => void",
    desc: pick("清空或移除一个多选标签。", "Clear the field or remove one multiple tag."),
  },
  {
    name: "visible-change",
    type: "(visible: boolean) => void",
    desc: pick("面板可见状态变化。", "Panel visibility changed."),
  },
  {
    name: "node-click",
    type: "(node, key) => void",
    desc: pick("节点内容被激活。", "A node's content was activated."),
  },
  {
    name: "check",
    type: "(node, values) => void",
    desc: pick("复选节点变化。", "Checkbox selection changed."),
  },
  {
    name: "node-load",
    type: "(node, children) => void",
    desc: pick("懒加载子节点完成。", "Lazy child loading completed."),
  },
  {
    name: "focus / blur",
    type: "(event) => void",
    desc: pick("组合字段获得或失去焦点。", "Composite field focus changed."),
  },
];

const slotsRows = () => [
  {
    name: "prefix",
    type: "HTMLElement",
    default: "-",
    desc: pick("字段前缀内容。", "Field prefix content."),
  },
  {
    name: "footer",
    type: "HTMLElement",
    default: "-",
    desc: pick("树面板底部内容。", "Tree panel footer content."),
  },
];

const methodsRows = () => [
  {
    name: "open() / close() / toggle()",
    type: "Function",
    default: "-",
    desc: pick("控制树面板。", "Control the tree panel."),
  },
  {
    name: "focus() / blur()",
    type: "Function",
    default: "-",
    desc: pick("控制组合字段焦点。", "Control composite-field focus."),
  },
  {
    name: "filter(keyword)",
    type: "Function",
    default: "-",
    desc: pick("调用内部 Tree 的过滤协议。", "Invoke the inner Tree filter protocol."),
  },
  {
    name: "selectedLabel()",
    type: "() => string | string[]",
    default: "-",
    desc: pick("读取当前节点文案。", "Read current node labels."),
  },
  {
    name: "getCheckedKeys() / setCheckedKeys()",
    type: "Function",
    default: "-",
    desc: pick("读写复选节点键。", "Read or write checked node keys."),
  },
  {
    name: "getCurrentNode() / scrollToNode(key)",
    type: "Function",
    default: "-",
    desc: pick("读取当前节点或滚动到节点。", "Read the current node or scroll to a node."),
  },
];

const PageTreeSelectProps = defineHtml(`
  <h2>API</h2>
  <elf-props-table title="elf-tree-select Props" :rows=${propsRows()}></elf-props-table>
  <elf-props-table title="elf-tree-select Events" :rows=${eventsRows()}></elf-props-table>
  <elf-props-table title="elf-tree-select Slots" :rows=${slotsRows()}></elf-props-table>
  <elf-props-table title="elf-tree-select Methods" :rows=${methodsRows()}></elf-props-table>
`);

export { PageTreeSelectProps };
