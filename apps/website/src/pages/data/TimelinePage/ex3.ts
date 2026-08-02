import { defineHtml, defineStyle } from "@elfui/core";

import { createDocsTranslator } from "../../docsLocale";
import styles from "./demo.scss?inline";
import { timelineIconOptions } from "./icons";

const t = createDocsTranslator({
  title: { zh: "彩色卡片", en: "Color cards" },
  playground: { zh: "图标标题与交替色块", en: "Icon headings and alternating color blocks" },
  titleOne: { zh: "标题 1", en: "Title 1" },
  titleTwo: { zh: "标题 2", en: "Title 2" },
  titleThree: { zh: "标题 3", en: "Title 3" },
  body: {
    zh: "卡片通过独立插槽组合标题、图标和正文，同时保持时间轴节点与卡片主题色一致。",
    en: "Highlight product research, implementation, and launch updates with clear visual grouping.",
  },
});

const items = [
  { hideTimestamp: true, color: "#ba68c8" },
  { hideTimestamp: true, color: "#ffca28" },
  { hideTimestamp: true, color: "#26bcd0" },
];

const code = `<elf-timeline :items.prop=\${items} mode="alternate">
  <article slot="item-0" class="feature-card is-purple">...</article>
  <article slot="item-1-secondary" class="feature-card is-amber">...</article>
  <article slot="item-2" class="feature-card is-cyan">...</article>
</elf-timeline>`;

const script = `const items = [
  { hideTimestamp: true, color: "#ba68c8" },
  { hideTimestamp: true, color: "#ffca28" },
  { hideTimestamp: true, color: "#26bcd0" }
];`;

defineStyle(styles);

const PageTimelineEx3 = defineHtml(`
  <h2>${t("title")}</h2>
  <elf-playground :title=${t("playground")} :code=${code} :script=${script}>
    <elf-icon-provider :options.prop=${timelineIconOptions}>
      <div class="timeline-reference-stage feature-stage">
        <elf-timeline class="feature-card-timeline" :items.prop=${items} mode="alternate">
          <article slot="item-0" class="feature-card is-purple">
            <header class="feature-card-header">
              <elf-icon name="search" size="34"></elf-icon>
              <strong>${t("titleOne")}</strong>
            </header>
            <p>${t("body")}</p>
          </article>

          <article slot="item-1-secondary" class="feature-card is-amber">
            <header class="feature-card-header">
              <strong>${t("titleTwo")}</strong>
              <elf-icon name="home" size="32"></elf-icon>
            </header>
            <p>${t("body")}</p>
          </article>

          <article slot="item-2" class="feature-card is-cyan">
            <header class="feature-card-header">
              <elf-icon name="email" size="34"></elf-icon>
              <strong>${t("titleThree")}</strong>
            </header>
            <p>${t("body")}</p>
          </article>
        </elf-timeline>
      </div>
    </elf-icon-provider>
  </elf-playground>
`);

export { PageTimelineEx3 };
