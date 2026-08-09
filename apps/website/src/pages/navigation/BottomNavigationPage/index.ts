import { defineHtml, defineStyle, useRef } from "@elfui/core";
import {
  mdiBookOpenPageVariantOutline,
  mdiHeartOutline,
  mdiHistory,
  mdiImageOutline,
  mdiMapMarkerOutline,
  mdiMusicNoteOutline,
  mdiPlayCircleOutline,
} from "@mdi/js";

import { createSvgIconSet } from "@elfui/kit";
import { createDocsPicker, createDocsTranslator } from "../../docsLocale";
import articleStyles from "../../shared/article.scss?inline";

const t = createDocsTranslator({
  kicker: { zh: "导航组件", en: "Navigation" },
  title: { zh: "底部导航栏", en: "Bottom navigation" },
  description: {
    zh: "为移动端核心目的地提供稳定、可触达的入口，包含选中反馈、徽标、铺满、水平和 shift 模式。",
    en: "Keep primary mobile destinations within reach with selection feedback, badges, grow, horizontal, and shift modes.",
  },
  color: { zh: "颜色", en: "Color" },
  grow: { zh: "铺满", en: "Grow" },
  horizontal: { zh: "水平", en: "Horizontal" },
  shift: { zh: "Shift 模式", en: "Shift mode" },
  visibility: { zh: "切换", en: "Toggle" },
  recent: { zh: "最近", en: "Recent" },
  favorites: { zh: "收藏", en: "Favorites" },
  nearby: { zh: "附近", en: "Nearby" },
  video: { zh: "视频", en: "Video" },
  music: { zh: "音乐", en: "Music" },
  books: { zh: "图书", en: "Books" },
  photos: { zh: "图片", en: "Photos" },
  videoTitle: { zh: "精选视频", en: "Featured videos" },
  videoSummary: {
    zh: "浏览本周热门视频，切换目的地时导航强调色会跟随当前分类。",
    en: "Browse this week's top videos; the navigation accent follows the active destination.",
  },
  musicTitle: { zh: "每日推荐", en: "Daily picks" },
  musicSummary: {
    zh: "根据你的收听习惯生成的新歌单，随音乐分类切换强调色。",
    en: "Fresh playlists based on your listening habits, accented by the music destination.",
  },
  booksTitle: { zh: "我的书架", en: "My library" },
  booksSummary: {
    zh: "最近在读与稍后阅读的合集，随图书分类切换强调色。",
    en: "Currently reading and saved-for-later titles, accented by the library destination.",
  },
  photosTitle: { zh: "时光相册", en: "Photo gallery" },
  photosSummary: {
    zh: "按时间线整理的照片回忆，随图片分类切换强调色。",
    en: "Memories organized by timeline, accented by the gallery destination.",
  },
  overview: { zh: "今日概览", en: "Today's overview" },
  summary: {
    zh: "从底部切换目的地，内容区会立即反映当前选择。",
    en: "Choose a destination from the bottom edge and the content updates immediately.",
  },
  selected: { zh: "当前目的地", en: "Current destination" },
  toggle: { zh: "显示或隐藏导航", en: "Show or hide navigation" },
  hideOnScroll: { zh: "滚动隐藏", en: "Hide on scroll" },
  visible: { zh: "显示中", en: "Visible" },
  hidden: { zh: "已隐藏", en: "Hidden" },
  message: { zh: "消息", en: "Message" },
  minute: { zh: " 分钟前", en: " min ago" },
  api: { zh: "API", en: "API" },
  events: { zh: "事件", en: "Events" },
});
const pick = createDocsPicker();

const baseSelected = useRef("favorites");
const growSelected = useRef("favorites");
const horizontalSelected = useRef("favorites");
const mediaSelected = useRef("video");
const visibilitySelected = useRef("favorites");
const scrollSelected = useRef("favorites");
const visible = useRef(true);
const hideVisible = useRef(true);
const lastScroll = useRef(0);
const onVisible = (event: Event): void => visible.set(Boolean((event as CustomEvent).detail));
const eventValue = (event: CustomEvent): string =>
  String(Array.isArray(event.detail) ? event.detail[0] : event.detail);
