import { defineHtml, defineStyle, useRef } from "@elfui/core";
import { createDocsTranslator } from "../../docsLocale";
import styles from "./demo.scss?inline";

const t = createDocsTranslator({
  title: { zh: "心率与平滑模式", en: "Heart rate and smoothing" },
  heartRate: { zh: "心率", en: "Heart rate" },
  bpm: { zh: "BPM", en: "BPM" },
  measure: { zh: "重新测量", en: "Measure again" },
  monotone: { zh: "单调平滑", en: "Monotone" },
  smooth: { zh: "平滑度", en: "Smooth" },
});

const initialBeats = [
  84, 92, 88, 101, 96, 89, 108, 99, 93, 104, 97, 86, 91, 106, 98, 90, 103, 95, 88, 100,
];
const heartbeats = useRef<number[]>(initialBeats);
const monotone = useRef(true);
const smooth = useRef(16);

const average = (): string => {
  const source = heartbeats.value;
  if (source.length === 0) return "—";
  return String(Math.ceil(source.reduce((sum, value) => sum + value, 0) / source.length));
};
const takePulse = (): void => {
  heartbeats.set(Array.from({ length: 20 }, () => 80 + Math.floor(Math.random() * 41)));
};
const onMonotone = (event: CustomEvent): void => monotone.set(Boolean(event.detail));
const onSmooth = (event: CustomEvent): void => smooth.set(Number(event.detail));

const code = `<elf-card variant="outlined" class="sparkline-heart">
  <div slot="header" class="sparkline-heart-head">
    <div>
      <span class="sparkline-heart-kicker">Heart rate</span>
      <strong class="sparkline-heart-value">{{ average }} BPM</strong>
    </div>
    <elf-button size="sm" variant="outlined" @click="takePulse">
      Measure again
    </elf-button>
  </div>
  <elf-sparkline
    :model-value.prop="heartbeats"
    :gradient.prop="['#f72047', '#ffd200', '#1feaea']"
    line-width="3"
    :smooth.prop="smooth"
    :smooth-mode.prop="monotone ? 'monotone' : 'default'"
    stroke-linecap="round"
    show-markers
    animation
    auto-draw="once"
  />
  <div slot="footer" class="sparkline-heart-controls">
    <elf-switch :model-value.prop="monotone" label="Monotone" />
    <elf-slider min="0" max="10" step="1" :model-value.prop="smooth" label="Smooth" />
  </div>
</elf-card>`;

defineStyle(styles);

const PageSparklineEx5 = defineHtml(`
  <h2>${t("title")}</h2>
  <elf-playground :title=${t("title")} :code=${code}>
    <elf-card variant="outlined" class="sparkline-heart">
      <div slot="header" class="sparkline-heart-head">
        <div>
          <span class="sparkline-heart-kicker">${t("heartRate")}</span>
          <strong class="sparkline-heart-value">${average()} <em>${t("bpm")}</em></strong>
        </div>
        <elf-button size="sm" variant="outlined" @click=${takePulse}>${t("measure")}</elf-button>
      </div>
      <div class="sparkline-heart-chart">
        <elf-sparkline :modelValue.prop=${heartbeats.value} :gradient.prop=${[
          "#f72047",
          "#ffd200",
          "#1feaea",
        ]} line-width="3" :smooth.prop=${smooth.value} :smoothMode.prop=${monotone.value ? "monotone" : "default"} stroke-linecap="round" show-markers animation auto-draw="once" :aria-label=${t("heartRate")}></elf-sparkline>
      </div>
      <div slot="footer" class="sparkline-heart-controls">
        <label class="sparkline-heart-check"><elf-switch :modelValue.prop=${monotone.value} @update:modelValue=${onMonotone}></elf-switch><span>${t("monotone")}</span></label>
        <label class="sparkline-heart-slider"><span>${t("smooth")}</span><elf-slider min="0" max="10" step="1" :modelValue.prop=${smooth.value} @update:modelValue=${onSmooth}></elf-slider></label>
      </div>
    </elf-card>
  </elf-playground>
`);

export { PageSparklineEx5 };
