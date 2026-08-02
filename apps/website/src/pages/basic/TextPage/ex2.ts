import { defineHtml, defineStyle } from "@elfui/core";

import { createDocsTranslator } from "../../docsLocale";
import styles from "./demo.scss?inline";

const HEADING_TAG = "<h2>";
const PARAGRAPH_TAG = "<p>";
const STRONG_TAG = "<strong>";

const t = createDocsTranslator({
  title: { zh: "语义与响应式排版", en: "Semantic and responsive typography" },
  status: {
    zh: "原生 h2 / p / strong · 字号随容器变化",
    en: "Native h2 / p / strong · type scales with the container",
  },
  eyebrow: { zh: "存储空间", en: "Storage" },
  heading: { zh: "团队资源概览", en: "Team resource overview" },
  paragraph: {
    zh: "标题和段落保留原生语义，视觉尺寸独立控制；窄屏时标题会平滑缩小。",
    en: "Headings and paragraphs retain native semantics while visual size stays independent; the title scales down smoothly in narrow spaces.",
  },
  available: { zh: "可用容量", en: "Available capacity" },
  baselineHint: {
    zh: "数值与单位使用同一基线，GB 不会上浮或下沉。",
    en: "The value and unit share one baseline, so GB never floats above or below it.",
  },
  semanticMap: { zh: "渲染语义", en: "Rendered semantics" },
  headingTag: { zh: "章节标题", en: "Section heading" },
  paragraphTag: { zh: "正文段落", en: "Body paragraph" },
  strongTag: { zh: "重点数值", en: "Emphasized value" },
});

const semanticCode = `<article class="summary">
  <elf-text tag="h2" class="responsive-title" strong>
    Team resource overview
  </elf-text>
  <elf-text tag="p">
    Headings and paragraphs keep their native semantics.
  </elf-text>

  <span class="metric">
    <elf-text tag="strong">128</elf-text>
    <elf-text size="small">GB</elf-text>
  </span>
</article>`;

const semanticScript = `// tag controls the native element rendered inside the Shadow DOM.
// Keep document hierarchy semantic; use CSS for responsive visual sizing.
// .responsive-title { font-size: clamp(1.35rem, 4vw, 2.1rem); }
// .metric { display:inline-flex; align-items:baseline; gap:.4rem; }`;

defineStyle(styles);

const PageTextEx2 = defineHtml(`
  <elf-playground :title=${t("title")} :code=${semanticCode} :script=${semanticScript}>
    <span slot="status" class="text-demo-status">${t("status")}</span>
    <div class="text-semantic-grid">
      <article class="text-summary-card">
        <elf-text class="text-eyebrow" type="primary" size="small" strong>${t("eyebrow")}</elf-text>
        <elf-text class="text-responsive-title" tag="h2" strong>${t("heading")}</elf-text>
        <elf-text class="text-summary-copy" tag="p" type="info">${t("paragraph")}</elf-text>
        <div class="text-metric-block">
          <elf-text size="small" type="info">${t("available")}</elf-text>
          <span class="text-metric-line">
            <elf-text class="text-metric-value" tag="strong">128</elf-text>
            <elf-text size="small">GB</elf-text>
          </span>
          <elf-text size="small" type="info">${t("baselineHint")}</elf-text>
        </div>
      </article>
      <aside class="text-semantic-map" :aria-label=${t("semanticMap")}>
        <strong>${t("semanticMap")}</strong>
        <div><code>${HEADING_TAG}</code><span>${t("headingTag")}</span></div>
        <div><code>${PARAGRAPH_TAG}</code><span>${t("paragraphTag")}</span></div>
        <div><code>${STRONG_TAG}</code><span>${t("strongTag")}</span></div>
      </aside>
    </div>
  </elf-playground>
`);

export { PageTextEx2 };
