import { defineHtml, defineStyle } from "@elfui/core";
import { createDocsTranslator } from "../../docsLocale";
import styles from "./demo.scss?inline";

const t = createDocsTranslator({
  title: { zh: "禁用吸附", en: "Disabled sticky behavior" },
  content: { zh: "普通内容块", en: "Regular content block" },
  explanation: {
    zh: "禁用后保持普通文档流，不参与吸附",
    en: "When disabled, the content remains in normal document flow",
  },
  status: { zh: "普通文档流", en: "Normal document flow" },
  project: { zh: "秋季发布计划", en: "Autumn release plan" },
  summary: { zh: "项目摘要", en: "Project summary" },
  description: {
    zh: "关闭吸附后，摘要卡片会随内容一起滚动。",
    en: "With sticky behavior disabled, the summary card scrolls with the content.",
  },
  progress: { zh: "完成度", en: "Progress" },
  milestone: { zh: "里程碑", en: "Milestone" },
  owner: { zh: "负责人", en: "Owner" },
  activity: { zh: "最近动态", en: "Recent activity" },
  entries: {
    zh: "设计评审已通过,移动端适配进行中,等待发布窗口确认",
    en: "Design review approved,Mobile adaptation in progress,Release window pending",
  },
  comment: {
    zh: "disabled 会让组件回到普通文档流。",
    en: "disabled returns the component to normal document flow.",
  },
});

defineStyle(styles);

const entries = t("entries").split(",");

const code = `<elf-sticky top="16" disabled>
  <div>${t("content")}</div>
</elf-sticky>`;

const script = `// ${t("comment")}`;

const PageStickyEx3 = defineHtml(`
  <h2>${t("title")}</h2>
  <elf-playground :title=${t("title")} :code=${code} :script=${script}>
    <span slot="status" class="demo-state">${t("status")}</span>
    <div class="sticky-demo-surface sticky-demo-surface--disabled">
      <elf-sticky top="16" disabled>
        <div class="sticky-summary-card">
          <div class="sticky-summary-heading">
            <span class="sticky-summary-icon">A</span>
            <span>
              <small>${t("summary")}</small>
              <strong>${t("project")}</strong>
            </span>
            <span class="sticky-summary-badge">${t("status")}</span>
          </div>
          <p>${t("description")}</p>
          <div class="sticky-summary-stats">
            <span><small>${t("progress")}</small><strong>72%</strong></span>
            <span><small>${t("milestone")}</small><strong>08 / 11</strong></span>
            <span><small>${t("owner")}</small><strong>Elf Studio</strong></span>
          </div>
        </div>
      </elf-sticky>
      <div class="sticky-disabled-feed">
        <small>${t("activity")}</small>
        <div class="sticky-disabled-entry" v-for="(entry, index) in entries" :key="entry">
          <span>{{ String(index + 1).padStart(2, '0') }}</span>
          <strong>{{ entry }}</strong>
          <small>{{ index === 0 ? '09:24' : index === 1 ? 'Yesterday' : 'Friday' }}</small>
        </div>
      </div>
    </div>
  </elf-playground>
`);

export { PageStickyEx3 };
