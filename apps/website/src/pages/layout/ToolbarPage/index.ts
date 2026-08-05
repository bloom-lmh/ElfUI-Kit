import { defineHtml, defineStyle, useRef } from "@elfui/core";

import { createSvgIconSet } from "@elfui/kit-src/components/Basic/Icon";
import { createDocsPicker, createDocsTranslator } from "../../docsLocale";
import articleStyles from "../../shared/article.scss?inline";

const t = createDocsTranslator({
  kicker: { zh: "布局组件", en: "Layout" },
  title: { zh: "工具栏", en: "Toolbar" },
  description: {
    zh: "在局部界面中排列标题、上下文工具和扩展导航，支持密度、折叠、背景与容器定位。",
    en: "Arrange titles, contextual tools, and extension navigation with density, collapse, backgrounds, and container positioning.",
  },
  compact: { zh: "紧凑工具栏", en: "Dense toolbars" },
  collapse: { zh: "折叠与对齐", en: "Collapse and alignment" },
  image: { zh: "背景", en: "Background" },
  location: { zh: "放置区域", en: "Location" },
  extended: { zh: "扩展工具栏", en: "Extended" },
  prominent: { zh: "突出工具栏", en: "Prominent" },
  extensionHeight: { zh: "扩展区高度", en: "Extension height" },
  extensionSlot: { zh: "扩展插槽", en: "Extension" },
  contextual: { zh: "上下文操作栏", en: "Contextual action bar" },
  flexible: { zh: "灵活卡片工具栏", en: "Flexible and card toolbar" },
  floating: { zh: "浮动搜索", en: "Floating with search" },
  tooltips: { zh: "工具提示与快速操作", en: "Tooltips and Speed Dial" },
  photos: { zh: "影像控制台", en: "Visual console" },
  library: { zh: "海岸资料库", en: "Coastal library" },
  search: { zh: "搜索", en: "Search" },
  filter: { zh: "筛选", en: "Filter" },
  more: { zh: "更多", en: "More" },
  back: { zh: "返回", en: "Back" },
  menu: { zh: "打开导航", en: "Open navigation" },
  signOut: { zh: "退出", en: "Sign out" },
  toggleDensity: { zh: "切换 64/48px", en: "Toggle 64/48px" },
  toggleCollapse: { zh: "展开或折叠", en: "Expand or collapse" },
  start: { zh: "对齐起始", en: "Align start" },
  end: { zh: "对齐结束", en: "Align end" },
  all: { zh: "全部", en: "All" },
  favorites: { zh: "收藏", en: "Favorites" },
  shared: { zh: "共享", en: "Shared" },
  selectPhotos: { zh: "选择 3 张照片", en: "Select 3 photos" },
  clearSelection: { zh: "清除选择", en: "Clear selection" },
  selectedPhotos: { zh: "已选择 {count} 张", en: "{count} selected" },
  searchPlaceholder: { zh: "搜索照片", en: "Search photos" },
  upload: { zh: "上传", en: "Upload" },
  share: { zh: "分享", en: "Share" },
  archive: { zh: "归档", en: "Archive" },
  favorite: { zh: "收藏", en: "Favorite" },
  fieldNotes: { zh: "本周精选", en: "This week's selection" },
  action: { zh: "最近操作", en: "Last action" },
  none: { zh: "尚未操作", en: "No action yet" },
  topStart: { zh: "左上", en: "Top start" },
  topEnd: { zh: "右上", en: "Top end" },
  bottomStart: { zh: "左下", en: "Bottom start" },
  bottomEnd: { zh: "右下", en: "Bottom end" },
  api: { zh: "API", en: "API" },
  slots: { zh: "插槽", en: "Slots" },
});
const pick = createDocsPicker();
const toolbarIconOptions = {
  defaultSet: "toolbar",
  sets: {
    toolbar: createSvgIconSet({
      archive: "M5 4h14l2 3v2h-1v11H4V9H3V7l2-3zm1 5v9h12V9H6zm3 2h6v2H9v-2z",
      back: "M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z",
      close:
        "M18.3 5.71 16.89 4.3 12 9.17 7.11 4.3 5.7 5.71 10.59 10.59 5.7 15.48 7.11 16.89 12 12 16.89 16.89 18.3 15.48 13.41 10.59z",
      favorite:
        "M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z",
      filter: "M10 18h4v-2h-4v2zM3 6v2h18V6H3zm3 7h12v-2H6v2z",
      menu: "M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z",
      more: "M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z",
      open: "M14 3h7v7h-2V6.41l-9.29 9.3-1.42-1.42 9.3-9.29H14V3zM5 5h6v2H5v12h12v-6h2v8H3V5h2z",
      search:
        "M9.5 3a6.5 6.5 0 1 0 4.1 11.55L19.05 20l1.45-1.45-5.45-5.45A6.5 6.5 0 0 0 9.5 3zm0 2a4.5 4.5 0 1 1 0 9 4.5 4.5 0 0 1 0-9z",
      share:
        "M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11A3 3 0 1 0 15 5c0 .24.04.47.09.7L8.04 9.81A3 3 0 1 0 8.04 14.19l7.12 4.16c-.04.2-.07.41-.07.65A2.91 2.91 0 1 0 18 16.08z",
      upload: "M5 20h14v-2H5v2zM12 2 6.5 7.5 7.92 8.92 11 5.84V16h2V5.84l3.08 3.08 1.42-1.42L12 2z",
    }),
  },
};

