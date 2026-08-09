import { defineHtml, defineStyle, useHost, useRef } from "@elfui/core";

import type { ScrollbarExpose } from "@elfui/kit";
import { useGoTo } from "@elfui/kit";
import { createDocsTranslator } from "../../docsLocale";
import styles from "./goToPreview.scss?inline";

const t = createDocsTranslator({
  ready: { zh: "就绪", en: "Ready" },
  scrolling: { zh: "滚动中", en: "Scrolling" },
  reached: { zh: "已到达评审", en: "Review reached" },
  title: { zh: "程序化滚动", en: "Programmatic scrolling" },
  action: { zh: "前往评审", en: "Go to review" },
  brief: { zh: "项目简报", en: "Project brief" },
  statusTag: { zh: "进行中", en: "In progress" },
  projectName: { zh: "ElfUI 2.0 重构", en: "ElfUI 2.0 redesign" },
  projectDesc: {
    zh: "将组件库迁移到宏组件架构，统一设计 token、滚动与交互规范。",
    en: "Migrating the library to macro components with unified design tokens, scrolling, and interaction contracts.",
  },
  owner: { zh: "负责人", en: "Owner" },
  ownerName: { zh: "林沐涵", en: "Lin Muhan" },
  due: { zh: "截止", en: "Due" },
  dueDate: { zh: "08-20", en: "Aug 20" },
  tasks: { zh: "任务", en: "Tasks" },
  taskCount: { zh: "6/8", en: "6/8" },
  progress: { zh: "进度", en: "Progress" },
  progressValue: { zh: "72%", en: "72%" },
  implementation: { zh: "实现", en: "Implementation" },
  task1Title: { zh: "设计 token 基线", en: "Design token baseline" },
  task1By: { zh: "设计组 · 已完成", en: "Design · Done" },
  task2Title: { zh: "Provider 配置合并", en: "Provider config merge" },
  task2By: { zh: "核心组 · 已完成", en: "Core · Done" },
  task3Title: { zh: "共享滚动策略", en: "Shared scroll strategy" },
  task3By: { zh: "组件组 · 进行中", en: "Components · In progress" },
  task4Title: { zh: "双语文档同步", en: "Bilingual docs sync" },
  task4By: { zh: "待开始", en: "Pending" },
  review: { zh: "评审", en: "Review" },
  reviewStatus: { zh: "待批准", en: "Awaiting approval" },
  reviewer: { zh: "林沐涵", en: "Lin Muhan" },
  reviewerRole: { zh: "负责人", en: "Owner" },
  reviewComment: {
    zh: "实现符合组件契约，滚动时长、偏移与缓动已由 ConfigProvider 统一下发。",
    en: "The implementation matches the contract; duration, offset, and easing now come from ConfigProvider.",
  },
  commentAction: { zh: "添加评论", en: "Add comment" },
  approveAction: { zh: "批准", en: "Approve" },
});

const host = useHost();
const goTo = useGoTo();
const status = useRef(t("ready"));

const viewport = (): HTMLElement | null =>
  host.shadowRoot?.querySelector<HTMLElement & ScrollbarExpose>("#config-goto-viewport")?.wrapRef ??
  null;

const scrollToReview = async (): Promise<void> => {
  const target = host.shadowRoot?.querySelector("#config-goto-review");
  if (!target) return;
  status.set(t("scrolling"));
  const result = await goTo(target, {
    container: viewport,
    root: host.shadowRoot,
  }).finished;
  status.set(result.status === "completed" ? t("reached") : result.status);
};

defineStyle(styles);

const PageConfigProviderGoToPreview = defineHtml(`
  <div class="goto-demo">
    <div class="goto-demo__header">
      <div>
        <strong>${t("title")}</strong>
        <small>${status.value}</small>
      </div>
      <elf-button size="sm" @click=${scrollToReview}>${t("action")}</elf-button>
    </div>
    <elf-scrollbar id="config-goto-viewport" height="320px" always>
      <div class="goto-app">
        <section class="goto-card goto-card--brief">
          <header class="goto-card__head">
            <span class="goto-step">01</span>
            <h3>${t("brief")}</h3>
            <span class="goto-chip goto-chip--primary">${t("statusTag")}</span>
          </header>
          <div class="goto-project">
            <span class="goto-avatar">EL</span>
            <div class="goto-project__body">
              <strong>${t("projectName")}</strong>
              <p>${t("projectDesc")}</p>
            </div>
          </div>
          <dl class="goto-meta">
            <div>
              <dt>${t("owner")}</dt>
              <dd>${t("ownerName")}</dd>
            </div>
            <div>
              <dt>${t("due")}</dt>
              <dd>${t("dueDate")}</dd>
            </div>
            <div>
              <dt>${t("tasks")}</dt>
              <dd>${t("taskCount")}</dd>
            </div>
          </dl>
          <div class="goto-progress">
            <div class="goto-progress__head">
              <span>${t("progress")}</span>
              <strong>${t("progressValue")}</strong>
            </div>
            <div class="goto-progress__track">
              <i style="width: 72%"></i>
            </div>
          </div>
        </section>

        <section class="goto-card goto-card--tasks">
          <header class="goto-card__head">
            <span class="goto-step">02</span>
            <h3>${t("implementation")}</h3>
            <span class="goto-count">4</span>
          </header>
          <ul class="goto-tasks">
            <li class="goto-task is-done">
              <span class="goto-task__mark">✓</span>
              <div class="goto-task__body">
                <strong>${t("task1Title")}</strong>
                <small>${t("task1By")}</small>
              </div>
            </li>
            <li class="goto-task is-done">
              <span class="goto-task__mark">✓</span>
              <div class="goto-task__body">
                <strong>${t("task2Title")}</strong>
                <small>${t("task2By")}</small>
              </div>
            </li>
            <li class="goto-task is-active">
              <span class="goto-task__mark is-dot"></span>
              <div class="goto-task__body">
                <strong>${t("task3Title")}</strong>
                <small>${t("task3By")}</small>
              </div>
            </li>
            <li class="goto-task is-todo">
              <span class="goto-task__mark"></span>
              <div class="goto-task__body">
                <strong>${t("task4Title")}</strong>
                <small>${t("task4By")}</small>
              </div>
            </li>
          </ul>
        </section>

        <section id="config-goto-review" class="goto-card goto-card--review">
          <header class="goto-card__head">
            <span class="goto-step">03</span>
            <h3>${t("review")}</h3>
            <span class="goto-chip goto-chip--success">${t("reviewStatus")}</span>
          </header>
          <div class="goto-comment">
            <span class="goto-avatar goto-avatar--sm">林</span>
            <div class="goto-comment__body">
              <strong>${t("reviewer")}<em>${t("reviewerRole")}</em></strong>
              <p>${t("reviewComment")}</p>
            </div>
          </div>
          <div class="goto-actions">
            <elf-button size="sm" variant="outlined">${t("commentAction")}</elf-button>
            <elf-button size="sm" color="success">${t("approveAction")}</elf-button>
          </div>
        </section>
      </div>
    </elf-scrollbar>
  </div>
`);

export { PageConfigProviderGoToPreview };
