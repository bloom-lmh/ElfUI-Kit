import { defineHtml, defineStyle } from "@elfui/core";

import { createDocsTranslator } from "../../docsLocale";
import styles from "./demo.scss?inline";

const t = createDocsTranslator({
  title: { zh: "Surface 与内容密度", en: "Surface and content density" },
  status: {
    zh: "5 种层级 · 3 档密度 · 阴影策略兼容",
    en: "5 hierarchy variants · 3 densities · compatible shadow policies",
  },
  elevated: { zh: "浮层卡片", en: "Elevated card" },
  elevatedCopy: {
    zh: "一级阴影表达独立内容层级。",
    en: "A restrained shadow establishes an independent content layer.",
  },
  outlined: { zh: "描边卡片", en: "Outlined card" },
  outlinedCopy: {
    zh: "清晰边界适合同级信息并排。",
    en: "A clear boundary works well for peer content.",
  },
  tonal: { zh: "柔和卡片", en: "Tonal card" },
  tonalCopy: {
    zh: "主题浅色强调关联信息。",
    en: "A subtle theme tint highlights related information.",
  },
  compact: { zh: "紧凑卡片", en: "Compact card" },
  compactCopy: {
    zh: "适合侧栏、摘要和密集列表。",
    en: "Designed for sidebars, summaries, and dense lists.",
  },
  footer: { zh: "共计 4 个项目", en: "4 projects total" },
});

const appearanceCode = `<elf-card title="Elevated card" variant="elevated">
  <p>A restrained shadow establishes hierarchy.</p>
</elf-card>

<elf-card title="Outlined card" variant="outlined" shadow="never">
  <p>A clear boundary works well for peer content.</p>
</elf-card>

<elf-card title="Tonal card" variant="tonal" density="comfortable">
  <p>A subtle theme tint highlights related information.</p>
</elf-card>

<elf-card
  header="Compact card"
  footer="4 projects total"
  variant="filled"
  density="compact"
>
  <p>Element Plus header/footer props remain supported.</p>
</elf-card>`;

const appearanceScript = `// variant controls surface hierarchy; density controls internal spacing.
// shadow="always | hover | never" remains compatible with Element Plus.
// header/footer props are shortcuts; named slots take precedence when present.`;

defineStyle(styles);

const PageCardEx1 = defineHtml(`
  <elf-playground :title=${t("title")} :code=${appearanceCode} :script=${appearanceScript}>
    <span slot="status" class="card-demo-status">${t("status")}</span>
    <div class="card-appearance-grid">
      <elf-card :title=${t("elevated")} variant="elevated">
        <p>${t("elevatedCopy")}</p>
      </elf-card>
      <elf-card :title=${t("outlined")} variant="outlined" shadow="never">
        <p>${t("outlinedCopy")}</p>
      </elf-card>
      <elf-card :title=${t("tonal")} variant="tonal" density="comfortable">
        <p>${t("tonalCopy")}</p>
      </elf-card>
      <elf-card
        :header=${t("compact")}
        :footer=${t("footer")}
        variant="filled"
        density="compact"
      >
        <p>${t("compactCopy")}</p>
      </elf-card>
    </div>
  </elf-playground>
`);

export { PageCardEx1 };