const density = useRef("compact");
const collapsed = useRef(false);
const collapsePosition = useRef("start");
const location = useRef("top-start");
const lastAction = useRef("");
const extensionHeight = useRef(72);
const extendedTab = useRef("all");
const extensionHeightTab = useRef("all");
const extensionSlotTab = useRef("all");
const selectedPhotos = useRef(0);
const searchText = useRef("");
const toggleDensity = (): void => density.set(density.value === "compact" ? "default" : "compact");
const action = (value: string): void => lastAction.set(value);
const onBack = (): void => action(t("back"));
const onSearch = (): void => action(t("search"));
const onFilter = (): void => action(t("filter"));
const onMore = (): void => action(t("more"));
const onMenu = (): void => action(t("menu"));
const onSignOut = (): void => action(t("signOut"));
const onExtensionHeight = (event: Event): void =>
  extensionHeight.set(Number((event.target as HTMLInputElement).value));
const extensionTabs = () => [
  { label: t("all"), value: "all" },
  { label: t("favorites"), value: "favorites" },
  { label: t("shared"), value: "shared" },
];
const onExtendedTab = (event: CustomEvent): void => extendedTab.set(String(event.detail));
const onExtensionHeightTab = (event: CustomEvent): void =>
  extensionHeightTab.set(String(event.detail));
const onExtensionSlotTab = (event: CustomEvent): void => extensionSlotTab.set(String(event.detail));
const selectPhotos = (): void => selectedPhotos.set(3);
const clearSelection = (): void => selectedPhotos.set(0);
const selectionTitle = (): string =>
  selectedPhotos.value > 0
    ? t("selectedPhotos").replace("{count}", String(selectedPhotos.value))
    : t("photos");
const onSearchInput = (event: Event): void =>
  searchText.set((event.target as HTMLInputElement).value);

