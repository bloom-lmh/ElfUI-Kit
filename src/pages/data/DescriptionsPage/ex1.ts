import { defineHtml, defineStyle, useRef } from "@elfui/core";

import { createDocsTranslator } from "../../docsLocale";
import styles from "./demo.scss?inline";

interface ReleaseDetail {
  id: string;
  term: string;
  content: string | null;
  columns?: number;
}

const t = createDocsTranslator({
  title: { zh: "响应式列与内容边界", en: "Responsive columns and content boundaries" },
  release: { zh: "发布详情", en: "Release details" },
  wide: { zh: "宽屏", en: "Wide" },
  compact: { zh: "窄屏", en: "Compact" },
  currentWide: { zh: "当前 4 列宽屏", en: "Four-column wide view" },
  currentCompact: { zh: "当前窄屏自动单列", en: "Compact view collapses to one column" },
  version: { zh: "版本", en: "Version" },
  owner: { zh: "负责人", en: "Owner" },
  environment: { zh: "环境", en: "Environment" },
  window: { zh: "发布窗口", en: "Release window" },
  endpoint: { zh: "接口地址", en: "Endpoint" },
  rollback: { zh: "回滚说明", en: "Rollback notes" },
  production: { zh: "生产环境", en: "Production" },
  notProvided: { zh: "暂未填写", en: "Not provided" },
  hint: {
    zh: "组件根据自身宽度在 4 / 2 / 1 列间切换；长链接安全换行，null、undefined 与空字符串统一显示空值占位。",
    en: "The component responds to its own width across 4 / 2 / 1 columns; long links wrap safely and nullish or empty values share one placeholder."
  }
});

const fieldMap = {
  key: "id",
  label: "term",
  value: "content",
  span: "columns"
};

// State
const compact = useRef(false);

// Derived state
const releaseDetails = (): ReleaseDetail[] => [
  { id: "version", term: t("version"), content: "v0.0.2-beta.1" },
  { id: "owner", term: t("owner"), content: "Lin Zhou" },
  { id: "environment", term: t("environment"), content: t("production") },
  { id: "window", term: t("window"), content: "2026-07-26 22:00 UTC+8" },
  {
    id: "endpoint",
    term: t("endpoint"),
    content: "https://api.elfui.dev/v1/projects/component-library/releases/current",
    columns: 2
  },
  { id: "rollback", term: t("rollback"), content: null, columns: 2 }
];

const frameClass = (): string =>
  `descriptions-responsive-frame${compact.value ? " is-compact" : ""}`;
const statusText = (): string => (compact.value ? t("currentCompact") : t("currentWide"));

// Methods
const onStatusAction = (event: Event): void => {
  const target = event
    .composedPath()
    .find(
      (entry): entry is HTMLElement =>
        entry instanceof HTMLElement && Boolean(entry.dataset.width)
    );
  if (!target) return;
  compact.set(target.dataset.width === "compact");
};

const responsiveCode = `<elf-descriptions
  title="Release details"
  :items.prop=\${releaseDetails}
  :props.prop=\${fieldMap}
  :column=\${4}
  responsive
  empty-text="Not provided"
/>`;

const responsiveScript = `const fieldMap = {
  key: "id",
  label: "term",
  value: "content",
  span: "columns"
};

const releaseDetails = [
  { id: "version", term: "Version", content: "v0.0.2-beta.1" },
  { id: "endpoint", term: "Endpoint", content: longUrl, columns: 2 },
  { id: "rollback", term: "Rollback notes", content: null, columns: 2 }
];

// responsive uses the component width: >= 900px / 560-899px / < 560px.
// Empty values preserve 0 and false, while null, undefined, and "" use empty-text.`;

defineStyle(styles);

const PageDescriptionsEx1 = defineHtml(`
  <elf-playground :title=${t("title")} :code=${responsiveCode} :script=${responsiveScript}>
    <div
      slot="status"
      class="descriptions-demo-actions"
      @click=${onStatusAction}
    >
      <span role="status" aria-live="polite">${statusText()}</span>
      <button type="button" data-width="wide" :aria-pressed=${!compact.value}>
        ${t("wide")}
      </button>
      <button type="button" data-width="compact" :aria-pressed=${compact.value}>
        ${t("compact")}
      </button>
    </div>

    <div :class=${frameClass()}>
      <elf-descriptions
        :title=${t("release")}
        extra="2026-07-26 · 20:45"
        :items.prop=${releaseDetails()}
        :props.prop=${fieldMap}
        :column=${4}
        responsive
        :empty-text=${t("notProvided")}
      ></elf-descriptions>
      <p class="descriptions-demo-hint">${t("hint")}</p>
    </div>
  </elf-playground>
`);

export { PageDescriptionsEx1 };