const onBaseSelect = (event: CustomEvent): void => baseSelected.set(eventValue(event));
const onGrowSelect = (event: CustomEvent): void => growSelected.set(eventValue(event));
const onHorizontalSelect = (event: CustomEvent): void => horizontalSelected.set(eventValue(event));
const onMediaSelect = (event: CustomEvent): void => mediaSelected.set(eventValue(event));
const onVisibilitySelect = (event: CustomEvent): void => visibilitySelected.set(eventValue(event));
const onScrollSelect = (event: CustomEvent): void => scrollSelected.set(eventValue(event));
const onStageScroll = (event: Event): void => {
  const target = event.currentTarget as HTMLElement;
  const top = target.scrollTop;
  if (top <= 24) hideVisible.set(true);
  else if (top > lastScroll.value + 4) hideVisible.set(false);
  else if (top < lastScroll.value - 4) hideVisible.set(true);
  lastScroll.set(top);
};
const mediaAccents: Record<string, string> = {
  video: "#1e88e5",
  music: "#00897b",
  books: "#6d4c41",
  photos: "#5e35b1",
};
const mediaBackdrops: Record<string, string> = {
  video: "#1565c0",
  music: "#00897b",
  books: "#6d4c41",
  photos: "#5e35b1",
};
const mediaCopy = (): Record<string, { title: string; summary: string }> => ({
  video: { title: t("videoTitle"), summary: t("videoSummary") },
  music: { title: t("musicTitle"), summary: t("musicSummary") },
  books: { title: t("booksTitle"), summary: t("booksSummary") },
  photos: { title: t("photosTitle"), summary: t("photosSummary") },
});
const mediaTitle = (): string => mediaCopy()[mediaSelected.value]?.title ?? "";
const mediaSummary = (): string => mediaCopy()[mediaSelected.value]?.summary ?? "";
const mediaAccent = (): string => mediaAccents[mediaSelected.value] ?? "#1e88e5";
const mediaBackdrop = (): string => mediaBackdrops[mediaSelected.value] ?? mediaBackdrops.video!;
const mediaAccentStyle = (): Record<string, string> => ({ color: mediaAccent() });
const mediaBackdropStyle = (): Record<string, string> => ({ background: mediaBackdrop() });
const feedRows = (): Array<{ title: string; time: string }> =>
  Array.from({ length: 8 }, (_, index) => ({
    title: `${t("message")} ${index + 1}`,
    time: `${index + 1}${t("minute")}`,
  }));
const bottomNavigationIconOptions = {
  defaultSet: "mdi",
  sets: {
    mdi: createSvgIconSet({
      recent: mdiHistory,
      favorites: mdiHeartOutline,
      nearby: mdiMapMarkerOutline,
      video: mdiPlayCircleOutline,
      music: mdiMusicNoteOutline,
      books: mdiBookOpenPageVariantOutline,
      photos: mdiImageOutline,
    }),
  },
};
const standardItems = () => [
  { label: t("recent"), value: "recent", icon: "recent" },
  { label: t("favorites"), value: "favorites", icon: "favorites", badge: 7 },
  { label: t("nearby"), value: "nearby", icon: "nearby" },
];
const mediaItems = () => [
  { label: t("video"), value: "video", icon: "video" },
  { label: t("music"), value: "music", icon: "music" },
  { label: t("books"), value: "books", icon: "books" },
  { label: t("photos"), value: "photos", icon: "photos" },
];

