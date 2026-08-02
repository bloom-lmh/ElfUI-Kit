import { defineHtml, defineStyle, useHost, useRef } from "@elfui/core";
import type { ScrollbarExpose } from "@elfui/kit-src/components/Layout/Scrollbar/types";
import { createDocsTranslator } from "../../docsLocale";
import styles from "./demo.scss?inline";

defineStyle(styles);

const t = createDocsTranslator({
  section: { zh: "基础用法", en: "Basic usage" },
  title: { zh: "容器阈值与平滑返回顶部", en: "Container threshold and smooth return" },
  visible: { zh: "按钮", en: "Button" },
  shown: { zh: "已显示", en: "visible" },
  hidden: { zh: "未显示", en: "hidden" },
  clicks: { zh: "点击", en: "Clicks" },
  top: { zh: "顶部", en: "Top" },
  topBody: {
    zh: "向下滚动此内容区，超过阈值后会出现返回顶部按钮。",
    en: "Scroll this panel until the BackTop button appears.",
  },
  content: { zh: "内容区", en: "Content" },
  contentBody: {
    zh: "组件监听的是目标容器，不会干扰整页滚动。",
    en: "The component observes this target without affecting page scrolling.",
  },
  bottom: { zh: "底部", en: "Bottom" },
  bottomBody: {
    zh: "点击按钮会派发 click，并将目标容器平滑滚动至零。",
    en: "Clicking emits click and smoothly returns the target to zero.",
  },
});

const visible = useRef(false);
const clickCount = useRef(0);
const host = useHost();

const getBasicScrollTarget = (): HTMLElement | null =>
  host.shadowRoot?.querySelector<HTMLElement & ScrollbarExpose>("#backtop-basic-scroll")?.wrapRef ??
  null;

const onVisible = (event: CustomEvent): void => visible.set(Boolean(event.detail));
const onClick = (event: CustomEvent): void => {
  if (event.detail instanceof MouseEvent) clickCount.set(clickCount.value + 1);
};

const code = `<elf-back-top
  :target.prop="getBasicScrollTarget"
  :visibility-height="120"
  bottom="72px"
  right="72px"
  @visible-change="onVisible"
  @click="onClick"
/>`;
const script = `const host = useHost();
const visible = useRef(false);
const getBasicScrollTarget = () =>
  host.shadowRoot?.querySelector("#backtop-basic-scroll")?.wrapRef ?? null;
const onVisible = (event) => visible.set(Boolean(event.detail));
const onClick = (event) => console.log(event.detail);`;

const PageBacktopEx1 = defineHtml(`
  <h2>${t("section")}</h2>
  <elf-playground :title=${t("title")} :code=${code} :script=${script}>
    <span slot="status" class="demo-state">${t("visible")}: ${visible.value ? t("shown") : t("hidden")} · ${t("clicks")}: ${clickCount.value}</span>
    <div class="backtop-demo">
      <elf-scrollbar id="backtop-basic-scroll" class="backtop-scroll" height="300px" always>
        <section class="backtop-section"><span class="backtop-section-index">01</span><div class="backtop-section-copy"><h3>${t("top")}</h3><p>${t("topBody")}</p></div></section>
        <section class="backtop-section"><span class="backtop-section-index">02</span><div class="backtop-section-copy"><h3>${t("content")}</h3><p>${t("contentBody")}</p></div></section>
        <section class="backtop-section"><span class="backtop-section-index">03</span><div class="backtop-section-copy"><h3>${t("bottom")}</h3><p>${t("bottomBody")}</p></div></section>
      </elf-scrollbar>
      <elf-back-top :target.prop=${getBasicScrollTarget} :visibility-height=${120} bottom="72px" right="72px" @visible-change=${onVisible} @click=${onClick}></elf-back-top>
    </div>
  </elf-playground>
`);

export { PageBacktopEx1 };
