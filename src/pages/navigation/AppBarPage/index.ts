import { defineHtml, defineStyle, useRef } from "@elfui/core";

import { createDocsPicker, createDocsTranslator } from "../../docsLocale";
import articleStyles from "../../shared/article.scss?inline";

const t = createDocsTranslator({
  kicker: { zh: "导航组件", en: "Navigation" },
  title: { zh: "应用栏", en: "App bar" },
  description: { zh: "承载应用级导航、上下文标题和全局动作，并支持图片、突出密度与滚动响应。", en: "Carry application navigation, contextual titles, and global actions with imagery, prominent density, and scroll response." },
  scrollLab: { zh: "滚动行为实验台", en: "Scroll behavior lab" },
  scrollDesc: { zh: "在预览区内滚动，观察应用栏折叠、抬升、隐藏和图片淡出。", en: "Scroll inside the preview to inspect collapse, elevation, hiding, and image fading." },
  hide: { zh: "向下滚动隐藏", en: "Hide on downward scroll" },
  collapse: { zh: "越过阈值折叠", en: "Collapse past threshold" },
  elevate: { zh: "滚动后抬升", en: "Elevate after scrolling" },
  fade: { zh: "淡出背景图", en: "Fade background image" },
  inverted: { zh: "反转隐藏方向", en: "Invert hide direction" },
  threshold: { zh: "触发阈值", en: "Scroll threshold" },
  prominent: { zh: "突出与图片", en: "Prominent with imagery" },
  densities: { zh: "密度层级", en: "Density scale" },
  photos: { zh: "影像资料库", en: "Visual archive" },
  fieldNotes: { zh: "本周精选", en: "This week's selection" },
  workspace: { zh: "北岸工作台", en: "Northshore workspace" },
  search: { zh: "搜索", en: "Search" },
  favorite: { zh: "收藏", en: "Favorite" },
  more: { zh: "更多操作", en: "More actions" },
  menu: { zh: "打开导航", en: "Open navigation" },
  account: { zh: "账户", en: "Account" },
  scrollHint: { zh: "继续向下浏览内容", en: "Continue through the content" },
  itemOne: { zh: "研究摘要", en: "Research summary" },
  itemTwo: { zh: "现场图集", en: "Field collection" },
  itemThree: { zh: "发布检查清单", en: "Release checklist" },
  action: { zh: "最近操作", en: "Last action" },
  none: { zh: "尚未操作", en: "No action yet" },
  toggleTheme: { zh: "切换预览明暗", en: "Toggle preview theme" },
  api: { zh: "API", en: "API" },
  slots: { zh: "插槽", en: "Slots" }
});
const pick = createDocsPicker();

const dark = useRef(false);
const hide = useRef(false);
const collapse = useRef(true);
const elevate = useRef(true);
const fade = useRef(true);
const inverted = useRef(false);
const threshold = useRef(88);
const lastAction = useRef("");

const demoTheme = (): string => dark.value ? "dark" : "light";
const toggleTheme = (): void => dark.set(!dark.value);
const checked = (event: Event): boolean => (event.target as HTMLInputElement).checked;
const onHide = (event: Event): void => hide.set(checked(event));
const onCollapse = (event: Event): void => collapse.set(checked(event));
const onElevate = (event: Event): void => elevate.set(checked(event));
const onFade = (event: Event): void => fade.set(checked(event));
const onInverted = (event: Event): void => inverted.set(checked(event));
const onThreshold = (event: Event): void => threshold.set(Number((event.target as HTMLInputElement).value));
const behavior = (): string => [
  hide.value && "hide",
  collapse.value && "collapse",
  elevate.value && "elevate",
  fade.value && "fade-image",
  inverted.value && "inverted"
].filter(Boolean).join(" ");
const action = (value: string): void => lastAction.set(value);
const onMenu = (): void => action(t("menu"));
const onSearch = (): void => action(t("search"));
const onFavorite = (): void => action(t("favorite"));
const onMore = (): void => action(t("more"));