const propsRows = () => [
  {
    name: "items",
    type: "BottomNavigationItem[]",
    default: "[]",
    desc: pick(
      "标签、值、图标、徽标和禁用状态",
      "Labels, values, icons, badges, and disabled states.",
    ),
  },
  {
    name: "modelValue",
    type: "string | number | null",
    default: "null",
    desc: pick("受控值和非受控初始值", "Controlled value and uncontrolled initial value."),
  },
  {
    name: "defaultValue",
    type: "string | number | null",
    default: "null",
    desc: pick("受控值和非受控初始值", "Controlled value and uncontrolled initial value."),
  },
  {
    name: "active",
    type: "boolean",
    default: "true",
    desc: pick("显隐状态和强制选中", "Visibility and required selection."),
  },
  {
    name: "mandatory",
    type: "boolean",
    default: "false",
    desc: pick("显隐状态和强制选中", "Visibility and required selection."),
  },
  {
    name: "grow",
    type: "boolean",
    default: "false",
    desc: pick(
      "铺满、水平，以及非活动标签淡出并位移图标的 shift 模式",
      "Grow, horizontal, and shift modes that fade inactive labels and move icons.",
    ),
  },
  {
    name: "horizontal",
    type: "boolean",
    default: "false",
    desc: pick(
      "铺满、水平，以及非活动标签淡出并位移图标的 shift 模式",
      "Grow, horizontal, and shift modes that fade inactive labels and move icons.",
    ),
  },
  {
    name: "shift",
    type: "boolean",
    default: "false",
    desc: pick(
      "铺满、水平，以及非活动标签淡出并位移图标的 shift 模式",
      "Grow, horizontal, and shift modes that fade inactive labels and move icons.",
    ),
  },
  {
    name: "color",
    type: "string",
    default: "primary",
    desc: pick("选中反馈色和表面色", "Selection feedback and surface colors."),
  },
  {
    name: "backgroundColor",
    type: "string",
    default: "surface",
    desc: pick("选中反馈色和表面色", "Selection feedback and surface colors."),
  },
  {
    name: "height",
    type: "mixed",
    default: "64 / 2 / false",
    desc: pick("尺寸和表面层级", "Dimensions and surface treatment."),
  },
  {
    name: "elevation",
    type: "mixed",
    default: "64 / 2 / false",
    desc: pick("尺寸和表面层级", "Dimensions and surface treatment."),
  },
  {
    name: "border",
    type: "mixed",
    default: "64 / 2 / false",
    desc: pick("尺寸和表面层级", "Dimensions and surface treatment."),
  },
  {
    name: "rounded",
    type: "mixed",
    default: "64 / 2 / false",
    desc: pick("尺寸和表面层级", "Dimensions and surface treatment."),
  },
  {
    name: "fixed",
    type: "boolean",
    default: "false",
    desc: pick(
      "固定到视口底部并预留设备安全区",
      "Fix to the viewport bottom and reserve device safe area.",
    ),
  },
  {
    name: "safeArea",
    type: "boolean",
    default: "true",
    desc: pick(
      "固定到视口底部并预留设备安全区",
      "Fix to the viewport bottom and reserve device safe area.",
    ),
  },
];
const eventRows = () => [
  {
    name: "update:modelValue",
    type: "BottomNavigationValue",
    desc: pick("选中值更新", "Selected-value update."),
  },
  {
    name: "change",
    type: "[value, item]",
    desc: pick("携带完整选中项的变更事件", "Change event carrying the complete selected item."),
  },
];

const baseCode = `<elf-bottom-navigation
  :items.prop="items"
  v-model="selected"
  color="primary"
  background-color="surface"
  mandatory
/>`;
const growCode = `<elf-bottom-navigation grow :items.prop="items" />`;
const horizontalCode = `<elf-bottom-navigation horizontal :items.prop="items" />`;
const shiftCode = `<elf-bottom-navigation
  shift
  rounded
  :color.prop="accent"
  :items.prop="mediaItems"
  :model-value.prop="selected"
/>`;
const visibilityCode = `<elf-bottom-navigation :active="visible" :items.prop="items" />`;
const hideOnScrollCode = `<elf-bottom-navigation
  :active="visible"
  :items.prop="items"
  :model-value.prop="selected"
  @update:model-value="onSelect"
/>`;
const hideOnScrollScript = `const visible = useRef(true);
let lastScroll = 0;

const onScroll = (event) => {
  const top = event.currentTarget.scrollTop;
  if (top <= 24) visible.set(true);
  else if (top > lastScroll + 4) visible.set(false);
  else if (top < lastScroll - 4) visible.set(true);
  lastScroll = top;
};`;

