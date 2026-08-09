import { defineHtml, defineStyle, useRef, useTemplateRef } from "@elfui/core";

import type { InfiniteScrollExposes } from "@elfui/kit";
import { createDocsTranslator } from "../../docsLocale";
import styles from "./demo.scss?inline";

type ContainerMode = "internal" | "external" | "window";

interface ContainerItem {
  id: number;
  label: string;
}

const t = createDocsTranslator({
  title: { zh: "内置、外部与窗口滚动", en: "Internal, external, and window scrolling" },
  internal: { zh: "内置视口", en: "Internal" },
  external: { zh: "外部容器", en: "External" },
  window: { zh: "页面窗口", en: "Window" },
  checkWindow: { zh: "检查窗口边界", en: "Check window edge" },
  status: { zh: "已加载", en: "Loaded" },
  hintInternal: { zh: "组件管理自己的滚动视口", en: "The component owns its scroll viewport" },
  hintExternal: {
    zh: "监听祖先容器，不创建第二层滚动",
    en: "Listen to an ancestor without nesting another scroller",
  },
  hintWindow: {
    zh: "继续滚动页面，在组件底部附近加载",
    en: "Keep scrolling the page to load near the document bottom",
  },
  item: { zh: "资料记录", en: "Resource record" },
  region: { zh: "容器策略示例", en: "Container strategy example" },
  loading: { zh: "正在追加记录…", en: "Appending records…" },
});

const createItems = (start: number, count: number): ContainerItem[] =>
  Array.from({ length: count }, (_, offset) => ({
    id: start + offset,
    label: `${t("item")} #${String(start + offset).padStart(2, "0")}`,
  }));

// Template refs and state
const externalViewport = useTemplateRef<HTMLElement>("externalViewport");
const scrollerRef = useTemplateRef<HTMLElement & InfiniteScrollExposes>("scroller");
const mode = useRef<ContainerMode>("internal");
const items = useRef<ContainerItem[]>(createItems(1, 7));
const loading = useRef(false);

// Derived state
const modeLabel = (): string => t(mode.value);
const hintKeys = {
  internal: "hintInternal",
  external: "hintExternal",
  window: "hintWindow",
} as const;
const hint = (): string => t(hintKeys[mode.value]);
const scrollContainer = (): HTMLElement | Window | null => {
  if (mode.value === "window") return typeof window === "undefined" ? null : window;
  if (mode.value === "external") return externalViewport.value;
  return null;
};
const viewportHeight = (): string => (mode.value === "internal" ? "280px" : "auto");

// Methods
const selectMode = (nextMode: ContainerMode): void => {
  if (nextMode === mode.value) return;
  mode.set(nextMode);
  items.set(createItems(1, 7));
  loading.set(false);
};

const loadMore = (): void => {
  if (loading.value || items.value.length >= 15) return;
  loading.set(true);
  window.setTimeout(() => {
    const count = Math.min(4, 15 - items.value.length);
    items.set([...items.value, ...createItems(items.value.length + 1, count)]);
    loading.set(false);
  }, 260);
};

const checkWindow = (): void => scrollerRef.value?.check();

const onModeAction = (event: Event): void => {
  const value = event
    .composedPath()
    .find(
      (entry): entry is HTMLElement => entry instanceof HTMLElement && Boolean(entry.dataset.mode),
    )?.dataset.mode as ContainerMode | undefined;
  if (value) selectMode(value);
};

const code = `<div
  ref="externalViewport"
  :class="{ viewport: mode === 'external' }"
>
  <elf-infinite-scroll
    ref="scroller"
    :height="mode === 'internal' ? '280px' : 'auto'"
    :container.prop="scrollContainer()"
    :loading="loading"
    :finished="items.length >= 15"
    @load="loadMore"
  >
    ...
  </elf-infinite-scroll>
</div>`;

const script = `const externalViewport = useTemplateRef("externalViewport");
const scrollerRef = useTemplateRef("scroller");
const mode = useRef("internal");

const scrollContainer = () => {
  if (mode.value === "window") return window;
  if (mode.value === "external") return externalViewport.value;
  return null;
};

// Useful when content changes without a scroll event.
const checkWindow = () => scrollerRef.value?.check();`;

defineStyle(styles);

const PageInfiniteScrollEx2 = defineHtml(`
  <elf-playground :title=${t("title")} :code=${code} :script=${script}>
    <div slot="status" class="infinite-demo-actions" @click=${onModeAction}>
      <span role="status">${modeLabel()} · ${t("status")} ${items.value.length} / 15</span>
      <button
        v-for="option in ['internal', 'external', 'window']"
        :key="option"
        type="button"
        :data-mode="option"
        :aria-pressed="String(mode.value === option)"
      >
        {{ t(option) }}
      </button>
      <button
        v-if=${mode.value === "window"}
        type="button"
        @click=${checkWindow}
      >
        ${t("checkWindow")}
      </button>
    </div>

    <section class="infinite-container-card" :data-mode=${mode.value}>
      <div class="infinite-container-heading">
        <span class="infinite-container-icon" aria-hidden="true">
          ${mode.value === "window" ? "↕" : mode.value === "external" ? "⇲" : "▣"}
        </span>
        <span>
          <strong>${modeLabel()}</strong>
          <small>${hint()}</small>
        </span>
      </div>
      <div
        ref="externalViewport"
        class="infinite-external-viewport"
        :class=${{ "is-active": mode.value === "external" }}
      >
        <elf-infinite-scroll
          ref="scroller"
          :height=${viewportHeight()}
          :container.prop=${scrollContainer()}
          :loading=${loading.value}
          :finished=${items.value.length >= 15}
          :ariaLabel.prop=${t("region")}
          :immediate=${mode.value !== "window"}
          :distance=${48}
          @load=${loadMore}
        >
          <div class="infinite-resource-grid">
            <article v-for="item in items.value" :key="item.id">
              <span>{{ String(item.id).padStart(2, "0") }}</span>
              <strong>{{ item.label }}</strong>
              <small>ELF / DATA / {{ item.id }}</small>
            </article>
          </div>
          <p v-if=${loading.value} class="infinite-feed-message is-loading">
            <span aria-hidden="true"></span>${t("loading")}
          </p>
        </elf-infinite-scroll>
      </div>
    </section>
  </elf-playground>
`);

export { PageInfiniteScrollEx2 };
