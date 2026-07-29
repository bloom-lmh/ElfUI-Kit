import { defineHtml, useRef } from "@elfui/core";
import { createDocsTranslator } from "../../docsLocale";

const t = createDocsTranslator({
  title: { zh: "键盘导航与焦点管理", en: "Keyboard navigation and focus management" },
  start: { zh: "开始键盘引导", en: "Start keyboard tour" },
  first: { zh: "第一步", en: "Step one" },
  second: { zh: "第二步", en: "Step two" },
  third: { zh: "第三步", en: "Step three" },
  forwardTitle: { zh: "方向键前进", en: "Move forward with arrow keys" },
  forwardContent: { zh: "按右方向键或下方向键进入下一步。", en: "Press Right or Down to move to the next step." },
  backwardTitle: { zh: "方向键后退", en: "Move backward with arrow keys" },
  backwardContent: {
    zh: "按左方向键或上方向键回到上一步，按退出键关闭。",
    en: "Press Left or Up to go back; press Escape to close.",
  },
  finishTitle: { zh: "完成引导", en: "Finish the tour" },
  finishContent: { zh: "最后一步点击完成会触发完成事件。", en: "Finishing the last step emits the finish event." },
  status: { zh: "状态", en: "Status" },
  idle: { zh: "未开始", en: "Not started" },
  running: { zh: "引导中", en: "Tour in progress" },
  closed: { zh: "已关闭", en: "Closed" },
  finished: { zh: "已完成", en: "Finished" },
});

const code = `<elf-button @click="startTour">${t("start")}</elf-button>
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
const status = useRef("${t("idle")}");
const tourSteps = [
  {
    target: "#tour-kb-a",
    title: "${t("forwardTitle")}",
    content: "${t("forwardContent")}",
    placement: "right"
  },
  {
    target: "#tour-kb-b",
    title: "${t("backwardTitle")}",
    content: "${t("backwardContent")}",
    placement: "bottom"
  },
  {
    target: "#tour-kb-c",
    title: "${t("finishTitle")}",
    content: "${t("finishContent")}",
    placement: "left"
  }
];

const startTour = () => {
  current.set(0);
  status.set("${t("running")}");
  visible.set(true);
};
const closeTour = () => {
  status.set("${t("closed")}");
  visible.set(false);
};
const finishTour = () => {
  status.set("${t("finished")}");
  visible.set(false);
};
const onCurrentChange = (event) => current.set(Number(event.detail));`;

const tourSteps = [
  {
    target: "#tour-kb-a",
    title: t("forwardTitle"),
    content: t("forwardContent"),
    placement: "right" as const
  },
  {
    target: "#tour-kb-b",
    title: t("backwardTitle"),
    content: t("backwardContent"),
    placement: "bottom" as const
  },
  {
    target: "#tour-kb-c",
    title: t("finishTitle"),
    content: t("finishContent"),
    placement: "left" as const
  }
];

const visible = useRef(false);
const current = useRef(0);
const status = useRef(t("idle"));

const startTour = (): void => {
  current.set(0);
  status.set(t("running"));
  visible.set(true);
};

const closeTour = (): void => {
  visible.set(false);
  status.set(t("closed"));
};

const finishTour = (): void => {
  visible.set(false);
  status.set(t("finished"));
};

const onCurrentChange = (event: Event): void => {
  current.set(Number((event as CustomEvent<number>).detail ?? 0));
};

const PageTourEx2 = defineHtml(`
  <h2>${t("title")}</h2>
  <elf-playground :title=${t("title")} :code=${code} :script=${script}>
    <div
      style="display:flex;gap:16px;flex-wrap:wrap;padding:20px;border:1px solid var(--elf-border);border-radius:8px"
    >
      <button
        id="tour-kb-a"
        style="padding:18px 22px;border:0;border-radius:8px;background:var(--elf-primary);color:#fff"
      >
        ${t("first")}
      </button>
      <button
        id="tour-kb-b"
        style="padding:18px 22px;border:0;border-radius:8px;background:var(--elf-success);color:#fff"
      >
        ${t("second")}
      </button>
      <button
        id="tour-kb-c"
        style="padding:18px 22px;border:0;border-radius:8px;background:var(--elf-warning);color:#202124"
      >
        ${t("third")}
      </button>
    </div>
    <span slot="status" style="display:flex;gap:10px;align-items:center">
      <span style="font-size:13px;color:var(--elf-text-secondary)">${t("status")}：{{ status }}</span>
      <elf-button size="small" color="primary" @click=${startTour}>${t("start")}</elf-button>
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
