import { defineHtml, defineStyle, useRef } from "@elfui/core";
import {
  mdiAccountCircleOutline,
  mdiDotsVertical,
  mdiHeartOutline,
  mdiMagnify,
  mdiMenu,
} from "@mdi/js";

import { createSvgIconSet } from "@elfui/kit";
import { createDocsPicker, createDocsTranslator } from "../../docsLocale";
import articleStyles from "../../shared/article.scss?inline";

const t = createDocsTranslator({
  kicker: { zh: "导航组件", en: "Navigation" },
  title: { zh: "应用栏", en: "App bar" },
  description: {
    zh: "承载应用级导航、上下文标题和全局动作，并支持图片、突出密度与滚动响应。",
    en: "Carry application navigation, contextual titles, and global actions with imagery, prominent density, and scroll response.",
  },
  scrollLab: { zh: "滚动行为", en: "Scroll behavior" },
  scrollDesc: {
    zh: "在预览区内滚动，观察应用栏折叠、抬升、隐藏和图片淡出。",
    en: "Scroll inside the preview to inspect collapse, elevation, hiding, and image fading.",
  },
  hide: { zh: "向下滚动隐藏", en: "Hide on downward scroll" },
  collapse: { zh: "越过阈值折叠", en: "Collapse past threshold" },
  elevate: { zh: "滚动后抬升", en: "Elevate after scrolling" },
  fade: { zh: "淡出背景图", en: "Fade background image" },
  inverted: { zh: "反转隐藏方向", en: "Invert hide direction" },
  threshold: { zh: "触发阈值", en: "Scroll threshold" },
  densities: { zh: "密度", en: "Density" },
  densityDefault: { zh: "默认", en: "Default" },
  densityComfortable: { zh: "舒适", en: "Comfortable" },
  densityCompact: { zh: "紧凑", en: "Compact" },
  images: { zh: "图片", en: "Images" },
  prominent: { zh: "突出模式", en: "Prominent" },
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
  api: { zh: "API", en: "API" },
  slots: { zh: "插槽", en: "Slots" },
});
const pick = createDocsPicker();

const hide = useRef(false);
const collapse = useRef(true);
const elevate = useRef(true);
const fade = useRef(true);
const inverted = useRef(false);
const threshold = useRef(88);
const density = useRef("default");
const lastAction = useRef("");

const appBarIconOptions = {
  defaultSet: "mdi",
  sets: {
    mdi: createSvgIconSet({
      menu: mdiMenu,
      search: mdiMagnify,
      account: mdiAccountCircleOutline,
      favorite: mdiHeartOutline,
      more: mdiDotsVertical,
    }),
  },
};
const switchValue = (event: Event): boolean => Boolean((event as CustomEvent).detail);
const onHide = (event: Event): void => hide.set(switchValue(event));
const onCollapse = (event: Event): void => collapse.set(switchValue(event));
const onElevate = (event: Event): void => elevate.set(switchValue(event));
const onFade = (event: Event): void => fade.set(switchValue(event));
const onInverted = (event: Event): void => inverted.set(switchValue(event));
const onThreshold = (event: Event): void => threshold.set(Number((event as CustomEvent).detail));
const onDensity = (event: Event): void => {
  const next = String((event as CustomEvent).detail || "");
  if (next === "default" || next === "comfortable" || next === "compact") density.set(next);
};
const densityOptions = (): Array<{ label: string; value: string }> => [
  { label: t("densityDefault"), value: "default" },
  { label: t("densityComfortable"), value: "comfortable" },
  { label: t("densityCompact"), value: "compact" },
];
const densityMeta = (): string => {
  if (density.value === "comfortable") return `${t("densityComfortable")} · 56px`;
  if (density.value === "compact") return `${t("densityCompact")} · 48px`;
  return `${t("densityDefault")} · 64px`;
};
const behavior = (): string =>
  [
    hide.value && "hide",
    collapse.value && "collapse",
    elevate.value && "elevate",
    fade.value && "fade-image",
    inverted.value && "inverted",
  ]
    .filter(Boolean)
    .join(" ");
const action = (value: string): void => lastAction.set(value);
const onMenu = (): void => action(t("menu"));
const onSearch = (): void => action(t("search"));
const onFavorite = (): void => action(t("favorite"));
const onMore = (): void => action(t("more"));

