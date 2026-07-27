import { defineHtml, useRef } from "@elfui/core";
import { createDocsTranslator } from "../../docsLocale";

const t = createDocsTranslator({
  heading: { zh: "条形进度", en: "Linear progress" },
  title: { zh: "基础、内部文字与增长速度", en: "Basic, inside text, and transition speed" },
  valueControls: { zh: "进度值", en: "Progress value" },
  decrease: { zh: "减少", en: "Decrease" },
  increase: { zh: "增加", en: "Increase" },
  speed: { zh: "增长速度", en: "Transition speed" },
  fast: { zh: "快速（0.2 秒）", en: "Fast (0.2 s)" },
  normal: { zh: "标准（0.6 秒）", en: "Normal (0.6 s)" },
  slow: { zh: "舒缓（1.5 秒）", en: "Relaxed (1.5 s)" }
});

const progress = useRef(48);
const transitionDuration = useRef(0.6);
const speedOptions = () => [
  { label: t("fast"), value: 0.2 },
  { label: t("normal"), value: 0.6 },
  { label: t("slow"), value: 1.5 }
];
const setProgress = (value: number): void => progress.set(Math.min(100, Math.max(0, value)));
const increase = (): void => setProgress(progress.value + 12);
const decrease = (): void => setProgress(progress.value - 12);
const onSpeedChange = (event: CustomEvent): void => {
  const detail = Array.isArray(event.detail) ? event.detail[0] : event.detail;
  transitionDuration.set(Number(detail) || 0.6);
};

const code = `<elf-progress :percentage="progress" :transition-duration="transitionDuration" />
<elf-progress :percentage="progress" :transition-duration="transitionDuration" text-inside stroke-width="20" />`;
const script = `const progress = useRef(48);
const transitionDuration = useRef(0.6);
const increase = () => progress.set(Math.min(100, progress.value + 12));
const decrease = () => progress.set(Math.max(0, progress.value - 12));`;

const PageProgressEx1 = defineHtml(`
  <h2>${t("heading")}</h2>
  <elf-playground :title=${t("title")} :code=${code} :script=${script}>
    <span slot="status" class="demo-state">${progress.value}%</span>
    <div slot="controls" style="display:grid;gap:12px">
      <strong style="font-size:var(--elf-font-size-sm)">${t("valueControls")}</strong>
      <div style="display:flex;gap:8px;flex-wrap:wrap">
        <elf-button size="sm" variant="outlined" @click=${decrease}>${t("decrease")}</elf-button>
        <elf-button size="sm" type="primary" @click=${increase}>${t("increase")}</elf-button>
      </div>
      <strong style="font-size:var(--elf-font-size-sm)">${t("speed")}</strong>
      <elf-select size="sm" :aria-label=${t("speed")} :options.prop=${speedOptions()} :modelValue.prop=${transitionDuration.value} @update:modelValue=${onSpeedChange}></elf-select>
    </div>
    <div style="display:grid;gap:16px;width:100%;max-width:520px">
      <elf-progress :percentage.prop=${progress.value} :transitionDuration.prop=${transitionDuration.value}></elf-progress>
      <elf-progress :percentage.prop=${progress.value} :transitionDuration.prop=${transitionDuration.value} text-inside stroke-width="20"></elf-progress>
    </div>
  </elf-playground>
`);

export { PageProgressEx1 };