const propsRows = () => [
  { name: "title / ariaLabel", type: "string", default: "'' / Application bar", desc: pick("标题和无障碍名称", "Title and accessible name.") },
  { name: "density", type: "default | comfortable | compact | prominent", default: "default", desc: pick("64、56、48 或 128px 主行", "64, 56, 48, or 128px main row.") },
  { name: "image / imageAlt", type: "string", default: "''", desc: pick("背景图片及替代文本", "Background image and alternative text.") },
  { name: "imagePosition / imageOpacity", type: "string / number", default: "center / 1", desc: pick("图片构图位置与透明度", "Image framing and opacity.") },
  { name: "scrollBehavior", type: "token string", default: "''", desc: pick("hide、collapse、elevate、fade-image、inverted 可组合", "Composable hide, collapse, elevate, fade-image, and inverted tokens.") },
  { name: "scrollTarget / scrollThreshold", type: "target / number", default: "window / 300", desc: pick("滚动容器和触发距离", "Scroll container and activation distance.") },
  { name: "color / elevation", type: "string / number", default: "surface / 0", desc: pick("主题表面与阴影层级", "Theme surface and elevation.") },
  { name: "height / extensionHeight", type: "string | number", default: "auto / 48", desc: pick("主行和扩展区高度", "Main-row and extension heights.") },
  { name: "border / rounded / fixed / sticky / collapsed", type: "boolean", default: "false", desc: pick("表面、定位与显式折叠状态", "Surface, positioning, and explicit collapse states.") }
];
const eventRows = () => [
  { name: "scroll", type: "[position, direction]", desc: pick("滚动位置或方向变化时触发", "Fires when scroll position or direction changes.") }
];
const slotRows = () => ["prepend", "title", "default", "append", "extension", "background"].map((name) => ({
  name,
  desc: pick(`${name} 内容区域`, `${name} content region.`)
}));

const scrollCode = `<elf-app-bar
  density="prominent"
  image="/coast.jpg"
  scroll-behavior="collapse elevate fade-image"
  scroll-target="#preview"
  scroll-threshold="88"
  sticky
/>`;
const imageCode = `<elf-app-bar density="prominent" image="/architecture.jpg" image-position="center 38%">
  <elf-button slot="prepend" circle variant="text">Menu</elf-button>
  <elf-button slot="append" circle variant="text">Favorite</elf-button>
</elf-app-bar>`;
const densityCode = `<elf-app-bar density="default" title="Photos" />
<elf-app-bar density="comfortable" title="Photos" />
<elf-app-bar density="compact" title="Photos" />`;

