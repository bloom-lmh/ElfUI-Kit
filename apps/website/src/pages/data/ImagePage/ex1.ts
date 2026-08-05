import { defineHtml, defineStyle, useRef } from "@elfui/core";

import { createDocsTranslator } from "../../docsLocale";
import styles from "./demo.scss?inline";

const t = createDocsTranslator({
  title: { zh: "对象适配控制台", en: "Object-fit playground" },
  status: { zh: "实时配置图片容器", en: "Live image configuration" },
  controls: { zh: "配置", en: "Configuration" },
  fit: { zh: "适配方式", en: "Object fit" },
  width: { zh: "宽度", en: "Width" },
  height: { zh: "高度", en: "Height" },
  fill: { zh: "拉伸填满", en: "Stretch to fill" },
  contain: { zh: "完整显示", en: "Show all content" },
  cover: { zh: "等比裁切", en: "Crop proportionally" },
  none: { zh: "保持原始尺寸", en: "Keep intrinsic size" },
  scaleDown: { zh: "仅在需要时缩小", en: "Shrink only when needed" },
  fitNote: {
    zh: "真实图片比例会影响各适配方式的裁切和留白结果",
    en: "The source photo ratio affects cropping and empty space for each fit mode.",
  },
  alt: { zh: "山野风景照片", en: "Mountain landscape photo" },
});

const imageSrc =
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=85";

const fit = useRef("cover");
const width = useRef(320);
const height = useRef(220);

const eventValue = (event: CustomEvent): unknown =>
  Array.isArray(event.detail) ? event.detail[0] : event.detail;
const onFit = (event: CustomEvent): void => fit.set(String(eventValue(event) || "cover"));
const onWidth = (event: CustomEvent): void => width.set(Number(eventValue(event)) || 320);
const onHeight = (event: CustomEvent): void => height.set(Number(eventValue(event)) || 220);
const fitOptions = () =>
  ["fill", "contain", "cover", "none", "scale-down"].map((value) => ({ label: value, value }));
const fitCode = (): string => `<elf-image
  src="${imageSrc}"
  width="${width.value}"
  height="${height.value}"
  fit="${fit.value}"
/>`;

const fitScript = `const fits = ["fill", "contain", "cover", "none", "scale-down"];
const imageSrc = "${imageSrc}";`;

defineStyle(styles);

const PageImageEx1 = defineHtml(`
  <elf-playground :title=${t("title")} :code=${fitCode()} :script=${fitScript}>
    <span slot="status" class="image-demo-status">${t("status")}</span>
    <div class="image-fit-stage">
      <elf-image :src=${imageSrc} :alt=${t("alt")} :width=${width.value} :height=${height.value} :fit=${fit.value} />
    </div>
    <aside slot="controls" class="image-demo-controls" :aria-label=${t("controls")}>
      <strong>${t("controls")}</strong>
      <label><elf-select variant="outlined" :label=${t("fit")} :options.prop=${fitOptions()} :modelValue.prop=${fit.value} @update:modelValue=${onFit}></elf-select></label>
      <small class="image-fit-note">* ${t("fitNote")}</small>
      <label><span>${t("width")}</span><elf-input-number variant="outlined" :modelValue.prop=${width.value} :min=${180} :max=${520} :step=${20} @update:modelValue=${onWidth}></elf-input-number></label>
      <label><span>${t("height")}</span><elf-input-number variant="outlined" :modelValue.prop=${height.value} :min=${132} :max=${360} :step=${12} @update:modelValue=${onHeight}></elf-input-number></label>
    </aside>
  </elf-playground>
`);

export { PageImageEx1 };
