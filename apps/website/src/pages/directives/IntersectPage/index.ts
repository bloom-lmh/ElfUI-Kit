import { defineDirective, defineHtml, defineStyle, useRef } from "@elfui/core";

import { intersectDirective } from "@elfui/kit";
import { createDocsTranslator } from "../../docsLocale";
import demoStyles from "../directive-demo.scss?inline";
import articleStyles from "../../shared/article.scss?inline";

interface FeedItem {
  id: number;
  initials: string;
  title: string;
  text: string;
  meta: string;
}

const t = createDocsTranslator({
  kicker: { zh: "指令", en: "Directive" },
  title: { zh: "交叉观察器", en: "Intersect" },
  description: {
    zh: "在元素进入或离开滚动视口时执行回调；可用于懒加载、曝光统计和按需请求。",
    en: "Run a callback when an element enters or leaves a scroll viewport for lazy loading, exposure tracking, or deferred requests.",
  },
  demo: { zh: "进入视口后触发", en: "Trigger on viewport entry" },
  feed: { zh: "推荐阅读", en: "For you" },
  loading: { zh: "正在加载更多…", en: "Loading more…" },
  more: { zh: "继续滚动，加载更多", en: "Keep scrolling to load more" },
  seen: { zh: "触发次数", en: "Triggers" },
  loaded: { zh: "已加载", en: "Loaded" },
  item1: { zh: "设计 token 基线发布", en: "Design token baseline released" },
  item2: { zh: "Provider 配置合并完成", en: "Provider config merge shipped" },
  item3: { zh: "共享滚动策略落地", en: "Shared scroll strategy landed" },
  item4: { zh: "双语文档同步更新", en: "Bilingual docs updated" },
  bodyA: {
    zh: "组件库本周完成三批 API 对齐与回归验证，全部通过。",
    en: "Three batches of API alignment and regression checks shipped this week.",
  },
  bodyB: {
    zh: "下一阶段重点补齐表单联动与键盘导航覆盖。",
    en: "The next stage focuses on form linkage and keyboard navigation coverage.",
  },
  api: { zh: "API", en: "API" },
  type: { zh: "类型", en: "Type" },
  descriptionLabel: { zh: "说明", en: "Description" },
  handler: {
    zh: "接收观察条目与原生观察器。",
    en: "Receives observer entries and the native observer.",
  },
  once: { zh: "首次进入后自动停止观察。", en: "Stop observing after the first entry." },
  threshold: { zh: "控制可见比例阈值。", en: "Controls the visible-ratio threshold." },
});

const metas = ["设计系统 · 2 小时前", "核心组件 · 昨天", "文档 · 3 天前", "基础设施 · 上周"];

const initials = ["DS", "CP", "SC", "DC"];
const makeItem = (id: number, index: number): FeedItem => ({
  id,
  initials: initials[index % initials.length]!,
  title: index % 2 ? t("item2") : t("item1"),
  text: index % 2 ? t("bodyA") : t("bodyB"),
  meta: metas[index % metas.length]!,
});

const initialItems = Array.from({ length: 8 }, (_, index) => makeItem(index + 1, index));
const moreItems = Array.from({ length: 4 }, (_, index) => makeItem(index + 9, index + 2));
const MAX_ITEMS = 12;

defineStyle(
  articleStyles,
  demoStyles,
  `
  .feed-head {
    position: sticky;
    top: 0;
    z-index: 1;
    padding: 10px 14px;
    border-bottom: 1px solid var(--elf-divider);
    background: color-mix(in srgb, var(--elf-bg-paper) 92%, transparent);
    backdrop-filter: blur(8px);
    color: var(--elf-text-secondary);
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.02em;
    text-transform: uppercase;
  }

  .feed-list {
    display: grid;
    gap: 8px;
    margin: 0;
    padding: 8px;
    list-style: none;
  }

  .feed-item {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    padding: 10px 12px;
    border: 1px solid var(--elf-divider);
    border-radius: var(--elf-radius-sm);
    background: var(--elf-bg-paper);
  }

  .feed-avatar {
    flex: none;
    display: grid;
    place-items: center;
    width: 34px;
    height: 34px;
    border-radius: 10px;
    background: color-mix(in srgb, var(--elf-primary) 12%, transparent);
    color: var(--elf-primary);
    font-size: 12px;
    font-weight: 700;
  }

  .feed-body {
    display: grid;
    gap: 2px;
    min-width: 0;
  }

  .feed-body strong {
    font-size: 13px;
    font-weight: 600;
  }

  .feed-body > span {
    color: var(--elf-text-secondary);
    font-size: 12px;
    line-height: 1.5;
  }

  .feed-body small {
    color: var(--elf-text-disabled);
    font-size: 11px;
  }

  .feed-sentinel {
    display: grid;
    place-items: center;
    min-height: 52px;
    margin: 0 8px 8px;
    border: 1px dashed color-mix(in srgb, var(--elf-primary) 40%, var(--elf-border));
    border-radius: var(--elf-radius-sm);
    background: color-mix(in srgb, var(--elf-primary) 4%, var(--elf-bg-paper));
    color: var(--elf-text-secondary);
    font-size: 12px;
  }
`,
);

