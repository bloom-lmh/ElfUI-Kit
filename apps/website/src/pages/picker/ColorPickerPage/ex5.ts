import { defineHtml, defineStyle, useRef } from "@elfui/core";

import { createDocsTranslator } from "../../docsLocale";

const t = createDocsTranslator({
  title: { zh: "滑块驱动色相", en: "Slider-driven hue" },
  hue: { zh: "色相", en: "Hue" },
  label: { zh: "品牌色", en: "Brand color" },
});

const hueToHex = (hue: number): string => {
  const h = ((hue % 360) + 360) % 360;
  const c = (1 - Math.abs(2 * 0.55 - 1)) * 0.8;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = 0.55 - c / 2;
  let rgb: [number, number, number] = [0, 0, 0];
  if (h < 60) rgb = [c, x, 0];
  else if (h < 120) rgb = [x, c, 0];
  else if (h < 180) rgb = [0, c, x];
  else if (h < 240) rgb = [0, x, c];
  else if (h < 300) rgb = [x, 0, c];
  else rgb = [c, 0, x];
  return `#${rgb
    .map((channel) =>
      Math.round((channel + m) * 255)
        .toString(16)
        .padStart(2, "0"),
    )
    .join("")}`;
};

const hexToHue = (value: string): number => {
  const match = String(value).match(/^#?([\da-f]{6})$/i);
  if (!match) return 210;
  const hex = match[1]!;
  const r = Number.parseInt(hex.slice(0, 2), 16) / 255;
  const g = Number.parseInt(hex.slice(2, 4), 16) / 255;
  const b = Number.parseInt(hex.slice(4, 6), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;
  if (delta === 0) return 0;
  let h = 0;
  if (max === r) h = ((g - b) / delta) % 6;
  else if (max === g) h = (b - r) / delta + 2;
  else h = (r - g) / delta + 4;
  return Math.round((h * 60 + 360) % 360);
};

const hue = useRef(210);

const currentColor = (): string => hueToHex(hue.value);
const formatHue = (value: number): string => `${value}°`;
const onSlider = (event: CustomEvent<number>): void => {
  hue.set(Number(event.detail));
};
const onPicker = (event: CustomEvent<string>): void => {
  hue.set(hexToHue(String(event.detail || "")));
};

const code = `<elf-slider
  :modelValue="hue"
  :min="0"
  :max="360"
  :step="1"
  label="Hue"
  @update:modelValue="onSlider"
/>
<elf-color-picker
  :modelValue="color()"
  label="Brand color"
  @update:modelValue="onPicker"
/>`;

const script = `const hue = useRef(210);
const hueToHex = (hue) => {
  const h = ((hue % 360) + 360) % 360;
  const c = (1 - Math.abs(2 * 0.55 - 1)) * 0.8;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = 0.55 - c / 2;
  let rgb = [0, 0, 0];
  if (h < 60) rgb = [c, x, 0];
  else if (h < 120) rgb = [x, c, 0];
  else if (h < 180) rgb = [0, c, x];
  else if (h < 240) rgb = [0, x, c];
  else if (h < 300) rgb = [x, 0, c];
  else rgb = [c, 0, x];
  return '#' + rgb.map((v) => Math.round((v + m) * 255).toString(16).padStart(2, '0')).join('');
};
const hexToHue = (value) => {
  const match = String(value).match(/^#?([\\da-f]{6})$/i);
  if (!match) return 210;
  const hex = match[1];
  const r = parseInt(hex.slice(0, 2), 16) / 255;
  const g = parseInt(hex.slice(2, 4), 16) / 255;
  const b = parseInt(hex.slice(4, 6), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;
  if (delta === 0) return 0;
  let h = 0;
  if (max === r) h = ((g - b) / delta) % 6;
  else if (max === g) h = (b - r) / delta + 2;
  else h = (r - g) / delta + 4;
  return Math.round((h * 60 + 360) % 360);
};
const color = () => hueToHex(hue.value);
const onSlider = (event) => hue.set(Number(event.detail));
const onPicker = (event) => hue.set(hexToHue(event.detail));`;

defineStyle(`
  .slider-color-stage {
    display: grid;
    grid-template-columns: minmax(220px, 320px) minmax(260px, 1fr);
    align-items: center;
    gap: 24px;
    width: min(720px, 100%);
  }
  .slider-color-stage elf-slider {
    width: 100%;
  }
  @media (max-width: 640px) {
    .slider-color-stage {
      grid-template-columns: 1fr;
    }
  }
`);

const PageColorPickerEx5 = defineHtml(`
  <elf-playground :title=${t("title")} :code=${code} :script=${script}>
    <span slot="status" role="status" aria-live="polite">${t("hue")}: {{ hue }} · {{ currentColor() }}</span>
    <div class="slider-color-stage">
      <elf-slider
        :modelValue.prop=${hue}
        :min=${0}
        :max=${360}
        :step=${1}
        :label=${t("hue")}
        :formatValueText=${formatHue}
        @update:modelValue=${onSlider}
      ></elf-slider>
      <elf-color-picker
        :modelValue.prop=${currentColor()}
        :label=${t("label")}
        @update:modelValue=${onPicker}
      ></elf-color-picker>
    </div>
  </elf-playground>
`);

export { PageColorPickerEx5 };
