import { defineDirective, defineHtml, defineStyle } from "@elfui/core";

import { tooltipDirective } from "../../../directives";
import { createDocsTranslator } from "../../docsLocale";
import demoStyles from "../directive-demo.scss?inline";
import articleStyles from "../../shared/article.scss?inline";

const t = createDocsTranslator({
  kicker: { zh: "指令", en: "Directive" }, title: { zh: "工具提示", en: "Tooltip" }, description: { zh: "为原生或自定义元素附加延迟、定位和 aria-describedby 语义。", en: "Attach delay, positioning, and aria-describedby semantics to native or custom elements." },
  demo: { zh: "悬停或聚焦", en: "Hover or focus" }, top: { zh: "顶部", en: "Top" }, right: { zh: "右侧", en: "Right" }, api: { zh: "API", en: "API" }, type: { zh: "类型", en: "Type" }, desc: { zh: "说明", en: "Description" }, content: { zh: "显示的纯文本内容。", en: "Plain text content to show." }, placement: { zh: "top、bottom、left 或 right。", en: "top, bottom, left, or right." }, showDelay: { zh: "显示前延迟时间。", en: "Delay before display." }, hideDelay: { zh: "隐藏前延迟时间。", en: "Delay before hiding." }
});

defineStyle(articleStyles, demoStyles);
const tooltip = defineDirective(tooltipDirective);
const rightTip = () => ({ content: t("right"), placement: "right", showDelay: 120 });
const code = `<button v-tooltip={ content: 'Save changes', placement: 'top' }>Save</button>`;
const script = `import { defineDirective } from "@elfui/core";
import { tooltipDirective } from "@elfui/kit";
const tooltip = defineDirective(tooltipDirective);`;

const PageTooltipDirective = defineHtml(`
  <elf-container class="docs-article"><span class="docs-kicker">${t("kicker")}</span><h1>${t("title")}</h1><p class="page-lead">${t("description")}</p>
    <elf-playground :title=${t("demo")} :code=${code} :script=${script}><div class="directive-tooltip-row"><elf-button v-tooltip=${t("top")} type="button">${t("top")}</elf-button><elf-button v-tooltip=${rightTip()} type="button">${t("right")}</elf-button></div></elf-playground>
    <section class="docs-section"><h2>${t("api")}</h2><table class="docs-matrix"><thead><tr><th>Option</th><th>${t("type")}</th><th>${t("desc")}</th></tr></thead><tbody><tr><td>content</td><td>string</td><td>${t("content")}</td></tr><tr><td>placement</td><td>'top' | 'bottom' | 'left' | 'right'</td><td>${t("placement")}</td></tr><tr><td>showDelay</td><td>number</td><td>${t("showDelay")}</td></tr><tr><td>hideDelay</td><td>number</td><td>${t("hideDelay")}</td></tr></tbody></table></section>
  </elf-container>
`);
export { PageTooltipDirective };
