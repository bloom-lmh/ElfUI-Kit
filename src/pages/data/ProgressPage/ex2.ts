import { defineHtml, defineStyle, onUnmounted, useRef } from "@elfui/core";
import { createDocsTranslator } from "../../docsLocale";

const t = createDocsTranslator({
  format: { zh: "数值格式化", en: "Value formatting" },
  formatTitle: { zh: "容量与队列格式", en: "Capacity and queue formats" },
  upload: { zh: "正在上传", en: "Uploading" },
  processing: { zh: "正在处理", en: "Processing" },
  slots: { zh: "插槽内容", en: "Slot content" },
  slotsTitle: { zh: "自定义标签、数值与中心内容", en: "Custom labels, values, and center content" },
  transfer: { zh: "预计 5 分钟完成", en: "About 5 minutes remaining" },
  total: { zh: "共 2 GB", en: "2 GB total" },
  circle: { zh: "环形与仪表盘", en: "Circle and dashboard" },
  circleTitle: { zh: "自动增长与状态反馈", en: "Auto increment and status feedback" },
  decrease: { zh: "减少", en: "Decrease" },
  increase: { zh: "增加", en: "Increase" },
  stop: { zh: "停止", en: "Stop" },
  auto: { zh: "自动增长", en: "Auto increment" },
  loading: { zh: "正在加载", en: "Loading" }
});

const circleProgress = useRef(45);
const autoRunning = useRef(false);
let autoTimer: number | undefined;
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
    clamp(circleProgress.value + 3);
    if (circleProgress.value >= 100) stopAuto();
  }, 360);
};
const decrease = (): void => { stopAuto(); clamp(circleProgress.value - 10); };
const increase = (): void => { stopAuto(); clamp(circleProgress.value + 10); };
const toggleAuto = (): void => autoRunning.value ? stopAuto() : startAuto();
onUnmounted(stopAuto);

const capacityFormat = "[value] / [max] GB";
const queueFormat = "[value] of [max] items";
const formatCode = `<elf-progress label="Uploading" :value="15.2" :max="76.8" value-format="[value] / [max] GB" />
<elf-progress label="Processing" :value="65" :max="120" value-format="[value] of [max] items" />`;
const slotCode = `<elf-progress value="1.7" max="2">
  <span slot="label">Transfer</span>
  <span slot="value">1.7 GB</span>
</elf-progress>
<elf-progress type="circle" percentage="45">Custom center</elf-progress>`;
const circleCode = `<elf-progress type="circle" percentage="45" />
<elf-progress type="circle" percentage="100" status="success" />
<elf-progress type="dashboard" percentage="45" color="warning" />`;

defineStyle(`
  .format-grid { display: grid; width: min(820px, 100%); grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 28px; padding: 28px; border: 1px solid var(--elf-border); border-radius: 8px; background: var(--elf-bg-default); }
  .slot-stage { display: grid; width: min(760px, 100%); grid-template-columns: minmax(0, 1fr) 220px; align-items: center; gap: 34px; padding: 30px; background: var(--elf-bg-default); }
  .transfer-panel { padding: 22px; border-radius: 8px; background: color-mix(in srgb, var(--elf-primary) 10%, var(--elf-bg-paper)); }
  .transfer-panel elf-progress { --_progress-height: 4px; }
  .transfer-meta { display: flex; justify-content: space-between; gap: 12px; margin-top: 8px; color: var(--elf-text-secondary); font-size: 11px; }
  .circle-card { display: grid; min-height: 210px; place-items: center; border: 1px solid var(--elf-border); border-radius: 8px; background: var(--elf-bg-paper); }
  .circle-card elf-progress { width: auto; }
  .center-copy { display: grid; gap: 2px; place-items: center; }
  .center-copy strong { font-size: 24px; }
  .center-copy span { color: var(--elf-text-secondary); font-size: 10px; }
  .circle-stage { display: grid; width: min(760px, 100%); grid-template-columns: repeat(3, minmax(126px, 1fr)); gap: 26px; align-items: center; justify-items: center; padding: 34px; background: var(--elf-bg-default); }
  .circle-stage elf-progress { width: auto; }
  .circle-controls { display: flex; flex-wrap: wrap; gap: 8px; }
  .circle-demo { display: grid; width: min(760px, 100%); gap: 14px; }
  @media (max-width: 680px) { .format-grid, .slot-stage { grid-template-columns: 1fr; } .circle-stage { grid-template-columns: 1fr; } .slot-stage { padding: 20px; } }
`);

const PageProgressEx2 = defineHtml(`
  <h2>${t("formatTitle")}</h2>
  <elf-playground :title=${t("formatTitle")} :code=${formatCode}>
    <div class="format-grid"><elf-progress :label=${t("upload")} :value.prop=${15.2} :max.prop=${76.8} :valueFormat=${capacityFormat}></elf-progress><elf-progress :label=${t("processing")} :value.prop=${65} :max.prop=${120} :valueFormat=${queueFormat} color="warning"></elf-progress></div>
  </elf-playground>

  <h2>${t("slotsTitle")}</h2>
  <elf-playground :title=${t("slotsTitle")} :code=${slotCode}>
    <div class="slot-stage"><div class="transfer-panel"><elf-progress label="Transfer" :value.prop=${1.7} :max.prop=${2} hide-value><span slot="label">1.7 GB</span></elf-progress><div class="transfer-meta"><span>${t("transfer")}</span><span>${t("total")}</span></div></div><div class="circle-card"><elf-progress type="circle" :percentage.prop=${circleProgress.value} size="132" stroke-width="7"><span class="center-copy"><strong>${circleProgress.value}%</strong><span>${t("loading")}</span></span></elf-progress></div></div>
  </elf-playground>

  <h2>${t("circleTitle")}</h2>
  <elf-playground :title=${t("circleTitle")} :code=${circleCode}>
    <div class="circle-demo"><div class="circle-controls"><elf-button size="sm" variant="outlined" @click=${decrease}>${t("decrease")}</elf-button><elf-button size="sm" @click=${increase}>${t("increase")}</elf-button><elf-button size="sm" variant="outlined" @click=${toggleAuto}>${autoRunning.value ? t("stop") : t("auto")}</elf-button></div><div class="circle-stage"><elf-progress type="circle" :percentage.prop=${circleProgress.value} size="132"></elf-progress><elf-progress type="circle" percentage="100" status="success" size="132"></elf-progress><elf-progress type="dashboard" :percentage.prop=${circleProgress.value} color="warning" size="132"></elf-progress></div></div>
  </elf-playground>
`);

export { PageProgressEx2 };
