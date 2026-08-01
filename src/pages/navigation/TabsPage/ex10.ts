import { defineHtml, defineStyle, useRef } from "@elfui/core";
import { createDocsTranslator } from "../../docsLocale";
import styles from "./demo.scss?inline";

type SortableValue = "overview" | "tasks" | "release" | "audit";

const activeLong = useRef("five");
const activeFixed = useRef("alpha");
const activeGrow = useRef("starter");
const activeSortable = useRef("overview");
const sortableOrder = useRef<SortableValue[]>(["overview", "tasks", "release", "audit"]);
const sortStatus = useRef("");
const t = createDocsTranslator({
  heading: { zh: "标签变体", en: "Tab variants" },
  current: { zh: "当前", en: "Current" },
  centered: { zh: "激活项居中与翻页按钮", en: "Centered active tab and pagination controls" },
  fixed: { zh: "固定标签宽度", en: "Fixed tab widths" },
  grow: { zh: "扩展卡片标签", en: "Grow card tabs" },
  sortable: { zh: "拖动排序与完整控制插槽", en: "Drag sorting and full control slots" },
  sortableHint: {
    zh: "拖动标签调整顺序；两侧按钮由完整控制插槽提供。",
    en: "Drag tabs to reorder them; the side buttons come from full control slots.",
  },
  sortableReady: { zh: "拖动标签可调整顺序", en: "Drag tabs to reorder" },
  overview: { zh: "概览", en: "Overview" },
  tasks: { zh: "任务", en: "Tasks" },
  release: { zh: "发布", en: "Release" },
  audit: { zh: "审计", en: "Audit" },
  previous: { zh: "上一个标签", en: "Previous tab" },
  next: { zh: "下一个标签", en: "Next tab" },
  option: { zh: "选项", en: "Option" },
  starter: { zh: "开胃菜", en: "Starters" },
  main: { zh: "主菜", en: "Mains" },
  dessert: { zh: "甜点", en: "Desserts" },
  drink: { zh: "饮品", en: "Drinks" },
  starterContent: {
    zh: "轻食、沙拉与当季前菜。",
    en: "Light dishes, salads, and seasonal starters.",
  },
  mainContent: { zh: "本季主菜和厨师推荐。", en: "Seasonal mains and chef recommendations." },
  dessertContent: { zh: "甜点、咖啡与茶饮。", en: "Desserts, coffee, and tea." },
  drinkContent: { zh: "无酒精饮品和特调。", en: "Alcohol-free drinks and signatures." },
});

const longItems = () =>
  Array.from({ length: 9 }, (_, index) => ({
    label: `${t("option")} ${index + 1}`,
    value: ["one", "two", "three", "four", "five", "six", "seven", "eight", "nine"][index],
  }));
const fixedItems = () => [
  { label: `${t("option")} 1`, value: "alpha" },
  { label: `${t("option")} 2`, value: "beta" },
];
const growItems = () => [
  { label: t("starter"), value: "starter", content: t("starterContent") },
  { label: t("main"), value: "main", content: t("mainContent") },
  { label: t("dessert"), value: "dessert", content: t("dessertContent") },
  { label: t("drink"), value: "drink", content: t("drinkContent") },
];
const updateLong = (event: CustomEvent): void => activeLong.set(String(event.detail || ""));
const updateFixed = (event: CustomEvent): void => activeFixed.set(String(event.detail || ""));
const updateGrow = (event: CustomEvent): void => activeGrow.set(String(event.detail || ""));
const updateSortable = (event: CustomEvent): void => activeSortable.set(String(event.detail || ""));
const sortableItems = () => sortableOrder.value.map((value) => ({ label: t(value), value }));
const updateSortableItems = (event: CustomEvent): void => {
  const items = Array.isArray(event.detail) ? event.detail : [];
  const values = items
    .map((item) => String(item.value))
    .filter(
      (value): value is SortableValue =>
        value === "overview" || value === "tasks" || value === "release" || value === "audit",
    );
  if (values.length === sortableOrder.value.length) sortableOrder.set(values);
};
const onReorder = (event: CustomEvent): void => {
  const detail = event.detail as { from: number; to: number };
  sortStatus.set(`${detail.from + 1} → ${detail.to + 1}`);
};
const activeLongStatus = (): string => `${t("current")}: ${activeLong.value}`;
const activeFixedStatus = (): string => `${t("current")}: ${activeFixed.value}`;
const activeGrowStatus = (): string => `${t("current")}: ${activeGrow.value}`;
const sortableStatus = (): string => sortStatus.value || t("sortableReady");

