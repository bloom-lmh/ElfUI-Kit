import { defineHtml, onUnmounted, useRef } from "@elfui/core";
import { createDocsTranslator } from "../../docsLocale";

const t = createDocsTranslator({
  circle: { zh: "环形进度", en: "Circular progress" },
  circleTitle: { zh: "圆形与仪表盘进度", en: "Circle and dashboard progress" },
  status: { zh: "状态与不确定进度", en: "Status and indeterminate progress" },
  statusTitle: { zh: "状态、条纹与不确定进度", en: "Status, stripes, and indeterminate progress" },
  valueControls: { zh: "进度值", en: "Progress value" },
  decrease: { zh: "减少", en: "Decrease" },
  increase: { zh: "增加", en: "Increase" },
  stop: { zh: "停止", en: "Stop" },
  auto: { zh: "自动增长", en: "Auto increment" },
  speed: { zh: "自动增长速度", en: "Auto-increment speed" },
  fast: { zh: "快速（200 毫秒）", en: "Fast (200 ms)" },
  normal: { zh: "标准（400 毫秒）", en: "Normal (400 ms)" },
  slow: { zh: "舒缓（800 毫秒）", en: "Relaxed (800 ms)" }
});

const circleProgress = useRef(36);
const autoRunning = useRef(false);
const autoDelay = useRef(400);
let autoTimer: number | undefined;
const speedOptions = () => [
  { label: t("fast"), value: 200 },
  { label: t("normal"), value: 400 },
  { label: t("slow"), value: 800 }
];
const clamp = (value: number): void => circleProgress.set(Math.min(100, Math.max(0, value)));
const stopAuto = (): void => {
  if (autoTimer !== undefined) window.clearInterval(autoTimer);
  autoTimer = undefined;
  autoRunning.set(false);
};
const startAuto = (): void => {
  stopAuto();
  if (circleProgress.value >= 100) circleProgress.set(0);
  autoRunning.set(true);
  autoTimer = window.setInterval(() => {
    clamp(circleProgress.value + 4);
    if (circleProgress.value >= 100) stopAuto();
  }, autoDelay.value);
};
const decrease = (): void => { stopAuto(); clamp(circleProgress.value - 10); };
const increase = (): void => { stopAuto(); clamp(circleProgress.value + 10); };
const toggleAuto = (): void => autoRunning.value ? stopAuto() : startAuto();
const onSpeedChange = (event: CustomEvent): void => {
  const running = autoRunning.value;
  const detail = Array.isArray(event.detail) ? event.detail[0] : event.detail;
  autoDelay.set(Number(detail) || 400);
  if (running) startAuto();
};
const transition = (): number =>
  typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ? 0 : 0.45;
onUnmounted(stopAuto);

const code = `<elf-progress type="circle" :percentage="circleProgress" :transition-duration="transition()" />
<elf-progress type="circle" percentage="100" status="success" />
<elf-progress type="dashboard" :percentage="circleProgress" color="#7c3aed" />`;
const script = `const circleProgress = useRef(36);
const increase = () => circleProgress.set(Math.min(100, circleProgress.value + 10));
const decrease = () => circleProgress.set(Math.max(0, circleProgress.value - 10));
// Clear the auto-increment timer during component cleanup.

const transition = () => typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ? 0 : 0.45;`;
const statusCode = `<elf-progress percentage="28" status="warning" striped-flow />
<elf-progress percentage="64" status="exception" />
<elf-progress indeterminate duration="1" />`;

const PageProgressEx2 = defineHtml(`
  <h2>${t("circle")}</h2>
  <elf-playground :title=${t("circleTitle")} :code=${code} :script=${script}>
    <span slot="status" class="demo-state">${circleProgress.value}%</span>
    <div slot="controls" style="display:grid;gap:12px">
      <strong style="font-size:var(--elf-font-size-sm)">${t("valueControls")}</strong>
      <div style="display:flex;gap:8px;flex-wrap:wrap">
        <elf-button size="sm" variant="outlined" @click=${decrease}>${t("decrease")}</elf-button>
        <elf-button size="sm" type="primary" @click=${increase}>${t("increase")}</elf-button>
        <elf-button size="sm" variant="tonal" @click=${toggleAuto}>${autoRunning.value ? t("stop") : t("auto")}</elf-button>
      </div>
      <strong style="font-size:var(--elf-font-size-sm)">${t("speed")}</strong>
      <elf-select size="sm" :aria-label=${t("speed")} :options.prop=${speedOptions()} :modelValue.prop=${autoDelay.value} @update:modelValue=${onSpeedChange}></elf-select>
    </div>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(126px,1fr));gap:24px;align-items:center;justify-items:center;width:100%;max-width:560px;margin-inline:auto">
      <elf-progress type="circle" :percentage.prop=${circleProgress.value} :transitionDuration.prop=${transition()}></elf-progress>
      <elf-progress type="circle" percentage="100" status="success"></elf-progress>
      <elf-progress type="dashboard" :percentage.prop=${circleProgress.value} color="#7c3aed"></elf-progress>
    </div>
  </elf-playground>
  <h2>${t("status")}</h2>
  <elf-playground :title=${t("statusTitle")} :code=${statusCode}>
    <div style="display:grid;gap:16px;width:100%;max-width:520px">
      <elf-progress percentage="28" status="warning" striped-flow></elf-progress>
      <elf-progress percentage="64" status="exception"></elf-progress>
      <elf-progress indeterminate duration="1"></elf-progress>
    </div>
  </elf-playground>
`);

export { PageProgressEx2 };