const intersect = defineDirective(intersectDirective);
const items = useRef<FeedItem[]>(initialItems);
const loading = useRef(false);
const visibleCount = useRef(0);

const visibleItems = (): FeedItem[] => items.value;
const loadedItems = (): number => items.value.length;

const onIntersect = (entries: readonly IntersectionObserverEntry[]): void => {
  if (!entries.some((entry) => entry.isIntersecting)) return;
  visibleCount.set(visibleCount.value + 1);
  if (loading.value || items.value.length >= MAX_ITEMS) return;
  loading.set(true);
  setTimeout(() => {
    items.set([...items.value, ...moreItems]);
    loading.set(false);
  }, 420);
};

const options = () => ({ handler: onIntersect, once: false, threshold: 0.5 });
const optionRows = () => [
  { name: "handler", type: "(entries, observer) => void", default: "—", desc: t("handler") },
  { name: "once", type: "boolean", default: "false", desc: t("once") },
  { name: "threshold", type: "number | number[]", default: "0", desc: t("threshold") },
];
const code = `<div class="directive-scroll">
  <div class="feed-head">For you</div>
  <ul class="feed-list">
    <li v-for="item in items()" :key="item.id" class="feed-item">
      <span class="feed-avatar">{{ item.initials }}</span>
      <span class="feed-body">
        <strong>{{ item.title }}</strong>
        <span>{{ item.text }}</span>
      </span>
    </li>
  </ul>
  <section v-intersect={ handler: onIntersect, threshold: 0.5 } class="feed-sentinel">
    {{ loading ? "Loading more…" : "Keep scrolling to load more" }}
  </section>
</div>`;
const script = `import { defineDirective, useRef } from "@elfui/core";
import { intersectDirective } from "@elfui/kit";

const intersect = defineDirective(intersectDirective);
const items = useRef(initialItems);
const loading = useRef(false);

const onIntersect = (entries) => {
  if (loading.value || items.value.length >= MAX) return;
  loading.set(true);
  setTimeout(() => {
    items.set([...items.value, ...nextBatch()]);
    loading.set(false);
  }, 400);
};`;

const PageIntersect = defineHtml(`
  <elf-container class="docs-article">
    <elf-docs-hero category="directives" :title=${t("title")} :description=${t("description")}></elf-docs-hero>
    <elf-playground :title=${t("demo")} :code=${code} :script=${script}>
      <span slot="status" class="directive-status">${t("loaded")} {{ loadedItems() }} · ${t("seen")} {{ visibleCount }}</span>
      <div class="directive-scroll">
        <div class="feed-head">${t("feed")}</div>
        <ul class="feed-list">
          <li v-for="item in visibleItems()" :key="item.id" class="feed-item">
            <span class="feed-avatar">{{ item.initials }}</span>
            <span class="feed-body">
              <strong>{{ item.title }}</strong>
              <span>{{ item.text }}</span>
              <small>{{ item.meta }}</small>
            </span>
          </li>
        </ul>
        <section v-intersect=${options()} class="feed-sentinel">
          {{ loading ? t("loading") : t("more") }}
        </section>
      </div>
    </elf-playground>
    <h2>${t("api")}</h2>
    <elf-props-table :title=${t("api")} :rows=${optionRows()} />
  </elf-container>
`);

export { PageIntersect };
