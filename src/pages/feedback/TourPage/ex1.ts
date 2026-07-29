import { defineHtml, useRef } from "@elfui/core";
import { createDocsTranslator } from "../../docsLocale";

const t = createDocsTranslator({
  title: { zh: "跟随目标的基础引导", en: "Basic target-following tour" },
  start: { zh: "开始引导", en: "Start tour" },
  overviewTitle: { zh: "项目概览", en: "Project overview" },
  overviewContent: {
    zh: "引导会跟随目标定位，并在遮罩中高亮当前步骤。",
    en: "The tour follows its target and highlights the current step through the mask.",
  },
  actionTitle: { zh: "主要操作", en: "Primary action" },
  actionContent: {
    zh: "把高频操作设为关键步骤，帮助用户完成第一次任务。",
    en: "Turn a frequent action into a key step that helps users complete their first task.",
  },
  cardTitle: { zh: "状态卡片", en: "Status card" },
  cardContent: {
    zh: "滚动、窗口变化或组件尺寸变化时，引导面板会重新定位。",
    en: "The tour panel repositions after scrolling, viewport changes, or component resizing.",
  },
  workspaceTitle: { zh: "工作台概览", en: "Workspace overview" },
  workspaceDescription: {
    zh: "这里模拟真实业务页面，引导会依次高亮标题、操作和数据卡片。",
    en: "This stage simulates a product page and highlights its heading, action, and data card in sequence.",
  },
  createTask: { zh: "新建任务", en: "Create task" },
  progress: { zh: "今日进度", en: "Today's progress" },
  progressValue: { zh: "24 个任务已同步，3 个待审批。", en: "24 tasks synchronized; 3 await approval." },
});

const code = `<elf-button @click="startTour">${t("start")}</elf-button>
<elf-tour
  :steps.prop="tourSteps"
  :visible="visible"
  :current="current"
  @update:current="onCurrentChange"
  @close="closeTour"
  @finish="closeTour"
/>`;

const script = `const visible = useRef(false);
const current = useRef(0);
const tourSteps = [
  {
    target: "#tour-demo-title",
    title: "${t("overviewTitle")}",
    content: "${t("overviewContent")}",
    placement: "bottom"
  },
  {
    target: "#tour-demo-action",
    title: "${t("actionTitle")}",
    content: "${t("actionContent")}",
    placement: "right"
  },
  {
    target: "#tour-demo-card",
    title: "${t("cardTitle")}",
    content: "${t("cardContent")}",
    placement: "top"
  }
];

const startTour = () => { current.set(0); visible.set(true); };
const closeTour = () => visible.set(false);
const onCurrentChange = (event) => current.set(Number(event.detail));`;

const tourSteps = [
  {
    target: "#tour-demo-title",
    title: t("overviewTitle"),
    content: t("overviewContent"),
    placement: "bottom" as const
  },
  {
    target: "#tour-demo-action",
    title: t("actionTitle"),
    content: t("actionContent"),
    placement: "right" as const
  },
  {
    target: "#tour-demo-card",
    title: t("cardTitle"),
    content: t("cardContent"),
    placement: "top" as const
  }
];

const visible = useRef(false);
const current = useRef(0);

const startTour = (): void => {
  current.set(0);
  visible.set(true);
};

const closeTour = (): void => {
  visible.set(false);
};

const onCurrentChange = (event: Event): void => {
  current.set(Number((event as CustomEvent<number>).detail ?? 0));
};

const PageTourEx1 = defineHtml(`
  <h2>${t("title")}</h2>
  <elf-playground :title=${t("title")} :code=${code} :script=${script}>
    <div
      style="display:grid;grid-template-columns:minmax(0,1fr) auto;gap:16px;align-items:start;padding:20px;border:1px solid var(--elf-border);border-radius:8px"
    >
      <div>
        <h3 id="tour-demo-title" style="margin:0 0 8px">${t("workspaceTitle")}</h3>
        <p style="margin:0;color:var(--elf-text-secondary);font-size:13px">
          ${t("workspaceDescription")}
        </p>
      </div>
      <elf-button id="tour-demo-action" color="primary">${t("createTask")}</elf-button>
      <div
        id="tour-demo-card"
        style="grid-column:1 / -1;padding:16px;border:1px solid var(--elf-border);border-radius:8px;background:var(--elf-bg-paper)"
      >
        <strong>${t("progress")}</strong>
        <div style="margin-top:8px;color:var(--elf-text-secondary);font-size:13px">
          ${t("progressValue")}
        </div>
      </div>
    </div>
    <div style="margin-top:16px">
      <elf-button color="primary" @click=${startTour}>${t("start")}</elf-button>
    </div>
    <elf-tour
      :steps=${tourSteps}
      :visible=${visible}
      :current=${current}
      @update:current=${onCurrentChange}
      @close=${closeTour}
      @finish=${closeTour}
    ></elf-tour>
  </elf-playground>
`);

export { PageTourEx1 };
