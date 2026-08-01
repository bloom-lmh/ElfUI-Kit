import { defineHtml, defineStyle } from "@elfui/core";
import { createDocsTranslator } from "../../docsLocale";
import styles from "./demo.scss?inline";

const t = createDocsTranslator({
  title: { zh: "底部吸附", en: "Bottom sticky" },
  playgroundTitle: { zh: "底部操作栏", en: "Bottom action bar" },
  row: { zh: "审批记录", en: "Approval record" },
  product: { zh: "产品评审", en: "Product review" },
  design: { zh: "设计确认", en: "Design review" },
  engineering: { zh: "工程核验", en: "Engineering review" },
  approved: { zh: "已通过", en: "Approved" },
  pending: { zh: "待处理", en: "Pending" },
  save: { zh: "保存草稿", en: "Save draft" },
  submit: { zh: "提交", en: "Submit" },
  actionSummary: {
    zh: "操作栏保持在容器底部",
    en: "The action bar stays at the bottom of the container",
  },
  comment: {
    zh: 'position="bottom" 与 offset 共同控制底部吸附。',
    en: 'position="bottom" and offset control bottom sticky behavior.',
  },
});

const categories = [t("product"), t("design"), t("engineering")];
const rows = Array.from({ length: 10 }, (_, index) => ({
  id: index + 1,
  title: `${t("row")} ${index + 1}`,
  meta: categories[index % categories.length],
  state: index % 3 === 0 ? t("approved") : t("pending"),
  tone: index % 3 === 0 ? "success" : "primary",
}));

defineStyle(styles);

const code = `<elf-sticky position="bottom" offset="0" z-index="20">
  <div class="actions">${t("save")} / ${t("submit")}</div>
</elf-sticky>`;

const script = `// ${t("comment")}`;

const PageStickyEx2 = defineHtml(`
  <h2>${t("playgroundTitle")}</h2>
  <elf-playground :title=${t("playgroundTitle")} :code=${code} :script=${script}>
    <span slot="status">${t("actionSummary")}</span>
    <div class="sticky-demo-surface sticky-demo-surface--actions">
      <div class="sticky-record-list">
        <div class="sticky-record-row" v-for="row in rows" :key="row.id">
          <span class="sticky-record-index">{{ String(row.id).padStart(2, '0') }}</span>
          <span class="sticky-record-copy">
            <strong>{{ row.title }}</strong>
            <small>{{ row.meta }}</small>
          </span>
          <span class="sticky-record-state" :data-tone="row.tone">{{ row.state }}</span>
        </div>
      </div>
      <elf-sticky position="bottom" offset="0" z-index="20">
        <div class="sticky-actions">
          <elf-button size="sm" variant="outlined">${t("save")}</elf-button>
          <elf-button size="sm">${t("submit")}</elf-button>
        </div>
      </elf-sticky>
    </div>
  </elf-playground>
`);

export { PageStickyEx2 };