defineStyle(articleStyles, `
  .demo-toolbar { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; }
  .demo-stack { display: grid; width: 100%; gap: 12px; }
  .lab { display: grid; width: min(900px, 100%); grid-template-columns: minmax(0, 1fr) 230px; overflow: hidden; border: 1px solid var(--elf-border); border-radius: 8px; background: var(--elf-bg-default); }
  .scroll-stage { min-width: 0; height: 390px; overflow: auto; background: var(--elf-bg-default); }
  .scroll-stage elf-app-bar { z-index: 2; --_app-bar-color: #f7fbff; }
  .scroll-content { display: grid; gap: 12px; min-height: 680px; padding: 22px; }
  .scroll-intro { display: flex; align-items: center; justify-content: space-between; gap: 12px; color: var(--elf-text-secondary); font-size: 13px; }
  .content-row { display: grid; grid-template-columns: 42px minmax(0, 1fr); align-items: center; gap: 12px; padding: 15px 0; border-bottom: 1px solid var(--elf-divider); }
  .content-index { display: grid; width: 36px; height: 36px; place-items: center; border-radius: 50%; background: color-mix(in srgb, var(--elf-primary) 12%, transparent); color: var(--elf-primary); font-weight: 700; }
  .content-row strong, .content-row span { display: block; }
  .content-row span { margin-top: 3px; color: var(--elf-text-secondary); font-size: 12px; }
  .lab-controls { display: grid; align-content: start; gap: 14px; padding: 22px 18px; border-left: 1px solid var(--elf-divider); background: var(--elf-bg-paper); }
  .lab-controls h3 { margin: 0 0 2px; font-size: 15px; }
  .control-line { display: flex; align-items: center; gap: 9px; font-size: 13px; cursor: pointer; }
  .control-line input { width: 17px; height: 17px; margin: 0; accent-color: var(--elf-primary); }
  .range-control { display: grid; gap: 7px; color: var(--elf-text-secondary); font-size: 12px; }
  .range-control span { display: flex; justify-content: space-between; }
  .range-control input { width: 100%; accent-color: var(--elf-primary); }
  .image-stage { width: min(760px, 100%); overflow: hidden; border-radius: 8px; background: var(--elf-bg-default); box-shadow: var(--elf-shadow-1); }
  .image-stage elf-app-bar { --_app-bar-color: #f7fbff; }
  .image-body { display: grid; gap: 12px; padding: 18px; }
  .image-item { padding: 16px; border: 1px solid var(--elf-border); border-radius: 6px; background: var(--elf-bg-paper); }
  .image-item strong, .image-item span { display: block; }
  .image-item span { margin-top: 5px; color: var(--elf-text-secondary); font-size: 13px; }
  .density-stage { display: grid; width: min(720px, 100%); gap: 14px; padding: 22px; background: var(--elf-bg-default); }
  .density-label { margin: 0 0 5px; color: var(--elf-text-secondary); font-size: 12px; }
  .action-readout { margin: 0; color: var(--elf-text-secondary); font-size: 12px; text-align: right; }
  @media (max-width: 720px) {
    .lab { grid-template-columns: 1fr; }
    .lab-controls { grid-template-columns: repeat(2, minmax(0, 1fr)); border-top: 1px solid var(--elf-divider); border-left: 0; }
    .lab-controls h3, .range-control { grid-column: 1 / -1; }
    .scroll-stage { height: 350px; }
  }
  @media (max-width: 460px) {
    .lab-controls { grid-template-columns: 1fr; }
    .lab-controls h3, .range-control { grid-column: auto; }
    .scroll-content { padding: 16px; }
  }
`);

