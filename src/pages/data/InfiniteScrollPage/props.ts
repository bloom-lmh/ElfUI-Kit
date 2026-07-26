import { defineHtml } from "@elfui/core";

import { createDocsTranslator } from "../../docsLocale";

const t = createDocsTranslator({
  props: { zh: "无限滚动属性", en: "Infinite scroll props" },
  events: { zh: "无限滚动事件", en: "Infinite scroll events" },
  slots: { zh: "无限滚动插槽", en: "Infinite scroll slots" },
  exposes: { zh: "无限滚动方法", en: "Infinite scroll exposes" },
  directives: { zh: "指令 API", en: "Directive API" },
  height: {
    zh: "内部视口高度；外部容器或窗口模式通常设为 auto",
    en: "Internal viewport height; usually auto for external or window scrolling"
  },
  distance: { zh: "距滚动底部多少像素时触发", en: "Distance from the scroll bottom that triggers loading" },
  delay: { zh: "滚动触发的合并延迟，负数归一为 0", en: "Coalescing delay; negative values normalize to 0" },
  loading: { zh: "请求进行中时阻止重复 load", en: "Prevent duplicate load events while a request is active" },
  disabled: { zh: "暂停加载，适合错误或临时禁用状态", en: "Pause loading for errors or temporary disabled states" },
  finished: { zh: "明确标记没有更多数据并永久停止加载", en: "Mark the data source complete and stop further loading" },
  immediate: {
    zh: "挂载及一次加载结束后，内容不足一屏时继续检查",
    en: "Check on mount and after a load finishes while content underfills the viewport"
  },
  container: {
    zh: "滚动目标：选择器、HTMLElement、Window 或 window 字面量",
    en: "Scroll target: selector, HTMLElement, Window, or the window literal"
  },
  ariaLabel: { zh: "滚动区域的无障碍名称", en: "Accessible name for the scroll region" },
  load: { zh: "接近阈值且未禁用、加载或完成时触发", en: "Emitted near the threshold when active, idle, and unfinished" },
  defaultSlot: { zh: "信息流内容及调用方管理的状态反馈", en: "Feed content and consumer-owned status feedback" },
  check: { zh: "立即重新测量当前容器并检查阈值", en: "Measure the current container and check the threshold immediately" },
  directive: { zh: "接近任意滚动元素底部时执行处理函数", en: "Run a handler near the bottom of any scroll element" },
  directiveDisabled: { zh: "动态暂停指令处理", en: "Dynamically pause the directive" },
  directiveDistance: { zh: "指令触发距离", en: "Directive trigger distance" },
  directiveDelay: { zh: "指令触发延迟", en: "Directive coalescing delay" },
  directiveImmediate: { zh: "挂载及尺寸变化后检查", en: "Check after mount and resize changes" }
});

const propsRows = () => [
  { name: "height", type: "string | number", default: "280px", desc: t("height") },
  { name: "distance", type: "number", default: "0", desc: t("distance") },
  { name: "delay", type: "number", default: "200", desc: t("delay") },
  { name: "loading", type: "boolean", default: "false", desc: t("loading") },
  { name: "disabled", type: "boolean", default: "false", desc: t("disabled") },
  { name: "finished", type: "boolean", default: "false", desc: t("finished") },
  { name: "immediate", type: "boolean", default: "false", desc: t("immediate") },
  { name: "container", type: "string | HTMLElement | Window", default: "-", desc: t("container") },
  { name: "aria-label", type: "string", default: "locale fallback", desc: t("ariaLabel") }
];

const eventRows = () => [
  { name: "load", type: "() => void", desc: t("load") }
];

const slotRows = () => [
  { name: "default", desc: t("defaultSlot") }
];

const exposeRows = () => [
  { name: "check()", desc: t("check") }
];

const directiveRows = () => [
  { name: "v-infinite-scroll", type: "() => void | options", default: "-", desc: t("directive") },
  { name: "infinite-scroll-disabled", type: "boolean", default: "false", desc: t("directiveDisabled") },
  { name: "infinite-scroll-distance", type: "number", default: "0", desc: t("directiveDistance") },
  { name: "infinite-scroll-delay", type: "number", default: "200", desc: t("directiveDelay") },
  { name: "infinite-scroll-immediate", type: "boolean", default: "true", desc: t("directiveImmediate") }
];

const PageInfiniteScrollProps = defineHtml(`
  <h2>API</h2>
  <elf-props-table :title=${t("props")} :rows=${propsRows()} />
  <elf-props-table :title=${t("events")} :rows=${eventRows()} />
  <elf-props-table :title=${t("slots")} :rows=${slotRows()} />
  <elf-props-table :title=${t("exposes")} :rows=${exposeRows()} />
  <elf-props-table :title=${t("directives")} :rows=${directiveRows()} />
`);

export { PageInfiniteScrollProps };
