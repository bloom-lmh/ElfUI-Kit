import { defineHtml, defineStyle, useRef } from "@elfui/core";

import { createDocsTranslator } from "../../docsLocale";
import styles from "./demo.scss?inline";

const t = createDocsTranslator({
  title: { zh: "预览组与键盘", en: "Preview group and keyboard" },
  closed: { zh: "预览已关闭", en: "Preview closed" },
  open: { zh: "预览已打开", en: "Preview open" },
  image: { zh: "第 {index} 张", en: "Image {index}" },
  hint: {
    zh: "聚焦封面后按 Enter / Space 打开；方向键切换，+ / − 缩放，0 重置，Esc 关闭。",
    en: "Focus the cover and press Enter or Space. Use arrow keys to navigate, + / − to zoom, 0 to reset, and Esc to close.",
  },
  controls: { zh: "预览配置", en: "Preview controls" },
  teleported: { zh: "挂载到 body", en: "Teleport to body" },
  toolbar: { zh: "显示缩放工具栏", en: "Show zoom toolbar" },
  zoomRate: { zh: "缩放步进", en: "Zoom step" },
  alt: { zh: "湖畔风景预览", en: "Lakeside landscape preview" },
});

const previewImages = [
  "https://picsum.photos/id/1018/1200/800",
  "https://picsum.photos/id/1015/1200/800",
  "https://picsum.photos/id/1019/1200/800",
];

// State
const open = useRef(false);
const activeIndex = useRef(0);
const teleported = useRef(true);
const toolbar = useRef(true);
const zoomRate = useRef(1.2);

// Derived state
const statusText = (): string => {
  const state = open.value ? t("open") : t("closed");
  const image = t("image").replace("{index}", String(activeIndex.value + 1));
  return `${state} · ${image} / ${previewImages.length}`;
};

// Methods
const readIndex = (event: CustomEvent): number => Number(event.detail) || 0;
const onPreviewOpen = (event: CustomEvent): void => {
  activeIndex.set(readIndex(event));
  open.set(true);
};
const onPreviewChange = (event: CustomEvent): void => activeIndex.set(readIndex(event));
const onPreviewClose = (event: CustomEvent): void => {
  activeIndex.set(readIndex(event));
  open.set(false);
};
const eventValue = (event: CustomEvent): unknown =>
  Array.isArray(event.detail) ? event.detail[0] : event.detail;
const onTeleported = (event: CustomEvent): void => teleported.set(Boolean(eventValue(event)));
const onToolbar = (event: CustomEvent): void => toolbar.set(Boolean(eventValue(event)));
const onZoomRate = (event: CustomEvent): void => zoomRate.set(Number(eventValue(event)) || 1.2);

const previewCode = `<elf-image
  :src=\${previewImages[0]}
  :preview-src-list.prop=\${previewImages}
  :initial-index="0"
  width="560"
  height="300"
  fit="cover"
  preview-teleported
  @preview-open=\${onPreviewOpen}
  @preview-change=\${onPreviewChange}
  @preview-close=\${onPreviewClose}
/>`;

const previewScript = `const previewImages = [
  "/lake-wide.jpg",
  "/mountain-wide.jpg",
  "/coast-wide.jpg"
];

const open = useRef(false);
const activeIndex = useRef(0);

const onPreviewOpen = (event) => {
  activeIndex.set(event.detail);
  open.set(true);
};
const onPreviewChange = (event) => activeIndex.set(event.detail);
const onPreviewClose = () => open.set(false);`;

defineStyle(styles);

const PageImageEx4 = defineHtml(`
  <elf-playground :title=${t("title")} :code=${previewCode} :script=${previewScript}>
    <span slot="status" class="image-demo-status" role="status" aria-live="polite">
      ${statusText()}
    </span>
    <div class="image-preview-stage">
      <elf-image
        :src=${previewImages[0]}
        :previewSrcList.prop=${previewImages}
        :initialIndex=${0}
        width="560"
        height="300"
        fit="cover"
        :previewTeleported.prop=${teleported.value}
        :toolbar.prop=${toolbar.value}
        :zoomRate.prop=${zoomRate.value}
        :alt=${t("alt")}
        @preview-open=${onPreviewOpen}
        @preview-change=${onPreviewChange}
        @preview-close=${onPreviewClose}
      />
      <p>${t("hint")}</p>
    </div>
    <aside slot="controls" class="image-demo-controls" :aria-label=${t("controls")}>
      <strong>${t("controls")}</strong>
      <elf-checkbox :modelValue.prop=${teleported.value} :label=${t("teleported")} @update:modelValue=${onTeleported}></elf-checkbox>
      <elf-checkbox :modelValue.prop=${toolbar.value} :label=${t("toolbar")} @update:modelValue=${onToolbar}></elf-checkbox>
      <label><span>${t("zoomRate")}</span><elf-input-number variant="outlined" :modelValue.prop=${zoomRate.value} :min=${1.05} :max=${2} :step=${0.05} :precision=${2} @update:modelValue=${onZoomRate}></elf-input-number></label>
    </aside>
  </elf-playground>
`);

export { PageImageEx4 };
