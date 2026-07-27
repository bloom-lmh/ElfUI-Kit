import { defineHtml } from "@elfui/core";

const propsRows = [
  { name: "items", type: "TimelineItem[]", default: "[]", desc: "时间轴数据" },
  { name: "mode", type: "start | end | alternate | alternate-reverse | horizontal", default: "start", desc: "排列模式" },
  { name: "reverse", type: "boolean", default: "false", desc: "反转数据顺序" }
];

const itemRows = [
  { name: "timestamp", type: "string", desc: "时间标签" },
  { name: "hideTimestamp", type: "boolean", default: "false", desc: "隐藏时间标签" },
  { name: "placement", type: "top | bottom", default: "bottom", desc: "时间标签位置" },
  { name: "center", type: "boolean", default: "false", desc: "节点垂直居中" },
  { name: "title / content", type: "string", desc: "主侧标题与内容" },
  { name: "title2 / content2 / timestamp2", type: "string", desc: "双侧模式的次要内容" },
  { name: "type", type: "primary | success | warning | danger | info", desc: "节点语义类型" },
  { name: "color", type: "TimelineColor | CSS color", default: "primary", desc: "节点颜色" },
  { name: "size", type: "normal | large", default: "normal", desc: "节点尺寸" },
  { name: "hollow", type: "boolean", default: "false", desc: "空心节点" },
  { name: "side", type: "left | right | both", default: "right", desc: "内容显示侧" },
  { name: "cardClass", type: "string", default: "''", desc: "应用到事件内容容器的类名" },
  { name: "cardStyle", type: "Record<string, string | number>", default: "{}", desc: "内容容器的样式或 CSS 变量" }
];

const slotRows = [
  { name: "item-N", desc: "替换第 N 项主卡片内容，例如 item-0" },
  { name: "item-N-secondary", desc: "替换第 N 项次要侧卡片内容" },
  { name: "dot-N", desc: "替换第 N 项节点图标，推荐传入 SVG" },
  { name: "dot", desc: "兼容旧版的通用节点插槽" }
];

const partRows = [
  { name: "body-N", desc: "第 N 项内容容器" },
  { name: "node-N", desc: "第 N 项时间轴节点" }
];

const PageTimelineProps = defineHtml(`
  <h2>API</h2>
  <elf-props-table title="Props" :rows.prop=${propsRows} />
  <elf-props-table title="TimelineItem" :rows.prop=${itemRows} />
  <elf-props-table title="Slots" :rows.prop=${slotRows} />
  <elf-props-table title="CSS Parts" :rows.prop=${partRows} />
`);

export { PageTimelineProps };
