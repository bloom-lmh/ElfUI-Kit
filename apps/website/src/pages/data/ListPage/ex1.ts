import { defineHtml, defineStyle, useRef } from "@elfui/core";

import { createDocsTranslator } from "../../docsLocale";
import styles from "./demo.scss?inline";

interface ActivityItem {
  id: string;
  initials: string;
  title: string;
  subtitle: string;
  tone: "blue" | "green" | "amber";
}

const t = createDocsTranslator({
  title: { zh: "分组与操作项", en: "Groups and actions" },
  status: { zh: "最近操作", en: "Last action" },
  none: { zh: "尚未操作", en: "No action yet" },
  today: { zh: "今天", en: "Today" },
  earlier: { zh: "更早", en: "Earlier" },
  open: { zh: "打开", en: "Open" },
  archive: { zh: "归档", en: "Archive" },
  review: { zh: "设计评审", en: "Design review" },
  reviewSub: { zh: "10:30 · 产品会议室", en: "10:30 · Product room" },
  regression: { zh: "回归测试", en: "Regression testing" },
  regressionSub: { zh: "12 个组件等待验证", en: "12 components awaiting verification" },
  release: { zh: "候选版本发布", en: "Release candidate" },
  releaseSub: { zh: "等待最终确认", en: "Awaiting final approval" },
  docs: { zh: "文档更新", en: "Documentation update" },
  docsSub: { zh: "案例预览已生成", en: "Example previews generated" },
});

const todayItems = (): ActivityItem[] => [
  { id: "review", initials: "DR", title: t("review"), subtitle: t("reviewSub"), tone: "blue" },
  {
    id: "regression",
    initials: "QA",
    title: t("regression"),
    subtitle: t("regressionSub"),
    tone: "green",
  },
  { id: "release", initials: "RC", title: t("release"), subtitle: t("releaseSub"), tone: "amber" },
];
const earlierItems = (): ActivityItem[] => [
  { id: "docs", initials: "DX", title: t("docs"), subtitle: t("docsSub"), tone: "blue" },
];

// State
const lastAction = useRef("");

// Methods
const onAction = (event: Event): void => {
  const button = event
    .composedPath()
    .find(
      (entry): entry is HTMLElement =>
        entry instanceof HTMLElement && Boolean(entry.dataset.itemAction),
    );
  if (!button) return;
  lastAction.set(`${button.dataset.itemAction} · ${button.dataset.itemTitle}`);
};

const code = `<section v-for="group in groups" :key="group.label">
  <h3>{{ group.label }}</h3>
  <elf-list bordered>
    <elf-list-item
      v-for="item in group.items"
      :key="item.id"
      :title="item.title"
      :subtitle="item.subtitle"
    >
      <elf-avatar slot="leading">{{ item.initials }}</elf-avatar>
      <button slot="trailing" @click="open(item)">打开</button>
    </elf-list-item>
  </elf-list>
</section>`;

const script = `const groups = [
  { label: "今天", items: todayItems },
  { label: "更早", items: earlierItems }
];

const open = (item) => {
  selectedId.set(item.id);
};`;

defineStyle(styles);

const PageListEx1 = defineHtml(`
  <elf-playground :title=${t("title")} :code=${code} :script=${script}>
    <div slot="status" class="list-demo-actions">
      <span role="status">${t("status")} · ${lastAction.value || t("none")}</span>
    </div>

    <section class="list-group-board" @click=${onAction}>
      <article class="list-group-card">
        <header><span>${t("today")}</span><small>${todayItems().length}</small></header>
        <elf-list divided>
          <elf-list-item
            v-for="item in todayItems()"
            :key="item.id"
            :title="item.title"
            :subtitle="item.subtitle"
          >
            <span slot="leading" class="list-avatar" :data-tone="item.tone">{{ item.initials }}</span>
            <button
              slot="trailing"
              type="button"
              class="list-row-action"
              :data-item-action=${t("open")}
              :data-item-title="item.title"
            >
              ${t("open")}
            </button>
          </elf-list-item>
        </elf-list>
      </article>

      <article class="list-group-card">
        <header><span>${t("earlier")}</span><small>${earlierItems().length}</small></header>
        <elf-list divided>
          <elf-list-item
            v-for="item in earlierItems()"
            :key="item.id"
            :title="item.title"
            :subtitle="item.subtitle"
          >
            <span slot="leading" class="list-avatar" :data-tone="item.tone">{{ item.initials }}</span>
            <button
              slot="trailing"
              type="button"
              class="list-row-action"
              :data-item-action=${t("archive")}
              :data-item-title="item.title"
            >
              ${t("archive")}
            </button>
          </elf-list-item>
        </elf-list>
      </article>
    </section>
  </elf-playground>
`);

export { PageListEx1 };
