import { defineHtml, defineStyle } from "@elfui/core";

import { createDocsTranslator } from "../../docsLocale";
import styles from "./demo.scss?inline";

const t = createDocsTranslator({
  title: { zh: "默认与紧凑密度", en: "Default and compact density" },
  status: { zh: "默认 160px · 紧凑 72px", en: "Default 160px · compact 72px" },
  defaultLabel: { zh: "标准空列表", en: "Standard empty list" },
  defaultDescription: { zh: "当前列表还没有数据", en: "There is no data in this list yet" },
  compactLabel: { zh: "紧凑空区域", en: "Compact empty region" },
  compactDescription: { zh: "最近没有活动", en: "No recent activity" }
});

const densityCode = `<elf-empty description="There is no data in this list yet" />

<elf-empty
  size="compact"
  image-size="72"
  description="No recent activity"
/>`;

const densityScript = `// Compact controls layout density; image-size keeps artwork proportional.
const compactEmpty = {
  size: "compact",
  imageSize: 72,
  description: "No recent activity"
};`;

defineStyle(styles);

const PageEmptyEx1 = defineHtml(`
  <elf-playground :title=${t("title")} :code=${densityCode} :script=${densityScript}>
    <span slot="status" class="empty-demo-status">${t("status")}</span>
    <div class="empty-density-grid">
      <article>
        <span class="empty-demo-label">${t("defaultLabel")}</span>
        <elf-empty :description=${t("defaultDescription")} />
      </article>
      <article>
        <span class="empty-demo-label">${t("compactLabel")}</span>
        <elf-empty
          size="compact"
          image-size="72"
          :description=${t("compactDescription")}
        />
      </article>
    </div>
  </elf-playground>
`);

export { PageEmptyEx1 };
