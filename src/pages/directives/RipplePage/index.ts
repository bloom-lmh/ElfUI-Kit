import { defineDirective, defineHtml, defineStyle } from "@elfui/core";

import { rippleDirective } from "../../../directives";
import { createDocsTranslator } from "../../docsLocale";
import demoStyles from "../directive-demo.scss?inline";
import articleStyles from "../../shared/article.scss?inline";

const t = createDocsTranslator({
  kicker: { zh: "指令", en: "Directive" }, title: { zh: "波纹", en: "Ripple" }, description: { zh: "为任意可交互元素添加指针与键盘触发的波纹反馈。", en: "Add pointer- and keyboard-triggered ripple feedback to any interactive element." },
  demo: { zh: "交互反馈", en: "Interaction feedback" }, normal: { zh: "默认波纹", en: "Default ripple" }, centered: { zh: "居中波纹", en: "Centered ripple" }, api: { zh: "API", en: "API" }, type: { zh: "类型", en: "Type" }, desc: { zh: "说明", en: "Description" }, center: { zh: "始终从元素中心扩散。", en: "Always expands from the element center." }, color: { zh: "波纹颜色，默认 currentColor。", en: "Ripple color; defaults to currentColor." }, duration: { zh: "动画持续时间，最小 120ms。", en: "Animation duration with a 120ms minimum." }, disabled: { zh: "禁用视觉反馈。", en: "Disables the visual feedback." }
});

defineStyle(articleStyles, demoStyles);
const ripple = defineDirective(rippleDirective);
const defaultOptions = () => ({ color: "var(--elf-primary)", duration: 420 });
const centeredOptions = () => ({ center: true, color: "var(--elf-success, #67c23a)" });
const code = `<button v-ripple={ color: 'var(--elf-primary)' } type="button">Save</button>`;
const script = `import { defineDirective } from "@elfui/core";
import { rippleDirective } from "@elfui/kit";
const ripple = defineDirective(rippleDirective);`;

const PageRipple = defineHtml(`
  <elf-container class="docs-article"><span class="docs-kicker">${t("kicker")}</span><h1>${t("title")}</h1><p class="page-lead">${t("description")}</p>
    <elf-playground :title=${t("demo")} :code=${code} :script=${script}><div class="directive-tooltip-row"><elf-button v-ripple=${defaultOptions()} type="button">${t("normal")}</elf-button><elf-button v-ripple=${centeredOptions()} type="button">${t("centered")}</elf-button></div></elf-playground>
    <section class="docs-section"><h2>${t("api")}</h2><table class="docs-matrix"><thead><tr><th>Option</th><th>${t("type")}</th><th>${t("desc")}</th></tr></thead><tbody><tr><td>center</td><td>boolean</td><td>${t("center")}</td></tr><tr><td>color</td><td>string</td><td>${t("color")}</td></tr><tr><td>duration</td><td>number</td><td>${t("duration")}</td></tr><tr><td>disabled</td><td>boolean</td><td>${t("disabled")}</td></tr></tbody></table></section>
  </elf-container>
`);
export { PageRipple };
