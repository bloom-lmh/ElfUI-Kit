import { defineHtml } from "@elfui/core";
import { createDocsPicker } from "../../docsLocale";

const pick = createDocsPicker();
const propsRows = [
  {
    name: "data",
    type: "TransferDataItem[]",
    default: "[]",
    desc: pick("来源数据", "Source records"),
  },
  {
    name: "model-value",
    type: "string[]",
    default: "[]",
    desc: pick("目标面板键值", "Selected target keys"),
  },
  {
    name: "titles",
    type: "[string, string]",
    default: "['Source', 'Target']",
    desc: pick("面板标题", "Panel headings"),
  },
  {
    name: "filterable",
    type: "boolean",
    default: "false",
    desc: pick("显示过滤输入框", "Show filter inputs"),
  },
  {
    name: "filter-placeholder",
    type: "string",
    default: "'Search'",
    desc: pick("过滤占位文本", "Filter placeholder"),
  },
  {
    name: "filter-method",
    type: "(query, item) => boolean",
    default: "undefined",
    desc: pick("自定义过滤函数", "Custom filter predicate"),
  },
  {
    name: "target-order",
    type: "original | push | unshift",
    default: "original",
    desc: pick("目标面板显示与插入顺序", "Target display and insertion order"),
  },
  {
    name: "button-texts",
    type: "[left, right]",
    default: "[]",
    desc: pick("穿梭操作文案", "Transfer action labels"),
  },
  {
    name: "format",
    type: "{ noChecked, hasChecked }",
    default: "{}",
    desc: pick("标题计数模板", "Header count templates"),
  },
  {
    name: "left-default-checked / right-default-checked",
    type: "string[]",
    default: "[]",
    desc: pick("初始勾选键值", "Initial selectable checked keys"),
  },
  {
    name: "props",
    type: "{ key, label, disabled? }",
    default: "{ key:'key', label:'label', disabled:'disabled' }",
    desc: pick("字段映射", "Field mappings"),
  },
  {
    name: "virtual",
    type: "boolean",
    default: "false",
    desc: pick("仅渲染可见选项窗口", "Render only the visible option window"),
  },
  {
    name: "height",
    type: "number | string",
    default: "320",
    desc: pick("滚动列表视口高度", "Scrollable list viewport height"),
  },
  {
    name: "item-size",
    type: "number",
    default: "36",
    desc: pick("虚拟化使用的固定选项高度", "Fixed option height used by virtualization"),
  },
  {
    name: "overscan",
    type: "number",
    default: "4",
    desc: pick("视口上下额外渲染项数", "Extra options rendered above and below the viewport"),
  },
  {
    name: "empty-text",
    type: "string",
    default: "'No data'",
    desc: pick("空数据与无过滤结果文案", "Empty and no-filter-result message"),
  },
  {
    name: "render-content",
    type: "(item, context) => unknown",
    default: "undefined",
    desc: pick(
      "包含面板、勾选和禁用上下文的类型化渲染器",
      "Typed option renderer with side, checked and disabled context",
    ),
  },
];

const eventsRows = [
  {
    name: "update:modelValue",
    type: "(keys: string[]) => void",
    desc: pick("目标键值变化", "Target keys changed"),
  },
  {
    name: "change",
    type: "(keys, direction, movedKeys) => void",
    desc: pick("一次穿梭操作完成", "A transfer completed"),
  },
  {
    name: "left-check-change / right-check-change",
    type: "(checkedKeys, changedKeys) => void",
    desc: pick("面板勾选状态变化", "Panel checked state changed"),
  },
];

const exposesRows = [
  {
    name: "clearQuery",
    type: "(side?: 'left' | 'right') => void",
    desc: pick("清除单侧或两侧过滤", "Clear one or both filters"),
  },
  {
    name: "scrollToItem",
    type: "(side, key) => void",
    desc: pick("按键值滚动并聚焦面板选项", "Scroll and focus a panel option by key"),
  },
  {
    name: "leftPanel / rightPanel",
    type: "{ query: string }",
    desc: pick("当前过滤查询视图", "Current filter query views"),
  },
];

const slotsRows = [
  {
    name: "left-footer / right-footer",
    type: "unknown",
    desc: pick("面板底部内容", "Panel footer content"),
  },
  {
    name: "left-empty / right-empty",
    type: "unknown",
    desc: pick("面板空态内容", "Panel empty content"),
  },
];

const PageTransferProps = defineHtml(`
  <h2>API</h2>
  <elf-props-table title="Props" :rows.prop=${propsRows} />
  <elf-props-table title="Events" :rows.prop=${eventsRows} />
  <elf-props-table title="Expose" :rows.prop=${exposesRows} />
  <elf-props-table title="Slots" :rows.prop=${slotsRows} />
`);

export { PageTransferProps };
