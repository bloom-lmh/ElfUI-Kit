import { defineHtml, defineStyle, useRef } from "@elfui/core";

import { createDocsTranslator } from "../../docsLocale";
import styles from "./demo.scss?inline";

const t = createDocsTranslator({
  title: { zh: "搜索无结果", en: "No search results" },
  query: { zh: "可观测性", en: "observability" },
  searching: { zh: "0 个匹配结果", en: "0 matching results" },
  restored: { zh: "已恢复 3 个项目", en: "3 projects restored" },
  rerun: { zh: "再次搜索", en: "Run search again" },
  searchLabel: { zh: "当前搜索", en: "Current search" },
  description: {
    zh: "没有找到匹配“可观测性”的项目，请调整关键词或重置搜索。",
    en: "No projects match “observability”. Try another term or reset the search."
  },
  reset: { zh: "重置搜索", en: "Reset search" },
  designSystem: { zh: "设计系统升级", en: "Design system upgrade" },
  commandCenter: { zh: "运营指挥台", en: "Operations command center" },
  accessReview: { zh: "权限审计", en: "Access review" }
});

// State
const noResults = useRef(true);

// Derived state
const statusText = (): string => noResults.value ? t("searching") : t("restored");

// Methods
const resetSearch = (): void => noResults.set(false);
const rerunSearch = (): void => noResults.set(true);

const searchCode = `<elf-empty
  v-if=\${noResults}
  size="compact"
  image-size="80"
  description="No projects match “observability”."
>
  <span slot="image" aria-hidden="true">⌕</span>
  <elf-button size="sm" @click=\${resetSearch}>Reset search</elf-button>
</elf-empty>

<project-list v-else :items=\${projects} />`;

const searchScript = `const noResults = useRef(true);

const resetSearch = () => {
  query.set("");
  noResults.set(false);
};

const rerunSearch = () => {
  query.set("observability");
  noResults.set(true);
};`;

defineStyle(styles);

const PageEmptyEx2 = defineHtml(`
  <elf-playground :title=${t("title")} :code=${searchCode} :script=${searchScript}>
    <div slot="status" class="empty-demo-actions">
      <span role="status" aria-live="polite">${statusText()}</span>
      <button type="button" class="empty-demo-command" @click=${rerunSearch}>
        ${t("rerun")}
      </button>
    </div>
    <section class="empty-search-panel" :aria-label=${t("title")}>
      <div class="empty-search-query">
        <span aria-hidden="true">⌕</span>
        <span>${t("searchLabel")}</span>
        <strong>${noResults.value ? t("query") : "—"}</strong>
      </div>
      <elf-empty
        v-if=${noResults.value}
        size="compact"
        image-size="80"
        :description=${t("description")}
      >
        <span slot="image" class="empty-search-icon" aria-hidden="true">⌕</span>
        <elf-button size="sm" type="primary" @click=${resetSearch}>
          ${t("reset")}
        </elf-button>
      </elf-empty>
      <div v-else class="empty-result-list">
        <article><span>01</span><strong>${t("designSystem")}</strong></article>
        <article><span>02</span><strong>${t("commandCenter")}</strong></article>
        <article><span>03</span><strong>${t("accessReview")}</strong></article>
      </div>
    </section>
  </elf-playground>
`);

export { PageEmptyEx2 };