defineStyle(
  articleStyles,
  `
  .demo-toolbar { display: flex; flex-wrap: wrap; gap: 8px; }
  .demo-stack { display: grid; width: 100%; gap: 12px; }
  .lab-controls { display: grid; gap: 14px; }
  .device { display: grid; width: min(620px, 100%); min-height: 330px; align-content: end; overflow: hidden; border: 1px solid var(--elf-border); border-radius: 8px; background: var(--elf-bg-default); box-shadow: var(--elf-shadow-1); }
  .device-content { display: grid; min-height: 254px; grid-template-columns: minmax(0, 1fr) 180px; }
  .device-copy { display: flex; min-width: 0; flex-direction: column; justify-content: flex-end; padding: 28px; }
  .device-copy h3 { margin: 0; font-size: 24px; }
  .device-copy p { max-width: 34ch; margin: 8px 0 18px; color: var(--elf-text-secondary); font-size: 13px; line-height: 1.6; }
  .selection { color: var(--elf-primary); font-size: 12px; font-weight: 700; }
  .device-media { min-height: 220px; background: url("https://picsum.photos/seed/elfui-mobile-nav/520/760") center / cover; }
  .flat-stage { display: grid; width: min(760px, 100%); min-height: 160px; align-content: end; overflow: hidden; border: 1px solid var(--elf-border); border-radius: 8px; background: var(--elf-bg-default); }
  .flat-content { display: grid; min-height: 92px; place-items: center; color: var(--elf-text-secondary); font-size: 13px; }
  .visibility-stage { display: grid; width: min(620px, 100%); min-height: 210px; align-content: end; overflow: hidden; border: 1px solid var(--elf-border); border-radius: 8px; background: var(--elf-bg-default); }
  .visibility-stage .flat-content { min-height: 146px; }
  .scroll-stage { display: grid; width: min(620px, 100%); height: 320px; overflow: hidden; grid-template-rows: minmax(0, 1fr) auto; border: 1px solid var(--elf-border); border-radius: 8px; background: var(--elf-bg-default); box-shadow: var(--elf-shadow-1); }
  .scroll-feed { overflow-y: auto; overscroll-behavior: contain; background: var(--elf-bg-paper); }
  .scroll-row { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 14px 18px; border-bottom: 1px solid var(--elf-divider); color: var(--elf-text-secondary); font-size: 13px; }
  .scroll-row strong { color: var(--elf-text-primary); font-weight: 600; }
  @media (max-width: 560px) {
    .device-content { grid-template-columns: 1fr; }
    .device-media { min-height: 130px; order: -1; }
    .device-copy { padding: 20px; }
    .device-copy h3 { font-size: 20px; }
  }
`,
);