const propsRows = () => [
  {
    name: "title",
    type: "string",
    default: "''",
    desc: pick("标题和无障碍名称", "Title and accessible name."),
  },
  {
    name: "ariaLabel",
    type: "string",
    default: "Application bar",
    desc: pick("标题和无障碍名称", "Title and accessible name."),
  },
  {
    name: "density",
    type: "default | comfortable | compact | prominent",
    default: "default",
    desc: pick("64、56、48 或 128px 主行", "64, 56, 48, or 128px main row."),
  },
  {
    name: "image",
    type: "string",
    default: "''",
    desc: pick("背景图片及替代文本", "Background image and alternative text."),
  },
  {
    name: "imageAlt",
    type: "string",
    default: "''",
    desc: pick("背景图片及替代文本", "Background image and alternative text."),
  },
  {
    name: "imagePosition",
    type: "string",
    default: "center",
    desc: pick("图片构图位置与透明度", "Image framing and opacity."),
  },
  {
    name: "imageOpacity",
    type: "number",
    default: "1",
    desc: pick("图片构图位置与透明度", "Image framing and opacity."),
  },
  {
    name: "scrollBehavior",
    type: "token string",
    default: "''",
    desc: pick(
      "hide、collapse、elevate、fade-image、inverted 可组合",
      "Composable hide, collapse, elevate, fade-image, and inverted tokens.",
    ),
  },
  {
    name: "scrollTarget",
    type: "target",
    default: "window",
    desc: pick("滚动容器和触发距离", "Scroll container and activation distance."),
  },
  {
    name: "scrollThreshold",
    type: "number",
    default: "300",
    desc: pick("滚动容器和触发距离", "Scroll container and activation distance."),
  },
  {
    name: "color",
    type: "string",
    default: "surface",
    desc: pick("主题表面与阴影层级", "Theme surface and elevation."),
  },
  {
    name: "elevation",
    type: "number",
    default: "0",
    desc: pick("主题表面与阴影层级", "Theme surface and elevation."),
  },
  {
    name: "height",
    type: "string | number",
    default: "auto",
    desc: pick("主行和扩展区高度", "Main-row and extension heights."),
  },
  {
    name: "extensionHeight",
    type: "string | number",
    default: "48",
    desc: pick("主行和扩展区高度", "Main-row and extension heights."),
  },
  {
    name: "border",
    type: "boolean",
    default: "false",
    desc: pick("表面、定位与显式折叠状态", "Surface, positioning, and explicit collapse states."),
  },
  {
    name: "rounded",
    type: "boolean",
    default: "false",
    desc: pick("表面、定位与显式折叠状态", "Surface, positioning, and explicit collapse states."),
  },
  {
    name: "fixed",
    type: "boolean",
    default: "false",
    desc: pick("表面、定位与显式折叠状态", "Surface, positioning, and explicit collapse states."),
  },
  {
    name: "sticky",
    type: "boolean",
    default: "false",
    desc: pick("表面、定位与显式折叠状态", "Surface, positioning, and explicit collapse states."),
  },
  {
    name: "collapsed",
    type: "boolean",
    default: "false",
    desc: pick("表面、定位与显式折叠状态", "Surface, positioning, and explicit collapse states."),
  },
];
const eventRows = () => [
  {
    name: "scroll",
    type: "[position, direction]",
    desc: pick("滚动位置或方向变化时触发", "Fires when scroll position or direction changes."),
  },
];
const slotRows = () =>
  ["prepend", "title", "default", "append", "extension", "background"].map((name) => ({
    name,
    desc: pick(`${name} 内容区域`, `${name} content region.`),
  }));

const scrollCode = `<elf-app-bar
  density="prominent"
  image="/coast.jpg"
  scroll-behavior="collapse elevate fade-image"
  scroll-target="#preview"
  scroll-threshold="88"
  sticky
/>`;
const imageCode = `<elf-app-bar image="/architecture.jpg" image-position="center 38%">
  <elf-button slot="prepend" circle variant="text">Menu</elf-button>
  <elf-button slot="append" circle variant="text">Favorite</elf-button>
</elf-app-bar>`;
const densityCode = `<elf-segmented
  size="sm"
  :options.prop="densityOptions"
  :model-value.prop="density"
  @update:model-value="onDensity"
/>
<elf-app-bar :density.prop="density" title="Photos" border>
  <elf-button slot="prepend" circle variant="text">Menu</elf-button>
  <elf-button slot="append" circle variant="text">More</elf-button>
</elf-app-bar>`;
const prominentCode = `<elf-app-bar density="prominent" color="secondary" title="Visual archive">
  <elf-button slot="prepend" circle variant="text">Menu</elf-button>
  <elf-button slot="append" circle variant="text">More</elf-button>
</elf-app-bar>`;

