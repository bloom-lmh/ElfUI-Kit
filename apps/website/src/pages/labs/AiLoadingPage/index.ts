import { defineHtml, defineStyle, useRef, useTemplateRef } from "@elfui/core";

import type { AiLoadingElement } from "@elfui/kit";
import { createDocsTranslator } from "../../docsLocale";
import articleStyles from "../../shared/article.scss?inline";

const t = createDocsTranslator({
  kicker: { zh: "实验室组件", en: "Labs component" },
  title: { zh: "AI Loading 加载状态", en: "AI Loading" },
  description: {
    zh: "面向 AI Agent 的像素网格加载器：Drive / Dots / Orbit 三种变体，带 shimmer 文字与实时计时。",
    en: "A pixel-grid loader for AI agents with Drive / Dots / Orbit variants, shimmer text, and a live elapsed timer.",
  },
  warning: {
    zh: "实验性 API：属性与 DOM 结构可能在稳定版前调整。",
    en: "Experimental API: props and DOM structure may change before stabilization.",
  },
  demo: { zh: "变体切换", en: "Variant switcher" },

  status: { zh: "状态", en: "Status" },
  running: { zh: "运行中", en: "Running" },
  drive: { zh: "Drive 波前", en: "Drive wavefront" },
  dots: { zh: "Dots 圆点", en: "Dots" },
  orbit: { zh: "Orbit 轨道", en: "Orbit" },
  reset: { zh: "重置计时", en: "Reset timer" },
  api: { zh: "API", en: "API" },
  props: { zh: "属性", en: "Props" },
  labelDesc: { zh: "加载标签文本。", en: "Loader label text." },
  variantDesc: {
    zh: "动画变体：drive / dots / orbit。",
    en: "Animation variant: drive / dots / orbit.",
  },
  showTimerDesc: { zh: "显示实时计时。", en: "Shows the live elapsed timer." },
  labelsDesc: { zh: "无障碍文案覆盖。", en: "Accessibility label overrides." },
  ariaLabelDesc: { zh: "无障碍标签。", en: "Accessible label." },
  expose: { zh: "方法", en: "Methods" },
  resetMethod: { zh: "从零重新计时。", en: "Restarts the timer from zero." },
});

const variant = useRef<"drive" | "dots" | "orbit">("drive");
const loadingEl = useTemplateRef<AiLoadingElement>("loading");
const variantClass = (name: string): Record<string, boolean> => ({
  active: variant.value === name,
});

const code = `<elf-ai-loading label="Churning" variant="orbit" />`;
const script = `import { registerAllComponents } from "@elfui/kit";

registerAllComponents();

const loadingEl = ref(null);
// 切换 variant 即可更换动画，resetTimer() 可重置计时
loadingEl.value?.resetTimer?.();`;

const propRows = () => [
  { name: "label", type: "string", default: "'Working'", desc: t("labelDesc") },
  {
    name: "variant",
    type: "'drive' | 'dots' | 'orbit'",
    default: "'drive'",
    desc: t("variantDesc"),
  },
  { name: "show-timer", type: "boolean", default: "true", desc: t("showTimerDesc") },
  { name: "labels", type: "Partial<AiLoadingLabels>", default: "{}", desc: t("labelsDesc") },
  { name: "aria-label", type: "string", default: "''", desc: t("ariaLabelDesc") },
];

const exposeRows = () => [{ name: "resetTimer", desc: t("resetMethod") }];

defineStyle(
  articleStyles,
  `
  .ai-loading-stage {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 14px;
    width: min(100%, 560px);
    padding: 22px;
    border: 1px solid var(--elf-border, #d7dee8);
    border-radius: 14px;
    background: var(--elf-bg-overlay, #f1f5f9);
  }
  .ai-loading-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }
  .ai-loading-actions button {
    padding: 6px 12px;
    border: 1px solid var(--elf-border, #d7dee8);
    border-radius: 8px;
    background: var(--elf-bg-paper, #fff);
    color: var(--elf-text-secondary, #64748b);
    cursor: pointer;
    font: 600 12px/1.4 var(--elf-font-family, sans-serif);
  }
  .ai-loading-actions button.active {
    border-color: var(--elf-primary, #409eff);
    color: var(--elf-primary, #409eff);
  }
  `,
);

const PageLabsAiLoading = defineHtml(`
  <elf-container class="docs-article">
    <elf-docs-hero category="labs" tag="AI Loading" :title=${t("title")} :description=${t("description")}></elf-docs-hero>
    <p class="docs-callout is-warning labs-warning">${t("warning")}</p>
    <elf-playground :title=${t("demo")} :code=${code} :script=${script}>
      <span slot="status">${t("status")}: ${t("running")}</span>
      <div class="ai-loading-stage">
        <elf-ai-loading
          ref="loading"
          :variant=${variant.value}
          label="Churning"
        ></elf-ai-loading>
        <div class="ai-loading-actions">
          <button :class=${variantClass("drive")} @click=${() => variant.set("drive")}>${t("drive")}</button>
          <button :class=${variantClass("dots")} @click=${() => variant.set("dots")}>${t("dots")}</button>
          <button :class=${variantClass("orbit")} @click=${() => variant.set("orbit")}>${t("orbit")}</button>
          <button @click=${() => loadingEl.value?.resetTimer?.()}>${t("reset")}</button>
        </div>
      </div>
    </elf-playground>
    <elf-api-builder component="elf-ai-loading" title="API">
    <elf-props-table role="props" :title=${t("props")} :rows=${propRows()}></elf-props-table>
    <elf-props-table role="methods" :title=${t("expose")} :rows=${exposeRows()}></elf-props-table>
  </elf-api-builder>
  </elf-container>
`);

export { PageLabsAiLoading };