const propsRows = () => [
  {
    name: "title / ariaLabel",
    type: "string",
    default: "'' / Toolbar",
    desc: pick("标题和工具栏无障碍名称", "Title and accessible toolbar name."),
  },
  {
    name: "density",
    type: "default | comfortable | compact | prominent",
    default: "default",
    desc: pick(
      "64、56、48 或 128px 主行；突出密度下扩展区加倍",
      "64, 56, 48, or 128px main row; the extension doubles when prominent.",
    ),
  },
  {
    name: "image / imageAlt",
    type: "string",
    default: "''",
    desc: pick("背景图片和替代文本", "Background image and alternative text."),
  },
  {
    name: "imagePosition / imageOpacity",
    type: "string / number",
    default: "center / 1",
    desc: pick("背景构图和透明度", "Background framing and opacity."),
  },
  {
    name: "collapsed / collapsePosition / collapseWidth",
    type: "mixed",
    default: "false / start / 112",
    desc: pick(
      "折叠状态、折叠后对齐侧和最大宽度",
      "Collapsed state, alignment side when collapsed, and maximum width.",
    ),
  },
  {
    name: "absolute / fixed / location",
    type: "mixed",
    default: "false / false / top",
    desc: pick(
      "在相对容器或视口中的放置位置",
      "Placement within a relative container or viewport.",
    ),
  },
  {
    name: "height / extensionHeight",
    type: "string | number",
    default: "auto / 48",
    desc: pick("主行和扩展区域高度", "Main-row and extension heights."),
  },
  {
    name: "color / elevation / border / rounded / floating",
    type: "mixed",
    default: "surface / 0 / false",
    desc: pick("表面、层级与内联形态", "Surface, elevation, and inline form."),
  },
  {
    name: "extended",
    type: "boolean | null",
    default: pick("null（自动）", "null (auto)"),
    desc: pick(
      "显式控制扩展区；null 时按插槽内容自动显示",
      "Explicitly show the extension; null auto-detects the extension slot.",
    ),
  },
  {
    name: "flat",
    type: "boolean",
    default: "false",
    desc: pick("移除投影，即使设置了 elevation", "Remove the shadow even when elevation is set."),
  },
];
const slotRows = () =>
  ["prepend", "title", "default", "append", "extension", "background"].map((name) => ({
    name,
    desc: pick(`${name} 内容区域`, `${name} content region.`),
  }));
const compactCode = `<elf-toolbar density="compact" title="Visual console" border>
  <elf-button slot="append" circle variant="text">Search</elf-button>
</elf-toolbar>`;
const collapseCode = `<elf-toolbar :collapsed="collapsed" collapse-position="start" collapse-width="124">...</elf-toolbar>`;
const imageCode = `<elf-toolbar image="/coast.jpg" title="Coastal library" extension-height="44">...</elf-toolbar>`;
const locationCode = `<div class="relative">
  <elf-toolbar absolute floating location="bottom-end">...</elf-toolbar>
</div>`;
const extendedCode = `<elf-toolbar title="Toolbar" extension-height="48">
  <elf-tabs slot="extension" density="compact" grow :items.prop="tabs" :modelValue.prop="active" />
</elf-toolbar>`;
const prominentCode = `<elf-toolbar title="Library" density="prominent" extended color="#1e3a5f">
  <elf-button slot="prepend" circle variant="text" dark>Menu</elf-button>
  <elf-button slot="append" circle variant="text" dark>Favorite</elf-button>
  <nav slot="extension" class="toolbar-tabs is-on-dark">
    <span>All</span><span>Favorites</span><span>Shared</span>
  </nav>
</elf-toolbar>`;
const extensionHeightCode = `<elf-toolbar title="Toolbar" extension-height="72">
  <elf-tabs slot="extension" density="compact" grow :items.prop="tabs" :modelValue.prop="active" />
</elf-toolbar>`;
const extensionCode = `<elf-toolbar title="Toolbar">
  <elf-tabs slot="extension" density="compact" grow :items.prop="tabs" :modelValue.prop="active" />
</elf-toolbar>`;
const toolbarTabsScript = `const active = useRef("all");
const tabs = [
  { label: "All", value: "all" },
  { label: "Favorites", value: "favorites" },
  { label: "Shared", value: "shared" }
];`;
const contextualCode = `<elf-toolbar :color="selected ? '#1e3a5f' : 'surface'" :title="selectionTitle">
  <elf-button slot="append" circle variant="text">Archive</elf-button>
</elf-toolbar>`;
const flexibleCode = `<elf-toolbar color="#1976d2" title="Title" extension-height="96" extended flat>
  <elf-button slot="prepend" circle variant="text" dark>Menu</elf-button>
  <elf-button slot="append" circle variant="text" dark>Favorite</elf-button>
</elf-toolbar>`;
const floatingCode = `<elf-toolbar floating rounded elevation="3">
  <input type="search" placeholder="Search" />
</elf-toolbar>`;
const tooltipsCode = `<elf-toolbar title="Toolbar">
  <elf-tooltip content="Upload"><elf-button circle>+</elf-button></elf-tooltip>
</elf-toolbar>`;