defineStyle(
  articleStyles,
  `
  .demo-toolbar {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px;
  }

  .demo-stack {
    display: grid;
    width: 100%;
    gap: 12px;
  }

  .lab {
    display: grid;
    width: min(760px, 100%);
    overflow: hidden;
    border: 1px solid var(--elf-border);
    border-radius: 8px;
    background: var(--elf-bg-default);
  }

  .scroll-stage {
    min-width: 0;
    height: 390px;
    overflow: auto;
    background: var(--elf-bg-default);
    scrollbar-color: color-mix(in srgb, var(--elf-text-secondary) 36%, transparent) transparent;
    scrollbar-width: thin;
  }

  .scroll-stage::-webkit-scrollbar {
    width: 10px;
    height: 10px;
  }

  .scroll-stage::-webkit-scrollbar-thumb {
    border: 3px solid transparent;
    border-radius: 999px;
    background: color-mix(in srgb, var(--elf-text-secondary) 42%, transparent);
    background-clip: padding-box;
  }

  .scroll-stage elf-app-bar {
    z-index: 2;
    --_app-bar-color: var(--elf-text-on-primary);
  }

  .scroll-content {
    display: grid;
    align-content: start;
    gap: 14px;
    min-height: 680px;
    padding: 22px;
    background: color-mix(in srgb, var(--elf-bg-default) 96%, var(--elf-primary) 4%);
  }

  .scroll-intro {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    color: var(--elf-text-secondary);
    font-size: 13px;
  }

  .content-row {
    display: grid;
    grid-template-columns: 48px minmax(0, 1fr);
    align-items: center;
    gap: 14px;
    padding: 16px;
    border: 1px solid color-mix(in srgb, var(--elf-primary) 12%, var(--elf-border));
    border-radius: 8px;
    background: color-mix(in srgb, var(--elf-bg-paper) 96%, var(--elf-primary) 4%);
    box-shadow: 0 8px 22px color-mix(in srgb, var(--elf-text-primary) 6%, transparent);
    transition:
      border-color var(--elf-transition-fast),
      transform var(--elf-transition-fast),
      box-shadow var(--elf-transition-fast);
  }

  .content-row:hover {
    border-color: color-mix(in srgb, var(--elf-primary) 36%, var(--elf-border));
    box-shadow: 0 12px 26px color-mix(in srgb, var(--elf-primary) 10%, transparent);
    transform: translateY(-2px);
  }

  .content-index {
    display: grid;
    justify-self: center;
    width: 36px;
    height: 36px;
    place-items: center;
    border: 1px solid color-mix(in srgb, var(--elf-primary) 24%, var(--elf-border));
    border-radius: 8px;
    background: color-mix(in srgb, var(--elf-primary) 10%, var(--elf-bg-paper));
    color: var(--elf-primary);
    font-weight: 700;
    line-height: 1;
  }

  .content-row > div strong,
  .content-row > div span {
    display: block;
  }

  .content-row > div span {
    margin-top: 3px;
    color: var(--elf-text-secondary);
    font-size: 12px;
  }

  .lab-controls {
    display: grid;
    align-content: start;
    gap: 14px;
  }

  .lab-controls h3 {
    margin: 0 0 2px;
    font-size: 15px;
  }

  .control-line {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    font-size: 13px;
  }

  .range-control {
    display: grid;
    gap: 10px;
    color: var(--elf-text-secondary);
    font-size: 12px;
  }

  .range-control span {
    display: flex;
    justify-content: space-between;
  }

  .image-stage {
    width: min(760px, 100%);
    overflow: hidden;
    border-radius: 8px;
    background: var(--elf-bg-default);
    box-shadow: var(--elf-shadow-1);
  }

  .image-stage elf-app-bar {
    --_app-bar-color: var(--elf-text-on-primary);
  }

  .image-body {
    display: grid;
    gap: 12px;
    padding: 18px;
  }

  .image-item {
    padding: 16px;
    border: 1px solid var(--elf-border);
    border-radius: 6px;
    background: var(--elf-bg-paper);
  }

  .image-item strong,
  .image-item span {
    display: block;
  }

  .image-item span {
    margin-top: 5px;
    color: var(--elf-text-secondary);
    font-size: 13px;
  }

  .density-stage {
    display: grid;
    width: min(720px, 100%);
    gap: 14px;
    padding: 22px;
    background: var(--elf-bg-default);
  }

  .density-label {
    margin: 0 0 5px;
    color: var(--elf-text-secondary);
    font-size: 12px;
  }

  .action-readout {
    margin: 0;
    color: var(--elf-text-secondary);
    font-size: 12px;
    text-align: right;
  }

  @media (max-width: 720px) {
    .scroll-stage {
      height: 350px;
    }
  }

  @media (max-width: 460px) {
    .scroll-content {
      padding: 16px;
    }
  }
`,
);

