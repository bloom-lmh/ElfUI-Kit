import { defineHtml, defineStyle, useRef } from "@elfui/core";

import "../../../components/Labs";
import { createDocsTranslator } from "../../docsLocale";
import articleStyles from "../../shared/article.scss?inline";

const t = createDocsTranslator({
  kicker: { zh: "实验室组件", en: "Labs component" },
  title: { zh: "视频", en: "Video" },
  description: {
    zh: "带有可访问键盘控制、字幕轨道、画中画和全屏降级的原生媒体封装。",
    en: "A native media wrapper with accessible keyboard controls, caption tracks, picture-in-picture, and fullscreen fallbacks.",
  },
  warning: {
    zh: "实验性 API：请锁定版本；属性、事件与 DOM 结构仍可能调整。",
    en: "Experimental API: pin versions; props, events, and DOM structure may still change.",
  },
  demo: { zh: "自定义控制栏", en: "Custom controls" },
  playing: { zh: "播放状态", en: "Playback" },
  paused: { zh: "已暂停", en: "Paused" },
  active: { zh: "播放中", en: "Playing" },
  api: { zh: "API", en: "API" },
  props: { zh: "属性", en: "Props" },
  src: { zh: "视频资源地址。", en: "Video source URL." },
  controls: { zh: "显示可访问的自定义控制栏。", en: "Shows accessible custom controls." },
  native: { zh: "改用浏览器原生 controls。", en: "Uses browser-native controls instead." },
  rates: { zh: "可选播放速率列表。", en: "Available playback-rate list." },
  events: { zh: "事件", en: "Events" },
  lifecycleEvent: { zh: "播放生命周期状态变化。", en: "Playback lifecycle state changes." },
  timeEvent: {
    zh: "时间、总时长与归一化进度。",
    en: "Current time, duration, and normalized progress.",
  },
});

defineStyle(
  articleStyles,
  `
  .labs-warning { margin-bottom: var(--elf-space-5); }
  .labs-video { width: min(840px, 100%); }
`,
);

const isPlaying = useRef(false);
const videoSource = "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4";
const propRows = () => [
  { name: "src", type: "string", default: "''", desc: t("src") },
  { name: "controls", type: "boolean", default: "true", desc: t("controls") },
  { name: "native-controls", type: "boolean", default: "false", desc: t("native") },
  {
    name: "playback-rates",
    type: "number[]",
    default: "[0.75, 1, 1.25, 1.5, 2]",
    desc: t("rates"),
  },
];
const eventRows = () => [
  {
    name: "play / pause / ended",
    type: "CustomEvent<void>",
    default: "—",
    desc: t("lifecycleEvent"),
  },
  { name: "time-update", type: "CustomEvent<VideoTimeDetail>", default: "—", desc: t("timeEvent") },
];
const code = `<elf-video
  src="/media/overview.mp4"
  title="Product overview"
  :playback-rates="[0.75, 1, 1.25, 1.5, 2]"
  @time-update="onTimeUpdate"
/>`;
const script = `import "@elfui/kit/labs";

const onTimeUpdate = (event) => {
  const { currentTime, duration, progress } = event.detail;
};`;

const PageLabsVideo = defineHtml(`
  <elf-container class="docs-article"><elf-docs-hero category="labs" tag="Video" :title=${t("title")} :description=${t("description")}></elf-docs-hero>
    <p class="docs-callout is-warning labs-warning">${t("warning")}</p>
    <elf-playground :title=${t("demo")} :code=${code} :script=${script}><span slot="status">${t("playing")}: ${isPlaying ? t("active") : t("paused")}</span><div class="labs-video"><elf-video :src=${videoSource} :title=${t("title")} @play=${() => isPlaying.set(true)} @pause=${() => isPlaying.set(false)}></elf-video></div></elf-playground>
    <section class="docs-section"><h2>${t("api")}</h2><elf-props-table :title=${t("props")} :rows=${propRows()} /></section>
    <section class="docs-section"><elf-props-table :title=${t("events")} :rows=${eventRows()} /></section>
  </elf-container>
`);
export { PageLabsVideo };
