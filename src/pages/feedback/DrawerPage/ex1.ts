import { defineHtml, useRef } from "@elfui/core";
import { createDocsTranslator } from "../../docsLocale";

const t = createDocsTranslator({
  directions: { zh: "弹出方向", en: "Directions" },
  right: { zh: "右侧", en: "Right" },
  left: { zh: "左侧", en: "Left" },
  top: { zh: "顶部", en: "Top" },
  bottom: { zh: "底部", en: "Bottom" },
  rightTitle: { zh: "右侧详情", en: "Right-side details" },
  rightHeading: { zh: "右侧抽屉", en: "Right drawer" },
  rightBody: { zh: "适合展示商品详情和属性设置。", en: "Useful for product details and property settings." },
  leftTitle: { zh: "左侧菜单", en: "Left-side menu" },
  leftHeading: { zh: "左侧导航", en: "Left navigation" },
  leftBody: { zh: "适合作为辅助导航面板。", en: "Useful as a secondary navigation panel." },
  topTitle: { zh: "顶部筛选", en: "Top filters" },
  topHeading: { zh: "顶部面板", en: "Top panel" },
  bottomTitle: { zh: "底部控制", en: "Bottom controls" },
  bottomHeading: { zh: "底部面板", en: "Bottom panel" },
  customSize: { zh: "自定义尺寸", en: "Custom size" },
  openWide: { zh: "打开 50% 宽抽屉", en: "Open 50% drawer" },
  wideTitle: { zh: "大幅面设置", en: "Wide settings" },
  wideHeading: { zh: "50% 屏幕宽度", en: "50% viewport width" },
});

const rightOpen = useRef(false);
const leftOpen = useRef(false);
const topOpen = useRef(false);
const bottomOpen = useRef(false);
const wideOpen = useRef(false);

const openRight = (): void => rightOpen.set(true);
const openLeft = (): void => leftOpen.set(true);
const openTop = (): void => topOpen.set(true);
const openBottom = (): void => bottomOpen.set(true);
const openWide = (): void => wideOpen.set(true);

const directionsCode = `<elf-button @click=\${openRight}>${t("right")}</elf-button>
<elf-button @click=\${openLeft}>${t("left")}</elf-button>
<elf-button @click=\${openTop}>${t("top")}</elf-button>
<elf-button @click=\${openBottom}>${t("bottom")}</elf-button>

<elf-drawer direction="rtl" v-model:open="rightOpen" title="${t("rightTitle")}">...</elf-drawer>
<elf-drawer direction="ltr" v-model:open="leftOpen" title="${t("leftTitle")}">...</elf-drawer>
<elf-drawer direction="ttb" v-model:open="topOpen" title="${t("topTitle")}">...</elf-drawer>
<elf-drawer direction="btt" v-model:open="bottomOpen" title="${t("bottomTitle")}">...</elf-drawer>`;

const directionsScript = `const rightOpen = useRef(false);
const leftOpen = useRef(false);
const topOpen = useRef(false);
const bottomOpen = useRef(false);

const openRight = () => rightOpen.set(true);
const openLeft = () => leftOpen.set(true);
const openTop = () => topOpen.set(true);
const openBottom = () => bottomOpen.set(true);`;

const sizeCode = `<elf-button @click=\${openWide}>${t("openWide")}</elf-button>
<elf-drawer size="50%" v-model:open="wideOpen" title="${t("wideTitle")}">
  <h3>${t("wideHeading")}</h3>
</elf-drawer>`;

const sizeScript = `const wideOpen = useRef(false);
const openWide = () => wideOpen.set(true);`;

const PageDrawerEx1 = defineHtml(`
  <h2>${t("directions")}</h2>
  <elf-playground :title=${t("directions")} :code=${directionsCode} :script=${directionsScript}>
    <div style="display:flex;gap:12px;flex-wrap:wrap">
      <elf-button @click=${openRight}>${t("right")} (RTL)</elf-button>
      <elf-button @click=${openLeft}>${t("left")} (LTR)</elf-button>
      <elf-button @click=${openTop}>${t("top")} (TTB)</elf-button>
      <elf-button @click=${openBottom}>${t("bottom")} (BTT)</elf-button>
    </div>
    <elf-drawer v-model:open="rightOpen" :title=${t("rightTitle")} direction="rtl">
      <div style="padding:16px"><h3>${t("rightHeading")}</h3><p>${t("rightBody")}</p></div>
    </elf-drawer>
    <elf-drawer v-model:open="leftOpen" :title=${t("leftTitle")} direction="ltr">
      <div style="padding:16px"><h3>${t("leftHeading")}</h3><p>${t("leftBody")}</p></div>
    </elf-drawer>
    <elf-drawer v-model:open="topOpen" :title=${t("topTitle")} direction="ttb" size="250px">
      <div style="padding:16px"><h3>${t("topHeading")}</h3></div>
    </elf-drawer>
    <elf-drawer v-model:open="bottomOpen" :title=${t("bottomTitle")} direction="btt" size="300px">
      <div style="padding:16px"><h3>${t("bottomHeading")}</h3></div>
    </elf-drawer>
  </elf-playground>

  <h2>${t("customSize")}</h2>
  <elf-playground :title=${t("customSize")} :code=${sizeCode} :script=${sizeScript}>
    <elf-button @click=${openWide}>${t("openWide")}</elf-button>
    <elf-drawer v-model:open="wideOpen" :title=${t("wideTitle")} size="50%">
      <div style="padding:16px"><h3>${t("wideHeading")}</h3></div>
    </elf-drawer>
  </elf-playground>
`);

export { PageDrawerEx1 };