const PageAppBar = defineHtml(`
  <elf-container class="docs-article">
    <span class="docs-kicker">${t("kicker")}</span>
    <h1>${t("title")}</h1>
    <p class="page-lead">${t("description")}</p>

    <elf-playground :title=${t("scrollLab")} :code=${scrollCode}>
      <elf-theme-provider :theme=${demoTheme()}>
        <div class="demo-stack"><div class="demo-toolbar"><elf-button size="sm" variant="outlined" @click=${toggleTheme}>${t("toggleTheme")}</elf-button></div><div class="lab">
          <div class="scroll-stage" id="app-bar-scroll-stage">
            <elf-app-bar
              density="prominent"
              :title=${t("workspace")}
              color="#1f3f4d"
              image="https://picsum.photos/seed/elfui-northshore/1200/420"
              image-position="center 42%"
              :scrollBehavior.prop=${behavior()}
              scroll-target="#app-bar-scroll-stage"
              :scrollThreshold.prop=${threshold.value}
              sticky
            >
              <elf-button slot="prepend" circle variant="text" dark :aria-label=${t("menu")} @click=${onMenu}>☰</elf-button>
              <elf-button slot="append" circle variant="text" dark :aria-label=${t("search")} @click=${onSearch}>⌕</elf-button>
              <elf-button slot="append" circle variant="text" dark :aria-label=${t("account")}>●</elf-button>
            </elf-app-bar>
            <div class="scroll-content">
              <div class="scroll-intro"><strong>${t("fieldNotes")}</strong><span>${t("scrollHint")}</span></div>
              <div class="content-row"><span class="content-index">01</span><div><strong>${t("itemOne")}</strong><span>24 JUL 2026</span></div></div>
              <div class="content-row"><span class="content-index">02</span><div><strong>${t("itemTwo")}</strong><span>18 JUL 2026</span></div></div>
              <div class="content-row"><span class="content-index">03</span><div><strong>${t("itemThree")}</strong><span>11 JUL 2026</span></div></div>
            </div>
          </div>
          <aside class="lab-controls">
            <h3>${t("scrollDesc")}</h3>
            <label class="control-line"><input type="checkbox" :checked=${hide.value} @change=${onHide} />${t("hide")}</label>
            <label class="control-line"><input type="checkbox" :checked=${collapse.value} @change=${onCollapse} />${t("collapse")}</label>
            <label class="control-line"><input type="checkbox" :checked=${elevate.value} @change=${onElevate} />${t("elevate")}</label>
            <label class="control-line"><input type="checkbox" :checked=${fade.value} @change=${onFade} />${t("fade")}</label>
            <label class="control-line"><input type="checkbox" :checked=${inverted.value} @change=${onInverted} />${t("inverted")}</label>
            <label class="range-control"><span><b>${t("threshold")}</b><output>${threshold.value}px</output></span><input type="range" min="48" max="180" step="4" :value=${threshold.value} @input=${onThreshold} /></label>
          </aside>
        </div></div>
      </elf-theme-provider>
    </elf-playground>

    <elf-playground :title=${t("prominent")} :code=${imageCode}>
      <div class="image-stage">
        <elf-app-bar density="prominent" :title=${t("photos")} color="#31546d" image="https://picsum.photos/seed/elfui-architecture/1200/380" image-position="center 38%" elevation="2">
          <elf-button slot="prepend" circle variant="text" dark :aria-label=${t("menu")} @click=${onMenu}>☰</elf-button>
          <elf-button slot="append" circle variant="text" dark :aria-label=${t("search")} @click=${onSearch}>⌕</elf-button>
          <elf-button slot="append" circle variant="text" dark :aria-label=${t("favorite")} @click=${onFavorite}>♥</elf-button>
          <elf-button slot="append" circle variant="text" dark :aria-label=${t("more")} @click=${onMore}>⋮</elf-button>
        </elf-app-bar>
        <div class="image-body"><div class="image-item"><strong>${t("fieldNotes")}</strong><span>${t("itemTwo")}</span></div><p class="action-readout">${t("action")}: ${lastAction.value || t("none")}</p></div>
      </div>
    </elf-playground>

    <elf-playground :title=${t("densities")} :code=${densityCode}>
      <div class="density-stage">
        <div><p class="density-label">Default · 64px</p><elf-app-bar density="default" :title=${t("photos")} border><elf-button slot="prepend" circle variant="text">☰</elf-button><elf-button slot="append" circle variant="text">⋮</elf-button></elf-app-bar></div>
        <div><p class="density-label">Comfortable · 56px</p><elf-app-bar density="comfortable" :title=${t("photos")} border><elf-button slot="prepend" circle variant="text">☰</elf-button><elf-button slot="append" circle variant="text">⋮</elf-button></elf-app-bar></div>
        <div><p class="density-label">Compact · 48px</p><elf-app-bar density="compact" :title=${t("photos")} border><elf-button slot="prepend" circle variant="text">☰</elf-button><elf-button slot="append" circle variant="text">⋮</elf-button></elf-app-bar></div>
      </div>
    </elf-playground>

    <section class="docs-section"><h2>${t("api")}</h2><elf-props-table title="Props" :rows=${propsRows()} /><elf-props-table title="Events" :rows=${eventRows()} /><elf-props-table :title=${t("slots")} :rows=${slotRows()} /></section>
  </elf-container>
`);

export { PageAppBar };
