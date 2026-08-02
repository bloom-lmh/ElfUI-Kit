import { defineHtml, defineStyle, useRef } from "@elfui/core";

import { createDocsTranslator } from "../../docsLocale";
import styles from "./demo.scss?inline";

interface FeedItem {
  id: number;
  title: string;
  summary: string;
  owner: string;
}

const TOTAL_ITEMS = 20;
const PAGE_SIZE = 4;

const t = createDocsTranslator({
  title: { zh: "异步加载、失败恢复与停止", en: "Async loading, recovery, and completion" },
  statusIdle: { zh: "等待滚动", en: "Waiting for scroll" },
  statusLoading: { zh: "正在加载下一页…", en: "Loading the next page…" },
  statusError: { zh: "请求失败，可重试", en: "Request failed. Retry is available." },
  statusDone: { zh: "全部动态已加载", en: "All updates loaded" },
  failNext: { zh: "下次请求失败", en: "Fail next request" },
  retry: { zh: "重试", en: "Retry" },
  reset: { zh: "重置", en: "Reset" },
  feedTitle: { zh: "项目动态", en: "Project updates" },
  feedHint: { zh: "向下滚动请求下一页", en: "Scroll down to request the next page" },
  loading: { zh: "正在同步新的动态…", en: "Synchronizing new updates…" },
  error: {
    zh: "网络暂时不可用，已保留当前内容。",
    en: "The network is unavailable. Existing content is preserved.",
  },
  complete: { zh: "已经到底了，共 20 条", en: "End of feed · 20 updates" },
  update: { zh: "项目更新", en: "Project update" },
  summaryA: {
    zh: "设计稿已同步到团队空间，等待评审反馈。",
    en: "Design files are ready in the team space for review.",
  },
  summaryB: {
    zh: "任务状态和负责人已更新，相关成员会收到通知。",
    en: "Task status and ownership changed; collaborators were notified.",
  },
  ownerA: { zh: "产品协作", en: "Product" },
  ownerB: { zh: "工程进展", en: "Engineering" },
  region: { zh: "项目动态信息流", en: "Project update feed" },
});

const createItems = (start: number, count: number): FeedItem[] =>
  Array.from({ length: count }, (_, offset) => {
    const id = start + offset;
    return {
      id,
      title: `${t("update")} #${String(id).padStart(2, "0")}`,
      summary: id % 2 ? t("summaryA") : t("summaryB"),
      owner: id % 2 ? t("ownerA") : t("ownerB"),
    };
  });

// State
const items = useRef<FeedItem[]>(createItems(1, 8));
const loading = useRef(false);
const error = useRef(false);
const finished = useRef(false);
const failNext = useRef(true);

// Derived state
const progressText = (): string => `${items.value.length} / ${TOTAL_ITEMS}`;
const statusText = (): string => {
  if (finished.value) return t("statusDone");
  if (error.value) return t("statusError");
  if (loading.value) return t("statusLoading");
  return t("statusIdle");
};

// Methods
const loadMore = (): void => {
  if (loading.value || error.value || finished.value) return;
  loading.set(true);
  window.setTimeout(() => {
    if (failNext.value) {
      failNext.set(false);
      loading.set(false);
      error.set(true);
      return;
    }
    const remaining = TOTAL_ITEMS - items.value.length;
    const next = createItems(items.value.length + 1, Math.min(PAGE_SIZE, remaining));
    items.set([...items.value, ...next]);
    loading.set(false);
    finished.set(items.value.length >= TOTAL_ITEMS);
  }, 360);
};

const retry = (): void => {
  error.set(false);
  loadMore();
};

const armFailure = (): void => {
  failNext.set(true);
  error.set(false);
};

const reset = (): void => {
  items.set(createItems(1, 8));
  loading.set(false);
  error.set(false);
  finished.set(false);
  failNext.set(true);
};

const onStatusAction = (event: Event): void => {
  const action = event
    .composedPath()
    .find(
      (entry): entry is HTMLElement =>
        entry instanceof HTMLElement && Boolean(entry.dataset.action),
    )?.dataset.action;
  if (action === "retry") retry();
  else if (action === "fail") armFailure();
  else if (action === "reset") reset();
};

const code = `<elf-infinite-scroll
  height="356px"
  :distance="32"
  :loading="loading"
  :disabled="Boolean(error)"
  :finished="finished"
  immediate
  @load="loadMore"
>
  <article v-for="item in items" :key="item.id">...</article>
  <p v-if="loading">Loading…</p>
  <button v-if="error" @click="retry">Retry</button>
  <p v-if="finished">End of feed</p>
</elf-infinite-scroll>`;

const script = `const items = useRef(createItems(1, 8));
const loading = useRef(false);
const error = useRef(false);
const finished = useRef(false);

const loadMore = async () => {
  if (loading.value || error.value || finished.value) return;
  loading.set(true);
  try {
    const next = await fetchNextPage();
    items.set([...items.value, ...next.items]);
    finished.set(next.done);
  } catch {
    error.set(true);
  } finally {
    loading.set(false);
  }
};

const retry = () => {
  error.set(false);
  loadMore();
};`;

defineStyle(styles);

const PageInfiniteScrollEx1 = defineHtml(`
  <elf-playground :title=${t("title")} :code=${code} :script=${script}>
    <div slot="status" class="infinite-demo-actions" @click=${onStatusAction}>
      <span role="status" aria-live="polite">${statusText()} · ${progressText()}</span>
      <button v-if=${error.value} type="button" data-action="retry">${t("retry")}</button>
      <button v-else-if=${!finished.value} type="button" data-action="fail">${t("failNext")}</button>
      <button type="button" data-action="reset">${t("reset")}</button>
    </div>

    <section class="infinite-feed-card" :aria-label=${t("title")}>
      <header>
        <span>
          <strong>${t("feedTitle")}</strong>
          <small>${t("feedHint")}</small>
        </span>
        <b>${progressText()}</b>
      </header>
      <elf-infinite-scroll
        height="356px"
        :distance=${32}
        :loading=${loading.value}
        :disabled=${error.value}
        :finished=${finished.value}
        :ariaLabel.prop=${t("region")}
        immediate
        @load=${loadMore}
      >
        <article v-for="item in items.value" :key="item.id" class="infinite-feed-row">
          <span class="infinite-feed-index">{{ String(item.id).padStart(2, "0") }}</span>
          <span>
            <strong>{{ item.title }}</strong>
            <small>{{ item.summary }}</small>
          </span>
          <em>{{ item.owner }}</em>
        </article>
        <p v-if=${loading.value} class="infinite-feed-message is-loading">
          <span aria-hidden="true"></span>${t("loading")}
        </p>
        <div v-if=${error.value} class="infinite-feed-error">
          <strong>${t("statusError")}</strong>
          <span>${t("error")}</span>
          <button type="button" @click=${retry}>${t("retry")}</button>
        </div>
        <p v-if=${finished.value} class="infinite-feed-message">${t("complete")}</p>
      </elf-infinite-scroll>
    </section>
  </elf-playground>
`);

export { PageInfiniteScrollEx1 };