defineStyle(
  articleStyles,
  `
  .toolbar-stage {
    display: grid;
    width: min(860px, 100%);
    gap: 18px;
    padding: 26px;
    background: var(--elf-bg-default);
  }

  .canvas {
    min-height: 240px;
    border: 1px solid var(--elf-border);
    border-radius: 8px;
    background: var(--elf-bg-paper);
    box-shadow: var(--elf-shadow-1);
  }

  .canvas-copy {
    padding: 22px 24px;
    color: var(--elf-text-secondary);
    font-size: 13px;
  }

  .canvas-copy strong {
    display: block;
    margin-bottom: 6px;
    color: var(--elf-text-primary);
    font-size: 18px;
  }

  .collapse-stage {
    display: grid;
    width: min(760px, 100%);
    min-height: 240px;
    place-items: start center;
    padding: 30px;
    background: color-mix(in srgb, var(--elf-primary) 5%, var(--elf-bg-default));
  }

  .collapse-stage elf-toolbar {
    max-width: 560px;
  }

  .collapse-controls {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 8px;
    margin-top: 112px;
  }

  .image-stage {
    width: min(860px, 100%);
    min-height: 280px;
    overflow: hidden;
    border-radius: 8px;
    background: var(--elf-bg-default);
    box-shadow: var(--elf-shadow-1);
  }

  .image-stage elf-toolbar {
    --_toolbar-color: #f8fbff;
  }

  .image-content {
    min-height: 190px;
    padding: 26px;
    background: color-mix(in srgb, var(--elf-primary) 4%, var(--elf-bg-paper));
  }

  .image-content p {
    max-width: 48ch;
    margin: 0;
    color: var(--elf-text-secondary);
    line-height: 1.65;
  }

  .toolbar-tabs {
    display: flex;
    height: 100%;
    align-items: center;
    gap: 26px;
    color: inherit;
    font-size: 12px;
    font-weight: 700;
  }

  .toolbar-tabs span:first-child {
    border-bottom: 2px solid currentColor;
  }

  .position-stage {
    position: relative;
    width: min(860px, 100%);
    min-height: 330px;
    overflow: hidden;
    border: 1px solid var(--elf-border);
    border-radius: 8px;
    background: var(--elf-bg-default);
  }

  .position-stage::before {
    position: absolute;
    inset: 50% 0 auto;
    height: 1px;
    background: var(--elf-divider);
    content: "";
  }

  .position-stage::after {
    position: absolute;
    inset: 0 auto 0 50%;
    width: 1px;
    background: var(--elf-divider);
    content: "";
  }

  .position-stage elf-toolbar {
    z-index: 1;
  }

  .action-readout {
    margin: 0;
    color: var(--elf-text-secondary);
    font-size: 12px;
    text-align: right;
  }

  .extended-stage,
  .contextual-stage,
  .flexible-stage,
  .floating-stage,
  .tooltip-stage {
    width: min(860px, 100%);
    overflow: hidden;
    border: 1px solid var(--elf-border);
    border-radius: 8px;
    background: var(--elf-bg-default);
  }

  .toolbar-extension-tabs {
    display: block;
    width: 100%;
    height: 40px;
    min-width: 0;
    flex: 1 1 auto;
    align-self: center;
  }

  .toolbar-extension-tabs.is-on-dark {
    --elf-text-primary: #fff;
    --elf-text-secondary: rgb(255 255 255 / 72%);
  }

  .extension-height-controls {
    display: grid;
    gap: 10px;
    color: var(--elf-text-secondary);
    font-size: 12px;
  }

  .toolbar-choice-controls {
    display: grid;
    gap: 14px;
  }

  .toolbar-choice-controls elf-radio-group {
    display: grid;
    gap: 8px;
  }

  .extension-height-controls input {
    width: 100%;
    accent-color: var(--elf-primary);
  }

  .contextual-content {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 10px;
    padding: 18px;
  }

  .photo-tile {
    aspect-ratio: 4 / 3;
    border: 0;
    border-radius: 6px;
    background: center / cover;
    cursor: pointer;
  }

  .photo-tile:nth-child(1) {
    background-image: url("https://picsum.photos/seed/elfui-context-1/420/320");
  }

  .photo-tile:nth-child(2) {
    background-image: url("https://picsum.photos/seed/elfui-context-2/420/320");
  }

  .photo-tile:nth-child(3) {
    background-image: url("https://picsum.photos/seed/elfui-context-3/420/320");
  }

  .contextual-actions {
    display: flex;
    justify-content: center;
    gap: 8px;
    padding: 0 18px 18px;
  }

  .flexible-stage {
    overflow: visible;
    padding-bottom: 22px;
    background: color-mix(in srgb, var(--elf-primary) 5%, var(--elf-bg-default));
  }

  .flexible-stage elf-toolbar {
    padding-bottom: 54px;
  }

  .floating-panel {
    position: relative;
    z-index: 2;
    width: calc(100% - 44px);
    margin: -42px auto 0;
    padding: 22px;
    border: 1px solid var(--elf-border);
    border-radius: 8px;
    background: var(--elf-bg-paper);
    box-shadow: var(--elf-shadow-2);
  }

  .floating-panel h3 {
    margin: 0 0 8px;
    font-size: 18px;
  }

  .floating-panel p {
    margin: 0;
    color: var(--elf-text-secondary);
    font-size: 13px;
    line-height: 1.6;
  }

  .floating-stage {
    min-height: 250px;
    padding: 54px 24px;
    background: url("https://picsum.photos/seed/elfui-toolbar-search/1200/520") center / cover;
  }

  .floating-search {
    display: flex;
    min-width: 0;
    flex: 1;
    align-items: center;
    gap: 8px;
  }

  .floating-search input {
    width: min(340px, 100%);
    min-height: 40px;
    padding: 0 12px;
    border: 0;
    outline: 0;
    background: transparent;
    color: inherit;
    font: inherit;
  }

  .tooltip-stage {
    padding: 32px;
  }

  .speed-actions {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .speed-actions elf-tooltip {
    display: inline-flex;
  }

  @media (max-width: 560px) {
    .toolbar-stage {
      padding: 16px;
    }

    .collapse-stage {
      padding: 20px 12px;
    }

    .position-stage {
      min-height: 380px;
    }

    .contextual-content {
      grid-template-columns: 1fr;
    }

    .floating-stage,
    .tooltip-stage {
      padding: 24px 12px;
    }
  }
`,
);

