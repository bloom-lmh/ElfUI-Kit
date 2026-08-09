import { defineHtml, useRef, useTemplateRef } from "@elfui/core";
import type { VirtualListExpose } from "@elfui/kit";
import { createDocsPicker, createDocsTranslator } from "../../docsLocale";

interface ActivityItem {
  id: number;
  title: string;
  detail: string;
}

const pick = createDocsPicker();
const t = createDocsTranslator({
  section: { zh: "动态高度与数据追加", en: "Dynamic height and data append" },
  title: { zh: "活动信息流", en: "Activity feed" },
  locating: { zh: "定位 #180", en: "Locate #180" },
  append: { zh: "追加", en: "Append" },
  emptyAction: { zh: "空态", en: "Empty" },
  navigation: { zh: "↑↓/Home/End 导航", en: "↑↓/Home/End navigation" },
  loading: { zh: "正在获取更多动态", en: "Loading more activity" },
  empty: { zh: "暂无活动记录", en: "No activity" },
});

const createItems = (start: number, count: number): ActivityItem[] =>
  Array.from({ length: count }, (_, offset) => {
    const id = start + offset;
    const detail =
      id % 4 === 0
        ? pick(
            "包含跨团队依赖、风险记录、下一步负责人和发布窗口；还需要同步设计、测试及无障碍复核结论，因此会自然占用两到三行内容。",
            "Includes cross-team dependencies, risks, owners, release windows, design, testing, and accessibility notes.",
          )
        : id % 3 === 0
          ? pick(
              "已完成接口联调，等待设计与无障碍复核。",
              "Integration is complete; design and accessibility reviews are pending.",
            )
          : pick("状态正常。", "Status is healthy.");
    return {
      id,
      title: pick(
        `动态记录 #${String(id).padStart(3, "0")}`,
        `Activity #${String(id).padStart(3, "0")}`,
      ),
      detail,
    };
  });

const listRef = useTemplateRef<HTMLElement & VirtualListExpose>("list");
const items = useRef<ActivityItem[]>(createItems(1, 240));
const loading = useRef(false);
const activity = useRef(pick("240 条 · 动态测量", "240 items · dynamic measurement"));

const renderItem = (item: unknown): Node => {
  const row = item as ActivityItem;
  const container = document.createElement("div");
  container.style.cssText = "display:grid;gap:4px;width:100%;padding-block:4px";
  const title = document.createElement("strong");
  title.textContent = row.title;
  const detail = document.createElement("span");
  detail.style.cssText =
    "color:var(--elf-text-secondary);font-size:13px;line-height:1.55;white-space:normal";
  detail.textContent = row.detail;
  container.append(title, detail);
  return container;
};

const appendItems = (): void => {
  if (loading.value) return;
  loading.set(true);
  activity.set(pick("正在追加 30 条…", "Appending 30 items…"));
  setTimeout(() => {
    const start = items.value.length + 1;
    items.set([...items.value, ...createItems(start, 30)]);
    loading.set(false);
    activity.set(
      pick(
        `${items.value.length} 条 · 已保持滚动锚点`,
        `${items.value.length} items · scroll anchor preserved`,
      ),
    );
  }, 420);
};

const locate = (): void => {
  listRef.value?.scrollToKey(180, "smooth", "center");
  activity.set(pick("已定位动态记录 #180", "Located activity #180"));
};

const toggleEmpty = (): void => {
  items.set(items.value.length > 0 ? [] : createItems(1, 240));
  activity.set(
    items.value.length > 0
      ? pick("已恢复 240 条", "Restored 240 items")
      : pick("空状态", "Empty state"),
  );
};

const onStatusAction = (event: Event): void => {
  const action = event
    .composedPath()
    .find(
      (entry): entry is HTMLElement =>
        entry instanceof HTMLElement && Boolean(entry.dataset.action),
    )?.dataset.action;
  if (action === "locate") locate();
  else if (action === "append") appendItems();
  else if (action === "empty") toggleEmpty();
};

const code = `<elf-virtual-list
  ref="list"
  :items.prop="items"
  :renderItem.prop="renderItem"
  :loading="loading"
  :estimatedItemHeight="64"
  height="340"
  dynamic
  bordered
/>`;

const script = `const listRef = useTemplateRef("list");
const items = useRef(createItems(1, 240));
const loading = useRef(false);

const appendItems = async () => {
  loading.set(true);
  const next = await fetchMoreItems();
  items.set([...items.value, ...next]);
  loading.set(false);
};

const locate = () => listRef.value?.scrollToKey(180, "smooth", "center");`;

const PageVirtualListEx3 = defineHtml(`
  <h2>${t("section")}</h2>
  <elf-playground :title=${t("title")} :code=${code} :script=${script}>
    <div slot="status" style="display:inline-flex;align-items:center;gap:6px" @click=${onStatusAction}>
      <span class="demo-state">{{ activity }} · ${t("navigation")}</span>
      <elf-button data-action="locate" size="sm" variant="text">${t("locating")}</elf-button>
      <elf-button data-action="append" size="sm" variant="text">${t("append")}</elf-button>
      <elf-button data-action="empty" size="sm" variant="text">${t("emptyAction")}</elf-button>
    </div>
    <elf-virtual-list
      ref="list"
      style="width:100%;max-width:720px"
      :items.prop=${items}
      :renderItem.prop=${renderItem}
      :loading=${loading}
      :estimatedItemHeight=${64}
      :loadingText.prop=${t("loading")}
      :emptyText.prop=${t("empty")}
      height="340"
      overscan="5"
      dynamic
      bordered
    ></elf-virtual-list>
  </elf-playground>
`);

export { PageVirtualListEx3 };
