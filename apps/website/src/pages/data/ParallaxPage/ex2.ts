import { defineHtml, defineStyle } from "@elfui/core";

import { createDocsTranslator } from "../../docsLocale";
import styles from "./demo.scss?inline";

const t = createDocsTranslator({
  title: { zh: "位置、缩放与禁用", en: "Position, scale, and disabled" },
  first: { zh: "偏顶部取景", en: "Top-positioned crop" },
  second: { zh: "禁用视差", en: "Disabled parallax" },
});

const city = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 520">
  <rect width="1200" height="520" fill="#19202c"/>
  <rect y="350" width="1200" height="170" fill="#0f1722"/>
  <g fill="#36516b"><rect x="80" y="170" width="110" height="270"/><rect x="230" y="100" width="160" height="340"/><rect x="440" y="210" width="120" height="230"/><rect x="620" y="130" width="190" height="310"/><rect x="870" y="80" width="140" height="360"/></g>
  <g fill="#92cdf6" opacity=".85"><circle cx="190" cy="90" r="36"/><rect x="250" y="145" width="82" height="12"/><rect x="650" y="175" width="120" height="12"/><rect x="900" y="125" width="78" height="12"/></g>
</svg>
`)}`;

const code = `<elf-parallax src="city.svg" position="top" scale="1.35" height="260">
  <span slot>${t("first")}</span>
</elf-parallax>
<elf-parallax src="city.svg" disabled height="220">
  <span slot>${t("second")}</span>
</elf-parallax>`;

defineStyle(styles);

const PageParallaxEx2 = defineHtml(`
  <h2>${t("title")}</h2>
  <elf-playground :title=${t("title")} :code=${code}>
    <div class="parallax-gallery">
      <elf-parallax :src=${city} alt="City skyline" position="top" scale="1.35" height="260">
        <span class="parallax-panel"><strong>${t("first")}</strong><small>position="top" · scale="1.35"</small></span>
      </elf-parallax>
      <elf-parallax :src=${city} alt="City skyline" disabled height="220">
        <span class="parallax-panel"><strong>${t("second")}</strong><small>disabled</small></span>
      </elf-parallax>
    </div>
  </elf-playground>
`);

export { PageParallaxEx2 };
