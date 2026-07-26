import { defineHtml, defineStyle } from "@elfui/core";

import { createDocsTranslator } from "../../docsLocale";
import styles from "./demo.scss?inline";

const t = createDocsTranslator({
  title: { zh: "对象适配矩阵", en: "Object-fit matrix" },
  status: { zh: "统一容器 180 × 132", en: "Shared frame 180 × 132" },
  fill: { zh: "拉伸填满", en: "Stretch to fill" },
  contain: { zh: "完整显示", en: "Show all content" },
  cover: { zh: "等比裁切", en: "Crop proportionally" },
  none: { zh: "保持原始尺寸", en: "Keep intrinsic size" },
  scaleDown: { zh: "仅在需要时缩小", en: "Shrink only when needed" },
  alt: { zh: "竖版几何海报", en: "Portrait geometric poster" }
});

const sampleSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="220" height="360" viewBox="0 0 220 360">
  <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#2563eb"/><stop offset="1" stop-color="#7c3aed"/></linearGradient></defs>
  <rect width="220" height="360" rx="18" fill="url(#g)"/>
  <circle cx="110" cy="105" r="58" fill="#fff" fill-opacity=".92"/>
  <path d="M35 292 90 218l38 45 26-31 31 60Z" fill="#fff" fill-opacity=".82"/>
  <text x="110" y="188" text-anchor="middle" fill="#fff" font-size="24" font-family="sans-serif">220 × 360</text>
</svg>`;

const imageSrc = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(sampleSvg)}`;

const fitCode = `<elf-image src="poster.svg" width="180" height="132" fit="fill" />
<elf-image src="poster.svg" width="180" height="132" fit="contain" />
<elf-image src="poster.svg" width="180" height="132" fit="cover" />
<elf-image src="poster.svg" width="180" height="132" fit="none" />
<elf-image src="poster.svg" width="180" height="132" fit="scale-down" />`;

const fitScript = `const fits = ["fill", "contain", "cover", "none", "scale-down"];

// A portrait source inside identical landscape frames makes each fit mode visible.
const imageSrc = createPosterDataUrl({ width: 220, height: 360 });`;

defineStyle(styles);

const PageImageEx1 = defineHtml(`
  <elf-playground :title=${t("title")} :code=${fitCode} :script=${fitScript}>
    <span slot="status" class="image-demo-status">${t("status")}</span>
    <div class="image-fit-grid">
      <article>
        <header><strong>fill</strong><span>${t("fill")}</span></header>
        <elf-image :src=${imageSrc} :alt=${t("alt")} width="180" height="132" fit="fill" />
      </article>
      <article>
        <header><strong>contain</strong><span>${t("contain")}</span></header>
        <elf-image :src=${imageSrc} :alt=${t("alt")} width="180" height="132" fit="contain" />
      </article>
      <article>
        <header><strong>cover</strong><span>${t("cover")}</span></header>
        <elf-image :src=${imageSrc} :alt=${t("alt")} width="180" height="132" fit="cover" />
      </article>
      <article>
        <header><strong>none</strong><span>${t("none")}</span></header>
        <elf-image :src=${imageSrc} :alt=${t("alt")} width="180" height="132" fit="none" />
      </article>
      <article>
        <header><strong>scale-down</strong><span>${t("scaleDown")}</span></header>
        <elf-image :src=${imageSrc} :alt=${t("alt")} width="180" height="132" fit="scale-down" />
      </article>
    </div>
  </elf-playground>
`);

export { PageImageEx1 };
