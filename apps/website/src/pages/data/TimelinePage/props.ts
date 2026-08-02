import { defineHtml } from "@elfui/core";
import { createDocsPicker } from "../../docsLocale";

const pick = createDocsPicker();
const propsRows = [
  {
    name: "items",
    type: "TimelineItem[]",
    default: "[]",
    desc: pick("时间轴数据", "Timeline data"),
  },
  {
    name: "mode",
    type: "start | end | alternate | alternate-reverse | horizontal",
    default: "start",
    desc: pick("排列模式", "Layout mode"),
  },
  {
    name: "reverse",
    type: "boolean",
    default: "false",
    desc: pick("反转数据顺序", "Reverse item order"),
  },
];

const itemRows = [
  { name: "timestamp", type: "string", desc: pick("时间标签", "Timestamp label") },
  {
    name: "hideTimestamp",
    type: "boolean",
    default: "false",
    desc: pick("隐藏时间标签", "Hide the timestamp"),
  },
  {
    name: "placement",
    type: "top | bottom",
    default: "bottom",
    desc: pick("时间标签位置", "Timestamp placement"),
  },
  {
    name: "center",
    type: "boolean",
    default: "false",
    desc: pick("节点垂直居中", "Vertically center the node"),
  },
  {
    name: "title / content",
    type: "string",
    desc: pick("主侧标题与内容", "Primary-side title and content"),
  },
  {
    name: "title2 / content2 / timestamp2",
    type: "string",
    desc: pick("双侧模式的次要内容", "Secondary content in two-sided mode"),
  },
  {
    name: "type",
    type: "primary | success | warning | danger | info",
    desc: pick("节点语义类型", "Semantic node type"),
  },
  {
    name: "color",
    type: "TimelineColor | CSS color",
    default: "primary",
    desc: pick("节点颜色", "Node color"),
  },
  { name: "size", type: "normal | large", default: "normal", desc: pick("节点尺寸", "Node size") },
  { name: "hollow", type: "boolean", default: "false", desc: pick("空心节点", "Hollow node") },
  {
    name: "side",
    type: "left | right | both",
    default: "right",
    desc: pick("内容显示侧", "Content side"),
  },
  {
    name: "cardClass",
    type: "string",
    default: "''",
    desc: pick("事件内容容器类名", "Event content container class"),
  },
  {
    name: "cardStyle",
    type: "Record<string, string | number>",
    default: "{}",
    desc: pick("内容容器样式或 CSS 变量", "Content container styles or CSS variables"),
  },
];

const slotRows = [
  {
    name: "item-N",
    desc: pick(
      "替换第 N 项主卡片内容，例如 item-0",
      "Replace the Nth primary card, such as item-0",
    ),
  },
  {
    name: "item-N-secondary",
    desc: pick("替换第 N 项次要侧卡片内容", "Replace the Nth secondary-side card"),
  },
  {
    name: "dot-N",
    desc: pick("替换第 N 项节点图标，推荐 SVG", "Replace the Nth node icon; SVG is recommended"),
  },
  { name: "dot", desc: pick("兼容旧版的通用节点插槽", "Legacy generic node slot") },
];

const partRows = [
  { name: "body-N", desc: pick("第 N 项内容容器", "Nth item content container") },
  { name: "node-N", desc: pick("第 N 项时间轴节点", "Nth timeline node") },
];

const PageTimelineProps = defineHtml(`
  <h2>API</h2>
  <elf-props-table title="Props" :rows.prop=${propsRows} />
  <elf-props-table title="TimelineItem" :rows.prop=${itemRows} />
  <elf-props-table title="Slots" :rows.prop=${slotRows} />
  <elf-props-table title="CSS Parts" :rows.prop=${partRows} />
`);

export { PageTimelineProps };
