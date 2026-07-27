import { defineHtml, onBeforeUnmount, useRef } from "@elfui/core";

const code = `<elf-button @click="startResilientTour">模拟目标消失</elf-button>
<div v-if="showTarget" id="tour-live-target">正在同步的数据卡片</div>
<elf-tour
  :steps.prop="steps"
  :visible="visible"
  @close="closeTour"
/>`;

const script = `const visible = useRef(false);
const showTarget = useRef(true);
const status = useRef("目标已就绪");
const steps = [{
  target: "#tour-live-target",
  title: "动态目标保护",
  content: "目标卸载后，引导会退回居中安全面板，而不是停留在旧坐标。"
}];

let removalTimer;
const startResilientTour = () => {
  showTarget.set(true);
  status.set("正在跟随目标");
  visible.set(true);
  removalTimer = setTimeout(() => {
    showTarget.set(false);
    status.set("目标已卸载 · 引导仍可继续");
  }, 900);
};

const closeTour = () => visible.set(false);
onBeforeUnmount(() => clearTimeout(removalTimer));`;

// state
const visible = useRef(false);
const showTarget = useRef(true);
const status = useRef("目标已就绪");

const steps = [
  {
    target: "#tour-live-target",
    title: "动态目标保护",
    content: "目标卸载后，引导会退回居中安全面板，而不是停留在旧坐标。",
    placement: "bottom" as const
  }
];

let removalTimer: ReturnType<typeof setTimeout> | null = null;

// actions
const clearRemovalTimer = (): void => {
  if (removalTimer) clearTimeout(removalTimer);
  removalTimer = null;
};

const startResilientTour = (): void => {
  clearRemovalTimer();
  showTarget.set(true);
  status.set("正在跟随目标");
  visible.set(true);
  removalTimer = setTimeout(() => {
    showTarget.set(false);
    status.set("目标已卸载 · 引导仍可继续");
    removalTimer = null;
  }, 900);
};

const closeTour = (): void => {
  clearRemovalTimer();
  visible.set(false);
};

onBeforeUnmount(clearRemovalTimer);

const PageTourEx3 = defineHtml(`
  <h2>动态目标</h2>
  <elf-playground title="目标卸载保护" :code=${code} :script=${script}>
    <span slot="status" class="demo-state">{{ status }}</span>
    <div style="display:grid;grid-template-columns:minmax(0,1fr) auto;gap:16px;align-items:center;padding:20px;border:1px solid var(--elf-border);border-radius:8px">
      <div v-if=${showTarget} id="tour-live-target" style="padding:18px;border-radius:8px;background:color-mix(in srgb,var(--elf-primary) 10%,var(--elf-bg-paper));border:1px solid color-mix(in srgb,var(--elf-primary) 30%,var(--elf-border))">
        <strong>正在同步的数据卡片</strong>
        <div style="margin-top:6px;color:var(--elf-text-secondary);font-size:13px">该区域会在引导打开后自动卸载。</div>
      </div>
      <div v-else style="padding:18px;color:var(--elf-text-secondary)">数据卡片已离开 DOM</div>
      <elf-button color="primary" @click=${startResilientTour}>模拟目标消失</elf-button>
    </div>
    <elf-tour :steps=${steps} :visible=${visible} @close=${closeTour} @finish=${closeTour}></elf-tour>
  </elf-playground>
`);

export { PageTourEx3 };
