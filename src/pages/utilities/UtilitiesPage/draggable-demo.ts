import {
  defineDirective,
  defineHtml,
  defineStyle,
  useRef
} from "@elfui/core";

import {
  draggableDirective,
  type DraggableDropDetail,
  type DraggableOptions
} from "../../../directives/draggable";
import styles from "./draggable-demo.scss?inline";

interface Task {
  id: string;
  title: string;
  meta: string;
}

const INITIAL_TASKS: Task[] = [
  { id: "tokens", title: "Design tokens", meta: "Foundation" },
  { id: "fields", title: "Field surfaces", meta: "Components" },
  { id: "a11y", title: "Focus audit", meta: "Accessibility" },
  { id: "release", title: "Release notes", meta: "Documentation" }
];

const draggable = defineDirective(draggableDirective);

// State
const tasks = useRef<Task[]>([...INITIAL_TASKS]);
const archived = useRef<Task[]>([]);
const activity = useRef("拖动卡片调整顺序，或放入归档目标");

// Derived state
const taskCount = (): string => `${tasks.value.length} active · ${archived.value.length} archived`;

const taskDragOptions = (task: Task): DraggableOptions<Task> => ({
  key: task.id,
  data: task,
  group: "utility-tasks",
  axis: "y",
  onDrop: reorderTask
});

const archiveDragOptions = (): DraggableOptions<Task> => ({
  key: "archive",
  data: { id: "archive", title: "Archive", meta: "Target" },
  group: "utility-tasks",
  draggable: false,
  droppable: true,
  mode: "inside",
  onDrop: archiveTask
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
  activity.set(`已移动 ${source.title} · ${detail.placement}`);
};

const archiveTask = (detail: DraggableDropDetail<Task>): void => {
  const source = tasks.peek().find((task) => task.id === detail.source.key);
  if (!source) return;
  tasks.set(tasks.peek().filter((task) => task.id !== source.id));
  archived.set([...archived.peek(), source]);
  activity.set(`已归档 ${source.title}`);
};

const reset = (): void => {
  tasks.set([...INITIAL_TASKS]);
  archived.set([]);
  activity.set("拖动卡片调整顺序，或放入归档目标");
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

<aside v-draggable="archiveDragOptions()">Archive target</aside>`;

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
    // Update the source array using source.key, target.key and placement.
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
    <h2>Draggable 拖拽</h2>
    <elf-playground title="拖拽源 · 目标接收 · 列表排序" :code=${code} :script=${script}>
      <div slot="status" class="draggable-status">
        <span role="status" aria-live="polite">${activity}</span>
        <strong>${taskCount()}</strong>
        <elf-button size="sm" variant="text" @click=${reset}>重置</elf-button>
      </div>

      <div class="draggable-board">
        <section class="task-column" aria-label="可排序任务">
          <header><span>ACTIVE WORK</span><strong>拖动排序</strong></header>
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
          <strong>Archive target</strong>
          <small>放到这里归档</small>
          <div v-if=${archived.value.length > 0} class="archive-chips">
            <span v-for="task in archived" :key="task.id">{{ task.title }}</span>
          </div>
        </aside>
      </div>
    </elf-playground>
  </article>
`);

export { PageUtilitiesDraggable };