const PageBottomNavigation = defineHtml(`
  <elf-container class="docs-article">
    <elf-docs-hero category="navigation" tag="BottomNavigation" :title=${t("title")} :description=${t("description")}></elf-docs-hero>

    <elf-playground :title=${t("color")} :code=${baseCode}>
      <span slot="status" role="status" aria-live="polite">${t("selected")}: ${baseSelected.value}</span>
      <elf-icon-provider :options.prop=${bottomNavigationIconOptions}><div class="device">
          <div class="device-content"><div class="device-copy"><span class="selection">${t("selected")}: ${baseSelected.value}</span><h3>${t("overview")}</h3><p>${t("summary")}</p></div><div class="device-media" role="img" :aria-label=${t("overview")}></div></div>
          <elf-bottom-navigation mandatory color="primary" background-color="surface" :items.prop=${standardItems()} :modelValue.prop=${baseSelected.value} @update:modelValue=${onBaseSelect}></elf-bottom-navigation>
        </div></elf-icon-provider>
    </elf-playground>

    <elf-playground :title=${t("grow")} :code=${growCode}>
      <span slot="status" role="status" aria-live="polite">${t("selected")}: ${growSelected.value}</span><elf-icon-provider :options.prop=${bottomNavigationIconOptions}><div class="flat-stage"><div class="flat-content">${t("overview")}</div><elf-bottom-navigation grow border :items.prop=${standardItems()} :modelValue.prop=${growSelected.value} @update:modelValue=${onGrowSelect}></elf-bottom-navigation></div></elf-icon-provider>
    </elf-playground>

    <elf-playground :title=${t("horizontal")} :code=${horizontalCode}>
      <span slot="status" role="status" aria-live="polite">${t("selected")}: ${horizontalSelected.value}</span><elf-icon-provider :options.prop=${bottomNavigationIconOptions}><div class="flat-stage"><div class="flat-content">${t("overview")}</div><elf-bottom-navigation horizontal border :items.prop=${standardItems()} :modelValue.prop=${horizontalSelected.value} @update:modelValue=${onHorizontalSelect}></elf-bottom-navigation></div></elf-icon-provider>
    </elf-playground>

    <elf-playground :title=${t("shift")} :code=${shiftCode}>
      <span slot="status" role="status" aria-live="polite">${t("selected")}: ${mediaTitle()}</span><elf-icon-provider :options.prop=${bottomNavigationIconOptions}><div class="device">
          <div class="device-content"><div class="device-copy"><span class="selection" :style=${mediaAccentStyle()}>${t("selected")}: ${mediaTitle()}</span><h3>${mediaTitle()}</h3><p>${mediaSummary()}</p></div><div class="device-media" role="img" :aria-label=${mediaTitle()} :style=${mediaBackdropStyle()}></div></div>
          <elf-bottom-navigation shift rounded :color.prop=${mediaAccent()} background-color="surface" :items.prop=${mediaItems()} :modelValue.prop=${mediaSelected.value} @update:modelValue=${onMediaSelect}></elf-bottom-navigation>
        </div></elf-icon-provider>
    </elf-playground>

    <elf-playground :title=${t("visibility")} :code=${visibilityCode}>
      <span slot="status" role="status" aria-live="polite">${visible.value ? t("toggle") : t("visibility")}</span><elf-icon-provider :options.prop=${bottomNavigationIconOptions}><div class="visibility-stage"><div class="flat-content">${t("overview")}</div><elf-bottom-navigation :active=${visible.value} :items.prop=${standardItems()} :modelValue.prop=${visibilitySelected.value} @update:modelValue=${onVisibilitySelect}></elf-bottom-navigation></div></elf-icon-provider>
      <div slot="controls" class="lab-controls"><elf-switch :label=${t("toggle")} :modelValue.prop=${visible.value} @update:modelValue=${onVisible}></elf-switch></div>
    </elf-playground>

    <elf-playground :title=${t("hideOnScroll")} :code=${hideOnScrollCode} :script=${hideOnScrollScript}>
      <span slot="status" role="status" aria-live="polite">${hideVisible.value ? t("visible") : t("hidden")}</span><elf-icon-provider :options.prop=${bottomNavigationIconOptions}><div class="scroll-stage"><div class="scroll-feed" @scroll=${onStageScroll}>
          <div v-for="(row, index) in feedRows()" :key="index" class="scroll-row"><strong>{{ row.title }}</strong><span>{{ row.time }}</span></div>
        </div><elf-bottom-navigation border elevation="0" :active=${hideVisible.value} :items.prop=${standardItems()} :modelValue.prop=${scrollSelected.value} @update:modelValue=${onScrollSelect}></elf-bottom-navigation></div></elf-icon-provider>
    </elf-playground>

    <section class="docs-section"><elf-api-builder component="elf-bottom-navigation" title="API"><elf-props-table role="props" title="Props" :rows=${propsRows()} /><elf-props-table role="events" :title=${t("events")} :rows=${eventRows()} />
  </elf-api-builder></section>
  </elf-container>
`);

export { PageBottomNavigation };
