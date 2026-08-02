import { defineDirective, defineHtml, defineStyle, useRef } from "@elfui/core";

import { resizeDirective } from "@elfui/kit";
import { createDocsTranslator } from "../../docsLocale";
import demoStyles from "../directive-demo.scss?inline";
import articleStyles from "../../shared/article.scss?inline";

const t = createDocsTranslator({
  kicker: { zh: "指令", en: "Directive" },
  title: { zh: "尺寸观察器", en: "Resize" },
  description: {
    zh: "元素尺寸变更时收到精确回调，不需要轮询 window resize。",
    en: "Receive precise element-size updates without polling window resize.",
  },
  demo: { zh: "拖拽右下角改变尺寸", en: "Resize from the bottom-right handle" },
  size: { zh: "当前尺寸", en: "Current size" },
  api: { zh: "API", en: "API" },
  type: { zh: "类型", en: "Type" },
  desc: { zh: "说明", en: "Description" },
  handler: { zh: "接收 ResizeObserver 条目。", en: "Receives ResizeObserver entries." },
  box: {
    zh: "选择 content、border 或 device-pixel 内容盒。",
    en: "Selects content, border, or device-pixel content box.",
  },
  disabled: { zh: "暂停观察并断开监听。", en: "Pauses observation and disconnects." },
});

defineStyle(articleStyles, demoStyles);
const resize = defineDirective(resizeDirective);
const dimensions = useRef("260 × 110");
const onResize = (entries: readonly ResizeObserverEntry[]): void => {
  const rect = entries.at(-1)?.contentRect;
  if (rect) dimensions.set(`${Math.round(rect.width)} × ${Math.round(rect.height)}`);
};
const optionRows = () => [
  { name: "handler", type: "(entries, observer) => void", default: "—", desc: t("handler") },
  { name: "box", type: "ResizeObserverBoxOptions", default: "content-box", desc: t("box") },
  { name: "disabled", type: "boolean", default: "false", desc: t("disabled") },
];
const code = `<section v-resize={ onResize } class="resizable-panel">Resize me</section>`;
const script = `import { defineDirective } from "@elfui/core";
import { resizeDirective } from "@elfui/kit";
const resize = defineDirective(resizeDirective);
const onResize = ([entry]) => updateSize(entry.contentRect);`;

const PageResize = defineHtml(`
  <elf-container class="docs-article"><elf-docs-hero category="directives" :title=${t("title")} :description=${t("description")}></elf-docs-hero>
    <elf-playground :title=${t("demo")} :code=${code} :script=${script}><span slot="status">${t("size")}: ${dimensions}</span><section v-resize=${onResize} class="directive-resize">${t("demo")}</section></elf-playground>
    <section class="docs-section"><h2>${t("api")}</h2><elf-props-table :title=${t("api")} :rows=${optionRows()} /></section>
  </elf-container>
`);
export { PageResize };
