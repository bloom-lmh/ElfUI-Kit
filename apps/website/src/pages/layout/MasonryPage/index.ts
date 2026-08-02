import { defineHtml, defineStyle } from "@elfui/core";
import { createDocsTranslator } from "../../docsLocale";

const t = createDocsTranslator({
  title: { zh: "瀑布流", en: "Masonry" },
  description: {
    zh: "适合图片墙、灵感卡片和内容高度不一致的编辑型页面；宽度不足时会自动减少列数。",
    en: "Arrange image walls, inspiration cards, and editorial content of varying heights; the column count decreases automatically when space is limited.",
  },
  exampleTitle: { zh: "响应式图片瀑布流", en: "Responsive image masonry" },
  status: { zh: "最多 4 列 · 最小列宽 230px", en: "Up to 4 columns · 230px minimum column width" },
  mountainTitle: { zh: "多洛米蒂山雾", en: "Mist over Dolomites" },
  mountainMeta: { zh: "意大利 · 山地", en: "Italy · Mountains" },
  architectureTitle: { zh: "静谧建筑", en: "Quiet architecture" },
  architectureMeta: { zh: "京都 · 建筑", en: "Kyoto · Architecture" },
  coastTitle: { zh: "海岸习作", en: "Coastal study" },
  coastMeta: { zh: "冰岛 · 海岸", en: "Iceland · Coast" },
  forestTitle: { zh: "森林律动", en: "Forest rhythm" },
  forestMeta: { zh: "挪威 · 森林", en: "Norway · Forest" },
  cityTitle: { zh: "蓝调时刻", en: "Blue hour" },
  cityMeta: { zh: "赫尔辛基 · 城市", en: "Helsinki · City" },
  desertTitle: { zh: "沙漠光影", en: "Desert light" },
  desertMeta: { zh: "摩洛哥 · 旅途", en: "Morocco · Journey" },
  lakeTitle: { zh: "晨间湖泊", en: "Morning lake" },
  lakeMeta: { zh: "瑞士 · 湖泊", en: "Switzerland · Lake" },
  columnsDescription: { zh: "最大列数", en: "Maximum number of columns." },
  widthDescription: {
    zh: "自动减少列数时使用的最小列宽",
    en: "Minimum column width used when reducing the column count automatically.",
  },
  gapDescription: { zh: "列与卡片之间的间距", en: "Spacing between columns and cards." },
  slotDescription: {
    zh: "参与瀑布流排布的卡片内容",
    en: "Card content arranged by the masonry layout.",
  },
});

const cards = [
  {
    title: t("mountainTitle"),
    meta: t("mountainMeta"),
    image: "https://picsum.photos/seed/elf-mountain/640/440",
    imageHeight: 220,
  },
  {
    title: t("architectureTitle"),
    meta: t("architectureMeta"),
    image: "https://picsum.photos/seed/elf-architecture/640/520",
    imageHeight: 260,
  },
  {
    title: t("coastTitle"),
    meta: t("coastMeta"),
    image: "https://picsum.photos/seed/elf-coast/640/360",
    imageHeight: 180,
  },
  {
    title: t("forestTitle"),
    meta: t("forestMeta"),
    image: "https://picsum.photos/seed/elf-forest/640/480",
    imageHeight: 240,
  },
  {
    title: t("cityTitle"),
    meta: t("cityMeta"),
    image: "https://picsum.photos/seed/elf-city/640/400",
    imageHeight: 200,
  },
  {
    title: t("desertTitle"),
    meta: t("desertMeta"),
    image: "https://picsum.photos/seed/elf-desert/640/560",
    imageHeight: 280,
  },
  {
    title: t("lakeTitle"),
    meta: t("lakeMeta"),
    image: "https://picsum.photos/seed/elf-lake/640/420",
    imageHeight: 210,
  },
];

const code = `<elf-masonry columns="4" min-column-width="230" gap="lg">
  <article v-for="item in cards" :key="item.title">
    <img :src="item.image" :alt="item.title" />
    <h3>{{ item.title }}</h3>
    <p>{{ item.meta }}</p>
  </article>
</elf-masonry>`;

const script = `const cards = [
  { title: "${t("mountainTitle")}", meta: "${t("mountainMeta")}", image: "...", imageHeight: 220 },
  { title: "${t("architectureTitle")}", meta: "${t("architectureMeta")}", image: "...", imageHeight: 260 }
];`;

const imageStyle = (height: number): string => `height:${height}px`;

defineStyle(`
  :host { display:block; }
  * { box-sizing:border-box; }
  .masonry-card { overflow:hidden; border:1px solid var(--elf-border); border-radius:6px; background:var(--elf-bg-paper); }
  .masonry-card img { display:block; width:100%; object-fit:cover; border-radius:4px 4px 0 0; background:var(--elf-bg-overlay); }
  .masonry-copy { padding:14px 15px 16px; }
  .masonry-copy h3 { margin:0 0 6px; color:var(--elf-text-primary); font-size:16px; }
  .masonry-copy p { margin:0; color:var(--elf-text-secondary); font-size:13px; }
`);

const PageMasonry = defineHtml(`
  <elf-container>
    <elf-docs-hero category="layout" :title=${t("title")} :description=${t("description")}></elf-docs-hero>
    <elf-playground :title=${t("exampleTitle")} :code=${code} :script=${script}>
      <span slot="status" class="demo-state">${t("status")}</span>
      <elf-masonry columns="4" min-column-width="230" gap="lg" style="width:100%">
        <article v-for="card in cards" :key="card.title" class="masonry-card">
          <img :src="card.image" :alt="card.title" :style="imageStyle(card.imageHeight)" loading="lazy" />
          <div class="masonry-copy"><h3>{{ card.title }}</h3><p>{{ card.meta }}</p></div>
        </article>
      </elf-masonry>
    </elf-playground>
    <h2>API</h2>
    <elf-props-table title="Masonry Props" :rows=${[
      { name: "columns", type: "number", default: "3", desc: t("columnsDescription") },
      {
        name: "min-column-width",
        type: "string | number",
        default: "240",
        desc: t("widthDescription"),
      },
      { name: "gap", type: "token | CSS length", default: "md", desc: t("gapDescription") },
    ]}></elf-props-table>
    <elf-props-table title="Slots" :rows=${[
      { name: "default", type: "—", default: "—", desc: t("slotDescription") },
    ]}></elf-props-table>
  </elf-container>
`);

export { PageMasonry };
