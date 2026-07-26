import { defineHtml, defineStyle } from "@elfui/core";

import { createDocsTranslator } from "../../docsLocale";
import styles from "./demo.scss?inline";

const t = createDocsTranslator({
  title: { zh: "外观与文本装饰", en: "Appearance and decoration" },
  status: {
    zh: "语义色、尺寸和装饰集中对比",
    en: "Semantic colors, sizes, and decoration in one comparison"
  },
  semantics: { zh: "语义颜色", en: "Semantic colors" },
  default: { zh: "默认文本", en: "Default text" },
  primary: { zh: "主要信息", en: "Primary information" },
  success: { zh: "操作成功", en: "Operation succeeded" },
  warning: { zh: "需要注意", en: "Needs attention" },
  danger: { zh: "操作失败", en: "Operation failed" },
  info: { zh: "补充说明", en: "Additional information" },
  sizes: { zh: "尺寸层级", en: "Size hierarchy" },
  small: { zh: "辅助文本", en: "Supporting text" },
  medium: { zh: "正文文本", en: "Body text" },
  large: { zh: "强调文本", en: "Emphasized text" },
  decoration: { zh: "内容装饰", en: "Content decoration" },
  strong: { zh: "重点", en: "Strong" },
  italic: { zh: "术语", en: "Term" },
  marked: { zh: "高亮", en: "Marked" },
  deleted: { zh: "旧价格", en: "Old price" },
  inserted: { zh: "新增内容", en: "Inserted content" }
});

const appearanceCode = `<elf-text>Default text</elf-text>
<elf-text type="primary">Primary information</elf-text>
<elf-text type="success">Operation succeeded</elf-text>
<elf-text type="warning">Needs attention</elf-text>
<elf-text type="danger">Operation failed</elf-text>
<elf-text type="info">Additional information</elf-text>

<elf-text size="small">Supporting text</elf-text>
<elf-text size="default">Body text</elf-text>
<elf-text size="large">Emphasized text</elf-text>

<elf-text strong>Strong</elf-text>
<elf-text italic>Term</elf-text>
<elf-text mark>Marked</elf-text>
<elf-text deleted>Old price</elf-text>
<elf-text inserted>Inserted content</elf-text>`;

const appearanceScript = `// Text is presentation-only: semantic color, size, and decoration are props.
// small/default/large match Element Plus; sm/md/lg remain supported aliases.
// Use decoration only when it communicates meaning, not as a substitute for headings.`;

defineStyle(styles);

const PageTextEx1 = defineHtml(`
  <elf-playground :title=${t("title")} :code=${appearanceCode} :script=${appearanceScript}>
    <span slot="status" class="text-demo-status">${t("status")}</span>
    <div class="text-appearance-grid">
      <article class="text-demo-card text-demo-card-wide">
        <strong>${t("semantics")}</strong>
        <div class="text-demo-row">
          <elf-text>${t("default")}</elf-text>
          <elf-text type="primary">${t("primary")}</elf-text>
          <elf-text type="success">${t("success")}</elf-text>
          <elf-text type="warning">${t("warning")}</elf-text>
          <elf-text type="danger">${t("danger")}</elf-text>
          <elf-text type="info">${t("info")}</elf-text>
        </div>
      </article>
      <article class="text-demo-card">
        <strong>${t("sizes")}</strong>
        <div class="text-demo-column">
          <elf-text size="small">${t("small")}</elf-text>
          <elf-text size="default">${t("medium")}</elf-text>
          <elf-text size="large">${t("large")}</elf-text>
        </div>
      </article>
      <article class="text-demo-card">
        <strong>${t("decoration")}</strong>
        <div class="text-demo-row">
          <elf-text strong>${t("strong")}</elf-text>
          <elf-text italic>${t("italic")}</elf-text>
          <elf-text mark>${t("marked")}</elf-text>
          <elf-text deleted>${t("deleted")}</elf-text>
          <elf-text inserted>${t("inserted")}</elf-text>
        </div>
      </article>
    </div>
  </elf-playground>
`);

export { PageTextEx1 };
