import { defineDirective, defineHtml, defineStyle, useRef } from "@elfui/core";

import {
  draggableDirective,
  type DraggableDropDetail,
  type DraggableOptions,
} from "@elfui/kit-src/directives/draggable";
import { createDocsTranslator } from "../../docsLocale";
import styles from "./draggable-demo.scss?inline";

const t = createDocsTranslator({
  title: { zh: "拖拽", en: "Draggable" },
  playgroundTitle: {
    zh: "拖拽源 · 目标接收 · 列表排序",
    en: "Drag source · Drop target · List sorting",
  },
  designTokens: { zh: "设计令牌", en: "Design tokens" },
  foundation: { zh: "基础", en: "Foundation" },
  fieldSurfaces: { zh: "字段表面", en: "Field surfaces" },
  components: { zh: "组件", en: "Components" },
  focusAudit: { zh: "焦点审计", en: "Focus audit" },
  accessibility: { zh: "无障碍", en: "Accessibility" },
  releaseNotes: { zh: "发布说明", en: "Release notes" },
  documentation: { zh: "文档", en: "Documentation" },
  initialStatus: {
    zh: "拖动卡片调整顺序，或放入归档目标",
    en: "Drag cards to reorder them or drop them into the archive target",
  },
  active: { zh: "进行中", en: "active" },
  archived: { zh: "已归档", en: "archived" },
  moved: { zh: "已移动", en: "Moved" },
  archivedAction: { zh: "已归档", en: "Archived" },
  reset: { zh: "重置", en: "Reset" },
  sortableTasks: { zh: "可排序任务", en: "Sortable tasks" },
  activeWork: { zh: "进行中的工作", en: "ACTIVE WORK" },
  reorder: { zh: "拖动排序", en: "Drag to reorder" },
  archiveTarget: { zh: "归档目标", en: "Archive target" },
  target: { zh: "目标", en: "Target" },
  dropToArchive: { zh: "放到这里归档", en: "Drop here to archive" },
  updateComment: {
    zh: "使用 source.key、target.key 和 placement 更新源数组。",
    en: "Update the source array using source.key, target.key, and placement.",
  },
});

interface Task {
  id: string;
  title: string;
  meta: string;
}

const INITIAL_TASKS: Task[] = [
  { id: "tokens", title: t("designTokens"), meta: t("foundation") },
  { id: "fields", title: t("fieldSurfaces"), meta: t("components") },
  { id: "a11y", title: t("focusAudit"), meta: t("accessibility") },
  { id: "release", title: t("releaseNotes"), meta: t("documentation") },
];

const draggable = defineDirective(draggableDirective);

// State
const tasks = useRef<Task[]>([...INITIAL_TASKS]);
const archived = useRef<Task[]>([]);
const activity = useRef(t("initialStatus"));

// Derived state
const taskCount = (): string =>
  `${tasks.value.length} ${t("active")} · ${archived.value.length} ${t("archived")}`;

const taskDragOptions = (task: Task): DraggableOptions<Task> => ({
  key: task.id,
  data: task,
  group: "utility-tasks",
  axis: "y",
  onDrop: reorderTask,
});

const archiveDragOptions = (): DraggableOptions<Task> => ({
  key: "archive",
  data: { id: "archive", title: t("archiveTarget"), meta: t("target") },
  group: "utility-tasks",
  draggable: false,
  droppable: true,
  mode: "inside",
  onDrop: archiveTask,
});

// Methods
const reorderTask = (detail: DraggableDropDetail<Task>): void => {
  const sourceId = detail.source.key;
  const targetId = detail.target.key;
  if (sourceId === targetId) return;
  const source = tasks.peek().find((task) => task.id === sourceId);
  if (!source) return;
  const remaining = tasks.peek().filter((task) => task.id !== sourceId);
  const targetIndex = remaining.findIndex((task) => task.id === targetId);
  if (targetIndex < 0) return;
  const insertAt = targetIndex + (detail.placement === "after" ? 1 : 0);
  remaining.splice(insertAt, 0, source);
  tasks.set(remaining);
  activity.set(`${t("moved")} ${source.title} · ${detail.placement}`);
};

const archiveTask = (detail: DraggableDropDetail<Task>): void => {
  const source = tasks.peek().find((task) => task.id === detail.source.key);
  if (!source) return;
  tasks.set(tasks.peek().filter((task) => task.id !== source.id));
  archived.set([...archived.peek(), source]);
  activity.set(`${t("archivedAction")} ${source.title}`);
};

const reset = (): void => {
  tasks.set([...INITIAL_TASKS]);
  archived.set([]);
  activity.set(t("initialStatus"));
};

const code = `<section class="task-list">
  <article
    v-for="task in tasks"
    :key="task.id"
    v-draggable="taskDragOptions(task)"
  >
    {{ task.title }}
  </article>
</section>

<aside v-draggable="archiveDragOptions()">${t("archiveTarget")}</aside>`;

const script = `import { defineDirective } from "@elfui/core";
import { draggableDirective } from "@elfui/kit";

const draggable = defineDirective(draggableDirective);
const tasks = useRef(initialTasks);

const taskDragOptions = (task) => ({
  key: task.id,
  data: task,
  group: "tasks",
  axis: "y",
  onDrop: ({ source, target, placement }) => {
    // ${t("updateComment")}
  }
});

const archiveDragOptions = () => ({
  key: "archive",
  group: "tasks",
  draggable: false,
  mode: "inside",
  onDrop: ({ source }) => archive(source.data)
});`;

defineStyle(styles);

const PageUtilitiesDraggable = defineHtml(`
  <article id="utility-draggable" class="utility-lab draggable-utility">
    <h2>${t("playgroundTitle")}</h2>
    <elf-playground :title=${t("playgroundTitle")} :code=${code} :script=${script}>
      <div slot="status" class="draggable-status">
        <span role="status" aria-live="polite">${activity}</span>
        <strong>${taskCount()}</strong>
        <elf-button size="sm" variant="text" @click=${reset}>${t("reset")}</elf-button>
      </div>

      <div class="draggable-board">
        <section class="task-column" :aria-label=${t("sortableTasks")}>
          <header><span>${t("activeWork")}</span><strong>${t("reorder")}</strong></header>
          <div class="task-list">
            <article
              v-for="(task, index) in tasks"
              :key="task.id"
              v-draggable="taskDragOptions(task)"
              class="task-card"
            >
              <span class="drag-handle" aria-hidden="true">⠿</span>
              <div><strong>{{ task.title }}</strong><small>{{ task.meta }}</small></div>
              <span class="task-index">{{ String(index + 1).padStart(2, "0") }}</span>
            </article>
          </div>
        </section>

        <aside v-draggable=${archiveDragOptions()} class="archive-target">
          <span aria-hidden="true">↓</span>
          <strong>${t("archiveTarget")}</strong>
          <small>${t("dropToArchive")}</small>
          <div v-if=${archived.value.length > 0} class="archive-chips">
            <span v-for="task in archived" :key="task.id">{{ task.title }}</span>
          </div>
        </aside>
      </div>
    </elf-playground>
  </article>
`);

export { PageUtilitiesDraggable };
