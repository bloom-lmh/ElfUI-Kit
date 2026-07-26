import { defineDirective, defineHtml, defineStyle, useRef } from "@elfui/core";

import { infiniteScrollDirective } from "../../../components/Data/InfiniteScroll/directive";
import { createDocsTranslator } from "../../docsLocale";
import styles from "./demo.scss?inline";

const infiniteScroll = defineDirective(infiniteScrollDirective);

const t = createDocsTranslator({
  title: { zh: "指令模式与销毁清理", en: "Directive mode and teardown" },
  mounted: { zh: "容器已挂载", en: "Container mounted" },
  unmounted: { zh: "监听器与待执行任务已清理", en: "Listeners and pending work cleaned up" },
  mount: { zh: "重新挂载", en: "Mount again" },
  unmount: { zh: "卸载容器", en: "Unmount container" },
  loaded: { zh: "已加载", en: "Loaded" },
  hint: {
    zh: "v-infinite-scroll 可直接用于任意滚动容器；卸载时自动移除监听器、观察器和延迟任务。",
    en: "v-infinite-scroll works on any scroll container and removes listeners, observers, and delayed work on teardown."
  },
  activity: { zh: "指令动态", en: "Directive activity" },
  loading: { zh: "正在加载…", en: "Loading…" },
  done: { zh: "没有更多数据", en: "No more data" }
});

// State
const visible = useRef(true);
const items = useRef(Array.from({ length: 7 }, (_, index) => index + 1));
const loading = useRef(false);
const finished = useRef(false);
let generation = 0;

// Derived state
const statusText = (): string => visible.value
  ? `${t("mounted")} · ${t("loaded")} ${items.value.length} / 19`
  : t("unmounted");

// Methods
const loadMore = (): void => {
  if (loading.value || finished.value) return;
  loading.set(true);
  const requestGeneration = generation;
  window.setTimeout(() => {
    if (!visible.value || generation !== requestGeneration) return;
    const count = Math.min(4, 19 - items.value.length);
    items.set([...items.value, ...Array.from({ length: count }, (_, index) => items.value.length + index + 1)]);
    finished.set(items.value.length >= 19);
    loading.set(false);
  }, 320);
};

const toggleMount = (): void => {
  generation += 1;
  visible.set(!visible.value);
  loading.set(false);
  if (visible.value) {
    items.set(Array.from({ length: 7 }, (_, index) => index + 1));
    finished.set(false);
  }
};

const code = `<div
  v-if="visible"
  v-infinite-scroll="loadMore"
  :infiniteScrollDisabled="loading || finished"
  infinite-scroll-distance="24"
  infinite-scroll-delay="160"
  infinite-scroll-immediate="false"
>
  <article v-for="item in items" :key="item">...</article>
</div>`;

const script = `import { defineDirective } from "@elfui/core";
import { infiniteScrollDirective } from "@elfui/kit";

const infiniteScroll = defineDirective(infiniteScrollDirective);
const visible = useRef(true);

// Removing the element automatically runs the directive's
// beforeUnmount hook and cancels pending delayed work.
const toggleMount = () => visible.set(!visible.value);`;

defineStyle(styles);

const PageInfiniteScrollEx3 = defineHtml(`
  <elf-playground :title=${t("title")} :code=${code} :script=${script}>
    <div slot="status" class="infinite-demo-actions">
      <span role="status" aria-live="polite">${statusText()}</span>
      <button type="button" @click=${toggleMount}>
        ${visible.value ? t("unmount") : t("mount")}
      </button>
    </div>

    <section class="infinite-directive-card">
      <p>${t("hint")}</p>
      <div
        v-if=${visible.value}
        v-infinite-scroll=${loadMore}
        :infiniteScrollDisabled=${loading.value || finished.value}
        infinite-scroll-distance="24"
        infinite-scroll-delay="160"
        infinite-scroll-immediate="false"
        class="infinite-directive-viewport"
        tabindex="0"
        :aria-label=${t("title")}
      >
        <article v-for="item in items.value" :key="item">
          <span>{{ String(item).padStart(2, "0") }}</span>
          <strong>${t("activity")} #{{ item }}</strong>
          <small>Directive</small>
        </article>
        <p v-if=${loading.value} class="infinite-feed-message is-loading">
          <span aria-hidden="true"></span>${t("loading")}
        </p>
        <p v-if=${finished.value} class="infinite-feed-message">${t("done")}</p>
      </div>
      <div v-else class="infinite-unmounted-state" role="status">
        <span aria-hidden="true">✓</span>
        <strong>${t("unmounted")}</strong>
      </div>
    </section>
  </elf-playground>
`);

export { PageInfiniteScrollEx3 };
