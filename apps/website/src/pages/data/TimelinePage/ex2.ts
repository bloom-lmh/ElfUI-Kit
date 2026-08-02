import { defineHtml, defineStyle } from "@elfui/core";

import { createDocsTranslator } from "../../docsLocale";
import styles from "./demo.scss?inline";
import { timelineIconOptions } from "./icons";

const t = createDocsTranslator({
  title: { zh: "交替卡片", en: "Alternating cards" },
  playground: { zh: "双色卡片与节点动作", en: "Two-tone cards and node actions" },
  cardTitle: { zh: "示例卡片标题", en: "Release milestone" },
  body: {
    zh: "卡片内容在中轴两侧交替排列，节点颜色与标题色保持一致，并在窄屏下自动回退为单列。",
    en: "Track decisions, owners, and next steps in a card that stays readable on both sides of the timeline.",
  },
  action: { zh: "按钮", en: "Button" },
});

const items = [
  { hideTimestamp: true, color: "#e57373" },
  { hideTimestamp: true, color: "#ba68c8" },
];

const code = `<elf-timeline :items.prop=\${items} mode="alternate">
  <article slot="item-0" class="reference-card is-coral">...</article>
  <elf-icon slot="dot-0" name="star" />
  <article slot="item-1-secondary" class="reference-card is-purple">...</article>
  <elf-icon slot="dot-1" name="bookmark" />
</elf-timeline>`;

const script = `const items = [
  { hideTimestamp: true, color: "#e57373" },
  { hideTimestamp: true, color: "#ba68c8" }
];`;

defineStyle(styles);

const PageTimelineEx2 = defineHtml(`
  <h2>${t("title")}</h2>
  <elf-playground :title=${t("playground")} :code=${code} :script=${script}>
    <elf-icon-provider :options.prop=${timelineIconOptions}>
      <div class="timeline-reference-stage card-stage">
        <elf-timeline class="alternating-card-timeline" :items.prop=${items} mode="alternate">
          <article slot="item-0" class="reference-card is-coral">
            <header class="reference-card-header">${t("cardTitle")}</header>
            <div class="reference-card-body">
              <p>${t("body")}</p>
              <elf-button variant="outlined" color="danger">${t("action")}</elf-button>
            </div>
          </article>
          <elf-icon slot="dot-0" name="star" size="22"></elf-icon>

          <article slot="item-1-secondary" class="reference-card is-purple">
            <header class="reference-card-header">${t("cardTitle")}</header>
            <div class="reference-card-body">
              <p>${t("body")}</p>
              <elf-button variant="outlined" color="secondary">${t("action")}</elf-button>
            </div>
          </article>
          <elf-icon slot="dot-1" name="bookmark" size="20"></elf-icon>
        </elf-timeline>
      </div>
    </elf-icon-provider>
  </elf-playground>
`);

export { PageTimelineEx2 };
