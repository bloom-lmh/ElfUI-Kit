import { defineHtml, useRef } from "@elfui/core";

const code = `<elf-button @click="startTour">开始引导</elf-button>
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
  { target: "#tour-demo-title", title: "项目概览", content: "...", placement: "bottom" },
  { target: "#tour-demo-action", title: "主要操作", content: "...", placement: "right" }
];

const startTour = () => { current.set(0); visible.set(true); };
const closeTour = () => visible.set(false);
const onCurrentChange = (event) => current.set(Number(event.detail));`;

const tourSteps = [
  {
    target: "#tour-demo-title",
    title: "项目概览",
    content: "Tour 会跟随目标元素定位，并在遮罩中高亮当前步骤。",
    placement: "bottom" as const
  },
  {
    target: "#tour-demo-action",
    title: "主要操作",
    content: "你可以把高频操作作为关键步骤，引导用户完成第一次任务。",
    placement: "right" as const
  },
  {
    target: "#tour-demo-card",
    title: "状态卡片",
    content: "引导面板会在滚动、窗口变化和组件尺寸变化时重新定位。",
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
  <h2>基础引导</h2>
  <elf-playground title="跟随目标定位" :code=${code} :script=${script}>
    <div
      style="display:grid;grid-template-columns:minmax(0,1fr) auto;gap:16px;align-items:start;padding:20px;border:1px solid var(--elf-border);border-radius:8px"
    >
      <div>
        <h3 id="tour-demo-title" style="margin:0 0 8px">工作台概览</h3>
        <p style="margin:0;color:var(--elf-text-secondary);font-size:13px">
          这里模拟真实业务页面，Tour 会高亮标题、操作和数据卡片。
        </p>
      </div>
      <elf-button id="tour-demo-action" color="primary">新建任务</elf-button>
      <div
        id="tour-demo-card"
        style="grid-column:1 / -1;padding:16px;border:1px solid var(--elf-border);border-radius:8px;background:var(--elf-bg-paper)"
      >
        <strong>今日进度</strong>
        <div style="margin-top:8px;color:var(--elf-text-secondary);font-size:13px">
          24 个任务已同步，3 个待审批。
        </div>
      </div>
    </div>
    <div style="margin-top:16px">
      <elf-button color="primary" @click=${startTour}>开始引导</elf-button>
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
