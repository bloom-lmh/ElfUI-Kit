import { defineHtml, defineStyle, useRef } from "@elfui/core";

import { createDocsTranslator } from "../../docsLocale";
import styles from "./demo.scss?inline";

interface DynamicPanel {
  id: number;
  name: string;
  titleKey: "brief" | "timeline" | "delivery" | "extra";
  contentKey: "briefBody" | "timelineBody" | "deliveryBody" | "extraBody";
}

const INITIAL_PANELS: DynamicPanel[] = [
  { id: 1, name: "brief", titleKey: "brief", contentKey: "briefBody" },
  { id: 2, name: "timeline", titleKey: "timeline", contentKey: "timelineBody" },
  { id: 3, name: "delivery", titleKey: "delivery", contentKey: "deliveryBody" },
];

const t = createDocsTranslator({
  title: { zh: "动态面板与键盘导航", en: "Dynamic panels and keyboard navigation" },
  sections: { zh: "个面板", en: "panels" },
  active: { zh: "已展开", en: "open" },
  add: { zh: "新增面板", en: "Add panel" },
  remove: { zh: "移除末项", en: "Remove last" },
  brief: { zh: "需求摘要", en: "Project brief" },
  briefBody: {
    zh: "把目标、约束和验收标准放在同一处。",
    en: "Keep goals, constraints, and acceptance criteria together.",
  },
  timeline: { zh: "时间安排", en: "Timeline" },
  timelineBody: {
    zh: "使用里程碑协调设计、研发和发布。",
    en: "Coordinate design, engineering, and release with milestones.",
  },
  delivery: { zh: "交付检查", en: "Delivery checklist" },
  deliveryBody: {
    zh: "发布前确认测试、文档和回滚方案。",
    en: "Confirm tests, documentation, and rollback plans before release.",
  },
  extra: { zh: "补充面板", en: "Additional panel" },
  extraBody: {
    zh: "动态新增的内容仍参与受控状态和键盘顺序。",
    en: "Dynamically added content stays in controlled state and keyboard order.",
  },
  hint: {
    zh: "聚焦标题后使用 ↑ ↓、Home、End；方向键会循环并跳过禁用项。",
    en: "Focus a header, then use ↑ ↓, Home, or End; navigation wraps and skips disabled items.",
  },
});

// State
const dynamicPanels = useRef<DynamicPanel[]>(INITIAL_PANELS);
const dynamicActive = useRef<string[]>(["brief"]);
const nextId = useRef(4);

// Derived state
const renderedPanels = () =>
  dynamicPanels.value.map((panel) => ({
    name: panel.name,
    title: panel.titleKey === "extra" ? `${t("extra")} ${panel.id}` : t(panel.titleKey),
    content: t(panel.contentKey),
  }));

const dynamicStatus = (): string =>
  `${dynamicPanels.value.length} ${t("sections")} · ${t("active")} ${dynamicActive.value.length}`;

// Methods
const onDynamicUpdate = (event: CustomEvent<string[]>): void => {
  dynamicActive.set(Array.isArray(event.detail) ? event.detail.map(String) : []);
};

const addPanel = (): void => {
  if (dynamicPanels.value.length >= 6) return;
  const id = nextId.value;
  dynamicPanels.set([
    ...dynamicPanels.value,
    {
      id,
      name: `extra-${id}`,
      titleKey: "extra",
      contentKey: "extraBody",
    },
  ]);
  nextId.set(id + 1);
};

const removePanel = (): void => {
  if (dynamicPanels.value.length <= 2) return;
  const removed = dynamicPanels.value[dynamicPanels.value.length - 1];
  dynamicPanels.set(dynamicPanels.value.slice(0, -1));
  if (removed) {
    dynamicActive.set(dynamicActive.value.filter((name) => name !== removed.name));
  }
};

const onStatusAction = (event: Event): void => {
  const action = event
    .composedPath()
    .find(
      (entry): entry is HTMLElement =>
        entry instanceof HTMLElement && Boolean(entry.dataset.action),
    )?.dataset.action;
  if (action === "add") addPanel();
  if (action === "remove") removePanel();
};

const dynamicCode = `<elf-collapse
  :items.prop=\${panels}
  :modelValue.prop=\${activeNames}
  @update:modelValue=\${onUpdate}
/>`;

const dynamicScript = `const panels = useRef(initialPanels);
const activeNames = useRef(["brief"]);

const onUpdate = (event) => {
  activeNames.set(Array.isArray(event.detail) ? event.detail : []);
};
const addPanel = () => panels.set([...panels.value, createPanel()]);
const removePanel = () => {
  const removed = panels.value.at(-1);
  panels.set(panels.value.slice(0, -1));
  activeNames.set(activeNames.value.filter((name) => name !== removed?.name));
};`;

defineStyle(styles);

const PageCollapseEx2 = defineHtml(`
  <elf-playground :title=${t("title")} :code=${dynamicCode} :script=${dynamicScript}>
    <div
      slot="status"
      class="collapse-demo-actions"
      role="status"
      aria-live="polite"
      @click=${onStatusAction}
    >
      <span>${dynamicStatus()}</span>
      <button type="button" data-action="add">${t("add")}</button>
      <button type="button" data-action="remove">${t("remove")}</button>
    </div>
    <div class="collapse-demo-shell">
      <elf-collapse
        :items.prop=${renderedPanels()}
        :modelValue.prop=${dynamicActive}
        @update:modelValue=${onDynamicUpdate}
      ></elf-collapse>
      <p class="collapse-demo-hint">${t("hint")}</p>
    </div>
  </elf-playground>
`);

export { PageCollapseEx2 };
