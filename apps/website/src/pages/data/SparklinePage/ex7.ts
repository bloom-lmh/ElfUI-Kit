import { defineHtml, defineStyle, useRef } from "@elfui/core";
import { createDocsTranslator } from "../../docsLocale";
import styles from "./demo.scss?inline";

const t = createDocsTranslator({
  title: { zh: "渐变与填充配置", en: "Gradient and fill playground" },
  fill: { zh: "面积填充", en: "Fill" },
  lineWidth: { zh: "线宽", en: "Line width" },
  smooth: { zh: "平滑", en: "Smooth" },
  padding: { zh: "内边距", en: "Padding" },
  swatch: { zh: "色板", en: "Swatch" },
});

const values = [0, 2, 5, 9, 5, 10, 3, 5, 0, 0, 1, 8, 2, 9, 0];
const palettes: string[][] = [
  ["#374151"],
  ["#3b82f6"],
  ["#f59e0b", "#ef4444"],
  ["#8b5cf6", "#6366f1"],
  ["#00c6ff", "#7c3aed"],
  ["#10b981", "#f59e0b", "#ef4444"],
];

const gradient = useRef<string[]>(palettes[3]!);
const fill = useRef(true);
const lineWidth = useRef(2);
const smooth = useRef(8);
const padding = useRef(8);

const selectGradient = (index: number): void => gradient.set(palettes[index] ?? palettes[0]!);
const isGradientActive = (palette: string[]): boolean =>
  JSON.stringify(palette) === JSON.stringify(gradient.value);
const chipStyle = (palette: string[]): Record<string, string> => ({
  background: palette[0]!,
  borderColor: palette.at(-1) ?? palette[0]!,
});
const paletteLabel = (index: number): string => `${t("swatch")} ${index + 1}`;
const onFill = (event: CustomEvent<boolean>): void => fill.set(Boolean(event.detail));
const onLineWidth = (event: CustomEvent<number>): void => lineWidth.set(Number(event.detail));
const onSmooth = (event: CustomEvent<number>): void => smooth.set(Number(event.detail));
const onPadding = (event: CustomEvent<number>): void => padding.set(Number(event.detail));

const code = `<elf-sparkline
  :model-value.prop="values"
  :gradient.prop="gradient"
  :fill.prop="fill"
  :line-width.prop="lineWidth"
  :smooth.prop="smooth"
  :padding.prop="padding"
  auto-draw="once"
/>`;

defineStyle(styles);

const PageSparklineEx7 = defineHtml(`
  <h2>${t("title")}</h2>
  <elf-playground :title=${t("title")} :code=${code}>
    <div class="gradient-stage">
      <div class="gradient-chart">
        <elf-sparkline :modelValue.prop=${values} :gradient.prop=${gradient.value} :fill.prop=${fill.value} :lineWidth.prop=${lineWidth.value} :smooth.prop=${smooth.value} :padding.prop=${padding.value} auto-draw="once" :aria-label=${t("title")}></elf-sparkline>
      </div>
      <div class="gradient-swatches" :aria-label=${t("swatch")}>
        <button v-for="(palette, index) in palettes" :key="index" type="button" class="gradient-chip" :class="{ active: isGradientActive(palette) }" :style="chipStyle(palette)" :aria-label="paletteLabel(index)" @click="selectGradient(index)"></button>
      </div>
      <div class="gradient-controls">
        <label class="gradient-control"><elf-checkbox :modelValue.prop=${fill.value} :label=${t("fill")} @update:modelValue=${onFill}></elf-checkbox></label>
        <label class="gradient-control"><span>${t("lineWidth")}: ${lineWidth.value}</span><elf-slider min="1" max="6" step="0.5" :modelValue.prop=${lineWidth.value} @update:modelValue=${onLineWidth}></elf-slider></label>
        <label class="gradient-control"><span>${t("smooth")}: ${smooth.value}</span><elf-slider min="0" max="10" step="1" :modelValue.prop=${smooth.value} @update:modelValue=${onSmooth}></elf-slider></label>
        <label class="gradient-control"><span>${t("padding")}: ${padding.value}</span><elf-slider min="0" max="24" step="1" :modelValue.prop=${padding.value} @update:modelValue=${onPadding}></elf-slider></label>
      </div>
    </div>
  </elf-playground>
`);

export { PageSparklineEx7 };