const PageAppBar = defineHtml(`
  <elf-container class="docs-article">
    <elf-docs-hero category="navigation" tag="AppBar" :title=${t("title")} :description=${t("description")}></elf-docs-hero>

    <elf-playground
      :title=${t("scrollLab")}
      :code=${scrollCode}
    >
      <span
        slot="status"
        role="status"
        aria-live="polite"
      >${behavior() || "default"} · ${threshold.value}px</span>
      <elf-icon-provider :options.prop=${appBarIconOptions}>
        <div class="lab">
          <div
            class="scroll-stage"
            id="app-bar-scroll-stage"
          >
            <elf-app-bar
              density="prominent"
              :title=${t("workspace")}
              color="primary"
              image="https://picsum.photos/seed/elfui-northshore/1200/420"
              image-position="center 42%"
              :scrollBehavior.prop=${behavior()}
              scroll-target="#app-bar-scroll-stage"
              :scrollThreshold.prop=${threshold.value}
              sticky
            >
              <elf-button
                slot="prepend"
                circle
                variant="text"
                :aria-label=${t("menu")}
                @click=${onMenu}
              ><elf-icon
                  name="menu"
                  size="22"
                ></elf-icon></elf-button>
              <elf-button
                slot="append"
                circle
                variant="text"
                :aria-label=${t("search")}
                @click=${onSearch}
              ><elf-icon
                  name="search"
                  size="22"
                ></elf-icon></elf-button>
              <elf-button
                slot="append"
                circle
                variant="text"
                :aria-label=${t("account")}
              ><elf-icon
                  name="account"
                  size="22"
                ></elf-icon></elf-button>
            </elf-app-bar>
            <div class="scroll-content">
              <div class="scroll-intro">
                <strong>${t("fieldNotes")}</strong><span>${t("scrollHint")}</span>
              </div>
              <div class="content-row"><span class="content-index">01</span>
                <div><strong>${t("itemOne")}</strong><span>24 JUL 2026</span>
                </div>
              </div>
              <div class="content-row"><span class="content-index">02</span>
                <div><strong>${t("itemTwo")}</strong><span>18 JUL 2026</span>
                </div>
              </div>
              <div class="content-row"><span class="content-index">03</span>
                <div><strong>${t("itemThree")}</strong><span>11 JUL 2026</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </elf-icon-provider>
      <div
        slot="controls"
        class="lab-controls"
      >
        <h3>${t("scrollDesc")}</h3>
        <elf-switch
          :label=${t("hide")}
          :modelValue.prop=${hide.value}
          @update:modelValue=${onHide}
        ></elf-switch>
        <elf-switch
          :label=${t("collapse")}
          :modelValue.prop=${collapse.value}
          @update:modelValue=${onCollapse}
        ></elf-switch>
        <elf-switch
          :label=${t("elevate")}
          :modelValue.prop=${elevate.value}
          @update:modelValue=${onElevate}
        ></elf-switch>
        <elf-switch
          :label=${t("fade")}
          :modelValue.prop=${fade.value}
          @update:modelValue=${onFade}
        ></elf-switch>
        <elf-switch
          :label=${t("inverted")}
          :modelValue.prop=${inverted.value}
          @update:modelValue=${onInverted}
        ></elf-switch>
        <label
          class="range-control"><span><b>${t("threshold")}</b><output>${threshold.value}px</output></span><elf-slider
            min="48"
            max="180"
            step="4"
            :modelValue.prop=${threshold.value}
            @update:modelValue=${onThreshold}
          ></elf-slider></label>
      </div>
    </elf-playground>

    <elf-playground
      :title=${t("densities")}
      :code=${densityCode}
    >
      <span
        slot="status"
        class="density-picker"
      ><elf-segmented
          size="sm"
          :options.prop=${densityOptions()}
          :modelValue.prop=${density.value}
          @update:modelValue=${onDensity}
          :aria-label=${t("densities")}
        ></elf-segmented></span>
      <elf-icon-provider :options.prop=${appBarIconOptions}>
        <div class="density-stage">
          <div>
            <p class="density-label">${densityMeta()}</p><elf-app-bar
              :density.prop=${density.value}
              :title=${t("photos")}
              border
            ><elf-button
                slot="prepend"
                circle
                variant="text"
              ><elf-icon
                  name="menu"
                  size="22"
                ></elf-icon></elf-button><elf-button
                slot="append"
                circle
                variant="text"
              ><elf-icon
                  name="more"
                  size="22"
                ></elf-icon></elf-button></elf-app-bar>
          </div>
        </div>
      </elf-icon-provider>
    </elf-playground>

    <elf-playground
      :title=${t("images")}
      :code=${imageCode}
    >
      <span
        slot="status"
        role="status"
        aria-live="polite"
      >${t("action")}: ${lastAction.value || t("none")}</span>
      <elf-icon-provider :options.prop=${appBarIconOptions}>
        <div class="image-stage">
          <elf-app-bar
            :title=${t("photos")}
            color="primary"
            image="https://picsum.photos/seed/elfui-architecture/1200/380"
            image-position="center 38%"
            elevation="2"
          >
            <elf-button
              slot="prepend"
              circle
              variant="text"
              :aria-label=${t("menu")}
              @click=${onMenu}
            ><elf-icon
                name="menu"
                size="22"
              ></elf-icon></elf-button>
            <elf-button
              slot="append"
              circle
              variant="text"
              :aria-label=${t("search")}
              @click=${onSearch}
            ><elf-icon
                name="search"
                size="22"
              ></elf-icon></elf-button>
            <elf-button
              slot="append"
              circle
              variant="text"
              :aria-label=${t("favorite")}
              @click=${onFavorite}
            ><elf-icon
                name="favorite"
                size="22"
              ></elf-icon></elf-button>
            <elf-button
              slot="append"
              circle
              variant="text"
              :aria-label=${t("more")}
              @click=${onMore}
            ><elf-icon
                name="more"
                size="22"
              ></elf-icon></elf-button>
          </elf-app-bar>
          <div class="image-body">
            <div class="image-item">
              <strong>${t("fieldNotes")}</strong><span>${t("itemTwo")}</span>
            </div>
          </div>
        </div>
      </elf-icon-provider>
    </elf-playground>

    <elf-playground
      :title=${t("prominent")}
      :code=${prominentCode}
    >
      <elf-icon-provider :options.prop=${appBarIconOptions}>
        <div class="image-stage">
          <elf-app-bar
            density="prominent"
            :title=${t("photos")}
            color="secondary"
            elevation="2"
          >
            <elf-button
              slot="prepend"
              circle
              variant="text"
              :aria-label=${t("menu")}
              @click=${onMenu}
            ><elf-icon
                name="menu"
                size="22"
              ></elf-icon></elf-button>
            <elf-button
              slot="append"
              circle
              variant="text"
              :aria-label=${t("search")}
              @click=${onSearch}
            ><elf-icon
                name="search"
                size="22"
              ></elf-icon></elf-button>
            <elf-button
              slot="append"
              circle
              variant="text"
              :aria-label=${t("more")}
              @click=${onMore}
            ><elf-icon
                name="more"
                size="22"
              ></elf-icon></elf-button>
          </elf-app-bar>
          <div class="image-body">
            <div class="image-item">
              <strong>${t("workspace")}</strong><span>${t("itemOne")}</span>
            </div>
          </div>
        </div>
      </elf-icon-provider>
    </elf-playground>

    <section class="docs-section">
      <elf-api-builder component="elf-app-bar" title="API"><elf-props-table role="props"
        title="Props"
        :rows=${propsRows()}
      /><elf-props-table role="events"
        title="Events"
        :rows=${eventRows()}
      /><elf-props-table role="slots"
        :title=${t("slots")}
        :rows=${slotRows()}
      />
  </elf-api-builder>
    </section>
  </elf-container>
`);

export { PageAppBar };