const codeLong = `<elf-tabs center-active show-arrows :items.prop=\${items} :modelValue.prop=\${active.value} />`;
const codeFixed = `<elf-tabs fixed-tabs :items.prop=\${items} :modelValue.prop=\${active.value} />`;
const codeGrow = `<elf-tabs grow type="card" show-panels :items.prop=\${items} :modelValue.prop=\${active.value} />`;
const codeSortable = (): string => `<elf-tabs
  draggable
  show-arrows
  :items.prop=\${items}
  :modelValue.prop=\${active}
  @update:modelValue=\${onUpdate}
  @update:items=\${onItemsUpdate}
  @tab-reorder=\${onReorder}
>
  <button slot="prev-control" aria-label="${t("previous")}">←</button>
  <button slot="next-control" aria-label="${t("next")}">→</button>
</elf-tabs>`;
const longScript = (): string => `const active = useRef("five");
const items = [
  { label: "${t("option")} 1", value: "one" },
  { label: "${t("option")} 2", value: "two" },
  { label: "${t("option")} 3", value: "three" }
];

const onUpdate = (event) => active.set(event.detail);`;
const fixedScript = (): string => `const active = useRef("alpha");
const items = [
  { label: "${t("option")} 1", value: "alpha" },
  { label: "${t("option")} 2", value: "beta" }
];

const onUpdate = (event) => active.set(event.detail);`;
const growScript = (): string => `const active = useRef("starter");
const items = [
  { label: "${t("starter")}", value: "starter", content: "${t("starterContent")}" },
  { label: "${t("main")}", value: "main", content: "${t("mainContent")}" },
  { label: "${t("dessert")}", value: "dessert", content: "${t("dessertContent")}" },
  { label: "${t("drink")}", value: "drink", content: "${t("drinkContent")}" }
];

const onUpdate = (event) => active.set(event.detail);`;
const sortableScript = (): string => `const active = useRef("overview");
const items = useRef([
  { label: "${t("overview")}", value: "overview" },
  { label: "${t("tasks")}", value: "tasks" },
  { label: "${t("release")}", value: "release" }
]);

const onUpdate = (event) => active.set(event.detail);
const onItemsUpdate = (event) => items.set(event.detail);
const onReorder = (event) => {
  console.log(event.detail.from, event.detail.to, event.detail.value);
};`;

defineStyle(styles);

const PageTabsEx10 = defineHtml(`
  <h2>{{ t("heading") }}</h2>
  <elf-playground :title=${t("centered")} :code=${codeLong} :script=${longScript()}>
    <span slot="status" role="status" aria-live="polite">${activeLongStatus()}</span>
    <div class="tabs-demo-stage">
      <div class="tabs-variant-demo">
        <elf-tabs
          :key=${t("centered")}
          center-active
          show-arrows
          :items.prop=${longItems()}
          :modelValue.prop=${activeLong.value}
          @update:modelValue=${updateLong}
        ></elf-tabs>
      </div>
    </div>
  </elf-playground>
  <elf-playground :title=${t("fixed")} :code=${codeFixed} :script=${fixedScript()}>
    <span slot="status" role="status" aria-live="polite">${activeFixedStatus()}</span>
    <div class="tabs-demo-stage">
      <div class="tabs-variant-demo">
        <elf-tabs
          :key=${t("fixed")}
          fixed-tabs
          :items.prop=${fixedItems()}
          :modelValue.prop=${activeFixed.value}
          @update:modelValue=${updateFixed}
        ></elf-tabs>
      </div>
    </div>
  </elf-playground>
  <elf-playground :title=${t("grow")} :code=${codeGrow} :script=${growScript()}>
    <span slot="status" role="status" aria-live="polite">${activeGrowStatus()}</span>
    <div class="tabs-demo-stage">
      <div class="tabs-variant-demo">
        <elf-tabs
          :key=${t("grow")}
          grow
          type="card"
          show-panels
          :items.prop=${growItems()}
          :modelValue.prop=${activeGrow.value}
          @update:modelValue=${updateGrow}
        ></elf-tabs>
      </div>
    </div>
  </elf-playground>
  <elf-playground :title=${t("sortable")} :code=${codeSortable()} :script=${sortableScript()}>
    <span slot="status" role="status" aria-live="polite">${sortableStatus()}</span>
    <div class="tabs-demo-stage">
      <div class="tabs-variant-demo tabs-sortable-demo">
        <elf-tabs
          :key=${t("sortable")}
          draggable
          show-arrows
          :items.prop=${sortableItems()}
          :modelValue.prop=${activeSortable.value}
          @update:modelValue=${updateSortable}
          @update:items=${updateSortableItems}
          @tab-reorder=${onReorder}
        >
          <button slot="prev-control" class="tabs-control-button" type="button" :aria-label=${t("previous")}>←</button>
          <button slot="next-control" class="tabs-control-button" type="button" :aria-label=${t("next")}>→</button>
        </elf-tabs>
        <p class="tabs-sortable-hint">${t("sortableHint")}</p>
      </div>
    </div>
  </elf-playground>
`);

export { PageTabsEx10 };
