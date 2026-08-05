import { defineHtml, defineStyle, useRef, useTemplateRef } from "@elfui/core";
import { createDocsTranslator } from "../../docsLocale";
import styles from "./demo.scss?inline";

const active = useRef("landscape");
const galleryGrid = useTemplateRef<HTMLElement>("galleryGrid");
const t = createDocsTranslator({
  heading: { zh: "图片分类切换", en: "Image categories" },
  landscape: { zh: "风景", en: "Landscape" },
  city: { zh: "城市", en: "City" },
  abstract: { zh: "抽象", en: "Abstract" },
  current: { zh: "当前分类", en: "Current category" },
});
const tabs = () => [
  { label: t("landscape"), value: "landscape" },
  { label: t("city"), value: "city" },
  { label: t("abstract"), value: "abstract" },
];
interface Photo {
  id: string;
  src: string;
  alt: string;
}
const makePhotos = (category: string, ids: string[]): Photo[] =>
  ids.map((id) => ({
    id,
    src: `https://picsum.photos/id/${id}/640/480`,
    alt: `${category} ${id}`,
  }));
const photoSets = (): Record<string, Photo[]> => ({
  landscape: makePhotos(t("landscape"), ["1018", "1015", "1016", "1039", "1043", "1050"]),
  city: makePhotos(t("city"), ["1040", "1048", "1054", "1067", "1076", "1081"]),
  abstract: makePhotos(t("abstract"), ["1084", "1080", "1069", "1060", "1057", "1031"]),
});
const onChange = (event: CustomEvent): void => {
  active.set(String(event.detail || "landscape"));
  const reducedMotion =
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reducedMotion) return;
  queueMicrotask(() => {
    galleryGrid.value?.animate(
      [
        { opacity: 0, transform: "translateX(28px)" },
        { opacity: 1, transform: "translateX(0)" },
      ],
      { duration: 220, easing: "cubic-bezier(0.2, 0, 0, 1)" },
    );
  });
};
const currentPhotos = (): Photo[] => {
  const photos = photoSets();
  return photos[active.value] ?? photos.landscape!;
};
const statusText = (): string => `${t("current")}: ${active.value}`;

const code = `<elf-tabs :items.prop=\${tabs} :modelValue.prop=\${active.value} grow slider-variant="flat" />
<div :key=\${active.value} class="tabs-gallery-grid">
  <img v-for="photo in currentPhotos()" :src="photo.src" loading="lazy" />
</div>`;
const script = (): string => `const active = useRef("landscape");
const tabs = [
  { label: "${t("landscape")}", value: "landscape" },
  { label: "${t("city")}", value: "city" },
  { label: "${t("abstract")}", value: "abstract" }
];
const photos = { landscape: [], city: [], abstract: [] };
const currentPhotos = () => photos[active.value] || [];
const onChange = (event) => active.set(event.detail);`;

defineStyle(styles);

const PageTabsEx9 = defineHtml(`
  <h2>{{ t("heading") }}</h2>
  <elf-playground :title=${t("heading")} :code=${code} :script=${script()}>
    <span slot="status" role="status" aria-live="polite">${statusText()}</span>
    <div class="tabs-demo-stage">
      <div class="tabs-gallery">
        <elf-tabs
        :key=${t("heading")}
        :items.prop=${tabs()}
        :modelValue.prop=${active.value}
        grow
        slider-variant="flat"
        @update:modelValue=${onChange}
        ></elf-tabs>
        <div ref="galleryGrid" :key=${active.value} class="tabs-gallery-grid" :aria-label=${statusText()}>
          <img
            v-for="photo in currentPhotos()"
            :key="photo.id"
            :src="photo.src"
            :alt="photo.alt"
            loading="lazy"
            decoding="async"
          />
        </div>
      </div>
    </div>
  </elf-playground>
`);

export { PageTabsEx9 };
