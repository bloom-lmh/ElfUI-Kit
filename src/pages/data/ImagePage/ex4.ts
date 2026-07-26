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
    en: "Focus the cover and press Enter or Space. Use arrow keys to navigate, + / − to zoom, 0 to reset, and Esc to close."
  },
  alt: { zh: "湖畔风景预览", en: "Lakeside landscape preview" }
});

const previewImages = [
  "https://picsum.photos/id/1018/1200/800",
  "https://picsum.photos/id/1015/1200/800",
  "https://picsum.photos/id/1019/1200/800"
];

// State
const open = useRef(false);
const activeIndex = useRef(0);

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
        preview-teleported
        :alt=${t("alt")}
        @preview-open=${onPreviewOpen}
        @preview-change=${onPreviewChange}
        @preview-close=${onPreviewClose}
      />
      <p>${t("hint")}</p>
    </div>
  </elf-playground>
`);

export { PageImageEx4 };
