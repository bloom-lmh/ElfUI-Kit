import { defineDirective, defineHtml, defineStyle, useRef } from "@elfui/core";

import { scrollDirective, type ScrollDirectiveDetail } from "../../../directives";
import { createDocsTranslator } from "../../docsLocale";
import demoStyles from "../directive-demo.scss?inline";
import articleStyles from "../../shared/article.scss?inline";

const t = createDocsTranslator({
  kicker: { zh: "指令", en: "Directive" }, title: { zh: "滚动", en: "Scroll" }, description: { zh: "订阅指定容器或最近可滚动祖先的滚动位置，并提供进度。", en: "Subscribe to a specified container or nearest scrollable ancestor and receive normalized progress." },
  demo: { zh: "容器滚动状态", en: "Container scroll state" }, hint: { zh: "滚动查看位置与进度更新。", en: "Scroll to update position and progress." }, position: { zh: "位置", en: "Position" }, api: { zh: "API", en: "API" }, type: { zh: "类型", en: "Type" }, desc: { zh: "说明", en: "Description" }, handler: { zh: "接收轴、位置、最大值和进度。", en: "Receives axis, position, maximum, and progress." }, target: { zh: "容器元素、选择器或 window。", en: "Container element, selector, or window." }, axis: { zh: "选择 x 或 y 轴。", en: "Selects the x or y axis." }, immediate: { zh: "绑定完成后立即报告初始状态。", en: "Reports initial state immediately after binding." }
});

defineStyle(articleStyles, demoStyles);
const scroll = defineDirective(scrollDirective);
const position = useRef("0 / 0 · 0%");
const onScroll = (detail: ScrollDirectiveDetail): void => position.set(`${Math.round(detail.position)} / ${Math.round(detail.maximum)} · ${Math.round(detail.progress * 100)}%`);
const options = () => ({ handler: onScroll, target: ".scroll-directive-view", immediate: true });
const optionRows = () => [
  { name: "handler", type: "(detail) => void", default: "—", desc: t("handler") },
  { name: "target", type: "Element | string | Window", default: "nearest", desc: t("target") },
  { name: "axis", type: "'x' | 'y'", default: "y", desc: t("axis") },
  { name: "immediate", type: "boolean", default: "true", desc: t("immediate") }
];
const code = `<div class="scroll-area"><div v-scroll={ handler: onScroll, target: '.scroll-area' }></div></div>`;
const script = `import { defineDirective } from "@elfui/core";
import { scrollDirective } from "@elfui/kit";
const scroll = defineDirective(scrollDirective);
const onScroll = ({ progress }) => updateProgress(progress);`;

const PageScroll = defineHtml(`
  <elf-container class="docs-article"><span class="docs-kicker">${t("kicker")}</span><h1>${t("title")}</h1><p class="page-lead">${t("description")}</p>
    <elf-playground :title=${t("demo")} :code=${code} :script=${script}><span slot="status">${t("position")}: ${position}</span><div class="directive-scroll scroll-directive-view"><div v-scroll=${options()} class="directive-scroll-content"><p>${t("hint")}</p><div class="directive-observer-target">${t("demo")}</div></div></div></elf-playground>
    <section class="docs-section"><h2>${t("api")}</h2><elf-props-table :title=${t("api")} :rows=${optionRows()} /></section>
  </elf-container>
`);
export { PageScroll };
