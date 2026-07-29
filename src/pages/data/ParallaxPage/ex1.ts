import { defineHtml, defineStyle } from "@elfui/core";

import { createDocsTranslator } from "../../docsLocale";
import styles from "./demo.scss?inline";

const t = createDocsTranslator({
  title: { zh: "基础视差", en: "Basic parallax" },
  heading: { zh: "滚动时保持画面层次", en: "Keep depth while scrolling" },
  body: {
    zh: "背景图片会跟随视口位置轻微移动，适合封面、分段介绍和沉浸式内容区。",
    en: "The background image moves subtly with the viewport, useful for covers and immersive sections."
  }
});

const image = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 520">
  <defs>
    <linearGradient id="sky" x1="0" x2="1" y1="0" y2="1">
      <stop stop-color="#7cc3ed"/>
      <stop offset="0.55" stop-color="#315f86"/>
      <stop offset="1" stop-color="#14273a"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="520" fill="url(#sky)"/>
  <path d="M0 410 170 245 285 350 430 180 610 390 760 230 930 410 1200 210v310H0z" fill="#132538"/>
  <path d="M0 455c170-70 330-78 505-36 160 38 314 42 462-20 85-35 152-58 233-52v173H0z" fill="#0b1724" opacity=".82"/>
</svg>
`)}`;

const code = `<elf-parallax src="mountains.svg" height="360">
  <div>
    <h3>${t("heading")}</h3>
    <p>${t("body")}</p>
  </div>
</elf-parallax>`;

defineStyle(styles);

const PageParallaxEx1 = defineHtml(`
  <h2>${t("title")}</h2>
  <elf-playground :title=${t("title")} :code=${code}>
    <elf-parallax :src=${image} alt="Abstract mountain landscape" height="360">
      <div class="parallax-copy">
        <h3>${t("heading")}</h3>
        <p>${t("body")}</p>
      </div>
    </elf-parallax>
  </elf-playground>
`);

export { PageParallaxEx1 };
