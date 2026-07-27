import { defineHtml, defineStyle, useRef } from "@elfui/core";
import { createDocsTranslator } from "../../docsLocale";
import styles from "./demo.scss?inline";

const active = useRef("landscape");
const t = createDocsTranslator({
  heading: { zh: "图片分类切换", en: "Image categories" },
  title: { zh: "带懒加载与过渡的图片标签页", en: "Image tabs with lazy loading and transitions" },
  landscape: { zh: "风景", en: "Landscape" },
  city: { zh: "城市", en: "City" },
  abstract: { zh: "抽象", en: "Abstract" },
  current: { zh: "当前分类", en: "Current category" }
});
const tabs = () => [
  { label: t("landscape"), value: "landscape" },
  { label: t("city"), value: "city" },
  { label: t("abstract"), value: "abstract" }
];
interface Photo { id: string; src: string; alt: string; }
const makePhotos = (category: string, ids: string[]): Photo[] =>
  ids.map((id) => ({ id, src: `https://picsum.photos/id/${id}/640/480`, alt: `${category} ${id}` }));
const photos: Record<string, Photo[]> = {
  landscape: makePhotos("Landscape", ["1018", "1015", "1016", "1039", "1043", "1050"]),
  city: makePhotos("City", ["1040", "1048", "1054", "1067", "1076", "1081"]),
  abstract: makePhotos("Abstract", ["1084", "1080", "1069", "1060", "1057", "1031"])
};
const onChange = (event: CustomEvent): void => active.set(String(event.detail || "landscape"));
const currentPhotos = (): Photo[] => photos[active.value] ?? photos.landscape!;

const code = `<elf-tabs :items.prop=\${tabs} :modelValue.prop=\${active.value} grow />
<div :key=\${active.value} class="gallery">
  <img v-for="photo in currentPhotos()" :src="photo.src" loading="lazy" />
</div>`;
const script = `const active = useRef("landscape");
const tabs = [
  { label: "风景", value: "landscape" },
  { label: "城市", value: "city" },
  { label: "抽象", value: "abstract" }
];
const photos = { landscape: [], city: [], abstract: [] };
const currentPhotos = () => photos[active.value] || [];
const onChange = (event) => active.set(event.detail);`;

defineStyle(styles);

const PageTabsEx9 = defineHtml(`
  <h2>{{ t("heading") }}</h2>
  <elf-playground :title=${t("title")} :code=${code} :script=${script}>
    <span slot="status" class="demo-state">{{ t("current") }}：{{ active }}</span>
    <div class="tabs-gallery">
      <elf-tabs
        :key=${t("title")}
        :items.prop=${tabs()}
        :modelValue.prop=${active.value}
        grow
        transition="slide"
        @update:modelValue=${onChange}
      ></elf-tabs>
      <div :key=${active.value} class="tabs-gallery-grid" :aria-label=${`${t("current")}：${active.value}`}>
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
  </elf-playground>
`);

export { PageTabsEx9 };
