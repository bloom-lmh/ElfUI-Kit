import { defineHtml, defineStyle, useRef } from "@elfui/core";

import { createDocsTranslator } from "../../docsLocale";
import styles from "./demo.scss?inline";

const t = createDocsTranslator({
  title: { zh: "响应式图片与懒加载", en: "Responsive image and lazy loading" },
  pending: { zh: "接近视口后请求", en: "Requested near the viewport" },
  loaded: { zh: "响应式资源已加载", en: "Responsive source loaded" },
  description: {
    zh: "srcset 与 sizes 交给浏览器选择合适资源；lazy 在图片接近视口前保持 src 和 srcset 为空。",
    en: "The browser selects a source from srcset and sizes, while lazy keeps src and srcset empty until the image nears the viewport.",
  },
  loading: { zh: "正在选择并加载合适尺寸", en: "Selecting and loading the right size" },
  controls: { zh: "响应式配置", en: "Responsive controls" },
  fit: { zh: "适配方式", en: "Object fit" },
  height: { zh: "容器高度", en: "Container height" },
  alt: { zh: "山间河谷", en: "Mountain valley" },
});

const source = "https://picsum.photos/id/1018/960/540";
const sourceSet = [
  "https://picsum.photos/id/1018/480/270 480w",
  "https://picsum.photos/id/1018/960/540 960w",
  "https://picsum.photos/id/1018/1440/810 1440w",
].join(", ");

// State
const loaded = useRef(false);
const fit = useRef("cover");
const height = useRef(320);

// Methods
const onLoad = (): void => loaded.set(true);
const eventValue = (event: CustomEvent): unknown =>
  Array.isArray(event.detail) ? event.detail[0] : event.detail;
const onFit = (event: CustomEvent): void => fit.set(String(eventValue(event) || "cover"));
const onHeight = (event: CustomEvent): void => height.set(Number(eventValue(event)) || 320);
const fitOptions = () => ["cover", "contain", "fill"].map((value) => ({ label: value, value }));

const responsiveCode = `<elf-image
  src="valley-960.jpg"
  srcset="valley-480.jpg 480w, valley-960.jpg 960w, valley-1440.jpg 1440w"
  sizes="(max-width: 720px) 100vw, 720px"
  width="100%"
  height="min(52vw, 360px)"
  fit="cover"
  lazy
>
  <div slot="loading">Selecting the right source…</div>
</elf-image>`;

const responsiveScript = `const sources = {
  src: "valley-960.jpg",
  srcset: "valley-480.jpg 480w, valley-960.jpg 960w, valley-1440.jpg 1440w",
  sizes: "(max-width: 720px) 100vw, 720px"
};

const onLoad = (event) => {
  console.info("Browser selected", event.target.currentSrc);
};`;

defineStyle(styles);

const PageImageEx3 = defineHtml(`
  <elf-playground :title=${t("title")} :code=${responsiveCode} :script=${responsiveScript}>
    <span slot="status" class="image-demo-status" role="status" aria-live="polite">
      ${loaded.value ? t("loaded") : t("pending")}
    </span>
    <div class="image-responsive-stage">
      <p>${t("description")}</p>
      <elf-image
        :src=${source}
        :srcset=${sourceSet}
        sizes="(max-width: 720px) 100vw, 720px"
        :alt=${t("alt")}
        width="100%"
        :height=${height.value}
        :fit=${fit.value}
        lazy
        @load=${onLoad}
      >
        <div slot="loading" class="custom-image-loader" role="status">
          <span class="custom-image-loader__ring" aria-hidden="true"></span>
          <span>${t("loading")}</span>
        </div>
      </elf-image>
    </div>
    <aside slot="controls" class="image-demo-controls" :aria-label=${t("controls")}>
      <strong>${t("controls")}</strong>
      <label><span>${t("fit")}</span><elf-select variant="outlined" :options.prop=${fitOptions()} :modelValue.prop=${fit.value} @update:modelValue=${onFit}></elf-select></label>
      <label><span>${t("height")}</span><elf-input-number variant="outlined" :modelValue.prop=${height.value} :min=${180} :max=${420} :step=${20} @update:modelValue=${onHeight}></elf-input-number></label>
    </aside>
  </elf-playground>
`);

export { PageImageEx3 };