const PageToolbar = defineHtml(`
  <elf-container class="docs-article">
    <elf-icon-provider :options.prop=${toolbarIconOptions}>
      <elf-docs-hero category="layout" tag="Toolbar" :title=${t("title")} :description=${t("description")}></elf-docs-hero>

      <elf-playground :title=${t("compact")} :code=${compactCode}>
        <elf-button slot="status" size="sm" variant="text"
          @click=${toggleDensity}>${t("toggleDensity")}</elf-button>
        <div class="toolbar-stage">
          <div class="canvas"><elf-toolbar :density=${density.value} :title=${t("photos")}
              border><elf-button slot="prepend" circle variant="text" :aria-label=${t("back")}
                @click=${onBack}><elf-icon name="back" size="18"></elf-icon></elf-button><elf-button
                slot="append" circle variant="text" :aria-label=${t("search")}
                @click=${onSearch}><elf-icon name="search"
                  size="18"></elf-icon></elf-button><elf-button slot="append" circle variant="text"
                :aria-label=${t("filter")} @click=${onFilter}><elf-icon name="filter"
                  size="18"></elf-icon></elf-button><elf-button slot="append" circle variant="text"
                :aria-label=${t("more")} @click=${onMore}><elf-icon name="more"
                  size="18"></elf-icon></elf-button></elf-toolbar>
            <div class="canvas-copy"><strong>${t("library")}</strong>${t("description")}</div>
          </div>
          <p class="action-readout">${t("action")}: ${lastAction.value || t("none")}</p>
        </div>
      </elf-playground>

      <elf-playground :title=${t("collapse")} :code=${collapseCode}>
        <div slot="controls" class="demo-controls toolbar-choice-controls">
          <elf-checkbox :modelValue.prop=${collapsed.value} :label=${t("toggleCollapse")} @update:modelValue=${(event: CustomEvent<boolean>) => collapsed.set(Boolean(event.detail))}></elf-checkbox>
          <elf-radio-group :modelValue.prop=${collapsePosition.value} :aria-label=${t("collapse")} @update:modelValue=${(event: CustomEvent<string>) => collapsePosition.set(String(event.detail))}>
            <elf-radio value="start" :label=${t("start")}></elf-radio>
            <elf-radio value="end" :label=${t("end")}></elf-radio>
          </elf-radio-group>
        </div>
        <div class="toolbar-stage">
          <div class="collapse-stage"><elf-toolbar rounded elevation="4" :collapsed=${collapsed.value}
              :collapsePosition.prop=${collapsePosition.value} collapse-width="124"
              :title=${t("photos")}><elf-button slot="prepend" circle variant="text"
                :aria-label=${t("search")} @click=${onSearch}><elf-icon name="search"
                  size="18"></elf-icon></elf-button><elf-button slot="append" circle variant="text"
                :aria-label=${t("more")} @click=${onMore}><elf-icon name="more"
                  size="18"></elf-icon></elf-button></elf-toolbar>
            <div class="collapse-controls">
              <span>${collapsed.value ? (collapsePosition.value === "start" ? t("start") : t("end")) : t("photos")}</span></div>
          </div>
        </div>
      </elf-playground>

      <elf-playground :title=${t("image")} :code=${imageCode}>
        <div class="image-stage"><elf-toolbar :title=${t("library")} color="#173e6c"
            image="https://picsum.photos/seed/elfui-toolbar-sea/1400/320" image-position="center 46%"
            extension-height="44"><elf-button slot="prepend" circle variant="text" dark
              :aria-label=${t("menu")} @click=${onMenu}><elf-icon name="menu"
                size="18"></elf-icon></elf-button><elf-button slot="append" circle variant="text" dark
              :aria-label=${t("signOut")} @click=${onSignOut}><elf-icon name="open"
                size="18"></elf-icon></elf-button>
            <nav class="toolbar-tabs" slot="extension">
              <span>${t("all")}</span><span>${t("favorites")}</span><span>${t("shared")}</span></nav>
          </elf-toolbar>
          <div class="image-content">
            <p>${t("description")}</p>
          </div>
        </div>
      </elf-playground>

      <elf-playground :title=${t("location")} :code=${locationCode}>
        <div slot="controls" class="demo-controls toolbar-choice-controls">
          <elf-radio-group :modelValue.prop=${location.value} :aria-label=${t("location")} @update:modelValue=${(event: CustomEvent<string>) => location.set(String(event.detail))}>
            <elf-radio value="top-start" :label=${t("topStart")}></elf-radio>
            <elf-radio value="top-end" :label=${t("topEnd")}></elf-radio>
            <elf-radio value="bottom-start" :label=${t("bottomStart")}></elf-radio>
            <elf-radio value="bottom-end" :label=${t("bottomEnd")}></elf-radio>
          </elf-radio-group>
        </div>
        <div class="position-stage"><elf-toolbar absolute floating rounded elevation="2"
            :location.prop=${location.value} :title=${t("photos")}><elf-button slot="prepend" circle
              variant="text" :aria-label=${t("menu")} @click=${onMenu}><elf-icon name="menu"
                size="18"></elf-icon></elf-button><elf-button slot="append" circle variant="text"
              :aria-label=${t("more")} @click=${onMore}><elf-icon name="more"
                size="18"></elf-icon></elf-button></elf-toolbar></div>
      </elf-playground>

      <elf-playground :title=${t("extended")} :code=${extendedCode} :script=${toolbarTabsScript}>
        <div class="extended-stage"><elf-toolbar :title=${t("photos")} color="#546e7a"
            extension-height="48"><elf-button slot="prepend" circle variant="text" dark
              :aria-label=${t("menu")} @click=${onMenu}><elf-icon name="menu"
                size="18"></elf-icon></elf-button><elf-button slot="append" circle variant="text" dark
              :aria-label=${t("more")} @click=${onMore}><elf-icon name="more"
                size="18"></elf-icon></elf-button><elf-tabs slot="extension"
              class="toolbar-extension-tabs is-on-dark" density="compact" grow
              background-color="transparent" color="#fff" slider-color="#fff"
              :items.prop=${extensionTabs()} :modelValue.prop=${extendedTab.value}
              @update:modelValue=${onExtendedTab}></elf-tabs></elf-toolbar>
          <div class="canvas-copy"><strong>${t("library")}</strong>${t("description")}</div>
        </div>
      </elf-playground>

      <elf-playground :title=${t("prominent")} :code=${prominentCode}>
        <div class="extended-stage"><elf-toolbar :title=${t("library")} density="prominent"
            extended color="#1e3a5f"><elf-button slot="prepend" circle variant="text" dark
              :aria-label=${t("menu")} @click=${onMenu}><elf-icon name="menu"
                size="18"></elf-icon></elf-button><elf-button slot="append" circle variant="text" dark
              :aria-label=${t("favorite")} @click=${() => action(t("favorite"))}><elf-icon
                name="favorite" size="18"></elf-icon></elf-button><nav slot="extension"
              class="toolbar-tabs is-on-dark"><span>${t("all")}</span><span>${t("favorites")}</span><span>${t("shared")}</span></nav></elf-toolbar>
          <div class="canvas-copy"><strong>${t("library")}</strong>${t("description")}</div>
        </div>
      </elf-playground>

      <elf-playground :title=${t("extensionHeight")} :code=${extensionHeightCode}
        :script=${toolbarTabsScript}>
        <div slot="controls" class="demo-controls extension-height-controls">
          <span>${t("extensionHeight")}: ${extensionHeight.value}px</span><input type="range" min="40"
            max="104" step="4" :value=${extensionHeight.value} @input=${onExtensionHeight} /></div>
        <div class="extended-stage"><elf-toolbar :title=${t("photos")} border
            :extensionHeight.prop=${extensionHeight.value}><elf-tabs slot="extension"
              class="toolbar-extension-tabs" density="compact" grow background-color="transparent"
              :items.prop=${extensionTabs()} :modelValue.prop=${extensionHeightTab.value}
              @update:modelValue=${onExtensionHeightTab}></elf-tabs></elf-toolbar></div>
      </elf-playground>

      <elf-playground :title=${t("extensionSlot")} :code=${extensionCode} :script=${toolbarTabsScript}>
        <div class="extended-stage"><elf-toolbar :title=${t("photos")} color="#3949ab"><elf-button
              slot="prepend" circle variant="text" dark :aria-label=${t("back")}
              @click=${onBack}><elf-icon name="back" size="18"></elf-icon></elf-button><elf-tabs
              slot="extension" class="toolbar-extension-tabs is-on-dark" density="compact" grow
              background-color="transparent" color="#fff" slider-color="#fff"
              :items.prop=${extensionTabs()} :modelValue.prop=${extensionSlotTab.value}
              @update:modelValue=${onExtensionSlotTab}></elf-tabs></elf-toolbar>
          <div class="canvas-copy">${t("description")}</div>
        </div>
      </elf-playground>

      <elf-playground :title=${t("contextual")} :code=${contextualCode}>
        <div class="contextual-stage"><elf-toolbar :title=${selectionTitle()}
            :color=${selectedPhotos.value > 0 ? "#1e3a5f" : "surface"}
            :elevation=${selectedPhotos.value > 0 ? 2 : 0} border><elf-button slot="prepend" circle
              variant="text" :dark=${selectedPhotos.value > 0} :aria-label=${t("back")}
              @click=${clearSelection}><elf-icon :name=${selectedPhotos.value > 0 ? "close" : "back"}
                size="18"></elf-icon></elf-button><elf-button v-if=${selectedPhotos.value > 0}
              slot="append" circle variant="text" dark :aria-label=${t("archive")}
              @click=${() => action(t("archive"))}><elf-icon name="archive"
                size="18"></elf-icon></elf-button><elf-button v-if=${selectedPhotos.value > 0}
              slot="append" circle variant="text" dark :aria-label=${t("share")}
              @click=${() => action(t("share"))}><elf-icon name="share"
                size="18"></elf-icon></elf-button></elf-toolbar>
          <div class="contextual-content"><button class="photo-tile" :aria-label=${t("selectPhotos")}
              @click=${selectPhotos}></button><button class="photo-tile"
              :aria-label=${t("selectPhotos")} @click=${selectPhotos}></button><button
              class="photo-tile" :aria-label=${t("selectPhotos")} @click=${selectPhotos}></button></div>
          <div class="contextual-actions"><elf-button size="sm"
              @click=${selectPhotos}>${t("selectPhotos")}</elf-button><elf-button size="sm"
              variant="outlined" @click=${clearSelection}>${t("clearSelection")}</elf-button></div>
        </div>
      </elf-playground>

      <elf-playground :title=${t("flexible")} :code=${flexibleCode}>
        <div class="flexible-stage"><elf-toolbar :title=${t("library")} color="#1976d2"
            extension-height="96" extended flat><elf-button slot="prepend" circle variant="text" dark
              :aria-label=${t("menu")} @click=${onMenu}><elf-icon name="menu"
                size="18"></elf-icon></elf-button><elf-button slot="append" circle variant="text" dark
              :aria-label=${t("favorite")} @click=${() => action(t("favorite"))}><elf-icon name="favorite"
                size="18"></elf-icon></elf-button></elf-toolbar>
          <section class="floating-panel">
            <h3>${t("fieldNotes")}</h3>
            <p>${t("description")}</p>
          </section>
        </div>
      </elf-playground>

      <elf-playground :title=${t("floating")} :code=${floatingCode}>
        <div class="floating-stage"><elf-toolbar floating rounded elevation="3"
            aria-label="Search toolbar">
            <div class="floating-search"><input type="search" :placeholder=${t("searchPlaceholder")}
                :value=${searchText.value} @input=${onSearchInput} /><elf-button circle variant="text"
                :aria-label=${t("search")} @click=${onSearch}><elf-icon name="search"
                  size="18"></elf-icon></elf-button><elf-button circle variant="text"
                :aria-label=${t("more")} @click=${onMore}><elf-icon name="more"
                  size="18"></elf-icon></elf-button></div>
          </elf-toolbar></div>
      </elf-playground>

      <elf-playground :title=${t("tooltips")} :code=${tooltipsCode}>
        <div class="tooltip-stage"><elf-toolbar :title=${t("photos")} rounded border>
            <div slot="append" class="speed-actions"><elf-tooltip :content=${t("upload")}
                placement="top"><elf-button circle variant="text" :aria-label=${t("upload")}
                  @click=${() => action(t("upload"))}><elf-icon name="upload"
                    size="18"></elf-icon></elf-button></elf-tooltip><elf-tooltip :content=${t("share")}
                placement="top"><elf-button circle variant="text" :aria-label=${t("share")}
                  @click=${() => action(t("share"))}><elf-icon name="share"
                    size="18"></elf-icon></elf-button></elf-tooltip><elf-tooltip
                :content=${t("archive")} placement="top"><elf-button circle variant="text"
                  :aria-label=${t("archive")} @click=${() => action(t("archive"))}><elf-icon
                    name="archive" size="18"></elf-icon></elf-button></elf-tooltip></div>
          </elf-toolbar></div>
      </elf-playground>

      <section class="docs-section">
        <h2>${t("api")}</h2><elf-props-table title="Props" :rows=${propsRows()} /><elf-props-table
          :title=${t("slots")} :rows=${slotRows()} />
      </section>
    </elf-icon-provider>
  </elf-container>
`);

export { PageToolbar };
