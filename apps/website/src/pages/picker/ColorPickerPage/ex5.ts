import { defineHtml, defineStyle, useRef } from "@elfui/core";

import { createDocsTranslator } from "../../docsLocale";

const t = createDocsTranslator({
  title: { zh: "滑块驱动色相", en: "Slider-driven hue" },
  controls: { zh: "颜色控制台", en: "Color controls" },
  hue: { zh: "色相", en: "Hue" },
  saturation: { zh: "饱和度", en: "Saturation" },
  lightness: { zh: "亮度", en: "Lightness" },
  red: { zh: "红", en: "Red" },
  green: { zh: "绿", en: "Green" },
  blue: { zh: "蓝", en: "Blue" },
  label: { zh: "当前颜色", en: "Current color" },
});

const clamp = (value: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, value));

const toHex = (value: number): string =>
  Math.round(clamp(value, 0, 255))
    .toString(16)
    .padStart(2, "0");

const hslToRgb = (
  hueValue: number,
  saturationValue: number,
  lightnessValue: number,
): [number, number, number] => {
  const h = ((hueValue % 360) + 360) % 360;
  const s = clamp(saturationValue, 0, 100) / 100;
  const l = clamp(lightnessValue, 0, 100) / 100;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let rgb: [number, number, number] = [0, 0, 0];
  if (h < 60) rgb = [c, x, 0];
  else if (h < 120) rgb = [x, c, 0];
  else if (h < 180) rgb = [0, c, x];
  else if (h < 240) rgb = [0, x, c];
  else if (h < 300) rgb = [x, 0, c];
  else rgb = [c, 0, x];
  return rgb.map((channel) => Math.round((channel + m) * 255)) as [number, number, number];
};

const rgbToHsl = (
  redValue: number,
  greenValue: number,
  blueValue: number,
): [number, number, number] => {
  const r = clamp(redValue, 0, 255) / 255;
  const g = clamp(greenValue, 0, 255) / 255;
  const b = clamp(blueValue, 0, 255) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;
  const l = (max + min) / 2;
  if (delta === 0) return [0, 0, Math.round(l * 100)];
  const s = delta / (1 - Math.abs(2 * l - 1));
  let h = 0;
  if (max === r) h = ((g - b) / delta) % 6;
  else if (max === g) h = (b - r) / delta + 2;
  else h = (r - g) / delta + 4;
  return [(((h * 60) % 360) + 360) % 360, Math.round(s * 100), Math.round(l * 100)];
};

const red = useRef(103);
const green = useRef(80);
const blue = useRef(164);

const currentColor = (): string => `#${toHex(red.value)}${toHex(green.value)}${toHex(blue.value)}`;
const hue = (): number => rgbToHsl(red.value, green.value, blue.value)[0];
const saturation = (): number => rgbToHsl(red.value, green.value, blue.value)[1];
const lightness = (): number => rgbToHsl(red.value, green.value, blue.value)[2];
const hueLabel = (): string => `${Math.round(hue())}°`;
const swatchStyle = (): { background: string } => ({ background: currentColor() });

const setHsl = (hueValue: number, saturationValue: number, lightnessValue: number): void => {
  const [nextRed, nextGreen, nextBlue] = hslToRgb(hueValue, saturationValue, lightnessValue);
  red.set(nextRed);
  green.set(nextGreen);
  blue.set(nextBlue);
};

const onHue = (event: CustomEvent<number>): void => {
  const [, s, l] = rgbToHsl(red.value, green.value, blue.value);
  setHsl(Number(event.detail), s, l);
};
const onSaturation = (event: CustomEvent<number>): void => {
  const [h, , l] = rgbToHsl(red.value, green.value, blue.value);
  setHsl(h, Number(event.detail), l);
};
const onLightness = (event: CustomEvent<number>): void => {
  const [h, s] = rgbToHsl(red.value, green.value, blue.value);
  setHsl(h, s, Number(event.detail));
};
const onRed = (event: CustomEvent<number>): void => red.set(Number(event.detail));
const onGreen = (event: CustomEvent<number>): void => green.set(Number(event.detail));
const onBlue = (event: CustomEvent<number>): void => blue.set(Number(event.detail));

