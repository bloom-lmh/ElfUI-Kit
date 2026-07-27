import { defineHtml, defineStyle } from "@elfui/core";

const cards = [
  { title: "Mist over Dolomites", meta: "意大利 · 山地", image: "https://picsum.photos/seed/elf-mountain/640/440", imageHeight: 220 },
  { title: "Quiet architecture", meta: "京都 · 建筑", image: "https://picsum.photos/seed/elf-architecture/640/520", imageHeight: 260 },
  { title: "Coastal study", meta: "冰岛 · 海岸", image: "https://picsum.photos/seed/elf-coast/640/360", imageHeight: 180 },
  { title: "Forest rhythm", meta: "挪威 · 森林", image: "https://picsum.photos/seed/elf-forest/640/480", imageHeight: 240 },
  { title: "Blue hour", meta: "赫尔辛基 · 城市", image: "https://picsum.photos/seed/elf-city/640/400", imageHeight: 200 },
  { title: "Desert light", meta: "摩洛哥 · 旅途", image: "https://picsum.photos/seed/elf-desert/640/560", imageHeight: 280 },
  { title: "Morning lake", meta: "瑞士 · 湖泊", image: "https://picsum.photos/seed/elf-lake/640/420", imageHeight: 210 }
];

const code = `<elf-masonry columns="4" min-column-width="230" gap="lg">
  <article v-for="item in cards" :key="item.title">
    <img :src="item.image" :alt="item.title" />
    <h3>{{ item.title }}</h3>
    <p>{{ item.meta }}</p>
  </article>
</elf-masonry>`;

const script = `const cards = [
  { title: "Mist over Dolomites", image: "...", imageHeight: 220 },
  { title: "Quiet architecture", image: "...", imageHeight: 260 }
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
    <h1>Masonry 瀑布流</h1>
    <p>适合图片墙、灵感卡片和内容高度不一致的编辑型页面；宽度不足时会自动减少列数。</p>
    <elf-playground title="响应式图片瀑布流" :code=${code} :script=${script}>
      <span slot="status" class="demo-state">最多 4 列 · 最小列宽 230px</span>
      <elf-masonry columns="4" min-column-width="230" gap="lg" style="width:100%">
        <article v-for="card in cards" :key="card.title" class="masonry-card">
          <img :src="card.image" :alt="card.title" :style="imageStyle(card.imageHeight)" loading="lazy" />
          <div class="masonry-copy"><h3>{{ card.title }}</h3><p>{{ card.meta }}</p></div>
        </article>
      </elf-masonry>
    </elf-playground>
    <h2>API</h2>
    <elf-props-table title="Masonry Props" :rows=${[
      { name: "columns", type: "number", default: "3", desc: "最大列数" },
      { name: "min-column-width", type: "string | number", default: "240", desc: "自动减少列数时的最小列宽" },
      { name: "gap", type: "token | CSS length", default: "md", desc: "列与卡片间距" }
    ]}></elf-props-table>
  </elf-container>
`);

export { PageMasonry };
