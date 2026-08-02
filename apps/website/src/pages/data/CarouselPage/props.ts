import { defineHtml } from "@elfui/core";

import { createDocsTranslator } from "../../docsLocale";

const t = createDocsTranslator({
  props: { zh: "轮播属性", en: "Carousel props" },
  events: { zh: "轮播事件", en: "Carousel events" },
  exposes: { zh: "轮播方法", en: "Carousel exposes" },
  itemProps: { zh: "CarouselItem 属性", en: "CarouselItem props" },
  effect: { zh: "切换效果", en: "Transition effect" },
  type: {
    zh: "卡片布局，仅支持直接 CarouselItem 子项",
    en: "Card layout; requires direct CarouselItem children",
  },
  autoplay: { zh: "自动切换", en: "Automatically advance slides" },
  interval: { zh: "自动切换间隔，最小 250ms", en: "Autoplay interval, clamped to at least 250ms" },
  loop: { zh: "在两端循环", en: "Wrap at each end" },
  showArrow: { zh: "箭头视觉样式或隐藏", en: "Arrow visual style or hidden state" },
  arrow: { zh: "箭头显示策略", en: "Arrow visibility strategy" },
  showIndicator: { zh: "显示指示器", en: "Shows indicator controls" },
  indicatorType: { zh: "指示器样式", en: "Indicator visual style" },
  indicatorPosition: { zh: "指示器位置", en: "Indicator placement" },
  trigger: { zh: "指示器触发方式", en: "Indicator activation mode" },
  initialIndex: { zh: "初始幻灯片下标", en: "Initial zero-based slide" },
  direction: { zh: "切换轴向", en: "Slide axis" },
  height: { zh: "轮播视口高度", en: "Carousel viewport height" },
  duration: { zh: "过渡时长", en: "Transition duration" },
  pauseOnHover: { zh: "悬停时暂停", en: "Pauses while hovered" },
  pauseOnFocus: {
    zh: "轮播或控件获得焦点时暂停",
    en: "Pauses while the carousel or its controls have focus",
  },
  reducedMotion: {
    zh: "系统要求减少动画时阻止自动播放",
    en: "Blocks autoplay when the system requests reduced motion",
  },
  playControl: { zh: "显示可访问的播放/暂停按钮", en: "Shows an accessible play/pause control" },
  radius: { zh: "圆角尺寸", en: "Corner radius" },
  ariaLabel: { zh: "轮播区域的无障碍名称", en: "Accessible name for the carousel region" },
  change: {
    zh: "真实切换后触发，提供当前和上一下标",
    en: "Emitted after a real change with current and previous indexes",
  },
  playState: { zh: "自动播放启停时触发", en: "Emitted when automatic playback starts or stops" },
  activeIndex: { zh: "当前幻灯片下标", en: "Current zero-based slide index" },
  isPlaying: { zh: "当前是否自动播放", en: "Whether autoplay is currently running" },
  setActiveItem: { zh: "按下标、名称或标签选择", en: "Selects by index, name, or label" },
  prevNext: { zh: "切换上一张或下一张", en: "Moves to the previous or next slide" },
  playPause: { zh: "命令式播放或暂停", en: "Imperatively starts or pauses autoplay" },
  name: { zh: "供 setActiveItem 使用的稳定标识", en: "Stable identifier used by setActiveItem" },
  label: { zh: "可见标签与无障碍元数据", en: "Visible label and accessible metadata" },
  itemAria: { zh: "覆盖自动生成的幻灯片名称", en: "Overrides the generated slide label" },
});

const propsRows = () => [
  { name: "effect", type: "slide | fade", default: "slide", desc: t("effect") },
  { name: "type", type: "'' | card", default: "''", desc: t("type") },
  { name: "autoplay", type: "boolean", default: "true", desc: t("autoplay") },
  { name: "interval", type: "number", default: "4000", desc: t("interval") },
  { name: "loop", type: "boolean", default: "true", desc: t("loop") },
  {
    name: "show-arrow",
    type: "circle | square | ghost | false",
    default: "circle",
    desc: t("showArrow"),
  },
  { name: "arrow", type: "always | hover | never", default: "hover", desc: t("arrow") },
  { name: "show-indicator", type: "boolean", default: "true", desc: t("showIndicator") },
  { name: "indicator-type", type: "dot | line | number", default: "dot", desc: t("indicatorType") },
  {
    name: "indicator-position",
    type: "'' | outside | none",
    default: "''",
    desc: t("indicatorPosition"),
  },
  { name: "trigger", type: "hover | click", default: "hover", desc: t("trigger") },
  { name: "initial-index", type: "number", default: "0", desc: t("initialIndex") },
  { name: "direction", type: "horizontal | vertical", default: "horizontal", desc: t("direction") },
  { name: "height", type: "string", default: "'320px'", desc: t("height") },
  { name: "duration", type: "string", default: "'0.5s'", desc: t("duration") },
  { name: "pause-on-hover", type: "boolean", default: "true", desc: t("pauseOnHover") },
  { name: "pause-on-focus", type: "boolean", default: "true", desc: t("pauseOnFocus") },
  { name: "respect-reduced-motion", type: "boolean", default: "true", desc: t("reducedMotion") },
  { name: "show-play-control", type: "boolean", default: "false", desc: t("playControl") },
  { name: "radius", type: "string", default: "'12px'", desc: t("radius") },
  { name: "aria-label", type: "string", default: "'Carousel'", desc: t("ariaLabel") },
];

const eventsRows = () => [
  { name: "change", type: "(current, previous) => void", desc: t("change") },
  { name: "play-state-change", type: "(playing: boolean) => void", desc: t("playState") },
];

const exposesRows = () => [
  { name: "activeIndex", type: "number", desc: t("activeIndex") },
  { name: "isPlaying", type: "boolean", desc: t("isPlaying") },
  { name: "setActiveItem", type: "(index | name | label) => void", desc: t("setActiveItem") },
  { name: "prev / next", type: "() => void", desc: t("prevNext") },
  { name: "play / pause", type: "() => void", desc: t("playPause") },
];

const itemRows = () => [
  { name: "name", type: "string | number", default: "''", desc: t("name") },
  { name: "label", type: "string", default: "''", desc: t("label") },
  { name: "aria-label", type: "string", default: "''", desc: t("itemAria") },
];

const PageCarouselProps = defineHtml(`
  <h2>API</h2>
  <elf-props-table :title=${t("props")} :rows=${propsRows()} />
  <elf-props-table :title=${t("events")} :rows=${eventsRows()} />
  <elf-props-table :title=${t("exposes")} :rows=${exposesRows()} />
  <elf-props-table :title=${t("itemProps")} :rows=${itemRows()} />
`);

export { PageCarouselProps };
