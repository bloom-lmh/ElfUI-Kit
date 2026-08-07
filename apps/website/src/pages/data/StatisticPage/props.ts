import { defineHtml } from "@elfui/core";
import { createDocsPicker } from "../../docsLocale";

const pick = createDocsPicker();
const statisticRows = [
  { name: "value", type: "number", default: "0", desc: pick("统计值", "Statistic value") },
  {
    name: "animated",
    type: "boolean",
    default: "false",
    desc: pick(
      "数值变化时启用增长动画，并尊重 reduced-motion",
      "Animate value changes while respecting reduced motion",
    ),
  },
  {
    name: "start-value",
    type: "number",
    default: "0",
    desc: pick("首次增长动画的起始值", "Initial value for the first animation"),
  },
  {
    name: "duration",
    type: "number",
    default: "1000",
    desc: pick("动画时长，单位毫秒", "Animation duration in milliseconds"),
  },
  {
    name: "easing",
    type: "linear | ease-out | ease-in-out",
    default: "ease-out",
    desc: pick("增长动画缓动", "Growth animation easing"),
  },
  {
    name: "title",
    type: "string",
    default: "''",
    desc: pick("标题和数值前后缀", "Title and value affixes"),
  },
  {
    name: "prefix",
    type: "string",
    default: "''",
    desc: pick("标题和数值前后缀", "Title and value affixes"),
  },
  {
    name: "suffix",
    type: "string",
    default: "''",
    desc: pick("标题和数值前后缀", "Title and value affixes"),
  },
  { name: "precision", type: "number", default: "-", desc: pick("小数位数", "Decimal precision") },
  {
    name: "group-separator",
    type: "string",
    default: "','",
    desc: pick("数值分隔符", "Number separators"),
  },
  {
    name: "decimal-separator",
    type: "string",
    default: "'.'",
    desc: pick("数值分隔符", "Number separators"),
  },
  {
    name: "formatter",
    type: "(value: number) => string",
    default: "-",
    desc: pick("自定义格式化函数", "Custom formatter"),
  },
  {
    name: "value-style",
    type: "object",
    default: "{}",
    desc: pick("数值区行内样式", "Inline value styles"),
  },
];
const countdownRows = [
  {
    name: "value",
    type: "number | string | Date",
    default: "0",
    desc: pick("目标时间戳或可解析日期", "Target timestamp or parseable date"),
  },
  {
    name: "format",
    type: "string",
    default: "HH:mm:ss",
    desc: pick(
      "支持 DD、HH、mm、ss、SSS；方括号为字面量",
      "Supports DD, HH, mm, ss, and SSS; brackets mark literals",
    ),
  },
  {
    name: "title",
    type: "string",
    default: "''",
    desc: pick("倒计时文本", "Countdown text"),
  },
  {
    name: "prefix",
    type: "string",
    default: "''",
    desc: pick("倒计时文本", "Countdown text"),
  },
  {
    name: "suffix",
    type: "string",
    default: "''",
    desc: pick("倒计时文本", "Countdown text"),
  },
  {
    name: "value-style",
    type: "object",
    default: "{}",
    desc: pick("数值区行内样式", "Inline value styles"),
  },
  {
    name: "aria-label",
    type: "string",
    default: "Countdown",
    desc: pick("timer 无障碍标签", "Accessible timer label"),
  },
];
const countdownEvents = [
  {
    name: "change",
    type: "(remaining: number) => void",
    desc: pick("剩余毫秒变化时触发", "Emitted when remaining milliseconds change"),
  },
  {
    name: "finish",
    type: "() => void",
    desc: pick("到达目标时间时触发一次", "Emitted once when the target time is reached"),
  },
];

const PageStatisticProps = defineHtml(`
  <elf-api-builder component="elf-statistic" title="API">
  <elf-props-table role="props" title="Statistic Props" :rows=${statisticRows} />
  <elf-props-table role="props" component="elf-countdown" title="Countdown Props" :rows=${countdownRows} />
  <elf-props-table role="events" component="elf-countdown" title="Countdown Events" :rows=${countdownEvents} />
  </elf-api-builder>
`);
export { PageStatisticProps };
