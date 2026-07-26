import { defineHtml, defineStyle, useRef } from "@elfui/core";

import { createDocsTranslator } from "../../docsLocale";
import styles from "./demo.scss?inline";

const t = createDocsTranslator({
  title: { zh: "截断与阅读边界", en: "Truncation and reading boundaries" },
  widthControl: { zh: "内容宽度", en: "Content width" },
  compact: { zh: "紧凑", en: "Compact" },
  wide: { zh: "宽版", en: "Wide" },
  single: { zh: "单行省略", en: "Single-line ellipsis" },
  multiple: { zh: "两行截断", en: "Two-line clamp" },
  singleLong: {
    zh: "发布窗口已调整到周五下午，请相关成员提前完成所有检查并确认回滚方案",
    en: "The release window moved to Friday afternoon; finish every check and confirm the rollback plan in advance"
  },
  multipleLong: {
    zh: "这个说明包含足够长的内容，用来验证多行文本会稳定限制在两行。切换容器宽度后，内容重新排版，但不会改变页面卡片高度或破坏后续布局。",
    en: "This description is intentionally long enough to verify a stable two-line clamp. Switching the container width reflows the copy without breaking the card height or the surrounding layout."
  },
  accessible: {
    zh: "完整内容仍在 DOM 中，单行案例额外提供 title。",
    en: "The full content remains in the DOM, and the single-line example also provides a title."
  }
});

// State
const compact = useRef(true);

// Derived state
const clampClass = (): Record<string, boolean> => ({
  "text-clamp-card": true,
  "is-compact": compact.value,
  "is-wide": !compact.value
});

// Methods
const showCompact = (): void => compact.set(true);
const showWide = (): void => compact.set(false);

const clampCode = `<section class="content-card">
  <elf-text truncated title="Full release status">
    A long release status that stays on one line
  </elf-text>

  <elf-text tag="p" line-clamp="2">
    A longer paragraph that remains limited to two readable lines.
  </elf-text>
</section>`;

const clampScript = `const compact = useRef(true);

const cardClass = () => ({
  "content-card": true,
  "is-compact": compact.value
});

// truncated is for one line; line-clamp controls multi-line content.
// Keep the full slot text and add title or Tooltip when discovery is required.`;

defineStyle(styles);

const PageTextEx3 = defineHtml(`
  <elf-playground :title=${t("title")} :code=${clampCode} :script=${clampScript}>
    <div slot="status" class="text-width-switch" role="group" :aria-label=${t("widthControl")}>
      <button type="button" :class=${{ active: compact.value }} :aria-pressed=${String(compact.value)} @click=${showCompact}>
        ${t("compact")} · 280
      </button>
      <button type="button" :class=${{ active: !compact.value }} :aria-pressed=${String(!compact.value)} @click=${showWide}>
        ${t("wide")} · 440
      </button>
    </div>
    <section :class=${clampClass()}>
      <div class="text-clamp-section">
        <span class="text-clamp-label">${t("single")}</span>
        <elf-text class="text-single-line" truncated :title=${t("singleLong")}>
          ${t("singleLong")}
        </elf-text>
      </div>
      <div class="text-clamp-section">
        <span class="text-clamp-label">${t("multiple")}</span>
        <elf-text class="text-multiple-line" tag="p" line-clamp="2">
          ${t("multipleLong")}
        </elf-text>
      </div>
      <elf-text class="text-accessibility-note" size="small" type="info">${t("accessible")}</elf-text>
    </section>
  </elf-playground>
`);

export { PageTextEx3 };