const onPicker = (event: CustomEvent<string>): void => {
  const match = String(event.detail || "").match(/^#?([\da-f]{6})$/i);
  if (!match) return;
  const hex = match[1]!;
  red.set(Number.parseInt(hex.slice(0, 2), 16));
  green.set(Number.parseInt(hex.slice(2, 4), 16));
  blue.set(Number.parseInt(hex.slice(4, 6), 16));
};

const formatHue = (value: number): string => `${Math.round(value)}°`;
const formatPercent = (value: number): string => `${Math.round(value)}%`;
const formatChannel = (value: number): string => String(Math.round(value));

const code = `<elf-playground>
  <div class="color-console-stage">
    <div class="color-console-swatch" :style="swatchStyle()"></div>
    <elf-color-picker :modelValue="currentColor()" label="Current color" @update:modelValue="onPicker" />
  </div>

  <aside slot="controls" class="color-console">
    <elf-slider :modelValue="hue()" :min="0" :max="360" :step="1" label="Hue" @update:modelValue="onHue" />
    <elf-slider :modelValue="saturation()" :min="0" :max="100" :step="1" label="Saturation" @update:modelValue="onSaturation" />
    <elf-slider :modelValue="lightness()" :min="0" :max="100" :step="1" label="Lightness" @update:modelValue="onLightness" />
    <elf-slider :modelValue="red" :min="0" :max="255" :step="1" label="Red" @update:modelValue="onRed" />
    <elf-slider :modelValue="green" :min="0" :max="255" :step="1" label="Green" @update:modelValue="onGreen" />
    <elf-slider :modelValue="blue" :min="0" :max="255" :step="1" label="Blue" @update:modelValue="onBlue" />
  </aside>
</elf-playground>`;

const script = `const red = useRef(103);
const green = useRef(80);
const blue = useRef(164);

// HSL <-> RGB 转换让操作台中的滑块与取色器双向同步。
// Conversions keep the console sliders and the color picker in sync.
const currentColor = () => "#" + toHex(red.value) + toHex(green.value) + toHex(blue.value);
const hue = () => rgbToHsl(red.value, green.value, blue.value)[0];
const saturation = () => rgbToHsl(red.value, green.value, blue.value)[1];
const lightness = () => rgbToHsl(red.value, green.value, blue.value)[2];

const setHsl = (h, s, l) => {
  const [r, g, b] = hslToRgb(h, s, l);
  red.set(r);
  green.set(g);
  blue.set(b);
};

const onHue = (event) => {
  const [, s, l] = rgbToHsl(red.value, green.value, blue.value);
  setHsl(Number(event.detail), s, l);
};
const onSaturation = (event) => {
  const [h, , l] = rgbToHsl(red.value, green.value, blue.value);
  setHsl(h, Number(event.detail), l);
};
const onLightness = (event) => {
  const [h, s] = rgbToHsl(red.value, green.value, blue.value);
  setHsl(h, s, Number(event.detail));
};
const onRed = (event) => red.set(Number(event.detail));
const onGreen = (event) => green.set(Number(event.detail));
const onBlue = (event) => blue.set(Number(event.detail));

const onPicker = (event) => {
  const match = String(event.detail || "").match(/^#?([\\da-f]{6})$/i);
  if (!match) return;
  const hex = match[1];
  red.set(parseInt(hex.slice(0, 2), 16));
  green.set(parseInt(hex.slice(2, 4), 16));
  blue.set(parseInt(hex.slice(4, 6), 16));
};`;

defineStyle(`
  .color-console-stage {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 20px;
    flex-wrap: wrap;
    padding: 18px 0;
    width: min(720px, 100%);
    margin-inline: auto;
  }

  .color-console-swatch {
    width: 56px;
    height: 56px;
    border: 1px solid var(--elf-border);
    border-radius: 14px;
    box-shadow: inset 0 1px 2px rgb(0 0 0 / 10%);
  }

  .color-console {
    display: grid;
    gap: 12px;
    min-width: 240px;
  }

  .color-console label {
    display: grid;
    gap: 4px;
  }

  .color-console label > span {
    color: var(--elf-text-secondary);
    font-size: var(--elf-font-size-xs);
  }

  .color-console elf-slider {
    width: 100%;
  }
`);

const PageColorPickerEx5 = defineHtml(`
  <elf-playground :title=${t("title")} :code=${code} :script=${script}>
    <span slot="status" class="demo-state" role="status" aria-live="polite">
      ${t("hue")} {{ hueLabel() }} · {{ currentColor() }}
    </span>

    <div class="color-console-stage">
      <div class="color-console-swatch" :style="swatchStyle()"></div>
      <elf-color-picker
        :modelValue.prop=${currentColor()}
        :label=${t("label")}
        @update:modelValue=${onPicker}
      ></elf-color-picker>
    </div>

    <aside slot="controls" class="color-console" :aria-label=${t("controls")}>
      <strong>${t("controls")}</strong>
      <label><span>${t("hue")}</span><elf-slider :modelValue.prop=${hue()} :min=${0} :max=${360} :step=${1} :formatValueText=${formatHue} @update:modelValue=${onHue}></elf-slider></label>
      <label><span>${t("saturation")}</span><elf-slider :modelValue.prop=${saturation()} :min=${0} :max=${100} :step=${1} :formatValueText=${formatPercent} @update:modelValue=${onSaturation}></elf-slider></label>
      <label><span>${t("lightness")}</span><elf-slider :modelValue.prop=${lightness()} :min=${0} :max=${100} :step=${1} :formatValueText=${formatPercent} @update:modelValue=${onLightness}></elf-slider></label>
      <label><span>${t("red")}</span><elf-slider :modelValue.prop=${red} :min=${0} :max=${255} :step=${1} :formatValueText=${formatChannel} @update:modelValue=${onRed}></elf-slider></label>
      <label><span>${t("green")}</span><elf-slider :modelValue.prop=${green} :min=${0} :max=${255} :step=${1} :formatValueText=${formatChannel} @update:modelValue=${onGreen}></elf-slider></label>
      <label><span>${t("blue")}</span><elf-slider :modelValue.prop=${blue} :min=${0} :max=${255} :step=${1} :formatValueText=${formatChannel} @update:modelValue=${onBlue}></elf-slider></label>
    </aside>
  </elf-playground>
`);

export { PageColorPickerEx5 };
