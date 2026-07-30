import { defineHtml, defineStyle, useRef } from "@elfui/core";

import { createDocsPicker, createDocsTranslator } from "../../docsLocale";
import articleStyles from "../../shared/article.scss?inline";

const t = createDocsTranslator({
  kicker: { zh: "布局组件", en: "Layout" },
  title: { zh: "工具栏", en: "Toolbar" },
  description: { zh: "在局部界面中排列标题、上下文工具和扩展导航，支持密度、折叠、背景与容器定位。", en: "Arrange titles, contextual tools, and extension navigation with density, collapse, backgrounds, and container positioning." },
  compact: { zh: "紧凑工具栏", en: "Compact toolbar" },
  collapse: { zh: "折叠与保留位置", en: "Collapse and retained side" },
  image: { zh: "图片背景", en: "Image background" },
  location: { zh: "放置区域", en: "Location" },
  photos: { zh: "影像控制台", en: "Visual console" },
  library: { zh: "海岸资料库", en: "Coastal library" },
  search: { zh: "搜索", en: "Search" },
  filter: { zh: "筛选", en: "Filter" },
  more: { zh: "更多", en: "More" },
  back: { zh: "返回", en: "Back" },
  menu: { zh: "打开导航", en: "Open navigation" },
  signOut: { zh: "退出", en: "Sign out" },
  toggleTheme: { zh: "切换预览明暗", en: "Toggle preview theme" },
  toggleDensity: { zh: "切换 64/48px", en: "Toggle 64/48px" },
  toggleCollapse: { zh: "展开或折叠", en: "Expand or collapse" },
  start: { zh: "保留起始侧", en: "Keep start" },
  end: { zh: "保留结束侧", en: "Keep end" },
  all: { zh: "全部", en: "All" },
  favorites: { zh: "收藏", en: "Favorites" },
  shared: { zh: "共享", en: "Shared" },
  action: { zh: "最近操作", en: "Last action" },
  none: { zh: "尚未操作", en: "No action yet" },
  topStart: { zh: "左上", en: "Top start" },
  topEnd: { zh: "右上", en: "Top end" },
  bottomStart: { zh: "左下", en: "Bottom start" },
  bottomEnd: { zh: "右下", en: "Bottom end" },
  api: { zh: "API", en: "API" },
  slots: { zh: "插槽", en: "Slots" }
});
const pick = createDocsPicker();

const dark = useRef(false);
const density = useRef("compact");
const collapsed = useRef(false);
const collapsePosition = useRef("end");
const location = useRef("top-start");
const lastAction = useRef("");
const demoTheme = (): string => dark.value ? "dark" : "light";
const toggleTheme = (): void => dark.set(!dark.value);
const toggleDensity = (): void => density.set(density.value === "compact" ? "default" : "compact");
const toggleCollapse = (): void => collapsed.set(!collapsed.value);
const keepStart = (): void => collapsePosition.set("start");
const keepEnd = (): void => collapsePosition.set("end");
const setTopStart = (): void => location.set("top-start");
const setTopEnd = (): void => location.set("top-end");
const setBottomStart = (): void => location.set("bottom-start");
const setBottomEnd = (): void => location.set("bottom-end");
const action = (value: string): void => lastAction.set(value);
const onBack = (): void => action(t("back"));
const onSearch = (): void => action(t("search"));
const onFilter = (): void => action(t("filter"));
const onMore = (): void => action(t("more"));
const onMenu = (): void => action(t("menu"));
const onSignOut = (): void => action(t("signOut"));

