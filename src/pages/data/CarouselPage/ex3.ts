import { defineHtml, defineStyle } from "@elfui/core";

import { createDocsTranslator } from "../../docsLocale";
import styles from "./demo.scss?inline";

const t = createDocsTranslator({
  title: { zh: "渐隐与卡片层级", en: "Fade and card hierarchy" },
  status: {
    zh: "渐隐适合沉浸封面 · 卡片模式突出当前内容",
    en: "Fade suits immersive covers · card mode emphasizes the current item"
  },
  fade: { zh: "渐隐封面", en: "Fade cover" },
  card: { zh: "带标签卡片", en: "Labeled cards" },
  coast: { zh: "海岸线", en: "Coastline" },
  road: { zh: "山间公路", en: "Mountain road" },
  forest: { zh: "森林溪流", en: "Forest stream" },
  office: { zh: "城市工作区", en: "City workspace" },
  mountains: { zh: "海岸群山", en: "Coastal mountains" }
});

const variantsCode = `<elf-carousel effect="fade" indicator-type="line" :autoplay.prop=\${false}>
  <elf-carousel-item label="Coastline">
    <img src="/coast.jpg" alt="Coastline" />
  </elf-carousel-item>
</elf-carousel>

<elf-carousel type="card" :autoplay.prop=\${false}>
  <elf-carousel-item name="forest" label="Forest stream">
    <img src="/forest.jpg" alt="Forest stream" />
  </elf-carousel-item>
</elf-carousel>`;

const variantsScript = `// Fade overlays slides and changes opacity.
// Card mode requires direct elf-carousel-item children so each item
// receives active/index/total metadata and accessible slide semantics.`;

defineStyle(styles);

const PageCarouselEx3 = defineHtml(`
  <elf-playground :title=${t("title")} :code=${variantsCode} :script=${variantsScript}>
    <span slot="status" class="carousel-demo-status">${t("status")}</span>
    <div class="carousel-variant-grid">
      <article>
        <strong>${t("fade")}</strong>
        <elf-carousel
          effect="fade"
          height="280px"
          indicator-type="line"
          arrow="always"
          show-arrow="ghost"
          :autoplay.prop=${false}
          :aria-label=${t("fade")}
        >
          <elf-carousel-item :label=${t("coast")}>
            <img
              src="https://picsum.photos/id/1039/900/560"
              :alt=${t("coast")}
              loading="lazy"
              decoding="async"
            />
          </elf-carousel-item>
          <elf-carousel-item :label=${t("road")}>
            <img
              src="https://picsum.photos/id/1043/900/560"
              :alt=${t("road")}
              loading="lazy"
              decoding="async"
            />
          </elf-carousel-item>
        </elf-carousel>
      </article>

      <article>
        <strong>${t("card")}</strong>
        <elf-carousel
          type="card"
          height="280px"
          arrow="always"
          :autoplay.prop=${false}
          :aria-label=${t("card")}
        >
          <elf-carousel-item name="forest" :label=${t("forest")}>
            <img
              src="https://picsum.photos/id/15/900/560"
              :alt=${t("forest")}
              loading="lazy"
              decoding="async"
            />
          </elf-carousel-item>
          <elf-carousel-item name="office" :label=${t("office")}>
            <img
              src="https://picsum.photos/id/20/900/560"
              :alt=${t("office")}
              loading="lazy"
              decoding="async"
            />
          </elf-carousel-item>
          <elf-carousel-item name="mountains" :label=${t("mountains")}>
            <img
              src="https://picsum.photos/id/29/900/560"
              :alt=${t("mountains")}
              loading="lazy"
              decoding="async"
            />
          </elf-carousel-item>
        </elf-carousel>
      </article>
    </div>
  </elf-playground>
`);

export { PageCarouselEx3 };
