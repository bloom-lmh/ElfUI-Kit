import { defineHtml, defineStyle, useComponents, useComputed, useRef } from "@elfui/core";

import { OverviewCard } from "../../components/Common/OverviewCard";
import { createDocsPicker, createDocsTranslator } from "../docsLocale";
import {
  filterOverviewGroups,
  overviewCatalogGroups,
  type OverviewCatalogGroup,
  type OverviewCatalogItem,
} from "./catalog";
import styles from "./style.scss?inline";

const t = createDocsTranslator({
  kicker: { zh: "组件目录", en: "Component catalog" },
  heading: { zh: "Overview 组件总览", en: "Component overview" },
  description: {
    zh: "以下是 ElfUI Kit 当前提供的组件、Provider 与指令。选择卡片即可查看交互示例、源码和 API。",
    en: "Explore the components, Providers, and directives available in ElfUI Kit. Open a card for interactive examples, source, and API details.",
  },
  searchLabel: { zh: "搜索组件", en: "Search components" },
  searchPlaceholder: { zh: "搜索组件", en: "Search components" },
  emptyTitle: { zh: "没有匹配的组件", en: "No matching components" },
  emptyDescription: {
    zh: "请尝试组件英文名、中文名或分类关键词。",
    en: "Try a component name, translated name, or category keyword.",
  },
  results: { zh: "个结果", en: "results" },
  open: { zh: "打开", en: "Open" },
  documentation: { zh: "文档", en: "documentation" },
});
const pick = createDocsPicker();

interface OverviewItemView extends OverviewCatalogItem {
  label: string;
  ariaLabel: string;
}

interface OverviewGroupView extends Omit<OverviewCatalogGroup, "items"> {
  label: string;
  localizedDescription: string;
  items: readonly OverviewItemView[];
}

const query = useRef("");
const visibleGroups = useComputed((): readonly OverviewGroupView[] =>
  filterOverviewGroups(overviewCatalogGroups, query.value).map((group) => ({
    ...group,
    label: pick(group.name.zh, group.name.en),
    localizedDescription: pick(group.description.zh, group.description.en),
    items: group.items.map((item) => {
      const label = pick(item.name.zh, item.name.en);
      return {
        ...item,
        label,
        ariaLabel: `${t("open")} ${label} ${t("documentation")}`,
      };
    }),
  })),
);

const resultCount = (): number =>
  visibleGroups.value.reduce((total, group) => total + group.items.length, 0);
const onSearch = (event: Event): void => {
  query.set((event.currentTarget as HTMLInputElement).value);
};

useComponents(OverviewCard);
defineStyle(styles);

const PageOverview = defineHtml(`
  <main class="overview">
    <header class="intro">
      <span class="kicker">${t("kicker")}</span>
      <h1><span aria-hidden="true">#</span>${t("heading")}</h1>
      <p>${t("description")}</p>
    </header>

    <div class="search-field">
      <span class="search-icon" aria-hidden="true"></span>
      <label class="sr-only" for="overview-search">${t("searchLabel")}</label>
      <input
        id="overview-search"
        type="search"
        :value=${query.value}
        :placeholder=${t("searchPlaceholder")}
        @input=${onSearch}
      />
      <span class="sr-only" role="status" aria-live="polite">
        ${resultCount()} ${t("results")}
      </span>
    </div>

    <div v-if=${visibleGroups.value.length > 0} class="catalog">
      <section v-for="group in visibleGroups.value" :key="group.id" class="catalog-group">
        <div class="group-heading">
          <div>
            <h2>{{ group.label }} <span>{{ group.items.length }}</span></h2>
            <p>{{ group.localizedDescription }}</p>
          </div>
        </div>

        <div class="card-grid">
          <elf-overview-card
            v-for="item in group.items"
            :key="item.to"
            :title="item.label"
            :href="item.to"
            :badge="item.badge"
            :ariaLabel.prop="item.ariaLabel"
          >
            <span
              class="catalog-preview"
              :data-preview="item.preview"
              :data-detail="item.previewDetail"
              :data-tone="group.tone"
              aria-hidden="true"
            >
              <i class="preview-main"></i>
              <i class="preview-secondary"></i>
              <i class="preview-tertiary"></i>
            </span>
          </elf-overview-card>
        </div>
      </section>
    </div>

    <section v-else class="empty-state" role="status">
      <span aria-hidden="true">?</span>
      <h2>${t("emptyTitle")}</h2>
      <p>${t("emptyDescription")}</p>
    </section>
  </main>
`);

export { PageOverview };