const propsRows = () => [
  { name: "title / ariaLabel", type: "string", default: "'' / Toolbar", desc: pick("标题和工具栏无障碍名称", "Title and accessible toolbar name.") },
  { name: "density", type: "default | comfortable | compact", default: "default", desc: pick("64、56 或 48px 主行", "64, 56, or 48px main row.") },
  { name: "image / imageAlt", type: "string", default: "''", desc: pick("背景图片和替代文本", "Background image and alternative text.") },
  { name: "imagePosition / imageOpacity", type: "string / number", default: "center / 1", desc: pick("背景构图和透明度", "Background framing and opacity.") },
  { name: "collapsed / collapsePosition / collapseWidth", type: "mixed", default: "false / end / 112", desc: pick("折叠状态、保留侧和最大宽度", "Collapsed state, retained side, and maximum width.") },
  { name: "absolute / fixed / location", type: "mixed", default: "false / false / top", desc: pick("在相对容器或视口中的放置位置", "Placement within a relative container or viewport.") },
  { name: "height / extensionHeight", type: "string | number", default: "auto / 48", desc: pick("主行和扩展区域高度", "Main-row and extension heights.") },
  { name: "color / elevation / border / rounded / floating", type: "mixed", default: "surface / 0 / false", desc: pick("表面、层级与内联形态", "Surface, elevation, and inline form.") }
];
const slotRows = () => ["prepend", "title", "default", "append", "extension", "background"].map((name) => ({ name, desc: pick(`${name} 内容区域`, `${name} content region.`) }));
const compactCode = `<elf-toolbar density="compact" title="Visual console" border>
  <elf-button slot="append" circle variant="text">Search</elf-button>
</elf-toolbar>`;
const collapseCode = `<elf-toolbar :collapsed="collapsed" collapse-position="end" collapse-width="124">...</elf-toolbar>`;
const imageCode = `<elf-toolbar image="/coast.jpg" title="Coastal library" extension-height="44">...</elf-toolbar>`;
const locationCode = `<div class="relative">
  <elf-toolbar absolute floating location="bottom-end">...</elf-toolbar>
</div>`;

defineStyle(articleStyles, `
  .demo-toolbar { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; }
  .toolbar-stage { display: grid; width: min(860px, 100%); gap: 18px; padding: 26px; background: var(--elf-bg-default); }
  .canvas { min-height: 240px; border: 1px solid var(--elf-border); border-radius: 8px; background: var(--elf-bg-paper); box-shadow: var(--elf-shadow-1); }
  .canvas-copy { padding: 22px 24px; color: var(--elf-text-secondary); font-size: 13px; }
  .canvas-copy strong { display: block; margin-bottom: 6px; color: var(--elf-text-primary); font-size: 18px; }
  .collapse-stage { display: grid; width: min(760px, 100%); min-height: 240px; place-items: start center; padding: 30px; background: color-mix(in srgb, var(--elf-primary) 5%, var(--elf-bg-default)); }
  .collapse-stage elf-toolbar { max-width: 560px; }
  .collapse-controls { display: flex; flex-wrap: wrap; justify-content: center; gap: 8px; margin-top: 112px; }
  .image-stage { width: min(860px, 100%); min-height: 280px; overflow: hidden; border-radius: 8px; background: var(--elf-bg-default); box-shadow: var(--elf-shadow-1); }
  .image-stage elf-toolbar { --_toolbar-color: #f8fbff; }
  .image-content { min-height: 190px; padding: 26px; background: linear-gradient(180deg, color-mix(in srgb, var(--elf-primary) 4%, var(--elf-bg-paper)), var(--elf-bg-paper)); }
  .image-content p { max-width: 48ch; margin: 0; color: var(--elf-text-secondary); line-height: 1.65; }
  .toolbar-tabs { display: flex; height: 100%; align-items: center; gap: 26px; color: inherit; font-size: 12px; font-weight: 700; }
  .toolbar-tabs span:first-child { border-bottom: 2px solid currentColor; }
  .position-stage { position: relative; width: min(860px, 100%); min-height: 330px; overflow: hidden; border: 1px solid var(--elf-border); border-radius: 8px; background: var(--elf-bg-default); }
  .position-stage::before { position: absolute; inset: 50% 0 auto; height: 1px; background: var(--elf-divider); content: ""; }
  .position-stage::after { position: absolute; inset: 0 auto 0 50%; width: 1px; background: var(--elf-divider); content: ""; }
  .position-stage elf-toolbar { z-index: 1; }
  .position-controls { position: absolute; z-index: 2; top: 50%; left: 50%; display: grid; grid-template-columns: repeat(2, minmax(110px, 1fr)); gap: 8px; transform: translate(-50%, -50%); }
  .action-readout { margin: 0; color: var(--elf-text-secondary); font-size: 12px; text-align: right; }
  @media (max-width: 560px) {
    .toolbar-stage { padding: 16px; }
    .collapse-stage { padding: 20px 12px; }
    .position-controls { grid-template-columns: 1fr; }
    .position-stage { min-height: 380px; }
  }
`);

