import { defineHtml, useRef } from "@elfui/core";

const code = `<elf-button @click="startTour">开始键盘引导</elf-button>
<elf-tour
  keyboard
  :steps.prop="tourSteps"
  :visible="visible"
  :current="current"
  @update:current="onCurrentChange"
  @close="closeTour"
  @finish="finishTour"
/>`;

const script = `const visible = useRef(false);
const current = useRef(0);
const tourSteps = [
  { target: "#tour-kb-a", title: "第一步", content: "...", placement: "right" },
  { target: "#tour-kb-b", title: "第二步", content: "...", placement: "bottom" }
];

const startTour = () => { current.set(0); visible.set(true); };
const closeTour = () => visible.set(false);
const finishTour = () => visible.set(false);
const onCurrentChange = (event) => current.set(Number(event.detail));`;

const tourSteps = [
  {
    target: "#tour-kb-a",
    title: "方向键前进",
    content: "按右方向键或下方向键进入下一步。",
    placement: "right" as const
  },
  {
    target: "#tour-kb-b",
    title: "方向键后退",
    content: "按左方向键或上方向键回到上一步，按 ESC 关闭。",
    placement: "bottom" as const
  },
  {
    target: "#tour-kb-c",
    title: "完成",
    content: "最后一步点击完成会触发 finish 事件。",
    placement: "left" as const
  }
];

const visible = useRef(false);
const current = useRef(0);
const status = useRef("未开始");

const startTour = (): void => {
  current.set(0);
  status.set("引导中");
  visible.set(true);
};

const closeTour = (): void => {
  visible.set(false);
  status.set("已关闭");
};

const finishTour = (): void => {
  visible.set(false);
  status.set("已完成");
};

const onCurrentChange = (event: Event): void => {
  current.set(Number((event as CustomEvent<number>).detail ?? 0));
};

const PageTourEx2 = defineHtml(`
  <h2>键盘与焦点</h2>
  <elf-playground title="键盘控制" :code=${code} :script=${script}>
    <div
      style="display:flex;gap:16px;flex-wrap:wrap;padding:20px;border:1px solid var(--elf-border);border-radius:8px"
    >
      <button
        id="tour-kb-a"
        style="padding:18px 22px;border:0;border-radius:8px;background:var(--elf-primary);color:#fff"
      >
        第一步
      </button>
      <button
        id="tour-kb-b"
        style="padding:18px 22px;border:0;border-radius:8px;background:var(--elf-success);color:#fff"
      >
        第二步
      </button>
      <button
        id="tour-kb-c"
        style="padding:18px 22px;border:0;border-radius:8px;background:var(--elf-warning);color:#202124"
      >
        第三步
      </button>
    </div>
    <span slot="status" style="display:flex;gap:10px;align-items:center">
      <span style="font-size:13px;color:var(--elf-text-secondary)">状态：{{ status }}</span>
      <elf-button size="small" color="primary" @click=${startTour}>开始键盘引导</elf-button>
    </span>
    <elf-tour
      :steps=${tourSteps}
      :visible=${visible}
      :current=${current}
      @update:current=${onCurrentChange}
      @close=${closeTour}
      @finish=${finishTour}
    ></elf-tour>
  </elf-playground>
`);

export { PageTourEx2 };
