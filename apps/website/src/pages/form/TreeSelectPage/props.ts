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
    name: "data",
    type: "TreeNode[]",
    default: "[]",
    desc: pick(
      "树数据与 key、label、children、disabled 等字段映射。",
      "Tree data and mappings for key, label, children, disabled, and related fields.",
    ),
  },
  {
    name: "props",
    type: "TreeFieldNames",
    default: "-",
    desc: pick(
      "树数据与 key、label、children、disabled 等字段映射。",
      "Tree data and mappings for key, label, children, disabled, and related fields.",
    ),
  },
  {
    name: "nodeKey",
    type: "string",
    default: "key",
    desc: pick(
      "节点与提交值的唯一标识字段，valueKey 优先。",
      "Unique node and submitted-value field; valueKey takes priority.",
    ),
  },
  {
    name: "valueKey",
    type: "string",
    default: "key",
    desc: pick(
      "节点与提交值的唯一标识字段，valueKey 优先。",
      "Unique node and submitted-value field; valueKey takes priority.",
    ),
  },
  {
    name: "multiple",
    type: "boolean",
    default: "false",
    desc: pick("启用复选树和数组值。", "Enable checkbox-tree selection and array values."),
  },
  {
    name: "showCheckbox",
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
    name: "defaultExpandAll",
    type: "boolean",
    default: "false",
    desc: pick("初始化展开状态。", "Initialize expanded state."),
  },
  {
    name: "defaultExpandedKeys",
    type: "TreeSelectValue[]",
    default: "[]",
    desc: pick("初始化展开状态。", "Initialize expanded state."),
  },
  {
    name: "autoExpandParent",
    type: "boolean",
    default: "true",
    desc: pick(
      "自动展开祖先或保持同级单开。",
      "Auto-expand ancestors or keep one sibling branch open.",
    ),
  },
  {
    name: "accordion",
    type: "boolean",
    default: "false",
    desc: pick(
      "自动展开祖先或保持同级单开。",
      "Auto-expand ancestors or keep one sibling branch open.",
    ),
  },
  {
    name: "expandOnClickNode",
    type: "boolean",
    default: "true",
    desc: pick("配置节点内容点击行为。", "Configure node-content click behavior."),
  },
  {
    name: "checkOnClickNode",
    type: "boolean",
    default: "false",
    desc: pick("配置节点内容点击行为。", "Configure node-content click behavior."),
  },
  {
    name: "checkOnClickLeaf",
    type: "boolean",
    default: "true",
    desc: pick("配置节点内容点击行为。", "Configure node-content click behavior."),
  },
  {
    name: "filterable",
    type: "boolean",
    default: "false",
    desc: pick("启用搜索并替换节点匹配策略。", "Enable search with a custom node matcher."),
  },
  {
    name: "filterNodeMethod",
    type: "Function",
    default: "-",
    desc: pick("启用搜索并替换节点匹配策略。", "Enable search with a custom node matcher."),
  },
  {
    name: "lazy",
    type: "boolean",
    default: "false",
    desc: pick("按展开动作异步加载子节点。", "Load child nodes asynchronously on expansion."),
  },
  {
    name: "load",
    type: "Function",
    default: "-",
    desc: pick("按展开动作异步加载子节点。", "Load child nodes asynchronously on expansion."),
  },
  {
    name: "virtual",
    type: "boolean / number",
    default: "false",
    desc: pick("复用 Tree 虚拟窗口处理大数据。", "Reuse Tree's virtual window for large data."),
  },
  {
    name: "height",
    type: "boolean / number",
    default: "280",
    desc: pick("复用 Tree 虚拟窗口处理大数据。", "Reuse Tree's virtual window for large data."),
  },
  {
    name: "itemSize",
    type: "boolean / number",
    default: "40",
    desc: pick("复用 Tree 虚拟窗口处理大数据。", "Reuse Tree's virtual window for large data."),
  },
  {
    name: "overscan",
    type: "boolean / number",
    default: "6",
    desc: pick("复用 Tree 虚拟窗口处理大数据。", "Reuse Tree's virtual window for large data."),
  },
  {
    name: "renderContent",
    type: "TreeRenderContent",
    default: "-",
    desc: pick("自定义节点内容渲染。", "Customize node content rendering."),
  },
  {
    name: "clearable",
    type: "boolean / unknown",
    default: "false / -",
    desc: pick(
      "清空行为与判空协议，继承 ConfigProvider 默认值。",
      "Clear and empty-value protocol inherited from ConfigProvider defaults.",
    ),
  },
  {
    name: "valueOnClear",
    type: "boolean / unknown",
    default: "false / -",
    desc: pick(
      "清空行为与判空协议，继承 ConfigProvider 默认值。",
      "Clear and empty-value protocol inherited from ConfigProvider defaults.",
    ),
  },
  {
    name: "emptyValues",
    type: "boolean / unknown",
    default: "false / -",
    desc: pick(
      "清空行为与判空协议，继承 ConfigProvider 默认值。",
      "Clear and empty-value protocol inherited from ConfigProvider defaults.",
    ),
  },
  {
    name: "collapseTags",
    type: "boolean / number",
    default: "true",
    desc: pick("多选标签折叠和数量限制。", "Multiple-tag collapsing and selection limit."),
  },
  {
    name: "maxCollapseTags",
    type: "boolean / number",
    default: "1",
    desc: pick("多选标签折叠和数量限制。", "Multiple-tag collapsing and selection limit."),
  },
  {
    name: "multipleLimit",
    type: "boolean / number",
    default: "0",
    desc: pick("多选标签折叠和数量限制。", "Multiple-tag collapsing and selection limit."),
  },
  {
    name: "variant",
    type: "FieldVariant / string",
    default: "filled / md",
    desc: pick(
      "共享字段表面、尺寸、浮动标签和背景配置。",
      "Shared field surface, size, floating label, and background configuration.",
    ),
  },
  {
    name: "size",
    type: "FieldVariant / string",
    default: "filled / md",
    desc: pick(
      "共享字段表面、尺寸、浮动标签和背景配置。",
      "Shared field surface, size, floating label, and background configuration.",
    ),
  },
  {
    name: "label",
    type: "FieldVariant / string",
    default: "filled / md",
    desc: pick(
      "共享字段表面、尺寸、浮动标签和背景配置。",
      "Shared field surface, size, floating label, and background configuration.",
    ),
  },
  {
    name: "backgroundColor",
    type: "FieldVariant / string",
    default: "filled / md",
    desc: pick(
      "共享字段表面、尺寸、浮动标签和背景配置。",
      "Shared field surface, size, floating label, and background configuration.",
    ),
  },
  {
    name: "disabled",
    type: "boolean",
    default: "false",
    desc: pick(
      "继承表单禁用态并控制校验触发。",
      "Inherit form disabled state and control validation triggers.",
    ),
  },
  {
    name: "validateEvent",
    type: "boolean",
    default: "true",
    desc: pick(
      "继承表单禁用态并控制校验触发。",
      "Inherit form disabled state and control validation triggers.",
    ),
  },
  {
    name: "teleported",
    type: "boolean / TreeSelectPlacement",
    default: "true / bottom-start",
    desc: pick(
      "顶部浮层、首选位置与翻转候选位置。",
      "Top-layer panel, preferred placement, and flip candidates.",
    ),
  },
  {
    name: "placement",
    type: "boolean / TreeSelectPlacement",
    default: "true / bottom-start",
    desc: pick(
      "顶部浮层、首选位置与翻转候选位置。",
      "Top-layer panel, preferred placement, and flip candidates.",
    ),
  },
  {
    name: "fallbackPlacements",
    type: "boolean / TreeSelectPlacement",
    default: "true / bottom-start",
    desc: pick(
      "顶部浮层、首选位置与翻转候选位置。",
      "Top-layer panel, preferred placement, and flip candidates.",
    ),
  },
  {
    name: "fitInputWidth",
    type: "boolean",
    default: "true",
    desc: pick(
      "面板默认贴合触发器并对齐宽度，offset 可增加间距。",
      "Align panel width with the trigger; the panel is attached by default and offset can add a gap.",
    ),
  },
  {
    name: "offset",
    type: "number",
    default: "0",
    desc: pick(
      "面板默认贴合触发器并对齐宽度，offset 可增加间距。",
      "Align panel width with the trigger; the panel is attached by default and offset can add a gap.",
    ),
  },
  {
    name: "popperClass",
    type: "string",
    default: "-",
    desc: pick("面板样式扩展点。", "Panel styling extension points."),
  },
  {
    name: "popperStyle",
    type: "object",
    default: "-",
    desc: pick("面板样式扩展点。", "Panel styling extension points."),
  },
  {
    name: "placeholder",
    type: "string",
    default: pick("本地化", "Localized"),
    desc: pick(
      "字段、搜索、空状态和无障碍文本。",
      "Field, search, empty-state, and accessibility copy.",
    ),
  },
  {
    name: "filterPlaceholder",
    type: "string",
    default: pick("本地化", "Localized"),
    desc: pick(
      "字段、搜索、空状态和无障碍文本。",
      "Field, search, empty-state, and accessibility copy.",
    ),
  },
  {
    name: "emptyText",
    type: "string",
    default: pick("本地化", "Localized"),
    desc: pick(
      "字段、搜索、空状态和无障碍文本。",
      "Field, search, empty-state, and accessibility copy.",
    ),
  },
  {
    name: "ariaLabel",
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
    name: "update:modelValue",
    type: "(value) => void",
    desc: pick(
      "提交受控值并通知语义变化。",
      "Commit the controlled value and report a semantic change.",
    ),
  },
  {
    name: "change",
    type: "(value) => void",
    desc: pick(
      "提交受控值并通知语义变化。",
      "Commit the controlled value and report a semantic change.",
    ),
  },
  {
    name: "clear",
    type: "() => void",
    desc: pick("清空或移除一个多选标签。", "Clear the field or remove one multiple tag."),
  },
  {
    name: "remove-tag",
    type: "(value) => void",
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
    name: "focus",
    type: "(event) => void",
    desc: pick("组合字段获得或失去焦点。", "Composite field focus changed."),
  },
  {
    name: "blur",
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
    name: "open()",
    type: "Function",
    default: "-",
    desc: pick("控制树面板。", "Control the tree panel."),
  },
  {
    name: "close()",
    type: "Function",
    default: "-",
    desc: pick("控制树面板。", "Control the tree panel."),
  },
  {
    name: "toggle()",
    type: "Function",
    default: "-",
    desc: pick("控制树面板。", "Control the tree panel."),
  },
  {
    name: "focus()",
    type: "Function",
    default: "-",
    desc: pick("控制组合字段焦点。", "Control composite-field focus."),
  },
  {
    name: "blur()",
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
    name: "getCheckedKeys()",
    type: "Function",
    default: "-",
    desc: pick("读写复选节点键。", "Read or write checked node keys."),
  },
  {
    name: "setCheckedKeys()",
    type: "Function",
    default: "-",
    desc: pick("读写复选节点键。", "Read or write checked node keys."),
  },
  {
    name: "getCurrentNode()",
    type: "Function",
    default: "-",
    desc: pick("读取当前节点或滚动到节点。", "Read the current node or scroll to a node."),
  },
  {
    name: "scrollToNode(key)",
    type: "Function",
    default: "-",
    desc: pick("读取当前节点或滚动到节点。", "Read the current node or scroll to a node."),
  },
];

const PageTreeSelectProps = defineHtml(`
  <elf-api-builder component="elf-tree-select" title="API">
  <elf-props-table role="props" title="elf-tree-select Props" :rows=${propsRows()}></elf-props-table>
  <elf-props-table role="events" title="elf-tree-select Events" :rows=${eventsRows()}></elf-props-table>
  <elf-props-table role="slots" title="elf-tree-select Slots" :rows=${slotsRows()}></elf-props-table>
  <elf-props-table role="methods" title="elf-tree-select Methods" :rows=${methodsRows()}></elf-props-table>
  </elf-api-builder>
`);

export { PageTreeSelectProps };