const PageToolbar = defineHtml(`
  <elf-container class="docs-article">
    <span class="docs-kicker">${t("kicker")}</span>
    <h1>${t("title")}</h1>
    <p class="page-lead">${t("description")}</p>

    <elf-playground :title=${t("compact")} :code=${compactCode}>
      <elf-theme-provider :theme=${demoTheme()}><div class="toolbar-stage"><div class="demo-toolbar"><elf-button size="sm" variant="outlined" @click=${toggleTheme}>${t("toggleTheme")}</elf-button><elf-button size="sm" @click=${toggleDensity}>${t("toggleDensity")}</elf-button></div><div class="canvas"><elf-toolbar :density=${density.value} :title=${t("photos")} border><elf-button slot="prepend" circle variant="text" :aria-label=${t("back")} @click=${onBack}>←</elf-button><elf-button slot="append" circle variant="text" :aria-label=${t("search")} @click=${onSearch}>⌕</elf-button><elf-button slot="append" circle variant="text" :aria-label=${t("filter")} @click=${onFilter}>≡</elf-button><elf-button slot="append" circle variant="text" :aria-label=${t("more")} @click=${onMore}>⋮</elf-button></elf-toolbar><div class="canvas-copy"><strong>${t("library")}</strong>${t("description")}</div></div><p class="action-readout">${t("action")}: ${lastAction.value || t("none")}</p></div></elf-theme-provider>
    </elf-playground>

    <elf-playground :title=${t("collapse")} :code=${collapseCode}>
      <div class="toolbar-stage"><div class="demo-toolbar"><elf-button size="sm" @click=${toggleCollapse}>${t("toggleCollapse")}</elf-button><elf-button size="sm" :variant=${collapsePosition.value === "start" ? "contained" : "outlined"} @click=${keepStart}>${t("start")}</elf-button><elf-button size="sm" :variant=${collapsePosition.value === "end" ? "contained" : "outlined"} @click=${keepEnd}>${t("end")}</elf-button></div><div class="collapse-stage"><elf-toolbar rounded elevation="4" :collapsed=${collapsed.value} :collapsePosition.prop=${collapsePosition.value} collapse-width="124" :title=${t("photos")}><elf-button slot="prepend" circle variant="text" :aria-label=${t("search")} @click=${onSearch}>⌕</elf-button><elf-button slot="append" circle variant="text" :aria-label=${t("more")} @click=${onMore}>⋮</elf-button></elf-toolbar><div class="collapse-controls"><span>${collapsed.value ? t("collapse") : t("photos")}</span></div></div></div>
    </elf-playground>

    <elf-playground :title=${t("image")} :code=${imageCode}>
      <div class="image-stage"><elf-toolbar :title=${t("library")} color="#173e6c" image="https://picsum.photos/seed/elfui-toolbar-sea/1400/320" image-position="center 46%" extension-height="44"><elf-button slot="prepend" circle variant="text" dark :aria-label=${t("menu")} @click=${onMenu}>☰</elf-button><elf-button slot="append" circle variant="text" dark :aria-label=${t("signOut")} @click=${onSignOut}>↗</elf-button><nav class="toolbar-tabs" slot="extension"><span>${t("all")}</span><span>${t("favorites")}</span><span>${t("shared")}</span></nav></elf-toolbar><div class="image-content"><p>${t("description")}</p></div></div>
    </elf-playground>

    <elf-playground :title=${t("location")} :code=${locationCode}>
      <div class="position-stage"><elf-toolbar absolute floating rounded elevation="2" :location.prop=${location.value} :title=${t("photos")}><elf-button slot="prepend" circle variant="text" @click=${onMenu}>☰</elf-button><elf-button slot="append" circle variant="text" @click=${onMore}>⋮</elf-button></elf-toolbar><div class="position-controls"><elf-button size="sm" variant="outlined" @click=${setTopStart}>${t("topStart")}</elf-button><elf-button size="sm" variant="outlined" @click=${setTopEnd}>${t("topEnd")}</elf-button><elf-button size="sm" variant="outlined" @click=${setBottomStart}>${t("bottomStart")}</elf-button><elf-button size="sm" variant="outlined" @click=${setBottomEnd}>${t("bottomEnd")}</elf-button></div></div>
    </elf-playground>

    <section class="docs-section"><h2>${t("api")}</h2><elf-props-table title="Props" :rows=${propsRows()} /><elf-props-table :title=${t("slots")} :rows=${slotRows()} /></section>
  </elf-container>
`);

export { PageToolbar };
