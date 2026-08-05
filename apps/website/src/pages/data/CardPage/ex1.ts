import { defineHtml, defineStyle } from "@elfui/core";

import { createDocsTranslator } from "../../docsLocale";
import styles from "./demo.scss?inline";

const t = createDocsTranslator({
  title: { zh: "内容与密度", en: "Content and density" },
  status: {
    zh: "5 种层级 · 3 档密度 · 阴影策略兼容",
    en: "5 hierarchy variants · 3 densities · compatible shadow policies",
  },
  elevated: { zh: "项目概览", en: "Project overview" },
  elevatedSub: { zh: "本周 8 项任务 · 3 项交付", en: "8 tasks · 3 deliverables this week" },
  elevatedCopy: {
    zh: "克制的阴影建立独立内容层级，适合仪表盘与关键指标。",
    en: "A restrained shadow establishes an independent content layer for dashboards and key metrics.",
  },
  elevatedTag: { zh: "进行中", en: "In progress" },
  outlined: { zh: "团队动态", en: "Team activity" },
  outlinedSub: { zh: "Design · Frontend · QA", en: "Design · Frontend · QA" },
  outlinedCopy: {
    zh: "清晰的边界适合同级信息并列，布局密集也不会互相干扰。",
    en: "A clear boundary works well for peer content, even in dense layouts.",
  },
  outlinedTag: { zh: "3 条新动态", en: "3 new updates" },
  tonal: { zh: "设计规范", en: "Design guidelines" },
  tonalSub: { zh: "Material 3 · 设计令牌", en: "Material 3 · design tokens" },
  tonalCopy: {
    zh: "主色浅染强调关联信息，适合规范、专题与上下文提醒。",
    en: "A subtle theme tint highlights related content, guidelines, and context.",
  },
  tonalAction: { zh: "查看规范", en: "View guide" },
  compactHeader: { zh: "快捷入口", en: "Quick actions" },
  compactFooter: { zh: "4 个项目", en: "4 projects" },
  compactCopy: {
    zh: "紧凑密度适合侧栏、摘要和密集列表，header/footer 属性保持 Element Plus 兼容。",
    en: "Compact density suits sidebars, summaries, and dense lists; header/footer stay Element Plus compatible.",
  },
});

const appearanceCode = `<elf-card title="Project overview" subtitle="8 tasks · 3 deliverables this week" variant="elevated">
  <div slot="extra" class="card-tile card-tile-primary" aria-hidden="true">◈</div>
  <p>A restrained shadow establishes an independent content layer.</p>
  <template #footer>
    <elf-tag type="primary" size="sm">In progress</elf-tag>
  </template>
</elf-card>

<elf-card title="Team activity" subtitle="Design · Frontend · QA" variant="outlined" shadow="never">
  <div slot="extra" class="card-tile card-tile-secondary" aria-hidden="true">◐</div>
  <p>A clear boundary works well for peer content, even in dense layouts.</p>
  <template #footer>
    <elf-tag type="info" variant="outlined" size="sm">3 new updates</elf-tag>
  </template>
</elf-card>

<elf-card title="Design guidelines" subtitle="Material 3 · design tokens" variant="tonal" density="comfortable">
  <div slot="extra" class="card-tile card-tile-success" aria-hidden="true">◉</div>
  <p>A subtle theme tint highlights related content, guidelines, and context.</p>
  <template #footer>
    <elf-button size="sm" variant="outlined">View guide</elf-button>
  </template>
</elf-card>

<elf-card header="Quick actions" footer="4 projects" variant="filled" density="compact">
  <div slot="extra" class="card-tile card-tile-warning" aria-hidden="true">▤</div>
  <p>Compact density suits sidebars, summaries, and dense lists.</p>
</elf-card>`;

const appearanceScript = `// variant controls surface hierarchy; density controls internal spacing.
// shadow="always | hover | never" remains compatible with Element Plus.
// header/footer props are shortcuts; named slots take precedence when present.`;

defineStyle(styles);

const PageCardEx1 = defineHtml(`
  <elf-playground :title=${t("title")} :code=${appearanceCode} :script=${appearanceScript}>
    <span slot="status" class="card-demo-status">${t("status")}</span>
    <div class="card-appearance-grid">
      <elf-card
        :title=${t("elevated")}
        :subtitle=${t("elevatedSub")}
        variant="elevated"
      >
        <div slot="extra" class="card-tile card-tile-primary" aria-hidden="true">◈</div>
        <p>${t("elevatedCopy")}</p>
        <template #footer>
          <elf-tag type="primary" size="sm">${t("elevatedTag")}</elf-tag>
        </template>
      </elf-card>
      <elf-card
        :title=${t("outlined")}
        :subtitle=${t("outlinedSub")}
        variant="outlined"
        shadow="never"
      >
        <div slot="extra" class="card-tile card-tile-secondary" aria-hidden="true">◐</div>
        <p>${t("outlinedCopy")}</p>
        <template #footer>
          <elf-tag type="info" variant="outlined" size="sm">${t("outlinedTag")}</elf-tag>
        </template>
      </elf-card>
      <elf-card
        :title=${t("tonal")}
        :subtitle=${t("tonalSub")}
        variant="tonal"
        density="comfortable"
      >
        <div slot="extra" class="card-tile card-tile-success" aria-hidden="true">◉</div>
        <p>${t("tonalCopy")}</p>
        <template #footer>
          <elf-button size="sm" variant="outlined">${t("tonalAction")}</elf-button>
        </template>
      </elf-card>
      <elf-card
        :header=${t("compactHeader")}
        :footer=${t("compactFooter")}
        variant="filled"
        density="compact"
      >
        <div slot="extra" class="card-tile card-tile-warning" aria-hidden="true">▤</div>
        <p>${t("compactCopy")}</p>
      </elf-card>
    </div>
  </elf-playground>
`);

export { PageCardEx1 };
