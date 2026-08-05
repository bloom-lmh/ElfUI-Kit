import { defineHtml, defineStyle } from "@elfui/core";

import { createDocsTranslator } from "../../docsLocale";
import styles from "./demo.scss?inline";

const t = createDocsTranslator({
  title: { zh: "标题样式配置", en: "Heading style configuration" },
  status: {
    zh: "line-height · margin-top · margin-bottom · font-size · letter-spacing",
    en: "line-height · margin-top · margin-bottom · font-size · letter-spacing",
  },
  meta: {
    zh: "通过属性直接覆盖行高、上下边距、字号与字距；数字值自动换算为 px。",
    en: "Override line height, block margins, font size, and letter spacing via props; numeric values become px.",
  },
  h2: { zh: "配置后的章节标题", en: "Configured section heading" },
  h3: { zh: "默认行高与字距", en: "Default line height and tracking" },
});

const code = `<div class="heading-suite heading-suite-config">
  <section class="heading-suite-section">
    <span class="heading-suite-meta">Overrides: line-height, margins, tracking</span>
    <elf-heading
      family="guide"
      level="2"
      numbered
      line-height="1.6"
      margin-top="48px"
      margin-bottom="24px"
      letter-spacing="0.02em"
    >Configured section heading</elf-heading>
    <elf-heading family="guide" level="3">Default line height and tracking</elf-heading>
  </section>
</div>`;

const script = `// line-height 数字作为倍率，margin-top / margin-bottom / font-size / letter-spacing 数字换算为 px。`;

defineStyle(styles);

const PageHeadingEx7 = defineHtml(`
  <elf-playground :title=${t("title")} :code=${code} :script=${script}>
    <span slot="status" class="heading-suite-status">${t("status")}</span>
    <div class="heading-suite heading-suite-config">
      <section class="heading-suite-section">
        <span class="heading-suite-meta">${t("meta")}</span>
        <elf-heading
          family="guide"
          level="2"
          numbered
          line-height="1.6"
          margin-top="48px"
          margin-bottom="24px"
          letter-spacing="0.02em"
        >${t("h2")}</elf-heading>
        <elf-heading family="guide" level="3">${t("h3")}</elf-heading>
      </section>
    </div>
  </elf-playground>
`);

export { PageHeadingEx7 };
