import { defineHtml } from "@elfui/core";

const statisticRows = [
  { name: "value", type: "number", default: "0", desc: "统计值" },
  { name: "animated", type: "boolean", default: "false", desc: "数值变化时启用增长动画，并自动尊重 reduced-motion" },
  { name: "start-value", type: "number", default: "0", desc: "首次增长动画的起始值" },
  { name: "duration", type: "number", default: "1000", desc: "动画时长，单位毫秒" },
  { name: "easing", type: "linear | ease-out | ease-in-out", default: "ease-out", desc: "增长动画缓动" },
  { name: "title / prefix / suffix", type: "string", default: "''", desc: "标题和数值前后缀" },
  { name: "precision", type: "number", default: "-", desc: "小数位数" },
  { name: "group-separator / decimal-separator", type: "string", default: "',' / '.'", desc: "数值分隔符" },
  { name: "formatter", type: "(value: number) => string", default: "-", desc: "自定义格式化函数" },
  { name: "value-style", type: "object", default: "{}", desc: "数值区内联样式" }
];
const countdownRows = [
  { name: "value", type: "number | string | Date", default: "0", desc: "目标时间戳或可解析日期" },
  { name: "format", type: "string", default: "HH:mm:ss", desc: "支持 DD、HH、mm、ss、SSS；方括号为字面量" },
  { name: "title / prefix / suffix", type: "string", default: "''", desc: "倒计时文本" },
  { name: "value-style", type: "object", default: "{}", desc: "数值区内联样式" },
  { name: "aria-label", type: "string", default: "Countdown", desc: "timer 无障碍标签" }
];
const countdownEvents = [
  { name: "change", type: "(remaining: number) => void", desc: "剩余毫秒变化时触发" },
  { name: "finish", type: "() => void", desc: "到达目标时间时触发一次" }
];

const PageStatisticProps = defineHtml(`
  <h2>API</h2>
  <elf-props-table title="Statistic Props" :rows=${statisticRows} />
  <elf-props-table title="Countdown Props" :rows=${countdownRows} />
  <elf-props-table title="Countdown Events" :rows=${countdownEvents} />
`);
export { PageStatisticProps };
