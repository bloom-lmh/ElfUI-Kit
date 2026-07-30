import { defineDirective, defineHtml, defineStyle, useRef } from "@elfui/core";

import { intersectDirective } from "../../../directives";
import { createDocsTranslator } from "../../docsLocale";
import demoStyles from "../directive-demo.scss?inline";
import articleStyles from "../../shared/article.scss?inline";

const t = createDocsTranslator({
  kicker: { zh: "指令", en: "Directive" },
  title: { zh: "交叉观察器", en: "Intersect" },
  description: { zh: "在元素进入或离开滚动视口时执行回调；可用于懒加载、曝光统计和按需请求。", en: "Run a callback when an element enters or leaves a scroll viewport for lazy loading, exposure tracking, or deferred requests." },
  demo: { zh: "进入视口后触发", en: "Trigger on viewport entry" },
  hint: { zh: "向下滚动，让虚线目标进入视口。", en: "Scroll down until the dashed target enters the viewport." },
  seen: { zh: "可见次数", en: "Visible count" },
  api: { zh: "API", en: "API" },
  type: { zh: "类型", en: "Type" },
  descriptionLabel: { zh: "说明", en: "Description" },
  handler: { zh: "接收观察条目与原生观察器。", en: "Receives observer entries and the native observer." },
  once: { zh: "首次进入后自动停止观察。", en: "Stop observing after the first entry." },
  threshold: { zh: "控制可见比例阈值。", en: "Controls the visible-ratio threshold." }
});

defineStyle(articleStyles, demoStyles);

const intersect = defineDirective(intersectDirective);
const visibleCount = useRef(0);
const onIntersect = (entries: readonly IntersectionObserverEntry[]): void => {
  if (entries.some((entry) => entry.isIntersecting)) visibleCount.set(visibleCount.value + 1);
};
const options = () => ({ handler: onIntersect, once: false, threshold: 0.6 });
const optionRows = () => [
  { name: "handler", type: "(entries, observer) => void", default: "—", desc: t("handler") },
  { name: "once", type: "boolean", default: "false", desc: t("once") },
  { name: "threshold", type: "number | number[]", default: "0", desc: t("threshold") }
];
const code = `<div class="scroll-container">
  <section v-intersect={ handler: onIntersect, threshold: 0.6 }>
    Load when visible
  </section>
</div>`;
const script = `import { defineDirective } from "@elfui/core";
import { intersectDirective } from "@elfui/kit";

const intersect = defineDirective(intersectDirective);
const onIntersect = (entries) => {
  if (entries.some((entry) => entry.isIntersecting)) loadMore();
};`;

const PageIntersect = defineHtml(`
  <elf-container class="docs-article">
    <span class="docs-kicker">${t("kicker")}</span><h1>${t("title")}</h1><p class="page-lead">${t("description")}</p>
    <elf-playground :title=${t("demo")} :code=${code} :script=${script}>
      <span slot="status">${t("seen")}: ${visibleCount}</span>
      <div class="directive-scroll"><div class="directive-scroll-content"><p>${t("hint")}</p><section v-intersect=${options()} class="directive-observer-target">${t("demo")}</section></div></div>
    </elf-playground>
    <section class="docs-section"><h2>${t("api")}</h2><elf-props-table :title=${t("api")} :rows=${optionRows()} /></section>
  </elf-container>
`);

export { PageIntersect };
