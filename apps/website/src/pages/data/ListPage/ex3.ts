import { defineHtml, defineStyle, onMounted, useRef } from "@elfui/core";

import { createDocsTranslator } from "../../docsLocale";
import styles from "./demo.scss?inline";

type AsyncState = "ready" | "loading" | "empty" | "error";

interface QueueItem {
  id: number;
  title: string;
  meta: string;
}

const t = createDocsTranslator({
  title: { zh: "加载、空状态与失败恢复", en: "Loading, empty, and recovery" },
  ready: { zh: "已加载 3 条", en: "3 items loaded" },
  loading: { zh: "正在同步任务…", en: "Syncing tasks…" },
  empty: { zh: "当前没有待处理任务", en: "No pending tasks" },
  error: { zh: "同步失败，请重试", en: "Sync failed. Try again." },
  load: { zh: "重新加载", en: "Reload" },
  showEmpty: { zh: "显示空状态", en: "Show empty" },
  fail: { zh: "模拟失败", en: "Simulate failure" },
  retry: { zh: "重试", en: "Retry" },
  taskA: { zh: "检查发布清单", en: "Review release checklist" },
  taskB: { zh: "更新迁移文档", en: "Update migration guide" },
  taskC: { zh: "确认无障碍路径", en: "Verify accessibility path" },
  now: { zh: "刚刚", en: "Just now" },
  hour: { zh: "1 小时前", en: "1 hour ago" },
  yesterday: { zh: "昨天", en: "Yesterday" },
});

const initialItems = (): QueueItem[] => [
  { id: 1, title: t("taskA"), meta: t("now") },
  { id: 2, title: t("taskB"), meta: t("hour") },
  { id: 3, title: t("taskC"), meta: t("yesterday") },
];

// State
const state = useRef<AsyncState>("ready");
const rows = useRef<QueueItem[]>(initialItems());
let timer: number | undefined;

// Derived state
const statusText = (): string => t(state.value);

// Methods
const clearTimer = (): void => {
  if (timer) window.clearTimeout(timer);
  timer = undefined;
};
const load = (): void => {
  clearTimer();
  state.set("loading");
  timer = window.setTimeout(() => {
    rows.set(initialItems());
    state.set("ready");
    timer = undefined;
  }, 2_400);
};
const showEmpty = (): void => {
  clearTimer();
  rows.set([]);
  state.set("empty");
};
const showError = (): void => {
  clearTimer();
  rows.set([]);
  state.set("error");
};

onMounted(() => clearTimer);

const code = `<elf-list
  :items.prop="rows"
  :renderItem.prop="renderRow"
  :loading="state === 'loading'"
  loading-text="正在同步任务…"
  empty-text="当前没有待处理任务"
  bordered
>
  <span v-if="state === 'error'" slot="empty">
    同步失败，请重试
  </span>
</elf-list>`;

const script = `const state = useRef("ready");
const rows = useRef(initialItems);

const load = async () => {
  state.set("loading");
  try {
    rows.set(await fetchTasks());
    state.set(rows.value.length ? "ready" : "empty");
  } catch {
    rows.set([]);
    state.set("error");
  }
};`;

defineStyle(styles);

const PageListEx3 = defineHtml(`
  <elf-playground :title=${t("title")} :code=${code} :script=${script}>
    <div slot="status" class="list-demo-actions">
      <span role="status" aria-live="polite">${statusText()}</span>
      <button type="button" @click=${load}>${state.value === "error" ? t("retry") : t("load")}</button>
      <button type="button" @click=${showEmpty}>${t("showEmpty")}</button>
      <button type="button" @click=${showError}>${t("fail")}</button>
    </div>

    <section class="list-state-card">
      <elf-list
        :loading=${state.value === "loading"}
        :loadingText.prop=${t("loading")}
        :emptyText.prop=${state.value === "error" ? t("error") : t("empty")}
        bordered
      >
        <elf-list-item
          v-for="row in rows.value"
          :key="row.id"
          :title="row.title"
          :subtitle="row.meta"
        >
          <span slot="leading" class="list-task-index">0{{ row.id }}</span>
          <span slot="trailing" class="list-task-status" aria-hidden="true">●</span>
        </elf-list-item>
      </elf-list>
    </section>
  </elf-playground>
`);

export { PageListEx3 };
